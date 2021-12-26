import { UnauthorizedException } from '@nestjs/common';
import { ResponseMessage } from '@interfaces/http.interface';
import * as TEXT from '@constants/text.constant';

export class HttpUnauthorizedError extends UnauthorizedException {
  constructor(message?: ResponseMessage, error?: any) {
    super(message || TEXT.HTTP_UNAUTHORIZED_TEXT_DEFAULT, error);
  }
}
