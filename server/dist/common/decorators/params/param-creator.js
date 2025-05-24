"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parameterDecorator = parameterDecorator;
require("reflect-metadata");
function parameterDecorator(type, key) {
    return (target, methodName, paramIndex) => {
        const existingParams = Reflect.getOwnMetadata("custom:params", target, methodName) || [];
        existingParams.push({ index: paramIndex, type, key });
        Reflect.defineMetadata("custom:params", existingParams, target, methodName);
    };
}
