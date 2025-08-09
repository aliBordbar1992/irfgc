import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";

interface FollowStats {
  followerCount: number;
  followingCount: number;
}

interface UseFollowStatsOptions {
  targetUserId: string;
  enabled?: boolean;
}

// Context for sharing follow stats updates across components
interface FollowStatsContextValue {
  refreshStats: (userId: string) => void;
}

const FollowStatsContext = createContext<FollowStatsContextValue | null>(null);

export function useFollowStatsContext() {
  return useContext(FollowStatsContext);
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
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchStats = useCallback(async () => {
    if (!targetUserId || !enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/users/${targetUserId}/follow-stats?_t=${refreshKey}`
      );

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
  }, [targetUserId, enabled, refreshKey]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
    refresh,
  };
}
