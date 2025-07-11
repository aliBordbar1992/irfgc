import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock events data - will be replaced with API calls
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Weekly Tournament",
    gameSlug: "mk",
    type: "tournament",
    status: "upcoming",
    startDate: "2024-01-15T18:00:00Z",
    location: "Online",
    maxParticipants: 32,
    currentParticipants: 24,
    createdBy: "Admin User",
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    title: "Casual Meetup",
    gameSlug: "sf",
    type: "casual",
    status: "upcoming",
    startDate: "2024-01-20T14:00:00Z",
    location: "Tehran Gaming Center",
    maxParticipants: 20,
    currentParticipants: 12,
    createdBy: "Moderator User",
    createdAt: "2024-01-08T15:30:00Z",
  },
  {
    id: "3",
    title: "Championship Series",
    gameSlug: "tk",
    type: "tournament",
    status: "ongoing",
    startDate: "2024-01-12T16:00:00Z",
    location: "Online",
    maxParticipants: 64,
    currentParticipants: 45,
    createdBy: "Admin User",
    createdAt: "2024-01-05T12:00:00Z",
  },
  {
    id: "4",
    title: "Beginner Friendly Tournament",
    gameSlug: "gg",
    type: "tournament",
    status: "completed",
    startDate: "2024-01-01T14:00:00Z",
    location: "Online",
    maxParticipants: 16,
    currentParticipants: 16,
    createdBy: "Moderator User",
    createdAt: "2023-12-28T09:00:00Z",
  },
];

export default function EventsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Events Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage tournaments, casual meetups, and community events
          </p>
        </div>
        <Link href="/dashboard/events/new">
          <Button>Create New Event</Button>
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
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">All Types</option>
                <option value="tournament">Tournament</option>
                <option value="casual">Casual</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
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

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Event</th>
                  <th className="text-left py-3 px-4 font-medium">Game</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Participants
                  </th>
                  <th className="text-left py-3 px-4 font-medium">
                    Created By
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_EVENTS.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-gray-600">
                          {event.location}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize">{event.gameSlug}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.type === "tournament"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {event.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === "upcoming"
                            ? "bg-blue-100 text-blue-800"
                            : event.status === "ongoing"
                            ? "bg-green-100 text-green-800"
                            : event.status === "completed"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {new Date(event.startDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {event.currentParticipants}/{event.maxParticipants}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        {event.createdBy}
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
          Showing 1 to {MOCK_EVENTS.length} of {MOCK_EVENTS.length} events
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
