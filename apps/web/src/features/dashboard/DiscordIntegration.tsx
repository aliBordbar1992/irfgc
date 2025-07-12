"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GameSlug } from "@/types";

interface DiscordIntegrationProps {
  gameSlug?: GameSlug;
}

export function DiscordIntegration({ gameSlug }: DiscordIntegrationProps) {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [eventType, setEventType] = useState("GENERAL");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const handleSendNotification = async () => {
    if (!message.trim()) {
      setStatus({
        type: "error",
        message: "Please enter a message",
      });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/discord?action=send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
          gameSlug,
          eventType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send notification");
      }

      setStatus({
        type: "success",
        message: "Discord notification sent successfully!",
      });
      setMessage("");
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to send notification",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (status?.type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "info":
        return "text-blue-600";
      default:
        return "";
    }
  };

  if (session?.user?.role !== "ADMIN") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Discord Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Only administrators can manage Discord integrations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discord Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="eventType">Notification Type</Label>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger>
              <SelectValue placeholder="Select notification type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GENERAL">General Update</SelectItem>
              <SelectItem value="EVENT">Event Announcement</SelectItem>
              <SelectItem value="NEWS">News Update</SelectItem>
              <SelectItem value="TOURNAMENT">
                Tournament Announcement
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your Discord notification message..."
            rows={4}
          />
        </div>

        {gameSlug && (
          <div className="text-sm text-gray-600">
            This notification will be sent to the {gameSlug.toUpperCase()}{" "}
            Discord channel.
          </div>
        )}

        {status && (
          <div className={`text-sm ${getStatusColor()}`}>{status.message}</div>
        )}

        <Button
          onClick={handleSendNotification}
          disabled={isLoading || !message.trim()}
          className="w-full"
        >
          {isLoading ? "Sending..." : "Send Discord Notification"}
        </Button>

        <div className="text-xs text-gray-500">
          <p>• Notifications will be sent to the configured Discord webhook</p>
          <p>
            • Make sure your Discord webhook URL is configured in environment
            variables
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
