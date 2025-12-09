import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userData?: {
        userId: string;
        email: string;
        role:string;
        nameCompany:string;
        contacts:string;
        city:string;
        _id:string;
      }
    }
  }
}