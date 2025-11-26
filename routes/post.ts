const path = require('path');
const express = require('express');
const multer = require('multer');
require('dotenv').config({ path: `${'./backend/.env'}` });

const Category = require('../models/category/category.model').CategoryModel;

const Post = require('../models/post');
const User = require("../models/user/user.model").UserModel;
const Auth = require("../middleware/check-auth");
const CommentO = require('../models/comment/comment.model').CommentModel;
const nodemailer = require('nodemailer');
const PostService = require("../services/posts.service");

const IMAGE = '/images/';
const router = express.Router();
import { DocumentType } from '@typegoose/typegoose';
import { CreatePostDto } from '../models/post/postDTO/create-post.dto';
import * as PostController from '../controllers/post.controller';

// const MIME_TYPE_MAP = {
//   "image/png": "png",
//   "image/jpeg": "jpg",
//   "image/jpg": "jpg"
// }
const ROLE_ADMIN = 'ADMIN';



router.post('/categoryDelete', Auth, PostController.deleteCategory);

router.get('/categories', PostController.getAllCategories);

router.post("", Auth, multer({ storage: PostService.storage }).single("image"), PostController.createPost);

router.put('/:id', multer({storage: PostService.storage}).single("image"), PostController.updatePost);

router.get('', PostController.getAllPosts);
router.get('/:id', PostController.getPostById);

router.delete('/:id', PostController.deleteOne);


router.post('/categoryC', Auth, PostController.createCategory)
router.post('/comment', Auth, async(req, res, next) => {
  let name;
 await User.findById(req.userData.userId).then(user => {
    name = user.name;

  })
  const comment = new CommentO({
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



})

router.get('/comments/:id',  (req, res, next) => {
  const arrayComment = [];

  CommentO.find({ postId: req.params.id })
    .then(result => {
      arrayComment.push(...result);

      res.send({
        comments: arrayComment
      })
  })

})
router.post('/commentdelete', Auth, (req, res, next) => {

  if (req.userData.role === ROLE_ADMIN)
  {

    CommentO.deleteOne({ _id: req.body.id }).then(resulty =>
      res.json({message: 'success'}) );

  }
  else
 res.json({ message: "no rights" });
})


router.post('/send', Auth, async (req, res, next) => {
  let name;
  let contacts
  const email = req.userData.email;
  await User.findOne({email: req.userData.email})
    .then(user => {

    name = user.name;
    contacts = user.contacts

  }).then(() => {

    return new Promise((res, rej) => {
    const transporter = nodemailer.createTransport({
     service: 'gmail',
        auth: {
            user: "shopadditivesukit@gmail.com",
            pass: process.env.Password
        }
    })


    const message = {
      from: "shopadditivesukit@gmail.com",
      to: "shopadditivesukit@gmail.com",
      subject: `Консультація ${req.body.title}`,
      html: `
      <h3>Замовлення від ${name} ${email} ${contacts}</h3>
      <h2>Додадток ${req.body.title}</h2>
      <p>Питання: ${req.body.text}</p>
      `
   //hash - userId;
    }
      transporter.sendMail(message, function (error, info) {
        if (error) {
          rej(error);
        }
        else
          res(info)
    })
  })
  })


})

module.exports = router;
