import { Request, Response } from "express";
import { Controller } from "../../common/decorators/controller.decoder";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { Route } from "../../common/decorators/route.decoder";
import { SellerAuthServices } from "../services/seller.auth.services";

@Controller("/seller/auth")
export class sellerAuthController {
    protected sellerAuthServices = new SellerAuthServices();
    @Route("post", "/login")
    async sellerLoginController(req: Request, res: Response) {
        try {
            const sellerLoginData = req.body;
            const result = await this.sellerAuthServices.sellerLogin(req.body);
            
            if ('isAlreadyLoggedIn' in result) {
                return sendSuccess(res, StatusCodes.CONFLICT, result.message);
            }

            // Handle LoginSuccess case
            res.cookie("access_token", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 1000 * 60 * 15, // 15 minutes
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