"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Notifications } from "@/components/Notifications";
import { UserComments } from "@/components/UserComments";

export default function TestNotificationsPage() {
  const { data: session } = useSession();
  const [testComment, setTestComment] = useState("");

  const createTestComment = async () => {
    if (!testComment.trim() || !session?.user?.id) return;

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: testComment,
          contentId: "test-content-123",
          contentType: "NEWS",
        }),
      });

      if (response.ok) {
        setTestComment("");
        alert(
          "Test comment created! Check your profile for comments and notifications."
        );
      } else {
        alert("Failed to create test comment");
      }
    } catch (error) {
      console.error("Error creating test comment:", error);
      alert("Error creating test comment");
    }
  };

  const createTestReply = async () => {
    if (!testComment.trim() || !session?.user?.id) return;

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: testComment,
          contentId: "test-content-123",
          contentType: "NEWS",
          parentId: "test-parent-comment", // This will create a notification
        }),
      });

      if (response.ok) {
        setTestComment("");
        alert(
          "Test reply created! Check notifications for the reply notification."
        );
      } else {
        alert("Failed to create test reply");
      }
    } catch (error) {
      console.error("Error creating test reply:", error);
      alert("Error creating test reply");
    }
  };

  if (!session?.user?.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Test Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please sign in to test notifications and comments.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Test Notifications & Comments
        </h1>
        <p className="text-gray-600 mt-2">
          Test the notification and comment functionality
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Comment Content
              </label>
              <Textarea
                value={testComment}
                onChange={(e) => setTestComment(e.target.value)}
                placeholder="Enter test comment content..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={createTestComment}
                disabled={!testComment.trim()}
              >
                Create Test Comment
              </Button>
              <Button onClick={createTestReply} disabled={!testComment.trim()}>
                Create Test Reply
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              <p>• Create Test Comment: Creates a new comment</p>
              <p>
                • Create Test Reply: Creates a reply (will trigger notification)
              </p>
              <p>• Check your profile page to see your comments</p>
              <p>• Check notifications for reply notifications</p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Notifications />
      </div>

      {/* User Comments */}
      <div className="mt-8">
        <UserComments userId={session.user.id} />
      </div>
    </div>
  );
}
