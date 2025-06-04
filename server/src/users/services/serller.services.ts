import { hash } from "bcrypt";
import { falfulConnection } from "../../config/dbORM.config";
import { serllerDto } from "../dtos/seller.dot";
import { seller } from "../models/seller.model";
import { AppError } from "../../common/utils/response.utils";
import { StatusCodes } from "http-status-codes";

export class sellerServices {
    private sellerRepo = falfulConnection.getRepository(seller);

    async sellerRegister(sellerData: serllerDto): Promise<seller> {
        console.log("seller service");
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

    async sellerUpdate(){
       
    }
}