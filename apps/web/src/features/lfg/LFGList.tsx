"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GameSlug, LFGPost } from "@/types";
import { LFGCard } from "./LFGCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LFGListProps {
  gameSlug: GameSlug;
}

interface LFGResponse {
  data: LFGPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function LFGList({ gameSlug }: LFGListProps) {
  const { data: session } = useSession();
  const [lfgPosts, setLfgPosts] = useState<LFGPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    platform: "all",
    region: "all",
    rank: "all",
  });

  useEffect(() => {
    fetchLFGPosts();
  }, [gameSlug, page, filters]);

  const fetchLFGPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        gameSlug,
        page: page.toString(),
        limit: "10",
      });

      if (filters.platform && filters.platform !== "all")
        params.append("platform", filters.platform);
      if (filters.region && filters.region !== "all")
        params.append("region", filters.region);
      if (filters.rank && filters.rank !== "all")
        params.append("rank", filters.rank);

      const response = await fetch(`/api/lfg?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch LFG posts");
      }

      const data: LFGResponse = await response.json();

      if (page === 1) {
        setLfgPosts(data.data);
      } else {
        setLfgPosts((prev) => [...prev, ...data.data]);
      }

      setHasMore(page < data.pagination.totalPages);
    } catch (err) {
      setError("Failed to load LFG posts");
      console.error("Error fetching LFG posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ platform: "all", region: "all", rank: "all" });
    setPage(1);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchLFGPosts} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <Select
                value={filters.platform}
                onValueChange={(value) => handleFilterChange("platform", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="PC">PC</SelectItem>
                  <SelectItem value="PS5">PS5</SelectItem>
                  <SelectItem value="PS4">PS4</SelectItem>
                  <SelectItem value="XBOX">Xbox</SelectItem>
                  <SelectItem value="SWITCH">Switch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <Select
                value={filters.region}
                onValueChange={(value) => handleFilterChange("region", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="TEHRAN">Tehran</SelectItem>
                  <SelectItem value="ISFAHAN">Isfahan</SelectItem>
                  <SelectItem value="SHIRAZ">Shiraz</SelectItem>
                  <SelectItem value="TABRIZ">Tabriz</SelectItem>
                  <SelectItem value="MASHHAD">Mashhad</SelectItem>
                  <SelectItem value="ONLINE">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Level
              </label>
              <Select
                value={filters.rank}
                onValueChange={(value) => handleFilterChange("rank", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Level</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LFG Posts */}
      <div className="space-y-4">
        {lfgPosts.map((post) => (
          <LFGCard key={post.id} post={post} />
        ))}
      </div>

      {/* Empty State */}
      {lfgPosts.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No LFG posts found
            </h3>
            <p className="text-gray-600 mb-4">
              Be the first to post a Looking for Game request!
            </p>
            {session && <Button>Create First Post</Button>}
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
            {loading ? "Loading..." : "Load More Posts"}
          </Button>
        </div>
      )}
    </div>
  );
}
