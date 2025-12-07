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
exports.Buyer = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("./user.model");
const cart_model_1 = require("../../store/models/cart.model");
const orders_model_1 = require("../../store/models/orders.model");
let Buyer = class Buyer extends user_model_1.User {
    shippingAddress;
    carts;
    orders;
};
exports.Buyer = Buyer;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Buyer.prototype, "shippingAddress", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cart_model_1.Cart, buyercart => buyercart.buyers),
    __metadata("design:type", Array)
], Buyer.prototype, "carts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => orders_model_1.Orders, orders => orders.buyer),
    __metadata("design:type", orders_model_1.Orders)
], Buyer.prototype, "orders", void 0);
exports.Buyer = Buyer = __decorate([
    (0, typeorm_1.Entity)("buyerDetail")
], Buyer);
