import { NextResponse } from "next/server";
import { getCommentsByPostId, createComment } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    const comments = await getCommentsByPostId(postId);
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Failed to fetch comments: " +
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
    const comment = await createComment({
      postId: body.postId,
      author: body.author,
      content: body.content,
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Failed to create comment: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 400 }
    );
  }
}
