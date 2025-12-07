"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seller = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("./user.model");
const products_model_1 = require("../../store/models/products.model");
const orders_model_1 = require("../../store/models/orders.model");
let seller = class seller extends user_model_1.User {
    businessName;
    products;
    orders;
};
exports.seller = seller;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], seller.prototype, "businessName", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => products_model_1.Product, (product) => product.sellers),
    __metadata("design:type", Array)
], seller.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => orders_model_1.Orders, orders => orders.sellers),
    __metadata("design:type", orders_model_1.Orders)
], seller.prototype, "orders", void 0);
exports.seller = seller = __decorate([
    (0, typeorm_1.Entity)("sellerDetail")
], seller);
