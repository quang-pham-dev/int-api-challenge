import {
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_SECRET,
} from '@constants/jwt.constant';
import { USER_EXISTING_ERROR, USER_WRONG_CREDENTIALS_ERROR } from '@constants/errors.constant';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '@processors/helper/helper.service.email';
import { User } from 'modules/users/models/user.model';
import { UsersService } from 'modules/users/users.service';
import { SignUpDto } from './dtos/signup.dto';
import { IEmailConfirmPayload } from './interfaces/emailConfirm-payload.interface';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { hashPassword } from '@utils/hash.util';
import logger from '@utils/logger';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly mailService: EmailService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const userExisting = await this.usersService.findOneByEmail(signUpDto.emailAddress);
    if (userExisting) {
      throw new BadRequestException(USER_EXISTING_ERROR);
    }
    const confirmToken = this.mailService.sendVerificationLink(signUpDto.emailAddress);

    const newUser = await this.usersService.createNewUser({
      ...signUpDto,
      password: await hashPassword(signUpDto.password),
    });
    return { user: newUser, token: confirmToken };
  }

  async signIn(user: User) {
    // verify userName, Password in guards check step
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  async signOut(user: User) {
    const userSignOut = await this.usersService.removeRefreshToken(user.id);
    return { userSignOut };
  }

  async renewal(user: User) {
    const accessToken = this.generateAccessToken(user.id);
    return { accessToken };
  }

  private generateAccessToken(id: string): string {
    const payload: IJwtPayload = { id };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(JWT_ACCESS_TOKEN_SECRET),
      expiresIn: `${this.configService.get<string>(JWT_ACCESS_TOKEN_EXPIRATION_TIME)}s`,
    });
  }
  private generateRefreshToken(id: string): string {
    const payload: IJwtPayload = { id };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(JWT_REFRESH_TOKEN_SECRET),
      expiresIn: `${this.configService.get<string>(JWT_REFRESH_TOKEN_EXPIRATION_TIME)}d`,
    });
  }

  async setCurrentRefreshToken(refreshToken: string, id: string) {
    return await this.usersService.hashCurrentRefreshToken(refreshToken, id);
  }

  async verifyPayload(payload: IJwtPayload): Promise<User> {
    const user = await this.usersService.findOneById(payload.id);
    if (user) {
      return user;
    }
    throw new NotFoundException('User Not Found');
  }

  async verifyEmailPayload(payload: IEmailConfirmPayload): Promise<User> {
    const user = await this.usersService.findOneByEmail(payload.emailAddress);
    if (user) {
      return user;
    }
    throw new NotFoundException('User Not Found');
  }

  async validateUser(emailAddress: string, plainTextPassword: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(emailAddress);
    try {
      if (!user) {
        throw new UnauthorizedException(
          `Provided credentials are invalid! please recheck email and password`,
        );
      }

      if (!user.isEmailConfirmed) {
        throw new UnauthorizedException(`Pending account. Please Confirm your email.`);
      }

      await this.verifyPassword(plainTextPassword, user.password);

      return user;
    } catch (error) {
      logger.error('error', error);
      throw error;
    }
  }
  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException(USER_WRONG_CREDENTIALS_ERROR, HttpStatus.BAD_REQUEST);
    }
  }
}
