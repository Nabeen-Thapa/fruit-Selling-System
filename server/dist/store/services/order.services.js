"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = void 0;
const dbORM_config_1 = require("../../config/dbORM.config");
const orders_model_1 = require("../models/orders.model");
const orderItems_model_1 = require("../models/orderItems.model");
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const buyer_model_1 = require("../../users/models/buyer.model");
const product_types_1 = require("../../types/product.types");
const cart_model_1 = require("../models/cart.model");
const seller_model_1 = require("../../users/models/seller.model");
class OrderServices {
    orderRepo = dbORM_config_1.falfulConnection.getRepository(orders_model_1.Orders);
    orderItemsRepo = dbORM_config_1.falfulConnection.getRepository(orderItems_model_1.OrdersItems);
    buyerRepo = dbORM_config_1.falfulConnection.getRepository(buyer_model_1.Buyer);
    cartRepo = dbORM_config_1.falfulConnection.getRepository(cart_model_1.Cart);
    sellerRepo = dbORM_config_1.falfulConnection.getRepository(seller_model_1.seller);
    async placeOrder(orderData, buyerId) {
        console.log("order dat service:", orderData);
        try {
            const { deliveryAddress, deliveryMethod, paymentMethod } = orderData;
            const buyerEntity = await this.buyerRepo.findOne({
                where: { id: buyerId },
                relations: ["carts", "carts.items", "carts.items.product"],
            });
            if (!buyerEntity)
                throw new response_utils_1.AppError("Buyer not found", http_status_codes_1.StatusCodes.UNAUTHORIZED);
            const cart = buyerEntity.carts?.[0];
            if (!cart || cart.items.length === 0)
                throw new response_utils_1.AppError("Cart is empty", http_status_codes_1.StatusCodes.BAD_REQUEST);
            const subtotal = cart.items.reduce((sum, item) => sum + parseFloat(item.totalPrice.toString()), 0);
            const tax = parseFloat((subtotal * 0.1).toFixed(2));
            const deliveryFee = deliveryMethod === product_types_1.DeliveryMethod.EXPRESS ? 5.0 : 2.5;
            const totalAmount = subtotal + tax + deliveryFee;
            const order = this.orderRepo.create({
                buyer: buyerEntity,
                items: [],
                paymentMethod,
                paymentStatus: product_types_1.PaymentStatus.PENDING,
                OrderStatus: product_types_1.OrderStatus.PENDING,
                deliveryMethod,
                deliveryAddress,
                subtotal,
                tax,
                deliveryFee,
                totalAmount,
            });
            for (const cartItem of cart.items) {
                const orderItem = this.orderItemsRepo.create({
                    order,
                    product: cartItem.product,
                    quantity: cartItem.quantity,
                    price: cartItem.price,
                    totalPrice: cartItem.totalPrice,
                });
                order.items.push(orderItem);
            }
            await this.orderRepo.save(order);
            await dbORM_config_1.falfulConnection.getRepository("cartItem").delete({ cart: { id: cart.id } });
            await this.cartRepo.remove(cart);
            return {
                message: "Order placed successfully",
                orderId: order.id,
                totalAmount,
            };
        }
        catch (error) {
            console.log("place order service error:", error.message);
            new response_utils_1.AppError("place order service error:", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    async viewBuyerOrders(buyerId) {
        try {
            const myCartItems = await this.orderRepo.findOne({ where: { buyer: { id: buyerId } }, relations: ['items', 'items.product'] });
            return myCartItems;
        }
        catch (error) {
            console.log("view order service error:", error.message);
            new response_utils_1.AppError("view order service error:", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    async viewSellerOrders(sellerId) {
        try {
            const myCartItems = await this.orderRepo.findOne({ where: { sellers: { id: sellerId } }, relations: ['items', 'items.product'] });
            return myCartItems;
        }
        catch (error) {
            console.log("view order service error:", error.message);
            new response_utils_1.AppError("view order service error:", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.OrderServices = OrderServices;
