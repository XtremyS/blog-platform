"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Post } from "@/lib/types";
import { remark } from "remark";
import strip from "strip-markdown";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface BlogCardProps {
  post: Post;
  isAuthenticated: boolean;
}

const getSnippet = (content: string): string => {
  try {
    const plainText = remark().use(strip).processSync(content).value.toString();
    return plainText.slice(0, 200) + (plainText.length > 200 ? "..." : "");
  } catch (error: unknown) {
    console.log(`Something went wrong: ${error}`);
    return content.slice(0, 200) + (content.length > 200 ? "..." : "");
  }
};
const getUrlFriendlyTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

const BlogCard: React.FC<BlogCardProps> = ({ post, isAuthenticated }) => {
  const router = useRouter();
  const snippet = getSnippet(post.content);
  const urlTitle = getUrlFriendlyTitle(post.title);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete post");
      }
      toast.success("Post deleted successfully");

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete post"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border"
    >
      <Link href={`/posts/${post.id}/${urlTitle}`}>
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {post.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          By {post.author} |{" "}
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{snippet}</p>
      </Link>
      {isAuthenticated && (
        <div className="mt-4 flex space-x-2">
          <Link
            href={`/edit/${post.id}`}
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            type="button"
            className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 cursor-pointer"
          >
            Delete
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default BlogCard;
