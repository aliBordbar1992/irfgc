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

const createNewsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(200, "Excerpt must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
});

type CreateNewsFormData = z.infer<typeof createNewsSchema>;

interface CreateNewsDialogProps {
  gameSlug: GameSlug;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateNewsDialog({
  gameSlug,
  open,
  onOpenChange,
}: CreateNewsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateNewsFormData>({
    resolver: zodResolver(createNewsSchema),
  });

  const onSubmit = async (data: CreateNewsFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/news", {
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
        setError(result.error || "Failed to create news article");
        return;
      }

      // Reset form and close dialog
      reset();
      onOpenChange(false);

      // Refresh the page to show the new article
      window.location.reload();
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error creating news article:", err);
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
          <DialogTitle>Create News Article</DialogTitle>
          <DialogDescription>
            Write a news article for the {gameSlug.toUpperCase()} community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Article Title</Label>
            <Input
              id="title"
              placeholder="Enter article title"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief summary of the article (max 200 characters)"
              {...register("excerpt")}
              className={errors.excerpt ? "border-red-500" : ""}
              rows={3}
            />
            {errors.excerpt && (
              <p className="text-sm text-red-500">{errors.excerpt.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Article Content</Label>
            <Textarea
              id="content"
              placeholder="Write your article content here..."
              {...register("content")}
              className={errors.content ? "border-red-500" : ""}
              rows={10}
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
              {isLoading ? "Creating..." : "Create Article"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
