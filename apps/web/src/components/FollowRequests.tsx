"use client";

import { useFollowRequests } from "@/hooks/useFollowRequests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Clock, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface FollowRequest {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  receiver?: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
}

export function FollowRequests() {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    requests: receivedRequests,
    isLoading: receivedLoading,
    refresh: refreshReceived,
  } = useFollowRequests({
    type: "received",
  });

  const {
    requests: sentRequests,
    isLoading: sentLoading,
    refresh: refreshSent,
  } = useFollowRequests({
    type: "sent",
  });

  const handleFollowAction = async (
    action: "accept" | "reject" | "cancel_request",
    targetUserId: string
  ) => {
    if (isProcessing || !targetUserId) return;

    setError(null);
    setIsProcessing(targetUserId);
    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUserId,
          action,
        }),
      });

      if (response.ok) {
        if (action === "accept" || action === "reject") {
          refreshReceived();
        } else {
          refreshSent();
        }
      } else {
        const errorData = await response.json();
        console.error("Error performing action:", errorData.error);
        setError(errorData.error || "Failed to perform action");
        throw new Error(errorData.error || "Failed to perform action");
      }
    } catch (error) {
      console.error("Error performing follow action:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      throw error;
    } finally {
      setIsProcessing(null);
    }
  };

  const renderRequestItem = (
    request: FollowRequest,
    type: "received" | "sent"
  ) => {
    const user = type === "received" ? request.sender : request.receiver;
    const status = request.status;

    return (
      <div
        key={request.id}
        className="flex items-center justify-between p-4 border-b last:border-b-0"
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar || ""} alt={user?.name} />
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link
              href={`/users/${user?.username}`}
              className="font-medium hover:underline"
            >
              {user?.name}
            </Link>
            <p className="text-sm text-gray-600">@{user?.username}</p>
            <p className="text-xs text-gray-500">
              {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {type === "received" && status === "PENDING" && user?.id && (
            <>
              <Button
                onClick={() => {
                  if (user.id) {
                    handleFollowAction("accept", user.id);
                  }
                }}
                disabled={isProcessing === user.id}
                size="sm"
                className="flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                Accept
              </Button>
              <Button
                onClick={() => {
                  if (user.id) {
                    handleFollowAction("reject", user.id);
                  }
                }}
                disabled={isProcessing === user.id}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Reject
              </Button>
            </>
          )}

          {type === "sent" && status === "PENDING" && user?.id && (
            <Button
              onClick={() => {
                if (user.id) {
                  handleFollowAction("cancel_request", user.id);
                }
              }}
              disabled={isProcessing === user.id}
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Cancel
            </Button>
          )}

          {status === "ACCEPTED" && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Accepted
            </span>
          )}

          {status === "REJECTED" && (
            <span className="text-sm text-red-600 flex items-center gap-1">
              <X className="h-3 w-3" />
              Rejected
            </span>
          )}

          {status === "PENDING" && type === "sent" && (
            <span className="text-sm text-yellow-600 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Pending
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Follow Requests
        </CardTitle>
      </CardHeader>
      {error && (
        <div className="px-6 py-2 bg-red-50 border-l-4 border-red-400">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      <CardContent>
        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received">
              Received (
              {receivedRequests.filter((r) => r.status === "PENDING").length})
            </TabsTrigger>
            <TabsTrigger value="sent">Sent ({sentRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-4">
            {receivedLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : receivedRequests.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No follow requests received
              </div>
            ) : (
              <div className="space-y-0">
                {receivedRequests.map((request) =>
                  renderRequestItem(request, "received")
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent" className="mt-4">
            {sentLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : sentRequests.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No follow requests sent
              </div>
            ) : (
              <div className="space-y-0">
                {sentRequests.map((request) =>
                  renderRequestItem(request, "sent")
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
