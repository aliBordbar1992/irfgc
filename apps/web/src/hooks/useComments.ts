import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { ContentType, CommentResponse } from "@/types";

interface UseCommentsOptions {
  contentId: string;
  contentType: ContentType;
  onSuccess?: (response: CommentResponse) => void;
  onError?: (error: string) => void;
}

export function useComments(options: UseCommentsOptions) {
  const { data: session } = useSession();

  const createComment = useCallback(
    async (content: string, parentId?: string) => {
      try {
        if (!session?.user?.id) {
          throw new Error("Authentication required");
        }

        const response = await fetch("/api/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            contentId: options.contentId,
            contentType: options.contentType,
            parentId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error || `Failed to create comment: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data: CommentResponse = await response.json();
        options.onSuccess?.(data);
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create comment";
        console.error("Error creating comment:", error);
        options.onError?.(errorMessage);
        throw error;
      }
    },
    [
      options.contentId,
      options.contentType,
      options.onSuccess,
      options.onError,
      session?.user?.id,
    ]
  );

  const updateComment = useCallback(
    async (commentId: string, content: string) => {
      try {
        if (!session?.user?.id) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`/api/comments?commentId=${commentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error || `Failed to update comment: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data: CommentResponse = await response.json();
        options.onSuccess?.(data);
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update comment";
        console.error("Error updating comment:", error);
        options.onError?.(errorMessage);
        throw error;
      }
    },
    [options.onSuccess, options.onError, session?.user?.id]
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      try {
        if (!session?.user?.id) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`/api/comments?commentId=${commentId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error || `Failed to delete comment: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data: CommentResponse = await response.json();
        options.onSuccess?.(data);
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete comment";
        console.error("Error deleting comment:", error);
        options.onError?.(errorMessage);
        throw error;
      }
    },
    [options.onSuccess, options.onError, session?.user?.id]
  );

  return { createComment, updateComment, deleteComment };
}
