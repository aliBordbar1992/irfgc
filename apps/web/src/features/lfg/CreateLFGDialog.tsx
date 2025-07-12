"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GameSlug, Platform, Region } from "@/types";
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

const createLFGSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  platform: z.enum(["PC", "PS5", "PS4", "XBOX", "SWITCH"]),
  region: z.enum([
    "TEHRAN",
    "ISFAHAN",
    "SHIRAZ",
    "TABRIZ",
    "MASHHAD",
    "ONLINE",
  ]),
  rank: z.string().optional(),
});

type CreateLFGFormData = z.infer<typeof createLFGSchema>;

interface CreateLFGDialogProps {
  gameSlug: GameSlug;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLFGDialog({
  gameSlug,
  open,
  onOpenChange,
}: CreateLFGDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateLFGFormData>({
    resolver: zodResolver(createLFGSchema),
    defaultValues: {
      platform: "PC",
      region: "ONLINE",
    },
  });

  const platform = watch("platform");
  const region = watch("region");

  const onSubmit = async (data: CreateLFGFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/lfg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          gameSlug,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to create LFG post");
        return;
      }

      // Reset form and close dialog
      reset();
      onOpenChange(false);

      // Refresh the page to show the new post
      window.location.reload();
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error creating LFG post:", err);
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create LFG Post</DialogTitle>
          <DialogDescription>
            Post a Looking for Game request for {gameSlug.toUpperCase()}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Looking for casual matches"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what you're looking for..."
              {...register("description")}
              className={errors.description ? "border-red-500" : ""}
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={platform}
                onValueChange={(value: Platform) => setValue("platform", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PC">PC</SelectItem>
                  <SelectItem value="PS5">PS5</SelectItem>
                  <SelectItem value="PS4">PS4</SelectItem>
                  <SelectItem value="XBOX">Xbox</SelectItem>
                  <SelectItem value="SWITCH">Switch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select
                value={region}
                onValueChange={(value: Region) => setValue("region", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEHRAN">Tehran</SelectItem>
                  <SelectItem value="ISFAHAN">Isfahan</SelectItem>
                  <SelectItem value="SHIRAZ">Shiraz</SelectItem>
                  <SelectItem value="TABRIZ">Tabriz</SelectItem>
                  <SelectItem value="MASHHAD">Mashhad</SelectItem>
                  <SelectItem value="ONLINE">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rank">Skill Level (Optional)</Label>
            <Input
              id="rank"
              placeholder="e.g., Beginner, Intermediate, Advanced"
              {...register("rank")}
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
              {isLoading ? "Creating..." : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
