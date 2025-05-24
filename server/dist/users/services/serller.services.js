"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerServices = void 0;
const bcrypt_1 = require("bcrypt");
const dbORM_config_1 = require("../../config/dbORM.config");
const seller_model_1 = require("../models/seller.model");
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
class sellerServices {
    constructor() {
        this.sellerRepo = dbORM_config_1.falfulConnection.getRepository(seller_model_1.seller);
    }
    async sellerRegister(sellerData) {
        const queryRunner = dbORM_config_1.falfulConnection.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const existingSeller = await this.sellerRepo.findOne({ where: { email: sellerData.email } });
            if (existingSeller)
                throw new response_utils_1.AppError('seller with this email already exists', http_status_codes_1.StatusCodes.CONFLICT);
            const hashedPassword = await (0, bcrypt_1.hash)(sellerData.password, 10);
            const newSeller = this.sellerRepo.create({
                ...sellerData,
                password: hashedPassword
            });
            const savedSeller = await queryRunner.manager.save(newSeller);
            await queryRunner.commitTransaction();
            return savedSeller;
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
exports.sellerServices = sellerServices;
