"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NewsPost } from "@/types";
import { Calendar, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewsArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [newsPost, setNewsPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNewsPost();
  }, [id]);

  const fetchNewsPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news/${id}`);

      if (response.status === 404) {
        setError("News article not found");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch news post");
      }

      const data = await response.json();
      setNewsPost(data.data);
    } catch (err) {
      setError("Failed to load news article");
      console.error("Error fetching news post:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !newsPost) {
    const isNotFound = error === "News article not found";

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isNotFound
              ? "News Article Not Found"
              : error || "News article not found"}
          </h1>
          {isNotFound && (
            <p className="text-gray-600 mb-6">
              The news article you&apos;re looking for doesn&apos;t exist or may
              have been removed.
            </p>
          )}
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/news" className="hover:text-gray-900">
              News
            </Link>
            <span>/</span>
            {newsPost.game && (
              <>
                <Link
                  href={`/${newsPost.game.slug}/news`}
                  className="hover:text-gray-900"
                >
                  {newsPost.game.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900">{newsPost.title}</span>
          </div>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {newsPost.game && (
              <Badge variant="secondary">{newsPost.game.name}</Badge>
            )}
            {newsPost.featured && (
              <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
            )}
            <Badge
              className={
                newsPost.status === "PUBLISHED"
                  ? "bg-green-100 text-green-800"
                  : newsPost.status === "DRAFT"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {newsPost.status}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {newsPost.title}
          </h1>

          <div className="flex items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={newsPost.author.avatar || undefined}
                  alt={newsPost.author.name}
                />
                <AvatarFallback className="text-xs">
                  {newsPost.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{newsPost.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(newsPost.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{newsPost.views.toLocaleString()} views</span>
            </div>
          </div>

          {newsPost.excerpt && (
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              {newsPost.excerpt}
            </p>
          )}
        </div>

        {/* Article Content */}
        <Card>
          <CardContent className="p-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: newsPost.content }}
            />
          </CardContent>
        </Card>

        {/* Article Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Avatar className="w-5 h-5">
                  <AvatarImage
                    src={newsPost.author.avatar || undefined}
                    alt={newsPost.author.name}
                  />
                  <AvatarFallback className="text-xs">
                    {newsPost.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>Published by {newsPost.author.name}</span>
              </div>
              <span>•</span>
              <span>{formatDate(newsPost.publishedAt)}</span>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
