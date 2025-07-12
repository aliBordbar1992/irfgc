"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatRoom, ChatResponse } from "@/types/chat";
import { GameSlug } from "@/types";

interface ChatRoomListProps {
  gameSlug?: GameSlug;
  onRoomSelect: (room: ChatRoom) => void;
  selectedRoomId?: string;
}

export function ChatRoomList({
  gameSlug,
  onRoomSelect,
  selectedRoomId,
}: ChatRoomListProps) {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRooms();
  }, [gameSlug]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (gameSlug) params.append("gameSlug", gameSlug);

      const response = await fetch(`/api/chat?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat rooms");
      }

      const data: ChatResponse = await response.json();
      setRooms(data.data as ChatRoom[]);
    } catch (err) {
      setError("Failed to load chat rooms");
      console.error("Error fetching chat rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case "GENERAL":
        return "bg-blue-100 text-blue-800";
      case "GAME_SPECIFIC":
        return "bg-green-100 text-green-800";
      case "TOURNAMENT":
        return "bg-purple-100 text-purple-800";
      case "PRIVATE":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chat Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chat Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchRooms} className="mt-2">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat Rooms</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rooms.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No chat rooms available
            </p>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedRoomId === room.id
                    ? "bg-blue-50 border-blue-200"
                    : "hover:bg-gray-50 border-gray-200"
                }`}
                onClick={() => onRoomSelect(room)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{room.name}</h3>
                    {room.game && (
                      <p className="text-sm text-gray-500">
                        {room.game.fullName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoomTypeColor(room.type)}>
                      {room.type.replace("_", " ")}
                    </Badge>
                    {room._count && (
                      <span className="text-xs text-gray-500">
                        {room._count.messages} messages
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
