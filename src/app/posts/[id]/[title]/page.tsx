import { getPostById } from "@/lib/db";
import { parseContent } from "@/lib/markdown";
import CommentSection from "@/components/CommentSection";

interface PostPageProps {
  params: Promise<{ id: string; title: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-gray-600 dark:text-gray-300">
        Post not found
      </div>
    );
  }

  const content = await parseContent(post.content);

  return (
    <div className="container mx-auto px-4 py-8">
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-64 object-cover rounded-md mb-6"
        />
      )}
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {post.title}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        By {post.author} | {new Date(post.publishedAt).toLocaleDateString()}
      </p>
      <div className="prose dark:prose-invert max-w-none">{content}</div>
      <CommentSection postId={post.id} />
    </div>
  );
}
