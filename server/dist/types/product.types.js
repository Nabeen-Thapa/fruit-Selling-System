"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.DeliveryMethod = exports.OrderStatus = exports.PaymentStatus = void 0;
// For payment-specific status
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["CANCELLED"] = "cancelled";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["ACCEPTED"] = "accepted";
    OrderStatus["REJECTED"] = "rejected";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var DeliveryMethod;
(function (DeliveryMethod) {
    DeliveryMethod["STANDARD"] = "STANDARD";
    DeliveryMethod["EXPRESS"] = "EXPRESS";
})(DeliveryMethod || (exports.DeliveryMethod = DeliveryMethod = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["ONLINE"] = "ONLINE";
    PaymentMethod["CASH"] = "CASH";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
