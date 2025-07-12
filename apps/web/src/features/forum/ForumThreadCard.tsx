"use client";

import { ForumThread } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, User, MessageSquare, Eye, Pin, Lock } from "lucide-react";

interface ForumThreadCardProps {
  thread: ForumThread;
}

export function ForumThreadCard({ thread }: ForumThreadCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <Card
      className={`hover:shadow-md transition-shadow ${
        thread.isPinned ? "border-l-4 border-l-blue-500" : ""
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {thread.isPinned && <Pin className="w-4 h-4 text-blue-500" />}
              {thread.isLocked && <Lock className="w-4 h-4 text-red-500" />}
              <CardTitle className="text-lg">{thread.title}</CardTitle>
            </div>
            <CardDescription className="mt-2">
              {truncateContent(thread.content)}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {thread.isPinned && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Pinned
              </span>
            )}
            {thread.isLocked && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                Locked
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{thread.author.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(thread.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{thread.replyCount} replies</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{thread.viewCount} views</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              View Thread
            </Button>
            {!thread.isLocked && <Button size="sm">Reply</Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
