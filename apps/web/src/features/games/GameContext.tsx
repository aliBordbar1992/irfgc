"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Game, GameSlug } from "@/types";
import { useGames } from "@/hooks/useGames";

interface GameContextType {
  currentGame: Game | null;
  gameSlug: GameSlug | null;
  isLoading: boolean;
  setGameSlug: (slug: GameSlug) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [gameSlug, setGameSlug] = useState<GameSlug | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const { games, loading: gamesLoading } = useGames({ isActive: true });

  useEffect(() => {
    if (gamesLoading) return;

    // Detect game from subdomain or URL
    const detectGameFromUrl = () => {
      // Check URL path for game slug first (works on both client and server)
      const pathSegments = pathname.split("/");
      const pathGameSlug = pathSegments[1];
      if (pathGameSlug && games.some((game) => game.slug === pathGameSlug)) {
        return pathGameSlug as GameSlug;
      }

      // Check subdomain only on client side
      if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        const subdomain = hostname.split(".")[0];

        // Check if subdomain is a valid game slug
        if (subdomain && games.some((game) => game.slug === subdomain)) {
          return subdomain as GameSlug;
        }
      }

      return null;
    };

    const detectedGame = detectGameFromUrl();

    if (detectedGame) {
      const game = games.find((g) => g.slug === detectedGame);
      setGameSlug(detectedGame);
      setCurrentGame(game || null);
    } else {
      setGameSlug(null);
      setCurrentGame(null);
    }
    setIsLoading(false);
  }, [pathname, games, gamesLoading]);

  const handleSetGameSlug = (slug: GameSlug) => {
    const game = games.find((g) => g.slug === slug);
    setGameSlug(slug);
    setCurrentGame(game || null);
  };

  return (
    <GameContext.Provider
      value={{
        currentGame,
        gameSlug,
        isLoading: isLoading || gamesLoading,
        setGameSlug: handleSetGameSlug,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
