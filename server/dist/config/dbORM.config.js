"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.falfulConnection = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const products_model_1 = require("../products/models/products.model");
const productImage_model_1 = require("../products/models/productImage.model");
const seller_model_1 = require("../users/models/seller.model");
const buyer_model_1 = require("../users/models/buyer.model");
const userSession_model_1 = require("../users/models/userSession.model");
dotenv_1.default.config();
exports.falfulConnection = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.HOST || "localhost",
    port: 5432,
    username: "postgres",
    password: process.env.password || "Nt@post",
    database: process.env.database,
    synchronize: true,
    logging: false,
    entities: [products_model_1.Product, productImage_model_1.ProductImage, seller_model_1.seller, buyer_model_1.buyer, userSession_model_1.UserSession],
});
exports.falfulConnection.initialize()
    .then(() => {
    console.log("Database connected successfully!");
})
    .catch((error) => {
    console.log("Error during Data Source initialization:", error);
});
