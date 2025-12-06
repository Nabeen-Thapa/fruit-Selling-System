import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Product } from "../store/models/products.model";
import { ProductImage } from "../store/models/productImage.model";
import { seller } from "../users/models/seller.model";
import { buyer } from "../users/models/buyer.model";
import { UserSession } from "../users/models/userSession.model";
import { userChat } from "../users/models/chat.model";
import { Cart } from "../store/models/cart.model";
import { CartItem } from "../store/models/cartItems.modal";
import { Orders } from "../store/models/orders.model";
import { OrdersItems } from "../store/models/orderItems.model";
dotenv.config();

export const falfulConnection = new DataSource({
    type:"postgres",
    host : process.env.DB_HOST,
    port: 5432,
    username :process.env.DB_USERNAME,
    password : process.env.DB_PASSWORDd,
    database : process.env.DB_NAME,  
    synchronize: true,
    logging: false,
    entities : [Product, ProductImage, seller, buyer, UserSession, userChat, Cart, CartItem, Orders, OrdersItems],
})


falfulConnection.initialize()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.log("Error during Data Source initialization:", error);
  });

