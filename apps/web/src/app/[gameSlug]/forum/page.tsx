import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GameSlug } from "@/types";
import { prisma } from "@/lib/prisma";
import { ForumList } from "@/features/forum/ForumList";
import { CreateThreadButton } from "@/features/forum/CreateThreadButton";

interface ForumPageProps {
  params: Promise<{
    gameSlug: string;
  }>;
}

async function getGame(gameSlug: string) {
  const game = await prisma.game.findUnique({
    where: { slug: gameSlug },
  });
  return game;
}

export default async function ForumPage({ params }: ForumPageProps) {
  const { gameSlug } = await params;

  // Validate game slug - we'll let the API handle validation

  const game = await getGame(gameSlug);
  if (!game) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {game.fullName} Forum
          </h1>
          <p className="text-gray-600 mt-2">
            Discuss strategies, share experiences, and connect with the
            community
          </p>
        </div>
        <CreateThreadButton gameSlug={gameSlug as GameSlug} />
      </div>

      <Suspense fallback={<ForumListSkeleton />}>
        <ForumList gameSlug={gameSlug as GameSlug} />
      </Suspense>
    </div>
  );
}

function ForumListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-4 shadow-sm border animate-pulse">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-6 shadow-sm border animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
