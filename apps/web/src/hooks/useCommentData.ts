import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CommentData, ContentType } from "@/types";

interface UseCommentDataOptions {
  contentId: string;
  contentType: ContentType;
  sortBy?: "date" | "replies";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  parentId?: string;
  enabled?: boolean;
}

export function useCommentData(options: UseCommentDataOptions) {
  const { data: session } = useSession();
  const [data, setData] = useState<CommentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    if (!options.enabled) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        contentId: options.contentId,
        contentType: options.contentType,
        sortBy: options.sortBy || "date",
        sortOrder: options.sortOrder || "desc",
        page: (options.page || 1).toString(),
        limit: (options.limit || 20).toString(),
      });

      if (options.parentId) {
        params.append("parentId", options.parentId);
      }

      const response = await fetch(`/api/comments?${params}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || `Failed to fetch comments: ${response.status}`;
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      setData(responseData.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch comments";
      setError(errorMessage);
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [
    options.contentId,
    options.contentType,
    options.sortBy,
    options.sortOrder,
    options.page,
    options.limit,
    options.parentId,
    options.enabled,
    session?.user?.id,
  ]);

  const refetch = () => {
    fetchComments();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}
