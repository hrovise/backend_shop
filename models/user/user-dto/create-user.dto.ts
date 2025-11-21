import { prop, getModelForClass, Ref } from '@typegoose/typegoose';

export class createUserDto {
    @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;



 
 
}