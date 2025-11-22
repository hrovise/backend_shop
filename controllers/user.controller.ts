import { Request, Response } from 'express';
import {UserModel} from '../models/user/user.model';
import {PendingUserModel} from '../models/user/pendingUser.model';
import {EmailService}  from '../services/email.service';
import bcrypt from 'bcrypt';
import { AccessHashModel } from '../models/user/access_hash/access_hash.model';     

const ROLE_DEFAULT = 'USER';
const ROLE_ADMIN = 'ADMIN';
  const emailService = new EmailService();


export const signup = async (req:Request, res:Response) => {
    let rUser;
    let pUser;
      await UserModel.findOne({ email: req.body.email })
        .then(user => {
          rUser = user;
        });
      await PendingUserModel.findOne({ email: req.body.email })
        .then(user => {
          pUser = user;
        });
    
    
      if (pUser || rUser) {
    
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

    const hash = await new AccessHashModel({ userId: user._id });

    await hash.save();
    await emailService.sendResetPasswordEmail({toUser:user.email, hash:hash._id.toString() });
    //emailer
    return res.json({message: 'Email is sent'})
  }
  catch {
    return res.status(422).send({ message:'something bad'});
  }
    }