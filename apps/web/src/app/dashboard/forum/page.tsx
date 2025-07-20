"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGames } from "@/hooks/useGames";

// Mock data - in real app, this would come from API
const MOCK_THREADS = [
  {
    id: "1",
    title: "Best combos for beginners?",
    gameSlug: "mk",
    author: "Player123",
    replies: 24,
    views: 156,
    lastActivity: "2024-01-15T14:30:00Z",
    status: "active",
    pinned: false,
  },
  {
    id: "2",
    title: "Tournament Discussion Thread",
    gameSlug: "sf",
    author: "TournamentAdmin",
    replies: 67,
    views: 892,
    lastActivity: "2024-01-14T16:45:00Z",
    status: "active",
    pinned: true,
  },
  {
    id: "3",
    title: "Character tier list discussion",
    gameSlug: "tk",
    author: "TekkenMaster",
    replies: 89,
    views: 1247,
    lastActivity: "2024-01-13T12:20:00Z",
    status: "active",
    pinned: false,
  },
  {
    id: "4",
    title: "New patch notes discussion",
    gameSlug: "gg",
    author: "GGPlayer",
    replies: 45,
    views: 678,
    lastActivity: "2024-01-12T10:15:00Z",
    status: "locked",
    pinned: false,
  },
  {
    id: "5",
    title: "Community guidelines reminder",
    gameSlug: null,
    author: "Moderator",
    replies: 12,
    views: 234,
    lastActivity: "2024-01-11T09:30:00Z",
    status: "active",
    pinned: true,
  },
];

export default function ForumPage() {
  const { games } = useGames({ isActive: true });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forum Management</h1>
          <p className="text-gray-600 mt-2">
            Moderate and manage community discussions and threads
          </p>
        </div>
        <Link href="/dashboard/forum/new">
          <Button>Create New Thread</Button>
        </Link>
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
                Game
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">All Games</option>
                {games.map((game) => (
                  <option key={game.slug} value={game.slug}>
                    {game.fullName}
                  </option>
                ))}
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
                <option value="locked">Locked</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pinned
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">All Threads</option>
                <option value="pinned">Pinned Only</option>
                <option value="not-pinned">Not Pinned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="last-activity">Last Activity</option>
                <option value="replies">Most Replies</option>
                <option value="views">Most Views</option>
                <option value="created">Date Created</option>
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
          <CardTitle>All Threads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Title</th>
                  <th className="text-left py-3 px-4 font-medium">Game</th>
                  <th className="text-left py-3 px-4 font-medium">Author</th>
                  <th className="text-left py-3 px-4 font-medium">Replies</th>
                  <th className="text-left py-3 px-4 font-medium">Views</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Last Activity
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_THREADS.map((thread) => (
                  <tr key={thread.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {thread.pinned && (
                          <span className="text-yellow-500">📌</span>
                        )}
                        <div>
                          <div className="font-medium">{thread.title}</div>
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
                      <div className="text-sm">{thread.replies}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">{thread.views}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {new Date(thread.lastActivity).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          thread.status === "active"
                            ? "bg-green-100 text-green-800"
                            : thread.status === "locked"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {thread.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
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
