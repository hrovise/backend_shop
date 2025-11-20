import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { get } from 'http';
import mongoose from "mongoose";


export class Category {

    @prop({type:String, required: true})
    public category!: string    
}

export const CategoryModel=getModelForClass(Category);