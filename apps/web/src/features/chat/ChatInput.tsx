"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { CreateMessageData } from "@/types/chat";

interface ChatInputProps {
  roomId: string;
  onMessageSent?: () => void;
}

export function ChatInput({ roomId, onMessageSent }: ChatInputProps) {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id || !message.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const messageData: CreateMessageData = {
        content: message.trim(),
        roomId,
        messageType: "TEXT",
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setMessage("");
      onMessageSent?.();
    } catch (error) {
      console.error("Error sending message:", error);
      // You could add a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!session) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-center text-gray-600">
          Please sign in to send messages
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        disabled={isLoading}
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading || !message.trim()} size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
