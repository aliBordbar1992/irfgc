import { UserRole } from "./index";

export interface ChatRoom {
  id: string;
  name: string;
  gameSlug?: string;
  type: "GENERAL" | "GAME_SPECIFIC" | "TOURNAMENT" | "PRIVATE";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  game?: {
    id: string;
    name: string;
    fullName: string;
  };
  _count?: {
    messages: number;
  };
}

export interface ChatMessage {
  id: string;
  content: string;
  roomId: string;
  authorId: string;
  messageType: "TEXT" | "SYSTEM" | "NOTIFICATION";
  createdAt: Date;
  author: {
    id: string;
    name: string;
    role: UserRole;
  };
}

export interface ChatResponse {
  data: ChatMessage[] | ChatRoom[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateMessageData {
  content: string;
  roomId: string;
  messageType?: "TEXT" | "SYSTEM" | "NOTIFICATION";
}

export interface CreateRoomData {
  name: string;
  gameSlug?: string;
  type?: "GENERAL" | "GAME_SPECIFIC" | "TOURNAMENT" | "PRIVATE";
}
