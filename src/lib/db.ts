import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import { Post, Comment } from "./types";

const db = new Database(process.env.DATABASE_URL || "./blog.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    coverImage TEXT,
    publishedAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    postId TEXT NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (postId) REFERENCES posts(id)
  )
`);

export function getAllPosts(): Post[] {
  const stmt = db.prepare("SELECT * FROM posts ORDER BY publishedAt DESC");
  return stmt.all() as Post[];
}

export function getPostsWithFilters({
  search = "",
  author = "",
  page = 1,
  limit = 3,
}: {
  search?: string;
  author?: string;
  page?: number;
  limit?: number;
}): { posts: Post[]; total: number } {
  let query = "SELECT * FROM posts WHERE 1=1";
  const params: (string | number)[] = [];

  if (search?.trim()) {
    query += " AND (LOWER(title) LIKE ? OR LOWER(content) LIKE ?)";
    params.push(
      `%${search.trim().toLowerCase()}%`,
      `%${search.trim().toLowerCase()}%`
    );
  }

  if (author?.trim()) {
    query += " AND LOWER(author) LIKE ?";
    params.push(`%${author.trim().toLowerCase()}%`);
  }

  query += " ORDER BY publishedAt DESC LIMIT ? OFFSET ?";
  params.push(limit, (page - 1) * limit);

  const countQuery = query
    .replace("SELECT *", "SELECT COUNT(*) as total")
    .replace("LIMIT ? OFFSET ?", "");

  const stmt = db.prepare(query);
  const countStmt = db.prepare(countQuery);

  const posts = stmt.all(...params) as Post[];
  const { total } = countStmt.get(...params.slice(0, -2)) as { total: number };

  return { posts, total };
}

export function getPostById(id: string): Post | undefined {
  const stmt = db.prepare("SELECT * FROM posts WHERE id = ?");
  return stmt.get(id) as Post | undefined;
}

export function createPost(post: Omit<Post, "id" | "publishedAt">): Post {
  const id = uuidv4();
  const publishedAt = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO posts (id, title, author, content, coverImage, publishedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  try {
    stmt.run(
      id,
      post.title,
      post.author,
      post.content,
      post.coverImage,
      publishedAt
    );
    return { id, publishedAt, ...post };
  } catch (error) {
    throw new Error(
      "Failed to create post: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

export function updatePost(id: string, post: Partial<Post>): Post | undefined {
  const existing = getPostById(id);
  if (!existing) return undefined;
  const stmt = db.prepare(`
    UPDATE posts SET title = ?, author = ?, content = ?, coverImage = ?
    WHERE id = ?
  `);
  try {
    stmt.run(
      post.title || existing.title,
      post.author || existing.author,
      post.content || existing.content,
      post.coverImage || existing.coverImage,
      id
    );
    return getPostById(id);
  } catch (error) {
    throw new Error(
      "Failed to update post: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

export function deletePost(id: string): boolean {
  const stmt = db.prepare("DELETE FROM posts WHERE id = ?");
  try {
    const result = stmt.run(id);
    return result.changes > 0;
  } catch (error) {
    throw new Error(
      "Failed to delete post: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

export function getCommentsByPostId(postId: string): Comment[] {
  const stmt = db.prepare(
    "SELECT * FROM comments WHERE postId = ? ORDER BY createdAt DESC"
  );
  return stmt.all(postId) as Comment[];
}

export function createComment(
  comment: Omit<Comment, "id" | "createdAt">
): Comment {
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO comments (id, postId, author, content, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);
  try {
    stmt.run(id, comment.postId, comment.author, comment.content, createdAt);
    return { id, createdAt, ...comment };
  } catch (error) {
    throw new Error(
      "Failed to create comment: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
