"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Image, Video, Plus } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";

interface CreatePostDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CreatePostDialog({
  onSuccess,
  trigger,
}: CreatePostDialogProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createPost } = usePosts({
    onSuccess: () => {
      setOpen(false);
      setContent("");
      setImages([]);
      setVideos([]);
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to create post:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Please enter some content for your post.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createPost(content.trim(), images, videos);
      alert("Post created successfully!");
    } catch {
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImage = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addVideo = () => {
    if (newVideoUrl.trim() && !videos.includes(newVideoUrl.trim())) {
      setVideos([...videos, newVideoUrl.trim()]);
      setNewVideoUrl("");
    }
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setContent("");
      setImages([]);
      setVideos([]);
      setNewImageUrl("");
      setNewVideoUrl("");
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Post</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Share your thoughts, images, or videos with the community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px]"
              maxLength={5000}
            />
            <div className="text-sm text-gray-500">
              {content.length}/5000 characters
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-2">
            <Label>Images</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addImage())
                }
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImage}
                disabled={!newImageUrl.trim()}
              >
                <Image className="h-4 w-4" />
              </Button>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <span className="truncate max-w-[200px]">{image}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="h-auto p-0 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Videos Section */}
          <div className="space-y-2">
            <Label>Videos</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Video URL"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addVideo())
                }
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVideo}
                disabled={!newVideoUrl.trim()}
              >
                <Video className="h-4 w-4" />
              </Button>
            </div>
            {videos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {videos.map((video, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <span className="truncate max-w-[200px]">{video}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVideo(index)}
                      className="h-auto p-0 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
