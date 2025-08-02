import { notFound } from "next/navigation";

interface GameLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    gameSlug: string;
  }>;
}

async function validateGame(gameSlug: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/games?slug=${gameSlug}`
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.data && data.data.length > 0;
  } catch (error) {
    console.error("Error validating game:", error);
    return false;
  }
}

export default async function GameLayout({
  children,
  params,
}: GameLayoutProps) {
  const { gameSlug } = await params;

  // Validate game slug through API
  const isValidGame = await validateGame(gameSlug);
  if (!isValidGame) {
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
