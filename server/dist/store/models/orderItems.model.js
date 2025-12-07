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
exports.OrdersItems = void 0;
const typeorm_1 = require("typeorm");
const baseDetail_1 = require("./baseDetail");
const orders_model_1 = require("./orders.model");
const products_model_1 = require("./products.model");
let OrdersItems = class OrdersItems extends baseDetail_1.baseDetails {
    order;
    product;
    quantity;
    price;
    totalPrice;
};
exports.OrdersItems = OrdersItems;
__decorate([
    (0, typeorm_1.ManyToOne)(() => orders_model_1.Orders, orders => orders.items),
    __metadata("design:type", orders_model_1.Orders)
], OrdersItems.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => products_model_1.Product),
    __metadata("design:type", products_model_1.Product)
], OrdersItems.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrdersItems.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], OrdersItems.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], OrdersItems.prototype, "totalPrice", void 0);
exports.OrdersItems = OrdersItems = __decorate([
    (0, typeorm_1.Entity)("orderedItems")
], OrdersItems);
