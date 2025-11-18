import { Document, Types } from "mongoose";

export interface CartItem {
  postId: Types.ObjectId;
  quantity: number;
  imagePath: string;
}

export interface Cart {
  items: CartItem[];
}

export interface IUser extends Document {
  role: string;
  name: string;
  nameCompany: string;
  city: string;
  contacts: number;
  email: string;
  password: string;
  cart: Cart;
  commentId?: Types.ObjectId;
  accessHashId?: Types.ObjectId;
  status?: string;

  addToCart(product: { _id: Types.ObjectId; imagePath: string }, quantity: number): Promise<IUser>;
  removeFromCart(postId: Types.ObjectId): Promise<IUser>;
  clearCart(): Promise<IUser>;
}