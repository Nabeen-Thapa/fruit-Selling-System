import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Product } from "../products/models/products.model";
import { ProductImage } from "../products/models/productImage.model";
import { seller } from "../users/models/seller.model";
import { buyer } from "../users/models/buyer.model";
dotenv.config();

export const falfulConnection = new DataSource({
    type:"postgres",
    host : process.env.HOST,
    port: 5432,
    username : process.env.username,
    password : process.env.password,
    database : process.env.database,
    synchronize: true,
    logging: false,
    entities : [Product, ProductImage, seller, buyer],
})


falfulConnection.initialize()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.log("Error during Data Source initialization:", error);
  });

