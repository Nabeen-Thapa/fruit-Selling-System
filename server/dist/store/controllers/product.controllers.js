"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const product_services_1 = require("../services/product.services");
const product_dot_1 = require("../dtos/product.dot");
const controller_decoder_1 = require("../../common/decorators/controller.decoder");
const route_decoder_1 = require("../../common/decorators/route.decoder");
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const dbORM_config_1 = require("../../config/dbORM.config");
const cloudinary_upload_1 = require("../../common/utils/cloudinary-upload");
const auth_middleware_1 = require("../../users/middleware/auth.middleware");
const dtoValidateResponse_utils_1 = require("../../common/utils/dtoValidateResponse.utils");
let ProductController = class ProductController {
    productService;
    constructor() {
        // Initialize the service with the data source
        this.productService = new product_services_1.ProductService(dbORM_config_1.falfulConnection);
    }
    async createProduct(req, res) {
        try {
            if (!req.files || !req.body) {
                throw new Error("No files or form data received");
            }
            const user = req.user;
            if (!user)
                throw new Error("Unauthorized access");
            const productData = {
                ...req.body,
                price: Number(req.body.price),
                quantity: Number(req.body.quantity),
                images: req.files,
                userId: user.id,
            };
            const productDto = (0, class_transformer_1.plainToInstance)(product_dot_1.CreateProductDto, productData);
            const errors = await (0, class_validator_1.validate)(productDto);
            if (errors.length > 0) {
                const message = errors.map(err => Object.values(err.constraints || {}).join(", ")).join("; ");
                throw new Error(`Validation failed: ${message}`);
            }
            const product = await this.productService.createProduct(productDto, req.files);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.CREATED, "Product added successfully", product);
        }
        catch (error) {
            console.error("Error creating product:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, error instanceof Error ? error.message : 'Unknown error');
        }
    }
    async getAllProducts(req, res) {
        try {
            const products = await this.productService.getAllProducts();
            // Ensure numeric fields are properly typed
            const responseData = products.map(product => ({
                ...product,
                price: Number(product.price),
                quantity: Number(product.quantity)
            }));
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Products fetched successfully", responseData);
        }
        catch (error) {
            console.error("Error fetching products:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch products");
        }
    }
    async getSpecificProduct(req, res) {
        try {
            const id = Number(req.params.id);
            const product = await this.productService.getProduct(id);
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Products fetched successfully", product);
        }
        catch (error) {
            console.error("Error fetching products:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch products");
        }
    }
    async deleteProduct(req, res) {
        try {
            const user = req.user;
            if (user)
                return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "you are not authorize to delete product");
            const id = Number(req.params.id);
            const deleteResult = await this.productService.deleteProduct(id);
            return (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Products fetched successfully", deleteResult);
        }
        catch (error) {
            console.error("Error fetching products:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete products");
        }
    }
    async updateProduct(req, res) {
        try {
            if (!req.files || !req.body)
                (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "No files or form data received");
            const user = req.user;
            if (!user)
                return (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "you are not authorize");
            // Parse and normalize existing images
            let keepImages = [];
            const existing = req.body['existingImages[]'];
            if (Array.isArray(existing)) {
                keepImages = existing.map(img => JSON.parse(img));
            }
            else if (typeof existing === 'string') {
                keepImages = [JSON.parse(existing)];
            }
            const productData = {
                ...req.body,
                price: Number(req.body.price),
                quantity: Number(req.body.quantity),
                userId: user.id,
                seller: user.name,
                phone: user.phone,
                email: user.email
            };
            const validateProduct = await (0, dtoValidateResponse_utils_1.validateDto)(product_dot_1.CreateProductDto, productData, res);
            if (!validateProduct.valid)
                return;
            const updatedProductResult = await this.productService.updateProduct(Number(req.params.id), validateProduct.data, req.files, keepImages);
            return (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Product updated successfully", updatedProductResult);
        }
        catch (error) {
            console.log("error in product update controller:", error.message);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error);
        }
    }
    async myProducts(req, res) {
        try {
            if (!req?.user)
                (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "yuo are not authorized");
            // const userId = req.user?.id as string;
            const { id } = req.params;
            const myProductResult = await this.productService.getMyProducts(id);
            const responseData = myProductResult.map(product => ({
                ...product,
                price: Number(product.price),
                quantity: Number(product.quantity)
            }));
            (0, response_utils_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Products fetched successfully", responseData);
        }
        catch (error) {
            console.error("Error fetching products:", error);
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch products");
        }
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, route_decoder_1.Route)("post", "/add", [cloudinary_upload_1.upload.array('productImages', 5), auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "createProduct", null);
__decorate([
    (0, route_decoder_1.Route)("get", "/view"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllProducts", null);
__decorate([
    (0, route_decoder_1.Route)("get", `/:id/view`),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getSpecificProduct", null);
__decorate([
    (0, route_decoder_1.Route)("delete", "/:id/delete", [auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteProduct", null);
__decorate([
    (0, route_decoder_1.Route)("put", "/:id/update", [cloudinary_upload_1.upload.array('productImages', 5), auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateProduct", null);
__decorate([
    (0, route_decoder_1.Route)("get", "/myProducts/:id", [auth_middleware_1.authenticate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "myProducts", null);
exports.ProductController = ProductController = __decorate([
    (0, controller_decoder_1.Controller)("/product"),
    __metadata("design:paramtypes", [])
], ProductController);
