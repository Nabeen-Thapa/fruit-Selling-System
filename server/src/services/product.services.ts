import { DataSource, Repository } from 'typeorm';
import { Product } from '../models/products.model';
import { ProductImage } from '../models/productImage.model';
export class ProductService {
  private productRepo: Repository<Product>;
  private imageRepo: Repository<ProductImage>;

  constructor(private dataSource: DataSource) {
    this.productRepo = dataSource.getRepository(Product);
    this.imageRepo = dataSource.getRepository(ProductImage);
  }

  async createProduct(productData: {
    name: string;
    price: number;
    description: string;
    seller: string;
    phone: string;
    email: string;
    quantity: number;
    category: string;
    images: Express.Multer.File[];
  }): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Create product
      const product = this.productRepo.create({
        ...productData,
        images: []
      });
      await queryRunner.manager.save(product);

      // 2. Process images
      const images = await Promise.all(
        productData.images.map(async (file) => {
          const image = this.imageRepo.create({
            url: this.storeImage(file),
            altText: productData.name,
            product
          });
          return await queryRunner.manager.save(image);
        })
      );

      // 3. Update product with images
      product.images = images;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();

      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private storeImage(file: Express.Multer.File): string {
    // Implement your storage logic
    return `/uploads/${file.filename}`;
  }

  
}