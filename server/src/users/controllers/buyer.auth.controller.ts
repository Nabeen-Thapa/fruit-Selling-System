import { Request, Response } from "express";
import { Controller } from "../../common/decorators/controller.decoder";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { Route } from "../../common/decorators/route.decoder";
import { buyerDto } from "../dtos/buyer.dto";
import { buyerAuthServices } from "../services/buyer.auth.services";
import { setAuthCookies } from "../utils/authCookie.utils";
import { checkRefreshToken } from "../middleware/check-refreshToken";
import { getCurrentUser } from "../utils/getCurrentUser.utils";

@Controller("/buyer/auth")
export class buyerAuthController {
    protected buyerAuthServices = new buyerAuthServices();

    @Route("get", "/check-refresh-token")
    async checkRefreshToken(req: Request, res: Response) {
        return checkRefreshToken(req, res);
    }

    @Route("get", "/me")
    async correntUser(req: Request, res: Response) {
        return getCurrentUser(req, res);
    }
    @Route("post", "/login")
    async buyerLoginController(req: Request, res: Response) {
        try {
            const buyerData: buyerDto = req.body;
            const result = await this.buyerAuthServices.buyerLogin(buyerData);

            if ('isAlreadyLoggedIn' in result) return sendSuccess(res, StatusCodes.CONFLICT, result.message);

            setAuthCookies(res, result.accessToken, result.refreshToken);

            sendSuccess(res, StatusCodes.OK, "seccess login as buyer");
        } catch (error) {
            console.log("buyer auth login controller:", error);
            sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
        }
    }
   
}