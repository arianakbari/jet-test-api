import { inject, injectable } from "inversify";
import { Redis } from "ioredis";
import "reflect-metadata";

import { EntityNotFoundInCacheException } from "#src/domain/entities/index.js";
import { ICache } from "#src/domain/boundaries/output/index.js";
import { TYPES } from "#src/domain/types.js";

@injectable()
export class CacheService implements ICache {
  constructor(@inject(TYPES.Redis) private readonly redis: Redis) {}
  async get<R>(key: string): Promise<R> {
    const result = await this.redis.get(key);

    if (!result) throw new EntityNotFoundInCacheException(`There is no record in cache for key: ${key}`);

    return JSON.parse(result) as R;
  }

  async set<T>(key: string, data: T): Promise<void> {
    await this.redis.set(key, JSON.stringify(data));
  }

  async remove(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
