"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateEventDialog } from "@/features/events/CreateEventDialog";
import { Event } from "@/types";

export default function EventsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events");

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data.data || []);
    } catch (err) {
      setError("Failed to load events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewEvent = (eventId: string) => {
    // For now, show event details in an alert. In a real app, you'd navigate to a details page
    const event = events.find((e) => e.id === eventId);
    if (event) {
      alert(
        `Event Details:\n\nTitle: ${event.title}\nDescription: ${
          event.description
        }\nType: ${event.type}\nStatus: ${event.status}\nStart Date: ${new Date(
          event.startDate
        ).toLocaleString()}\nLocation: ${event.location || "N/A"}`
      );
    }
  };

  const handleEditEvent = (eventId: string) => {
    // For now, just show an alert. In a real app, you'd open an edit dialog
    alert(`Edit event ${eventId} - This feature is not yet implemented`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      // Refresh the events list
      fetchEvents();
    } catch (err) {
      alert("Failed to delete event. Please try again.");
      console.error("Error deleting event:", err);
    }
  };

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
        <Button onClick={() => setIsDialogOpen(true)}>Create New Event</Button>
      </div>

      {/* Create Event Dialog */}
      <CreateEventDialog
        gameSlug="mk"
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

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
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">All Types</option>
                <option value="TOURNAMENT">Tournament</option>
                <option value="CASUAL">Casual</option>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
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
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchEvents} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No events found.</p>
            </div>
          ) : (
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
                  {events.map((event) => (
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
                            event.type === "TOURNAMENT"
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
                            event.status === "UPCOMING"
                              ? "bg-blue-100 text-blue-800"
                              : event.status === "ONGOING"
                              ? "bg-green-100 text-green-800"
                              : event.status === "COMPLETED"
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
                          {typeof event.createdBy === "object" &&
                          event.createdBy !== null
                            ? event.createdBy.name
                            : event.createdBy}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditEvent(event.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewEvent(event.id)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteEvent(event.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing 1 to {events.length} of {events.length} events
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
