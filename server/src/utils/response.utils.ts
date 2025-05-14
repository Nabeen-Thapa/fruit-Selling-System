import { Response } from "express";

export const sendSuccess = (res:Response, StatusCode:number, message: string, data?:any)=>{
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