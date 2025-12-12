import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import mongoose from "mongoose";
import { AccessHash } from './access_hash/access_hash.model';
import { Post } from '../post/post.model';
import  { DocumentType } from '@typegoose/typegoose';
class CartItem {
  @prop({ required: true, ref:() => Post }) // Ссылка на модель 'Post' (даже если она на чистом Mongoose)
  public postId!: Ref<Post>;

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


public async clearCart(this: DocumentType<User>) {
   
    this.cart = { items: [] }; 
    
   
    return this.save(); 
  }
public async addToCart (this:DocumentType<User>, product, quant, ) { //25,1000

      const cartProductIndex = await this.cart.items.findIndex(cp => {

            return cp.postId.toString() === product._id.toString();
        });
        let newQuantity = quant; //25/1000
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + quant;//25/1000/
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems
                .push({postId: product._id, quantity: newQuantity, imagePath: product.imagePath  })
        }

        const updatedCart = {
      items: updatedCartItems
    };



  this.cart = updatedCart;
  let i = 0;

  return this.save();


}  

}


export const UserModel = getModelForClass(User);