import lodash from 'lodash';
import { isDevMode } from '@environments/app.environment';
import {
  ResponseStatus,
  HttpResponseError,
  ExceptionOption,
  ResponseMessage,
} from '@interfaces/http.interface';
import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest();
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorOption: ExceptionOption = exception.getResponse() as ExceptionOption;
    const isString = (value): value is ResponseMessage => lodash.isString(value);
    const errMessage = isString(errorOption) ? errorOption : errorOption.message;
    const errorInfo = isString(errorOption) ? null : errorOption.error;
    const parentErrorInfo = errorInfo ? String(errorInfo) : null;
    const isChildrenError = errorInfo?.status && errorInfo?.message;
    const resultError = (isChildrenError && errorInfo.message) || parentErrorInfo;
    const resultStatus = isChildrenError ? errorInfo.status : status;
    const data: HttpResponseError = {
      status: ResponseStatus.Error,
      message: errMessage,
      error: resultError,
      debug: isDevMode ? exception.stack : null,
    };
    //  404
    if (status === HttpStatus.NOT_FOUND) {
      data.error = `Resource does not exist`;
      data.message = `interface ${request.method} -> ${request.url} invalid`;
    }
    return response.status(resultStatus).jsonp(data);
  }
}
