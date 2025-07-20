import Link from "next/link";
import { notFound } from "next/navigation";

interface GamePageProps {
  params: Promise<{
    gameSlug: string;
  }>;
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

    return game;
  } catch (error) {
    console.error("Error fetching game:", error);
    return null;
  }
}

// Colors for game pages
const gameColors = [
  "bg-red-600",
  "bg-blue-600",
  "bg-purple-600",
  "bg-green-600",
  "bg-indigo-600",
  "bg-pink-600",
];

export default async function GamePage({ params }: GamePageProps) {
  const { gameSlug } = await params;

  const game = await getGame(gameSlug);
  if (!game) {
    notFound();
  }

  // Generate features based on the game
  const features = [
    {
      title: "Tournaments",
      description: `Join ${game.name} tournaments and compete`,
      icon: "🏆",
      href: `/${gameSlug}/events`,
    },
    {
      title: "Matchmaking",
      description: `Find ${game.name} players to play with`,
      icon: "👥",
      href: `/${gameSlug}/matchmaking`,
    },
    {
      title: "News",
      description: `Latest ${game.name} news and updates`,
      icon: "📰",
      href: `/${gameSlug}/news`,
    },
    {
      title: "Forum",
      description: `Discuss ${game.name} strategies and tips`,
      icon: "💬",
      href: `/${gameSlug}/forum`,
    },
  ];

  // Use a color based on the game slug (fallback to first color)
  const colorIndex = gameSlug.charCodeAt(0) % gameColors.length;
  const color = gameColors[colorIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`${color} rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center`}
          >
            <span className="text-4xl font-bold text-white">{game.name}</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            {game.fullName}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {game.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white transition-all duration-300 transform hover:scale-105 hover:bg-white/20"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Community Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Community Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {game._count?.events || 0}
              </div>
              <p className="text-gray-300">Active Events</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {game._count?.newsPosts || 0}
              </div>
              <p className="text-gray-300">News Posts</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {game._count?.forumThreads || 0}
              </div>
              <p className="text-gray-300">Forum Threads</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${gameSlug}/events`}
              className={`${color} text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105`}
            >
              Join Tournament
            </Link>
            <Link
              href={`/${gameSlug}/matchmaking`}
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Find Players
            </Link>
            <Link
              href={`/${gameSlug}/chat`}
              className="bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Join Chat
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-gray-400">
          <p>© 2024 IRFGC - Iranian Fighting Game Community</p>
          <p className="mt-2 text-sm">{game.fullName} Community</p>
        </div>
      </div>
    </div>
  );
}
