import { PendingUserModel } from "../models/user/pendingUser.model";
import { createUserDto } from "../models/user/user-dto/create-user.dto";
import { User, UserModel } from "../models/user/user.model";
import { DocumentType } from '@typegoose/typegoose';



export class UserService {



  // async saveUser(user: createUserDto): Promise<User> {
    
  //  todo
  // }


  async addToCart(user: DocumentType<User>, product: any, quant: number): Promise<DocumentType<User>> {
    const cartProductIndex = user.cart.items.findIndex(
      cp => cp.postId.toString() === product._id.toString()
    );

    let newQuantity = quant;
    const updatedCartItems = [...user.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity += user.cart.items[cartProductIndex].quantity;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        postId: product._id,
        quantity: newQuantity,
        imagePath: product.imagePath
      });
    }

    user.cart.items = updatedCartItems;
    return user.save();
  }

  async removeFromCart(user: DocumentType<User>, postId: string): Promise<DocumentType<User>> {
    user.cart.items = user.cart.items.filter(
      item => item.postId.toString() !== postId
    );
    return user.save();
  }

  async clearCart(user: DocumentType<User>): Promise<DocumentType<User>> {
    user.cart.items = [];
    return user.save();
  }


  async checkExistingUser(email: string): Promise<boolean> {
    
     const user= await UserModel.findOne({ email: email })
          
       const pendingUser=  await PendingUserModel.findOne({ email: email})
       

        return !!(user || pendingUser)
        

  }
}