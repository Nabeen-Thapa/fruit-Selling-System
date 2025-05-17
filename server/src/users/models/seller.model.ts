import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";
import { Product } from "../../products/models/products.model";


@Entity("sellerDetail")
export class seller extends User{
  @Column()
  businessName?:string;

  @OneToMany(() => Product, (product) => product.seller)
  products!: Product[];
}