"use client";

import Link from "next/link";
import { NewsPost } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Clock, ArrowRight } from "lucide-react";

interface NewsListItemProps {
  article: NewsPost;
}

export function NewsListItem({ article }: NewsListItemProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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
    <div className="border-b border-gray-200 py-6 last:border-b-0 hover:bg-gray-50 transition-colors rounded-lg px-4">
      <div className="flex items-start space-x-4">
        {/* Article Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            {article.game && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {article.game.name}
              </span>
            )}
            <span className="text-xs text-gray-500">
              {formatDate(article.publishedAt)}
            </span>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            <Link href={`/news/${article.id}`} className="hover:underline">
              {article.title}
            </Link>
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Avatar className="w-5 h-5">
                  <AvatarImage
                    src={article.author.avatar || undefined}
                    alt={article.author.name}
                  />
                  <AvatarFallback className="text-xs">
                    {article.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{article.author.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{getReadTime(article.content)}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-blue-600 hover:text-blue-700"
            >
              <Link href={`/news/${article.id}`}>
                Read Article
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
