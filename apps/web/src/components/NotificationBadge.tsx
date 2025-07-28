"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";

interface NotificationBadgeProps {
  className?: string;
}

export function NotificationBadge({ className }: NotificationBadgeProps) {
  const { data } = useNotifications({
    page: 1,
    limit: 1,
    unreadOnly: true,
    enabled: true,
  });

  const unreadCount = data?.unreadCount || 0;

  if (unreadCount === 0) {
    return null;
  }

  return (
    <Badge
      variant="destructive"
      className={`absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center ${className}`}
    >
      {unreadCount > 99 ? "99+" : unreadCount}
    </Badge>
  );
}
