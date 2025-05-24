"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisService = void 0;
const redis_config_1 = require("../../config/redis.config");
class RedisService {
    async set(key, value, ttl) {
        if (ttl) {
            await redis_config_1.redisClient.setEx(key, ttl, value);
        }
        else {
            await redis_config_1.redisClient.set(key, value);
        }
    }
    async get(key) {
        return await redis_config_1.redisClient.get(key);
    }
    async del(key) {
        await redis_config_1.redisClient.del(key);
    }
    async exists(key) {
        return (await redis_config_1.redisClient.exists(key)) === 1;
    }
}
exports.redisService = new RedisService();
