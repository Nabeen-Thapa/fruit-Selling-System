"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const registerRoutes_1 = require("./registerRoutes");
const product_controllers_1 = require("./store/controllers/product.controllers");
const buyer_controller_1 = require("./users/controllers/buyer.controller");
const seller_controller_1 = require("./users/controllers/seller.controller");
const seller_auth_controller_1 = require("./users/controllers/seller.auth.controller");
const redis_config_1 = require("./config/redis.config");
const buyer_auth_controller_1 = require("./users/controllers/buyer.auth.controller");
const users_controller_1 = require("./common/controllers/users.controller");
const chat_controller_1 = require("./users/controllers/chat.controller");
const cart_controllers_1 = require("./store/controllers/cart.controllers");
const order_controller_1 = require("./store/controllers/order.controller");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
    "http://localhost:5173",
    "https://falful.nabinthapa99.com.np",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // allow REST tools like Postman (no origin)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("CORS blocked: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
(0, redis_config_1.connectRedis)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
(0, registerRoutes_1.registerRoutes)(app, [product_controllers_1.ProductController, buyer_controller_1.buyerController, seller_controller_1.sellerController, seller_auth_controller_1.sellerAuthController, buyer_auth_controller_1.buyerAuthController, users_controller_1.LogoutController, chat_controller_1.ChatControllers, cart_controllers_1.cartControllers, order_controller_1.orderController]);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
