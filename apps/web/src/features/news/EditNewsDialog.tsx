"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NewsPost } from "@/types";
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

const editNewsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(200, "Excerpt must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
  gameSlug: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  featured: z.boolean(),
});

type EditNewsFormData = z.infer<typeof editNewsSchema>;

interface EditNewsDialogProps {
  newsPost: NewsPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewsUpdated: () => void;
}

export function EditNewsDialog({
  newsPost,
  open,
  onOpenChange,
  onNewsUpdated,
}: EditNewsDialogProps) {
  const { games } = useGames({ isActive: true });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EditNewsFormData>({
    resolver: zodResolver(editNewsSchema),
  });

  const status = watch("status");
  const featured = watch("featured");

  // Reset form when news post changes
  useEffect(() => {
    if (newsPost && open) {
      reset({
        title: newsPost.title,
        excerpt: newsPost.excerpt,
        content: newsPost.content,
        gameSlug: newsPost.gameSlug || "general",
        status: newsPost.status,
        featured: newsPost.featured,
      });
    }
  }, [newsPost, open, reset]);

  const onSubmit = async (data: EditNewsFormData) => {
    if (!newsPost) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/news/${newsPost.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          gameSlug:
            data.gameSlug === "general" || !data.gameSlug
              ? null
              : data.gameSlug,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to update news post");
        return;
      }

      // Close dialog and refresh news
      onOpenChange(false);
      onNewsUpdated();
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error updating news post:", err);
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

  if (!newsPost) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit News Post</DialogTitle>
          <DialogDescription>
            Update the news post &quot;{newsPost.title}&quot;.
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gameSlug">Game (Optional)</Label>
              <Select
                value={watch("gameSlug") || "general"}
                onValueChange={(value) =>
                  setValue("gameSlug", value === "general" ? "general" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a game (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General (All Games)</SelectItem>
                  {games.map((game) => (
                    <SelectItem key={game.slug} value={game.slug}>
                      {game.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: "DRAFT" | "PUBLISHED" | "ARCHIVED") =>
                  setValue("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setValue("featured", e.target.checked)}
            />
            <Label htmlFor="featured">Featured News</Label>
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
              {isLoading ? "Updating..." : "Update News Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
