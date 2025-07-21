"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GameSlug, NewsPost } from "@/types";
import { NewsCard } from "./NewsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface NewsListProps {
  gameSlug: GameSlug;
}

interface NewsResponse {
  data: NewsPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function NewsList({ gameSlug }: NewsListProps) {
  const { data: session } = useSession();
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [gameSlug, page]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/news?gameSlug=${gameSlug}&page=${page}&limit=10`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }

      const data: NewsResponse = await response.json();

      if (page === 1) {
        setNewsPosts(data.data);
      } else {
        setNewsPosts((prev) => [...prev, ...data.data]);
      }

      setHasMore(page < data.pagination.totalPages);
    } catch (err) {
      setError("Failed to load news");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchNews} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (newsPosts.length === 0 && !loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">
            {gameSlug === "general"
              ? "No news articles found."
              : "No news articles found for this game."}
          </p>
          {(session?.user.role === "ADMIN" ||
            session?.user.role === "MODERATOR") && (
            <p className="text-sm text-gray-500 mt-2">
              Create the first news article to get started!
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Featured Article */}
      {newsPosts.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
                Featured
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {newsPosts[0].title}
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                {newsPosts[0].excerpt}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>By {newsPosts[0].author.name}</span>
                <span>•</span>
                <span>
                  {new Date(newsPosts[0].publishedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button>Read Full Article</Button>
          </div>
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsPosts.slice(1).map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            variant="outline"
          >
            {loading ? "Loading..." : "Load More Articles"}
          </Button>
        </div>
      )}
    </div>
  );
}
