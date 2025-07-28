import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { ContentType, ReactionResponse } from "@/types";

interface UseReactionsOptions {
  contentId: string;
  contentType: ContentType;
  onSuccess?: (response: ReactionResponse) => void;
  onError?: (error: string) => void;
}

export function useReactions(options: UseReactionsOptions) {
  const { data: session } = useSession();

  const addReaction = useCallback(
    async (emoji: string) => {
      try {
        if (!session?.user?.id) {
          throw new Error("Authentication required");
        }

        const response = await fetch("/api/reactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contentId: options.contentId,
            contentType: options.contentType,
            emoji,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error || `Failed to add reaction: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data: ReactionResponse = await response.json();
        options.onSuccess?.(data);
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to add reaction";
        console.error("Error adding reaction:", error);
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

  return { addReaction };
}
