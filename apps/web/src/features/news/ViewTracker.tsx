"use client";

import { useEffect } from "react";
import { useViewTracking } from "@/hooks/useViewTracking";

interface ViewTrackerProps {
  contentId: string;
  contentType: "NEWS" | "POST" | "EVENT";
  onTracked?: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ViewTracker({
  contentId,
  contentType,
  onTracked,
  onSuccess,
  onError,
}: ViewTrackerProps) {
  const { trackView } = useViewTracking();

  useEffect(() => {
    // Track view when component mounts
    trackView({
      contentId,
      contentType,
      onSuccess: onSuccess || onTracked,
      onError: onError,
    });
  }, [contentId, contentType, trackView, onTracked, onSuccess, onError]);

  // This component doesn't render anything
  return null;
}
