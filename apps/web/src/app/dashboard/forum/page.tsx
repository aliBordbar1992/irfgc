import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock forum data - will be replaced with API calls
const MOCK_THREADS = [
  {
    id: "1",
    title: "Best combos for Scorpion in MK1",
    gameSlug: "mk",
    author: "Player123",
    status: "active",
    createdAt: "2024-01-10T14:30:00Z",
    lastReply: "2024-01-10T16:45:00Z",
    replies: 12,
    views: 234,
    isPinned: false,
    isLocked: false,
  },
  {
    id: "2",
    title: "Weekly Tournament Discussion",
    gameSlug: "sf",
    author: "Moderator User",
    status: "active",
    createdAt: "2024-01-09T10:00:00Z",
    lastReply: "2024-01-10T15:20:00Z",
    replies: 28,
    views: 567,
    isPinned: true,
    isLocked: false,
  },
  {
    id: "3",
    title: "Tekken 8 Meta Discussion",
    gameSlug: "tk",
    author: "Fighter456",
    status: "active",
    createdAt: "2024-01-08T18:15:00Z",
    lastReply: "2024-01-10T12:30:00Z",
    replies: 45,
    views: 892,
    isPinned: false,
    isLocked: false,
  },
  {
    id: "4",
    title: "Spam thread - please remove",
    gameSlug: "gg",
    author: "SpamUser",
    status: "reported",
    createdAt: "2024-01-10T20:00:00Z",
    lastReply: "2024-01-10T20:05:00Z",
    replies: 1,
    views: 5,
    isPinned: false,
    isLocked: false,
  },
  {
    id: "5",
    title: "Community Guidelines",
    gameSlug: null,
    author: "Admin User",
    status: "active",
    createdAt: "2024-01-01T09:00:00Z",
    lastReply: "2024-01-05T11:00:00Z",
    replies: 3,
    views: 1247,
    isPinned: true,
    isLocked: true,
  },
  {
    id: "6",
    title: "Offensive content - needs review",
    gameSlug: "bb",
    author: "ProblemUser",
    status: "hidden",
    createdAt: "2024-01-10T19:30:00Z",
    lastReply: "2024-01-10T19:35:00Z",
    replies: 2,
    views: 8,
    isPinned: false,
    isLocked: false,
  },
];

export default function ForumPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forum Moderation</h1>
          <p className="text-gray-600 mt-2">
            Moderate forum threads, manage reports, and maintain community
            standards
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">View Reports</Button>
          <Button>Create Announcement</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <p className="text-sm text-gray-600">Active Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">156</div>
              <p className="text-sm text-gray-600">Active Threads</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <p className="text-sm text-gray-600">Hidden Threads</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <p className="text-sm text-gray-600">Pinned Threads</p>
            </div>
          </CardContent>
        </Card>
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
                <option value="active">Active</option>
                <option value="reported">Reported</option>
                <option value="hidden">Hidden</option>
                <option value="locked">Locked</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">All Types</option>
                <option value="pinned">Pinned</option>
                <option value="announcement">Announcement</option>
                <option value="discussion">Discussion</option>
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

      {/* Threads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Forum Threads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Thread</th>
                  <th className="text-left py-3 px-4 font-medium">Game</th>
                  <th className="text-left py-3 px-4 font-medium">Author</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Created</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Last Reply
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Stats</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_THREADS.map((thread) => (
                  <tr key={thread.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {thread.isPinned && (
                            <span className="text-yellow-500">📌</span>
                          )}
                          {thread.isLocked && (
                            <span className="text-red-500">🔒</span>
                          )}
                          {thread.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {thread.gameSlug
                            ? `${thread.gameSlug.toUpperCase()} Community`
                            : "General Discussion"}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize">
                        {thread.gameSlug || "General"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        {thread.author}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          thread.status === "active"
                            ? "bg-green-100 text-green-800"
                            : thread.status === "reported"
                            ? "bg-red-100 text-red-800"
                            : thread.status === "hidden"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {thread.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {new Date(thread.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {new Date(thread.lastReply).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>{thread.replies} replies</div>
                        <div>{thread.views} views</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        {thread.isPinned ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            Unpin
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            Pin
                          </Button>
                        )}
                        {thread.isLocked ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                          >
                            Unlock
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            Lock
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-gray-600 hover:text-gray-700"
                        >
                          Hide
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
          Showing 1 to {MOCK_THREADS.length} of {MOCK_THREADS.length} threads
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
