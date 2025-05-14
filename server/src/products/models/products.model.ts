import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductImage } from './productImage.model';

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

  @Column()
  seller!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column('int')
  quantity!: number;

  @Column()
  category?: string;

  @OneToMany(() => ProductImage, image => image.product, { cascade: true })
  images!: ProductImage[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}