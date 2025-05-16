export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string,
  shippingAddress: string;
  createdAt: string;
  lastLogin?: string;
}