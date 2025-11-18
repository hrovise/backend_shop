const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const orderSchema = new Schema({
  posts: [{
    post: { type: Object, required: true },
    quantity: {type: Number, required: true}
  }],
  date: {
    type: String,
    required: true
  },

  user: {
    email: {
      type: String,
      required: true
    },
    nameCompany:{
      type: String,
      required: true
    },
    contacts: {
      type: Number,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref:'User'
    }
  },
  dateProcess:{
    type:String
  },
  dateCompleted:{
    type:String
  },
  process: {
    type:String
  },
 code: {
    type: Number
  }

})
module.exports = mongoose.model('Order', orderSchema);
