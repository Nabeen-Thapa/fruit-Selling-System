
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { AppError, sendError, sendSuccess } from "../../common/utils/response.utils";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../../config/jwt.config";
import { falfulConnection } from "../../config/dbORM.config";
import { UserSession } from "../../users/models/userSession.model";
import { seller } from "../models/seller.model";
import { Buyer } from "../models/buyer.model";
import { TokenPayload, UserType } from "../types/auth.types";

export async function getNewAccessToken(req: Request) {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) throw new AppError("not token found", StatusCodes.UNAUTHORIZED);

  try {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) throw new AppError("Invalid token", StatusCodes.UNAUTHORIZED);

    const userSessionRepo = falfulConnection.getRepository(UserSession);
    const sellerRepo = falfulConnection.getRepository(seller);
    const buyerRepo = falfulConnection.getRepository(Buyer);

    const userRepo = payload.role === UserType.BUYER ? buyerRepo : sellerRepo;

    const refreshFromDb = await userSessionRepo.findOne({ where: { token: refreshToken } });
    if (!refreshFromDb) throw new AppError("invalid refresh token");

    //  const verifyRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    // if (!verifyRefresh) throw new AppError("token is not verify", StatusCodes.UNAUTHORIZED);

    const user = await userRepo.findOne({ where: { id: payload.userId } });
    if (!user) throw new AppError("user is not found", StatusCodes.NOT_FOUND);

    const tokenPayload: TokenPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    const updateRefreshDb =await userSessionRepo.update({ token: refreshToken }, { token: newRefreshToken });

    return { accessToken, refreshToken:newRefreshToken};
  } catch (err) {
    console.error("Token verification error:", err);
    const message =
      (err as Error).name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    throw new AppError(message, StatusCodes.UNAUTHORIZED,)
  }
}
