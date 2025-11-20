import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import mongoose from "mongoose";


export class Comment {

    @prop({ required: true })
    public content!: string 

    @prop({ required: true })    
    public email!: string

    @prop({ required: true })        
    public name!: string

    @prop({ required: true, ref: 'User' })        
    public userId!: mongoose.Types.ObjectId 

    @prop({ required: true, ref: 'Post' })        
    public postId!: mongoose.Types.ObjectId 

    @prop({ required: true })        
    public date!: string            
}

export const CommentModel = getModelForClass(Comment);