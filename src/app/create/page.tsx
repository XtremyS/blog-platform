import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import BlogForm from "@/components/BlogForm";
import { redirect } from "next/navigation";

export default async function CreatePost() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Create New Post
      </h1>
      <BlogForm />
    </div>
  );
}
