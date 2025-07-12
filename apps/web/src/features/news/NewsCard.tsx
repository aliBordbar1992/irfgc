"use client";

import { NewsPost } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, User } from "lucide-react";

interface NewsCardProps {
  article: NewsPost;
}

export function NewsCard({ article }: NewsCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {article.excerpt}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>
          <span className="text-xs text-gray-500">
            {getReadTime(article.content)}
          </span>
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" className="w-full">
            Read More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
