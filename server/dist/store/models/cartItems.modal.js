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
exports.CartItem = void 0;
const typeorm_1 = require("typeorm");
const baseDetail_1 = require("./baseDetail");
const cart_model_1 = require("./cart.model");
const products_model_1 = require("./products.model");
let CartItem = class CartItem extends baseDetail_1.baseDetails {
    carts;
    product;
    quantity;
    price;
    totalPrice;
};
exports.CartItem = CartItem;
__decorate([
    (0, typeorm_1.ManyToOne)(() => cart_model_1.Cart, cart => cart.items),
    __metadata("design:type", cart_model_1.Cart)
], CartItem.prototype, "carts", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => products_model_1.Product),
    __metadata("design:type", products_model_1.Product)
], CartItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CartItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 }) // or use float
    ,
    __metadata("design:type", Number)
], CartItem.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], CartItem.prototype, "totalPrice", void 0);
exports.CartItem = CartItem = __decorate([
    (0, typeorm_1.Entity)("cartItem")
], CartItem);
