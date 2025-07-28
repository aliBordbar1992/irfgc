"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useComments } from "@/hooks/useComments";
import { useCommentData } from "@/hooks/useCommentData";
import { ContentType } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle } from "lucide-react";
import { CommentItem } from "./CommentItem";
import { AuthModal } from "./AuthModal";

interface CommentsProps {
  contentId: string;
  contentType: ContentType;
  className?: string;
}

export function Comments({ contentId, contentType, className }: CommentsProps) {
  const { data: session } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "replies">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useCommentData({
    contentId,
    contentType,
    sortBy,
    sortOrder,
    page,
    limit: 20,
    enabled: true,
  });

  const { createComment } = useComments({
    contentId,
    contentType,
    onSuccess: () => {
      setNewComment("");
      refetch();
    },
    onError: (error) => {
      console.error("Failed to create comment:", error);
    },
  });

  const handleSubmitComment = async () => {
    if (!session?.user?.id) {
      setShowAuthModal(true);
      return;
    }

    if (!newComment.trim()) return;

    try {
      await createComment(newComment.trim());
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleSortChange = (value: string) => {
    if (value === "date" || value === "replies") {
      setSortBy(value);
    }
  };

  const handleSortOrderChange = (value: string) => {
    if (value === "asc" || value === "desc") {
      setSortOrder(value);
    }
  };

  const loadMoreComments = () => {
    setPage((prev) => prev + 1);
  };

  if (loading && !data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
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
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            Error loading comments: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalComments = data?.totalComments || 0;
  const comments = data?.comments || [];
  const hasMoreComments = totalComments > comments.length;

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments ({totalComments})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="replies">Replies</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">↓</SelectItem>
                  <SelectItem value="asc">↑</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comment Form */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.avatar || ""} />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder={
                    session?.user?.id
                      ? "Write a comment..."
                      : "Sign in to comment"
                  }
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
                  disabled={!session?.user?.id}
                />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {newComment.length}/1000 characters
                  </div>
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || !session?.user?.id}
                    size="sm"
                  >
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  contentId={contentId}
                  contentType={contentType}
                  onCommentUpdate={refetch}
                />
              ))
            )}
          </div>

          {/* Load More */}
          {hasMoreComments && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={loadMoreComments}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More Comments"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign in to comment"
        message="You need to be signed in to leave a comment."
      />
    </>
  );
}
