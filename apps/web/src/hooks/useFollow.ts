import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";

interface FollowStatus {
  status: "none" | "following" | "request_sent" | "request_received";
  followerCount: number;
  followingCount: number;
}

interface UseFollowOptions {
  targetUserId: string;
  onStatusChange?: (status: FollowStatus) => void;
}

export function useFollow({ targetUserId, onStatusChange }: UseFollowOptions) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState<FollowStatus>({
    status: "none",
    followerCount: 0,
    followingCount: 0,
  });

  const fetchFollowStatus = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/follow?targetUserId=${targetUserId}`);
      if (response.ok) {
        const data = await response.json();
        setFollowStatus(data.data);
        onStatusChange?.(data.data);
      }
    } catch (error) {
      console.error("Error fetching follow status:", error);
    }
  }, [targetUserId, session?.user?.id, onStatusChange]);

  const performFollowAction = useCallback(
    async (
      action: "follow" | "unfollow" | "cancel_request" | "accept" | "reject"
    ) => {
      if (!session?.user?.id) return;

      setIsLoading(true);
      try {
        const response = await fetch("/api/follow", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetUserId,
            action,
          }),
        });

        if (response.ok) {
          // Refresh follow status after action
          await fetchFollowStatus();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to perform action");
        }
      } catch (error) {
        console.error("Error performing follow action:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [targetUserId, session?.user?.id, fetchFollowStatus]
  );

  const follow = useCallback(
    () => performFollowAction("follow"),
    [performFollowAction]
  );
  const unfollow = useCallback(
    () => performFollowAction("unfollow"),
    [performFollowAction]
  );
  const cancelRequest = useCallback(
    () => performFollowAction("cancel_request"),
    [performFollowAction]
  );
  const acceptRequest = useCallback(
    () => performFollowAction("accept"),
    [performFollowAction]
  );
  const rejectRequest = useCallback(
    () => performFollowAction("reject"),
    [performFollowAction]
  );

  return {
    followStatus,
    isLoading,
    fetchFollowStatus,
    follow,
    unfollow,
    cancelRequest,
    acceptRequest,
    rejectRequest,
  };
}
