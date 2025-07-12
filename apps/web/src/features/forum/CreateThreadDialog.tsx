"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GameSlug } from "@/types";
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

const createThreadSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .min(10, "Content must be at least 10 characters"),
});

type CreateThreadFormData = z.infer<typeof createThreadSchema>;

interface CreateThreadDialogProps {
  gameSlug: GameSlug;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateThreadDialog({
  gameSlug,
  open,
  onOpenChange,
}: CreateThreadDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateThreadFormData>({
    resolver: zodResolver(createThreadSchema),
  });

  const onSubmit = async (data: CreateThreadFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/forum", {
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
        setError(result.error || "Failed to create thread");
        return;
      }

      // Reset form and close dialog
      reset();
      onOpenChange(false);

      // Refresh the page to show the new thread
      window.location.reload();
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error creating forum thread:", err);
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
          <DialogTitle>Create New Thread</DialogTitle>
          <DialogDescription>
            Start a new discussion in the {gameSlug.toUpperCase()} forum.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Thread Title</Label>
            <Input
              id="title"
              placeholder="Enter thread title"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Thread Content</Label>
            <Textarea
              id="content"
              placeholder="Write your thread content here..."
              {...register("content")}
              className={errors.content ? "border-red-500" : ""}
              rows={8}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
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
              {isLoading ? "Creating..." : "Create Thread"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
