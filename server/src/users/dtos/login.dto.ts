import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEmail, IsAlphanumeric, MinLength, IsOptional, IsDateString, Matches, IsPhoneNumber } from "class-validator";

export class loginDto {
    @IsEmail()
    email!: string

    @IsString()
    @MinLength(4)
    password!: string

   
}