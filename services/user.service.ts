import { IUser } from "../models/user/user.interface";


export class UserService {
  async addToCart(user: IUser, product: any, quant: number): Promise<IUser> {
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

  async removeFromCart(user: IUser, postId: string): Promise<IUser> {
    user.cart.items = user.cart.items.filter(
      item => item.postId.toString() !== postId
    );
    return user.save();
  }

  async clearCart(user: IUser): Promise<IUser> {
    user.cart.items = [];
    return user.save();
  }
}