import { hash } from "bcrypt";
import { falfulConnection } from "../../config/dbORM.config";
import { serllerDto } from "../dtos/seller.dot";
import { seller } from "../models/seller.model";
import { AppError } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { Buyer } from "../models/buyer.model";
import { serllerUpdateDto } from "../dtos/sellerUpdate.dto";

export class sellerServices {
        private sellerRepo = falfulConnection.getRepository(seller);
        private buyerRepo = falfulConnection.getRepository(Buyer);

    async sellerRegister(sellerData: serllerDto): Promise<seller> {
        const queryRunner = falfulConnection.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const sellerRepo = queryRunner.manager.getRepository(seller);
            const existingSeller = await sellerRepo.findOne({ where: { email: sellerData.email } })
            if (existingSeller) throw new AppError('seller with this email already exists', StatusCodes.CONFLICT);
            const hashedPassword = await hash(sellerData.password, 10);

            const newSeller = sellerRepo.create({
                ...sellerData,
                password: hashedPassword
            });
            const savedSeller = await queryRunner.manager.save(newSeller);

            await queryRunner.commitTransaction();
            return savedSeller;

        } catch (error) {
            console.log("seller service error:", (error as Error).message)
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }

    }

    async sellerView(sellerId: string) {
        const queryRunner = falfulConnection.createQueryRunner();
        try {
           
            const sellerData = await this.sellerRepo.findOne({ where:{ id: sellerId }})
            if(!sellerData) throw new AppError("seller is not found", StatusCodes.BAD_REQUEST);
        
            return sellerData;
        } catch (error) {
            console.error("error in seller view service:", (error as Error).message);
            throw error;
        }
    }

     async viewBuyers() {
        try {
            const buyers = await this.buyerRepo.find();
            if (!buyers) throw new AppError("buyers not found", StatusCodes.NOT_ACCEPTABLE);
            return buyers;
        } catch (error) {
            console.log("buyer service view all seller :", (error as Error).message);
            throw (error as Error).message;
        }
    }

    async sellerUpdate(sellerId :string, updatedData: serllerUpdateDto) {
        console.log("seller service back:",updatedData)
        try {
            const seller = await this.sellerRepo.findOne({where :{id:sellerId}});
            if(!seller) throw new AppError("aou are not authorized", StatusCodes.UNAUTHORIZED);
            const update = await this.sellerRepo.update({ id: sellerId },
        { ...updatedData })
        return "success fully updated";
        } catch (error) {
             console.log("update buyer data :", (error as Error).message);
            throw (error as Error).message;
        }
    } 
}