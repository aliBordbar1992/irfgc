"use client";

import Link from "next/link";
import { useGames } from "@/hooks/useGames";

// Colors for game cards
const gameColors = [
  "bg-red-600 hover:bg-red-700",
  "bg-blue-600 hover:bg-blue-700",
  "bg-purple-600 hover:bg-purple-700",
  "bg-green-600 hover:bg-green-700",
  "bg-indigo-600 hover:bg-indigo-700",
  "bg-pink-600 hover:bg-pink-700",
];

export default function HomePage() {
  const { games } = useGames({ isActive: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">IRFGC</h1>
          <p className="text-xl text-gray-300 mb-8">
            Iranian Fighting Game Community
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Unite Iran&apos;s FGC with centralized infrastructure and
            game-specific communities. Join tournaments, find matches, and
            connect with fellow players.
          </p>
        </div>

        {/* Game Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {games.map((game, index) => (
            <Link
              key={game.slug}
              href={`/${game.slug}`}
              className={`${
                gameColors[index % gameColors.length]
              } rounded-lg p-6 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl`}
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">{game.name}</h2>
                <h3 className="text-lg font-semibold mb-3">{game.fullName}</h3>
                <p className="text-gray-200">{game.description}</p>
                <div className="mt-4 text-sm opacity-80">
                  Click to enter community →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Features */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Tournaments
              </h3>
              <p className="text-gray-300">
                Join online and offline tournaments, track your progress, and
                compete with the best.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Matchmaking
              </h3>
              <p className="text-gray-300">
                Find players in your region, platform, and skill level for
                casual matches.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Community
              </h3>
              <p className="text-gray-300">
                Discuss strategies, share news, and connect with fellow fighting
                game enthusiasts.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-gray-400">
          <p>© 2024 IRFGC - Iranian Fighting Game Community</p>
          <p className="mt-2 text-sm">Built with ❤️ for Iran&apos;s FGC</p>
        </div>
      </div>
    </div>
  );
}
