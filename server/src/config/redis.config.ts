import { createClient } from 'redis';
import logger from '../common/utils/logger';
import dotenv from "dotenv";
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => logger.error('Redis Client Error', err));

export const connectRedis = async () => {
  await redisClient.connect();
  logger.info('Connected to Redis');
};