export class CreatePostDto {
  public title!: string;
  public content!: string;
  public contentLarge!: string;
  public price!: number;       
  public category!: string;
  public quantity!: number[];  
  public imagePath!: string;
  public userId!: string;
}