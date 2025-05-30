
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { verifyAccessToken, verifyRefreshToken } from "../../config/jwt.config";

export async function checkRefreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) return sendError(res, StatusCodes.UNAUTHORIZED, "No token found");
  
  try {
    const payload = verifyRefreshToken(refreshToken);
     if (!payload)  return sendError(res, StatusCodes.UNAUTHORIZED, "Invalid token");
    
    return sendSuccess(res, StatusCodes.OK, "Valid token", { userId: payload.userId });
  } catch (err) {
    console.error("Token verification error:", err);
    const message =
      (err as Error).name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return sendError(res, StatusCodes.UNAUTHORIZED, message);
  }
}
