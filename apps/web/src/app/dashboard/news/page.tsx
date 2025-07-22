"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Edit,
  Trash2,
  Star,
  Calendar,
  Gamepad2,
  ExternalLink,
} from "lucide-react";
import { useGames } from "@/hooks/useGames";
import { NewsPost } from "@/types";
import { EditNewsDialog } from "@/features/news/EditNewsDialog";
import { CreateNewsDialog } from "@/features/news/CreateNewsDialog";

export default function NewsPage() {
  const { games } = useGames({ isActive: true });
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [filters, setFilters] = useState({
    gameSlug: "",
    status: "",
    featured: "",
    search: "",
  });

  // Edit dialog state
  const [selectedNewsPost, setSelectedNewsPost] = useState<NewsPost | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Create dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchNewsPosts();
  }, []);

  const fetchNewsPosts = async (filterParams = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filterParams.gameSlug) {
        params.append("gameSlug", filterParams.gameSlug);
      }
      if (filterParams.status) {
        params.append("status", filterParams.status);
      } else {
        // For dashboard, show all statuses when no specific status filter is applied
        params.append("status", "DRAFT,PUBLISHED,ARCHIVED");
      }
      if (filterParams.featured) {
        params.append("featured", filterParams.featured);
      }
      if (filterParams.search) {
        params.append("search", filterParams.search);
      }

      const response = await fetch(`/api/news?${params.toString()}`);
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

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleApplyFilters = () => {
    fetchNewsPosts(filters);
  };

  const handleEditNews = (newsPost: NewsPost) => {
    setSelectedNewsPost(newsPost);
    setIsEditDialogOpen(true);
  };

  const handleNewsUpdated = () => {
    fetchNewsPosts();
  };

  const handleStatusChange = async (newsPostId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/news/${newsPostId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newsPosts.find((p) => p.id === newsPostId)?.title || "",
          content: newsPosts.find((p) => p.id === newsPostId)?.content || "",
          excerpt: newsPosts.find((p) => p.id === newsPostId)?.excerpt || "",
          gameSlug:
            newsPosts.find((p) => p.id === newsPostId)?.gameSlug || null,
          status: newStatus as "DRAFT" | "PUBLISHED" | "ARCHIVED",
          featured:
            newsPosts.find((p) => p.id === newsPostId)?.featured || false,
        }),
      });

      if (response.ok) {
        fetchNewsPosts();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleFeaturedToggle = async (
    newsPostId: string,
    currentFeatured: boolean
  ) => {
    try {
      const response = await fetch(`/api/news/${newsPostId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newsPosts.find((p) => p.id === newsPostId)?.title || "",
          content: newsPosts.find((p) => p.id === newsPostId)?.content || "",
          excerpt: newsPosts.find((p) => p.id === newsPostId)?.excerpt || "",
          gameSlug:
            newsPosts.find((p) => p.id === newsPostId)?.gameSlug || null,
          status: newsPosts.find((p) => p.id === newsPostId)?.status || "DRAFT",
          featured: !currentFeatured,
        }),
      });

      if (response.ok) {
        fetchNewsPosts();
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
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
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Create New Post
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search in title, content, excerpt, author..."
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleApplyFilters();
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Game
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filters.gameSlug}
                onChange={(e) => handleFilterChange("gameSlug", e.target.value)}
              >
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
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Featured
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filters.featured}
                onChange={(e) => handleFilterChange("featured", e.target.value)}
              >
                <option value="">All Posts</option>
                <option value="true">Featured Only</option>
                <option value="false">Not Featured</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleApplyFilters}
              >
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
              <Button onClick={() => fetchNewsPosts()} className="mt-2">
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
                    <div className="flex-1 p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base mb-1 line-clamp-1">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-xs line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>

                        {/* Views */}
                        <div className="flex items-center ml-3 flex-shrink-0 text-gray-500">
                          <Eye className="h-3 w-3 ml-1" />
                          <span className="text-xs font-medium">
                            {post.views.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Author and Metadata */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage
                              src={post.author?.avatar || ""}
                              alt={post.author?.name || "Author"}
                            />
                            <AvatarFallback className="text-xs">
                              {post.author?.name?.charAt(0)?.toUpperCase() ||
                                "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-xs">
                            <div className="font-medium text-gray-900">
                              {post.author?.name || "Unknown Author"}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <Calendar className="h-3 w-3 ml-1" />
                              {post.publishedAt
                                ? new Date(
                                    post.publishedAt
                                  ).toLocaleDateString()
                                : "Not published"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="flex items-center text-gray-500">
                            <Gamepad2 className="h-3 w-3 ml-1" />
                            <span className="text-xs">
                              {post.gameSlug ? post.gameSlug : "General"}
                            </span>
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                              post.status === "PUBLISHED"
                                ? "bg-green-100 text-green-800"
                                : post.status === "DRAFT"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {post.status}
                          </span>
                          {post.featured ? (
                            <Star className="h-3 w-3 text-purple-600 fill-current" />
                          ) : (
                            <Star className="h-3 w-3 text-purple-600 " />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex flex-col justify-center items-center p-3 border-l border-gray-200 bg-gray-50 min-w-[120px]">
                      {/* Status Dropdown */}
                      <div className="w-full mb-2">
                        <Select
                          value={post.status}
                          onValueChange={(value) =>
                            handleStatusChange(post.id, value)
                          }
                        >
                          <SelectTrigger className="h-6 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="PUBLISHED">Published</SelectItem>
                            <SelectItem value="ARCHIVED">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Featured Toggle */}
                      <div className="w-full mb-2">
                        <Button
                          size="sm"
                          variant={post.featured ? "default" : "outline"}
                          className={`w-full h-6 p-0 ${
                            post.featured
                              ? "bg-purple-600 hover:bg-purple-700"
                              : "hover:bg-purple-50"
                          }`}
                          onClick={() =>
                            handleFeaturedToggle(post.id, post.featured)
                          }
                          title={
                            post.featured
                              ? "Remove from featured"
                              : "Mark as featured"
                          }
                        >
                          <Star
                            className={`h-3 w-3 ${
                              post.featured ? "fill-current" : ""
                            }`}
                          />
                        </Button>
                      </div>

                      {/* Action Buttons - Horizontal Layout */}
                      <div className="flex space-x-1 w-full">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-6 p-0"
                          onClick={() => handleEditNews(post)}
                          title="Edit news post"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-6 p-0"
                          title="View news post"
                          asChild
                        >
                          <Link
                            href={`/news/${post.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-6 p-0 text-red-600 hover:text-red-700"
                          title="Delete news post"
                        >
                          <Trash2 className="h-3 w-3" />
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

      {/* Edit News Dialog */}
      <EditNewsDialog
        newsPost={selectedNewsPost}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onNewsUpdated={handleNewsUpdated}
      />

      {/* Create News Dialog */}
      <CreateNewsDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onNewsCreated={handleNewsUpdated}
      />
    </div>
  );
}
