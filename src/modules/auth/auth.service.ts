import { USER_EXISTING_ERROR } from '@constants/errors.constant';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '@processors/helper/helper.service.email';
import { logger } from '@typegoose/typegoose/lib/logSettings';
import { hashPassword, verifyPassword } from '@utils/hash.util';
import { User } from 'modules/users/models/user.model';
import { UsersService } from 'modules/users/users.service';
import { SignUpDto } from './dtos/signup.dto';
import { IEmailConfirmPayload } from './interfaces/emailConfirm-payload.interface';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

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
    return { newUser, token: confirmToken };
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
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
    });
  }
  private generateRefreshToken(id: string): string {
    const payload: IJwtPayload = { id };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });
  }

  async setCurrentRefreshToken(refreshToken: string, id: string) {
    return this.usersService.hashCurrentRefreshToken(refreshToken, id);
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
          `Provided credentials are invalid! please recheck email: ${emailAddress}, password: ${plainTextPassword}`,
        );
      }

      if (!user.isEmailConfirmed) {
        throw new UnauthorizedException(
          `Pending account. Please verify your email: ${user.emailAddress}`,
        );
      }

      await verifyPassword(plainTextPassword, user.password);

      return user;
    } catch (error) {
      logger.error('error', error);
      throw error;
    }
  }
}
