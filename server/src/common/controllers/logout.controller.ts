import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Controller } from "../decorators/controller.decoder";
import { Route } from "../decorators/route.decoder";
import { userLogOut } from "../services/logout.service";
import { sendError, sendSuccess } from "../utils/response.utils";

@Controller("/user")
export class LogoutController {
 @Route("get", "/logout")
  async logoutController(req: Request, res: Response) {
    try {
      await userLogOut(req, res);
      return sendSuccess(res, StatusCodes.OK, "logout success");
    } catch (error) {
      sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, (error as Error).message);
    }
  }
}
