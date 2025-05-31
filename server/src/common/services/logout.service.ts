import { Request, Response } from "express"
import { sendError, sendSuccess } from "../utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { clearAuthCookies } from "../../users/utils/authCookie.utils";
import { checkRefreshToken } from "../utils/checkToken.utils";

export const userLogOut = async (req: Request, res: Response) => {
    const payload = checkRefreshToken(req);
    if (!payload) return sendError(res, StatusCodes.UNAUTHORIZED, "invalid or missong token");
    try {
        clearAuthCookies(res);
    } catch (error) {
        sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, "problem in logout")
    }
}