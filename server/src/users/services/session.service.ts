// src/modules/auth/services/session.service.ts
import { falfulConnection } from "../../config/dbORM.config";
import { UserSession } from "../models/userSession.model";
import { UserType } from "../types/auth.types";
import { MoreThan } from "typeorm";

export class SessionService {
  private userSessionRepo = falfulConnection.getRepository(UserSession);

  async checkActiveSession(userId: string): Promise<boolean> {
    const existingSession = await this.userSessionRepo.findOne({
      where: {
        userId,
        isValid: true,
        expiresAt: MoreThan(new Date())
      }
    });
    return !!existingSession;
  }

  async createUserSession(
    userId: string,
    token: string,
    userType: UserType,
    expiresAt: Date
  ): Promise<UserSession> {
    const newSession = this.userSessionRepo.create({
      userId,
      userType,
      token,
      isValid: true,
      expiresAt
    });
    return await this.userSessionRepo.save(newSession);
  }

  async invalidateSession(userId: string): Promise<void> {
    await this.userSessionRepo.update(
      { userId, isValid: true },
      { isValid: false }
    );
  }
}