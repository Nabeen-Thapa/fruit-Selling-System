import "reflect-metadata"; 
import express, { NextFunction, Request, Response } from 'express';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { registerRoutes } from "./registerRoutes";
import { ProductController } from "./store/controllers/product.controllers";
import { buyerController } from "./users/controllers/buyer.controller";
import { sellerController } from "./users/controllers/seller.controller";
import { sellerAuthController } from "./users/controllers/seller.auth.controller";
import { connectRedis } from "./config/redis.config";
import { buyerAuthController } from "./users/controllers/buyer.auth.controller";
import { LogoutController } from "./common/controllers/users.controller";
import { ChatControllers } from "./users/controllers/chat.controller";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


//  app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend port
    credentials: true,
  })
)
connectRedis();
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));



registerRoutes(app, [ProductController, buyerController, sellerController, sellerAuthController, buyerAuthController,LogoutController,ChatControllers]);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
