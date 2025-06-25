"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      setError("Invalid credentials");
      toast.error("Invalid credentials");
    } else {
      toast.success("Signed in successfully!");
      router.push("/");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-md"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Sign In
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full border rounded-md p-3 text-gray-900 dark:text-gray-100 dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border rounded-md p-3 text-gray-900 dark:text-gray-100 dark:bg-gray-700"
          />
        </div>
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-blue-600 text-white rounded-md p-3 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Sign In
        </motion.button>
      </form>
    </motion.div>
  );
}
