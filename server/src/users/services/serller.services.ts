import { falfulConnection } from "../../config/dbORM.config";
import { buyer } from "../models/buyer.model";
import { seller } from "../models/seller.model";

export class sellerServices{
    private seller = falfulConnection.getRepository(seller)
    private buyer = falfulConnection.getRepository(buyer);

    async sellerRegister(){
        
    }
}