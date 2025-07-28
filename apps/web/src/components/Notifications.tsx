"use client";

import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageCircle, Calendar, Users, Check } from "lucide-react";
import Link from "next/link";

interface NotificationsProps {
  className?: string;
}

export function Notifications({ className }: NotificationsProps) {
  const [showAll, setShowAll] = useState(false);

  const { data, loading, error, markAsRead } = useNotifications({
    page: 1,
    limit: showAll ? 20 : 5,
    unreadOnly: !showAll,
    enabled: true,
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "COMMENT_REPLY":
        return <MessageCircle className="w-4 h-4" />;
      case "EVENT_REGISTRATION":
        return <Calendar className="w-4 h-4" />;
      case "FORUM_REPLY":
        return <MessageCircle className="w-4 h-4" />;
      case "LFG_MATCH":
        return <Users className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "COMMENT_REPLY":
        return "bg-blue-100 text-blue-800";
      case "EVENT_REGISTRATION":
        return "bg-green-100 text-green-800";
      case "FORUM_REPLY":
        return "bg-purple-100 text-purple-800";
      case "LFG_MATCH":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getContentLink = (notification: {
    contentId?: string;
    contentType?: string;
  }) => {
    if (!notification.contentId || !notification.contentType) return "#";

    switch (notification.contentType) {
      case "NEWS":
        return `/news/${notification.contentId}`;
      case "EVENT":
        return `/events/${notification.contentId}`;
      case "FORUM_THREAD":
        return `/forum/${notification.contentId}`;
      case "LFG_POST":
        return `/matchmaking/${notification.contentId}`;
      default:
        return "#";
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead([notificationId]);
  };

  const handleMarkAllAsRead = async () => {
    await markAsRead();
  };

  if (loading && !data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            Error loading notifications: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>{showAll ? "No notifications" : "No unread notifications"}</p>
            <p className="text-sm text-gray-400">
              {showAll
                ? "You'll see notifications here when you receive them."
                : "You're all caught up!"}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    notification.isRead
                      ? "bg-gray-50"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </span>
                        {!notification.isRead && (
                          <Badge
                            className={`text-xs ${getNotificationColor(
                              notification.type
                            )}`}
                          >
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatDate(notification.createdAt)}
                        </span>
                        <div className="flex items-center gap-2">
                          {notification.contentId && (
                            <Link
                              href={getContentLink(notification)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              View Content
                            </Link>
                          )}
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="h-6 px-2 text-xs"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Unread Only" : "Show All Notifications"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
