import { Request, Response } from "express";
import { Controller } from "../../common/decorators/controller.decoder";
import { Route } from "../../common/decorators/route.decoder";
import { authenticate } from "../../users/middleware/auth.middleware";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { cartServices } from "../services/cart.services";

@Controller("falful/cart")
export class cartControllers {
    private cartServices = new cartServices();
    @Route("post", "/add", [authenticate])
    async addToCartController(req: Request, res: Response) {
        try {
            if (!req.user) return sendError(res, StatusCodes.UNAUTHORIZED, "you are not authorized");

            const { productId, quantity } = req.body;
            const buyerId = req.user?.id;

            await this.cartServices.addToCart(buyerId, productId, quantity);
            sendSuccess(res, StatusCodes.OK, "added successfully");
        } catch (error) {
            console.log("add to cart servi e error:", (error as Error).message)
            sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, "internal server error")
        }
    }
}