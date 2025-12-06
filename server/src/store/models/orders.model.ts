import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { baseDetails } from "./baseDetail";
import { buyer } from "../../users/models/buyer.model";
import { OrdersItems } from "./orderItems.model";
import { OrderStatus, PaymentStatus, DeliveryMethod, PaymentMethod } from "../../types/product.types";
import { seller } from "../../users/models/seller.model";


@Entity("orders")
export class Orders extends baseDetails {
    @ManyToOne(() => buyer, buyer => buyer.orders)
    buyer!: buyer;

      @ManyToOne(() => seller, seller => seller.orders)
    sellers!: seller;

    @OneToMany(() => OrdersItems, item => item.order, { cascade: true })
    items!: OrdersItems[];

    @Column({ type: "enum", enum: PaymentMethod, default:PaymentMethod.ONLINE })
    paymentMethod!: PaymentMethod;

    @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
    paymentStatus!: PaymentStatus;

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
    OrderStatus!: OrderStatus;

    @Column({ type: "enum", enum: DeliveryMethod, default: DeliveryMethod.EXPRESS })
    deliveryMethod!: DeliveryMethod;

    @Column()
    deliveryAddress!: string;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    subtotal!: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    tax!: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    deliveryFee!: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    totalAmount!: number;
}