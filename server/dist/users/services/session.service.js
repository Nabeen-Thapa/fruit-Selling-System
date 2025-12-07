"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
// src/modules/auth/services/session.service.ts
const dbORM_config_1 = require("../../config/dbORM.config");
const userSession_model_1 = require("../models/userSession.model");
const typeorm_1 = require("typeorm");
class SessionService {
    userSessionRepo = dbORM_config_1.falfulConnection.getRepository(userSession_model_1.UserSession);
    async checkActiveSession(userId) {
        const existingSession = await this.userSessionRepo.findOne({
            where: {
                userId,
                isValid: true,
                expiresAt: (0, typeorm_1.MoreThan)(new Date())
            }
        });
        return !!existingSession;
    }
    async createUserSession(userId, token, userType, expiresAt) {
        const newSession = this.userSessionRepo.create({
            userId,
            userType,
            token,
            isValid: true,
            expiresAt
        });
        return await this.userSessionRepo.save(newSession);
    }
    async invalidateSession(userId) {
        await this.userSessionRepo.update({ userId, isValid: true }, { isValid: false });
    }
}
exports.SessionService = SessionService;
