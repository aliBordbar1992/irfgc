"use client";

import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  GamepadIcon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface EventCardProps {
  event: Event;
  onRegister: (eventId: string) => void;
  canRegister: boolean;
}

const EVENT_TYPE_ICONS = {
  TOURNAMENT: Trophy,
  CASUAL: GamepadIcon,
  ONLINE: GamepadIcon,
  OFFLINE: MapPin,
};

const EVENT_TYPE_COLORS = {
  TOURNAMENT: "bg-blue-100 text-blue-800",
  CASUAL: "bg-green-100 text-green-800",
  ONLINE: "bg-purple-100 text-purple-800",
  OFFLINE: "bg-orange-100 text-orange-800",
};

const EVENT_STATUS_COLORS = {
  UPCOMING: "bg-yellow-100 text-yellow-800",
  ONGOING: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function EventCard({ event, onRegister, canRegister }: EventCardProps) {
  const TypeIcon = EVENT_TYPE_ICONS[event.type] || GamepadIcon;
  const isRegistrationOpen =
    event.status === "UPCOMING" &&
    (!event.registrationDeadline ||
      new Date(event.registrationDeadline) > new Date()) &&
    new Date(event.startDate) > new Date();
  const isFull =
    event.maxParticipants && event.currentParticipants >= event.maxParticipants;
  const isRegistered = event.registrations?.some(
    (reg) => reg.user.id === event.createdBy
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
              {event.title}
            </CardTitle>
            <CardDescription className="mt-2">
              {event.description}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                EVENT_TYPE_COLORS[event.type]
              }`}
            >
              <TypeIcon className="inline w-3 h-3 mr-1" />
              {event.type}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                EVENT_STATUS_COLORS[event.status]
              }`}
            >
              {event.status}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(event.startDate)}</span>
          </div>

          {event.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </div>
          )}

          {event.maxParticipants && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span>
                {event.currentParticipants}/{event.maxParticipants} participants
              </span>
            </div>
          )}

          {event.registrationDeadline && (
            <div className="text-xs text-gray-500">
              Registration deadline: {formatDate(event.registrationDeadline)}
            </div>
          )}

          <div className="pt-2">
            {isRegistered ? (
              <Button className="w-full" variant="outline" disabled>
                Already Registered
              </Button>
            ) : !isRegistrationOpen ? (
              <Button className="w-full" variant="outline" disabled>
                Registration Closed
              </Button>
            ) : isFull ? (
              <Button className="w-full" variant="outline" disabled>
                Event Full
              </Button>
            ) : canRegister ? (
              <Button
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRegister(event.id);
                }}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Register for Event
              </Button>
            ) : (
              <Button className="w-full" variant="outline" asChild>
                <Link
                  href={`/${event.gameSlug}/events/${event.id}`}
                  className="flex items-center justify-center gap-1"
                >
                  View Details
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Clickable overlay for the entire card */}
      <Link
        href={`/${event.gameSlug}/events/${event.id}`}
        className="absolute inset-0 z-10"
        aria-label={`View details for ${event.title}`}
      />
    </Card>
  );
}
