"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateEventDialog } from "@/features/events/CreateEventDialog";
import { EditEventDialog } from "@/features/events/EditEventDialog";
import { DeleteConfirmationDialog } from "@/features/events/DeleteConfirmationDialog";
import { Event } from "@/types";
import { useGames } from "@/hooks/useGames";
import { ExternalLink, Copy } from "lucide-react";

export default function EventsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [eventToDuplicate, setEventToDuplicate] = useState<Event | null>(null);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const { games } = useGames({ isActive: true });

  useEffect(() => {
    fetchEvents();
  }, [includeDeleted]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/events?includeEnded=true&includeDeleted=${includeDeleted}`
      );

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

  const handleEditEvent = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsEditDialogOpen(true);
    }
  };

  const handleEventUpdated = () => {
    fetchEvents();
  };

  const handleDeleteEvent = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDeleteEvent = async () => {
    if (!selectedEvent) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      // Refresh the events list
      fetchEvents();
      setIsDeleteDialogOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error("Error deleting event:", err);
      // You could add a toast notification here instead of alert
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicateEvent = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setEventToDuplicate(event);
      setIsDuplicateDialogOpen(true);
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
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onEventCreated={handleEventUpdated}
      />

      {/* Duplicate Event Dialog */}
      <CreateEventDialog
        open={isDuplicateDialogOpen}
        onOpenChange={setIsDuplicateDialogOpen}
        onEventCreated={handleEventUpdated}
        initialValues={
          eventToDuplicate
            ? {
                gameSlug: eventToDuplicate.gameSlug,
                title: `${eventToDuplicate.title}`,
                description: eventToDuplicate.description,
                type: eventToDuplicate.type,
                location: eventToDuplicate.location || "",
                onlineUrl: eventToDuplicate.onlineUrl || "",
                maxParticipants:
                  eventToDuplicate.maxParticipants?.toString() || "",
              }
            : undefined
        }
      />

      {/* Edit Event Dialog */}
      <EditEventDialog
        event={selectedEvent}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onEventUpdated={handleEventUpdated}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        eventTitle={selectedEvent?.title || ""}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteEvent}
        isLoading={isDeleting}
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

          {/* Deleted Events Filter */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeDeleted"
                checked={includeDeleted}
                onChange={(e) => setIncludeDeleted(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label
                htmlFor="includeDeleted"
                className="text-sm font-medium text-gray-700"
              >
                Show deleted events
              </label>
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
                    <tr
                      key={event.id}
                      className={`border-b hover:bg-gray-50 ${
                        event.deletedAt ? "bg-red-50 opacity-75" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">
                            {event.title}
                            {event.deletedAt && (
                              <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                DELETED
                              </span>
                            )}
                          </div>
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
                            disabled={!!event.deletedAt}
                          >
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link
                              href={`/${event.gameSlug}/events/${event.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDuplicateEvent(event.id)}
                            className="flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            Duplicate
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteEvent(event.id)}
                            disabled={!!event.deletedAt}
                          >
                            {event.deletedAt ? "Deleted" : "Delete"}
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
