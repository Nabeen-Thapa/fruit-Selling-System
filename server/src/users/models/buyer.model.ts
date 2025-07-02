import { Column, Entity, OneToMany } from "typeorm";
import { User } from "./user.model";
import { Cart } from "../../store/models/cart.model";
import { Orders } from "../../store/models/orders.model";

@Entity("buyerDetail")
export class buyer extends User{
    @Column()
    shippingAddress!:string;

    @OneToMany(()=> Cart, buyercart => buyercart.buyers)
    carts!:Cart[];

    @OneToMany(()=>Orders, orders=>orders.buyer)
    orders!:Orders;
}