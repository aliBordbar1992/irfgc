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
import { Label } from "@/components/ui/label";
import { CropImagePicker } from "@/components/ui/crop-image-picker";
import { VideoPicker } from "@/components/ui/video-picker";
import { Plus } from "lucide-react";
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
  const [images, setImages] = useState<string[]>([""]);
  const [videos, setVideos] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createPost } = usePosts({
    onSuccess: () => {
      setOpen(false);
      setContent("");
      setImages([""]);
      setVideos([""]);
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
      const filteredImages = images.filter((img) => img.trim() !== "");
      const filteredVideos = videos.filter((vid) => vid.trim() !== "");
      await createPost(content.trim(), filteredImages, filteredVideos);
      alert("Post created successfully!");
    } catch {
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setContent("");
      setImages([""]);
      setVideos([""]);
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Share your thoughts, images, or videos with the community.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 overflow-y-auto flex-1 pr-2"
        >
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
            <div className="space-y-3">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <CropImagePicker
                    label={`Image ${index + 1}`}
                    value={image}
                    onChange={(value) => {
                      const newImages = [...images];
                      newImages[index] = value;
                      setImages(newImages.filter(Boolean));
                    }}
                    maxSize={5}
                    imageType="thumbnail"
                  />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => setImages([...images, ""])}
                className="w-full"
              >
                Add Another Image
              </Button>
            </div>
          </div>

          {/* Videos Section */}
          <div className="space-y-2">
            <Label>Videos</Label>
            <div className="space-y-3">
              {videos.map((video, index) => (
                <div key={index} className="relative">
                  <VideoPicker
                    label={`Video ${index + 1}`}
                    value={video}
                    onChange={(value) => {
                      const newVideos = [...videos];
                      newVideos[index] = value;
                      setVideos(newVideos.filter(Boolean));
                    }}
                    maxSize={50}
                  />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => setVideos([...videos, ""])}
                className="w-full"
              >
                Add Another Video
              </Button>
            </div>
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
