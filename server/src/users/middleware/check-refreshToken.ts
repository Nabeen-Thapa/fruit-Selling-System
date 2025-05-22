
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { verifyRefreshToken } from "../../config/jwt.config";

export async function checkRefreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return sendError(res, StatusCodes.UNAUTHORIZED, "No token found");
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    return sendSuccess(res, StatusCodes.OK, "Valid token", { sellerId: payload.userId });
  } catch (err) {
    return sendError(res, StatusCodes.UNAUTHORIZED, "Invalid token");
  }
}
