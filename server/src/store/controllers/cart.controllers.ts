import { Request, Response } from "express";
import { Controller } from "../../common/decorators/controller.decoder";
import { Route } from "../../common/decorators/route.decoder";
import { authenticate } from "../../users/middleware/auth.middleware";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { cartServices } from "../services/cart.services";
import { send } from "process";

@Controller("/falful/cart")
export class cartControllers {
    private cartServices = new cartServices();
    @Route("post", "/add", [authenticate])
    async addToCartController(req: Request, res: Response) {
        try {
            if (!req.user) return sendError(res, StatusCodes.UNAUTHORIZED, "you are not authorized");
    
            const { productId, quantity } = req.body;
            const buyerId = req.user?.id as string;

            await this.cartServices.addToCart(buyerId, productId, quantity);
            sendSuccess(res, StatusCodes.OK, "added successfully");
        } catch (error) {
            console.log("add to cart service error:", (error as Error).message)
            sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, "internal server error")
        }
    }

    @Route("get", "/myCart", [authenticate])
    async viewMyCartController(req: Request, res:Response){
        try {
            if(!req.user) return sendError(res, StatusCodes.UNAUTHORIZED, "you arte not authorized");
             const {id} =  req.user;
             const viewMyCartResult = await this.cartServices.viewMyCart(id);
            sendSuccess(res, StatusCodes.OK, "successfully view", viewMyCartResult);
        } catch (error) {
            console.log("errro duirng view my cart:", (error as Error).message);
            sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, (error as Error).message);
        }
    }

    @Route("delete", "/:id/:qty/delete", [authenticate])
    async deleteFromCartConteroller (req:Request, res:Response){
        const cartItemId = req.params.id as string;
        const quantity =Number( req.params.qty);
        try {
            if(!req.user) return sendError(res, StatusCodes.UNAUTHORIZED, "you are not authrized");
            console.log("imte deleted");
            const result = await  this.cartServices.deleteFromCart(cartItemId, quantity);
            sendSuccess(res, StatusCodes.OK, "items is deleted successfully from cart");
        } catch (error) {
            console.log("error during delete item form cart:", (error as Error).message);
            sendError(res, StatusCodes.INTERNAL_SERVER_ERROR,  (error as Error).message)
        }
    }
}