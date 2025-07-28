"use client";

import { useState } from "react";
import { useUserComments } from "@/hooks/useUserComments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";

interface UserCommentsProps {
  userId: string;
  className?: string;
}

export function UserComments({ userId, className }: UserCommentsProps) {
  const [page, setPage] = useState(1);

  const { data, loading, error } = useUserComments({
    userId,
    page,
    limit: 10,
    enabled: true,
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getContentTypeLabel = (contentType: string) => {
    switch (contentType) {
      case "NEWS":
        return "News";
      case "EVENT":
        return "Event";
      case "FORUM_THREAD":
        return "Forum Thread";
      case "FORUM_REPLY":
        return "Forum Reply";
      case "LFG_POST":
        return "LFG Post";
      default:
        return contentType;
    }
  };

  const getContentLink = (comment: {
    contentType: string;
    contentId: string;
  }) => {
    // This would need to be implemented based on your routing structure
    // For now, we'll return a placeholder
    switch (comment.contentType) {
      case "NEWS":
        return `/news/${comment.contentId}`;
      case "EVENT":
        return `/events/${comment.contentId}`;
      case "FORUM_THREAD":
        return `/forum/${comment.contentId}`;
      case "LFG_POST":
        return `/matchmaking/${comment.contentId}`;
      default:
        return "#";
    }
  };

  const loadMoreComments = () => {
    setPage((prev) => prev + 1);
  };

  if (loading && !data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            My Comments
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
            <MessageCircle className="h-5 w-5" />
            My Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            Error loading comments: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  const comments = data?.comments || [];
  const totalComments = data?.totalComments || 0;
  const hasMoreComments = totalComments > comments.length;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          My Comments ({totalComments})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No comments yet</p>
            <p className="text-sm text-gray-400">
              Start commenting on content to see your activity here.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={comment.author.avatar || ""} />
                      <AvatarFallback>
                        {comment.author.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getContentTypeLabel(comment.contentType)}
                        </span>
                        {comment.parent && (
                          <span className="text-blue-600">
                            (Reply to {comment.parent.author.name})
                          </span>
                        )}
                        <Link
                          href={getContentLink(comment)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Content
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMoreComments && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={loadMoreComments}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More Comments"}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
