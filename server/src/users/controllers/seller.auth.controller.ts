import { Request, Response } from "express";
import { Controller } from "../../common/decorators/controller.decoder";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { Route } from "../../common/decorators/route.decoder";
import { SellerAuthServices } from "../services/seller.auth.services";
import { checkRefreshToken } from "../middleware/check-refreshToken";

@Controller("/seller/auth")
export class sellerAuthController {
    @Route("get", "/check-refresh-token")
    async checkRefreshToken(req: Request, res: Response) {
        return checkRefreshToken(req, res);
    }
    protected sellerAuthServices = new SellerAuthServices();
    @Route("post", "/login")
    async sellerLoginController(req: Request, res: Response) {
        try {
            const result = await this.sellerAuthServices.sellerLogin(req.body);

            if ('isAlreadyLoggedIn' in result) {
                return sendSuccess(res, StatusCodes.CONFLICT, result.message);
            }

            // Handle LoginSuccess case
            res.cookie("refresh_token", result.refreshToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                path: "/",
            });


            sendSuccess(res, StatusCodes.OK, "Login successful", {
                user: result.user,
            });
        } catch (error) {
            console.log("seller auth login controller:", error);
            sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, (error as Error).message);
        }
    }

}