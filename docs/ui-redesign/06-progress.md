# 06 — Progress and Traceability

Last updated: 2026-10-11 (Phase 1 code landed)

## Current status

| Phase | Status | Notes |
|-------|--------|-------|
| 0 Discovery & docs | **complete** | Guide under `docs/ui-redesign/` |
| 1 Foundations + Hub | **implemented** (pending visual verify + lint when deps installed) | Tokens, fonts, nav, hub page, local assets |
| 2 Game community home | **next** | Start here after Phase 1 verification |
| 3 News | planned | |
| 4 Posts | planned | |
| 5 Profile | planned | |
| 6 Hardening | planned | |

## Next actionable task (for any new agent)

**Verify Phase 1, then start Phase 2:**

1. Install deps in `apps/web` (`npm install --legacy-peer-deps`), run `npm run lint`, visually compare `/` to Figma `3:8315`.
2. Mark FOUND-* / HUB-* (except HUB-08) as `verified` in catalog when checks pass.
3. Begin Phase 2: MCP `get_design_context` on `15:11815` + `15:13163`; rebuild `app/[gameSlug]/page.tsx` per GAME-* requirements.

## Completed work

| Date | Item | Evidence |
|------|------|----------|
| 2026-10-11 | Figma Page 1/2 metadata inventory (93 frames each) | `figma-page1-frames.tsv` |
| 2026-10-11 | Spec frames inspected via MCP | `3:8315`, `3:9253`, `15:13163`, `22:18781`, `26:28389`, `40:5225` |
| 2026-10-11 | Docs structure | `01`–`07` + README |
| 2026-10-11 | Phase 1 UI foundations + hub | See files below |

### Phase 1 files touched

- `apps/web/src/app/globals.css` — IRFGC tokens; remapped shadcn vars to dark theme
- `apps/web/src/app/layout.tsx` — Vazirmatn + Inter via `next/font`
- `apps/web/src/app/page.tsx` — Hub redesign
- `apps/web/src/components/BrandMark.tsx` — new
- `apps/web/src/components/SiteFooter.tsx` — new
- `apps/web/src/components/MainNav.tsx` — dark RTL chrome
- `apps/web/src/components/UserMenu.tsx` — FA guest/account labels
- `apps/web/src/components/hub/GameCommunityCard.tsx` — new
- `apps/web/src/components/hub/HubPillars.tsx` — new
- `apps/web/src/lib/hub-content.ts` — presentation map by short slug
- `apps/web/public/ui/hub/*.jpg` — six game arts from Figma MCP

## Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| D-01 | Page 1 is source of truth | User instruction; Page 2 appears duplicate |
| D-02 | Spec/pattern frames are requirements-only | Product notes / outside UI |
| D-03 | Dashboard redesign deferred | Not in player Figma scopes |
| D-04 | Component-first incremental replace | Preserve APIs |
| D-05 | Keep DB short slugs (`mk`…) as route keys | Existing seed/middleware; map Figma long slugs as aliases in docs; HUB-06 satisfied via `slug`+`name`+`fullName` |

## Open gaps / blockers

| ID | Gap | Blocking? | Action |
|----|-----|-----------|--------|
| G-02 | — | Resolved | Assets in `public/ui/hub/` |
| G-03 | Article slug vs id | Phase 3 | Inspect news schema |
| G-04 | Dark theme now global — dashboard chrome may look off | Soft | Phase 6 or scoped layout override |
| G-05 | `npm run lint` fails on **pre-existing** errors (socketio `any`, dashboard unused imports, etc.); Phase 1 files not in the lint failure list | Soft | Fix legacy lint debt separately; Phase 1 not blocked by new violations |
| G-06 | HUB-08 signed-in/empty/loading dedicated frames only partially covered (loading/empty skeletons exist; signed-in chrome uses same hub body) | Soft | Phase 2 stretch or Phase 1 follow-up |

## Change log

| Date | Agent note |
|------|------------|
| 2026-10-11 | Initial guide established |
| 2026-10-11 | Phase 1 foundations + hub implemented; next = verify + Phase 2 game home |
