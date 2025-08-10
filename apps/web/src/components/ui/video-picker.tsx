"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Video, Play } from "lucide-react";

interface VideoPickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  description?: string;
  className?: string;
  maxSize?: number; // in MB
}

export function VideoPicker({
  value,
  onChange,
  placeholder = "Enter video URL or upload file",
  label = "Video",
  description,
  className,
  maxSize = 50,
}: VideoPickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (url: string) => {
    setError("");
    onChange(url);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file");
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Video size must be less than ${maxSize}MB`);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append("video", file);
      formData.append("type", "post");

      // Upload to server
      const uploadResponse = await fetch("/api/posts/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        const data = await uploadResponse.json();
        onChange(data.data.videoUrl);
      } else {
        const errorData = await uploadResponse.json();
        setError(errorData.error || "Failed to upload video");
      }
    } catch {
      setError("Failed to upload video");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={value || ""}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          {value && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        {description && <p className="text-xs text-gray-500">{description}</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {/* Video Preview */}
      {value && (
        <div className="relative">
          <video
            src={value}
            controls
            className="w-full rounded-lg max-h-48 object-cover"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
            <Play className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>
      )}

      {/* File Info */}
      {!value && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Video className="w-4 h-4" />
          <span>Supports MP4, WebM, OGV up to {maxSize}MB</span>
        </div>
      )}
    </div>
  );
}
