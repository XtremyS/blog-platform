import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getPostsWithFilters } from "@/lib/db";
import SearchFilter from "@/components/SearchFilter";
import PostsContainer from "@/components/PostContainer";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const session = await getServerSession(authOptions);
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const search = resolvedSearchParams.search || "";
  const author = resolvedSearchParams.author || "";
  const postsPerPage = 3;

  const { posts, total } = await getPostsWithFilters({
    search,
    author,
    page,
    limit: postsPerPage,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {session ? (
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Welcome back, {session.user?.name}! You are looking beautiful today.
        </p>
      ) : (
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Please{" "}
          <Link
            href="/api/auth/signin"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            sign in
          </Link>{" "}
          to create or edit posts.
        </p>
      )}
      <SearchFilter initialSearch={search} initialAuthor={author} />
      <PostsContainer
        initialPosts={posts}
        total={total}
        page={page}
        search={search}
        author={author}
        postsPerPage={postsPerPage}
        isAuthenticated={!!session}
      />
    </div>
  );
}
