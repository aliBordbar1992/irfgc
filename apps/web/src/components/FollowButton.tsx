"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useFollow } from "@/hooks/useFollow";
import { useEffect, useState, useCallback } from "react";
import { UserPlus, UserMinus, Clock, Check, X } from "lucide-react";
import { LoginPromptModal } from "@/components/LoginPromptModal";

interface FollowButtonProps {
  targetUserId: string;
  onStatusChange?: (status: {
    status: "none" | "following" | "request_sent" | "request_received";
    followerCount: number;
    followingCount: number;
  }) => void;
  onFollowStatsChange?: () => void; // New callback for refreshing public stats
}

export function FollowButton({
  targetUserId,
  onStatusChange,
  onFollowStatsChange,
}: FollowButtonProps) {
  const { data: session } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const {
    followStatus,
    isLoading,
    fetchFollowStatus,
    follow,
    unfollow,
    cancelRequest,
    acceptRequest,
    rejectRequest,
  } = useFollow({
    targetUserId,
    onStatusChange,
  });

  // Create wrapped follow actions that trigger stats refresh
  const handleFollow = useCallback(async () => {
    await follow();
    onFollowStatsChange?.();
  }, [follow, onFollowStatsChange]);

  const handleUnfollow = useCallback(async () => {
    await unfollow();
    onFollowStatsChange?.();
  }, [unfollow, onFollowStatsChange]);

  const handleCancelRequest = useCallback(async () => {
    await cancelRequest();
    onFollowStatsChange?.();
  }, [cancelRequest, onFollowStatsChange]);

  const handleAcceptRequest = useCallback(async () => {
    await acceptRequest();
    onFollowStatsChange?.();
  }, [acceptRequest, onFollowStatsChange]);

  const handleRejectRequest = useCallback(async () => {
    await rejectRequest();
    onFollowStatsChange?.();
  }, [rejectRequest, onFollowStatsChange]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchFollowStatus();
    }
  }, [session?.user?.id, fetchFollowStatus]);

  // Don't show button if viewing your own profile
  if (session?.user?.id === targetUserId) {
    return null;
  }

  // Show login prompt for non-authenticated users
  if (!session?.user?.id) {
    return (
      <>
        <Button
          onClick={() => setShowLoginModal(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Follow
        </Button>
        <LoginPromptModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          action="follow"
        />
      </>
    );
  }

  const renderButton = () => {
    switch (followStatus.status) {
      case "none":
        return (
          <Button
            onClick={handleFollow}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Follow
          </Button>
        );

      case "following":
        return (
          <Button
            onClick={handleUnfollow}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <UserMinus className="h-4 w-4" />
            Unfollow
          </Button>
        );

      case "request_sent":
        return (
          <Button
            onClick={handleCancelRequest}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Cancel Request
          </Button>
        );

      case "request_received":
        return (
          <div className="flex gap-2">
            <Button
              onClick={handleAcceptRequest}
              disabled={isLoading}
              size="sm"
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Accept
            </Button>
            <Button
              onClick={handleRejectRequest}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return renderButton();
}
