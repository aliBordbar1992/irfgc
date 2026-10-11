# 03 — Requirements Catalog

Status values: `planned` | `in_progress` | `implemented` | `verified` | `blocked` | `deferred` | `out_of_scope`

Categories: `visual` | `behavior` | `content` | `responsive` | `constraint` | `data`

Update statuses in this file when work completes. Link phases/tasks in [05-roadmap.md](./05-roadmap.md) and [06-progress.md](./06-progress.md).

---

## FOUND — Foundations / chrome

| ID | Description | Cat | Source | Target | Phase | Status |
|----|-------------|-----|--------|--------|-------|--------|
| FOUND-01 | Dark canvas theme: `#0c1014` background, surface `#151b22`, border `#2b3642`, accent `#c7f878` | visual | `3:8315` | tokens/globals | 1 | implemented |
| FOUND-02 | Load Vazirmatn (Persian UI) + Inter (EN/brand); apply on `body` | visual | `3:8315` code | layout fonts | 1 | implemented |
| FOUND-03 | RTL layout with logical properties; avoid LTR-only spacing | responsive | root + design | global | 1 | implemented |
| FOUND-04 | Global nav height ~96px desktop / ~80px mobile; brand right, auth left in RTL | visual | `3:8315` | MainNav | 1 | implemented |
| FOUND-05 | Brand: arcade lime mark + IRFGC wordmark + EN/FA definition lines | visual/content | `3:8315` | Brand | 1 | implemented |
| FOUND-06 | Guest actions: ثبت‌نام (outlined), ورود (text) | content/behavior | `3:8315` | UserMenu/nav | 1 | implemented |
| FOUND-07 | Signed-in nav uses account menu (profile links, sign out); staff dashboard via role menu | behavior | Profile/News specs | UserMenu | 1 | implemented |
| FOUND-08 | Footer: © year IRFGC + FA tagline | content | `3:8315` | Footer | 1 | implemented |

---

## HUB — Global hub `/`

| ID | Description | Cat | Source | Target | Phase | Status |
|----|-------------|-----|--------|--------|-------|--------|
| HUB-01 | Hero: positioning line + two-line headline + supporting sentence (Persian) | content | `3:8315` | HomePage | 1 | implemented |
| HUB-02 | One-account orientation card with users icon | visual/content | `3:8315` | HomePage | 1 | implemented |
| HUB-03 | Game communities section title + active-count pill | visual | `3:8315` | HomePage | 1 | implemented |
| HUB-04 | Game community cards: art + gradient, EN title, FA blurb, ورود به کامیونیتی CTA | visual | `3:8315` | GameCommunityCard | 1 | implemented |
| HUB-05 | Entire card surface and CTA navigate to same game community path | behavior | `3:9253` | GameCommunityCard | 1 | implemented |
| HUB-06 | Navigation metadata object: `slug`, `shortName`, `fullName` per handoff table | data | `3:9253` | games model/nav | 1 | implemented |
| HUB-07 | Three pillars: خبر و گفتگو / پیدا کردن هم‌بازی / تورنمنت و دورهمی | content | `3:8315` | HomePage | 1 | implemented |
| HUB-08 | Empty / loading / signed-in hub variants | behavior | `3:8880`…`3:9122`, `3:8597` | HomePage | 2 | planned |
| HUB-09 | Persist game card images locally (no expired Figma asset URLs) | constraint | MCP assets | `public/` | 1 | implemented |

### Game slug table (HUB-06)

| slug | shortName | fullName |
|------|-----------|----------|
| `mortal-kombat` | MK | Mortal Kombat |
| `street-fighter` | SF | Street Fighter |
| `tekken` | TK | Tekken |
| `guilty-gear` | GG | Guilty Gear |
| `blazblue` | BB | BlazBlue |
| `under-night-in-birth` | UNI | Under Night In-Birth |

---

## GAME — Community home `/[gameSlug]`

