import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import mongoose from "mongoose";
import { AccessHash } from './access_hash/access_hash.model';

class CartItem {
  @prop({ required: true, ref: 'Post' }) // Ссылка на модель 'Post' (даже если она на чистом Mongoose)
  public postId!: mongoose.Types.ObjectId;

  @prop({ required: true })
  public quantity!: number;

  @prop({ required: true })
  public imagePath!: string;
}

class Cart {
  @prop({ type: () => [CartItem], default: [] }) 
  public items!: CartItem[];
}

export class User {
  @prop({ required: true })
  public role!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: true})

  public contacts!: string;
  @prop({ _id: false }) 
  public cart!: Cart;

 
  @prop({ ref: 'Comment' }) 
  public commentId?: mongoose.Types.ObjectId;

  @prop({ ref:() =>AccessHash }) 
  public accessHashId?: mongoose.Types.ObjectId;





}

export const UserModel = getModelForClass(User);