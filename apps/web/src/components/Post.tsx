"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, MessageCircle, Share } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Comments } from "@/components/Comments";
import { Reactions } from "@/components/Reactions";
import { usePosts } from "@/hooks/usePosts";
import { useSession } from "next-auth/react";

interface PostProps {
  post: {
    id: string;
    content: string;
    images: string[];
    videos: string[];
    authorId: string;
    createdAt: string;
    updatedAt?: string;
    author: {
      id: string;
      name: string;
      username: string;
      avatar?: string;
    };
    _count: {
      comments: number;
    };
  };
  onDelete?: () => void;
  onUpdate?: () => void;
}

export function Post({ post, onDelete, onUpdate }: PostProps) {
  const { data: session } = useSession();
  const { deletePost } = usePosts({
    onSuccess: () => {
      onDelete?.();
    },
    onError: (error) => {
      console.error("Failed to delete post:", error);
    },
  });

  const [showComments, setShowComments] = useState(false);

  const isAuthor = session?.user?.id === post.authorId;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post.id);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleEdit = () => {
    onUpdate?.();
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>
                {post.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{post.author.name}</div>
              <div className="text-sm text-gray-500">
                @{post.author.username} •{" "}
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Images */}
        {post.images.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-1 gap-2">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="rounded-lg max-w-full h-auto"
                />
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {post.videos.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-1 gap-2">
              {post.videos.map((video, index) => (
                <video
                  key={index}
                  src={video}
                  controls
                  className="rounded-lg max-w-full h-auto"
                >
                  Your browser does not support the video tag.
                </video>
              ))}
            </div>
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            {/* Reactions */}
            <Reactions contentId={post.id} contentType="POST" />

            {/* Comments */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post._count.comments}</span>
            </Button>

            {/* Share */}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
            >
              <Share className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>

          {post.updatedAt && (
            <Badge variant="secondary" className="text-xs">
              Edited
            </Badge>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t">
            <Comments contentId={post.id} contentType="POST" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
