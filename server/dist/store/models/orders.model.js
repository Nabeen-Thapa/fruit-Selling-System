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
exports.Orders = void 0;
const typeorm_1 = require("typeorm");
const baseDetail_1 = require("./baseDetail");
const buyer_model_1 = require("../../users/models/buyer.model");
const orderItems_model_1 = require("./orderItems.model");
const product_types_1 = require("../../types/product.types");
const seller_model_1 = require("../../users/models/seller.model");
let Orders = class Orders extends baseDetail_1.baseDetails {
    buyer;
    sellers;
    items;
    paymentMethod;
    paymentStatus;
    OrderStatus;
    deliveryMethod;
    deliveryAddress;
    subtotal;
    tax;
    deliveryFee;
    totalAmount;
};
exports.Orders = Orders;
__decorate([
    (0, typeorm_1.ManyToOne)(() => buyer_model_1.Buyer, buyer => buyer.orders),
    __metadata("design:type", buyer_model_1.Buyer)
], Orders.prototype, "buyer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => seller_model_1.seller, seller => seller.orders),
    __metadata("design:type", seller_model_1.seller)
], Orders.prototype, "sellers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => orderItems_model_1.OrdersItems, item => item.order, { cascade: true }),
    __metadata("design:type", Array)
], Orders.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: product_types_1.PaymentMethod, default: product_types_1.PaymentMethod.ONLINE }),
    __metadata("design:type", String)
], Orders.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: product_types_1.PaymentStatus, default: product_types_1.PaymentStatus.PENDING }),
    __metadata("design:type", String)
], Orders.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: product_types_1.OrderStatus, default: product_types_1.OrderStatus.PENDING }),
    __metadata("design:type", String)
], Orders.prototype, "OrderStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: product_types_1.DeliveryMethod, default: product_types_1.DeliveryMethod.EXPRESS }),
    __metadata("design:type", String)
], Orders.prototype, "deliveryMethod", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Orders.prototype, "deliveryAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Orders.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Orders.prototype, "tax", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Orders.prototype, "deliveryFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Orders.prototype, "totalAmount", void 0);
exports.Orders = Orders = __decorate([
    (0, typeorm_1.Entity)("orders")
], Orders);
