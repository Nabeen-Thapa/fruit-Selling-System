import { Request, Response } from 'express';
import { ProductService } from '../services/product.services';

export class ProductController {
  constructor(private productService: ProductService) {}

  async addProduct(req: Request, res: Response) {
    try {
      // 1. Validate required fields
      const requiredFields = ['name', 'price', 'description', 'seller', 'category'];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ error: `${field} is required` });
        }
      }

      // 2. Process request
      const newProduct = await this.productService.createProduct({
        name: req.body.name,
        price: parseFloat(req.body.price),
        description: req.body.description,
        seller: req.body.seller,
        phone: req.body.phone || '',
        email: req.body.email || '',
        quantity: parseInt(req.body.quantity) || 1,
        category: req.body.category,
        images: req.files ? (req.files as Express.Multer.File[]) : []
      });

      // 3. Return response
      res.status(201).json({
        success: true,
        product: newProduct
      });

    } catch (error) {
      console.error('Add product error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to add product',
        details: error
      });
    }
  }
}