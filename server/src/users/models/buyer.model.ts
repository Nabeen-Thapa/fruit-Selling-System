import { Column, Entity } from "typeorm";
import { User } from "./user.model";

@Entity("buyerDetail")
export class buyer extends User{
    @Column()
    shippingAddress!:string;
}