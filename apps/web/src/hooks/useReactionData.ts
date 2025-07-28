import { useState, useEffect } from "react";
import { ContentType, ReactionData } from "@/types";

interface UseReactionDataOptions {
  contentId: string;
  contentType: ContentType;
  enabled?: boolean;
}

export function useReactionData(options: UseReactionDataOptions) {
  const [data, setData] = useState<ReactionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        contentId: options.contentId,
        contentType: options.contentType,
      });

      const response = await fetch(`/api/reactions?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch reaction data");
      }

      const responseData = await response.json();
      setData(responseData.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch reaction data"
      );
      console.error("Error fetching reaction data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!options.enabled || !options.contentId || !options.contentType) {
      return;
    }

    fetchData();
  }, [options.contentId, options.contentType, options.enabled]);

  const refetch = () => {
    if (options.enabled && options.contentId && options.contentType) {
      fetchData();
    }
  };

  return { data, loading, error, refetch };
}
