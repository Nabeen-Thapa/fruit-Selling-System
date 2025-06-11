import { IsNotEmpty, IsString } from "class-validator";

export class chatDto {

    @IsString()
    @IsNotEmpty()
    senderId!: string;

    @IsString()
    @IsNotEmpty()
    receiverId!: string;

    @IsString()
    @IsNotEmpty()
    message!: string;
}