| ID | Description | Cat | Source | Target | Phase | Status |
|----|-------------|-----|--------|--------|-------|--------|
| GAME-01 | Portal + preview architecture: five equal paths + content samples | visual | `15:13163` | GamePage | 2 | planned |
| GAME-02 | Mobile keeps all preview samples; desktop shows three forum topics in sample | responsive | `15:13163` | GamePage | 2 | planned |
| GAME-03 | Quiet state: zero counters; no invented member/online/capacity stats | behavior | `15:13163` | QuietPanel | 2 | planned |
| GAME-04 | Unknown/inactive/non-public slug → Unavailable UI, not empty home | behavior | `15:13163`, `15:13040` | GamePage | 2 | planned |
| GAME-05 | `/mk` and `mk.larfgc`/subdomain aliases resolve same communityId | constraint | `15:13163` | middleware | 2 | planned |
| GAME-06 | Guest may browse; register/LFG/message actions require login at destination | behavior | `15:13163` | hub CTAs | 2 | planned |
| GAME-07 | Deliver independent components: ActivityEntry, EventPreview, LfgRequestPreview, ForumRow, QuietPanel | constraint | `15:13163` | features/games | 2 | planned |
| GAME-08 | Sample content disclosure: demo data badge where applicable | content | `15:13163` | GamePage | 2 | planned |

---

## NEWS — News discovery & article

| ID | Description | Cat | Source | Target | Phase | Status |
|----|-------------|-----|--------|--------|-------|--------|
| NEWS-01 | Scopes: all games / public (no gameId) / per-game; silent exclude out-of-scope | behavior | `22:18781` | NewsList | 3 | planned |
| NEWS-02 | Breadcrumb: خبرها ← optional game ← short title; preserve scope+scroll on back | behavior | `22:18781` | news pages | 3 | planned |
| NEWS-03 | Featured = editorial; latest by publishedAt desc; featured may also appear in latest | behavior | `22:18781` | NewsList | 3 | planned |
| NEWS-04 | Never show draft/private to guests/public lists | constraint | `22:18781` | API/UI | 3 | planned |
| NEWS-05 | Progressive loading: skeleton initial; auto-append near end; after 2 auto batches require «بارگذاری بیشتر»; end/error/retry preserve scroll | behavior | `22:18781` | NewsList | 3 | planned |
| NEWS-06 | Thumbnail vs cover independent; missing image does not invent gray placeholder | visual | `22:18781` | cards/detail | 3 | planned |
| NEWS-07 | Empty all / empty game / initial error / incremental error / 404 article states | behavior | `22:18781` frames | news pages | 3 | planned |
| NEWS-08 | View tracking only on article open, not card impression | behavior | `22:18781` | ViewTracker | 3 | planned |
| NEWS-09 | Guest can read + see reaction/comment counts; react/comment requires login with return to article | behavior | `22:18781` | article page | 3 | planned |
| NEWS-10 | Reaction optimistic + pending lock + rollback on failure | behavior | `22:18781` | Reactions | 3 | planned |
| NEWS-11 | Comment draft preserved on failure; clear only after success | behavior | `22:18781` | Comments | 3 | planned |
| NEWS-12 | Author name/avatar link to public profile | behavior | `22:18781` | article | 3 | planned |
| NEWS-13 | Routes: `/news`, `/[slug]/news`, alias `/mk/news`, `/news/:articleSlug` | constraint | `22:18781` | routing | 3 | planned |

---

## POST — Posts feed & composer

