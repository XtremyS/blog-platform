"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../lib/ThemeProvider";

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 shadow-md"
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          Blog Platform
        </Link>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          {status === "loading" ? (
            <span className="text-gray-600 dark:text-gray-300">Loading...</span>
          ) : status === "authenticated" && session?.user?.name ? (
            <>
              <span className="text-gray-700 dark:text-gray-200">
                Welcome, {session.user.name}
              </span>
              <Link
                href="/api/auth/signout"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Sign Out
              </Link>
              <Link
                href="/create"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Create Post
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/api/auth/signin"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Sign In
              </Link>
              <Link
                href="/create"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Create Post
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
