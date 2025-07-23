"use client";

import Link from "next/link";
import { NewsPost } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface FeaturedNewsCardProps {
  article: NewsPost;
  gameSlug?: string | null;
  currentPage?: number;
}

export function FeaturedNewsCard({
  article,
  gameSlug,
  currentPage,
}: FeaturedNewsCardProps) {
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
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
            Featured
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {article.title}
          </h2>
          <p className="text-lg text-gray-700 mb-4">{article.excerpt}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
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
              <span>By {article.author.name}</span>
            </div>
            <span>•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <Button asChild>
          <Link href={`/news/${article.id}`} onClick={handleArticleClick}>
            Read Full Article
          </Link>
        </Button>
      </div>
    </div>
  );
}
