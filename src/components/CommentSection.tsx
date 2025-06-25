"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Comment } from "@/lib/types";
import Link from "next/link";

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      } else {
        toast.error("Failed to load comments");
      }
    } catch (error: unknown) {
      toast.error(`Error loading comment: ${error}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please sign in to comment");
      return;
    }
    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          author: session.user?.name || "Anonymous",
          content,
        }),
      });

      if (res.ok) {
        toast.success("Comment added!");
        setContent("");
        fetchComments();
      } else {
        toast.error("Failed to add comment");
      }
    } catch (error: unknown) {
      toast.error(`Error adding comment: ${error}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Comments
      </h3>
      {session ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-md p-3 text-gray-900 dark:text-gray-100 dark:bg-gray-700 h-24"
            placeholder="Write your comment..."
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="mt-2 bg-blue-600 text-white rounded-md p-3 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer"
          >
            Post Comment
          </motion.button>
        </form>
      ) : (
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Please{" "}
          <Link
            href="/api/auth/signin"
            className="text-blue-600 dark:text-blue-400"
          >
            sign in
          </Link>{" "}
          to comment.
        </p>
      )}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md"
            >
              <p className="text-gray-900 dark:text-gray-100">
                {comment.content}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                By {comment.author} |{" "}
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default CommentSection;
