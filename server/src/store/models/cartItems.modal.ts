import { Collection, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { baseDetails } from "./baseDetail";
import { Cart } from "./cart.model";
import { Product } from "./products.model";

@Entity("cartItem")
export class CartItem extends baseDetails {
    @ManyToOne(() => Cart, cart => cart.items)
    carts!: Cart;

    @ManyToOne(() => Product)
    product!: Product;

    @Column()
    quantity!: number;

     @Column("decimal", {precision:10, scale:2})
    price!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    totalPrice!: number;

}