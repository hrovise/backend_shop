
const path = require('path');
const filePath = path.join(__dirname, 'env');
const express = require('express');
 require('dotenv').config('.env');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Auth = require("../middleware/check-auth");
const  User = require('../models/user/user.model').UserModel;
const AccessHash = require('../models/user/access_hash/access_hash.model').AccessHashModel;

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const pendingUser = require('../models/user/pendinguser.model').pendingUserModel;
const EmailService = require("../services/email.service");

const router = express.Router();
const ROLE_DEFAULT = 'USER';
const ROLE_ADMIN = 'ADMIN';






router.post('/reset', async(req, res, next) => {


  const  email  = req.body.email;

  try {
    const user = await User.findOne({email:email });

    if (!user) { return res.status(422).send('no user') }

    const hasHash = await AccessHash.findOne({ userId: user._id }); //tut ne ponyanto

    if (hasHash) { return res.status(422).send("email sent already") };//otpravil

    const hash = await new AccessHash({ userId: user._id });

    await hash.save();
    await EmailService.sendResetPasswordEmail({toUser:user.email, hash:hash._id });
    //emailer
    return res.json({message: 'Email is sent'})
  }
  catch {
    return res.status(422).send({ message:'something bad'});
  }

})

router.post('/resetpassword', async (req, res, next) => {


  const { password, hash } = req.body;

  try {
    const aHash = await AccessHash.findOne({ _id: hash });

    if (!aHash) {

      return res.status(422).send('no pass');
    }
    newP =await bcrypt.hash(password, 10)

    await User.updateOne({ _id: aHash.userId },{
      password : newP
    })
    await aHash.remove();

    return res.json({message: 'Password is changed'})
  } catch {
      return res.status(422).send("Something went wrong")
  }
});

router.get('/activate/user/:id', async (req, res, next) => {

  const  hash  = req.params.id;
  try {
    const user = await pendingUser.findOne({_id: hash});

    if (!user) {
      return res.status(422).send('User is not found')
    }

    const userToDb = new User({ ...JSON.parse(JSON.stringify(user)) });

   await userToDb.save();
    await user.deleteOne({_id: hash});
     res.json({ message: `User ${hash} has been activated` });
  } catch {

     res.json({ message: `User ${hash} has cannot activated` });
 }


})

router.post('/signup', async(req, res, next) => {

  let rUser;
  let pUser;
  await User.findOne({ email: req.body.email })
    .then(user => {
      rUser = user;
    });
  await pendingUser.findOne({ email: req.body.email })
    .then(user => {
      pUser = user;
    });


  if (pUser || rUser) {

    return res.send({ message: 'User is exist' });
  }
  bcrypt.hash(req.body.password, 10)
   .then(hash => {
  const possibleUser = new pendingUser({
           role: ROLE_DEFAULT,
            name: req.body.name,
            nameCompany: req.body.nameCompany,
            city: req.body.city,
            contacts: req.body.contacts,
            email: req.body.email,
            password: hash
  })


     possibleUser.save();

    EmailService.sendConfirmationEmail({ toUser: possibleUser.email, hash:possibleUser._id });
     res.json({message:"Go to email for activation"})
   })
  .catch(err => {


            res.status(201).json({
                success: false,
        error: err._message
              })
      })



});

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {

    api_key: process.env.API_KEY
  }
}));





router.post("/login", async(req, res, next) => {

  await User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {

      return
        // return res.status(200).json({
        //   message: "Auth failed"
        // });

      }

      fetchedUser = user;
      if (fetchedUser.status === "blocked") {

     return
      }
      return bcrypt.compare(req.body.password, user.password)

    })
    .then(result => {



      if (typeof (result) === 'object' ) {
        //  res.redirect(`${process.env.DOMAIN}/login`);
        return res.json({
          message: "Auth failed"
        })
      }  else if(result===true) {

        const token = jwt.sign({ role: fetchedUser.role, email: fetchedUser.email, userId: fetchedUser._id }, 'secret_this_should_be_longer',
          { expiresIn: "1h" });
      return  res.status(200).json({

          token: token,
          expiresIn: 3600,
          role: fetchedUser.role
        })
      }
      return res.send({ message: 'Failed' });
 })
 .catch(err=> {
  return res.json({
    message: "Auth failed"
  })
 })
})


router.get('/getuser', Auth, (req, res, next) => {

  User.findOne({ email: req.userData.email })
    .then(user => {

      fetchedUser = user;
    })
    .then((result) => {
    res.status(200).json({

      user: fetchedUser

  })
  })

})

router.post("/dashboard", Auth, (req, res, next) => {


  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "No user"
        });
      }
      return res.status(200).json({
        user: user
      })

    })
})

router.post("/dashboard-search", Auth, (req, res, next) => {


  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "No user"
        });
      }

      if (user.role == ROLE_DEFAULT) {
        user.role = ROLE_ADMIN;
      }

      user.save();
      return res.status(200).json({
        message: 'success',
        role: user.role
      })

    })
})

router.post("/dashboard-search-user", Auth, (req, res, next) => {


  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "No user"
        });
      }

      if (user.role == ROLE_ADMIN) {
        user.role = ROLE_DEFAULT;
      }

      user.save();
      return res.status(200).json({
        message: 'success',
        role: user.role
      })

    })
})
router.post("/role", Auth, (req, res, next) => {
  //const email = req.userData.email;

  User.findOne({ email: req.userData.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "No user"
        });
      }


        return res.status(200).json({
          message: 'success',
          role: user.role
        })




    })
})
router.post('/block', Auth, async (req, res, next) => {

  await User.updateOne({ email: req.body.email }, {
    status: 'blocked'

  }).then(() => {
    return res.send({ message: "заблоковано" })
  })

})
router.post('/unblock', Auth, async (req, res, next) => {

  await User.updateOne({ email: req.body.email }, {
    status: 'unblocked'

  }).then(() => {
    return res.send({ message: "розблоковано" })
  })

})
router.post('/updateuser', Auth, async(req, res, next) => {

  let fetchedUser;



    await User.updateOne({ email: req.userData.email },{
      //  email: req.body.email
      name: req.body.name,
      nameCompany: req.body.nameCompany,
      contacts: req.body.contacts
    })

      .then(() => {
     //req.userData.email = req.body.email;


        return res.send({message:"success update"})
        });

})


module.exports = router;
