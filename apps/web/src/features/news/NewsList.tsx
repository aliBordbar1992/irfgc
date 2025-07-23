"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { GameSlug, NewsPost } from "@/types";
import { NewsListItem } from "./NewsListItem";
import { FeaturedNewsCard } from "./FeaturedNewsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface NewsListProps {
  gameSlug: GameSlug | null;
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

interface FeaturedNewsResponse {
  data: NewsPost[];
  total: number;
}

export function NewsList({ gameSlug }: NewsListProps) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const scrollRestoredRef = useRef(false);

  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [error, setError] = useState("");
  const [featuredError, setFeaturedError] = useState("");
  const [hasMore, setHasMore] = useState(true);

  // Get page from URL params, default to 1
  const currentPage = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    // Reset news posts when gameSlug changes to prevent mixing articles from different games
    setNewsPosts([]);
    setHasMore(true);
    fetchFeaturedNews();
    fetchNews();
  }, [gameSlug]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchNews();
    }
  }, [currentPage]);

  // Reset scroll restoration when gameSlug changes
  useEffect(() => {
    scrollRestoredRef.current = false;
  }, [gameSlug]);

  // Restore scroll position when component mounts
  useEffect(() => {
    if (!scrollRestoredRef.current) {
      const scrollKey = `news-scroll-${gameSlug || "general"}-${currentPage}`;
      const savedScroll = sessionStorage.getItem(scrollKey);

      if (savedScroll) {
        try {
          const { scrollY, timestamp } = JSON.parse(savedScroll);
          // Only restore if the scroll position was saved within the last 30 minutes
          if (Date.now() - timestamp < 30 * 60 * 1000) {
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
              window.scrollTo(0, scrollY);
            });
          }
          // Clear the saved scroll position after restoring
          sessionStorage.removeItem(scrollKey);
        } catch (error) {
          console.error("Error restoring scroll position:", error);
        }
      }
      scrollRestoredRef.current = true;
    }
  }, [gameSlug, currentPage]);

  const updatePageInUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const fetchFeaturedNews = async () => {
    try {
      setFeaturedLoading(true);
      setFeaturedError("");

      const response = await fetch(
        gameSlug
          ? `/api/news/featured?gameSlug=${gameSlug}&limit=5`
          : `/api/news/featured?limit=5`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch featured news");
      }

      const data: FeaturedNewsResponse = await response.json();
      setFeaturedNews(data.data);
    } catch (err) {
      setFeaturedError("Failed to load featured news");
      console.error("Error fetching featured news:", err);
    } finally {
      setFeaturedLoading(false);
    }
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        gameSlug
          ? `/api/news?gameSlug=${gameSlug}&page=${currentPage}&limit=10`
          : `/api/news?page=${currentPage}&limit=10`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }

      const data: NewsResponse = await response.json();

      if (currentPage === 1) {
        setNewsPosts(data.data);
      } else {
        // Prevent duplicate articles by checking existing IDs
        setNewsPosts((prev) => {
          const existingIds = new Set(prev.map((article) => article.id));
          const newArticles = data.data.filter(
            (article) => !existingIds.has(article.id)
          );
          return [...prev, ...newArticles];
        });
      }

      setHasMore(currentPage < data.pagination.totalPages);
    } catch (err) {
      setError("Failed to load news");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (error) {
      fetchNews();
    }
    if (featuredError) {
      fetchFeaturedNews();
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    updatePageInUrl(nextPage);
  };

  const hasAnyContent = newsPosts.length > 0 || featuredNews.length > 0;
  const hasAnyError = error || featuredError;
  const isLoading = loading && featuredLoading;

  if (hasAnyError) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">{error || featuredError}</p>
          <Button onClick={handleRetry} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!hasAnyContent && !isLoading) {
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
      {/* Featured Articles Section */}
      {featuredNews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Featured Articles
          </h2>
          {featuredNews.map((article) => (
            <FeaturedNewsCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Regular News List */}
      {newsPosts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Latest News</h2>
          <div className="space-y-2">
            {newsPosts.map((article) => (
              <NewsListItem
                key={article.id}
                article={article}
                gameSlug={gameSlug}
              />
            ))}
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <Button onClick={handleLoadMore} disabled={loading} variant="outline">
            {loading ? "Loading..." : "Load More Articles"}
          </Button>
        </div>
      )}
    </div>
  );
}
