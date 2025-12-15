import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { CategoryModel } from '../models/category/category.model';
import { CreatePostDto } from '../models/post/postDTO/create-post.dto';
import { PostService } from '../services/posts.service';
import { PostModel } from '../models/post/post.model';
import { CommentModel } from '../models/comment/comment.model';
import { UserModel } from '../models/user/user.model';
import { EmailService } from '../services/email.service';
import { OrderModel } from '../models/order/order.model';
import { isDocument } from '@typegoose/typegoose';
const jwt = require('jsonwebtoken');
require('dotenv').config();
const IMAGE = '/images/';
const ROLE_ADMIN = 'ADMIN';

const postService = new PostService();
const emailService = new EmailService();
const Process = ({
  ORDERED: 'ordered',
  INPROCESS: 'process',
  FINISHED: 'finished',
  DENIED: 'denied'

})

export const deleteFromCart = async  (req:Request, res:Response) => {
    let postId = req.params.id;

   try {
        await UserModel.updateOne({ _id: req.userData.userId }, { $pull: { "cart.items": {postId:postId} } });
        res.json({ message: 'items deleted' });
   }
   
   catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
 
}


export const orderCreate = async (req:Request, res:Response) => {
 
 
 const user = await UserModel.findById(req.userData.userId);

 const posts = await user.populate('cart.items.postId');
 const orderItems = user.cart.items.map(i => {
     if (!isDocument(i.postId)) return null;
     return {
        quantity: i.quantity,
        
        post: { ...i.postId.toObject() } 
    };
}).filter(i => i !== null);
await user.clearCart();

 const order = new OrderModel({
        date: req.body.date,
        user: {
            email: req.userData.email,

            nameCompany: req.userData.nameCompany,
            contacts: req.userData.contacts,
            city: req.userData.city,            
            userId: req.userData._id
        },
        posts: orderItems,
        process: Process.ORDERED,   
 });
 return order.save();
 
   };


export const cartId = async (req:Request, res:Response) => {

let postId = req.params.id;
  let insideUser;
  let quantity = +req.body.quantity;


   UserModel.findById({ _id: req.userData.userId, })
    .then(user => {

      return insideUser = user;
    });


  PostModel.findById(postId).then(product => {


    return UserModel.findById(req.userData.userId).then(user => {
      user.addToCart(product, quantity); //req.body.25/1000/200
    })

  }).then(() => {
    res.json('success')
  })
}

export const cartAll =  async (req:Request, res:Response) => {
    
  const user = await UserModel.findById(req.userData.userId);
  const posts = await user.populate('cart.items.postId');
  res.json(posts.cart.items);
}

export const orderStatus = async (req:Request, res:Response) => {


    await OrderModel.updateOne({ _id: req.body.id },
    {
      process:req.body.process
   }

 ).then(order => {

    res.status(200).json({
          message: 'status changed'



        })
  })
}