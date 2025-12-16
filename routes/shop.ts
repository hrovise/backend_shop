const path = require('path');
const express = require('express');
const Post = require('../models/post/post.model').Post;
const Auth = require("../middleware/check-auth");
const User = require("../models/user/user.model").UserModel;
const Order = require('../models/order/order.model').OrderModel;
import * as ShopController from '../controllers/shop.controller';   



const router = express.Router();
const ROLE_ADMIN = 'ADMIN';

const Process = ({
  ORDERED: 'ordered',
  INPROCESS: 'process',
  FINISHED: 'finished',
  DENIED: 'denied'

})

router.delete('/:id', Auth, ShopController.deleteFromCart);
//  router.get('/cart', isAuth, shopController.getCart);

router.post('/order', Auth, ShopController.orderCreate);


router.post('/cart/:id', Auth, (req, res, next) => {
  let postId = req.params.id;
  let insideUser = req.userData;
  let quantity = +req.body.quantity;


   User.findById({ _id: req.userData.userId, })
    .then(user => {

      return insideUser = user;
    });


  Post.findById(postId).then(product => {


    return User.findById(req.userData.userId).then(user => {
      user.addToCart(product, quantity); //req.body.25/1000/200
    })

  }).then(() => {
    res.json('success')
  })

});


router.get('/cart', Auth, ShopController.cartAll);

router.post('/orderstatus', Auth, ShopController.orderStatus);

router.get('/orders', Auth, ShopController.getOrders);

module.exports = router;
