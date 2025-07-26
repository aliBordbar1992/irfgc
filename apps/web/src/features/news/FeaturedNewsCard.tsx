"use client";

import Link from "next/link";
import { NewsPost } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

interface FeaturedNewsCardProps {
  article: NewsPost;
}

export function FeaturedNewsCard({ article }: FeaturedNewsCardProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              Featured
            </span>
            {article.game && (
              <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                {article.game.name}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {article.title}
          </h2>
          <p className="text-lg text-gray-700 mb-4">{article.excerpt}</p>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {article.tags.slice(0, 4).map((tagRelation) => (
                <span
                  key={tagRelation.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/70 text-gray-700 border border-blue-200"
                >
                  {tagRelation.tag.name}
                </span>
              ))}
              {article.tags.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/70 text-gray-500 border border-blue-200">
                  +{article.tags.length - 4} more
                </span>
              )}
            </div>
          )}

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

        {/* Thumbnail Image */}
        {article.thumbnail && (
          <div className="flex-shrink-0 ml-4">
            <Image
              src={article.thumbnail}
              alt={article.title}
              className="w-32 h-20 object-cover rounded-lg"
              width={128}
              height={80}
              unoptimized
            />
          </div>
        )}

        <Button asChild className="ml-4">
          <Link href={`/news/${article.id}`}>Read Full Article</Link>
        </Button>
      </div>
    </div>
  );
}
