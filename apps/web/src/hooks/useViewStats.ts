import { useState, useEffect } from "react";

import { ContentType } from "@/types";
type Period = "day" | "week" | "month" | "all";

interface ViewStats {
  contentId: string;
  contentType: ContentType;
  period: Period;
  totalViews: number;
  uniqueViewers: number;
  recentViews: Array<{
    viewedAt: string;
    userId: string | null;
    anonId: string | null;
    ip: string | null;
  }>;
}

interface UseViewStatsOptions {
  contentId: string;
  contentType: ContentType;
  period?: Period;
  enabled?: boolean;
}

export function useViewStats(options: UseViewStatsOptions) {
  const [stats, setStats] = useState<ViewStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        contentId: options.contentId,
        contentType: options.contentType,
        period: options.period || "all",
      });

      const response = await fetch(`/api/views/stats?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch view statistics");
      }

      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch view statistics"
      );
      console.error("Error fetching view stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!options.enabled || !options.contentId || !options.contentType) {
      return;
    }

    fetchStats();
  }, [options.contentId, options.contentType, options.period, options.enabled]);

  const refetch = () => {
    if (options.enabled && options.contentId && options.contentType) {
      fetchStats();
    }
  };

  return { stats, loading, error, refetch };
}
