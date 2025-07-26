"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Upload, FileImage, RotateCcw, Check } from "lucide-react";
import ReactCrop, {
  Crop as CropType,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Image from "next/image";

interface CropImagePickerProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  className?: string;
  maxSize?: number; // in MB
  cropWidth?: number; // fixed crop width (optional)
  cropHeight?: number; // fixed crop height (optional)
  imageType: "thumbnail" | "cover"; // for upload API
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function CropImagePicker({
  value,
  onChange,
  label = "Image",
  description,
  className,
  maxSize = 5,
  cropWidth,
  cropHeight,
  imageType,
}: CropImagePickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

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
          setOriginalImage(result);
          setShowCrop(true);
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
    [maxSize]
  );

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
    setShowCrop(false);
    setOriginalImage("");
    setCrop(undefined);
    setCompletedCrop(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;

      // Set initial crop based on fixed dimensions or default to 90% of image
      if (cropWidth && cropHeight) {
        const aspect = cropWidth / cropHeight;
        const newCrop = centerAspectCrop(width, height, aspect);
        setCrop(newCrop);
      } else {
        const newCrop = centerAspectCrop(width, height, 16 / 9);
        setCrop(newCrop);
      }
    },
    [cropWidth, cropHeight]
  );

  const getCroppedImg = useCallback(
    async (image: HTMLImageElement, crop: PixelCrop): Promise<string> => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            }
          },
          "image/jpeg",
          0.9
        );
      });
    },
    []
  );

  const handleCropComplete = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return;

    try {
      setIsLoading(true);
      const croppedImageUrl = await getCroppedImg(
        imgRef.current,
        completedCrop
      );

      // Convert base64 to blob for upload
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();

      // Create form data for upload
      const formData = new FormData();
      formData.append("image", blob, "cropped-image.jpg");
      formData.append("type", imageType);

      // Upload to server
      const uploadResponse = await fetch("/api/news/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        const data = await uploadResponse.json();
        onChange(data.data.imageUrl);
        setShowCrop(false);
        setOriginalImage("");
        setCrop(undefined);
        setCompletedCrop(undefined);
      } else {
        const errorData = await uploadResponse.json();
        setError(errorData.error || "Failed to upload image");
      }
    } catch {
      setError("Failed to process cropped image");
    } finally {
      setIsLoading(false);
    }
  }, [completedCrop, getCroppedImg, onChange, imageType]);

  const handleCancelCrop = () => {
    setShowCrop(false);
    setOriginalImage("");
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            Browse Files
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
      {!value && !showCrop && (
        <div
          ref={dropZoneRef}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
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
      )}

      {/* Crop Interface */}
      {showCrop && originalImage && (
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={
                cropWidth && cropHeight ? cropWidth / cropHeight : undefined
              }
              minWidth={cropWidth && cropHeight ? undefined : 100}
              minHeight={cropWidth && cropHeight ? undefined : 100}
              locked={!!(cropWidth && cropHeight)}
            >
              <Image
                ref={imgRef}
                alt="Crop preview"
                src={originalImage}
                onLoad={onImageLoad}
                className="max-h-96 w-auto"
                width={800}
                height={600}
                unoptimized
              />
            </ReactCrop>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelCrop}
              disabled={isLoading}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCropComplete}
              disabled={isLoading || !completedCrop}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Apply Crop
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Final Image Preview */}
      {value && !showCrop && (
        <div className="relative">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Image
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover"
              onError={() => setError("Failed to load image")}
              onLoad={() => setError("")}
              width={400}
              height={300}
              unoptimized
            />
          </div>
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
        </div>
      )}
    </div>
  );
}
