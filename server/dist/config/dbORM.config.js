"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.falfulConnection = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const products_model_1 = require("../store/models/products.model");
const productImage_model_1 = require("../store/models/productImage.model");
const seller_model_1 = require("../users/models/seller.model");
const buyer_model_1 = require("../users/models/buyer.model");
const userSession_model_1 = require("../users/models/userSession.model");
const chat_model_1 = require("../users/models/chat.model");
const cart_model_1 = require("../store/models/cart.model");
const cartItems_modal_1 = require("../store/models/cartItems.modal");
const orders_model_1 = require("../store/models/orders.model");
const orderItems_model_1 = require("../store/models/orderItems.model");
dotenv_1.default.config();
exports.falfulConnection = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [products_model_1.Product, productImage_model_1.ProductImage, seller_model_1.seller, buyer_model_1.Buyer, userSession_model_1.UserSession, chat_model_1.userChat, cart_model_1.Cart, cartItems_modal_1.CartItem, orders_model_1.Orders, orderItems_model_1.OrdersItems],
});
exports.falfulConnection.initialize()
    .then(() => {
    console.log("Database connected successfully!");
})
    .catch((error) => {
    console.log("Error during Data Source initialization:", error);
});
