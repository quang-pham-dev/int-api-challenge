import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { ResponseMessage } from '@interfaces/http.interface';
import { CustomError } from '@errors/custom.error';
import * as META from '@constants/meta.constant';
import * as TEXT from '@constants/text.constant';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const call$ = next.handle();
    const target = context.getHandler();
    const statusCode = this.reflector.get<HttpStatus>(META.HTTP_ERROR_CODE, target);
    const message =
      this.reflector.get<ResponseMessage>(META.HTTP_ERROR_MESSAGE, target) ||
      TEXT.HTTP_DEFAULT_ERROR_TEXT;
    return call$.pipe(
      catchError((error) => throwError(() => new CustomError({ message, error }, statusCode))),
    );
  }
}
