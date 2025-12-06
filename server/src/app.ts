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
import { cartControllers } from "./store/controllers/cart.controllers";
import { orderController } from "./store/controllers/order.controller";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://falful.nabinthapa99.com.np",
  "https://falfulapi.nabinthapa99.com.np",
];


app.use(
  cors({
    origin: (origin, callback) => {
      // allow REST tools like Postman (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS blocked: " + origin));
    },
    credentials: true,
  })
);
connectRedis();
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();  
});

registerRoutes(app, [ProductController, buyerController, sellerController, sellerAuthController, buyerAuthController,LogoutController,ChatControllers, cartControllers, orderController]);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
