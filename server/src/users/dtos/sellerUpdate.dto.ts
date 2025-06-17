import { IsOptional, IsString, Length } from "class-validator";
import { baseUserDto } from "./base-user.dto";
import { baseUserUpdateDto } from "./base-userUpdate.dto";

export class serllerUpdateDto extends baseUserUpdateDto{
 
    @IsString()
    @Length(2, 100)
    @IsOptional()
  businessName?: string;
}