import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import mongoose from "mongoose";
import { User } from '../user/user.model';


class PostItem {
  @prop({ required: true })
  public post!: Object; 

  @prop({ required: true })
  public quantity!: number;
}
export class Order {
    @prop({ required: true, type: () => [PostItem], default: [] })    
    public posts!: any    

    @prop({ required: true })    
    public date!: string       

    @prop({ required: true, ref:()=>User })                
    public user!: any            

    @prop({ required: true })                
    public dateProcess!: string    

    @prop({ required: true })                
    public dateCompleted!: string   

    @prop({ required: true })                        
    public process!: string    
            
    @prop({ required: true })                        
    public code!: number                    
}


export const OrderModel = getModelForClass(Order);