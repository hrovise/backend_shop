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

export const createCategory = async (req:Request, res:Response) => {

   
    const category = new CategoryModel({
      category: req.body.category,

    });

    category.save()
      .then(createdPost => {
        res.status(201).json({
          message: 'Post added',
          post: {

            ...createdPost, //spread operator для айтемов
            id: createdPost._id
            // title: createdPost.title,
            // content: createdPost.content,
            // imagePath: createdPost.imagePath
          }
        });
      });
}


export const createPost = async (req:Request, res:Response) => {
 
  
  if (req.userData.role === ROLE_ADMIN) {
    const post:CreatePostDto ={
      category: req.body.category,
      title: req.body.title,
      price: req.body.price,
      content: req.body.content,
      contentLarge: req.body.contentLarge,
     quantity: req.body.quantity.split(',').map((item: string) => parseInt(item, 10)),
      imagePath: req.file.path,
      userId: req.userData.userId
    }

   
      try {

  const createdPost = await postService.savePost(post);
 
  res.status(201).json({
    message: 'Post added',
    post: {
      ...createdPost.toObject(), 
      id: createdPost._id
    }
  });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Creating a post failed!" });
}


  }
  else {

    res.json('you are not allowed')
  }
}


export const deleteCategory = async  (req:Request, res:Response) => {
  const id = req.params.id;
  CategoryModel.deleteOne({ _id: id })
    .then(() => {
      res.status(200).json({ message: 'Post deleted' });
    });
}


export const getAllCategories = async   (req:Request, res:Response) => {
  CategoryModel.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: documents
      });
    });
}


export const updatePost = async (req:Request, res:Response) => {
  const id = req.params.id;
  const url = req.protocol + '://' + req.get("host");
  const post:CreatePostDto = {
    category: req.body.category,
    title: req.body.title,
    price: req.body.price,
    content: req.body.content,
    contentLarge: req.body.contentLarge,
   quantity: req.body.quantity.split(',').map((item: string) => parseInt(item, 10)),
    imagePath: req.file.path,
    userId: req.userData.userId
  }
  await PostModel.updateOne({_id:id.toString()}, post)
    .then(() => {
      res.status(200).json({ message: 'Post updated' });
    });
}

export const getAllPosts = async   (req:Request, res:Response) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = PostModel.find();
  let fetchedPosts;
  if(pageSize && currentPage) {
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery
  .then((documents)=>{
    fetchedPosts = documents;
  return PostModel.countDocuments();
  //
  }
  ).then(count=>{
      res.status(200).json({
    message: 'Posts are fetched',
    posts: fetchedPosts,
    maxPosts: count
  });
});
}

export const getPostById= async (req:Request, res:Response) => {
  const id = req.params.id;
  PostModel.findById(id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json({ post });
    });
}

export const deleteOne = async  (req:Request, res:Response) => {
  const id = req.params.id;
  PostModel.deleteOne({ _id: id })
    .then(() => {
      res.status(200).json({ message: 'Post deleted' });
    });
}

export const getComment = async (req:Request, res:Response)=>{

  let name;
 await UserModel.findById(req.userData.userId).then(user => {
    name = user.name;

  })
  const comment = new CommentModel({
    userId: req.userData.userId,
    email: req.userData.email,
    name: name,
    postId: req.body.id,
    content: req.body.content,
    date: req.body.date

  });

  comment.save();
    let id = req.body.id;
    res.json('good')

}


export const getOneComment = async (req:Request, res:Response)=>{
  const arrayComment = [];

  CommentModel.find({ postId: req.params.id })
    .then(result => {
      arrayComment.push(...result);

      res.send({
        comments: arrayComment
      })
  })
}

export const deleteComment = async (req:Request, res:Response)=>{
 if (req.userData.role === ROLE_ADMIN)
  {

    CommentModel.deleteOne({ _id: req.body.id }).then(resulty =>
      res.json({message: 'success'}) );

  }
  else
 res.json({ message: "no rights" });
}

export const consultEmail = async (req:Request, res:Response) => {
  const email = req.body.email;
const user = await UserModel.findOne({ email: email });
 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
     await emailService.sendConsultEmail(user, req.body.title, req.body.text);
   
}