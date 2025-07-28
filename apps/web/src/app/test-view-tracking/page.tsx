"use client";

import { useState } from "react";
import { useViewTracking } from "@/hooks/useViewTracking";
import { useViewStats } from "@/hooks/useViewStats";
import { ViewTracker } from "@/features/news/ViewTracker";
import { ViewStatsDisplay } from "@/features/news/ViewStatsDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, TrendingUp, RefreshCw } from "lucide-react";
import { ContentType } from "@/types";

export default function TestViewTrackingPage() {
  const [testContentId] = useState("test-news-123");
  const [trackingResults, setTrackingResults] = useState<string[]>([]);
  const { trackView } = useViewTracking();
  const { stats, loading, error, refetch } = useViewStats({
    contentId: testContentId,
    contentType: ContentType.NEWS_POST,
    period: "all",
    enabled: true,
  });

  const handleManualTrack = async () => {
    try {
      await trackView({
        contentId: testContentId,
        contentType: ContentType.NEWS_POST,
        onSuccess: () => {
          setTrackingResults((prev) => [
            ...prev,
            `✅ View tracked at ${new Date().toLocaleTimeString()}`,
          ]);
          // Refetch stats after tracking
          setTimeout(() => refetch(), 1000);
        },
        onError: (error) => {
          setTrackingResults((prev) => [
            ...prev,
            `❌ Failed to track: ${error}`,
          ]);
        },
      });
    } catch (error) {
      setTrackingResults((prev) => [...prev, `❌ Error: ${error}`]);
    }
  };

  const clearResults = () => {
    setTrackingResults([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          View Tracking System Test
        </h1>

        {/* Automatic View Tracker */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Automatic View Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This page automatically tracks a view when loaded using the
              ViewTracker component.
            </p>
            <ViewTracker
              contentId={testContentId}
              contentType={ContentType.NEWS_POST}
              onSuccess={() => {
                setTrackingResults((prev) => [
                  ...prev,
                  `✅ Automatic view tracked at ${new Date().toLocaleTimeString()}`,
                ]);
              }}
              onError={(error) => {
                setTrackingResults((prev) => [
                  ...prev,
                  `❌ Automatic tracking failed: ${error}`,
                ]);
              }}
            />
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Active - View will be tracked on page load
            </Badge>
          </CardContent>
        </Card>

        {/* Manual Tracking */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Manual View Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Click the button below to manually track a view.
            </p>
            <div className="flex gap-4">
              <Button onClick={handleManualTrack}>Track View Manually</Button>
              <Button variant="outline" onClick={clearResults}>
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* View Statistics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              View Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-gray-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Loading statistics...
              </div>
            ) : error ? (
              <div className="text-red-600">
                Error loading statistics: {error}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalViews}
                  </div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.uniqueViewers}
                  </div>
                  <div className="text-sm text-gray-600">Unique Viewers</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.recentViews.length}
                  </div>
                  <div className="text-sm text-gray-600">Recent Views</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-600">No statistics available</div>
            )}

            <div className="mt-4">
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Statistics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ViewStatsDisplay Component */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              ViewStatsDisplay Component
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This shows the ViewStatsDisplay component in action:
            </p>
            <ViewStatsDisplay
              contentId={testContentId}
              contentType={ContentType.NEWS_POST}
              className="justify-center"
            />
          </CardContent>
        </Card>

        {/* Tracking Results */}
        <Card>
          <CardHeader>
            <CardTitle>Tracking Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto">
              {trackingResults.length === 0 ? (
                <p className="text-gray-500">
                  No tracking results yet. Try loading the page or clicking the
                  manual track button.
                </p>
              ) : (
                <div className="space-y-2">
                  {trackingResults.map((result, index) => (
                    <div
                      key={index}
                      className="text-sm font-mono bg-gray-50 p-2 rounded"
                    >
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
