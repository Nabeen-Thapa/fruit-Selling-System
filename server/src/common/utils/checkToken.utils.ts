import { Request} from "express";
import { verifyRefreshToken } from "../../config/jwt.config";

export async function checkRefreshToken(req: Request): Promise<{ userId: string }> {
  const refreshToken = req.cookies?.refresh_token;
  if (!refreshToken) throw new Error("No token found");

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) throw new Error("Invalid token");

  return payload;
}
