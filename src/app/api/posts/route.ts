import { NextResponse } from "next/server";
import { getAllPosts, createPost } from "@/lib/db";
import { Post } from "@/lib/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Failed to fetch posts: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const post: Omit<Post, "id" | "publishedAt"> = {
      title: body.title,
      author: body.author,
      content: body.content,
      coverImage: body.coverImage,
    };
    const newPost = await createPost(post);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Failed to create post: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 400 }
    );
  }
}
