"use client";

import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, User, Clock } from "lucide-react";

interface EventDetailsDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (eventId: string) => void;
}

export function EventDetailsDialog({
  event,
  open,
  onOpenChange,
  onEdit,
}: EventDetailsDialogProps) {
  if (!event) return null;

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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const createdBy =
    typeof event.createdBy === "object"
      ? event.createdBy.name
      : event.createdBy;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold">
                {event.title}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {event.description}
              </DialogDescription>
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <Badge className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
              <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Start Date</span>
              </div>
              <p className="text-sm">{formatDate(event.startDate)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="font-medium">End Date</span>
              </div>
              <p className="text-sm">{formatDate(event.endDate)}</p>
            </div>

            {event.location && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Location</span>
                </div>
                <p className="text-sm">{event.location}</p>
              </div>
            )}

            {event.onlineUrl && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Online URL</span>
                </div>
                <a
                  href={event.onlineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {event.onlineUrl}
                </a>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span className="font-medium">Participants</span>
              </div>
              <p className="text-sm">
                {event.currentParticipants}
                {event.maxParticipants && ` / ${event.maxParticipants}`}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span className="font-medium">Created By</span>
              </div>
              <p className="text-sm">{createdBy}</p>
            </div>
          </div>

          {/* Registration Deadline */}
          {event.registrationDeadline && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Registration Deadline</span>
              </div>
              <p className="text-sm">
                {formatDate(event.registrationDeadline)}
              </p>
            </div>
          )}

          {/* Game Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Game</span>
            </div>
            <Badge variant="outline" className="capitalize">
              {event.gameSlug}
            </Badge>
          </div>

          {/* Registrations */}
          {event.registrations && event.registrations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span className="font-medium">Registered Participants</span>
              </div>
              <div className="max-h-32 overflow-y-auto">
                {event.registrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="flex items-center gap-2 py-1 text-sm"
                  >
                    <User className="h-3 w-3 text-gray-400" />
                    <span>{registration.user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onEdit(event.id)}>
            Edit Event
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
