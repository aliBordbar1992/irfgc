import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";

interface FollowRequest {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  receiver?: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
}

interface UseFollowRequestsOptions {
  type?: "received" | "sent";
  page?: number;
  limit?: number;
}

export function useFollowRequests({
  type = "received",
  page = 1,
  limit = 20,
}: UseFollowRequestsOptions = {}) {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchRequests = useCallback(async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/follow/requests?type=${type}&page=${page}&limit=${limit}`
      );

      if (response.ok) {
        const data = await response.json();
        setRequests(data.data.requests);
        setPagination(data.data.pagination);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch requests");
      }
    } catch (error) {
      console.error("Error fetching follow requests:", error);
      setError("Failed to fetch requests");
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, type, page, limit]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const refresh = useCallback(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    isLoading,
    error,
    pagination,
    refresh,
  };
}
