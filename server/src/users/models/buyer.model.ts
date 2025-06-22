import { Column, Entity, OneToMany } from "typeorm";
import { User } from "./user.model";
import { Cart } from "../../store/models/cart.model";

@Entity("buyerDetail")
export class buyer extends User{
    @Column()
    shippingAddress!:string;

    @OneToMany(()=> Cart, buyercart => buyercart.buyers)
    carts!:Cart;
}