"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FollowButton } from "@/components/FollowButton";
import { FollowListUser } from "@/hooks/useFollowList";

interface UserListItemProps {
  user: FollowListUser;
  onFollowStatsChange?: () => void;
}

export function UserListItem({ user, onFollowStatsChange }: UserListItemProps) {
  const router = useRouter();
  const isCurrentUser = user.isCurrentUser;

  const handleUserClick = () => {
    if (!isCurrentUser) {
      router.push(`/@${user.username}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <Avatar
          className={`h-10 w-10 ${isCurrentUser ? "" : "cursor-pointer"}`}
          onClick={isCurrentUser ? undefined : handleUserClick}
        >
          <AvatarImage src={user.avatar || undefined} alt={user.name} />
          <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div
            className={`flex flex-col ${isCurrentUser ? "" : "cursor-pointer"}`}
            onClick={isCurrentUser ? undefined : handleUserClick}
          >
            <span className="font-medium text-gray-900 truncate">
              {isCurrentUser ? "You" : user.name}
            </span>
            {!isCurrentUser && (
              <span className="text-sm text-gray-500 truncate">
                @{user.username}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 ml-3">
        <FollowButton
          targetUserId={user.id}
          onFollowStatsChange={onFollowStatsChange}
        />
      </div>
    </div>
  );
}
