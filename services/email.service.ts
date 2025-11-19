  //import nodemailer from 'nodemailer';
  // import * as dotenv from "dotenv";
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
  }

