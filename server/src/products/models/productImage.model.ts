import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './products.model';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column({ nullable: true })
  altText?: string;

  @Column()
  publicId!: string; // For Cloudinary reference

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE' // Delete images when product is deleted
  })
  product!: Product;
}