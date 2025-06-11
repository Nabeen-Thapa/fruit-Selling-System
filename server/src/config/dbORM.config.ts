import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Product } from "../store/models/products.model";
import { ProductImage } from "../store/models/productImage.model";
import { seller } from "../users/models/seller.model";
import { buyer } from "../users/models/buyer.model";
import { UserSession } from "../users/models/userSession.model";
import { userChat } from "../users/models/chat.model";
dotenv.config();

export const falfulConnection = new DataSource({
    type:"postgres",
    host : process.env.HOST ||"localhost",
    port: 5432,
    username :"postgres",
    password : process.env.password ||"Nt@post",
    database : process.env.database,  
    synchronize: true,
    logging: false,
    entities : [Product, ProductImage, seller, buyer, UserSession, userChat],
})


falfulConnection.initialize()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.log("Error during Data Source initialization:", error);
  });

