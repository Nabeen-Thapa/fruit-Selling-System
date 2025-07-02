import { IsNumber, IsString } from "class-validator";
import { DeliveryMethod, PaymentMethod } from "../../types/product.types";

export class ordersDtos {
    @IsString()
    deliveryAddress!: string;

    @IsString()
    deliveryMethod!: DeliveryMethod;

    @IsString()
    paymentMethod!: PaymentMethod;
}