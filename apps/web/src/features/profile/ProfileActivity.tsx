import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MessageSquare,
  Users,
  FileText,
  Trophy,
  Clock,
  ExternalLink,
} from "lucide-react";

interface ProfileActivityProps {
  events: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    startDate: Date;
    game: {
      slug: string;
      name: string;
    };
  }>;
  newsPosts: Array<{
    id: string;
    title: string;
    publishedAt: Date;
    game: {
      slug: string;
      name: string;
    };
  }>;
  lfgPosts: Array<{
    id: string;
    title: string;
    createdAt: Date;
    game: {
      slug: string;
      name: string;
    };
  }>;
  forumThreads: Array<{
    id: string;
    title: string;
    createdAt: Date;
    game: {
      slug: string;
      name: string;
    };
    _count: {
      replies: number;
    };
  }>;
  registrations: Array<{
    id: string;
    createdAt: Date;
    event: {
      id: string;
      title: string;
      game: {
        slug: string;
        name: string;
      };
    };
  }>;
}

export function ProfileActivity({
  events,
  newsPosts,
  lfgPosts,
  forumThreads,
  registrations,
}: ProfileActivityProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-yellow-100 text-yellow-800";
      case "ONGOING":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recent Events */}
        {events.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Recent Events
            </h4>
            <div className="space-y-2">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/${event.game.slug}/events/${event.id}`}
                  className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.game.name} • {formatDate(event.startDate)}
                      </p>
                    </div>
                    <Badge
                      className={`text-xs ${getEventStatusColor(event.status)}`}
                    >
                      {event.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent News Posts */}
        {newsPosts.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Recent News
            </h4>
            <div className="space-y-2">
              {newsPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${post.game.slug}/news/${post.id}`}
                  className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {post.game.name} • {formatDate(post.publishedAt)}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent LFG Posts */}
        {lfgPosts.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Recent LFG Posts
            </h4>
            <div className="space-y-2">
              {lfgPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${post.game.slug}/matchmaking/${post.id}`}
                  className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {post.game.name} • {formatDate(post.createdAt)}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Forum Threads */}
        {forumThreads.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Recent Forum Threads
            </h4>
            <div className="space-y-2">
              {forumThreads.map((thread) => (
                <Link
                  key={thread.id}
                  href={`/${thread.game.slug}/forum/${thread.id}`}
                  className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {thread.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {thread.game.name} • {formatDate(thread.createdAt)} •{" "}
                        {thread._count.replies} replies
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Event Registrations */}
        {registrations.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Recent Registrations
            </h4>
            <div className="space-y-2">
              {registrations.map((registration) => (
                <Link
                  key={registration.id}
                  href={`/${registration.event.game.slug}/events/${registration.event.id}`}
                  className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {registration.event.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {registration.event.game.name} •{" "}
                        {formatDate(registration.createdAt)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Registered
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {events.length === 0 &&
          newsPosts.length === 0 &&
          lfgPosts.length === 0 &&
          forumThreads.length === 0 &&
          registrations.length === 0 && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No activity yet</p>
              <p className="text-sm text-gray-400">
                Start participating in events, posting in forums, or creating
                content to see your activity here.
              </p>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
