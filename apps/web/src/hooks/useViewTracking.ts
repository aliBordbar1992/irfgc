import { useCallback } from "react";
import { ensureAnonId } from "@/lib/utils";

import { ContentType } from "@/types";

interface TrackViewOptions {
  contentId: string;
  contentType: ContentType;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useViewTracking() {
  const trackView = useCallback(async (options: TrackViewOptions) => {
    try {
      // Ensure anonymous ID exists (this sets the cookie if needed)
      ensureAnonId();

      const response = await fetch("/api/track-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentId: options.contentId,
          contentType: options.contentType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || `Failed to track view: ${response.status}`;
        throw new Error(errorMessage);
      }

      options.onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to track view";
      console.error("Error tracking view:", error);
      options.onError?.(errorMessage);
    }
  }, []);

  return { trackView };
}
