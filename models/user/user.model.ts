import mongoose, { Schema } from "mongoose";
import  { IUser } from "./user.interface";

const userSchema = new Schema<IUser>({
  role: { type: String, required: true },
  name: { type: String, required: true },
  nameCompany: { type: String, required: true },
  city: { type: String, required: true },
  contacts: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: {
    items: [
      {
        postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
        quantity: { type: Number, required: true },
        imagePath: { type: String, required: true },
      },
    ],
  },
  commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
  accessHashId: { type: Schema.Types.ObjectId, ref: "accessHash" },
  status: { type: String },
});

// METHODS
userSchema.methods.addToCart = async function (product, quant) {
  const idx = this.cart.items.findIndex(
    (cp) => cp.postId.toString() === product._id.toString()
  );

  let newQuantity = quant;
  const updated = [...this.cart.items];

  if (idx >= 0) {
    newQuantity = this.cart.items[idx].quantity + quant;
    updated[idx].quantity = newQuantity;
  } else {
    updated.push({
      postId: product._id,
      quantity: newQuantity,
      imagePath: product.imagePath,
    });
  }

  this.cart.items = updated;
  return this.save();
};

userSchema.methods.removeFromCart = function (postId) {
  this.cart.items = this.cart.items.filter(
    (item) => item.postId.toString() !== postId
  );
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart.items = [];
  return this.save();
};

export const UserModel = mongoose.model<IUser>("User", userSchema);