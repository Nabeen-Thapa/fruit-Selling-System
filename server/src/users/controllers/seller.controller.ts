import { Request, Response } from "express";
import { Controller } from "../../common/decorators/controller.decoder";
import { Route } from "../../common/decorators/route.decoder";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { sellerServices } from "../services/serller.services";
import { serllerDto } from "../dtos/seller.dot";
import { validateDto } from "../../common/utils/dtoValidateResponse.utils";

@Controller("/seller")
export class sellerController {
    private newSeller = new sellerServices();
    @Route("post", "/register")
    async sellerRegisterController(req: Request, res: Response) {
        console.log("seller controller", req.body);
        try {
            const sellerData = {
                ...req.body,
                role: "seller" 
            };
            console.log("seller controller data:", sellerData);
            const sellerDtoValidate = await validateDto(serllerDto, sellerData, res);
            if(!sellerDtoValidate.valid) return;
            console.log("seller controller 1");
            await this.newSeller.sellerRegister(sellerDtoValidate.data);
            console.log("seller controller 2");
            sendSuccess(res, StatusCodes.OK, "successfully registered");
        } catch (error) {
            console.log("seller register service error:", (error as Error).message)
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