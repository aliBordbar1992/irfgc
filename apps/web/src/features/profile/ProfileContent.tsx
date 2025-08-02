"use client";

import { ProfileForm } from "@/features/profile/ProfileForm";
import { ProfileStats } from "@/features/profile/ProfileStats";
import { ProfileActivity } from "@/features/profile/ProfileActivity";
import { UserComments } from "@/components/UserComments";
import { Notifications } from "@/components/Notifications";
import { FollowRequests } from "@/components/FollowRequests";
interface ProfileContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any; // Simplified for now to avoid complex type issues
}

export function ProfileContent({ user }: ProfileContentProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and view your activity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <ProfileForm user={user} />
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

      {/* User Comments and Notifications */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserComments userId={user.id} />
        <Notifications />
      </div>

      {/* Follow Requests */}
      <div className="mt-12">
        <FollowRequests />
      </div>
    </div>
  );
}
