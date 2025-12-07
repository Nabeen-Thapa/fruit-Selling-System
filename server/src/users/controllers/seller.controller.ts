import { Request, Response } from "express";
import { Controller } from "../../common/decorators/controller.decoder";
import { Route } from "../../common/decorators/route.decoder";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { sellerServices } from "../services/serller.services";
import { serllerDto } from "../dtos/seller.dot";
import { validateDto } from "../../common/utils/dtoValidateResponse.utils";
import { authenticate } from "../middleware/auth.middleware";
import { serllerUpdateDto } from "../dtos/sellerUpdate.dto";

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
            const sellerDtoValidate = await validateDto(serllerDto, sellerData, res);
            if (!sellerDtoValidate.valid) return;
            await this.sellerServices.sellerRegister(sellerDtoValidate.data);
            sendSuccess(res, StatusCodes.OK, "successfully registered");
        } catch (error) {
            console.log("seller register service error:", (error as Error).message)
            sendError(res, StatusCodes.BAD_REQUEST, "fail to register");
        }
    }

    @Route("get", "/view", [authenticate])
    async viewsellerController(req: Request, res: Response) {
        try {
            if(!(req as any).user) return sendError(res, StatusCodes.BAD_REQUEST, "bad request");
            const id = (req as any).user?.id as string;
            const sellerViewResult = await this.sellerServices.sellerView(id);
           // console.log("seller contoller",sellerViewResult);
            sendSuccess(res, StatusCodes.OK, "successfully view", sellerViewResult);
        } catch (error) {
            console.log("seller view controller error:", error)
            sendError(res, StatusCodes.BAD_REQUEST, "fail to view");
        }
    }

    @Route("put", "/update", [authenticate])
    async updateSellerController(req: Request, res: Response) {
        try {
             if(!(req as any).user) return sendError(res, StatusCodes.BAD_REQUEST, "bad request");
            const id = (req as any).user?.id as string;
            
            const sellerUpdatedData = {...req.body.updatedUser, role: "seller"}
            const updatedDataDto = await validateDto(serllerUpdateDto, sellerUpdatedData, res);
            if(!updatedDataDto.valid) return;
            await this.sellerServices.sellerUpdate(id, updatedDataDto.data);
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

    @Route("get", "/viewbuyers", [authenticate])
    async viewBuyersController(req:Request, res:Response){
        try {
            if(!(req as any).user) return sendError(res, StatusCodes.UNAUTHORIZED, "you are not authrized to view buyers")
            const viewBuyersResult = await this.sellerServices.viewBuyers();
            return sendSuccess(res, StatusCodes.OK, "seller list", viewBuyersResult);
        } catch (error) {
            console.log("error in seller controller view sellers:", (error as Error).message);
            sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, "internal server error");
        }
    }
}