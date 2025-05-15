import { IsOptional, IsString, Length } from "class-validator";
import { baseUserDto } from "./base-user.dto";

export class serllerDto extends baseUserDto{
 
    @IsString()
    @Length(2, 100)
    @IsOptional()
  businessName?: string;
}