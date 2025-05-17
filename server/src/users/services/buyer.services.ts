import { falfulConnection } from "../../config/dbORM.config";
import { buyerDto } from "../dtos/buyer.dto";
import { buyer } from "../models/buyer.model";

export class buyerServices {
    private buyerRepo = falfulConnection.getRepository(buyer)

    async buyerRegister(buyerData: buyerDto): Promise<buyer> {
        const queryRunner = falfulConnection.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const existingBuyer = await this.buyerRepo.findOne({ where: { email: buyerData.email } })
            if (existingBuyer) throw new Error('Buyer with this email already exists');

            const newBuyer = this.buyerRepo.create(buyerData)
            const savedBuyer = await queryRunner.manager.save(newBuyer)

            await queryRunner.commitTransaction();
            return savedBuyer;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        }finally {
            await queryRunner.release();
        }

    }

    
}