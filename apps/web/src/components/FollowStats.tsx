"use client";

import { useFollowStats } from "@/hooks/useFollowStats";
import { useSession } from "next-auth/react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FollowListModal } from "@/components/FollowListModal";
import { LoginPromptModal } from "@/components/LoginPromptModal";

interface FollowStatsProps {
  targetUserId: string;
  className?: string;
}

export interface FollowStatsRef {
  refresh: () => void;
}

export const FollowStats = forwardRef<FollowStatsRef, FollowStatsProps>(
  ({ targetUserId, className = "" }, ref) => {
    const { data: session } = useSession();
    const { stats, isLoading, error, refresh } = useFollowStats({
      targetUserId,
    });
    const [showFollowModal, setShowFollowModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [initialTab, setInitialTab] = useState<
      "mutual" | "followers" | "following"
    >("followers");

    useImperativeHandle(ref, () => ({
      refresh,
    }));

    const handleStatsClick = (type: "followers" | "following") => {
      if (!session?.user?.id) {
        setShowLoginModal(true);
        return;
      }
      setInitialTab(type);
      setShowFollowModal(true);
    };

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
      <>
        <div className={`text-sm text-gray-600 ${className}`}>
          <span
            className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleStatsClick("followers")}
          >
            {stats.followerCount}
          </span>{" "}
          followers
          <span className="mx-2">•</span>
          <span
            className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => handleStatsClick("following")}
          >
            {stats.followingCount}
          </span>{" "}
          following
        </div>

        <FollowListModal
          isOpen={showFollowModal}
          onClose={() => setShowFollowModal(false)}
          targetUserId={targetUserId}
          initialTab={initialTab}
        />

        <LoginPromptModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          action="custom"
          customTitle="Sign in to view connections"
          customMessage="You need to be signed in to see user connections."
        />
      </>
    );
  }
);

FollowStats.displayName = "FollowStats";
