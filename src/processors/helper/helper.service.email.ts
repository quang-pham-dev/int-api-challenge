import { getMessageFromNormalError } from '@transformers/error.transformer';
import * as APP_CONFIG from '@config/app.config';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import logger from '@utils/logger';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/users.service';

export interface IEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;
  private clientIsValid: boolean;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const smtpConf = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    };
    this.transporter = createTransport(smtpConf);
    this.verifyClient();
  }

  // Verify validity
  private verifyClient(): void {
    return this.transporter.verify((error) => {
      if (error) {
        this.clientIsValid = false;
        setTimeout(this.verifyClient.bind(this), 1000 * 60 * 30);
        logger.error(
          `[NodeMailer]`,
          `📢 The client failed to initialize the connection! Will try again in half an hour`,
          getMessageFromNormalError(error),
        );
      } else {
        this.clientIsValid = true;
        logger.info('[NodeMailer]', '📢 connect successfully! Send mail at any time');
      }
    });
  }

  public sendMail(mailOptions: IEmailOptions) {
    if (!this.clientIsValid) {
      logger.warn(
        '[NodeMailer]',
        '📢 The initialization was not successful, the mail client sending was rejected!',
      );
      return false;
    }
    const options = Object.assign(mailOptions, { from: APP_CONFIG.EMAIL.from });
    this.transporter.sendMail(options, (error, info) => {
      if (error) {
        logger.error(`[NodeMailer]`, `📢 Failed to send mail`, getMessageFromNormalError(error));
      } else {
        logger.info('[NodeMailer]', '📢 Mail sent successfully', info.messageId, info.response);
      }
    });
  }
  public async decodeConfirmationToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_VERIFICATION_TOKEN_SECRET'),
      });
      if (typeof payload === 'object' && 'emailAddress' in payload) {
        return payload.emailAddress;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token', error);
    }
  }

  public async resendConfirmationLink(emailAddress: string) {
    const user = await this.usersService.findOneByEmail(emailAddress);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    this.sendVerificationLink(user.emailAddress);
  }

  public sendVerificationLink(emailAddress: string) {
    const payload = { emailAddress };

    const confirmToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get<number>('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`,
    });
    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${confirmToken}`;

    const content = `<h3>Please click below to confirm your email</h3>
                    <p><a href="${url}">Confirm</a></p>
                    <strong>If you not request this email you can safely ignore it</strong>`;
    return (
      this.sendMail({
        to: emailAddress,
        subject: '✔ Welcome! - Thank you for your registration',
        html: content,
        text: '"No reply" <api@email.com>',
      }),
      confirmToken
    );
  }

  public async confirmEmail(emailAddress: string) {
    const user = await this.usersService.findOneByEmail(emailAddress);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.usersService.markEmailAsConfirmed(emailAddress);
  }
}
