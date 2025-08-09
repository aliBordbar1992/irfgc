import { useState, useEffect, useCallback } from "react";

interface FollowStats {
  followerCount: number;
  followingCount: number;
}

interface UseFollowStatsOptions {
  targetUserId: string;
  enabled?: boolean;
}

export function useFollowStats({
  targetUserId,
  enabled = true,
}: UseFollowStatsOptions) {
  const [stats, setStats] = useState<FollowStats>({
    followerCount: 0,
    followingCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!targetUserId || !enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${targetUserId}/follow-stats`);

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch follow stats");
      }
    } catch (error) {
      console.error("Error fetching follow stats:", error);
      setError("Failed to fetch follow stats");
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId, enabled]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refresh = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
    refresh,
  };
}
