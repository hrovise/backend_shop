import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import mongoose  from "mongoose";



export class AccessHash {
  @prop({ required: true, ref: 'User' }) // Ссылка на модель 'User' (даже если она на чистом Mongoose)
  public userId!: mongoose.Types.ObjectId
}


export const AccessHashModel=getModelForClass(AccessHash);
