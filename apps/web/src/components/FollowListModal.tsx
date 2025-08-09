"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, UserCheck, UserPlus } from "lucide-react";
import { useFollowList } from "@/hooks/useFollowList";
import { useFollowStats } from "@/hooks/useFollowStats";
import { UserListItem } from "@/components/UserListItem";
import { LoginPromptModal } from "@/components/LoginPromptModal";

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  initialTab?: "mutual" | "followers" | "following";
}

export function FollowListModal({
  isOpen,
  onClose,
  targetUserId,
  initialTab = "followers",
}: FollowListModalProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Get follow stats to show in tab labels
  const { stats } = useFollowStats({ targetUserId });

  // Separate hooks for each tab type
  const followersQuery = useFollowList({
    userId: targetUserId,
    type: "followers",
    enabled: isOpen && activeTab === "followers",
  });

  const followingQuery = useFollowList({
    userId: targetUserId,
    type: "following",
    enabled: isOpen && activeTab === "following",
  });

  const mutualQuery = useFollowList({
    userId: targetUserId,
    type: "mutual",
    enabled: isOpen && activeTab === "mutual" && !!session?.user?.id,
  });

  // Get the current query based on active tab
  const getCurrentQuery = () => {
    switch (activeTab) {
      case "followers":
        return followersQuery;
      case "following":
        return followingQuery;
      case "mutual":
        return mutualQuery;
      default:
        return followersQuery;
    }
  };

  const currentQuery = getCurrentQuery();

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === "mutual" && !session?.user?.id) {
      setShowLoginModal(true);
      return;
    }
    setActiveTab(value as "mutual" | "followers" | "following");
  };

  // Intersection Observer for lazy loading
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (
        target.isIntersecting &&
        !currentQuery.isLoading &&
        currentQuery.hasMore
      ) {
        currentQuery.loadMore();
      }
    },
    [currentQuery.isLoading, currentQuery.hasMore, currentQuery.loadMore]
  );

  // Set up Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  // Handle follow stats change (refresh stats when someone follows/unfollows)
  const handleFollowStatsChange = useCallback(() => {
    // Refresh all queries to update counts
    followersQuery.refresh();
    followingQuery.refresh();
    if (session?.user?.id) {
      mutualQuery.refresh();
    }
  }, [followersQuery, followingQuery, mutualQuery, session?.user?.id]);

  // Calculate mutual count for display (only if authenticated)
  const mutualCount = session?.user?.id
    ? mutualQuery.pagination?.total || 0
    : 0;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Connections
            </DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="flex-1 flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mutual" className="flex items-center gap-1">
                <UserCheck className="h-4 w-4" />
                Mutual ({session?.user?.id ? mutualCount : "—"})
              </TabsTrigger>
              <TabsTrigger
                value="followers"
                className="flex items-center gap-1"
              >
                <UserPlus className="h-4 w-4" />
                Followers ({stats.followerCount})
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="flex items-center gap-1"
              >
                <Users className="h-4 w-4" />
                Following ({stats.followingCount})
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-4 overflow-hidden">
              <TabsContent
                value="mutual"
                className="h-full data-[state=active]:flex flex-col"
              >
                {!session?.user?.id ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center p-6">
                      <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Sign in to see mutual connections
                      </p>
                    </div>
                  </div>
                ) : (
                  <UserList
                    query={mutualQuery}
                    onFollowStatsChange={handleFollowStatsChange}
                  />
                )}
              </TabsContent>

              <TabsContent
                value="followers"
                className="h-full data-[state=active]:flex flex-col"
              >
                <UserList
                  query={followersQuery}
                  onFollowStatsChange={handleFollowStatsChange}
                />
              </TabsContent>

              <TabsContent
                value="following"
                className="h-full data-[state=active]:flex flex-col"
              >
                <UserList
                  query={followingQuery}
                  onFollowStatsChange={handleFollowStatsChange}
                />
              </TabsContent>
            </div>
          </Tabs>

          {/* Intersection Observer element for lazy loading */}
          {currentQuery.hasMore && <div ref={observerRef} className="h-4" />}
        </DialogContent>
      </Dialog>

      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        action="custom"
        customTitle="Sign in to view mutual connections"
        customMessage="You need to be signed in to see users you both follow."
      />
    </>
  );
}

// Helper component for rendering user lists
interface UserListProps {
  query: ReturnType<typeof useFollowList>;
  onFollowStatsChange: () => void;
}

function UserList({ query, onFollowStatsChange }: UserListProps) {
  const { users, isLoading, error, hasMore } = query;

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-red-600">Error: {error}</p>
          <Button onClick={query.refresh} variant="outline" className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (users.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-6">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No users found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-1">
        {users.map((user) => (
          <UserListItem
            key={user.id}
            user={user}
            onFollowStatsChange={onFollowStatsChange}
          />
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {/* Load more button (fallback for manual loading) */}
      {!hasMore && users.length > 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No more users to load</p>
        </div>
      )}
    </div>
  );
}
