import { DataSource, Repository } from 'typeorm';
import { Product } from './models/products.model';
import { ProductImage } from './models/productImage.model';
import { CreateProductDto } from './dtos/product.dot';
import { uploadImage, deleteImage } from '../config/cloudinary.config';

export class ProductService {
  private productRepo: Repository<Product>;
  private imageRepo: Repository<ProductImage>;


  constructor(private dataSource: DataSource) {
    this.productRepo = dataSource.getRepository(Product);
    this.imageRepo = dataSource.getRepository(ProductImage);
  }

  async createProduct(
    productData: CreateProductDto,
    imageFiles: Express.Multer.File[]
  ): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let product: Product | null = null;

    try {
      // 1. Create product without images first
      product = this.productRepo.create({
        name: productData.name,
        price: productData.price,
        description: productData.description,
        userId: productData.userId,
        seller: productData.seller,
        phone: productData.phone,
        email: productData.email,
        quantity: productData.quantity,
        category: productData.category,
        images: [] // Initialize empty array
      });

      await queryRunner.manager.save(product);

      // Process from cloudinary and upload images
      const images = await Promise.all(
        imageFiles.map(async (file) => {//calls from cloudinary
          const { url, publicId } = await uploadImage(file.path);
          if (!url || !publicId) throw new Error("Image upload failed");
          return this.imageRepo.create({
            url,
            publicId,
            altText: productData.name,
            product: product! // Non-null assertion safe here
          });
        })
      );

      product.images = await queryRunner.manager.save(images);
      await queryRunner.manager.save(product); // <- this ensures images are linked to product
      await queryRunner.commitTransaction();

      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (product?.images) await this.cleanupImages(product.images);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //Remove uploaded images from cloud storage (like Cloudinary) if a transaction fails
  private async cleanupImages(images: ProductImage[]): Promise<void> {
    await Promise.all(
      images.map(img =>
        img.publicId ? deleteImage(img.publicId) : Promise.resolve()
      )
    );
  }

  // Promise<Product[]>  It tells TypeScript "This will give you product data later, and here's exactly what that data will look like."
  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.productRepo.find({
        relations: ['images'],
        order: { createdAt: 'DESC' },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          quantity: true,
          seller: true,
          phone: true,
          images: {
            url: true,
            altText: true
          }
        }
      });
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw new Error("Unable to retrieve products at this time");
    }
  }

  //get specific product for detail view
  async getProduct(id: number): Promise<Product | null> {
    try {
      const product = await this.productRepo.findOne({
        where: { id },
        relations: ['images'],
      });
      return product;
    } catch (error) {
      console.error(`Failed to fetch product with id ${id}:`, error);
      throw new Error("Unable to retrieve product at this time");
    }
  }
}