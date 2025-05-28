import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { TokenPayload } from '../users/types/auth.types';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "Q@SpU87P17rByoN0odlu?gVO2-zieRdGAq!%UDLExA3K";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "GIKDWc4Agoi&qvZ$qem+DkSGhMG?qbM8OEuLAzV+IdYTE4";
const ACCESS_TOKEN_EXPIRY ='7d';
const REFRESH_TOKEN_EXPIRY ='7d';

export const generateAccessToken = (payload: TokenPayload): string => {
  return sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

export const verifyAccessToken = (token?: string): TokenPayload => {
  if (!token) {
    throw new Error("Access token must be provided");
  }
  return verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token?: string): TokenPayload => {
  if (!token) {
    throw new Error("Refresh token must be provided");
  }
  return verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
};
