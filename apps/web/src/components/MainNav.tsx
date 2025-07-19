"use client";

import Link from "next/link";
import { useGame } from "@/features/games/GameContext";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { GameSlug } from "@/types";

const GAMES: Array<{
  slug: GameSlug;
  name: string;
  fullName: string;
}> = [
  { slug: "mk", name: "MK", fullName: "Mortal Kombat" },
  { slug: "sf", name: "SF", fullName: "Street Fighter" },
  { slug: "tk", name: "TK", fullName: "Tekken" },
  { slug: "gg", name: "GG", fullName: "Guilty Gear" },
  { slug: "bb", name: "BB", fullName: "BlazBlue" },
  { slug: "uni", name: "UNI", fullName: "Under Night In-Birth" },
];

export function MainNav() {
  const { currentGame, gameSlug } = useGame();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              IRFGC
            </Link>
            {currentGame && (
              <>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-lg font-semibold text-gray-700">
                  {currentGame.fullName}
                </span>
              </>
            )}
          </div>

          {/* Game Navigation */}
          {!gameSlug && (
            <div className="hidden md:flex items-center space-x-1">
              {GAMES.map((game) => (
                <Link key={game.slug} href={`/${game.slug}`}>
                  <Button variant="ghost" size="sm">
                    {game.name}
                  </Button>
                </Link>
              ))}
            </div>
          )}

          {/* Game-specific Navigation */}
          {gameSlug && (
            <div className="hidden md:flex items-center space-x-1">
              <Link href={`/${gameSlug}`}>
                <Button variant="ghost" size="sm">
                  Home
                </Button>
              </Link>
              <Link href={`/${gameSlug}/events`}>
                <Button variant="ghost" size="sm">
                  Events
                </Button>
              </Link>
              <Link href={`/${gameSlug}/news`}>
                <Button variant="ghost" size="sm">
                  News
                </Button>
              </Link>
              <Link href={`/${gameSlug}/matchmaking`}>
                <Button variant="ghost" size="sm">
                  LFG
                </Button>
              </Link>
              <Link href={`/${gameSlug}/forum`}>
                <Button variant="ghost" size="sm">
                  Forum
                </Button>
              </Link>
              <Link href={`/${gameSlug}/chat`}>
                <Button variant="ghost" size="sm">
                  Chat
                </Button>
              </Link>
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
