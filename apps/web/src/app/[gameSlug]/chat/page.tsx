import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GameSlug } from "@/types";
import { ChatInterface } from "@/features/chat/ChatInterface";

interface ChatPageProps {
  params: Promise<{ gameSlug: string }>;
}

async function getGame(gameSlug: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/games?slug=${gameSlug}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const game = data.data?.[0];

    if (!game) {
      return null;
    }

    return {
      id: game.id,
      slug: game.slug,
      name: game.name,
      fullName: game.fullName,
    };
  } catch (error) {
    console.error("Error fetching game:", error);
    return null;
  }
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

  // Validate game slug - we'll let the API handle validation

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
