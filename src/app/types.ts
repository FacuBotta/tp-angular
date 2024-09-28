// ici on doit ajouter les autres types comme les articles, etc...

// example de interface pour les articles
export interface ArticleInterface {
  id:string,
  title:string,
  subtitle:string,
  description:string,
  content:string,
  authorName:string,
  authorId:string,
  online:boolean,
  like:number
}

export interface UserInterface {
  email: string;
  username: string;
  image?: string;
  articles?: ArticleInterface[];
}

export interface messageType {
  id: number;
  content: string;
  user: string;
  sendAt: Date;
}
