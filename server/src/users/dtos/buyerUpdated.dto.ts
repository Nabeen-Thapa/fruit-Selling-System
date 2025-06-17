import { IsOptional, IsString } from "class-validator";
import { baseUserUpdateDto } from "./base-userUpdate.dto";


export class buyerUpdateDto extends baseUserUpdateDto{
    @IsString()
        @IsOptional()
    shippingAddress?:string;
}