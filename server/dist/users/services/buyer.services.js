"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyerServices = void 0;
const bcrypt_1 = require("bcrypt");
const dbORM_config_1 = require("../../config/dbORM.config");
const buyer_model_1 = require("../models/buyer.model");
const seller_model_1 = require("../models/seller.model");
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
class buyerServices {
    buyerRepo = dbORM_config_1.falfulConnection.getRepository(buyer_model_1.Buyer);
    sellerRepo = dbORM_config_1.falfulConnection.getRepository(seller_model_1.seller);
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
    async buyerView(buyerId) {
        try {
            const buyerData = await this.buyerRepo.findOne({ where: { id: buyerId } });
            if (!buyerData)
                throw new response_utils_1.AppError("buyer is not found", http_status_codes_1.StatusCodes.BAD_REQUEST);
            return buyerData;
        }
        catch (error) {
            console.error("error in buyer view service:", error.message);
            throw error;
        }
    }
    async viewAllSellers() {
        try {
            const sellers = await this.sellerRepo.find();
            if (!sellers)
                throw new response_utils_1.AppError("sellers not found", http_status_codes_1.StatusCodes.NOT_ACCEPTABLE);
            return sellers;
        }
        catch (error) {
            console.log("buyer service view all seller :", error.message);
            throw error.message;
        }
    }
    async buyerUpdate(buyerId, buyerData) {
        try {
            const buyer = await this.buyerRepo.findOne({ where: { id: buyerId } });
            if (!buyer)
                throw new response_utils_1.AppError("buyer is not foud for update", http_status_codes_1.StatusCodes.UNAUTHORIZED);
            await this.buyerRepo.update({ id: buyerId }, { ...buyerData });
            return "buyer fully updated";
        }
        catch (error) {
            console.log("update buyer data :", error.message);
            throw error.message;
        }
    }
}
exports.buyerServices = buyerServices;
