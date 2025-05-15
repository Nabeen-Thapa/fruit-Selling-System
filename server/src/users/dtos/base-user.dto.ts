import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEmail, IsAlphanumeric, MinLength, IsOptional, IsDateString, Matches, IsPhoneNumber } from "class-validator";

export class baseUserDto {
    @IsString()
    @IsNotEmpty()
    name!: string

    @IsEmail()
    email!: string

    @IsString()
    @MinLength(4)
    // @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, { message: 'Password too weak' })
    password!: string

    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('NP') 
    // @Transform(({ value }) => value.toString())
    phone!: string;

    @IsString()
    address!: string

    @IsOptional()
    @IsDateString()
    lastLogin?: Date;
}