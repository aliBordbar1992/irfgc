import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GameSlug } from "@/types";
import { ChatInterface } from "@/features/chat/ChatInterface";

interface ChatPageProps {
  params: Promise<{ gameSlug: string }>;
}

async function getGame(gameSlug: string) {
  // This would typically fetch from the database
  // For now, we'll use a simple check
  const games = ["mk", "sf", "tk", "gg", "bb", "uni"];
  if (!games.includes(gameSlug)) {
    return null;
  }

  return {
    id: "1",
    slug: gameSlug,
    name: gameSlug.toUpperCase(),
    fullName: getGameFullName(gameSlug),
  };
}

function getGameFullName(slug: string): string {
  const gameNames: Record<string, string> = {
    mk: "Mortal Kombat",
    sf: "Street Fighter",
    tk: "Tekken",
    gg: "Guilty Gear",
    bb: "BlazBlue",
    uni: "Under Night In-Birth",
  };
  return gameNames[slug] || slug;
}

function ChatPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      <div className="lg:col-span-1">
        <div className="h-full bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="lg:col-span-3">
        <div className="h-full bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { gameSlug } = await params;

  // Validate game slug
  if (!["mk", "sf", "tk", "gg", "bb", "uni"].includes(gameSlug)) {
    notFound();
  }

  const game = await getGame(gameSlug);
  if (!game) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {game.fullName} Chat
        </h1>
        <p className="text-gray-600 mt-2">
          Connect with other {game.fullName} players in real-time
        </p>
      </div>

      <Suspense fallback={<ChatPageSkeleton />}>
        <ChatInterface gameSlug={gameSlug as GameSlug} />
      </Suspense>
    </div>
  );
}
