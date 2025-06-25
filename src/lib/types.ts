export interface Post {
  id: string;
  title: string;
  author: string;
  content: string;
  coverImage?: string;
  publishedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Block {
  name: string;
  [key: string]: string;
}
