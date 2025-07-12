import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GameSlug } from "@/types";
import { prisma } from "@/lib/prisma";
import { NewsList } from "@/features/news/NewsList";
import { CreateNewsButton } from "@/features/news/CreateNewsButton";

interface NewsPageProps {
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

export default async function NewsPage({ params }: NewsPageProps) {
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {game.fullName} News
          </h1>
          <p className="text-gray-600 mt-2">
            Latest updates, announcements, and community news
          </p>
        </div>
        <CreateNewsButton gameSlug={gameSlug as GameSlug} />
      </div>

      <Suspense fallback={<NewsListSkeleton />}>
        <NewsList gameSlug={gameSlug as GameSlug} />
      </Suspense>
    </div>
  );
}

function NewsListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-6 shadow-sm border animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
