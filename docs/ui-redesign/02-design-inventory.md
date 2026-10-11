# 02 — Design Inventory

Canonical Page 1 top-level frames: [figma-page1-frames.tsv](./figma-page1-frames.tsv) (93 frames).

## Domain groups (Page 1)

### A. Global hub — IRFGC

| Node | Name | Viewport | App target |
|------|------|----------|------------|
| `3:8315` | Default guest | Desktop | `/` guest |
| `3:8458` | Default guest | Mobile | `/` guest |
| `3:8597` | Default signed-in | Desktop | `/` session |
| `3:8741` | Default signed-in | Mobile | `/` session |
| `3:8880` | Empty guest | Desktop | `/` no games |
| `3:8942` | Empty guest | Mobile | `/` no games |
| `3:9002` | Loading guest | Desktop | `/` loading |
| `3:9122` | Loading guest | Mobile | `/` loading |
| `15:13040` | Unavailable community | Desktop | unknown/inactive slug |
| `15:13073` | Unavailable community | Mobile | unknown/inactive slug |
| `3:9253` | Game entry Persian handoff | Spec | nav metadata (not UI) |

### B. Game community home — Mortal Kombat sample

| Node | Name | App target |
|------|------|------------|
| `15:11815` / `15:12046` | Guest populated D/M | `/[gameSlug]` guest |
| `15:12272` / `15:12501` | Signed-in populated D/M | `/[gameSlug]` member |
| `15:12724` / `15:12884` | Quiet guest D/M | empty activity state |
| `15:13163` | Scope 4 Persian rationale | Spec (not UI) |

### C. News

| Node | Name | App target |
|------|------|------------|
| `22:17008` / `22:17263` | All News guest populated | `/news` |
| `22:17502` / `22:17636` | MK News guest populated | `/mortal-kombat/news` or alias |
| `22:17754`…`22:18133` | Article detail guest/signed-in | `/news/[id]` |
| `22:18255`…`22:18750` | Loading / empty / error / not found | edge states |
| `22:18781` | Persian behavior specification | Spec |

### D. Posts

| Node | Name | App target |
|------|------|------------|
| `26:24783`…`26:25536` | Global guest/member feeds | `/posts` |
| `26:25536`…`26:26141` | Author / My Posts tabs | profile tabs |
| `26:26141`…`26:26475` | Create / Edit | dialogs |
| `26:26475`…`26:27059` | Comments / lightbox / delete | overlays |
| `26:27367`…`26:27474` | Empty / error | edge states |
| `26:27509` / `26:27949` | Media and interaction patterns | Spec patterns |
| `26:28389` | Persian specification | Spec |

### E. Profile

| Node | Name | App target |
|------|------|------------|
| `40:1366`…`40:2107` | Arman public guest / pending | `/users/arman` |
| `40:2352`…`40:2571` | Sara public self view | own public profile |
| `40:2787`…`40:4143` | Private overview, edit, posts, comments, notifications, follow inbox | `/profile` |
| `40:4143`…`40:4249` | Connections overlay/sheet | follow lists |
| `40:4359`…`40:4627` | Empty / not found | edge |
| `40:4655` / `40:4940` | Relationship form and system patterns | Spec patterns |
| `40:5225` | Persian product specification | Spec |

## Mapping: Figma → existing code

| Design surface | Existing route/component | Disposition |
|----------------|--------------------------|-------------|
| Global navigation | `MainNav.tsx`, `UserMenu.tsx` | **Replace/extend** — dark RTL chrome, brand mark, FA labels |
| Hub page | `app/page.tsx` | **Replace** layout/copy; keep `useGames` |
| Game community card | inline in `page.tsx` | **Create** `GameCommunityCard` |
| Game hub | `app/[gameSlug]/page.tsx` | **Replace** with portal+preview composition |
| News list/detail | `features/news/*`, `app/news/*` | **Restyle + behavior** per News spec |
| Posts feed/item | `features/posts/*` | **Restyle + align** with Posts spec (much already exists) |
| Public profile | `PublicProfileContent.tsx` | **Restyle + align** with Profile spec |
| Private profile | `ProfileContent.tsx` etc. | **Restyle + align** |
| Login gate | `LoginPromptModal.tsx` | **Retain logic**, restyle copy/chrome |
| ui primitives | `components/ui/*` | **Retain**; theme tokens shift to dark IRFGC |
| Dashboard | `app/dashboard/*` | **Defer** visual redesign |

## Create vs retain

### Create (new shared components)

- `BrandMark` / wordmark block
- `GlobalNav` (or heavily rewrite `MainNav`)
- `GameCommunityCard`
- `HubOrientation` / pillars section
- Game hub: ActivityEntry, EventPreview, LfgRequestPreview, ForumRow, QuietPanel (per Scope 4)
- Design tokens module / CSS variables for IRFGC dark theme
- Font loading (Vazirmatn + Inter)

### Extend

- PostsList infinite scroll, Reactions optimistic UI, Comments, ImageLightbox, FollowButton state machine
- NewsList progressive loading boundaries
- Profile stats (9 counts), follow inbox

### Retain without redesign (this program)

- Dashboard admin UI
- Chat/Forum/Events/LFG full destination pages (entry previews on hub only)

## Specification frames (non-rendered)

These must drive requirements but **must not** ship as pages:

- `3:9253` Game entry handoff
- `15:13163` Scope 4 rationale
- `22:18781` News specification
- `26:27509`, `26:27949`, `26:28389` Posts patterns/spec
- `40:4655`, `40:4940`, `40:5225` Profile patterns/spec

## Ambiguities for inventory

- Page 2 vs Page 1: treat as duplicate until a diff is proven
- Game card art assets: temporary Figma MCP URLs expire in ~7 days — download into `public/` during Phase 1
- Whether `/mk` alias vs `mortal-kombat` slug already matches seed data — verify against Prisma seed / API
