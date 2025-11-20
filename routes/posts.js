const path = require('path');
const express = require('express');
const multer = require('multer');
require('dotenv').config({ path: `${'./backend/.env'}` });

const Category = require('../models/category').CategoryModel;

const Post = require('../models/post');
const User = require("../models/user/user.model").UserModel;
const Auth = require("../middleware/check-auth");
const Comment = require('../models/comment');
const nodemailer = require('nodemailer');
const PostService = require("../services/posts.service");

const IMAGE = '/images/';
const router = express.Router();

// const MIME_TYPE_MAP = {
//   "image/png": "png",
//   "image/jpeg": "jpg",
//   "image/jpg": "jpg"
// }
const ROLE_ADMIN = 'ADMIN';



router.post('/category', Auth, (req, res, next) => {

  Category.deleteOne({ category: req.body.category })
    .then(
      res.status(200).json({ message: 'category deleted' })
   )

})

router.get('/categories',  (req, res, next) => {
  let category=[];
   Category.find().then(categories=>{
     category = categories;
  }).then(() => {
    res.send({ category });
  })


})

router.post("", Auth, multer({ storage: PostService.storage }).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");

  if (req.userData.role === ROLE_ADMIN) {
    const post = new Post({
      category: req.body.category,
      title: req.body.title,
      price: req.body.price,
      content: req.body.content,
      contentLarge: req.body.contentLarge,
      quantity: req.body.quantity.split(',').map(function(item){return parseInt(item, 10)}),
      imagePath: url + IMAGE + req.file.filename,
      userId: req.userData.userId
    });

    post.save()
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
  else {

    res.json('failed')
  }
});
router.put('/:id', multer({storage: PostService.storage}).single("image"), (req, res, next)=>{

  let imagePath= req.body.imagePath;

  if(req.file){

    const url = req.protocol + '://'+ req.get("host");
    imagePath=url + IMAGE +   req.file.filename;

  }

  const post = new Post({
    _id: req.body.id,
    category: req.body.category,
    title: req.body.title,
  price: +req.body.price,
    content: req.body.content,
    contentLarge: req.body.contentLarge,
  quantity: req.body.quantity.split(',').map(function(item){return parseInt(item, 10)}),
  imagePath: imagePath
 })

  Post.updateOne({_id: req.params.id}, post)
  .then(result => {

    res.status(200).json({message: 'Update succesfull'})
  })
});
router.get('',(req,res,next)=>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize && currentPage) {
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery
  .then((documents)=>{
    fetchedPosts = documents;
  return Post.count();
  //
  }
  ).then(count=>{
      res.status(200).json({
    message: 'Posts are fetched',
    posts: fetchedPosts,
    maxPosts: count
  });
});
  // const posts=[
  //   {id:'1231',
  //   title: 'First title',
  //    content: 'this is from server'},
  //    {id:'121431',
  //    title: 'Second title',
  //     content: 'this is from server #2'}
  // ];

});
router.get('/:id', (req,res,next)=>{
 Post.findById(req.params.id).then(post=>{
  if(post) {
    res.status(200).json(post);
  } else{
    res.status(404).json({message:"no Post"});
  }
 })
});
router.delete('/:id', (req, res, next) => {

  Post.deleteOne({_id:req.params.id})
    .then(() => {
     res.status(200).json({message:'Post deleted'})
  });


});


router.post('/categoryC', Auth, (req, res, next) => {


    const category = new Category({
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




});
router.post('/comment', Auth, async(req, res, next) => {
  let name;
 await User.findById(req.userData.userId).then(user => {
    name = user.name;

  })
  const comment = new Comment({
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

  Comment.find({ postId: req.params.id })
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

    Comment.deleteOne({ _id: req.body.id }).then(resulty =>
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
          rej(err);
        }
        else
          res(info)
    })
  })
  })


})

module.exports = router;
