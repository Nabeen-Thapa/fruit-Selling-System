import { Request, Response } from "express";
import { Controller } from "../../common/decorators/controller.decoder";
import { Route } from "../../common/decorators/route.decoder";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { sellerServices } from "../services/serller.services";
import { serllerDto } from "../dtos/seller.dot";
import { validate } from "class-validator";

@Controller("/seller")
export class sellerController {
    private newSeller = new sellerServices();
    @Route("post", "/register")
    async sellerRegisterController(req: Request, res: Response) {
        try {
            const sellerData: serllerDto = {
                ...req.body,
                role: "seller" 
            };
             const errors = await validate(sellerData);
            if (errors.length > 0) {
                const validationErrors = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints,
                }));
                return sendError(res, StatusCodes.BAD_REQUEST, validationErrors);
            }
            console.log(sellerData);
            await this.newSeller.sellerRegister(sellerData);
            sendSuccess(res, StatusCodes.OK, "successfully registered");
        } catch (error) {
            console.log("seller register controller error:", error)
            sendError(res, StatusCodes.BAD_REQUEST, "fail to register");
        }
    }

    @Route("get", "/view")
    async viewsellerController(req: Request, res: Response) {
        try {

            sendSuccess(res, StatusCodes.OK, "successfully view");
        } catch (error) {
            console.log("seller view controller error:", error)
            sendError(res, StatusCodes.BAD_REQUEST, "fail to register");
        }
    }

    @Route("get", "/delete")
    async deletesellerController(req: Request, res: Response) {
        try {

            sendSuccess(res, StatusCodes.OK, "successfully view");
        } catch (error) {
            console.log("seller delete controller error:", error)
            sendError(res, StatusCodes.BAD_REQUEST, "fail to register");
        }
    }
}