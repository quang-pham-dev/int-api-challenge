import { getMessageFromNormalError } from '@transformers/error.transformer';
import * as APP_CONFIG from '@config/app.config';
import { Injectable } from '@nestjs/common';
import logger from '@utils/logger';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

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

  constructor() {
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
}
