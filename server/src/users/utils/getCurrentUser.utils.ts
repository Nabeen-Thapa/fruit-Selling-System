import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { verifyAccessToken } from "../../config/jwt.config";

export async function getCurrentUser(req: Request, res: Response) {
  const accessToken = req.cookies?.access_token;  // safe optional chaining

  if (!accessToken) {
    return sendError(res, 401, "Access token must be provided");
  }

  try {
    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      return sendError(res, 401, "Unauthorized");
    }

    return sendSuccess(res, 200, "User authenticated", { 
      userId: payload.userId, 
      role: payload.role, 
      name: payload.name, 
      email: payload.email,
      phone: payload.phone 
    });
  } catch (error) {
    return sendError(res, 401, "Invalid or expired token");
  }
}
