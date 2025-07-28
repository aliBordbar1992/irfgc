"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types";
import { User, Camera, Save, Loader2 } from "lucide-react";

interface ProfileFormProps {
  user: {
    id: string;
    name: string;
    username: string;
    email?: string;
    role: UserRole;
    avatar?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email || "",
    avatar: user.avatar || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Small delay to ensure database update is complete
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Force session refresh to get updated data
        await update({ force: true });
        setMessage({ type: "success", text: "Profile updated successfully!" });
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingAvatar(true);
      try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await fetch("/api/users/avatar", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const newAvatarUrl = data.data.avatarUrl;
          setFormData((prev) => ({
            ...prev,
            avatar: newAvatarUrl,
          }));
          // Small delay to ensure database update is complete
          await new Promise((resolve) => setTimeout(resolve, 100));
          // Force session refresh to reflect new avatar
          await update({ force: true });
          setMessage({ type: "success", text: "Avatar updated successfully!" });
          setTimeout(() => setMessage(null), 3000);
        } else {
          const errorData = await response.json();
          console.error("Error uploading avatar:", errorData.error);
          setMessage({
            type: "error",
            text: errorData.error || "Failed to upload avatar",
          });
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
        setMessage({ type: "error", text: "Failed to upload avatar" });
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "MODERATOR":
        return "bg-blue-100 text-blue-800";
      case "PLAYER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <div
            className={`p-3 rounded-lg mb-4 ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={formData.avatar || undefined}
                  alt={formData.name}
                />
                <AvatarFallback className="text-lg">
                  {formData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 p-1 rounded-full cursor-pointer transition-colors ${
                  isUploadingAvatar
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {isUploadingAvatar ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Camera className="w-3 h-3" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isUploadingAvatar}
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{formData.name}</h3>
              <p className="text-sm text-gray-500">@{formData.username}</p>
              <Badge className={`mt-1 ${getRoleColor(user.role)}`}>
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                disabled
                className="bg-gray-50"
                placeholder="Username cannot be changed"
              />
              <p className="text-xs text-gray-500">
                Username cannot be changed after registration
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter your email (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={formData.avatar}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, avatar: e.target.value }))
              }
              placeholder="Enter avatar URL (optional)"
            />
          </div>

          {/* Account Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              Account Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Member since:</span>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Last updated:</span>
                <p className="font-medium">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
