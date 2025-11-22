import { Request, Response } from 'express';
import {UserModel} from '../models/user/user.model';
import {PendingUserModel} from '../models/user/pendingUser.model';
import {EmailService}  from '../services/email.service';
import bcrypt from 'bcrypt';
import {  AccessHashModel } from '../models/user/access_hash/access_hash.model';     
import { UserService } from '../services/user.service';
const jwt = require('jsonwebtoken');
require('dotenv').config();

const ROLE_DEFAULT = 'USER';
const ROLE_ADMIN = 'ADMIN';
  const emailService = new EmailService();
  const userService = new UserService();

export const signup = async (req:Request, res:Response) => {
   

  const existingUser = userService.checkExistingUser(req.body.email);
    
    
      if (existingUser) {
    
        return res.send({ message: 'User is exist' });
      }
      bcrypt.hash(req.body.password, 10)
       .then(async hash => {
      const pendingUser = new PendingUserModel({
               role: ROLE_DEFAULT,
                name: req.body.name,
                nameCompany: req.body.nameCompany,
                city: req.body.city,
                contacts: req.body.contacts,
                email: req.body.email,
                password: hash
      })
    
    
       await pendingUser.save();
  
   await emailService.sendConfirmationEmail({ toUser: pendingUser.email, hash:pendingUser._id.toString() });
         res.json({message:"Go to email for activation"})
       })
      .catch(err => {  

             res.status(201).json({
             success: false,
             error: err._message

            })

         })

}

 export const passwordResetRequest= async (req:Request, res:Response) => {
         const  email  = req.body.email;

  try {
    const user = await UserModel.findOne({email:email });

    if (!user) { return res.status(422).send('no user') }

    const hasHash = await AccessHashModel.findOne({ userId: user._id }); //tut ne ponyanto

    if (hasHash) { return res.status(422).send("email sent already") };//otpravil

    const hash =  new AccessHashModel({ userId: user._id });

    await hash.save();
    await emailService.sendResetPasswordEmail({toUser:user.email, hash:hash._id.toString() });
    //emailer
    return res.json({message: 'Email is sent'})
  }
  catch {
    return res.status(422).send({ message:"email wasn't sent"}) ;
  }
    }

    export const passwordReset = async (req:Request, res:Response) => {
            let newP;

  const { password, hash } = req.body;

  try {
    const aHash = await AccessHashModel.findOne({ _id: hash });

    if (!aHash) {

      return res.status(422).send('no password');
    }
    newP =await bcrypt.hash(password, 10)

    await UserModel.updateOne({ _id: aHash.userId },{
      password : newP
    })
    await aHash.deleteOne();

    return res.json({message: 'Password is changed'})
  } catch {
      return res.status(422).send("Something went wrong")
  }
    }

    export const login = async (req:Request, res:Response) => {
      let fetchedUser;
  await UserModel.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {

      return
      
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
    }