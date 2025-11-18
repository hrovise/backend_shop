const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator")


const Schema = mongoose.Schema;
const pendingUserSchema = new Schema({

  role: { type: String, required: true },
   name: {
        type: String,
        required: true
    },
    nameCompany: {
        type: String,
        required: true
    },
    city: {
      type: String,
      required: true
    },
    contacts: {
        type:Number,
        required: true
      },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // login: {
    //     type: String,
    //     required: true
    // },

    password: {
        type: String,
        required: true
    },


})

pendingUserSchema.plugin(uniqueValidator);

const pendingUser = module.exports = mongoose.model('pendingUser', pendingUserSchema);
