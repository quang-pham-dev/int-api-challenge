import lodash from 'lodash';
import { CacheOptionsFactory, Injectable } from '@nestjs/common';
import { EmailService } from '@processors/helper/helper.service.email';
import redisStore, { RedisStoreOptions, CacheStoreOptions } from './cache.store';
import * as APP_CONFIG from '@config/app.config';
import logger from '@utils/logger';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly emailService: EmailService) {}

  // Send alert email (half minute throttling)
  private sendAlarmMail = lodash.throttle((error: string) => {
    this.emailService.sendMail({
      to: APP_CONFIG.EMAIL.admin,
      subject: `${APP_CONFIG.APP.NAME} Redis An exception occurs!
      `,
      text: error,
      html: `<pre><code>${error}</code></pre>`,
    });
  }, 1000 * 30);

  // Retry strategy
  public retryStrategy(retries: number): number | Error {
    // https://github.com/redis/node-redis/blob/master/docs/client-configuration.md#reconnect-strategy
    const errorMessage = ['[Redis]', `retryStrategy！retries: ${retries}`];
    logger.error(...(errorMessage as [any]));
    this.sendAlarmMail(errorMessage.join(''));

    if (retries > 6) {
      return new Error('[Redis] The number of attempts has reached its limit!');
    }

    return Math.min(retries * 1000, 3000);
  }

  // Cache configuration
  public createCacheOptions(): CacheStoreOptions {
    // https://github.com/redis/node-redis/blob/master/docs/client-configuration.md
    const redisOptions: RedisStoreOptions = {
      socket: {
        host: APP_CONFIG.REDIS.host as string,
        port: APP_CONFIG.REDIS.port as number,
        reconnectStrategy: this.retryStrategy.bind(this),
      },
    };
    if (APP_CONFIG.REDIS.username) {
      redisOptions.username = APP_CONFIG.REDIS.username;
    }
    if (APP_CONFIG.REDIS.password) {
      redisOptions.password = APP_CONFIG.REDIS.password;
    }
    return {
      isGlobal: true,
      store: redisStore,
      redisOptions,
    };
  }
}
