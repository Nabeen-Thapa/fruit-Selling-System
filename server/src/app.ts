import "reflect-metadata"; 
import express, { NextFunction, Request, Response } from 'express';
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import cors from "cors";
import { registerRoutes } from "./registerRoutes";
import { ProductController } from "./products/product.controllers";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Important middlewares
 app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:3000', // Or your frontend URL
//   credentials: true
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


registerRoutes(app, [ProductController]);


// Error handling middleware (add at the end)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});