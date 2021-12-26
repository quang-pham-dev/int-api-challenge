import { HttpException, HttpStatus } from '@nestjs/common';
import * as TEXT from '@constants/text.constant';

export class ValidationError extends HttpException {
  constructor(error?: any) {
    super(error || TEXT.VALIDATION_ERROR_DEFAULT, HttpStatus.BAD_REQUEST);
  }
}
