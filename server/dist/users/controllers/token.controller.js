"use strict";
// import { StatusCodes } from "http-status-codes";
// import { Route } from "../../common/decorators/route.decoder";
// import { authenticate } from "../middleware/auth.middleware";
// import { sendSuccess } from "../../common/utils/response.utils";
// export class TokenController{
//     @Route("get", "/protected", [authenticate])
// async protectedRoute(req: Request, res: Response) {
//   // Access verified seller via req.seller
//   sendSuccess(res, StatusCodes.OK, "Access granted", { user: req.seller });
// }
// @Route("post", "/refresh", [refreshAuthTokens])
// async refreshRoute(req: Request, res: Response) {
//   // New tokens available in res.locals.tokens
//   res.cookie("access_token", res.locals.tokens.accessToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     maxAge: 15 * 60 * 1000 // 15 minutes
//   });
//   sendSuccess(res, StatusCodes.OK, "Tokens refreshed");
// }
// }
