import lodash from 'lodash';
import { SetMetadata, CacheKey } from '@nestjs/common';
import * as META from '@constants/meta.constant';

export interface HttpCacheOption {
  ttl?: number;
  key?: string;
}

export function HttpCache(option: HttpCacheOption): MethodDecorator;
export function HttpCache(key: string, ttl?: number): MethodDecorator;
export function HttpCache(...args) {
  const option = args[0];
  const isOption = (value): value is HttpCacheOption => lodash.isObject(value);
  const key: string = isOption(option) ? option.key : option;
  const ttl: number = isOption(option) ? option.ttl : args[1] || null;
  return (_, __, descriptor: PropertyDescriptor) => {
    if (key) {
      CacheKey(key)(descriptor.value);
      // SetMetadata(META.HTTP_CACHE_KEY_METADATA, key)(descriptor.value);
    }
    if (ttl) {
      SetMetadata(META.HTTP_CACHE_TTL_METADATA, ttl)(descriptor.value);
    }
    return descriptor;
  };
}
