import { Request, Response } from "express";
import { Controller } from "../../common/decorators/controller.decoder";
import { Route } from "../../common/decorators/route.decoder";
import { validateDto } from "../../common/utils/dtoValidateResponse.utils";
import { chatDto } from "../dtos/chat.dto";
import { chatServices } from "../services/chat.services";
import logger from "../../common/utils/logger";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { authenticate } from "../middleware/auth.middleware";

@Controller("/chat")
export class ChatControllers {
  protected chatService = new chatServices();

  @Route("post", "/store", [authenticate])
  async storeChatController(req: Request, res: Response) {
    try {

      if (!req.user) return sendError(res, StatusCodes.UNAUTHORIZED, "you are not authorized");
      
      const senderId = req.user.id;
      const chatData = {
        ...req.body, senderId
      };

      const chatValidData = await validateDto(chatDto, chatData, res);
      if (!chatValidData.valid) return;

      const chatResult = await this.chatService.storeChat(chatValidData.data);
      sendSuccess(res, StatusCodes.CREATED, "chat successfully stored", chatResult);
    } catch (error) {
      logger.error("error in chat controller", (error as Error).message);
      sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, "internal servier error");
    }
  }

  @Route("get", "/view/:receiverId", [authenticate])
  async getChatControllers(req: Request, res: Response) {
    try {
      
      if (!req.user) return sendError(res, StatusCodes.UNAUTHORIZED, "you are not authorized");

      const {receiverId} = req.params;
      const {id} = req.user;
      const getChatResult = await this.chatService.getChats(id, receiverId);
     return sendSuccess(res, StatusCodes.OK,"successfully accessed", getChatResult);
      } catch (error) {
         logger.error("error in chat controller", (error as Error).message);
      sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, "internal servier error");
    }
  }
}