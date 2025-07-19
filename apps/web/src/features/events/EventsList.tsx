"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GameSlug, Event } from "@/types";
import { EventCard } from "./EventCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EventsListProps {
  gameSlug: GameSlug;
}

interface EventsResponse {
  data: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function EventsList({ gameSlug }: EventsListProps) {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [gameSlug, page]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/events?gameSlug=${gameSlug}&page=${page}&limit=10`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data: EventsResponse = await response.json();

      if (page === 1) {
        setEvents(data.data);
      } else {
        setEvents((prev) => [...prev, ...data.data]);
      }

      setHasMore(page < data.pagination.totalPages);
    } catch (err) {
      setError("Failed to load events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!session) {
      // Redirect to sign in
      window.location.href = "/auth/signin";
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to register for event");
      }

      // Refresh events to update registration status
      fetchEvents();
    } catch (err) {
      console.error("Error registering for event:", err);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchEvents} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0 && !loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">No events found for this game.</p>
          {(session?.user.role === "ADMIN" ||
            session?.user.role === "MODERATOR") && (
            <p className="text-sm text-gray-500 mt-2">
              Create the first event to get started!
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRegister={handleRegister}
            canRegister={
              session?.user.role === "PLAYER" ||
              session?.user.role === "MODERATOR"
            }
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            variant="outline"
          >
            {loading ? "Loading..." : "Load More Events"}
          </Button>
        </div>
      )}
    </div>
  );
}
