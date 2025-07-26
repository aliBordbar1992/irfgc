"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image, X, Upload } from "lucide-react";

interface ImagePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  description?: string;
  className?: string;
}

export function ImagePicker({
  value,
  onChange,
  placeholder = "Enter image URL or upload file",
  label = "Image",
  description,
  className,
}: ImagePickerProps) {
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
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // For now, we'll use a simple base64 conversion
      // In a real app, you'd upload to a CDN or cloud storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setError("Failed to read image file");
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setError("Failed to process image");
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
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        {description && <p className="text-xs text-gray-500">{description}</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {/* Image Preview */}
      {value && (
        <div className="relative">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <div className="text-gray-500">Loading image...</div>
              </div>
            ) : (
              <img
                src={value}
                alt="Preview"
                className="w-full h-48 object-cover"
                onError={() => setError("Failed to load image")}
                onLoad={() => setError("")}
              />
            )}
          </div>
          {value && !isLoading && (
            <div className="absolute top-2 right-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Placeholder when no image */}
      {!value && !isLoading && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">
            No image selected. Enter a URL or upload a file.
          </p>
        </div>
      )}
    </div>
  );
}
