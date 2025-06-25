"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Post } from "@/lib/types";
import toast from "react-hot-toast";

interface BlogFormProps {
  initialPost?: Post;
}

const BlogForm: React.FC<BlogFormProps> = ({ initialPost }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState({
    title: initialPost?.title || "",
    // slug: initialPost?.slug || '',
    author: initialPost?.author || "",
    content: initialPost?.content || "",
    coverImage: initialPost?.coverImage || "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.title) newErrors.title = "Title is required";
    // if (!form.slug) newErrors.slug = "Slug is required";
    if (!form.author) newErrors.author = "Author is required";
    if (!form.content) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validate()) {
      setIsLoading(false);

      toast.error("Please fix the form errors");
      return;
    }

    const method = initialPost ? "PUT" : "POST";
    const url = initialPost ? `/api/posts/${initialPost.id}` : "/api/posts";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save post");
      }

      toast.success(initialPost ? "Post updated!" : "Post created!");
      router.push("/");
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error instanceof Error ? error.message : "Failed to save post"
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md p-3 text-gray-900 dark:text-gray-100 dark:bg-gray-700"
        />
        {errors.title && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Author
        </label>
        <input
          type="text"
          name="author"
          value={form.author}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md p-3 text-gray-900 dark:text-gray-100 dark:bg-gray-700"
        />
        {errors.author && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            {errors.author}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Content (Markdown supported)
        </label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md p-3 text-gray-900 dark:text-gray-100 dark:bg-gray-700 h-40"
        />
        {errors.content && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            {errors.content}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Cover Image URL
        </label>
        <input
          type="text"
          name="coverImage"
          value={form.coverImage}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md p-3 text-gray-900 dark:text-gray-100 dark:bg-gray-700"
        />
        {errors.coverImage && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            {errors.coverImage}
          </p>
        )}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
        type="submit"
        className="w-full bg-blue-600 text-white rounded-md p-3 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors cursor-pointer"
      >
        {isLoading ? "Loading..." : initialPost ? "Update Post" : "Create Post"}
      </motion.button>
    </motion.form>
  );
};

export default BlogForm;
