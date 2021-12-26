import { HttpException, HttpStatus } from '@nestjs/common';
import * as TEXT from '@constants/text.constant';

export class HttpForbiddenError extends HttpException {
  constructor(error?: any) {
    super(error || TEXT.HTTP_PARAMS_PERMISSION_ERROR_DEFAULT, HttpStatus.FORBIDDEN);
  }
}
