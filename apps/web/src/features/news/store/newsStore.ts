import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { NewsPost, GameSlug } from "@/types";

// Interface for the news store state
interface NewsStoreState {
  articles: NewsPost[];
  featuredArticles: NewsPost[];
  currentPage: number;
  scrollY: number;
  gameSlug: GameSlug | null;
  hasMore: boolean;
  loading: boolean;
  featuredLoading: boolean;
  error: string;
  featuredError: string;
}

// Default state
const defaultState: NewsStoreState = {
  articles: [],
  featuredArticles: [],
  currentPage: 1,
  scrollY: 0,
  gameSlug: null,
  hasMore: true,
  loading: false,
  featuredLoading: false,
  error: "",
  featuredError: "",
};

// Create persistent atoms with sessionStorage
export const newsStoreAtom = atomWithStorage<NewsStoreState>(
  "irfgc-news-store",
  defaultState,
  {
    getItem: (key) => {
      if (typeof window === "undefined") return defaultState;
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultState;
      } catch {
        return defaultState;
      }
    },
    setItem: (key, value) => {
      if (typeof window === "undefined") return;
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Ignore storage errors
      }
    },
    removeItem: (key) => {
      if (typeof window === "undefined") return;
      try {
        sessionStorage.removeItem(key);
      } catch {
        // Ignore storage errors
      }
    },
  }
);

// Derived atoms for specific state slices
export const articlesAtom = atom(
  (get) => get(newsStoreAtom).articles,
  (get, set, articles: NewsPost[]) => {
    set(newsStoreAtom, { ...get(newsStoreAtom), articles });
  }
);

export const featuredArticlesAtom = atom(
  (get) => get(newsStoreAtom).featuredArticles,
  (get, set, featuredArticles: NewsPost[]) => {
    set(newsStoreAtom, { ...get(newsStoreAtom), featuredArticles });
  }
);

export const currentPageAtom = atom(
  (get) => get(newsStoreAtom).currentPage,
  (get, set, currentPage: number) => {
    set(newsStoreAtom, { ...get(newsStoreAtom), currentPage });
  }
);

export const scrollYAtom = atom(
  (get) => get(newsStoreAtom).scrollY,
  (get, set, scrollY: number) => {
    set(newsStoreAtom, { ...get(newsStoreAtom), scrollY });
  }
);

export const gameSlugAtom = atom(
  (get) => get(newsStoreAtom).gameSlug,
  (get, set, gameSlug: GameSlug | null) => {
    set(newsStoreAtom, { ...get(newsStoreAtom), gameSlug });
  }
);

export const hasMoreAtom = atom(
  (get) => get(newsStoreAtom).hasMore,
  (get, set, hasMore: boolean) => {
    set(newsStoreAtom, { ...get(newsStoreAtom), hasMore });
  }
);

export const loadingAtom = atom(
  (get) => get(newsStoreAtom).loading,
  (get, set, loading: boolean) => {
    set(newsStoreAtom, { ...get(newsStoreAtom), loading });
  }
);

export const featuredLoadingAtom = atom(
  (get) => get(newsStoreAtom).featuredLoading,
  (get, set, featuredLoading: boolean) => {
    set(newsStoreAtom, { ...get(newsStoreAtom), featuredLoading });
  }
);

export const errorAtom = atom(
  (get) => get(newsStoreAtom).error,
  (get, set, error: string) => {
    set(newsStoreAtom, { ...get(newsStoreAtom), error });
  }
);

export const featuredErrorAtom = atom(
  (get) => get(newsStoreAtom).featuredError,
  (get, set, featuredError: string) => {
    set(newsStoreAtom, { ...get(newsStoreAtom), featuredError });
  }
);

// Action atoms for common operations
export const addArticlesAtom = atom(
  null,
  (get, set, newArticles: NewsPost[]) => {
    const currentArticles = get(articlesAtom);
    const existingIds = new Set(currentArticles.map((article) => article.id));
    const uniqueNewArticles = newArticles.filter(
      (article) => !existingIds.has(article.id)
    );
    set(articlesAtom, [...currentArticles, ...uniqueNewArticles]);
  }
);

export const setArticlesAtom = atom(null, (get, set, articles: NewsPost[]) => {
  set(articlesAtom, articles);
});

export const incrementPageAtom = atom(null, (get, set) => {
  const currentPage = get(currentPageAtom);
  set(currentPageAtom, currentPage + 1);
});

export const resetStoreAtom = atom(
  null,
  (get, set, gameSlug?: GameSlug | null) => {
    set(newsStoreAtom, {
      ...defaultState,
      gameSlug: gameSlug ?? null,
    });
  }
);

export const saveScrollPositionAtom = atom(null, (get, set) => {
  if (typeof window !== "undefined") {
    set(scrollYAtom, window.scrollY);
  }
});

export const restoreScrollPositionAtom = atom(null, (get, set) => {
  const scrollY = get(scrollYAtom);
  if (typeof window !== "undefined" && scrollY > 0) {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
    // Clear the saved scroll position after restoring
    set(scrollYAtom, 0);
  }
});
