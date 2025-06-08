import { hash } from "bcrypt";
import { falfulConnection } from "../../config/dbORM.config";
import { buyerDto } from "../dtos/buyer.dto";
import { buyer } from "../models/buyer.model";
import { seller } from "../models/seller.model";
import { AppError } from "src/common/utils/response.utils";
import { StatusCodes } from "http-status-codes";

export class buyerServices {
    private buyerRepo = falfulConnection.getRepository(buyer)
    private sellerRepo = falfulConnection.getRepository(seller)

    async buyerRegister(buyerData: buyerDto): Promise<buyer> {
        const queryRunner = falfulConnection.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const existingBuyer = await this.buyerRepo.findOne({ where: { email: buyerData.email } })
            if (existingBuyer) throw new Error('Buyer with this email already exists');


            const hashedPassword = await hash(buyerData.password, 10);
            const newBuyer = this.buyerRepo.create({
                ...buyerData,
                password: hashedPassword
            });

            const savedBuyer = await queryRunner.manager.save(newBuyer)

            await queryRunner.commitTransaction();
            return savedBuyer;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }

    }

    async viewAllSellers(){
       try {
         const sellers = this.sellerRepo.find();
        if(!sellers) throw new AppError("sellers not found", StatusCodes.NOT_ACCEPTABLE);

        return sellers;
       } catch (error) {
            console.log("buyer service view all seller :", (error as Error).message);
            throw (error as Error).message;
       }
    }
}