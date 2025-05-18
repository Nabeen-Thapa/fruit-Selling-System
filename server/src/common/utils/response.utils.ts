import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export const sendSuccess = (res: Response, StatusCode: number, message: string, data?: any) => {
  return res.status(StatusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: Response, statusCode: number, error: any) => {
  return res.status(statusCode).json({
    success: false,
    message: error?.message || "Something went wrong",
  });
};


export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message);
  }
}