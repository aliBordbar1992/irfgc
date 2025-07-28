import { useState, useEffect } from "react";
import { Comment } from "@/types";

interface UseUserCommentsOptions {
  userId: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

interface UserCommentsData {
  userId: string;
  comments: Comment[];
  totalComments: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useUserComments(options: UseUserCommentsOptions) {
  const [data, setData] = useState<UserCommentsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserComments = async () => {
    if (!options.enabled) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: (options.page || 1).toString(),
        limit: (options.limit || 20).toString(),
      });

      const response = await fetch(
        `/api/users/${options.userId}/comments?${params}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          `Failed to fetch user comments: ${response.status}`;
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      setData(responseData.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch user comments";
      setError(errorMessage);
      console.error("Error fetching user comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserComments();
  }, [options.userId, options.page, options.limit, options.enabled]);

  const refetch = () => {
    fetchUserComments();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}
