export enum UserType {
  BUYER = 'buyer',
  SELLER = 'seller'
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  exp?: number;
}

export type LoginSuccess = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
};

export type AlreadyLoggedIn = {
  message: string;
  isAlreadyLoggedIn: boolean;
};

export type LoginResponse = LoginSuccess | AlreadyLoggedIn;