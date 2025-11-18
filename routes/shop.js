const express = require('express');
const Post = require('../models/post');
const Auth = require("../middleware/check-auth");
const User = require('../models/user')
const Order = require('../models/order')




const router = express.Router();
const ROLE_ADMIN = 'ADMIN';

const Process = ({
  ORDERED: 'ordered',
  INPROCESS: 'process',
  FINISHED: 'finished',
  DENIED: 'denied'

})

router.delete('/:id', Auth, (req, res, next) => {


  let postId = req.params.id;

  User.findById(req.userData.userId)
    .then(user => {
      req.user = user;


      req.user
        .removeFromCart(postId)
        .then(() => {
          res.json({message: 'deleted'})
        })
        .catch(err => console.log(err))
    })
});
//  router.get('/cart', isAuth, shopController.getCart);

router.post('/order', Auth, async(req, res, next) => {



 User.findById(req.userData.userId)
    .then(user => {
      req.user = user;




//тут Populate не потрібен
req.user
 .populate('cart.items.postId')
  .then(user => {
  const posts = user.cart.items.map(i => {


            return { quantity: i.quantity, post: {...i.postId._doc } }
  });
      const order = new Order({
        date: req.body.date,
        user: {
            email: req.user.email,

            nameCompany: req.user.nameCompany,
            contacts: req.user.contacts,
            city: req.user.city,
            userId: req.user._id
        },
        posts: posts,
        process: Process.ORDERED,
         code: req.body.code.codeE
        });
   return  order.save();
})










        .then(result => {
    return  req.user.clearCart()

        })
        .then(() => {
          res.json({})
        })
    .catch(err => console.log(err));
  });
 })


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


router.get('/cart', Auth, (req, res, next) => {

 User.findById(req.userData.userId)
    .then(user => {
      req.user = user;

       req.user

    .populate('cart.items.postId')



    .then(user => {

      const posts = user.cart.items;
      res.json({

        posts: posts,

      });
    })
    .catch(err => console.log(err));
});
    });

router.post('/orderstatus', Auth, async(req, res, next) => {

  await Order.updateOne({ _id: req.body.id },
    {
      process:req.body.process
   }

 ).then(order => {

    res.status(200).json({
          message: 'status changed'



        })
  })

});

router.get('/orders', Auth, (req, res, next) => {

   const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const orderQuery = Order.find();
  let fetchedOrders;

  if (pageSize && currentPage) {
    orderQuery.skip(pageSize * (currentPage - 1))
      .limit(pageSize);

  }
  if (req.userData.role === ROLE_ADMIN) {
    orderQuery
      .then(items => {
        fetchedOrders = items;
        return Order.count();
      })
      .then(count => {



        res.status(200).json({
          message: 'Orders are fetched for admin',

          orders: fetchedOrders,
          maxOrders: count

        })

      });
  }
  else {
    orderQuery.find({ 'user.userId': req.userData.userId })

      .then(items => {
        item=items;


          res.status(200).json({
            message: 'Orders are fetched',
            date: items.date,
            orders: items,
            process: items.process


        })

      });
  }
});


module.exports = router;
