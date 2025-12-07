"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartServices = void 0;
const dbORM_config_1 = require("../../config/dbORM.config");
const buyer_model_1 = require("../../users/models/buyer.model");
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const products_model_1 = require("../models/products.model");
const cart_model_1 = require("../models/cart.model");
const cartItems_modal_1 = require("../models/cartItems.modal");
class cartServices {
    buyerRepo = dbORM_config_1.falfulConnection.getRepository(buyer_model_1.Buyer);
    productRepo = dbORM_config_1.falfulConnection.getRepository(products_model_1.Product);
    cartRepo = dbORM_config_1.falfulConnection.getRepository(cart_model_1.Cart);
    cartItemRepo = dbORM_config_1.falfulConnection.getRepository(cartItems_modal_1.CartItem);
    async addToCart(buyerId, productId, quantity) {
        try {
            const buyer = await this.buyerRepo.findOne({ where: { id: buyerId } });
            if (!buyer)
                throw new response_utils_1.AppError("buyer is not found", http_status_codes_1.StatusCodes.UNAUTHORIZED);
            const product = await this.productRepo.findOne({ where: { id: productId } });
            if (!product)
                throw new response_utils_1.AppError("product is not found", http_status_codes_1.StatusCodes.UNAUTHORIZED);
            //decrease quantity of product by add to cart quantity
            const newQuantity = product.quantity - quantity;
            let buyerCart = await this.cartRepo.findOne({
                where: { buyers: { id: buyerId } },
                relations: ['items', 'items.product', 'buyers'],
            });
            if (!buyerCart) {
                buyerCart = new cart_model_1.Cart();
                buyerCart.buyers = buyer;
                buyerCart.items = [];
                buyerCart.totalAmount = 0;
                buyerCart.finalAmount = 0;
            }
            let cartItem = buyerCart.items.find(item => item.product.id === productId);
            if (cartItem) {
                cartItem.quantity += quantity;
                cartItem.totalPrice = cartItem.quantity * cartItem.price;
            }
            else {
                cartItem = new cartItems_modal_1.CartItem();
                cartItem.carts = buyerCart;
                cartItem.product = product;
                cartItem.quantity = quantity;
                cartItem.price = product.price;
                cartItem.totalPrice = quantity * product.price;
                buyerCart.items.push(cartItem);
            }
            buyerCart.totalAmount = Number(buyerCart.items.reduce((sum, item) => sum + (item.totalPrice), 0));
            await dbORM_config_1.falfulConnection.transaction(async (manager) => {
                await manager.getRepository(cartItems_modal_1.CartItem).save(cartItem);
                await manager.getRepository(cart_model_1.Cart).save(buyerCart);
                await manager.getRepository(products_model_1.Product).update({ id: productId }, { quantity: newQuantity });
            });
            return {
                message: "Product added to cart successfully",
                cart: product
            };
        }
        catch (error) {
            console.log("add to cart service error:", error.message);
            throw new response_utils_1.AppError("error during add to cart ", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    async viewMyCart(buyerId) {
        try {
            const myCartItems = await this.cartRepo.findOne({ where: { buyers: { id: buyerId } }, relations: ['items', 'items.product'] });
            return myCartItems;
        }
        catch (error) {
            console.log("error during view my cart:", error.message);
            throw error.message;
        }
    }
    async deleteFromCart(cartItemId, quantity) {
        try {
            const item = await this.cartItemRepo.findOne({ where: { id: cartItemId }, relations: ['product'] });
            if (!item)
                throw new response_utils_1.AppError("Item not found in cart", http_status_codes_1.StatusCodes.NOT_FOUND);
            const productId = item.product.id;
            const newQuantity = item.product.quantity + quantity;
            await dbORM_config_1.falfulConnection.transaction(async (manager) => {
                await manager.getRepository(products_model_1.Product).update({ id: productId }, { quantity: newQuantity });
                await manager.getRepository(cartItems_modal_1.CartItem).delete({ id: cartItemId });
            });
        }
        catch (error) {
            console.log("error during view my cart:", error.message);
            throw error.message;
        }
    }
}
exports.cartServices = cartServices;
