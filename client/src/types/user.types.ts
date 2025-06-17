
export type LoginFormProps = {
  userType: "seller" | "buyer";
};

export enum UserType {
  BUYER = 'buyer',
  SELLER = 'seller'
}

export enum loginUserType {
    SELLER  ="seller",
    BUYER = "buyer"
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt?: string;
}