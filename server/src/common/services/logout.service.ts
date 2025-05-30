import { Request, Response } from "express"
import { checkRefreshToken } from "../../users/middleware/check-refreshToken"
import { sendError, sendSuccess } from "../utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { clearAuthCookies } from "../../users/utils/authCookie.utils";

export const userLogOut = async (req: Request, res: Response) => {
    const payload = checkRefreshToken(req, res);
    if (!payload) return sendError(res, StatusCodes.UNAUTHORIZED, "invalid or missong token");
    try {
        clearAuthCookies(res);
        return sendSuccess(res, StatusCodes.OK, "Logout successful");
    } catch (error) {
        sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, "problem in logout")
    }
}