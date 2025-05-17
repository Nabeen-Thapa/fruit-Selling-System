import { falfulConnection } from "../../config/dbORM.config";
import { serllerDto } from "../dtos/seller.dot";
import { seller } from "../models/seller.model";

export class sellerServices {
    private sellerRepo = falfulConnection.getRepository(seller)

    async sellerRegister(sellerData: serllerDto): Promise<seller> {
        const queryRunner = falfulConnection.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const existingSeller = await this.sellerRepo.findOne({ where: { email: sellerData.email } })
            if (existingSeller) throw new Error('Buyer with this email already exists');

            const newBuyer = this.sellerRepo.create()
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