"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Game, GameSlug } from "@/types";

interface GameContextType {
  currentGame: Game | null;
  gameSlug: GameSlug | null;
  isLoading: boolean;
  setGameSlug: (slug: GameSlug) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Mock games data - will be replaced with API calls
const GAMES_DATA: Record<GameSlug, Game> = {
  mk: {
    id: "1",
    slug: "mk",
    name: "MK",
    fullName: "Mortal Kombat",
    description: "Mortal Kombat community for Iranian players",
    imageUrl: "/images/games/mk.jpg",
    isActive: true,
    discordUrl: "https://discord.gg/irfgc-mk",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  sf: {
    id: "2",
    slug: "sf",
    name: "SF",
    fullName: "Street Fighter",
    description: "Street Fighter community for Iranian players",
    imageUrl: "/images/games/sf.jpg",
    isActive: true,
    discordUrl: "https://discord.gg/irfgc-sf",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  tk: {
    id: "3",
    slug: "tk",
    name: "TK",
    fullName: "Tekken",
    description: "Tekken community for Iranian players",
    imageUrl: "/images/games/tk.jpg",
    isActive: true,
    discordUrl: "https://discord.gg/irfgc-tk",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  gg: {
    id: "4",
    slug: "gg",
    name: "GG",
    fullName: "Guilty Gear",
    description: "Guilty Gear community for Iranian players",
    imageUrl: "/images/games/gg.jpg",
    isActive: true,
    discordUrl: "https://discord.gg/irfgc-gg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  bb: {
    id: "5",
    slug: "bb",
    name: "BB",
    fullName: "BlazBlue",
    description: "BlazBlue community for Iranian players",
    imageUrl: "/images/games/bb.jpg",
    isActive: true,
    discordUrl: "https://discord.gg/irfgc-bb",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  uni: {
    id: "6",
    slug: "uni",
    name: "UNI",
    fullName: "Under Night In-Birth",
    description: "Under Night In-Birth community for Iranian players",
    imageUrl: "/images/games/uni.jpg",
    isActive: true,
    discordUrl: "https://discord.gg/irfgc-uni",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [gameSlug, setGameSlug] = useState<GameSlug | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detect game from subdomain or URL
    const detectGameFromUrl = () => {
      if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        const subdomain = hostname.split(".")[0];

        // Check if subdomain is a valid game slug
        if (subdomain && subdomain in GAMES_DATA) {
          return subdomain as GameSlug;
        }

        // Check URL path for game slug
        const pathSegments = window.location.pathname.split("/");
        const pathGameSlug = pathSegments[1];
        if (pathGameSlug && pathGameSlug in GAMES_DATA) {
          return pathGameSlug as GameSlug;
        }
      }

      return null;
    };

    const detectedGame = detectGameFromUrl();
    if (detectedGame) {
      setGameSlug(detectedGame);
      setCurrentGame(GAMES_DATA[detectedGame]);
    }

    setIsLoading(false);
  }, []);

  const handleSetGameSlug = (slug: GameSlug) => {
    setGameSlug(slug);
    setCurrentGame(GAMES_DATA[slug]);
  };

  return (
    <GameContext.Provider
      value={{
        currentGame,
        gameSlug,
        isLoading,
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
