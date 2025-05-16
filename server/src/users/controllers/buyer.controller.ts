import { Request, Response } from "express";
import { Controller } from "../../common/decorators/controller.decoder";
import { Route } from "../../common/decorators/route.decoder";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { buyerDto } from "../dtos/buyer.dto";
import { buyerServices } from "../services/buyer.services";

@Controller("/buyer")
export class buyerController{
    private buyerServices = new buyerServices();
    @Route("post", "/register")
    async buyerRegisterController(req:Request, res:Response){
        try {
            const buyerData: buyerDto = req.body;
            const newBuyer = await this.buyerServices.buyerRegister(buyerData);
            sendSuccess(res, StatusCodes.OK, "successfully registered");
        } catch (error) {
            console.log("buyer register controller error:", error)
            sendError(res, StatusCodes.BAD_REQUEST, "fail to register");
        }
    }

    @Route("get", "/view")
    async viewBuyerController(req:Request, res:Response){
         try {
            
            sendSuccess(res, StatusCodes.OK, "successfully view");
        } catch (error) {
            console.log("buyer view controller error:", error)
            sendError(res, StatusCodes.BAD_REQUEST, "fail to register");
        }
    }


     @Route("get", "/delete")
    async deleteBuyerController(req:Request, res:Response){
         try {
            
            sendSuccess(res, StatusCodes.OK, "successfully view");
        } catch (error) {
            console.log("buyer delete controller error:", error)
            sendError(res, StatusCodes.BAD_REQUEST, "fail to register");
        }
    }
}