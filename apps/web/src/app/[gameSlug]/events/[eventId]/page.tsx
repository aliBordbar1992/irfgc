"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types";
import {
  Calendar,
  MapPin,
  Users,
  User,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function EventDetailPage() {
  const params = useParams();
  const { gameSlug, eventId } = params;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${eventId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }

      const data = await response.json();
      setEvent(data.data);

      // Check if user is already registered
      checkRegistrationStatus();
    } catch (err) {
      setError("Failed to load event");
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/register`);
      if (response.ok) {
        const data = await response.json();
        setIsRegistered(data.isRegistered || false);
      }
    } catch (err) {
      console.error("Error checking registration status:", err);
    }
  };

  const handleRegister = async () => {
    if (!event) return;

    setIsRegistering(true);
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to register for event");
      }

      setIsRegistered(true);
      // Refresh event data to update participant count
      fetchEvent();
    } catch (err) {
      console.error("Error registering for event:", err);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!event) return;

    setIsRegistering(true);
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to unregister from event");
      }

      setIsRegistered(false);
      // Refresh event data to update participant count
      fetchEvent();
    } catch (err) {
      console.error("Error unregistering from event:", err);
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">{error || "Event not found"}</p>
          <Button onClick={fetchEvent} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-100 text-blue-800";
      case "ONGOING":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "TOURNAMENT":
        return "bg-purple-100 text-purple-800";
      case "CASUAL":
        return "bg-green-100 text-green-800";
      case "ONLINE":
        return "bg-blue-100 text-blue-800";
      case "OFFLINE":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <a href={`/${gameSlug}`} className="hover:text-gray-900">
            {gameSlug}
          </a>
          <span>/</span>
          <a href={`/${gameSlug}/events`} className="hover:text-gray-900">
            Events
          </a>
          <span>/</span>
          <span className="text-gray-900">{event.title}</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {event.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <Badge className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
              <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            {event.status === "UPCOMING" && (
              <Button
                onClick={isRegistered ? handleUnregister : handleRegister}
                disabled={isRegistering}
                variant={isRegistered ? "outline" : "default"}
              >
                {isRegistering
                  ? "Processing..."
                  : isRegistered
                  ? "Unregister"
                  : "Register"}
              </Button>
            )}
            {event.onlineUrl && (
              <Button variant="outline" asChild>
                <a
                  href={event.onlineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Join Online
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium">
                        {new Date(event.startDate).toLocaleDateString()} at{" "}
                        {new Date(event.startDate).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-medium">
                        {new Date(event.endDate).toLocaleDateString()} at{" "}
                        {new Date(event.endDate).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{event.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Participants</p>
                      <p className="font-medium">
                        {event.currentParticipants}
                        {event.maxParticipants && ` / ${event.maxParticipants}`}
                      </p>
                    </div>
                  </div>
                </div>

                {event.registrationDeadline && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Registration Deadline
                      </p>
                      <p className="font-medium">
                        {new Date(
                          event.registrationDeadline
                        ).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(
                          event.registrationDeadline
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          {event.registrations && event.registrations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {event.registrations.map((registration) => (
                    <div
                      key={registration.id}
                      className="flex items-center gap-2 p-2 rounded-md bg-gray-50"
                    >
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {registration.user.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle>Event Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Game</p>
                  <p className="font-medium capitalize">{event.gameSlug}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Created by</p>
                  <p className="font-medium">
                    {typeof event.createdBy === "object" &&
                    event.createdBy !== null
                      ? event.createdBy.name
                      : event.createdBy}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Created on</p>
                  <p className="font-medium">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Status */}
          {event.status === "UPCOMING" && (
            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium">
                      {isRegistered ? "Registered" : "Not Registered"}
                    </p>
                  </div>

                  {event.maxParticipants && (
                    <div>
                      <p className="text-sm text-gray-600">Available Spots</p>
                      <p className="font-medium">
                        {event.maxParticipants - event.currentParticipants}{" "}
                        remaining
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
