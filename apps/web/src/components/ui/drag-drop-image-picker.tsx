"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, FileImage } from "lucide-react";

interface DragDropImagePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  description?: string;
  className?: string;
  maxSize?: number; // in MB
}

export function DragDropImagePicker({
  value,
  onChange,
  placeholder = "Enter image URL or drag & drop file",
  label = "Image",
  description,
  className,
  maxSize = 5,
}: DragDropImagePickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const validateAndProcessFile = useCallback(
    async (file: File) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`Image size must be less than ${maxSize}MB`);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
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
    },
    [maxSize, onChange]
  );

  const handleUrlChange = (url: string) => {
    setError("");
    onChange(url);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await validateAndProcessFile(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        await validateAndProcessFile(files[0]);
      }
    },
    [validateAndProcessFile]
  );

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
            Browse
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

      {/* Drag & Drop Zone */}
      <div
        ref={dropZoneRef}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${value ? "hidden" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium mb-2">
          Drag & drop an image here
        </p>
        <p className="text-gray-500 text-sm mb-4">
          or click the Browse button to select a file
        </p>
        <p className="text-xs text-gray-400">
          Supports: JPG, PNG, GIF, WebP (max {maxSize}MB)
        </p>
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
    </div>
  );
}
