import { Request, Response } from 'express';
import multer from 'multer';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ProductService } from './product.services';
import { CreateProductDto } from './dtos/product.dot';
import { Controller } from '../common/decorators/controller.decoder';
import { Route } from '../common/decorators/route.decoder';
import { sendError, sendSuccess } from '../common/utils/response.utils';
import { StatusCodes } from "http-status-codes";
import { falfulConnection } from '../config/dbORM.config';
import { upload } from '../common/utils/cloudinary-upload';


@Controller("/product")
export class ProductController {
  private productService: ProductService;

  constructor() {
    // Initialize the service with the data source
    this.productService = new ProductService(falfulConnection);
  }

   @Route("post", "/add", [upload.array('productImages', 5)])
  async createProduct(req: Request, res: Response) {
    try {
      console.log("Request files:", req.files);
      console.log("Request body:", req.body);

      if (!req.files || !req.body) {
        throw new Error("No files or form data received");
      }

      // Convert string numbers to actual numbers
      const productData = {
        ...req.body,
        price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        images: req.files
      };

      const productDto = plainToInstance(CreateProductDto, productData);
      const errors = await validate(productDto);
      
      if (errors.length > 0) {
        const message = errors.map(err => Object.values(err.constraints || {}).join(", ")).join("; ");
        throw new Error(`Validation failed: ${message}`);
      }

      // Process with service
      const product = await this.productService.createProduct(
        productDto,
        req.files as Express.Multer.File[]
      );
      
      sendSuccess(res, StatusCodes.CREATED, "Product added successfully", product);
      
    } catch (error) {
      console.error("Error creating product:", error);
      sendError(res, StatusCodes.BAD_REQUEST, error instanceof Error ? error.message : 'Unknown error');
    }
  }


@Route("get", "/view")
async getAllProducts(req: Request, res: Response) {
  try {
    const products = await this.productService.getAllProducts();
    
    // Ensure numeric fields are properly typed
    const responseData = products.map(product => ({
      ...product,
      price: Number(product.price),
      quantity: Number(product.quantity)
    }));
    
    sendSuccess(res, StatusCodes.OK, "Products fetched successfully", responseData);
  } catch (error) {
    console.error("Error fetching products:", error);
    sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch products");
  }
}
}