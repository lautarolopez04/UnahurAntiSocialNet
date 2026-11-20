export type User = {
  id: number;
  nickName: string;
};

export type Tag = {
  id: number;
  name: string;
};

export type PostImage = {
  id: number;
  url: string;
  postId: number;
};

export type Comment = {
  id: number;
  content: string;
  userId: number;
  postId: number;
  User?: User; // Opcional por si el backend incluye los datos del autor
};

export type Post = {
  id: number;
  description: string;
  userId: number;
  User?: User;
  Tags?: Tag[];
  PostImages?: PostImage[];
  Comments?: Comment[];
};