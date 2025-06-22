import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { baseDetails } from "./baseDetail";
import { buyer } from "../../users/models/buyer.model";
import { CartItem } from "./cartItems.modal";

@Entity("productCart")
export class Cart extends baseDetails{

    @ManyToOne(()=> buyer, buyerCart => buyerCart.carts)
    buyers!:buyer;

    @OneToMany(()=> CartItem, CartItem=> CartItem.carts, {cascade: ['remove']})
    items!:CartItem[];

    @Column()
    totalAmount!: number;

    @Column()
    finalAmount!:number;
}