"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const products_model_1 = require("../models/products.model");
const productImage_model_1 = require("../models/productImage.model");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const dbORM_config_1 = require("../../config/dbORM.config");
const seller_model_1 = require("../../users/models/seller.model");
class ProductService {
    dataSource;
    productRepo;
    imageRepo;
    sellerRepo = dbORM_config_1.falfulConnection.getRepository(seller_model_1.seller);
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.productRepo = dataSource.getRepository(products_model_1.Product);
        this.imageRepo = dataSource.getRepository(productImage_model_1.ProductImage);
    }
    async createProduct(productData, imageFiles) {
        const queryRunner = this.dataSource.createQueryRunner();
        let product = null;
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            product = this.productRepo.create({
                ...productData,
                images: []
            });
            await queryRunner.manager.save(product);
            const images = await Promise.all(imageFiles.map(async (file) => {
                const { url, publicId } = await (0, cloudinary_config_1.uploadImage)(file.path);
                if (!url || !publicId)
                    throw new Error("Image upload failed");
                return this.imageRepo.create({
                    url,
                    publicId,
                    altText: productData.name,
                    product: product
                });
            }));
            product.images = await queryRunner.manager.save(images);
            await queryRunner.manager.save(product);
            await queryRunner.commitTransaction();
            return product;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            if (product?.images)
                await this.cleanupImages(product.images);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async cleanupImages(images) {
        await Promise.all(images.map(async (img) => {
            try {
                if (img.publicId)
                    await (0, cloudinary_config_1.deleteImage)(img.publicId);
            }
            catch (err) {
                console.error(`Failed to delete image ${img.publicId}:`, err);
            }
        }));
    }
    async getAllProducts() {
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
            const enrichedProducts = await Promise.all(products.map(async (product) => {
                const sellerInfo = await this.sellerRepo.findOne({
                    where: { id: product.userId },
                    select: { id: true, name: true, email: true, phone: true },
                });
                return {
                    ...product,
                    seller: sellerInfo,
                };
            }));
            return enrichedProducts;
        }
        catch (error) {
            console.error("Failed to fetch products:", error);
            throw new Error("Unable to retrieve products at this time");
        }
    }
    async getProduct(id) {
        try {
            const product = await this.productRepo.findOne({
                where: { id },
                relations: ['images', 'sellers'],
            });
            console.log("specific product view service:", product);
            return product;
        }
        catch (error) {
            console.error(`Failed to fetch product with id ${id}:`, error);
            throw new Error("Unable to retrieve product at this time");
        }
    }
    async deleteProduct(id) {
        const queryRunner = this.productRepo.manager.connection.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const product = await queryRunner.manager.findOne(products_model_1.Product, {
                where: { id },
                relations: ['images']
            });
            if (!product)
                throw new response_utils_1.AppError("product is not found", http_status_codes_1.StatusCodes.NOT_FOUND);
            if (product.images?.length) {
                await this.cleanupImages(product.images);
                await queryRunner.manager.delete(productImage_model_1.ProductImage, { product: { id } });
            }
            await queryRunner.manager.delete(products_model_1.Product, { id });
            await queryRunner.commitTransaction();
            return { message: `Product ${id} deleted successfully` };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error(`Failed to delete product:`, error);
            throw new response_utils_1.AppError("unable to delete", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateProduct(id, productData, newImageFiles = [], keepImages = []) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existingProduct = await queryRunner.manager.findOne(products_model_1.Product, {
                where: { id },
                relations: ['images'],
            });
            if (!existingProduct)
                throw new response_utils_1.AppError("Product not found", http_status_codes_1.StatusCodes.NOT_FOUND);
            Object.assign(existingProduct, productData);
            // Always get fresh images from DB before checking what to keep
            const freshProduct = await this.productRepo.findOne({
                where: { id },
                relations: ['images']
            });
            const currentImages = freshProduct?.images ?? [];
            const imagesToDelete = currentImages.filter(img => !keepImages.some(keep => keep.publicId === img.publicId));
            if (imagesToDelete.length > 0) {
                await this.cleanupImages(imagesToDelete);
                await queryRunner.manager
                    .createQueryBuilder()
                    .delete()
                    .from(productImage_model_1.ProductImage)
                    .whereInIds(imagesToDelete.map(img => img.id))
                    .execute();
            }
            const newImages = newImageFiles.length > 0 ? await Promise.all(newImageFiles.map(async (file) => {
                const { url, publicId } = await (0, cloudinary_config_1.uploadImage)(file.path);
                if (!url || !publicId)
                    throw new Error("Image upload failed");
                return this.imageRepo.create({
                    url,
                    publicId,
                    altText: productData.name,
                    product: existingProduct,
                });
            })) : [];
            if (newImages.length > 0) {
                await queryRunner.manager.save(newImages);
            }
            const allImagesToKeep = currentImages.filter(img => keepImages.some(keep => keep.publicId === img.publicId));
            existingProduct.images = [...allImagesToKeep, ...newImages];
            const updated = await queryRunner.manager.save(existingProduct);
            await queryRunner.commitTransaction();
            return updated;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("Failed to update product:", error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getMyProducts(userId) {
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
            const sellerRepo = dbORM_config_1.falfulConnection.getRepository(seller_model_1.seller);
            const enrichedProducts = await Promise.all(products.map(async (product) => {
                const sellerInfo = await sellerRepo.findOne({
                    where: { id: product.userId },
                    select: { id: true, name: true, email: true, phone: true },
                });
                return {
                    ...product,
                    seller: sellerInfo,
                };
            }));
            return enrichedProducts;
        }
        catch (error) {
            console.error(`Failed to fetch product with id ${userId}:`, error);
            throw new response_utils_1.AppError("Unable to retrieve product at this time", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.ProductService = ProductService;
