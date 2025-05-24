export enum UserType {
  BUYER = 'buyer',
  SELLER = 'seller'
}

export interface TokenPayload {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export type LoginSuccess = {
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
};

export type AlreadyLoggedIn = {
  message: string;
  isAlreadyLoggedIn: boolean;
};

export type LoginResponse = LoginSuccess | AlreadyLoggedIn;

export interface SellerLoginData {
  email: string;
  password: string;
}

export interface LoginResponses {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
}


export interface UserPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}


export interface JwtUserPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

