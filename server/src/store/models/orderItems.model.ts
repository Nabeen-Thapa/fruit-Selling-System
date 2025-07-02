import { Column, Entity, ManyToOne } from "typeorm";
import { baseDetails } from "./baseDetail";
import { Orders } from "./orders.model";
import { Product } from "./products.model";

@Entity("orderedItems")
export class OrdersItems extends baseDetails {
    @ManyToOne(() => Orders, orders => orders.items)
    order!: Orders;

    @ManyToOne(() => Product)
    product!: Product;

    @Column()
    quantity!: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    price!: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    totalPrice!: number;

}