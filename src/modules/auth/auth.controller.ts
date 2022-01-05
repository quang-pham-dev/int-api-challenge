import { User } from '@modules/users/models/user.model';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { EmailService } from '@processors/helper/helper.service.email';
import { AuthService } from './auth.service';
import EmailConfirmationDto from './dtos/emailConfirmation.dto';
import EmailResendDto from './dtos/emailResend.dto';
import { LoginUserDto } from './dtos/loginUser.dto';
import { SignUpDto } from './dtos/signup.dto';
import { JwtAccessTokenGuard } from './guards/jwt-access-token.guard';
import { JwtConfirmTokenGuard } from './guards/jwt-confirm-token.guard';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  // # signup
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'User registration API',
  })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    type: User,
    description: 'Successfully Registered',
  })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiUnauthorizedResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  // # signin
  @Post('signin')
  @UseGuards(LocalAuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login API',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: User,
    description: 'User info with access token, refresh token',
  })
  async signIn(@Req() req: RequestWithUser, @Body() _signInDto: LoginUserDto) {
    const { user } = req;
    const { accessToken, refreshToken } = await this.authService.signIn(req.user);
    // TODO: set current refresh token by user ID
    await this.authService.setCurrentRefreshToken(refreshToken, user.id);
    return { user, accessToken, refreshToken };
  }

  //   # Logout
  @Post('signout')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.authService.signOut(request.user);
  }

  // # Refresh token
  @Get('renewal')
  @UseGuards(JwtRefreshTokenGuard)
  async refresh(@Req() req: RequestWithUser) {
    // const { user } = req;
    const accessToken = await this.authService.renewal(req.user);

    return accessToken;
  }

  // # Email confirmation
  @HttpCode(200)
  @Post('confirm')
  async confirm(@Body() tokenChain: EmailConfirmationDto) {
    const emailAddress = await this.emailService.decodeConfirmationToken(tokenChain.token);
    return this.emailService.confirmEmail(emailAddress);
  }

  // # Email resend token confirm
  @Post('confirm/resend')
  @UseGuards(JwtConfirmTokenGuard)
  @HttpCode(HttpStatus.OK)
  async resendConfirmationLink(
    // TODO implement getCurrentUser instead
    @Req() req: RequestWithUser,
    @Body() _confirmResendDto: EmailResendDto,
  ) {
    return await this.emailService.resendConfirmationLink(req.user.emailAddress);
  }

  // # get me
  @UseGuards(JwtAccessTokenGuard)
  @Get('me')
  getCurrentUser(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return { user };
  }
}
