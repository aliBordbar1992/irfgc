import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock users data - will be replaced with API calls
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@irfgc.ir",
    role: "admin",
    status: "active",
    joinedAt: "2023-01-15T10:00:00Z",
    lastActive: "2024-01-10T15:30:00Z",
    gameSlugs: ["mk", "sf", "tk"],
    eventsParticipated: 12,
    postsCount: 45,
  },
  {
    id: "2",
    name: "Moderator User",
    email: "mod@irfgc.ir",
    role: "moderator",
    status: "active",
    joinedAt: "2023-03-20T14:00:00Z",
    lastActive: "2024-01-10T12:15:00Z",
    gameSlugs: ["sf", "gg"],
    eventsParticipated: 8,
    postsCount: 23,
  },
  {
    id: "3",
    name: "Player123",
    email: "player123@example.com",
    role: "player",
    status: "active",
    joinedAt: "2023-06-10T09:00:00Z",
    lastActive: "2024-01-09T20:45:00Z",
    gameSlugs: ["mk"],
    eventsParticipated: 5,
    postsCount: 12,
  },
  {
    id: "4",
    name: "Fighter456",
    email: "fighter456@example.com",
    role: "player",
    status: "active",
    joinedAt: "2023-08-05T16:30:00Z",
    lastActive: "2024-01-10T10:20:00Z",
    gameSlugs: ["sf", "tk", "gg"],
    eventsParticipated: 15,
    postsCount: 34,
  },
  {
    id: "5",
    name: "InactiveUser",
    email: "inactive@example.com",
    role: "player",
    status: "inactive",
    joinedAt: "2023-04-12T11:00:00Z",
    lastActive: "2023-12-15T08:30:00Z",
    gameSlugs: ["bb"],
    eventsParticipated: 2,
    postsCount: 3,
  },
  {
    id: "6",
    name: "BannedUser",
    email: "banned@example.com",
    role: "player",
    status: "banned",
    joinedAt: "2023-07-22T13:45:00Z",
    lastActive: "2024-01-05T19:10:00Z",
    gameSlugs: ["uni"],
    eventsParticipated: 0,
    postsCount: 0,
  },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage community members, roles, and permissions
          </p>
        </div>
        <Link href="/dashboard/users/new">
          <Button>Add New User</Button>
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
                Role
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="player">Player</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium">Role</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Games</th>
                  <th className="text-left py-3 px-4 font-medium">Joined</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Last Active
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Activity</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-600">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-800"
                            : user.role === "moderator"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : user.status === "inactive"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.gameSlugs.map((game) => (
                          <span
                            key={game}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {game.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>{user.eventsParticipated} events</div>
                        <div>{user.postsCount} posts</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        {user.status === "active" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                          >
                            Activate
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          Ban
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
          Showing 1 to {MOCK_USERS.length} of {MOCK_USERS.length} users
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
