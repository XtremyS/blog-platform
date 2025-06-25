"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";

interface SearchFilterProps {
  initialSearch: string;
  initialAuthor: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  initialSearch,
  initialAuthor,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [author, setAuthor] = useState(initialAuthor);

  const updateSearchParams = useCallback(
    debounce((searchVal: string, authorVal: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchVal.trim()) {
        params.set("search", searchVal.trim());
      } else {
        params.delete("search");
      }
      if (authorVal.trim()) {
        params.set("author", authorVal.trim());
      } else {
        params.delete("author");
      }
      params.set("page", "1");

      router.push(`/?${params.toString()}`);
    }, 500),
    [router, searchParams]
  );

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setAuthor(searchParams.get("author") || "");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateSearchParams(search, author);
    toast.success("Search applied");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    updateSearchParams(newSearch, author);
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAuthor = e.target.value;
    setAuthor(newAuthor);
    updateSearchParams(search, newAuthor);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col sm:flex-row gap-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by title or content..."
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
      <div className="flex-1">
        <input
          type="text"
          value={author}
          onChange={handleAuthorChange}
          placeholder="Filter by author..."
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
    </motion.form>
  );
};

export default SearchFilter;
