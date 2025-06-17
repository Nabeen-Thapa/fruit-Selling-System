export interface Seller {
  id: string;
  name: string;
  email: string;
  password: string,
  phone: string;
  address: string;
  businessName: string,
  createdAt: string;
  lastLogin?: string;
}

 export interface usersView {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string | Date;
  lastLogin: string | Date | null;
  role: string;
  businessName: string;
  shippingAddress:string;
}