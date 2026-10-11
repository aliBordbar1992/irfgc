"use client";

import { Users } from "lucide-react";
import { useGames } from "@/hooks/useGames";
import { GameCommunityCard } from "@/components/hub/GameCommunityCard";
import { HubPillars } from "@/components/hub/HubPillars";
import { SiteFooter } from "@/components/SiteFooter";
import { getHubPresentation, sortGamesForHub } from "@/lib/hub-content";

export default function HomePage() {
  const { games, loading, error } = useGames({ isActive: true });
  const ordered = sortGamesForHub(games);

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col bg-[var(--irfgc-canvas)] text-[var(--irfgc-text-primary)]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 sm:px-12 lg:px-24">
        <section className="flex flex-col items-stretch gap-10 pb-9 pt-10 lg:flex-row lg:items-center lg:gap-20">
          <div className="order-2 flex w-full flex-col gap-2 rounded-xl border border-[var(--irfgc-border)] bg-[var(--irfgc-surface)] p-5 lg:order-1 lg:w-[350px] lg:shrink-0">
            <div className="flex items-center gap-2.5">
              <p
                className="flex-1 text-right text-[15px] font-semibold leading-[1.8]"
                dir="auto"
              >
                یک حساب، همهٔ کامیونیتی‌ها
              </p>
              <Users className="size-5 shrink-0 text-[var(--irfgc-accent)]" />
            </div>
            <p
              className="text-right text-[13px] leading-[1.8] text-[var(--irfgc-text-secondary)]"
              dir="auto"
            >
              با یک حساب در جمع بازیکنان هر بازی حضور داشته باش؛ از تازه‌کار تا
              حرفه‌ای.
            </p>
          </div>

          <div className="order-1 flex flex-1 flex-col items-end gap-3 lg:order-2">
            <div className="flex items-center gap-2">
              <p
                className="text-sm font-medium text-[var(--irfgc-accent)]"
                dir="auto"
              >
                یک پلتفرم برای صحنهٔ بازی‌های مبارزه‌ای ایران
              </p>
              <span className="size-1.5 shrink-0 bg-[var(--irfgc-accent)]" />
            </div>
            <h1
              className="w-full text-right text-3xl font-extrabold leading-[1.5] sm:text-[42px]"
              dir="auto"
            >
              بازی‌ات را انتخاب کن.
              <br />
              وارد جمع خودت شو.
            </h1>
            <p
              className="w-full text-right text-[15px] leading-[1.8] text-[var(--irfgc-text-secondary)]"
              dir="auto"
            >
              هر بازی، کامیونیتی خودش را دارد؛ محل دورهمی، پیدا کردن هم‌بازی و
              گفتگو دربارهٔ همان بازی.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-[var(--irfgc-accent-surface)] px-3 py-1 text-xs font-medium text-[var(--irfgc-accent)]" dir="auto">
              {loading
                ? "…"
                : `${ordered.length.toLocaleString("fa-IR")} بازی فعال`}
            </span>
            <h2
              className="text-2xl font-bold text-[var(--irfgc-text-primary)]"
              dir="auto"
            >
              کامیونیتی‌های بازی
            </h2>
          </div>

          {error && (
            <p className="text-right text-sm text-[var(--irfgc-danger)]" dir="auto">
              دریافت فهرست بازی‌ها ناموفق بود. صفحه را تازه کن یا بعداً تلاش کن.
            </p>
          )}

          {loading && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[252px] animate-pulse rounded-xl border border-[var(--irfgc-border)] bg-[var(--irfgc-surface)]"
                />
              ))}
            </div>
          )}

          {!loading && !error && ordered.length === 0 && (
            <div className="rounded-xl border border-[var(--irfgc-border)] bg-[var(--irfgc-surface)] p-8 text-center">
              <p className="text-[var(--irfgc-text-secondary)]" dir="auto">
                در حال حاضر کامیونیتی فعالی برای نمایش نیست.
              </p>
            </div>
          )}

          {!loading && ordered.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ordered.map((game) => {
                const presentation = getHubPresentation(game.slug);
                return (
                  <GameCommunityCard
                    key={game.slug}
                    href={`/${game.slug}`}
                    title={presentation.displayTitle || game.fullName}
                    description={
                      presentation.blurbFa || game.description
                    }
                    imageSrc={presentation.imageSrc || game.imageUrl}
                  />
                );
              })}
            </div>
          )}
        </section>

        <HubPillars />
      </div>

      <SiteFooter />
    </div>
  );
}
