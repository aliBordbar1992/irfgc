"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGames } from "@/hooks/useGames";
import { NewsPost } from "@/types";

export default function NewsPage() {
  const { games } = useGames({ isActive: true });
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNewsPosts();
  }, []);

  const fetchNewsPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/news");
      if (!response.ok) {
        throw new Error("Failed to fetch news posts");
      }
      const data = await response.json();
      setNewsPosts(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch news posts"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-600 mt-2">
            Create and manage community news, announcements, and updates
          </p>
        </div>
        <Link href="/dashboard/news/new">
          <Button>Create New Post</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Game
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">All Games</option>
                <option value="general">General (All Games)</option>
                {games.map((game) => (
                  <option key={game.slug} value={game.slug}>
                    {game.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Featured
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">All Posts</option>
                <option value="featured">Featured Only</option>
                <option value="not-featured">Not Featured</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Grid */}
      <Card>
        <CardHeader>
          <CardTitle>All News Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading news posts...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">Error: {error}</p>
              <Button onClick={fetchNewsPosts} className="mt-2">
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && newsPosts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No news posts found.</p>
            </div>
          )}

          {!loading && !error && newsPosts.length > 0 && (
            <div className="space-y-4">
              {newsPosts.map((post) => (
                <div
                  key={post.id}
                  className="border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex">
                    {/* Left side - Content */}
                    <div className="flex-1 p-6">
                      <div className="mb-4">
                        <h3 className="font-semibold text-xl mb-2 line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Game:</span>
                            <span className="capitalize font-medium text-sm">
                              {post.gameSlug ? post.gameSlug : "General"}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              Status:
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                post.status === "PUBLISHED"
                                  ? "bg-green-100 text-green-800"
                                  : post.status === "DRAFT"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {post.status}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              Featured:
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                post.featured
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {post.featured ? "Featured" : "Regular"}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              Published:
                            </span>
                            <span className="text-sm">
                              {post.publishedAt
                                ? new Date(
                                    post.publishedAt
                                  ).toLocaleDateString()
                                : "Not published"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex flex-col justify-center items-center p-6 border-l border-gray-200 bg-gray-50 min-w-[200px]">
                      <div className="text-center mb-4">
                        <div className="text-xs text-gray-500 mb-1">Views</div>
                        <div className="text-lg font-semibold text-gray-700">
                          {post.views.toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-2 w-full">
                        <Button size="sm" variant="outline" className="w-full">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 w-full"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing 1 to {newsPosts.length} of {newsPosts.length} posts
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
