const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = mongoose.Schema({
  category: {type:String, required: true},
  title: { type: String, required: true },
  price: {type: Number, required: true},
  content: { type: String, required: true },
  contentLarge: { type: String, required: true },
  quantity: {type: [], required: true},
  imagePath: { type: String, required: true },
   userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "Comment",

    },
});

module.exports = mongoose.model('Post', postSchema);
