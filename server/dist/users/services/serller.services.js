"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerServices = void 0;
const bcrypt_1 = require("bcrypt");
const dbORM_config_1 = require("../../config/dbORM.config");
const seller_model_1 = require("../models/seller.model");
const response_utils_1 = require("../../common/utils/response.utils");
const http_status_codes_1 = require("http-status-codes");
const buyer_model_1 = require("../models/buyer.model");
class sellerServices {
    sellerRepo = dbORM_config_1.falfulConnection.getRepository(seller_model_1.seller);
    buyerRepo = dbORM_config_1.falfulConnection.getRepository(buyer_model_1.Buyer);
    async sellerRegister(sellerData) {
        const queryRunner = dbORM_config_1.falfulConnection.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const sellerRepo = queryRunner.manager.getRepository(seller_model_1.seller);
            const existingSeller = await sellerRepo.findOne({ where: { email: sellerData.email } });
            if (existingSeller)
                throw new response_utils_1.AppError('seller with this email already exists', http_status_codes_1.StatusCodes.CONFLICT);
            const hashedPassword = await (0, bcrypt_1.hash)(sellerData.password, 10);
            const newSeller = sellerRepo.create({
                ...sellerData,
                password: hashedPassword
            });
            const savedSeller = await queryRunner.manager.save(newSeller);
            await queryRunner.commitTransaction();
            return savedSeller;
        }
        catch (error) {
            console.log("seller service error:", error.message);
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async sellerView(sellerId) {
        const queryRunner = dbORM_config_1.falfulConnection.createQueryRunner();
        try {
            const sellerData = await this.sellerRepo.findOne({ where: { id: sellerId } });
            if (!sellerData)
                throw new response_utils_1.AppError("seller is not found", http_status_codes_1.StatusCodes.BAD_REQUEST);
            return sellerData;
        }
        catch (error) {
            console.error("error in seller view service:", error.message);
            throw error;
        }
    }
    async viewBuyers() {
        try {
            const buyers = await this.buyerRepo.find();
            if (!buyers)
                throw new response_utils_1.AppError("buyers not found", http_status_codes_1.StatusCodes.NOT_ACCEPTABLE);
            return buyers;
        }
        catch (error) {
            console.log("buyer service view all seller :", error.message);
            throw error.message;
        }
    }
    async sellerUpdate(sellerId, updatedData) {
        console.log("seller service back:", updatedData);
        try {
            const seller = await this.sellerRepo.findOne({ where: { id: sellerId } });
            if (!seller)
                throw new response_utils_1.AppError("aou are not authorized", http_status_codes_1.StatusCodes.UNAUTHORIZED);
            const update = await this.sellerRepo.update({ id: sellerId }, { ...updatedData });
            return "success fully updated";
        }
        catch (error) {
            console.log("update buyer data :", error.message);
            throw error.message;
        }
    }
}
exports.sellerServices = sellerServices;
