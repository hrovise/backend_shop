import { Request, Response } from 'express';
import {UserModel} from '../models/user/user.model';
import {PendingUserModel} from '../models/user/pendingUser.model';
import {EmailService}  from '../services/email.service';
import bcrypt from 'bcrypt';

const ROLE_DEFAULT = 'USER';
const ROLE_ADMIN = 'ADMIN';

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
       .then(hash => {
      const pendingUser = new PendingUserModel({
               role: ROLE_DEFAULT,
                name: req.body.name,
                nameCompany: req.body.nameCompany,
                city: req.body.city,
                contacts: req.body.contacts,
                email: req.body.email,
                password: hash
      })
    
    
         pendingUser.save();
    const emailService = new EmailService();

     emailService.sendConfirmationEmail({ toUser: pendingUser.email, hash:pendingUser._id.toString() });
         res.json({message:"Go to email for activation"})
       })
      .catch(err => {
    
    
                res.status(201).json({
                    success: false,
            error: err._message
                  })
          })



}