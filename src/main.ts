import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import logger from '@utils/logger';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as rateLimit from 'express-rate-limit';
import { HttpExceptionFilter } from 'filters/http.exception.filter';
import * as helmet from 'helmet';
import { LoggingInterceptor } from 'interceptors/logging.interceptor';
import { TransformInterceptor } from 'interceptors/transform.interceptor';
import { ValidationPipe } from 'pipes/validation.pipe';
import 'reflect-metadata';
import * as requestIp from 'request-ip';
import { bootstrapSwagger } from 'swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 8081;

  // # Application Settings

  app.use(requestIp.mw());
  app.use(cookieParser());

  // #SECURITY
  app.enable('trust proxy');
  app.use(helmet());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 200, // limit each IP to 200 requests per windowMs
      message: 'Too many requests from this IP, please try again later',
    }),
  );
  const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Too many accounts created from this IP, please try again after an hour',
    keyGenerator: (req) => requestIp.getClientIp(req),
  });
  app.use('/auth/signup', signupLimiter);

  //#gzip
  app.use(compression());

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new TransformInterceptor(new Reflector()),
    // new ErrorInterceptor(new Reflector()),
    new LoggingInterceptor(),
  );

  // #DocumentAPI
  bootstrapSwagger(app);

  await app.listen(PORT, () => {
    logger.info('🚀📢Application is running on PORT', PORT);
  });
}
bootstrap()
  .then(() => logger.info('🚀Bootstrap', new Date().toLocaleString()))
  .catch(logger.error);
