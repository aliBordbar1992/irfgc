"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  Newspaper,
  Gamepad2,
  MessageSquare,
  Eye,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface RecentActivityProps {
  data: {
    users: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      createdAt: Date;
    }>;
    events: Array<{
      id: string;
      title: string;
      game: { slug: string; fullName: string };
      createdBy: { id: string; name: string };
      createdAt: Date;
      updatedAt: Date;
      deletedAt?: Date;
    }>;
    news: Array<{
      id: string;
      title: string;
      game: { slug: string; fullName: string } | null;
      author: { id: string; name: string };
      publishedAt: Date;
      updatedAt: Date;
      deletedAt?: Date;
    }>;
    lfg: Array<{
      id: string;
      title: string;
      game: { slug: string; fullName: string };
      author: { name: string };
      createdAt: Date;
    }>;
    forumThreads: Array<{
      id: string;
      title: string;
      game: { slug: string; fullName: string };
      author: { name: string };
      createdAt: Date;
    }>;
  };
}

const activityIcons = {
  user: Users,
  event: Calendar,
  eventUpdated: Edit,
  eventDeleted: Trash2,
  news: Newspaper,
  newsUpdated: Edit,
  newsDeleted: Trash2,
  lfg: Gamepad2,
  forum: MessageSquare,
};

const activityColors = {
  user: "bg-blue-100 text-blue-800",
  event: "bg-green-100 text-green-800",
  eventUpdated: "bg-yellow-100 text-yellow-800",
  eventDeleted: "bg-red-100 text-red-800",
  news: "bg-purple-100 text-purple-800",
  newsUpdated: "bg-yellow-100 text-yellow-800",
  newsDeleted: "bg-red-100 text-red-800",
  lfg: "bg-orange-100 text-orange-800",
  forum: "bg-indigo-100 text-indigo-800",
};

export function RecentActivity({ data }: RecentActivityProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fa-IR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "moderator":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Combine and sort all activities by date
  const allActivities = [
    ...data.users.map((user) => ({
      type: "user" as const,
      id: user.id,
      title: `${user.name} joined`,
      subtitle: user.email,
      game: null,
      author: null,
      role: user.role,
      date: user.createdAt,
      href: `/dashboard/users/${user.id}`,
    })),
    // Event activities - create separate entries for created, updated, and deleted
    ...data.events.flatMap((event) => {
      const activities = [];

      // Event created
      activities.push({
        type: "event" as const,
        id: `${event.id}-created`,
        title: event.title,
        subtitle: `Event created by ${event.createdBy.name}`,
        game: event.game,
        author: event.createdBy,
        role: null,
        date: event.createdAt,
        href: `/dashboard/events`,
      });

      // Event updated (only if updated after creation)
      if (event.updatedAt > event.createdAt) {
        activities.push({
          type: "eventUpdated" as const,
          id: `${event.id}-updated`,
          title: event.title,
          subtitle: `Event updated by ${event.createdBy.name}`,
          game: event.game,
          author: event.createdBy,
          role: null,
          date: event.updatedAt,
          href: `/dashboard/events`,
        });
      }

      // Event deleted
      if (event.deletedAt) {
        activities.push({
          type: "eventDeleted" as const,
          id: `${event.id}-deleted`,
          title: event.title,
          subtitle: `Event deleted by ${event.createdBy.name}`,
          game: event.game,
          author: event.createdBy,
          role: null,
          date: event.deletedAt,
          href: `/dashboard/events`,
        });
      }

      return activities;
    }),
    // News activities - create separate entries for created, updated, and deleted
    ...data.news.flatMap((article) => {
      const activities = [];

      // News created
      activities.push({
        type: "news" as const,
        id: `${article.id}-created`,
        title: article.title,
        subtitle: `News created by ${article.author.name}`,
        game: article.game,
        author: article.author,
        role: null,
        date: article.publishedAt,
        href: `/dashboard/news/${article.id}`,
      });

      // News updated (only if updated after publication)
      if (article.updatedAt > article.publishedAt) {
        activities.push({
          type: "newsUpdated" as const,
          id: `${article.id}-updated`,
          title: article.title,
          subtitle: `News updated by ${article.author.name}`,
          game: article.game,
          author: article.author,
          role: null,
          date: article.updatedAt,
          href: `/dashboard/news/${article.id}`,
        });
      }

      // News deleted
      if (article.deletedAt) {
        activities.push({
          type: "newsDeleted" as const,
          id: `${article.id}-deleted`,
          title: article.title,
          subtitle: `News deleted by ${article.author.name}`,
          game: article.game,
          author: article.author,
          role: null,
          date: article.deletedAt,
          href: `/dashboard/news/${article.id}`,
        });
      }

      return activities;
    }),
    ...data.lfg.map((post) => ({
      type: "lfg" as const,
      id: post.id,
      title: post.title,
      subtitle: `by ${post.author.name}`,
      game: post.game,
      author: post.author,
      role: null,
      date: post.createdAt,
      href: `/dashboard/lfg/${post.id}`,
    })),
    ...data.forumThreads.map((thread) => ({
      type: "forum" as const,
      id: thread.id,
      title: thread.title,
      subtitle: `by ${thread.author.name}`,
      game: thread.game,
      author: thread.author,
      role: null,
      date: thread.createdAt,
      href: `/dashboard/forum/${thread.id}`,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allActivities.map((activity) => {
            const Icon = activityIcons[activity.type];

            return (
              <div
                key={`${activity.type}-${activity.id}`}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`p-2 rounded-lg ${activityColors[activity.type]}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </h4>
                    {activity.role && (
                      <Badge className={getRoleBadgeColor(activity.role)}>
                        {activity.role}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {activity.subtitle}
                  </p>
                  {activity.game && (
                    <p className="text-xs text-gray-500 mb-1">
                      {activity.game.fullName}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    {formatDate(activity.date)}
                  </p>
                </div>
                <Link href={activity.href}>
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Link href="/dashboard/activity">
            <Button variant="outline" className="w-full">
              View All Activity
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
