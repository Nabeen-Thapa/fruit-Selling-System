"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTROLLER_KEY = void 0;
exports.Controller = Controller;
require("reflect-metadata");
exports.CONTROLLER_KEY = Symbol("controller");
function Controller(basePath) {
    return function (target) {
        Reflect.defineMetadata(exports.CONTROLLER_KEY, basePath, target);
    };
}
