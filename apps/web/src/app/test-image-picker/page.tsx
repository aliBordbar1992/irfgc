"use client";

import { useState } from "react";
import { CropImagePicker } from "@/components/ui/crop-image-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestImagePickerPage() {
  const [thumbnail, setThumbnail] = useState("");
  const [coverImage, setCoverImage] = useState("");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Image Picker Demo
          </h1>
          <p className="text-gray-600">
            Test the drag-and-drop image picker functionality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Thumbnail Image</CardTitle>
            </CardHeader>
            <CardContent>
              <CropImagePicker
                label="Thumbnail"
                description="Small image for news list (max 2MB)"
                value={thumbnail}
                onChange={setThumbnail}
                maxSize={2}
                cropWidth={400}
                cropHeight={300}
                imageType="thumbnail"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <CropImagePicker
                label="Cover"
                description="Large image for article page (max 5MB)"
                value={coverImage}
                onChange={setCoverImage}
                maxSize={5}
                cropWidth={1200}
                cropHeight={600}
                imageType="cover"
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Thumbnail:</h3>
                <p className="text-sm text-gray-600 break-all">
                  {thumbnail || "No thumbnail selected"}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Cover Image:</h3>
                <p className="text-sm text-gray-600 break-all">
                  {coverImage || "No cover image selected"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
