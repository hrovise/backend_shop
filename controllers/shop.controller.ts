import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { CategoryModel } from '../models/category/category.model';
import { CreatePostDto } from '../models/post/postDTO/create-post.dto';
import { PostService } from '../services/posts.service';
import { PostModel } from '../models/post/post.model';
import { CommentModel } from '../models/comment/comment.model';
import { UserModel } from '../models/user/user.model';
import { EmailService } from '../services/email.service';
const jwt = require('jsonwebtoken');
require('dotenv').config();
const IMAGE = '/images/';
const ROLE_ADMIN = 'ADMIN';

const postService = new PostService();
const emailService = new EmailService();


export const deleteFromCart = async  (req:Request, res:Response) => {
    let postId = req.params.id;

   try {
        await UserModel.updateOne({ _id: req.userData.userId }, { $pull: { cart: postId } });
        res.json({ message: 'items deleted' });
   }
   
   catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
 
}