import { 
  IsString, IsNumber, IsPositive, IsEmail, 
  IsPhoneNumber, IsIn, Min, MinLength, 
  IsNotEmpty, IsOptional, IsArray 
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  price!: number;

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  quantity!: number;

 

  @IsIn(['fruit', 'berry', 'tropical'])
  @IsOptional()
  category?: string;
   
  @IsString()
  @IsIn(['kg', 'dorzen', 'pices'])
  quantityType?: string;

  @IsArray()
  @IsOptional()
  images?: Express.Multer.File[];
}