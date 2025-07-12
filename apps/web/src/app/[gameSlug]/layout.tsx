import Link from "next/link";
import { notFound } from "next/navigation";
import { UserMenu } from "@/components/UserMenu";

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
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                IRFGC
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-lg font-semibold text-gray-700 capitalize">
                {gameSlug}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href={`/${gameSlug}`}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href={`/${gameSlug}/events`}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Events
              </Link>
              <Link
                href={`/${gameSlug}/news`}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                News
              </Link>
              <Link
                href={`/${gameSlug}/matchmaking`}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                LFG
              </Link>
              <Link
                href={`/${gameSlug}/forum`}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Forum
              </Link>
              <Link
                href={`/${gameSlug}/chat`}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Chat
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
