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
exports.Cart = void 0;
const typeorm_1 = require("typeorm");
const baseDetail_1 = require("./baseDetail");
const buyer_model_1 = require("../../users/models/buyer.model");
const cartItems_modal_1 = require("./cartItems.modal");
let Cart = class Cart extends baseDetail_1.baseDetails {
    buyers;
    items;
    totalAmount;
    finalAmount;
};
exports.Cart = Cart;
__decorate([
    (0, typeorm_1.ManyToOne)(() => buyer_model_1.Buyer, buyerCart => buyerCart.carts),
    __metadata("design:type", buyer_model_1.Buyer)
], Cart.prototype, "buyers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cartItems_modal_1.CartItem, CartItem => CartItem.carts, { cascade: ['remove'] }),
    __metadata("design:type", Array)
], Cart.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cart.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cart.prototype, "finalAmount", void 0);
exports.Cart = Cart = __decorate([
    (0, typeorm_1.Entity)("productCart")
], Cart);
