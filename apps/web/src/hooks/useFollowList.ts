import { useState, useCallback, useEffect } from "react";

export interface FollowListUser {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
}

export interface FollowListPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface FollowListData {
  users: FollowListUser[];
  pagination: FollowListPagination;
}

interface UseFollowListOptions {
  userId: string;
  type: "followers" | "following" | "mutual";
  enabled?: boolean;
}

interface UseFollowListReturn {
  users: FollowListUser[];
  pagination: FollowListPagination | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  currentPage: number;
}

export function useFollowList({
  userId,
  type,
  enabled = true,
}: UseFollowListOptions): UseFollowListReturn {
  const [users, setUsers] = useState<FollowListUser[]>([]);
  const [pagination, setPagination] = useState<FollowListPagination | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = useCallback(
    async (page: number = 1, append: boolean = false) => {
      if (!enabled || !userId) return;

      setIsLoading(true);
      setError(null);

      try {
        const url = new URL(
          `/api/users/${userId}/followers`,
          window.location.origin
        );
        url.searchParams.set("type", type);
        url.searchParams.set("page", page.toString());
        url.searchParams.set("limit", "20");

        const response = await fetch(url.toString());

        if (response.ok) {
          const data: { data: FollowListData } = await response.json();

          if (append && page > 1) {
            setUsers((prevUsers) => [...prevUsers, ...data.data.users]);
          } else {
            setUsers(data.data.users);
          }

          setPagination(data.data.pagination);
          setCurrentPage(page);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch follow list");
        }
      } catch (error) {
        console.error("Error fetching follow list:", error);
        setError("Failed to fetch follow list");
      } finally {
        setIsLoading(false);
      }
    },
    [userId, type, enabled]
  );

  const loadMore = useCallback(() => {
    if (pagination && pagination.hasMore && !isLoading) {
      fetchUsers(currentPage + 1, true);
    }
  }, [pagination, isLoading, currentPage, fetchUsers]);

  const refresh = useCallback(() => {
    setUsers([]);
    setPagination(null);
    setCurrentPage(1);
    fetchUsers(1, false);
  }, [fetchUsers]);

  useEffect(() => {
    if (enabled && userId) {
      refresh();
    }
  }, [userId, type, enabled, refresh]);

  return {
    users,
    pagination,
    isLoading,
    error,
    hasMore: pagination?.hasMore ?? false,
    loadMore,
    refresh,
    currentPage,
  };
}