| ID | Description | Cat | Source | Target | Phase | Status |
|----|-------------|-----|--------|--------|-------|--------|
| POST-01 | Shared model for `/posts`, author tab, My Posts; no game filter | constraint | `26:28389` | PostsList | 4 | planned |
| POST-02 | Infinite scroll: batch append, one in-flight request, unique IDs, preserve scroll | behavior | `26:28389` | PostsList | 4 | planned |
| POST-03 | Text required (trim, max 5000); media optional | behavior | `26:28389` | CreatePost | 4 | planned |
| POST-04 | Image/video attach with crop preview; reject incomplete media submit | behavior | `26:28389` | CreatePost | 4 | planned |
| POST-05 | Tentative limits: image 10MB, video upload 100MB (backend configurable) | constraint | `26:28389` | upload | 4 | planned |
| POST-06 | Collage layouts 1–5; >5 single gallery with index; lightbox Escape/arrows/swipe | visual/behavior | `26:28389` | PostImages/Lightbox | 4 | planned |
| POST-07 | Inline video: only one playing; pause on slide change/close | behavior | `26:28389` | PostVideos | 4 | planned |
| POST-08 | React/comment require auth with return; comments readable by guests; collapsed by default | behavior | `26:28389` | PostItem | 4 | planned |
| POST-09 | Optimistic reaction with rollback; comment errors keep draft | behavior | `26:28389` | Reactions/Comments | 4 | planned |
| POST-10 | Edit/delete author-only; edited badge; delete confirm | behavior | `26:28389` | PostItem | 4 | planned |
| POST-11 | Publish is immediate (no draft workflow) | behavior | `26:28389` | CreatePost | 4 | planned |
| POST-12 | Share: Web Share or copy link `/posts/:id` feedback | behavior | `26:28389` | PostItem | 4 | planned |

---

## PROF — Profile public & private

| ID | Description | Cat | Source | Target | Phase | Status |
|----|-------------|-----|--------|--------|-------|--------|
| PROF-01 | `/profile` private owner; `/users/:username` public; `@alias` same person | constraint | `40:5225` | routes | 5 | planned |
| PROF-02 | Public fields only; email/credentials/private comments/notifications/inbox never public | constraint | `40:5225` | PublicProfile | 5 | planned |
| PROF-03 | Identity validation: display name required trim; email optional unique; username immutable; role readonly | behavior | `40:5225` | ProfileForm | 5 | planned |
| PROF-04 | Avatar file or safe URL with preview; backend limits; error preserves current | behavior | `40:5225` | ProfileForm | 5 | planned |
| PROF-05 | Nine public counts: events, news, posts, LFG, topics, replies, registrations, followers, following | data | `40:5225` | ProfileStats | 5 | planned |
| PROF-06 | Directional follow state machine: none→pending→accept/reject; unfollow; mutual needs two directions | behavior | `40:5225` | FollowButton | 5 | planned |
| PROF-07 | Count updates only after server success; precise +/- rules from spec | behavior | `40:5225` | follow hooks | 5 | planned |
| PROF-08 | Guest opening counts/Follow → login gate with return; lists hidden | behavior | `40:5225` | FollowStats | 5 | planned |
| PROF-09 | Reuse posts model on profile; infinite scroll same as POST-02 | behavior | `40:5225` | profile posts | 5 | planned |
| PROF-10 | Private: comments history, notifications All/Unread, received/sent follow requests | behavior | `40:5225` | /profile | 5 | planned |
| PROF-11 | Inbox Accept/Reject independent; cancel only pending outgoing | behavior | `40:5225` | FollowRequests | 5 | planned |
| PROF-12 | No custom editable bio in this contract | constraint | `40:5225` | ProfileForm | 5 | planned |

---

## Cross-cutting open questions

| ID | Question | Impact | Resolution |
|----|----------|--------|------------|
| Q-01 | Do seeded game slugs match handoff table (`mortal-kombat` vs `mk`)? | HUB-06, GAME-05 | **Resolved:** seed uses short slugs (`mk`, `sf`, …) as primary; handoff long forms are conceptual aliases. App routes with short slug; `name` ≈ shortName, `fullName` matches table. |
| Q-02 | Should dashboard stay light theme while public app goes dark? | FOUND | Default: leave dashboard until later; document conflict |
| Q-03 | Article URL uses `[id]` today vs `:articleSlug` in News spec | NEWS-13 | Prefer keep id if DB is id-based; add slug if exists |
| Q-04 | Page 2 intentional fork? | inventory | Diff not run; Page 1 authoritative |

---

## Disposition legend

Every Figma-derived requirement above must end as `verified`, `deferred` (with rationale in progress), or `out_of_scope` (with rationale). Silent omission is not allowed.
