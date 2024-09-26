// ici on doit ajouter les autres types comme les articles, etc...

// example de interface pour les articles
export interface ArticleInterface {
  title: string;
  description: string;
  author: string;
}

export interface UserInterface {
  email: string;
  username: string;
  articles?: ArticleInterface[];
}
