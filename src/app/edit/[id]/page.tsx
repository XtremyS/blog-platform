import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getPostById } from "@/lib/db";
import BlogForm from "@/components/BlogForm";
import { redirect } from "next/navigation";

interface EditPostProps {
  params: Promise<{ id: string }>;
}

export default async function EditPost({ params }: EditPostProps) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const post = await getPostById(id);

  if (!post) {
    return <div className="container mx-auto p-4">Post not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Post</h1>
      <BlogForm initialPost={post} />
    </div>
  );
}
