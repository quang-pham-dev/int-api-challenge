import { Request, Response } from 'express';
import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { HttpResponseError, ResponseStatus } from '@interfaces/http.interface';
import { isProdMode } from '@environments/app.environment';
import { CROSS_DOMAIN } from '@config/app.config';
import * as TEXT from '@constants/text.constant';

/**
 * @class OriginMiddleware
 * @classdesc Used to verify whether the request is from an illegal source
 */
@Injectable()
export class OriginMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next) {
    // If it is a production environment, you need to verify the user source channel to prevent abnormal requests
    if (isProdMode) {
      const { origin, referer } = request.headers;
      const checkHeader = (field) => !field || field.includes(CROSS_DOMAIN.allowedReferer);
      const isVerifiedOrigin = checkHeader(origin);
      const isVerifiedReferer = checkHeader(referer);
      if (!isVerifiedOrigin && !isVerifiedReferer) {
        return response.status(HttpStatus.UNAUTHORIZED).jsonp({
          status: ResponseStatus.Error,
          message: TEXT.HTTP_ANONYMOUS_TEXT,
          error: null,
        } as HttpResponseError);
      }
    }

    //other traffic
    return next();
  }
}
