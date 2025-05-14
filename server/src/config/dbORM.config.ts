import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Product } from "../products/models/products.model";
import { ProductImage } from "../products/models/productImage.model";
dotenv.config();

export const falfulConnection = new DataSource({
    type:"postgres",
    host : process.env.HOST ||"localhost",
    port: 5432,
    username :"postgres",
    password : process.env.password ||"Nt@post",
    database : process.env.database || "FalfulSystem",
    synchronize: true,
    logging: false,
    entities : [Product, ProductImage],
})


falfulConnection.initialize()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.log("Error during Data Source initialization:", error);
  });

