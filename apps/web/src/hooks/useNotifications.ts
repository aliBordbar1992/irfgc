import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface Notification {
  id: string;
  userId: string;
  type:
    | "COMMENT_REPLY"
    | "EVENT_REGISTRATION"
    | "FORUM_REPLY"
    | "LFG_MATCH"
    | "SYSTEM";
  title: string;
  message: string;
  contentId?: string;
  contentType?: string;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationsData {
  notifications: Notification[];
  totalNotifications: number;
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseNotificationsOptions {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  enabled?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { data: session } = useSession();
  const [data, setData] = useState<NotificationsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!options.enabled || !session?.user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: (options.page || 1).toString(),
        limit: (options.limit || 20).toString(),
      });

      if (options.unreadOnly) {
        params.append("unreadOnly", "true");
      }

      const response = await fetch(`/api/notifications?${params}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          `Failed to fetch notifications: ${response.status}`;
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      setData(responseData.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch notifications";
      setError(errorMessage);
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [
    options.enabled,
    options.page,
    options.limit,
    options.unreadOnly,
    session?.user?.id,
  ]);

  const markAsRead = useCallback(
    async (notificationIds?: string[]) => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch("/api/notifications", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notificationIds,
            markAllAsRead: !notificationIds,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error ||
            `Failed to mark notifications as read: ${response.status}`;
          throw new Error(errorMessage);
        }

        // Refetch notifications to update the list
        await fetchNotifications();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to mark notifications as read";
        setError(errorMessage);
        console.error("Error marking notifications as read:", err);
      }
    },
    [session?.user?.id, fetchNotifications]
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const refetch = () => {
    fetchNotifications();
  };

  return {
    data,
    loading,
    error,
    refetch,
    markAsRead,
  };
}
