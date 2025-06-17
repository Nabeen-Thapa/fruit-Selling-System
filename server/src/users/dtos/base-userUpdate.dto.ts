import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEmail, IsAlphanumeric, MinLength, IsOptional, IsDateString, Matches, IsPhoneNumber } from "class-validator";

export class baseUserUpdateDto {
    @IsString()
    @IsNotEmpty()
    name!: string

    @IsEmail()
    email!: string

    @IsString()
    @IsNotEmpty()
   // @IsPhoneNumber('NP')
    // @Transform(({ value }) => value.toString())
    phone!: string;

    @IsString()
    address!: string

    @IsOptional()
    @IsDateString()
    lastLogin?: Date;

    @IsString()
    @IsNotEmpty()
    role!: string
}