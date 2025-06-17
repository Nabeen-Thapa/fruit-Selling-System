import { Request, Response } from "express";
import { Controller } from "../../common/decorators/controller.decoder";
import { Route } from "../../common/decorators/route.decoder";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { buyerDto } from "../dtos/buyer.dto";
import { buyerServices } from "../services/buyer.services";
import { validate } from "class-validator";
import { validateDto } from "../../common/utils/dtoValidateResponse.utils";
import { authenticate } from "../middleware/auth.middleware";
import logger from "../../common/utils/logger";
import {buyerUpdateDto} from "../dtos/buyerUpdated.dto";

@Controller("/buyer")
export class buyerController {
    private buyerServices = new buyerServices();
    @Route("post", "/register")
    async buyerRegisterController(req: Request, res: Response) {
        try {
            const buyerData = {
                ...req.body,
                role: "buyer"
            };
            const buerDtoValidate = await validateDto(buyerDto, buyerData, res);
            if (!buerDtoValidate.valid) return;

            const newBuyer = await this.buyerServices.buyerRegister(buerDtoValidate.data);
            sendSuccess(res, StatusCodes.OK, "successfully registered");
        } catch (error) {
            console.log("buyer register controller error:", error)
            sendError(res, StatusCodes.BAD_REQUEST, "fail to register");
        }
    }

    // @Route("get", "/view")
    // async viewBuyerController(req: Request, res: Response) {
    //     try {

    //         sendSuccess(res, StatusCodes.OK, "successfully view");
    //     } catch (error) {
    //         console.log("buyer view controller error:", error)
    //         sendError(res, StatusCodes.BAD_REQUEST, "fail to register");
    //     }
    // }


    @Route("get", "/delete")
    async deleteBuyerController(req: Request, res: Response) {
        try {

            sendSuccess(res, StatusCodes.OK, "successfully view");
        } catch (error) {
            console.log("buyer delete controller error:", error)
            sendError(res, StatusCodes.BAD_REQUEST, "fail to register");
        }
    }
    @Route("get", "/viewData", [authenticate])
    async viewBuyerController(req: Request, res: Response) {
        try {
            if (!req.user) return sendError(res, StatusCodes.BAD_REQUEST, "bad request");
            const id = req.user?.id as string;
            const buyerViewResult = await this.buyerServices.buyerView(id);
            console.log("buyer contoller", buyerViewResult);
            sendSuccess(res, StatusCodes.OK, "successfully view", buyerViewResult);
        } catch (error) {
            console.log("buyer view controller error:", error)
            sendError(res, StatusCodes.BAD_REQUEST, "fail to view");
        }
    }

    @Route("put", "/update", [authenticate])
    async updateBuyerController(req: Request, res: Response) {
        try {
            if (!req.user) sendError(res, StatusCodes.UNAUTHORIZED, "you are not authorized");
            const id = req.user?.id as string;
            const buyerData = {
                ...req.body,
                role: "buyer"
            };
            const buyerUpdateData = await validateDto(buyerUpdateDto, buyerData, res);
            if (!buyerUpdateData.valid) return;

            const buyerUpdate = await this.buyerServices.buyerUpdate(id, buyerData)
            sendSuccess(res, StatusCodes.OK, "successfully updated");
        } catch (error) {
            console.log("seller update controller error:", (error as Error).message)
            sendError(res, StatusCodes.BAD_REQUEST, "fail to update");
        }
    }

    @Route("get", "/viewSellers")
    async viewAllSellers(req: Request, res: Response) {
        // if (!req.user) return sendError(res, StatusCodes.UNAUTHORIZED, "you are not authorized");
        try {
            const allSellers = await this.buyerServices.viewAllSellers();
            sendSuccess(res, StatusCodes.OK, "successfully accessed", allSellers);
        } catch (error) {
            logger.error("error in buyer controller:", (error as Error).message);
            sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, (error as Error).message)
        }
    }
}