"use client";

import { useSession } from "next-auth/react";
import { useFollow } from "@/hooks/useFollow";
import { useEffect } from "react";

interface FollowStatsProps {
  targetUserId: string;
  className?: string;
}

export function FollowStats({
  targetUserId,
  className = "",
}: FollowStatsProps) {
  const { data: session } = useSession();
  const { followStatus, fetchFollowStatus } = useFollow({
    targetUserId,
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchFollowStatus();
    }
  }, [session?.user?.id, fetchFollowStatus]);

  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      <span className="font-medium">{followStatus.followerCount}</span>{" "}
      followers
      <span className="mx-2">•</span>
      <span className="font-medium">{followStatus.followingCount}</span>{" "}
      following
    </div>
  );
}
