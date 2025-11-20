import multer, { DiskStorageOptions, FileFilterCallback } from 'multer';
import { DocumentType } from '@typegoose/typegoose';
import { Request } from 'express';
import path from 'path';
import { CreatePostDto } from '../models/post/postDTO/create-post.dto';
import { PostModel } from '../models/post/post.model';
require('dotenv').config();

const MIME_TYPE_MAP: { [key: string]: string } = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

  export class PostService {

public storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string)=> void)=> {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error: Error | null = new Error('Invalid mime type');
      if (isValid) {
        error = null;
      }
      callback(error, path.join(__dirname, '../../images'));
    },
    filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      callback(null, `${name}-${Date.now()}.${ext}`);
    },
  });

  public upload = multer({ storage: this.storage });

  
  public singleUpload(fieldName: string) {
    return this.upload.single(fieldName);
  }

  public multipleUpload(fieldName: string, maxCount: number) {
    return this.upload.array(fieldName, maxCount);
  }


  public async savePost(dto:CreatePostDto){
   
    const post = new PostModel({
      category: dto.category,
      title: dto.title,
      price: dto.price,
      content: dto.content,
      contentLarge: dto.contentLarge,
      quantity: dto.quantity,
      imagePath: dto.imagePath,
      userId: dto.userId
    })
   return await post.save();

  }

  }