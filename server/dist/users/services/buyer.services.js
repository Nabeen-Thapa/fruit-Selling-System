"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyerServices = void 0;
const bcrypt_1 = require("bcrypt");
const dbORM_config_1 = require("../../config/dbORM.config");
const buyer_model_1 = require("../models/buyer.model");
class buyerServices {
    constructor() {
        this.buyerRepo = dbORM_config_1.falfulConnection.getRepository(buyer_model_1.buyer);
    }
    async buyerRegister(buyerData) {
        const queryRunner = dbORM_config_1.falfulConnection.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const existingBuyer = await this.buyerRepo.findOne({ where: { email: buyerData.email } });
            if (existingBuyer)
                throw new Error('Buyer with this email already exists');
            const hashedPassword = await (0, bcrypt_1.hash)(buyerData.password, 10);
            const newBuyer = this.buyerRepo.create({
                ...buyerData,
                password: hashedPassword
            });
            const savedBuyer = await queryRunner.manager.save(newBuyer);
            await queryRunner.commitTransaction();
            return savedBuyer;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.buyerServices = buyerServices;
