# 04 — Component Implementation Guide

Prefer extending existing feature modules. New shared chrome lives under `apps/web/src/components/`. Domain-specific redesigns stay in `apps/web/src/features/`.

## Shared chrome

### `BrandMark` (new)

- **Responsibility:** Arcade lime bars + IRFGC wordmark + optional EN/FA definition.
- **Props:** `showDefinition?: boolean`, `size?: 'sm' | 'md' | 'lg'`, `href?: string` (default `/`).
- **Integrate:** GlobalNav, Footer, auth pages.
- **Replace:** plain “IRFGC” text link in `MainNav`.

### `GlobalNav` (rewrite `MainNav` or replace)

- **Responsibility:** Top chrome for public app; guest vs session actions; optional game-scoped links.
- **Deps:** `useSession`, `useGames`, `GameContext`, `UserMenu`.
- **States:** guest | signed-in | game-scoped.
- **Do not:** render admin dashboard nav here (dashboard has own layout).
- **Reqs:** FOUND-04…07.

### `SiteFooter` (new)

- **Responsibility:** © line + FA tagline; border-top.
- **Reqs:** FOUND-08.

### Theme tokens

- Extend `globals.css` with IRFGC dark semantic variables (see FOUND-01).
- Prefer applying dark class on public shell or remap `:root` for public app.
- Keep shadcn primitives working via CSS variables.

## Hub (`/`)

### `HomePage` (`app/page.tsx`)

- Compose: GlobalNav (layout), Orientation, GameCommunitiesGrid, Pillars, Footer.
- Data: `useGames({ isActive: true })`.
- States: loading skeleton, empty, populated, (later signed-in chrome via session).

### `GameCommunityCard` (new)

- **Props:** `slug`, `shortName`, `fullName`, `description`, `imageSrc`, `href`.
- **Behavior:** whole card clickable → `/${slug}` (HUB-05/06).
- **Styling:** art background, gradient overlay, lime CTA.

### `HubPillars` (new)

- Three static pillars with icons (messages / gamepad / trophy). Content from HUB-07.

## Game home

| Component | Notes |
|-----------|-------|
| `GameHubPage` | Replace `[gameSlug]/page.tsx` composition |
| `ActivityEntry` | Portal tile linking to activity destinations |
| `EventPreview` | Sample/upcoming event card |
| `LfgRequestPreview` | LFG sample row |
| `ForumRow` | Forum topic row |
| `QuietPanel` | Zero-activity honesty (GAME-03) |
| `UnavailableCommunity` | GAME-04 |

Reuse existing events/news/lfg/forum fetch hooks where possible; do not invent counters.

## News

| Component | Change |
|-----------|--------|
| `NewsList` | Scope chips, progressive loading contract NEWS-05 |
| `FeaturedNewsCard` / `NewsListItem` | Restyle; optional thumbnail |
| Article page | Breadcrumb, login gate, view track, reactions |
| Empty/Error states | Dedicated components or inline states |

Preserve `ViewTracker` semantics (NEWS-08).

## Posts

| Component | Change |
|-----------|--------|
| `PostsList` | Align infinite scroll with POST-02 |
| `PostItem` | Dark card chrome; share; edited badge |
| `CreatePostDialog` | Validation POST-03…05 |
| `PostImages` / `ImageLightbox` | Collage + lightbox POST-06 |
| `PostVideos` | Single active player POST-07 |

Do not introduce game filters on posts.

## Profile

| Component | Change |
|-----------|--------|
| `PublicProfileContent` | Identity, 9 stats, posts + activity rail |
| `ProfileContent` | Private tabs: overview, edit, posts, comments, notifications, follow inbox |
| `FollowButton` / `FollowRequests` | State machine PROF-06…11 |
| `ProfileStats` | Nine counts |
| `FollowListModal` | Connections overlay/sheet |

Reuse `PostsList` with author scope.

## Integration rules

1. Do not rewrite API routes unless a requirement cannot be met otherwise.
2. Prefer Persian microcopy from Figma; keep English brand/game names as designed.
3. When restyling, keep accessibility: focus rings, labels, keyboard lightbox.
4. Download Figma MCP assets into `apps/web/public/ui/...` before shipping.

## Styling conventions

- Use CSS variables / Tailwind theme tokens, not one-off hex scatter (except asset-specific gradients).
- Radius ~8–12px per design cards.
- Primary interactive text/icons: accent lime `#c7f878`.
- Error text: `#f0a49c`.
