import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Post {
  id: string;
  content: string;
  images: string[];
  videos: string[];
  authorId: string;
  createdAt: string;
  updatedAt?: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  _count: {
    comments: number;
  };
}

interface PostsData {
  posts: Post[];
  total: number;
  totalPages: number;
}

interface UsePostsDataOptions {
  authorId?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export function usePostsData(options: UsePostsDataOptions) {
  const { data: session } = useSession();
  const [data, setData] = useState<PostsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    if (!options.enabled) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: (options.page || 1).toString(),
        limit: (options.limit || 10).toString(),
      });

      if (options.authorId) {
        params.append("authorId", options.authorId);
      }

      const response = await fetch(`/api/posts?${params}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || `Failed to fetch posts: ${response.status}`;
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      setData(responseData.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch posts";
      setError(errorMessage);
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [
    options.authorId,
    options.page,
    options.limit,
    options.enabled,
    session?.user?.id,
  ]);

  const refetch = () => {
    fetchPosts();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}
