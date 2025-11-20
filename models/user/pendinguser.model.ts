import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import mongoose  from "mongoose";



export class PendingUser {
    @prop({ required: true })
    public role!: string        
    @prop({ required: true })
    public name!: string        
    @prop({ required: true })
    public nameCompany!: string        
    @prop({ required: true })
    public city!: string        
    @prop({ required: true })
    public contacts!: number        
    @prop({ required: true })
    public email!: string        
    // @prop({ required: true })
    // public login!: string        
    @prop({ required: true })
    public password!: string        
}



export const PendingUserModel = getModelForClass(PendingUser);