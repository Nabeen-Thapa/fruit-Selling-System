import { Controller } from "../../common/decorators/controller.decoder";
import { OrderServices } from "../services/order.services";
import { Route } from "../../common/decorators/route.decoder";
import { Request, Response } from "express";
import { authenticate } from "../../users/middleware/auth.middleware";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { validateDto } from "../../common/utils/dtoValidateResponse.utils";
import { ordersDtos } from "../dtos/orders.dto";

@Controller("/product/order")
export class orderController {
  protected orderService = new OrderServices();

  @Route("post", "/placeorder", [authenticate])
  async placeOrderContrlller(req: Request, res: Response) {
    try {
      if (!(req as any).user) sendError(res, StatusCodes.UNAUTHORIZED, "you are not authorized");
      const buyerId = (req as any).user?.id as string;
      const orderData = req.body;
      console.log("order dat contrller:", orderData);
      const orderDtoValidate = await validateDto(ordersDtos, orderData, res);
      if (!orderDtoValidate.valid) return
      console.log("order dat contrller dto:", orderDtoValidate);

      await this.orderService.placeOrder(orderDtoValidate.data, buyerId);
      sendSuccess(res, StatusCodes.OK, "successfully ordered");
    } catch (error) {
      console.log("place order controller error:", (error as Error).message);
      return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, (error as Error).message)
    }
  }

  @Route("get", "/viewSellerOrders", [authenticate])
  async viewSellerOrdersController(req: Request, res: Response) {
    try {
      if (!(req as any).user) sendError(res, StatusCodes.UNAUTHORIZED, "you are not authorized");
      const sellerId = (req as any).user?.id as string;

    } catch (error) {
      console.log("view seller order controller error:", (error as Error).message);
      return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, (error as Error).message)
    }
  }

  @Route("get", "/viewBuyerOrders", [authenticate])
  async viewBuyerOrdersController(req: Request, res: Response) {
    try {
      if (!(req as any).user) sendError(res, StatusCodes.UNAUTHORIZED, "you are not authorized");
      const buyerId = (req as any).user?.id as string;
 
      const orders =await this.orderService.viewBuyerOrders(buyerId);
      if(orders) return sendSuccess(res, StatusCodes.OK, "your orders", orders);

    } catch (error) {
      console.log("view buyer order controller error:", (error as Error).message);
      return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, (error as Error).message)
    }
  }


  @Route("post", "/cancelorder", [authenticate])
  async cancelOrderContrlller(req: Request, res: Response) {

  }
}