  //import nodemailer from 'nodemailer';
  // import * as dotenv from "dotenv";
import { DocumentType } from '@typegoose/typegoose';
import { User, UserModel } from "../models/user/user.model";

  // dotenv.config();
const nodemailer = require('nodemailer');
require('dotenv').config();

  interface EmailOptions {
    toUser: string;
    hash: string;
  }

  export class EmailService {
    public transporter;

    constructor() {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GOOGLE_USER,
          pass: process.env.Password
        }
      });
    }

    sendResetPasswordEmail({ toUser, hash }: EmailOptions): Promise<any> {
      const message = {
        from: process.env.GOOGLE_USER,
        to: toUser,
        subject: 'Reset Password',
        html: `
          <h3>Добрий день</h3>
          <p>Для скидання паролю, пройдіть по посиланню: 
          <a target="_" href="${process.env.DOMAIN}/newpass/${hash}">Reset Link</a></p>
          <p>Якщо цю активність робили не ви, ігноруйте</p>
        `
      };

      return new Promise((res, rej) => {
        this.transporter.sendMail(message, (error, info) => {
          if (error) rej(error);
          else res(info);
        });
      });
    }

    sendConfirmationEmail({toUser, hash}: EmailOptions): Promise<any> {
      const message = {
        from: process.env.GOOGLE_USER,
        to: toUser,
        subject: 'Your App - Activate Account',
        html: `
          <h3>Добрий день!</h3>
          <p>Дякуємо за реєстрацію, залишився один крок для її завершення</p>
          <p>Для активації акаунту, пройдіть за посиланням: 
          <a target="_" href="${process.env.DOMAIN}/activate/${hash}">Activate Link</a></p>
          <p>Всього найкращого!</p>
          <p>Якщо ви не реєструвались, проігноруйте</p>
        `
      };

      return new Promise((res, rej) => {
        this.transporter.sendMail(message, (error, info) => {
          if (error) rej(error);
          else res(info);
        });
      });
    }
    sendConsultEmail (user:DocumentType<User>, title:string, text:string): Promise<any> {
      // await UserModel.findOne({ email: email })
      //    .then((user) => {
      //      if (!user) {
      //        return;
      //      }
     
          
      //      return user;
      //    }).then((user) => {

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
      subject: `Консультація ${title}`,
      html: `
      <h3>Замовлення від ${user.name} ${user.email} ${user.contacts}</h3>
      <h2>Додадток ${title}</h2>
      <p>Питання: ${text}</p>
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
  }
    
  }


