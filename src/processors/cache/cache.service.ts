import schedule from 'node-schedule';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { RedisCacheStore } from './cache.store';
import logger from '@utils/logger';

export type CacheKey = string;
export type CacheResult<T> = Promise<T>;

// IO mode general return structure
export interface CacheIOResult<T> {
  get(): CacheResult<T>;
  update(): CacheResult<T>;
}

// Promise mode parameters
export interface CachePromiseOption<T> {
  key: CacheKey;
  promise(): CacheResult<T>;
}

// Promise & IO mode parameters
export interface CachePromiseIOOption<T> extends CachePromiseOption<T> {
  ioMode?: boolean;
}

// Interval & Timeout mode parameter (milliseconds)
export interface CacheIntervalTimeoutOption {
  error?: number;
  success?: number;
}

// Interval & Timing mode parameters (milliseconds)
export interface CacheIntervalTimingOption {
  error: number;
  schedule: any;
}

// Interval Mode parameter
export interface CacheIntervalOption<T> {
  key: CacheKey;
  promise(): CacheResult<T>;
  timeout?: CacheIntervalTimeoutOption;
  timing?: CacheIntervalTimingOption;
}

// Interval Mode return type
export type CacheIntervalResult<T> = () => CacheResult<T>;

// Interval & IO Mode parameter
export interface CacheIntervalIOOption<T> extends CacheIntervalOption<T> {
  ioMode?: boolean;
}

/**
 * @class CacheService
 * @classdesc Host cache service
 * @example CacheService.get(CacheKey).then()
 * @example CacheService.set(CacheKey).then()
 * @example CacheService.promise({ option })()
 * @example CacheService.interval({ option })()
 */
@Injectable()
export class CacheService {
  private cacheStore!: RedisCacheStore;
  private isReadied = false;

  constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
    // https://github.com/redis/node-redis#events
    this.cacheStore = cacheManager.store as RedisCacheStore;
    this.cacheStore.client.on('connect', () => {
      logger.info('[Redis]', 'connecting...');
    });
    this.cacheStore.client.on('reconnecting', () => {
      logger.warn('[Redis]', 'reconnecting...');
    });
    this.cacheStore.client.on('ready', () => {
      this.isReadied = true;
      logger.info('[Redis]', 'readied!');
    });
    this.cacheStore.client.on('end', () => {
      this.isReadied = false;
      logger.error('[Redis]', 'Client End!');
    });
    this.cacheStore.client.on('error', (error) => {
      this.isReadied = false;
      logger.error('[Redis]', `Client Error!`, error.message);
    });
    // connect
    this.cacheStore.client.connect();
  }

  public get<T>(key: CacheKey): CacheResult<T> {
    if (!this.isReadied) {
      return Promise.reject('Redis has not ready!');
    }
    return this.cacheStore.get(key);
  }

  public set(key: CacheKey, value: any, options?: { ttl: number }): CacheResult<void> {
    if (!this.isReadied) {
      return Promise.reject('Redis has not ready!');
    }
    return this.cacheStore.set(key, value, options);
  }

  /**
   * @function promise
   * @description Passive update |Two-way synchronization mode，Promise -> Redis
   * @example CacheService.promise({ key: CacheKey, promise() }) -> promise()
   * @example CacheService.promise({ key: CacheKey, promise(), ioMode: true }) -> { get: promise(), update: promise() }
   */
  promise<T>(options: CachePromiseOption<T>): CacheResult<T>;
  promise<T>(options: CachePromiseIOOption<T>): CacheIOResult<T>;
  promise(options) {
    const { key, promise, ioMode = false } = options;

    // Packaging task
    const doPromiseTask = async () => {
      const data = await promise();
      await this.set(key, data);
      return data;
    };

    // Promise Intercept mode (return dead data)
    const handlePromiseMode = async () => {
      const value = await this.get(key);
      return value !== null && value !== undefined ? value : await doPromiseTask();
    };

    // Two-way synchronization mode (return to getter and updater)
    const handleIoMode = () => ({
      get: handlePromiseMode,
      update: doPromiseTask,
    });

    return ioMode ? handleIoMode() : handlePromiseMode();
  }

  /**
   * @function interval
   * @description Timing | Timeout mode，Promise -> Task -> Redis
   * @example CacheService.interval({ key: CacheKey, promise(), timeout: {} }) -> promise()
   * @example CacheService.interval({ key: CacheKey, promise(), timing: {} }) -> promise()
   */
  public interval<T>(options: CacheIntervalOption<T>): CacheIntervalResult<T>;
  public interval<T>(options: CacheIntervalIOOption<T>): CacheIOResult<T>;
  public interval<T>(options) {
    const { key, promise, timeout, timing, ioMode = false } = options;

    // Packaging task
    const promiseTask = async (): Promise<T> => {
      const data = await promise();
      await this.set(key, data);
      return data;
    };

    // Overtime task
    if (timeout) {
      const doPromise = () => {
        promiseTask()
          .then(() => {
            setTimeout(doPromise, timeout.success);
          })
          .catch((error) => {
            const time = timeout.error || timeout.success;
            setTimeout(doPromise, time);
            logger.warn(
              '[Redis]',
              `Failed to execute overtime task,${time / 1000}s Try again later`,
              error,
            );
          });
      };
      doPromise();
    }

    // 定时任务
    if (timing) {
      const doPromise = () => {
        promiseTask()
          .then((data) => data)
          .catch((error) => {
            logger.warn(
              '[Redis]',
              `Scheduled task execution failed，${timing.error / 1000}s Try again later`,
              error,
            );
            setTimeout(doPromise, timing.error);
          });
      };
      doPromise();
      schedule.scheduleJob(timing.schedule, doPromise);
    }

    // Getter
    const getKeyCache = () => this.get(key);

    // Two-way synchronization mode (return to getter and updater)
    const handleIoMode = () => ({
      get: getKeyCache,
      update: promiseTask,
    });

    // Return to Redis getter
    return ioMode ? handleIoMode() : getKeyCache;
  }
}
