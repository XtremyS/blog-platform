import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { Post, Comment } from "./types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function getAllPosts(): Promise<Post[]> {
  const res = await pool.query(
    `SELECT * FROM "posts" ORDER BY "publishedAt" DESC`
  );
  return res.rows;
}

export async function getPostsWithFilters({
  search = "",
  author = "",
  page = 1,
  limit = 3,
}: {
  search?: string;
  author?: string;
  page?: number;
  limit?: number;
}): Promise<{ posts: Post[]; total: number }> {
  let where = `WHERE 1=1`;
  const params: unknown[] = [];
  let i = 1;

  if (search.trim()) {
    where += ` AND (LOWER("title") LIKE $${i} OR LOWER("content") LIKE $${
      i + 1
    })`;
    const query = `%${search.trim().toLowerCase()}%`;
    params.push(query, query);
    i += 2;
  }

  if (author.trim()) {
    where += ` AND LOWER("author") LIKE $${i}`;
    params.push(`%${author.trim().toLowerCase()}%`);
    i++;
  }

  const countRes = await pool.query(
    `SELECT COUNT(*) AS total FROM "posts" ${where}`,
    params
  );
  const total = parseInt(countRes.rows[0].total, 10);

  params.push(limit, (page - 1) * limit);

  const res = await pool.query(
    `SELECT * FROM "posts" ${where} ORDER BY "publishedAt" DESC LIMIT $${i} OFFSET $${
      i + 1
    }`,
    params
  );

  return { posts: res.rows, total };
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const res = await pool.query(`SELECT * FROM "posts" WHERE "id" = $1`, [id]);
  return res.rows[0];
}

export async function createPost(
  post: Omit<Post, "id" | "publishedAt">
): Promise<Post> {
  const id = uuidv4();
  const publishedAt = new Date().toISOString();

  await pool.query(
    `INSERT INTO "posts" ("id", "title", "author", "content", "coverImage", "publishedAt")
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, post.title, post.author, post.content, post.coverImage, publishedAt]
  );

  return { id, publishedAt, ...post };
}

export async function updatePost(
  id: string,
  post: Partial<Post>
): Promise<Post | undefined> {
  const existing = await getPostById(id);
  if (!existing) return undefined;

  const updated = {
    title: post.title ?? existing.title,
    author: post.author ?? existing.author,
    content: post.content ?? existing.content,
    coverImage: post.coverImage ?? existing.coverImage,
  };

  await pool.query(
    `UPDATE "posts" SET "title" = $1, "author" = $2, "content" = $3, "coverImage" = $4 WHERE "id" = $5`,
    [updated.title, updated.author, updated.content, updated.coverImage, id]
  );

  return await getPostById(id);
}

export async function deletePost(id: string): Promise<boolean> {
  const res = await pool.query(`DELETE FROM "posts" WHERE "id" = $1`, [id]);
  return res.rowCount! > 0;
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const res = await pool.query(
    `SELECT * FROM "comments" WHERE "postId" = $1 ORDER BY "createdAt" DESC`,
    [postId]
  );
  return res.rows;
}

export async function createComment(
  comment: Omit<Comment, "id" | "createdAt">
): Promise<Comment> {
  const id = uuidv4();
  const createdAt = new Date().toISOString();

  await pool.query(
    `INSERT INTO "comments" ("id", "postId", "author", "content", "createdAt")
     VALUES ($1, $2, $3, $4, $5)`,
    [id, comment.postId, comment.author, comment.content, createdAt]
  );

  return { id, createdAt, ...comment };
}
