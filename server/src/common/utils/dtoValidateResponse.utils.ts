import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { Response } from "express";
import { sendError } from "./response.utils";
import { StatusCodes } from "http-status-codes";

export async function validateDto<T extends object>(
    dtoClass: new () => T,
    raw: object,
    res?: Response
): Promise<{ valid: true; data: T } | { valid: false }> {
    const dto = plainToInstance(dtoClass, raw);
    const errors = await validate(dto);

    if (errors.length > 0) {
        const validationError = errors.map(err => ({
            property: err.property,
            constraints: err.constraints
        }));
        if (res) {
            sendError(res, StatusCodes.BAD_REQUEST,validationError);
        }
        return { valid: false };
    }

    return { valid: true, data: dto };
}
