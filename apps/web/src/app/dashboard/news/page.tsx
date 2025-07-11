import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock news data - will be replaced with API calls
const MOCK_NEWS = [
  {
    id: "1",
    title: "New Tournament Series Announced",
    gameSlug: "mk",
    status: "published",
    author: "Admin User",
    publishedAt: "2024-01-10T12:00:00Z",
    views: 1247,
    featured: true,
    excerpt:
      "Exciting news for the Mortal Kombat community! We are proud to announce a new tournament series...",
  },
  {
    id: "2",
    title: "Community Spotlight: Top Players",
    gameSlug: "sf",
    status: "published",
    author: "Moderator User",
    publishedAt: "2024-01-08T15:30:00Z",
    views: 892,
    featured: false,
    excerpt:
      "This month we shine the spotlight on some of our most dedicated Street Fighter players...",
  },
  {
    id: "3",
    title: "Upcoming Balance Patch Discussion",
    gameSlug: "tk",
    status: "draft",
    author: "Admin User",
    publishedAt: null,
    views: 0,
    featured: false,
    excerpt:
      "Let&apos;s discuss the upcoming balance changes and how they might affect the meta...",
  },
  {
    id: "4",
    title: "Weekly Community Roundup",
    gameSlug: "gg",
    status: "published",
    author: "Moderator User",
    publishedAt: "2024-01-05T10:00:00Z",
    views: 567,
    featured: false,
    excerpt:
      "Here&apos;s what happened in the Guilty Gear community this week...",
  },
  {
    id: "5",
    title: "New Discord Server Features",
    gameSlug: null,
    status: "published",
    author: "Admin User",
    publishedAt: "2024-01-03T14:20:00Z",
    views: 2341,
    featured: true,
    excerpt:
      "We&apos;ve added exciting new features to our Discord server to enhance community interaction...",
  },
];

export default function NewsPage() {
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
                <option value="mk">Mortal Kombat</option>
                <option value="sf">Street Fighter</option>
                <option value="tk">Tekken</option>
                <option value="gg">Guilty Gear</option>
                <option value="bb">BlazBlue</option>
                <option value="uni">Under Night In-Birth</option>
                <option value="general">General</option>
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

      {/* News Table */}
      <Card>
        <CardHeader>
          <CardTitle>All News Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Title</th>
                  <th className="text-left py-3 px-4 font-medium">Game</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Author</th>
                  <th className="text-left py-3 px-4 font-medium">Published</th>
                  <th className="text-left py-3 px-4 font-medium">Views</th>
                  <th className="text-left py-3 px-4 font-medium">Featured</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_NEWS.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {post.excerpt}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize">
                        {post.gameSlug || "General"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : post.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">{post.author}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : "Not published"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {post.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.featured
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.featured ? "Featured" : "Regular"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing 1 to {MOCK_NEWS.length} of {MOCK_NEWS.length} posts
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
