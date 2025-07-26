"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { GameSlug } from "@/types";
import { NewsListItem } from "./NewsListItem";
import { FeaturedNewsCard } from "./FeaturedNewsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNewsStore } from "./hooks/useNewsStore";

interface NewsListProps {
  gameSlug: GameSlug | null;
}

interface NewsResponse {
  data: import("@/types").NewsPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface FeaturedNewsResponse {
  data: import("@/types").NewsPost[];
  total: number;
}

export function NewsList({ gameSlug }: NewsListProps) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const scrollRestoredRef = useRef(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Use Jotai store
  const {
    articles: newsPosts,
    featuredArticles: featuredNews,
    currentPage,
    loading,
    featuredLoading,
    error,
    featuredError,
    showLoadMoreButton,
    setFeaturedArticles: setFeaturedNews,
    setLoading,
    setFeaturedLoading,
    setError,
    setFeaturedError,
    loadMoreArticles,
    handleGameChange,
    handleBackToNews,
    setCurrentPage,
  } = useNewsStore();

  // Get page from URL params, default to 1
  const urlPage = parseInt(searchParams.get("page") || "1");

  // Sync Jotai currentPage with urlPage
  useEffect(() => {
    if (currentPage !== urlPage) {
      setCurrentPage(urlPage);
    }
  }, [urlPage, currentPage, setCurrentPage]);

  // Intersection Observer for lazy loading
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loading && currentPage < 10) {
        // Auto-load next page for first 10 pages
        const nextPage = currentPage + 1;
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", nextPage.toString());
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    },
    [loading, currentPage, searchParams, router, pathname]
  );

  // Set up Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  // Load More handler: update URL param (for pages after 10)
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", nextPage.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    // Handle game slug changes
    handleGameChange(gameSlug);
    fetchFeaturedNews();
    fetchNews(urlPage);
  }, [gameSlug, handleGameChange]);

  useEffect(() => {
    if (urlPage > 1 && urlPage !== currentPage) {
      fetchNews(urlPage);
    }
  }, [urlPage, currentPage]);

  // Reset scroll restoration when gameSlug changes
  useEffect(() => {
    scrollRestoredRef.current = false;
  }, [gameSlug]);

  // Restore scroll position when component mounts
  useEffect(() => {
    if (!scrollRestoredRef.current) {
      handleBackToNews();
      scrollRestoredRef.current = true;
    }
  }, [handleBackToNews]);

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

  const fetchNews = async (pageToFetch?: number) => {
    try {
      setLoading(true);
      setError("");

      const page = pageToFetch || urlPage;
      const response = await fetch(
        gameSlug
          ? `/api/news?gameSlug=${gameSlug}&page=${page}&limit=10`
          : `/api/news?page=${page}&limit=10`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }

      const data: NewsResponse = await response.json();

      // Use the loadMoreArticles helper from the store
      loadMoreArticles(data.data, data.pagination.totalPages, page);
    } catch (err) {
      setError("Failed to load news");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (error) {
      fetchNews(urlPage);
    }
    if (featuredError) {
      fetchFeaturedNews();
    }
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
              <NewsListItem key={article.id} article={article} />
            ))}
          </div>

          {/* Intersection Observer for lazy loading (first 10 pages) */}
          {currentPage < 10 && <div ref={observerRef} className="h-4" />}
        </div>
      )}

      {/* Load More Button (after 10 pages) */}
      {showLoadMoreButton && (
        <div className="text-center">
          <Button onClick={handleLoadMore} disabled={loading} variant="outline">
            {loading ? "Loading..." : "Load More Articles"}
          </Button>
        </div>
      )}
    </div>
  );
}
