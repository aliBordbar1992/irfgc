"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReactions } from "@/hooks/useReactions";
import { useReactionData } from "@/hooks/useReactionData";
import { ContentType } from "@/types";
import { EmojiPickerButton } from "./EmojiPicker";

interface ReactionsProps {
  contentId: string;
  contentType: ContentType;
  className?: string;
}

export function Reactions({
  contentId,
  contentType,
  className,
}: ReactionsProps) {
  const { data: session } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const {
    data: reactionData,
    loading,
    refetch,
  } = useReactionData({
    contentId,
    contentType,
    enabled: true,
  });

  const { addReaction } = useReactions({
    contentId,
    contentType,
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Failed to add reaction:", error);
    },
  });

  const handleEmojiSelect = async (emoji: string) => {
    if (!session?.user?.id) {
      setShowLoginModal(true);
      return;
    }

    try {
      await addReaction(emoji);
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const handleReactionClick = async (emoji: string) => {
    if (!session?.user?.id) {
      setShowLoginModal(true);
      return;
    }

    try {
      await addReaction(emoji);
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
      </div>
    );
  }

  return (
    <>
      <div className={`flex items-center gap-1 ${className}`}>
        {/* Emoji picker button */}
        <EmojiPickerButton onEmojiSelect={handleEmojiSelect} className="mr-2" />

        {/* Display existing reactions */}
        {reactionData?.reactions &&
          Object.entries(reactionData.reactions).map(([emoji, data]) => {
            const isUserReaction = reactionData.userReaction === emoji;

            return (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className={`h-8 px-2 gap-1 ${
                  isUserReaction
                    ? "text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => handleReactionClick(emoji)}
              >
                <span className="text-sm">{emoji}</span>
                {data.count > 0 && (
                  <span className="text-xs">{data.count}</span>
                )}
              </Button>
            );
          })}

        {/* Total reactions count */}
        {reactionData && reactionData.totalReactions > 0 && (
          <span className="text-xs text-gray-500 ml-2">
            {reactionData.totalReactions} total
          </span>
        )}
      </div>

      {/* Login Required Dialog */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to react to content. Please sign in to
              continue.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowLoginModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowLoginModal(false);
                // Redirect to login page
                window.location.href = "/auth/signin";
              }}
            >
              Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
