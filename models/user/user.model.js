"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
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
                postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
                quantity: { type: Number, required: true },
                imagePath: { type: String, required: true }
            }
        ]
    },
    commentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
    accessHashId: { type: Schema.Types.ObjectId, ref: 'accessHash' },
    status: { type: String }
});
userSchema.plugin(mongoose_unique_validator_1.default);
userSchema.methods.addToCart = async function (product, quant) {
    const cartProductIndex = await this.cart.items.findIndex((cp) => {
        return cp.postId.toString() === product._id.toString();
    });
    let newQuantity = quant; //25/1000
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + quant; //25/1000/
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    else {
        updatedCartItems
            .push({ postId: product._id, quantity: newQuantity, imagePath: product.imagePath });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    let i = 0;
    return this.save();
};
userSchema.methods.removeFromCart = function (postId) {
    const updatedCartItems = this.cart.items.filter((item) => {
        return item._id.toString() !== postId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};
userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
};
module.exports = mongoose_1.default.model('User', userSchema);
