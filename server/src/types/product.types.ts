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
    STANDARD= 'STANDARD',
    EXPRESS = 'EXPRESS'
 }

 export enum PaymentMethod{
  CARD = 'CARD',
  ONLINE = "ONLINE",
  CASH = "CASH"
 }
