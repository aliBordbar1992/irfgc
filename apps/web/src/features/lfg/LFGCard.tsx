"use client";

import { LFGPost } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, MapPin, Monitor, User, Trophy } from "lucide-react";

interface LFGCardProps {
  post: LFGPost;
}

const PLATFORM_ICONS = {
  PC: Monitor,
  PS5: Monitor,
  PS4: Monitor,
  XBOX: Monitor,
  SWITCH: Monitor,
};

const PLATFORM_COLORS = {
  PC: "bg-blue-100 text-blue-800",
  PS5: "bg-purple-100 text-purple-800",
  PS4: "bg-indigo-100 text-indigo-800",
  XBOX: "bg-green-100 text-green-800",
  SWITCH: "bg-red-100 text-red-800",
};

const REGION_COLORS = {
  TEHRAN: "bg-yellow-100 text-yellow-800",
  ISFAHAN: "bg-blue-100 text-blue-800",
  SHIRAZ: "bg-green-100 text-green-800",
  TABRIZ: "bg-purple-100 text-purple-800",
  MASHHAD: "bg-orange-100 text-orange-800",
  ONLINE: "bg-gray-100 text-gray-800",
};

export function LFGCard({ post }: LFGCardProps) {
  const PlatformIcon = PLATFORM_ICONS[post.platform] || Monitor;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{post.title}</CardTitle>
            <CardDescription className="mt-2">
              {post.description}
            </CardDescription>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              post.isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {post.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <PlatformIcon className="w-4 h-4" />
              <span className={PLATFORM_COLORS[post.platform]}>
                {post.platform}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span className={REGION_COLORS[post.region]}>{post.region}</span>
            </div>
            {post.rank && (
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4" />
                <span>{post.rank}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{post.author.name}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              Contact
            </Button>
            <Button size="sm">Join</Button>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>Posted {formatDate(post.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
