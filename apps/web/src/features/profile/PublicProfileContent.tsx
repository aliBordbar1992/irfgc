"use client";

import { ProfileStats } from "@/features/profile/ProfileStats";
import { ProfileActivity } from "@/features/profile/ProfileActivity";
import { UserComments } from "@/components/UserComments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/types";
import { Calendar, User } from "lucide-react";

interface PublicProfileContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any; // Simplified for now to avoid complex type issues
}

export function PublicProfileContent({ user }: PublicProfileContentProps) {
  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "Administrator";
      case "MODERATOR":
        return "Moderator";
      case "PLAYER":
        return "Player";
      default:
        return role;
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar || ""} alt={user.name} />
            <AvatarFallback className="text-lg">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600 text-lg">@{user.username}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getRoleColor(user.role)}>
                {getRoleDisplayName(user.role)}
              </Badge>
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                This is the public profile of {user.name}. You can view their
                activity and contributions to the community below.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ProfileStats stats={user._count} />
          <ProfileActivity
            events={user.events}
            newsPosts={user.newsPosts}
            lfgPosts={user.lfgPosts}
            forumThreads={user.forumThreads}
            registrations={user.eventRegistrations}
          />
        </div>
      </div>

      {/* User Comments */}
      <div className="mt-12">
        <UserComments userId={user.id} />
      </div>
    </div>
  );
}
