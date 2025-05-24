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
const product_services_1 = require("./product.services");
const product_dot_1 = require("./dtos/product.dot");
const controller_decoder_1 = require("../common/decorators/controller.decoder");
const route_decoder_1 = require("../common/decorators/route.decoder");
const response_utils_1 = require("../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const dbORM_config_1 = require("../config/dbORM.config");
const cloudinary_upload_1 = require("../common/utils/cloudinary-upload");
const auth_middleware_1 = require("../users/middleware/auth.middleware");
let ProductController = class ProductController {
    constructor() {
        // Initialize the service with the data source
        this.productService = new product_services_1.ProductService(dbORM_config_1.falfulConnection);
    }
    async createProduct(req, res) {
        try {
            console.log("Request files:", req.files);
            console.log("Request body:", req.body);
            if (!req.files || !req.body) {
                throw new Error("No files or form data received");
            }
            const user = req.user;
            if (!user)
                throw new Error("User not authenticated");
            // Convert string numbers to actual numbers
            const productData = {
                ...req.body,
                price: Number(req.body.price),
                quantity: Number(req.body.quantity),
                images: req.files,
                sellerId: user.id,
                sellerName: user.name,
                sellerEmail: user.email,
                sellerPhone: user.phone
            };
            const productDto = (0, class_transformer_1.plainToInstance)(product_dot_1.CreateProductDto, productData);
            const errors = await (0, class_validator_1.validate)(productDto);
            if (errors.length > 0) {
                const message = errors.map(err => Object.values(err.constraints || {}).join(", ")).join("; ");
                throw new Error(`Validation failed: ${message}`);
            }
            // Process with service
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
exports.ProductController = ProductController = __decorate([
    (0, controller_decoder_1.Controller)("/product"),
    __metadata("design:paramtypes", [])
], ProductController);
