"use client";

import { motion } from "framer-motion";

interface LoadMoreButtonProps {
  page: number;
  search: string;
  author: string;
  onLoadMore: () => void;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onLoadMore }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        console.log("LoadMoreButton: Clicked");
        onLoadMore();
      }}
      className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
    >
      Load More
    </motion.button>
  );
};

export default LoadMoreButton;
