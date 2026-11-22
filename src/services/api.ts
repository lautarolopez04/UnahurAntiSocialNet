import type { User, Post, Tag, Comment, PostImage } from '../types';

const API_URL = 'http://localhost:3001';

// --- USUARIOS ---
export const getUsers = async (): Promise<User[]> => {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error('Error al obtener usuarios');
  return res.json();
};

export const getUserById = async (id: number): Promise<User> => {
  const res = await fetch(`${API_URL}/users/${id}`);
  if (!res.ok) throw new Error('Error al obtener el usuario');
  return res.json();
};

export const createUser = async (nickName: string, email:string): Promise<User> => {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickName, email }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'No se pudo crear el usuario');
  }
  return res.json();
};

// --- PUBLICACIONES (POSTS) ---
export const getPosts = async (): Promise<Post[]> => {
  const res = await fetch(`${API_URL}/posts`);
  if (!res.ok) throw new Error('Error al obtener publicaciones');
  return res.json();
};

export const getPostById = async (id: string | number): Promise<Post> => {
  const res = await fetch(`${API_URL}/posts/${id}`);
  if (!res.ok) throw new Error('Error al obtener la publicación');
  return res.json();
};

export const getPostsByUserId = async (userId: number): Promise<Post[]> => {
  const res = await fetch(`${API_URL}/posts?userId=${userId}`);
  if (!res.ok) throw new Error('Error al obtener las publicaciones del usuario');
  return res.json();
};

export const createPost = async (data: {
  description: string;
  userId: number;
  tags: number[];
}): Promise<Post> => {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear la publicación');
  return res.json();
};

// --- ETIQUETAS (TAGS) ---
export const getTags = async (): Promise<Tag[]> => {
  const res = await fetch(`${API_URL}/tags`);
  if (!res.ok) throw new Error('Error al obtener etiquetas');
  return res.json();
};

// --- COMENTARIOS ---
export const getCommentsByPostId = async (postId: string | number): Promise<Comment[]> => {
  const res = await fetch(`${API_URL}/comments/post/${postId}`);
  if (!res.ok) throw new Error('Error al obtener comentarios');
  return res.json();
};

export const createComment = async (data: {
  content: string;
  userId: number;
  postId: number;
}): Promise<Comment> => {
  const res = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al publicar comentario');
  return res.json();
};

// --- IMÁGENES DE POSTS ---
export const getPostImages = async (postId: string | number): Promise<PostImage[]> => {
  const res = await fetch(`${API_URL}/postimages/post/${postId}`);
  if (!res.ok) throw new Error('Error al obtener imágenes');
  return res.json();
};

export const createPostImage = async (data: {
  url: string;
  postId: number;
}): Promise<PostImage> => {
  const res = await fetch(`${API_URL}/postimages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al asociar imagen');
  return res.json();
};