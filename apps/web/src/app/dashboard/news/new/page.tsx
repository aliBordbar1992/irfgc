"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGames } from "@/hooks/useGames";

const createNewsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(200, "Excerpt must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
  gameSlug: z.string().min(1, "Game is required"),
});

type CreateNewsFormData = z.infer<typeof createNewsSchema>;

export default function CreateNewsPage() {
  const router = useRouter();
  const {
    games,
    loading: gamesLoading,
    error: gamesError,
  } = useGames({ isActive: true });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
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
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to create news article");
        return;
      }

      // Redirect back to news list
      router.push("/dashboard/news");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error creating news article:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/news");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create News Post</h1>
          <p className="text-gray-600 mt-2">
            Write a new news article for the community
          </p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            News Article Details
            {gamesLoading && (
              <span className="text-sm text-gray-500 ml-2">
                (Loading games...)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title *</Label>
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
                <Label htmlFor="gameSlug">Game *</Label>
                <select
                  id="gameSlug"
                  {...register("gameSlug")}
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                    errors.gameSlug ? "border-red-500" : ""
                  }`}
                  disabled={gamesLoading}
                >
                  <option value="">Select a game</option>
                  <option value="general">General (All Games)</option>
                  {games.map((game) => (
                    <option key={game.slug} value={game.slug}>
                      {game.fullName}
                    </option>
                  ))}
                </select>
                {gamesLoading && (
                  <p className="text-sm text-gray-500">Loading games...</p>
                )}
                {gamesError && (
                  <p className="text-sm text-red-500">
                    Error loading games: {gamesError}
                  </p>
                )}
                {errors.gameSlug && (
                  <p className="text-sm text-red-500">
                    {errors.gameSlug.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
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
              <Label htmlFor="content">Article Content *</Label>
              <Textarea
                id="content"
                placeholder="Write your article content here..."
                {...register("content")}
                className={errors.content ? "border-red-500" : ""}
                rows={15}
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

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || gamesLoading}>
                {isLoading ? "Creating..." : "Create Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
