"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const products_model_1 = require("./models/products.model");
const productImage_model_1 = require("./models/productImage.model");
const cloudinary_config_1 = require("../config/cloudinary.config");
class ProductService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.productRepo = dataSource.getRepository(products_model_1.Product);
        this.imageRepo = dataSource.getRepository(productImage_model_1.ProductImage);
    }
    async createProduct(productData, imageFiles) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        let product = null;
        try {
            // 1. Create product without images first
            product = this.productRepo.create({
                name: productData.name,
                price: productData.price,
                description: productData.description,
                seller: productData.seller,
                phone: productData.phone,
                email: productData.email,
                quantity: productData.quantity,
                category: productData.category,
                images: [] // Initialize empty array
            });
            await queryRunner.manager.save(product);
            // Process from cloudinary and upload images
            const images = await Promise.all(imageFiles.map(async (file) => {
                const { url, publicId } = await (0, cloudinary_config_1.uploadImage)(file.path);
                return this.imageRepo.create({
                    url,
                    publicId,
                    altText: productData.name,
                    product: product // Non-null assertion safe here
                });
            }));
            product.images = await queryRunner.manager.save(images);
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
    //Remove uploaded images from cloud storage (like Cloudinary) if a transaction fails
    async cleanupImages(images) {
        await Promise.all(images.map(img => img.publicId ? (0, cloudinary_config_1.deleteImage)(img.publicId) : Promise.resolve()));
    }
    // Promise<Product[]>  It tells TypeScript "This will give you product data later, and here's exactly what that data will look like."
    async getAllProducts() {
        return this.productRepo.find({
            relations: ['images'],
            order: {
                createdAt: 'DESC'
            },
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
    }
}
exports.ProductService = ProductService;
