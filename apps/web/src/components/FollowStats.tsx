"use client";

import { useFollowStats } from "@/hooks/useFollowStats";
import { forwardRef, useImperativeHandle } from "react";

interface FollowStatsProps {
  targetUserId: string;
  className?: string;
}

export interface FollowStatsRef {
  refresh: () => void;
}

export const FollowStats = forwardRef<FollowStatsRef, FollowStatsProps>(
  ({ targetUserId, className = "" }, ref) => {
    const { stats, isLoading, error, refresh } = useFollowStats({
      targetUserId,
    });

    useImperativeHandle(ref, () => ({
      refresh,
    }));

    if (isLoading) {
      return (
        <div className={`text-sm text-gray-600 ${className}`}>
          <div className="animate-pulse">
            <span className="inline-block bg-gray-200 h-4 w-8 rounded"></span>{" "}
            followers
            <span className="mx-2">•</span>
            <span className="inline-block bg-gray-200 h-4 w-8 rounded"></span>{" "}
            following
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={`text-sm text-gray-500 ${className}`}>
          <span>0</span> followers
          <span className="mx-2">•</span>
          <span>0</span> following
        </div>
      );
    }

    return (
      <div className={`text-sm text-gray-600 ${className}`}>
        <span className="font-medium">{stats.followerCount}</span> followers
        <span className="mx-2">•</span>
        <span className="font-medium">{stats.followingCount}</span> following
      </div>
    );
  }
);

FollowStats.displayName = "FollowStats";
