"use client";

import Link from "next/link";
import { NewsPost } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Eye, Clock } from "lucide-react";

interface NewsListItemProps {
  article: NewsPost;
  gameSlug?: string | null;
  currentPage?: number;
}

export function NewsListItem({
  article,
  gameSlug,
  currentPage,
}: NewsListItemProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
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

  const handleArticleClick = () => {
    // Save current scroll position and page to sessionStorage
    const scrollKey = `news-scroll-${gameSlug || "general"}`;
    const scrollData = {
      scrollY: window.scrollY,
      page: currentPage || 1,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(scrollKey, JSON.stringify(scrollData));
  };

  return (
    <article className="border-b border-gray-200 py-6 last:border-b-0">
      <div className="flex gap-6">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {article.game && (
              <span className="text-sm font-medium text-blue-600">
                {article.game.name}
              </span>
            )}
            {article.featured && (
              <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            <Link href={`/news/${article.id}`} onClick={handleArticleClick}>
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
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>

              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{getReadTime(article.content)}</span>
              </div>

              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{article.views.toLocaleString()} views</span>
              </div>
            </div>

            <Button variant="outline" size="sm" asChild>
              <Link href={`/news/${article.id}`} onClick={handleArticleClick}>
                Read More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
