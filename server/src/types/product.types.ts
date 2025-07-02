// For payment-specific status
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

export enum OrderStatus {
  PENDING = 'pending', 
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

 export enum DeliveryMethod{
    STANDARD= 'standard',
    EXPRESS = 'express'
 }

 export enum PaymentMethod{
  CARD = 'card',
  ONLINE = "online",
  CASH = "cash"
 }
