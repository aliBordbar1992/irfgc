import { notFound } from "next/navigation";

interface GameLayoutProps {
  children: React.ReactNode;
  params: {
    gameSlug: string;
  };
}

export default async function GameLayout({
  children,
  params,
}: GameLayoutProps) {
  const { gameSlug } = await params;

  // Validate game slug
  const validGames = ["mk", "sf", "tk", "gg", "bb", "uni"];
  if (!validGames.includes(gameSlug)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
