import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { isDevMode } from '@environments/app.environment';
import logger from '@utils/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const call$ = next.handle();
    if (!isDevMode) {
      return call$;
    }
    const request = context.switchToHttp().getRequest();
    const content = request.method + ' -> ' + request.url;
    logger.debug('+++ Received request', content);
    const now = Date.now();
    return call$.pipe(
      tap(() => logger.debug('--- Respond to the request:', content, `${Date.now() - now}ms`)),
    );
  }
}
