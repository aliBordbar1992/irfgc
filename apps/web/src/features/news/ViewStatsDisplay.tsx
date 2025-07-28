"use client";

import { useViewStats } from "@/hooks/useViewStats";
import { formatViewCount } from "@/lib/utils";
import { Eye, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContentType } from "@/types";

interface ViewStatsDisplayProps {
  contentId: string;
  contentType: ContentType;
  className?: string;
}

export function ViewStatsDisplay({
  contentId,
  contentType,
  className = "",
}: ViewStatsDisplayProps) {
  const { stats, loading, error } = useViewStats({
    contentId,
    contentType,
    period: "all",
    enabled: true,
  });

  if (loading) {
    return (
      <div className={`flex items-center gap-4 text-gray-600 ${className}`}>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 animate-pulse" />
          <span className="text-sm">Loading views...</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return null; // Don't show anything if there's an error
  }

  return (
    <div className={`flex items-center gap-4 text-gray-600 ${className}`}>
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4" />
        <span className="text-sm">
          {formatViewCount(stats.totalViews)} views
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Users className="w-4 h-4" />
        <span className="text-sm">
          {formatViewCount(stats.uniqueViewers)} unique
        </span>
      </div>

      {stats.recentViews.length > 0 && (
        <Badge variant="outline" className="text-xs">
          <TrendingUp className="w-3 h-3 mr-1" />
          Active
        </Badge>
      )}
    </div>
  );
}
