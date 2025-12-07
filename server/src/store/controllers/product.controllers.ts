import { Request, Response } from 'express';
import multer from 'multer';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ProductService } from '../services/product.services';
import { CreateProductDto } from '../dtos/product.dot';
import { Controller } from '../../common/decorators/controller.decoder';
import { Route } from '../../common/decorators/route.decoder';
import { sendError, sendSuccess } from '../../common/utils/response.utils';
import { StatusCodes } from "http-status-codes";
import { falfulConnection } from '../../config/dbORM.config';
import { upload } from '../../common/utils/cloudinary-upload';
import { authenticate } from '../../users/middleware/auth.middleware';
import { JwtUserPayload, UserPayload } from '../../users/types/auth.types';
import { validateDto } from '../../common/utils/dtoValidateResponse.utils';


@Controller("/product")
export class ProductController {
  private productService: ProductService;

  constructor() {
    // Initialize the service with the data source
    this.productService = new ProductService(falfulConnection);
  }

  
  @Route("post", "/add", [upload.array('productImages', 5), authenticate])
  async createProduct(req: Request, res: Response) {
    try {

      if (!req.files || !req.body) {
        throw new Error("No files or form data received");
      }
      const user = req.user as JwtUserPayload;
      if (!user) throw new Error("Unauthorized access");

      const productData = {
        ...req.body,
        price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        images: req.files,
        userId: user.id,
      };
      const productDto = plainToInstance(CreateProductDto, productData);
      const errors = await validate(productDto);

      if (errors.length > 0) {
        const message = errors.map(err => Object.values(err.constraints || {}).join(", ")).join("; ");
        throw new Error(`Validation failed: ${message}`);
      }
      const product = await this.productService.createProduct(productDto, req.files as Express.Multer.File[]
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

  
  @Route("get", `/:id/view`)
  async getSpecificProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await this.productService.getProduct(id);
      sendSuccess(res, StatusCodes.OK, "Products fetched successfully", product);
    } catch (error) {
      console.error("Error fetching products:", error);
      sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch products");
    }
  }


  @Route("delete", "/:id/delete", [authenticate])
  async deleteProduct(req: Request, res: Response) {
    try {

      if (!req.user) return sendError(res, StatusCodes.UNAUTHORIZED, "you are not authorize to delete product");

      const id = Number(req.params.id);

      const deleteResult = await this.productService.deleteProduct(id);
      return sendSuccess(res, StatusCodes.OK, "Products fetched successfully", deleteResult);
    } catch (error) {
      console.error("Error fetching products:", error);
      sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete products");
    }
  }


  @Route("put", "/:id/update", [upload.array('productImages', 5), authenticate])
  async updateProduct(req: Request, res: Response) {

    try {
      if (!req.files || !req.body) sendError(res, StatusCodes.BAD_REQUEST, "No files or form data received")
        const user = req.user as UserPayload;
      if (!user) return sendError(res, StatusCodes.UNAUTHORIZED, "you are not authorize");


            // Parse and normalize existing images
      let keepImages: { url: string; publicId: string }[] = [];
    const existing = req.body['existingImages[]'];
     if (Array.isArray(existing)) {
      keepImages = existing.map(img => JSON.parse(img));
    } else if (typeof existing === 'string') {
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
      const validateProduct = await validateDto(CreateProductDto, productData, res);
      if (!validateProduct.valid) return;

      const updatedProductResult = await this.productService.updateProduct(Number(req.params.id), validateProduct.data, req.files as Express.Multer.File[], keepImages);
      return sendSuccess(res, StatusCodes.OK, "Product updated successfully", updatedProductResult);
    } catch (error) {
      console.log("error in product update controller:", (error as Error).message);
      sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }


  @Route("get", "/myProducts/:id", [authenticate])
  async myProducts(req: Request, res: Response) {
    try {
      if (!req.user) sendError(res, StatusCodes.UNAUTHORIZED, "yuo are not authorized");
      // const userId = req.user?.id as string;
      const {id} = req.params;

      const myProductResult = await this.productService.getMyProducts(id);
      const responseData = myProductResult.map(product => ({
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