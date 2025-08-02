"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useComments } from "@/hooks/useComments";
import { useCommentData } from "@/hooks/useCommentData";

import { Comment, ContentType } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Reply, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { getPublicProfileUrl } from "@/lib/utils";
import { Reactions } from "./Reactions";

interface CommentItemProps {
  comment: Comment;
  contentId: string;
  contentType: ContentType;
  onCommentUpdate: () => void;
  depth?: number;
}

export function CommentItem({
  comment,
  contentId,
  contentType,
  onCommentUpdate,
  depth = 0,
}: CommentItemProps) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  const { updateComment, deleteComment } = useComments({
    contentId,
    contentType,
    onSuccess: () => {
      setIsEditing(false);
      setIsReplying(false);
      setEditContent(comment.content);
      setReplyContent("");
      onCommentUpdate();
    },
    onError: (error) => {
      console.error("Comment action failed:", error);
    },
  });

  const { createComment } = useComments({
    contentId,
    contentType,
    onSuccess: () => {
      setIsReplying(false);
      setReplyContent("");
      onCommentUpdate();
    },
    onError: (error) => {
      console.error("Failed to create reply:", error);
    },
  });

  const { data: repliesData } = useCommentData({
    contentId,
    contentType,
    parentId: comment.id,
    enabled: showReplies,
  });

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    await updateComment(comment.id, editContent.trim());
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      await deleteComment(comment.id);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    await createComment(replyContent.trim(), comment.id);
  };

  const isAuthor = session?.user?.id === comment.author.id;
  const replyCount = comment._count?.replies || 0;

  return (
    <div
      className={`space-y-3 ${
        depth > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.author.avatar || ""} />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Link
                  href={getPublicProfileUrl(comment.author.username)}
                  className="font-medium text-sm hover:text-blue-600 transition-colors"
                >
                  {comment.author.name}
                </Link>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
                {comment.parent && (
                  <span className="text-xs text-gray-500">
                    replying to{" "}
                    <Link
                      href={getPublicProfileUrl(comment.parent.author.username)}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {comment.parent.author.name}
                    </Link>
                  </span>
                )}
              </div>

              {isAuthor && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleEdit}>
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm whitespace-pre-wrap">
                {comment.content}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="h-8 px-2 text-xs"
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>

            <Reactions
              contentId={comment.id}
              contentType={ContentType.COMMENT}
              className="h-8"
            />

            {replyCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="h-8 px-2 text-xs"
              >
                {showReplies ? (
                  <ChevronUp className="h-3 w-3 mr-1" />
                ) : (
                  <ChevronDown className="h-3 w-3 mr-1" />
                )}
                {replyCount} {replyCount === 1 ? "reply" : "replies"}
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-3 space-y-2">
              <div className="flex items-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={session?.user?.avatar || ""} />
                  <AvatarFallback>
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[60px] text-sm"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={handleReply}
                      disabled={!replyContent.trim()}
                    >
                      Reply
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsReplying(false);
                        setReplyContent("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Replies */}
          {showReplies && repliesData?.comments && (
            <div className="mt-3 space-y-3">
              {repliesData.comments.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  contentId={contentId}
                  contentType={contentType}
                  onCommentUpdate={onCommentUpdate}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
