import { falfulConnection } from "../../config/dbORM.config"
import { Orders } from "../models/orders.model"
import { OrdersItems } from "../models/orderItems.model";
import { AppError } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { buyer } from "../../users/models/buyer.model";
import { DeliveryMethod, OrderStatus, PaymentStatus } from "../../types/product.types";
import { ordersDtos } from "../dtos/orders.dto";
import { Cart } from "../models/cart.model";


export class OrderServices {
    protected orderRepo = falfulConnection.getRepository(Orders);
    protected orderItemsRepo = falfulConnection.getRepository(OrdersItems);
    protected buyerRepo = falfulConnection.getRepository(buyer);
    protected cartRepo = falfulConnection.getRepository(Cart);

    async placeOrder(orderData: ordersDtos, buyerId: string) {
        const { deliveryAddress, deliveryMethod, paymentMethod } = orderData;

        const buyerEntity = await this.buyerRepo.findOne({
            where: { id: buyerId },
            relations: ["carts", "carts.items", "carts.items.product"],
        });

        if (!buyerEntity) throw new AppError("Buyer not found", StatusCodes.UNAUTHORIZED);

        const cart = buyerEntity.carts?.[0];
        if (!cart || cart.items.length === 0)
            throw new AppError("Cart is empty", StatusCodes.BAD_REQUEST);

        const subtotal = cart.items.reduce((sum, item) => sum + parseFloat(item.totalPrice.toString()), 0);
        const tax = parseFloat((subtotal * 0.1).toFixed(2));
        const deliveryFee = deliveryMethod === DeliveryMethod.EXPRESS ? 5.0 : 2.5;
        const totalAmount = subtotal + tax + deliveryFee;

        const order = this.orderRepo.create({
            buyer: buyerEntity,
            items: [],
            paymentMethod,
            paymentStatus: PaymentStatus.PENDING,
            OrderStatus: OrderStatus.PENDING,
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
        await this.cartRepo.remove(cart);

        return {
            message: "Order placed successfully",
            orderId: order.id,
            totalAmount,
        };
    }
}