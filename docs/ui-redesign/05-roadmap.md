# 05 — Implementation Roadmap

Phases are ordered by dependency and risk. Each phase must leave the app buildable.

## Phase 0 — Discovery & documentation ✅

- **Scope:** Inspect Figma Page 1 (metadata + key specs + hub), map repo, write this guide.
- **Outcomes:** Docs in `docs/ui-redesign/`; requirement IDs assigned.
- **Done when:** A new agent can pick Phase 1 from progress alone.
- **Status:** Complete (this commit/set of files).

## Phase 1 — Foundations + Global Hub

- **Prereqs:** Phase 0
- **Reqs:** FOUND-01…08, HUB-01…07, HUB-09 (HUB-08 optional stretch)
- **Work:**
  1. Add IRFGC dark tokens + fonts
  2. BrandMark, SiteFooter, rewrite MainNav/GlobalNav guest chrome
  3. Rebuild `/` home page to match `3:8315` / mobile `3:8458`
  4. Download game card assets to `public/`
  5. Verify game slug/shortName alignment with API (Q-01)
- **Affected:** `globals.css`, `layout.tsx`, `MainNav.tsx`, `UserMenu.tsx`, `app/page.tsx`, new components
- **Validation:** Visual compare hub desktop; `npm run lint` in apps/web; guest nav links work
- **Parallelizable:** Asset download || token CSS; nav || home composition after tokens

## Phase 2 — Game community home

- **Prereqs:** Phase 1 (nav/tokens)
- **Reqs:** GAME-01…08
- **Work:** Rebuild `[gameSlug]/page.tsx`; Unavailable state; QuietPanel; preview components; alias check
- **Figma:** `15:11815`, quiet/unavailable frames, `15:13163`
- **Validation:** Guest MK hub matches populated design structure; bad slug → unavailable

## Phase 3 — News

- **Prereqs:** Phase 1; Phase 2 helpful for game-scoped entry
- **Reqs:** NEWS-01…13
- **Work:** Restyle list/detail; progressive loading; empty/error; login return; breadcrumbs
- **Figma:** `22:18781` + populated/edge frames
- **Validation:** Scope filters; load-more contract; guest react gates

## Phase 4 — Posts

- **Prereqs:** Phase 1; Profile can wait but shared PostItem should stabilize here
- **Reqs:** POST-01…12
- **Work:** Restyle feed; composer validation; collage/lightbox/video; share; auth gates
- **Figma:** `26:28389` + feed/create frames
- **Validation:** Infinite scroll; author-only edit; guest comment read

## Phase 5 — Profile

- **Prereqs:** Phase 4 (posts model), Phase 1
- **Reqs:** PROF-01…12
- **Work:** Public/private restyle; 9 stats; follow machine polish; notifications/inbox UI
- **Figma:** `40:5225` + public/private frames
- **Validation:** Privacy boundary; follow transitions; guest gates

## Phase 6 — Hardening & polish

- **Prereqs:** Phases 1–5 core screens
- **Work:** Mobile parity audit; RTL spacing audit; empty/loading/error coverage; remove leftover purple gradient marketing styles; accessibility pass
- **Validation:** `npm run lint`, targeted jest/e2e if touching tracked behavior; visual checklist per `07-validation.md`

## Dependency graph

```text
Phase 0 → Phase 1 → Phase 2 → Phase 3
                 ↘ Phase 4 → Phase 5
                 ↘ Phase 6 (after 1–5 cores)
```

Phases 3 and 4 can proceed in parallel after Phase 1 if staffing allows; Phase 5 depends on Posts shared components.

## Planning agent checklist (per phase)

1. Read progress → select next incomplete phase
2. MCP-inspect primary Figma nodes for that phase
3. Diff against current code
4. Produce task list with requirement IDs
5. Hand off to execution agent
