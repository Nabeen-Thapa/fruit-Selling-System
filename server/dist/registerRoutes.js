"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const express_1 = require("express");
const controller_decoder_1 = require("./common/decorators/controller.decoder");
const route_decoder_1 = require("./common/decorators/route.decoder");
function registerRoutes(app, controllers) {
    controllers.forEach(ControllerClass => {
        // Get controller metadata
        const basePath = Reflect.getMetadata(controller_decoder_1.CONTROLLER_KEY, ControllerClass);
        if (!basePath) {
            throw new Error(`No controller path found for ${ControllerClass.name}`);
        }
        const controllerInstance = new ControllerClass();
        const router = (0, express_1.Router)();
        // Get all route definitions
        const routes = Reflect.getMetadata(route_decoder_1.ROUTE_KEY, ControllerClass) || [];
        // Register each route
        routes.forEach(route => {
            const { method, path, handlerName, middleware = [] } = route;
            const handler = controllerInstance[handlerName].bind(controllerInstance);
            if (typeof router[method.toLowerCase()] !== 'function') {
                throw new Error(`Invalid HTTP method: ${method}`);
            }
            // Register with Express router
            router[method.toLowerCase()](path, ...middleware, handler);
        });
        app.use(basePath, router);
    });
}
