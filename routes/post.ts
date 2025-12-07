const path = require('path');
const express = require('express');
const multer = require('multer');
require('dotenv').config({ path: `${'./backend/.env'}` });

const Category = require('../models/category/category.model').CategoryModel;

const Post = require('../models/post/post.model');
const User = require("../models/user/user.model").UserModel;
const Auth = require("../middleware/check-auth");
const CommentO = require('../models/comment/comment.model').CommentModel;
const nodemailer = require('nodemailer');
import { PostService } from "../services/posts.service";

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

const postService = new PostService();

router.post('/categoryDelete', Auth, PostController.deleteCategory);

router.get('/categories', PostController.getAllCategories);

router.post("", Auth, postService.upload.single("image"), PostController.createPost);

router.put('/:id', postService.upload.single("image"), PostController.updatePost);

router.get('', PostController.getAllPosts);
router.get('/:id', PostController.getPostById);

router.delete('/:id', PostController.deleteOne);


router.post('/categoryC', Auth, PostController.createCategory)
router.post('/comment', Auth, PostController.getComment);

router.get('/comments/:id',  PostController.getOneComment);
router.post('/commentdelete', PostController.deleteComment);

router.post('/send', Auth, PostController.consultEmail);


module.exports = router;
