"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GameSlug, ForumThread } from "@/types";
import { ForumThreadCard } from "./ForumThreadCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ForumListProps {
  gameSlug: GameSlug;
}

interface ForumResponse {
  data: ForumThread[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function ForumList({ gameSlug }: ForumListProps) {
  const { data: session } = useSession();
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchThreads();
  }, [gameSlug, page]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        gameSlug,
        page: page.toString(),
        limit: "10",
      });

      const response = await fetch(`/api/forum?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch forum threads");
      }

      const data: ForumResponse = await response.json();

      if (page === 1) {
        setThreads(data.data);
      } else {
        setThreads((prev) => [...prev, ...data.data]);
      }

      setHasMore(page < data.pagination.totalPages);
    } catch (err) {
      setError("Failed to load forum threads");
      console.error("Error fetching forum threads:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredThreads = threads.filter(
    (thread) =>
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchThreads} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Threads */}
      <div className="space-y-4">
        {filteredThreads.map((thread) => (
          <ForumThreadCard key={thread.id} thread={thread} />
        ))}
      </div>

      {/* Empty State */}
      {filteredThreads.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No threads found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? "No threads match your search. Try different keywords."
                : "Be the first to start a discussion!"}
            </p>
            {session && !searchQuery && <Button>Create First Thread</Button>}
          </CardContent>
        </Card>
      )}

      {hasMore && (
        <div className="text-center">
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            variant="outline"
          >
            {loading ? "Loading..." : "Load More Threads"}
          </Button>
        </div>
      )}
    </div>
  );
}
