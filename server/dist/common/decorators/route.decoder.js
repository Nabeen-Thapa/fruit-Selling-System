"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE_KEY = void 0;
exports.Route = Route;
require("reflect-metadata");
exports.ROUTE_KEY = Symbol("paramRoutes");
// route.decorator.ts
function Route(method, path, middleware) {
    return function (target, propertyKey) {
        const existingRoutes = Reflect.getMetadata(exports.ROUTE_KEY, target.constructor) || [];
        existingRoutes.push({
            method,
            path,
            handlerName: propertyKey,
            middleware: middleware || []
        });
        Reflect.defineMetadata(exports.ROUTE_KEY, existingRoutes, target.constructor);
    };
}
