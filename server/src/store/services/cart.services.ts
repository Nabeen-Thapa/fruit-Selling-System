import { falfulConnection } from "../../config/dbORM.config";
import { buyer } from "../../users/models/buyer.model";
import { AppError } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { Product } from "../models/products.model";
import { Cart } from "../models/cart.model";
import { CartItem } from "../models/cartItems.modal";



export class cartServices {
    private buyerRepo = falfulConnection.getRepository(buyer);
    private productRepo = falfulConnection.getRepository(Product);
    private cartRepo = falfulConnection.getRepository(Cart);
    private cartItemRepo = falfulConnection.getRepository(CartItem);

    async addToCart(buyerId: string, productId: number, quantity: number) {
        try {
            const buyer = await this.buyerRepo.findOne({ where: { id: buyerId } })
            if (!buyer) throw new AppError("buyer is not found", StatusCodes.UNAUTHORIZED);

            const product = await this.productRepo.findOne({ where: { id: productId } });
            if (!product) throw new AppError("product is not found", StatusCodes.UNAUTHORIZED);

            //decrease quantity of product by add to cart quantity
            const newQuantity = product.quantity - quantity;

            let buyerCart = await this.cartRepo.findOne({
                where: { buyers: { id: buyerId } },
                relations: ['items', 'items.product', 'buyers'],
            });


            if (!buyerCart) {
                buyerCart = new Cart();
                buyerCart.buyers = buyer;
                buyerCart.items = [];
                buyerCart.totalAmount = 0;
                buyerCart.finalAmount = 0;
            }

            let cartItem: CartItem | undefined = buyerCart.items.find(item => item.product.id === productId);
            if (cartItem) {
                cartItem.quantity += quantity;
                cartItem.totalPrice = cartItem.quantity * cartItem.price;
            } else {
                cartItem = new CartItem();
                cartItem.carts = buyerCart;
                cartItem.product = product;
                cartItem.quantity = quantity;
                cartItem.price = product.price;
                cartItem.totalPrice = quantity * product.price;

                buyerCart.items.push(cartItem);
            }

            buyerCart.totalAmount = Number(buyerCart.items.reduce((sum, item) => sum + (item.totalPrice), 0));

            await falfulConnection.transaction(async (manager) => {
                await manager.getRepository(CartItem).save(cartItem);
                await manager.getRepository(Cart).save(buyerCart);
                await manager.getRepository(Product).update({ id: productId }, { quantity: newQuantity })
            })

            return {
                message: "Product added to cart successfully",
                cart: product
            };
        } catch (error) {
            console.log("add to cart service error:", (error as Error).message);
            throw new AppError("error during add to cart ", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async viewMyCart(buyerId: string) {
        try {
            const myCartItems = await this.cartRepo.findOne({ where: { buyers: { id: buyerId } }, relations: ['items', 'items.product'] });
            return myCartItems;
        } catch (error) {
            console.log("error during view my cart:", (error as Error).message);
            throw (error as Error).message;
        }
    }

    async deleteFromCart(cartItemId: string, quantity: number) {
        try {
            const Item = await this.cartRepo.findOne({ where: { items: { id: cartItemId } }, relations: ['items'] });
            if (!Item) throw new AppError("item is not dound in cart", StatusCodes.NOT_FOUND);

            //update quantity of product
            const item = await this.cartItemRepo.findOne({where: { id: cartItemId },relations: ['product'] });
            if (!item) throw new AppError("Item not found in cart", StatusCodes.NOT_FOUND);
            const productId = item.product.id;
            const newQuantity = item.product.quantity + quantity;
            await this.productRepo.update({id:productId},{quantity: newQuantity})
            await this.cartItemRepo.delete({ id: cartItemId });
        } catch (error) {
            console.log("error during view my cart:", (error as Error).message);
            throw (error as Error).message;
        }
    }
}