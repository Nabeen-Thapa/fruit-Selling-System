import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../../common/utils/response.utils';
import { StatusCodes } from 'http-status-codes';
import { redisService } from '../../common/services/redis.service';
import { falfulConnection } from '../../config/dbORM.config';
import { seller } from '../models/seller.model';
import { UserSession } from '../models/userSession.model';
import { MoreThan } from 'typeorm';
import { JwtUserPayload } from '../types/auth.types';
import { User } from '../models/user.model';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Extract access token
    const token =
      req.cookies?.access_token ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Authentication token required', StatusCodes.UNAUTHORIZED);
    }

    // 2. Verify and decode token
    const jwtKey = process.env.JWT_SECRET || 'hQ7@SpU87P17rByoN8odlu$ggVO2+zieRdGASq!%UDLExA5k';
    const decoded = jwt.verify(token, jwtKey) as {
      userId: string;
      name: string;
      email: string;
      phone: string;
      role: string;
    };

    // 3. Check if token is blacklisted in Redis
    const isBlacklisted = await redisService.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new AppError('Token revoked', StatusCodes.UNAUTHORIZED);
    }

    // 4. Check seller existence
    const sellerRepo = falfulConnection.getRepository(seller);
    const sellerExist = await sellerRepo.findOne({ where: { id: decoded.userId } });

    if (!sellerExist) throw new AppError('Seller not found', StatusCodes.UNAUTHORIZED);


    // 5. Check for active session in DB
    const sessionRepo = falfulConnection.getRepository(UserSession);
    const activeSession = await sessionRepo.findOne({
      where: {
        userId: decoded.userId,
        isValid: true,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!activeSession) throw new AppError('Session expired or invalid', StatusCodes.UNAUTHORIZED);


    // 6. Validate session token matches Redis refresh token
    const storedRefreshToken = await redisService.get(`refresh_token:${decoded.userId}`);
    if (!storedRefreshToken || storedRefreshToken !== activeSession.token) {
      throw new AppError('Invalid session token', StatusCodes.UNAUTHORIZED);
    }

    // 7. Attach user to request for further access
 req.user = {
  id: decoded.userId,
  name: decoded.name,
  email: decoded.email,
  phone: decoded.phone,
  role: decoded.role,
} as unknown as User;

next();

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid or expired token',
        code: StatusCodes.UNAUTHORIZED,
      });
    }

    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Authentication failed',
      code: statusCode,
    });
  }
};
