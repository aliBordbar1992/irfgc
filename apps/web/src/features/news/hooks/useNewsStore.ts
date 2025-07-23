import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { NewsPost, GameSlug } from "@/types";
import {
  articlesAtom,
  featuredArticlesAtom,
  currentPageAtom,
  scrollYAtom,
  gameSlugAtom,
  hasMoreAtom,
  loadingAtom,
  featuredLoadingAtom,
  errorAtom,
  featuredErrorAtom,
  addArticlesAtom,
  setArticlesAtom,
  incrementPageAtom,
  resetStoreAtom,
  saveScrollPositionAtom,
  restoreScrollPositionAtom,
} from "../store/newsStore";

export function useNewsStore() {
  // State atoms
  const articles = useAtomValue(articlesAtom);
  const featuredArticles = useAtomValue(featuredArticlesAtom);
  const currentPage = useAtomValue(currentPageAtom);
  const scrollY = useAtomValue(scrollYAtom);
  const gameSlug = useAtomValue(gameSlugAtom);
  const hasMore = useAtomValue(hasMoreAtom);
  const loading = useAtomValue(loadingAtom);
  const featuredLoading = useAtomValue(featuredLoadingAtom);
  const error = useAtomValue(errorAtom);
  const featuredError = useAtomValue(featuredErrorAtom);

  // Action atoms
  const setArticles = useSetAtom(setArticlesAtom);
  const addArticles = useSetAtom(addArticlesAtom);
  const setFeaturedArticles = useSetAtom(featuredArticlesAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const setScrollY = useSetAtom(scrollYAtom);
  const setGameSlug = useSetAtom(gameSlugAtom);
  const setHasMore = useSetAtom(hasMoreAtom);
  const setLoading = useSetAtom(loadingAtom);
  const setFeaturedLoading = useSetAtom(featuredLoadingAtom);
  const setError = useSetAtom(errorAtom);
  const setFeaturedError = useSetAtom(featuredErrorAtom);
  const incrementPage = useSetAtom(incrementPageAtom);
  const resetStore = useSetAtom(resetStoreAtom);
  const saveScrollPosition = useSetAtom(saveScrollPositionAtom);
  const restoreScrollPosition = useSetAtom(restoreScrollPositionAtom);

  // Helper functions
  const loadMoreArticles = useCallback(
    async (
      newArticles: NewsPost[],
      totalPages: number,
      pageBeingFetched: number
    ) => {
      if (pageBeingFetched === 1) {
        setArticles(newArticles);
      } else {
        addArticles(newArticles);
      }
      setHasMore(pageBeingFetched < totalPages);
    },
    [setArticles, addArticles, setHasMore]
  );

  const handleLoadMore = useCallback(() => {
    console.log("handleLoadMore");
    incrementPage();
  }, [incrementPage]);

  const handleGameChange = useCallback(
    (newGameSlug: GameSlug | null) => {
      if (gameSlug !== newGameSlug) {
        resetStore(newGameSlug);
      }
    },
    [gameSlug, resetStore]
  );

  const handleArticleClick = useCallback(() => {
    saveScrollPosition();
  }, [saveScrollPosition]);

  const handleBackToNews = useCallback(() => {
    restoreScrollPosition();
  }, [restoreScrollPosition]);

  return {
    // State
    articles,
    featuredArticles,
    currentPage,
    scrollY,
    gameSlug,
    hasMore,
    loading,
    featuredLoading,
    error,
    featuredError,

    // Actions
    setArticles,
    addArticles,
    setFeaturedArticles,
    setCurrentPage,
    setScrollY,
    setGameSlug,
    setHasMore,
    setLoading,
    setFeaturedLoading,
    setError,
    setFeaturedError,
    incrementPage,
    resetStore,

    // Helper functions
    loadMoreArticles,
    handleLoadMore,
    handleGameChange,
    handleArticleClick,
    handleBackToNews,
  };
}
