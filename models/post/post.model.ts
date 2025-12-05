import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import mongoose from "mongoose";
import { User } from '../user/user.model';
import { Comment } from '../comment/comment.model';


export class Post {

    @prop({ required: true })    
    public category!: string

    @prop({ required: true })            
    public title!: string

    @prop({ required: true })            
    public price!: number

    @prop({ required: true })            
    public content!: string

    @prop({ required: true })            
    public contentLarge!: string

    @prop({ required: true, type:()=>[Number] })            
    public quantity!: number[]

    @prop({ required: true })            
    public imagePath!: string

    @prop({ required: true, ref:()=>User })            
    public userId!: mongoose.Types.ObjectId

    @prop({ ref: ()=> Comment})            
    public commentId!: mongoose.Types.ObjectId  
}


export const PostModel = getModelForClass(Post);    