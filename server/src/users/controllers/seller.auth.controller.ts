import { Request, Response } from "express";
import { Controller } from "../../common/decorators/controller.decoder";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { Route } from "../../common/decorators/route.decoder";
import { SellerAuthServices } from "../services/seller.auth.services";
import { checkRefreshToken } from "../middleware/check-refreshToken";
import { getCurrentUser } from "../utils/getCurrentUser.utils";
import { setAuthCookies } from "../utils/authCookie.utils";

@Controller("/seller/auth")
export class sellerAuthController {

    @Route("get", "/check-refresh-token")
    async checkRefreshToken(req: Request, res: Response) {
        return checkRefreshToken(req, res);
    }

    @Route("get", "/me")
    async correntUser(req: Request, res: Response) {
        return getCurrentUser(req, res);
    }

    protected sellerAuthServices = new SellerAuthServices();
    @Route("post", "/login")
    async sellerLoginController(req: Request, res: Response) {
        try {
            const result = await this.sellerAuthServices.sellerLogin(req.body);

            if ('isAlreadyLoggedIn' in result) return sendSuccess(res, StatusCodes.CONFLICT, result.message);
            

            setAuthCookies(res, result.accessToken, result.refreshToken)
            sendSuccess(res, StatusCodes.OK, "Login successful", {
                user: result.user,
            });
        } catch (error) {
            console.log("seller auth login controller:", error);
            sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, (error as Error).message);
        }
    }

}