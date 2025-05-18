import { Request, Response } from "express";
import { Controller } from "../../common/decorators/controller.decoder";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { Route } from "../../common/decorators/route.decoder";
import { buyerDto } from "../dtos/buyer.dto";

@Controller("/buyer/auth")
export class buyerAuthController{
   // protected buyerAuthServices = new buyerAuthService();
    @Route("post", "/login")
    async buyerLoginController(req:Request, res:Response){
        try {
            const buyerData: buyerDto = req.body;
           // const buyerLoginResult =await this.buyerAuthServices.BuyerAuthService(buyerData);
            sendSuccess(res, StatusCodes.OK, "seccess login");
        } catch (error) {
            console.log("buyer auth login controller:", error);
            sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
        }
    }
}