import { Entity, Column, PrimaryGeneratedColumn,OneToMany  } from 'typeorm';
import { ProductImage } from './productImage.model';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('decimal', { precision: 10, scale: 2 })
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
  category!: string; // 'fruit', 'berry', 'tropical'

  @OneToMany(() => ProductImage, (image: ProductImage) => image.product, {
    cascade: true,
    eager: true
  })
  images!: ProductImage[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}