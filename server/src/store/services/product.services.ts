import { DataSource, Repository } from 'typeorm';
import { Product } from '../models/products.model';
import { ProductImage } from '../models/productImage.model';
import { CreateProductDto } from '../dtos/product.dot';
import { uploadImage, deleteImage } from '../../config/cloudinary.config';
import { AppError } from '../../common/utils/response.utils';
import { StatusCodes } from 'http-status-codes';
import { falfulConnection } from '../../config/dbORM.config';
import { seller } from '../../users/models/seller.model';

export class ProductService {
  private productRepo: Repository<Product>;
  private imageRepo: Repository<ProductImage>;
  private sellerRepo = falfulConnection.getRepository(seller);

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
        images: []
      });

      await queryRunner.manager.save(product);

      const images = await Promise.all(
        imageFiles.map(async (file) => {
          const { url, publicId } = await uploadImage(file.path);
          if (!url || !publicId) throw new Error("Image upload failed");
          return this.imageRepo.create({
            url,
            publicId,
            altText: productData.name,
            product: product!
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

  async getAllProducts(): Promise<any[]> {
    try {
      const products = await this.productRepo.find({
        relations: ['images'],
        order: { createdAt: 'DESC' },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          quantity: true,
          quantityType: true,
          userId: true,
        },
      });

      const enrichedProducts = await Promise.all(
        products.map(async (product) => {
          const sellerInfo = await this.sellerRepo.findOne({
            where: { id: product.userId },
            select: { id: true, name: true, email: true, phone: true },
          });

          return {
            ...product,
            seller: sellerInfo,
          };
        })
      );

      return enrichedProducts;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw new Error("Unable to retrieve products at this time");
    }
  }

  async getProduct(id: number): Promise<Product | null> {
    try {
      const product = await this.productRepo.findOne({
        where: { id },
        relations: ['images', 'sellers'],
      });
      console.log("specific product view service:", product)
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
    newImageFiles: Express.Multer.File[] = [],
    keepImages: { url: string; publicId: string }[] = []
  ): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingProduct = await queryRunner.manager.findOne(Product, {
        where: { id },
        relations: ['images'],
      });

      if (!existingProduct) throw new AppError("Product not found", StatusCodes.NOT_FOUND);

      Object.assign(existingProduct, productData);

      // Always get fresh images from DB before checking what to keep
      const freshProduct = await this.productRepo.findOne({
        where: { id },
        relations: ['images']
      });

      const currentImages = freshProduct?.images ?? [];

      const imagesToDelete = currentImages.filter(
        img => !keepImages.some(keep => keep.publicId === img.publicId)
      );

      if (imagesToDelete.length > 0) {
        await this.cleanupImages(imagesToDelete);
        await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(ProductImage)
          .whereInIds(imagesToDelete.map(img => img.id))
          .execute();
      }

      const newImages = newImageFiles.length > 0 ? await Promise.all(
        newImageFiles.map(async (file) => {
          const { url, publicId } = await uploadImage(file.path);
          if (!url || !publicId) throw new Error("Image upload failed");

          return this.imageRepo.create({
            url,
            publicId,
            altText: productData.name,
            product: existingProduct,
          });
        })
      ) : [];

      if (newImages.length > 0) {
        await queryRunner.manager.save(newImages);
      }

      const allImagesToKeep = currentImages.filter(img =>
        keepImages.some(keep => keep.publicId === img.publicId)
      );

      existingProduct.images = [...allImagesToKeep, ...newImages];

      const updated = await queryRunner.manager.save(existingProduct);
      await queryRunner.commitTransaction();
      return updated;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Failed to update product:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getMyProducts(userId: string) {
    try {
      const products = await this.productRepo.find({
        where: { userId },
        relations: ['images'],
        order: { createdAt: 'DESC' },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          quantity: true,
          quantityType: true,
          userId: true,
        },
      });
      const sellerRepo = falfulConnection.getRepository(seller);

      const enrichedProducts = await Promise.all(
        products.map(async (product) => {
          const sellerInfo = await sellerRepo.findOne({
            where: { id: product.userId },
            select: { id: true, name: true, email: true, phone: true },
          });

          return {
            ...product,
            seller: sellerInfo,
          };
        })
      );

      return enrichedProducts;
    } catch (error) {
      console.error(`Failed to fetch product with id ${userId}:`, error);
      throw new AppError("Unable to retrieve product at this time", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}
