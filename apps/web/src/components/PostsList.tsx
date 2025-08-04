"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Post } from "@/components/Post";
import { usePostsData } from "@/hooks/usePostsData";

interface PostsListProps {
  authorId?: string;
  title?: string;
  showCreateButton?: boolean;
  onPostDeleted?: () => void;
  onPostUpdated?: () => void;
}

export function PostsList({
  authorId,
  title = "Posts",
  showCreateButton = false,
  onPostDeleted,
  onPostUpdated,
}: PostsListProps) {
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = usePostsData({
    authorId,
    page,
    limit: 10,
    enabled: true,
  });

  const handlePostDeleted = () => {
    refetch();
    onPostDeleted?.();
  };

  const handlePostUpdated = () => {
    refetch();
    onPostUpdated?.();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading posts...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading posts: {error}</p>
            <Button onClick={refetch} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.posts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">No posts found.</p>
            {showCreateButton && (
              <p className="text-gray-400 mt-2">
                Be the first to share something!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            {showCreateButton && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {data.total} post{data.total !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                onDelete={handlePostDeleted}
                onUpdate={handlePostUpdated}
              />
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="text-sm text-gray-500">
                Page {page} of {data.totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= data.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
