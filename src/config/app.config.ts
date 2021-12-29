import { argv } from 'yargs';
import * as Joi from '@hapi/joi';

export const APP = {
  PORT: 8000,
  MASTER: 'QuangPN',
  NAME: 'api.application.com',
  URL: 'https://application.com',
  //   ROOT_PATH,
  DEFAULT_CACHE_TTL: 60 * 60 * 24,
};

export const CROSS_DOMAIN = {
  allowedOrigins: ['http://localhost:3000', 'https://localhost:3000'],
  allowedReferer: '',
};

export const MONGO_DB = {
  uri_local: `mongodb://127.0.0.1:${process.env.DB_PORT || '27017'}/intranet`,
  uri: 'mongodb+srv://product_2021:product2021@products2021.nhqfm.mongodb.net/intranet?retryWrites=true&w=majority',
  username: argv.DB_USERNAME || 'DB_USERNAME',
  password: argv.DB_PASSWORD || 'DB_PASSWORD',
};

export const REDIS = {
  host: argv.REDIS_HOST || 'localhost',
  port: argv.REDIS_PORT || 6379,
  username: (argv.REDIS_USERNAME || null) as string,
  password: (argv.REDIS_PASSWORD || null) as string,
};

export const AUTH = {
  expiresIn: argv.JWT_ACCESS_TOKEN_EXPIRATION_TIME || 3600,
  //   data: argv.auth_data || { user: 'root' },
  jwtTokenSecret: argv.JWT_ACCESS_TOKEN_SECRET || 'uEqxtQNNOeKVP54h',
};

export const EMAIL = {
  account: argv.EMAIL_ADDRESS || 'your email address, e.g.',
  password: argv.EMAIL_PASSWORD || 'your email password',
  from: '"intranet" <intranet.com>',
  admin: 'intranet.com',
};

export const VALIDATION_SCHEMA = {
  validationSchema: Joi.object({
    PORT: Joi.number(),
    DB_HOST_LOCAL: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.string().required(),
    DB_USERNAME: Joi.string().required().allow(''),
    DB_PASSWORD: Joi.string().required().allow(''),
    DB_DATABASE: Joi.string().required(),
    SWAGGER_PORT: Joi.string().required(),
    TRANSPORT_PORT: Joi.string().required(),
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
    JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    EMAIL_HOST: Joi.string().required(),
    EMAIL_PORT: Joi.number().required(),
    EMAIL_ADDRESS: Joi.string().required(),
    EMAIL_PASSWORD: Joi.string().required(),
    EMAIL_CONFIRMATION_URL: Joi.string().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
  }),
};
