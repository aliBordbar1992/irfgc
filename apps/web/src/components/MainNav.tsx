"use client";

import Link from "next/link";
import { useGame } from "@/features/games/GameContext";
import { UserMenu } from "@/components/UserMenu";
import { BrandMark } from "@/components/BrandMark";
import { useGames } from "@/hooks/useGames";
import { cn } from "@/lib/utils";

export function MainNav() {
  const { currentGame, gameSlug } = useGame();
  const { games } = useGames({ isActive: true });

  return (
    <nav className="border-b border-[var(--irfgc-border)] bg-[var(--irfgc-canvas)]">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-5 sm:h-24 sm:px-12 lg:px-24">
        <div className="flex min-w-0 items-center gap-3">
          <UserMenu />
          {gameSlug && (
            <div className="hidden items-center gap-1 md:flex">
              <NavLink href={`/${gameSlug}`}>خانه</NavLink>
              <NavLink href={`/${gameSlug}/events`}>رویدادها</NavLink>
              <NavLink href={`/${gameSlug}/news`}>خبرها</NavLink>
              <NavLink href={`/${gameSlug}/matchmaking`}>هم‌بازی</NavLink>
              <NavLink href={`/${gameSlug}/forum`}>انجمن</NavLink>
              <NavLink href={`/${gameSlug}/chat`}>چت</NavLink>
            </div>
          )}
          {!gameSlug && (
            <div className="hidden items-center gap-1 lg:flex">
              {games.slice(0, 6).map((game) => (
                <NavLink key={game.slug} href={`/${game.slug}`}>
                  {game.name}
                </NavLink>
              ))}
              <NavLink href="/news">خبرها</NavLink>
              <NavLink href="/posts">پست‌ها</NavLink>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentGame && (
            <span className="hidden max-w-[140px] truncate text-sm text-[var(--irfgc-text-secondary)] xl:inline">
              {currentGame.fullName}
            </span>
          )}
          <BrandMark showDefinition={!gameSlug} />
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-2.5 py-1.5 text-sm text-[var(--irfgc-text-secondary)] transition-colors hover:bg-[var(--irfgc-surface)] hover:text-[var(--irfgc-text-primary)]",
        className
      )}
    >
      {children}
    </Link>
  );
}
