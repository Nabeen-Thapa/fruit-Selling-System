"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = validateDto;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const response_utils_1 = require("./response.utils");
const http_status_codes_1 = require("http-status-codes");
async function validateDto(dtoClass, raw, res) {
    const dto = (0, class_transformer_1.plainToInstance)(dtoClass, raw);
    const errors = await (0, class_validator_1.validate)(dto);
    if (errors.length > 0) {
        const validationError = errors.map(err => ({
            property: err.property,
            constraints: err.constraints
        }));
        console.log("Validation failed:", validationError);
        if (res) {
            (0, response_utils_1.sendError)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, validationError);
        }
        return { valid: false };
    }
    return { valid: true, data: dto };
}
