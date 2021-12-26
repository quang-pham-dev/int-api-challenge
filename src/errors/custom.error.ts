import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionOption } from '@interfaces/http.interface';

export class CustomError extends HttpException {
  constructor(options: ExceptionOption, statusCode?: HttpStatus) {
    super(options, statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
