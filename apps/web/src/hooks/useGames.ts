import { useState, useEffect } from "react";
import { Game } from "@/types";

interface UseGamesOptions {
  isActive?: boolean;
  slug?: string;
}

export function useGames(options: UseGamesOptions = {}) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (options.isActive !== undefined) {
          params.append("isActive", options.isActive.toString());
        }
        if (options.slug) {
          params.append("slug", options.slug);
        }

        const response = await fetch(`/api/games?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }

        const data = await response.json();
        setGames(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch games");
        console.error("Error fetching games:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [options.isActive, options.slug]);

  return { games, loading, error };
}
