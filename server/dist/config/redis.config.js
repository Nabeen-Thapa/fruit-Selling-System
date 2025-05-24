"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const logger_1 = __importDefault(require("../common/utils/logger"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
exports.redisClient = (0, redis_1.createClient)({ url: REDIS_URL });
exports.redisClient.on('error', (err) => logger_1.default.error('Redis Client Error', err));
const connectRedis = async () => {
    await exports.redisClient.connect();
    logger_1.default.info('Connected to Redis');
};
exports.connectRedis = connectRedis;
