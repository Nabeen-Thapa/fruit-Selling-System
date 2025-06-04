import { DataSource, Repository } from 'typeorm';
import { Product } from '../models/products.model';
import { ProductImage } from '../models/productImage.model';
import { CreateProductDto } from '../dtos/product.dot';
import { uploadImage, deleteImage } from '../../config/cloudinary.config';
import { AppError } from '../../common/utils/response.utils';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class ProductService {
  private productRepo: Repository<Product>;
  private imageRepo: Repository<ProductImage>;


  constructor(private dataSource: DataSource) {
    this.productRepo = dataSource.getRepository(Product);
    this.imageRepo = dataSource.getRepository(ProductImage);
  }

  async createProduct(productData: CreateProductDto, imageFiles: Express.Multer.File[]): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    let product: Product | null = null;
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      product = this.productRepo.create({
        ...productData,
        images: [] // Initialize empty array for image
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
      await queryRunner.manager.save(product);
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
  // private async cleanupImages(images: ProductImage[]): Promise<void> {
  //   await Promise.all(
  //     images.map(img =>
  //       img.publicId ? deleteImage(img.publicId) : Promise.resolve()
  //     )
  //   );
  // }


  private async cleanupImages(images: ProductImage[]): Promise<void> {
    await Promise.all(
      images.map(async img => {
        try {
          if (img.publicId) await deleteImage(img.publicId);
        } catch (err) {
          console.error(`Failed to delete image ${img.publicId}:`, err);
        }
      })
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


  async deleteProduct(id: number) {
    const queryRunner = this.productRepo.manager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const product = await queryRunner.manager.findOne(Product, {
        where: { id },
        relations: ['images']
      });
      if (!product) throw new AppError("product is not found", StatusCodes.NOT_FOUND);

      // if (product.images && product.images.length > 0) await queryRunner.manager.delete(ProductImage, { product: { id } });
      if (product.images?.length) {
        await this.cleanupImages(product.images);
        await queryRunner.manager.delete(ProductImage, { product: { id } });
      }

      await queryRunner.manager.delete(Product, { id })
      await queryRunner.commitTransaction();
      return { message: `Product ${id} deleted successfully` };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(`Failed to delete product:`, error);
      throw new AppError("unable to delete", StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async updateProduct(
    id: number,
    productData: CreateProductDto,
    imageFiles?: Express.Multer.File[]
  ): Promise<Product> {
    console.log("Inside service updateProduct");

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const existingProduct = await queryRunner.manager.findOne(Product, { where: { id }, relations: ['images'] });
      if (!existingProduct) throw new AppError("Product not found", StatusCodes.NOT_FOUND);

      Object.assign(existingProduct, productData);

      if (imageFiles && imageFiles.length > 0) {
        if (existingProduct.images?.length) {
          await this.cleanupImages(existingProduct.images);
          await queryRunner.manager.delete(ProductImage, { product: { id } });
        }

        const newImages = await Promise.all(
          imageFiles.map(async (file) => {
            const { url, publicId } = await uploadImage(file.path);
            if (!url || !publicId) throw new Error("Image upload failed");

            return this.imageRepo.create({
              url,
              publicId,
              altText: productData.name,
              product: existingProduct,
            });
          })
        );

        existingProduct.images = await queryRunner.manager.save(newImages);
      }

      const updatedProduct = await queryRunner.manager.save(existingProduct);
      await queryRunner.commitTransaction();

      return updatedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Failed to update product:", error);
      throw error; // don't wrap again
    } finally {
      await queryRunner.release();
    }
  }

  async getMyProducts(userId: string) {
    try {
     return await this.productRepo.find({where :{userId},
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
      console.error(`Failed to fetch product with id ${userId}:`, error);
      throw new AppError("Unable to retrieve product at this time", StatusCodes.INTERNAL_SERVER_ERROR);

    }

  }
}