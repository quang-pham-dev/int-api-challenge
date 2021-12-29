import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import logger from '@utils/logger';
import { Request, Response } from 'express';
import * as _ from 'lodash';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = exception.message || null;
    message = _.isString(message) ? message || 'Request failed' : JSON.stringify(message);
    logger.warn(`${request.url} Exception information:${JSON.stringify(exception)}`);

    response.status(status).json({
      message,
      statusCode: status,
      method: request.method,
      path: request.url,
      timestamp: new Date().toLocaleTimeString(),
    });
  }
}
