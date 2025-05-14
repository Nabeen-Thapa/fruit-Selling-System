import { Request, Response } from 'express';
import multer from 'multer';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ProductService } from './product.services';
import { CreateProductDto } from './dtos/product.dot';
import { Controller } from '../decorators/controller.decoder';
import { Route } from '../decorators/route.decoder';
import { sendError, sendSuccess } from '../utils/response.utils';
import { StatusCodes } from "http-status-codes";
import { falfulConnection } from '../config/dbORM.config';

// Multer configuration remains the same
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

@Controller("/product")
export class ProductController {
  private productService: ProductService;

  constructor() {
    // Initialize the service with the data source
    this.productService = new ProductService(falfulConnection);
  }

  @Route("post", "/add", [upload.array('productImages', 5)])
  async createProductController(req: Request, res: Response) {
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
}