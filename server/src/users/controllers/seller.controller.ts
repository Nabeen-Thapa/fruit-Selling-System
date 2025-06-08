import { Request, Response } from "express";
import { Controller } from "../../common/decorators/controller.decoder";
import { Route } from "../../common/decorators/route.decoder";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { sellerServices } from "../services/serller.services";
import { serllerDto } from "../dtos/seller.dot";
import { validateDto } from "../../common/utils/dtoValidateResponse.utils";
import { authenticate } from "../middleware/auth.middleware";

@Controller("/seller")
export class sellerController {
    private sellerServices = new sellerServices();
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
            if (!sellerDtoValidate.valid) return;
            console.log("seller controller 1");
            await this.sellerServices.sellerRegister(sellerDtoValidate.data);
            console.log("seller controller 2");
            sendSuccess(res, StatusCodes.OK, "successfully registered");
        } catch (error) {
            console.log("seller register service error:", (error as Error).message)
            sendError(res, StatusCodes.BAD_REQUEST, "fail to register");
        }
    }

    @Route("get", "/view", [authenticate])
    async viewsellerController(req: Request, res: Response) {
        try {
            if(!req.user) return sendError(res, StatusCodes.BAD_REQUEST, "bad request");
            const id = req.user?.id as string;
            const sellerViewResult = await this.sellerServices.sellerView(id);
            console.log("seller contoller",sellerViewResult);
            sendSuccess(res, StatusCodes.OK, "successfully view", sellerViewResult);
        } catch (error) {
            console.log("seller view controller error:", error)
            sendError(res, StatusCodes.BAD_REQUEST, "fail to view");
        }
    }

    @Route("put", "/update", [authenticate])
    async updateSellerController(req: Request, res: Response) {
        try {
             if(!req.user) return sendError(res, StatusCodes.BAD_REQUEST, "bad request");
            const id = req.user?.id as string;
            await this.sellerServices.sellerUpdate(id);
            sendSuccess(res, StatusCodes.OK, "successfully updated");
        } catch (error) {
            console.log("seller update controller error:", error)
            sendError(res, StatusCodes.BAD_REQUEST, "fail to update");
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