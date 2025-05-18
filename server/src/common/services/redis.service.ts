import { redisClient } from "../../config/redis.config";

class RedisService {
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await redisClient.setEx(key, ttl, value);
    } else {
      await redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await redisClient.get(key);
  }

  async del(key: string): Promise<void> {
    await redisClient.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await redisClient.exists(key)) === 1;
  }
}

export const redisService = new RedisService();