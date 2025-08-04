import { useCallback } from "react";
import { useSession } from "next-auth/react";

interface UsePostsOptions {
  onSuccess?: (response: unknown) => void;
  onError?: (error: string) => void;
}

export function usePosts(options: UsePostsOptions) {
  const { data: session } = useSession();

  const createPost = useCallback(
    async (content: string, images: string[] = [], videos: string[] = []) => {
      try {
        if (!session?.user?.id) {
          throw new Error("Authentication required");
        }

        const response = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            images,
            videos,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error || `Failed to create post: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        options.onSuccess?.(data);
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create post";
        console.error("Error creating post:", error);
        options.onError?.(errorMessage);
        throw error;
      }
    },
    [options.onSuccess, options.onError, session?.user?.id]
  );

  const updatePost = useCallback(
    async (
      postId: string,
      content: string,
      images: string[] = [],
      videos: string[] = []
    ) => {
      try {
        if (!session?.user?.id) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`/api/posts/${postId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            images,
            videos,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error || `Failed to update post: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        options.onSuccess?.(data);
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update post";
        console.error("Error updating post:", error);
        options.onError?.(errorMessage);
        throw error;
      }
    },
    [options.onSuccess, options.onError, session?.user?.id]
  );

  const deletePost = useCallback(
    async (postId: string) => {
      try {
        if (!session?.user?.id) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`/api/posts/${postId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error || `Failed to delete post: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        options.onSuccess?.(data);
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete post";
        console.error("Error deleting post:", error);
        options.onError?.(errorMessage);
        throw error;
      }
    },
    [options.onSuccess, options.onError, session?.user?.id]
  );

  return { createPost, updatePost, deletePost };
}
