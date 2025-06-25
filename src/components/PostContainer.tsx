"use client";

import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import LoadMoreButton from "./LoadMoreButton";
import { Post } from "@/lib/types";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface PostsContainerProps {
  initialPosts: Post[];
  total: number;
  page: number;
  search: string;
  author: string;
  postsPerPage: number;
  isAuthenticated: boolean;
}

const PostsContainer: React.FC<PostsContainerProps> = ({
  initialPosts,
  total,
  page: initialPage,
  search,
  author,
  postsPerPage,
  isAuthenticated,
}) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialPosts.length < total);

  useEffect(() => {
    setPosts(initialPosts);
    setCurrentPage(initialPage);
    setHasMore(initialPosts.length < total);
  }, [initialPosts, initialPage, total, search, author]);

  const loadMore = async () => {
    const nextPage = currentPage + 1;

    try {
      const res = await fetch(
        `/api/posts?page=${nextPage}&search=${encodeURIComponent(
          search
        )}&author=${encodeURIComponent(author)}&limit=${postsPerPage}`
      );
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();

      let newPosts: Post[], newTotal: number;

      if (Array.isArray(data)) {
        newPosts = data;
        newTotal = total;
      } else if (Array.isArray(data.posts) && typeof data.total === "number") {
        newPosts = data.posts;
        newTotal = data.total;
      } else {
        throw new Error(
          "Invalid API response: Expected { posts: Array, total: number } or Array"
        );
      }

      setPosts((prev) => {
        const uniquePosts = newPosts.filter(
          (newPost: Post) => !prev.some((post) => post.id === newPost.id)
        );
        return [...prev, ...uniquePosts];
      });
      setCurrentPage(nextPage);
      setHasMore(posts.length + newPosts.length < newTotal);
      toast.success(`Loaded ${newPosts.length} more posts`);
    } catch (error: unknown) {
      toast.error(`Failed to load more posts: ${error}`);
    }
  };

  return (
    <div>
      {posts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No posts available.</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </motion.div>
      )}
      {hasMore && (
        <LoadMoreButton
          page={currentPage}
          search={search}
          author={author}
          onLoadMore={loadMore}
        />
      )}
    </div>
  );
};

export default PostsContainer;
