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
const product_controllers_1 = require("./products/product.controllers");
const buyer_controller_1 = require("./users/controllers/buyer.controller");
const seller_controller_1 = require("./users/controllers/seller.controller");
const seller_auth_controller_1 = require("./users/controllers/seller.auth.controller");
const redis_config_1 = require("./config/redis.config");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
//  app.use(cors());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // frontend port
    credentials: true,
}));
(0, redis_config_1.connectRedis)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(0, registerRoutes_1.registerRoutes)(app, [product_controllers_1.ProductController, buyer_controller_1.buyerController, seller_controller_1.sellerController, seller_auth_controller_1.sellerAuthController]);
// Error handling middleware (add at the end)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
