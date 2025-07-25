// User Types
export type UserRole = "PLAYER" | "MODERATOR" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Game Types
export type GameSlug = string; // Made dynamic instead of hardcoded

export interface Game {
  id: string;
  slug: GameSlug;
  name: string;
  fullName: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  discordUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    events: number;
    newsPosts: number;
    lfgPosts: number;
    forumThreads: number;
  };
}

// Event Types
export type EventType = "TOURNAMENT" | "CASUAL" | "ONLINE" | "OFFLINE";
export type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  user: User;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  gameSlug: GameSlug;
  type: EventType;
  status: EventStatus;
  startDate: Date;
  endDate: Date;
  location?: string;
  onlineUrl?: string;
  maxParticipants?: number;
  currentParticipants: number;
  registrationDeadline?: Date;
  deletedAt?: Date;
  createdBy: string | { id: string; name: string; email: string };
  createdAt: Date;
  updatedAt: Date;
  registrations?: EventRegistration[];
}

// News Types
export type NewsStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  gameSlug?: GameSlug; // Optional for general news
  game?: Game;
  authorId: string;
  author: User;
  status: NewsStatus;
  views: number;
  featured: boolean;
  publishedAt: Date;
  deletedAt?: Date; // Soft delete timestamp
  createdAt: Date;
  updatedAt: Date;
}

// Matchmaking Types
export type Platform = "PC" | "PS5" | "PS4" | "XBOX" | "SWITCH";
export type Region =
  | "TEHRAN"
  | "ISFAHAN"
  | "SHIRAZ"
  | "TABRIZ"
  | "MASHHAD"
  | "ONLINE";

export interface LFGPost {
  id: string;
  title: string;
  description: string;
  gameSlug: GameSlug;
  platform: Platform;
  region: Region;
  rank?: string;
  isActive: boolean;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

// Forum Types
export interface ForumThread {
  id: string;
  title: string;
  content: string;
  gameSlug: GameSlug;
  authorId: string;
  author: User;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumReply {
  id: string;
  content: string;
  threadId: string;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
