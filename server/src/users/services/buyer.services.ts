import { hash } from "bcrypt";
import { falfulConnection } from "../../config/dbORM.config";
import { buyerDto } from "../dtos/buyer.dto";
import { buyer } from "../models/buyer.model";
import { seller } from "../models/seller.model";
import { AppError } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { buyerUpdateDto } from "../dtos/buyerUpdated.dto";

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

    async buyerView(buyerId: string) {
        try {
            const buyerData = await this.buyerRepo.findOne({ where: { id: buyerId } })
            if (!buyerData) throw new AppError("buyer is not found", StatusCodes.BAD_REQUEST);

            return buyerData;
        } catch (error) {
            console.error("error in buyer view service:", (error as Error).message);
            throw error;
        }
    }

    async viewAllSellers() {
        try {
            const sellers = await this.sellerRepo.find();
            if (!sellers) throw new AppError("sellers not found", StatusCodes.NOT_ACCEPTABLE);
            return sellers;
        } catch (error) {
            console.log("buyer service view all seller :", (error as Error).message);
            throw (error as Error).message;
        }
    }

    async buyerUpdate(buyerId: string, buyerData: buyerUpdateDto) {
        try {
            const buyer = await this.buyerRepo.findOne({ where: { id: buyerId } });
            if (!buyer) throw new AppError("buyer is not foud for update", StatusCodes.UNAUTHORIZED);
            await this.buyerRepo.update({ id: buyerId }, { ...buyerData });
            return "buyer fully updated"
        } catch (error) {
            console.log("update buyer data :", (error as Error).message);
            throw (error as Error).message;
        }

    }
}