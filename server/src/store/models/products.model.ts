import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { ProductImage } from './productImage.model';
import { seller } from '../../users/models/seller.model';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('decimal')
  price!: number;

  @Column('text')
  description!: string;

  @Column({ nullable: true }) // allow nulls temporarily
  userId!: string;

  @Column('int')
  quantity!: number;

  @Column()
  category?: string;



  @Column({ type: 'varchar', nullable: true })
  quantityType?: string;


  @OneToMany(() => ProductImage, image => image.product, { cascade: true })
  images!: ProductImage[];

  @ManyToOne(() => seller, seller => seller.products, { cascade: true })
  sellers!: ProductImage[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}