"use client";

import { useState } from "react";
import { ChatRoomList } from "./ChatRoomList";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { ChatRoom } from "@/types/chat";
import { GameSlug } from "@/types";

interface ChatInterfaceProps {
  gameSlug?: GameSlug;
}

export function ChatInterface({ gameSlug }: ChatInterfaceProps) {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRoomSelect = (room: ChatRoom) => {
    setSelectedRoom(room);
  };

  const handleMessageSent = () => {
    // Trigger a refresh of the message list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Chat Rooms Sidebar */}
      <div className="lg:col-span-1">
        <ChatRoomList
          gameSlug={gameSlug}
          onRoomSelect={handleRoomSelect}
          selectedRoomId={selectedRoom?.id}
        />
      </div>

      {/* Chat Messages and Input */}
      <div className="lg:col-span-3 flex flex-col space-y-4">
        {selectedRoom ? (
          <>
            <ChatMessageList
              key={`${selectedRoom.id}-${refreshKey}`}
              roomId={selectedRoom.id}
              roomName={selectedRoom.name}
            />
            <ChatInput
              roomId={selectedRoom.id}
              onMessageSent={handleMessageSent}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a Chat Room
              </h3>
              <p className="text-gray-600">
                Choose a room from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
