import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../../common/utils/response.utils';
import { StatusCodes } from 'http-status-codes';
import { redisService } from '../../common/services/redis.service';
import { falfulConnection } from '../../config/dbORM.config';
import { seller } from '../models/seller.model';
import { UserSession } from '../models/userSession.model';
import { MoreThan } from 'typeorm';
import { User } from '../models/user.model';
import { Buyer } from '../models/buyer.model';
import { UserType } from '../types/auth.types';

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
    const accessKey = process.env.ACCESS_TOKEN_SECRET || "Q@SpU87P17rByoN0odlu?gVO2-zieRdGAq!%UDLExA3K";
    const decoded = jwt.verify(token, accessKey) as {
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
     const buyerRepo = falfulConnection.getRepository(Buyer);
     const userRepo = decoded.role === UserType.BUYER ? buyerRepo : sellerRepo;
    const sellerExist = await userRepo.findOne({ where: { id: decoded.userId } });

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
    // const storedRefreshToken = await redisService.get(`refresh_token:${decoded.userId}`);
    // if (!storedRefreshToken || storedRefreshToken !== activeSession.token) {
    //   throw new AppError('Invalid session token', StatusCodes.UNAUTHORIZED);
    // }

    // 7. Attach user to request for further access
    req.user = {
      id: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      phone: decoded.phone, 
      role: decoded.role,
    } as User;
    
    next();

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid or expired token',
        code: StatusCodes.UNAUTHORIZED,
      });
    }

    const statusCode = error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Authentication failed',
      code: statusCode,
    });
  }
};
