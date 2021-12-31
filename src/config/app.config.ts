import { argv } from 'yargs';
import * as path from 'path';
import * as Joi from '@hapi/joi';
import * as packageJSON from '../../package.json';

const ROOT_PATH = path.join(__dirname, '..');

export const APP = {
  PORT: 8080,
  MASTER: 'QuangPN',
  NAME: 'api.application.com',
  URL: 'https://application.com',
  ROOT_PATH,
  DEFAULT_CACHE_TTL: 60 * 60 * 24,
};

export const PROJECT = {
  name: packageJSON.name,
  version: packageJSON.version,
  author: packageJSON.author,
  site: APP.URL,
};

export const CROSS_DOMAIN = {
  allowedOrigins: [`${process.env.LOCAL_HOST}`, `${process.env.LOCAL_HOST}`],
  allowedReferer: '',
};

export const MONGO_DB = {
  uri_local: `mongodb://127.0.0.1:${process.env.DB_PORT || '27017'}/api`,
  uri: argv.DB_HOST || process.env.DB_HOST,
  username: argv.DB_USERNAME || process.env.DB_USERNAME,
  password: argv.DB_PASSWORD || process.env.DB_PASSWORD,
};

export const REDIS = {
  host: argv.REDIS_HOST || process.env.REDIS_HOST,
  port: argv.REDIS_PORT || 6379,
  username: (argv.REDIS_USERNAME || null) as string,
  password: (argv.REDIS_PASSWORD || null) as string,
};

export const AUTH = {
  expiresIn: argv.JWT_ACCESS_TOKEN_EXPIRATION_TIME || 3600,
  jwtTokenSecret: argv.JWT_ACCESS_TOKEN_SECRET || process.env.JWT_ACCESS_TOKEN_SECRET,
};

export const EMAIL = {
  account: argv.EMAIL_ADDRESS || process.env.EMAIL_ADDRESS,
  password: argv.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD,
  from: process.env.EMAIL_ADDRESS,
  admin: process.env.EMAIL_ADDRESS,
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
