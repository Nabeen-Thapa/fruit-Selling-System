import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";
import { Product } from "../../store/models/products.model";
import { Orders } from "../../store/models/orders.model";


@Entity("sellerDetail")
export class seller extends User {
  @Column()
  businessName?: string;

  @OneToMany(() => Product, (product) => product.sellers)
  products!: Product[];

  @OneToMany(() => Orders, orders => orders.sellers)
  orders!: Orders;
}