"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EventType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGames } from "@/hooks/useGames";

const createEventSchema = z
  .object({
    gameSlug: z.string().min(1, "Game is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    type: z.enum(["TOURNAMENT", "CASUAL", "ONLINE", "OFFLINE"]),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    location: z.string().optional(),
    onlineUrl: z.string().url().optional().or(z.literal("")),
    maxParticipants: z.string().optional(),
    registrationDeadline: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) < new Date(data.endDate);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

type CreateEventFormData = z.infer<typeof createEventSchema>;

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated?: () => void;
  initialValues?: {
    gameSlug: string;
    title: string;
    description: string;
    type: EventType;
    location?: string;
    onlineUrl?: string;
    maxParticipants?: string;
  };
}

export function CreateEventDialog({
  open,
  onOpenChange,
  onEventCreated,
  initialValues,
}: CreateEventDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { games, loading: gamesLoading } = useGames({ isActive: true });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      ...initialValues,
      type: initialValues?.type || "CASUAL",
    },
  });

  // Reset form when initialValues change
  useEffect(() => {
    if (initialValues && open) {
      reset({
        ...initialValues,
        type: initialValues.type || "CASUAL",
      });
    }
  }, [initialValues, open, reset]);

  const eventType = watch("type");
  const selectedGameSlug = watch("gameSlug");

  const onSubmit = async (data: CreateEventFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          maxParticipants: data.maxParticipants
            ? parseInt(data.maxParticipants)
            : undefined,
          onlineUrl: data.onlineUrl || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to create event");
        return;
      }

      // Reset form and close dialog
      reset();
      onOpenChange(false);

      // Call the callback to refresh events
      onEventCreated?.();
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error creating event:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
      setError("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialValues ? "Duplicate Event" : "Create New Event"}
          </DialogTitle>
          <DialogDescription>
            {initialValues
              ? "Create a new event based on the selected event. You can modify the details as needed."
              : "Create a new event for your gaming community."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gameSlug">Game</Label>
            <Select
              value={selectedGameSlug}
              onValueChange={(value) => setValue("gameSlug", value)}
              disabled={gamesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent>
                {games.map((game) => (
                  <SelectItem key={game.slug} value={game.slug}>
                    {game.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.gameSlug && (
              <p className="text-sm text-red-500">{errors.gameSlug.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                placeholder="Enter event title"
                {...register("title")}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <Select
                value={eventType}
                onValueChange={(value: EventType) => setValue("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOURNAMENT">Tournament</SelectItem>
                  <SelectItem value="CASUAL">Casual</SelectItem>
                  <SelectItem value="ONLINE">Online</SelectItem>
                  <SelectItem value="OFFLINE">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter event description"
              {...register("description")}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date & Time</Label>
              <Input
                id="startDate"
                type="datetime-local"
                {...register("startDate")}
                className={errors.startDate ? "border-red-500" : ""}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date & Time</Label>
              <Input
                id="endDate"
                type="datetime-local"
                {...register("endDate")}
                className={errors.endDate ? "border-red-500" : ""}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter event location"
                {...register("location")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max Participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                placeholder="Optional"
                {...register("maxParticipants")}
              />
            </div>
          </div>

          {(eventType === "ONLINE" || eventType === "CASUAL") && (
            <div className="space-y-2">
              <Label htmlFor="onlineUrl">Online URL</Label>
              <Input
                id="onlineUrl"
                type="url"
                placeholder="https://..."
                {...register("onlineUrl")}
                className={errors.onlineUrl ? "border-red-500" : ""}
              />
              {errors.onlineUrl && (
                <p className="text-sm text-red-500">
                  {errors.onlineUrl.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="registrationDeadline">Registration Deadline</Label>
            <Input
              id="registrationDeadline"
              type="datetime-local"
              {...register("registrationDeadline")}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Creating..."
                : initialValues
                ? "Duplicate Event"
                : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
