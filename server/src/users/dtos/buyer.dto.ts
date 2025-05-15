import { IsString } from "class-validator";
import { baseUserDto } from "./base-user.dto";

export class buyerDto extends baseUserDto{
    @IsString()
    shippingAddress!:string;
}