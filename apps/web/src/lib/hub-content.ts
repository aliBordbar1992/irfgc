/**
 * Hub presentation copy and art keyed by the app's canonical short slugs
 * (seed: mk, sf, tk, gg, bb, uni). Figma handoff long-form slugs are aliases
 * documented in docs/ui-redesign — routing uses short slugs today.
 */

export const HUB_GAME_PRESENTATION: Record<
  string,
  { imageSrc: string; blurbFa: string; displayTitle: string }
> = {
  tk: {
    displayTitle: "Tekken",
    imageSrc: "/ui/hub/tekken.jpg",
    blurbFa: "جمع بازیکنان تکن؛ برای یاد گرفتن مچ‌آپ‌ها، تمرین و رقابت.",
  },
  sf: {
    displayTitle: "Street Fighter",
    imageSrc: "/ui/hub/street-fighter.jpg",
    blurbFa: "جمع بازیکنان استریت فایتر؛ برای تمرین، رقابت و پیدا کردن هم‌بازی.",
  },
  mk: {
    displayTitle: "Mortal Kombat",
    imageSrc: "/ui/hub/mortal-kombat.jpg",
    blurbFa: "جمع بازیکنان مورتال کامبت؛ برای مبارزه، تمرین و گفتگو دربارهٔ بازی.",
  },
  uni: {
    displayTitle: "Under Night In-Birth",
    imageSrc: "/ui/hub/under-night.jpg",
    blurbFa: "جمع بازیکنان آندر نایت؛ برای تمرین، پیدا کردن هم‌بازی و رقابت.",
  },
  bb: {
    displayTitle: "BlazBlue",
    imageSrc: "/ui/hub/blazblue.jpg",
    blurbFa: "جمع بازیکنان بلیزبلو؛ برای شناخت شخصیت‌ها، تمرین و پیدا کردن هم‌بازی.",
  },
  gg: {
    displayTitle: "Guilty Gear",
    imageSrc: "/ui/hub/guilty-gear.jpg",
    blurbFa: "جمع بازیکنان گیلتی گیر؛ برای تمرین کمبوها، رقابت و گفتگو.",
  },
};

/** Preferred card order matching Figma hub row layout */
export const HUB_GAME_ORDER = ["tk", "sf", "mk", "uni", "bb", "gg"] as const;

export function getHubPresentation(slug: string) {
  return (
    HUB_GAME_PRESENTATION[slug] ?? {
      displayTitle: slug,
      imageSrc: "/ui/hub/mortal-kombat.jpg",
      blurbFa: "",
    }
  );
}

export function sortGamesForHub<T extends { slug: string }>(games: T[]): T[] {
  const rank = new Map(HUB_GAME_ORDER.map((slug, i) => [slug, i]));
  return [...games].sort((a, b) => {
    const ra = rank.get(a.slug as (typeof HUB_GAME_ORDER)[number]) ?? 99;
    const rb = rank.get(b.slug as (typeof HUB_GAME_ORDER)[number]) ?? 99;
    return ra - rb;
  });
}
