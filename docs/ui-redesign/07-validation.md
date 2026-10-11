# 07 — Validation and Acceptance Criteria

A task or requirement is **complete** only when implementation + validation evidence + catalog status update are done.

## Evidence required

For each requirement marked `implemented` → `verified`:

1. **Visual:** Screenshot or written note comparing to Figma node ID (desktop and/or mobile as in scope).
2. **Behavioral:** Steps exercised (guest/member, empty/error if claimed).
3. **Tooling:** Commands run and result (pass/fail).
4. **Assets:** No live `figma.com/api/mcp/asset` URLs in committed code.
5. **Docs:** Catalog status + progress entry updated.

## Repository tooling

From `apps/web`:

| Check | Command | When |
|-------|---------|------|
| Lint | `npm run lint` | Every UI phase |
| Unit/API tests | `npm run test` or targeted jest | If hooks/API behavior changes |
| E2E | `npm run test:e2e` | Optional for large phases; required if auth/nav regressions suspected |
| Typecheck | `npx tsc --noEmit` | If types touched |

Do not claim green checks that were not run.

## Phase 1 acceptance

- [ ] Hub desktop matches structure of `3:8315` (nav, hero, 6 cards, pillars, footer)
- [ ] Persian copy present for hub chrome; EN game titles retained
- [ ] Accent/tokens applied (dark canvas, lime CTAs)
- [ ] Fonts load (Vazirmatn + Inter)
- [ ] Card click → `/${slug}` for each active game
- [ ] Guest Sign up / Sign in links work
- [ ] Assets local under `public/`
- [ ] `npm run lint` passes
- [ ] FOUND-* / HUB-* statuses updated

## Phase 2 acceptance

- [ ] Game hub structure matches portal+preview for populated MK frame
- [ ] Quiet and Unavailable states implemented
- [ ] Alias/unknown slug behavior matches GAME-04/05
- [ ] Lint pass; catalog updated

## Phase 3–5 acceptance

Use requirement IDs in catalog as checklist. At minimum: primary populated desktop frame + critical edge states (empty, error, guest gate) for that domain.

## Component-level checks

| Component | Must verify |
|-----------|-------------|
| GlobalNav | Guest vs session; game-scoped links; RTL |
| GameCommunityCard | Full-surface click; gradient readability |
| NewsList | Scope + progressive load boundaries |
| PostItem | Auth gates; author menu; media |
| FollowButton | Pending/accept/reject/unfollow |

## Regression guardrails

- Do not break NextAuth session flows
- Do not remove Prisma-backed data wiring while restyling
- Dashboard must remain reachable for ADMIN/MODERATOR
- RTL `dir="rtl"` must remain on `<html>`

## Evidence log (append)

| Date | Phase | Evidence |
|------|-------|----------|
| 2026-10-11 | 0 | Specs inspected via MCP; docs at `docs/ui-redesign/` |
| 2026-10-11 | 1 | Hub rebuilt from `3:8315`; assets in `public/ui/hub/`; deps installed via `--legacy-peer-deps`; `npx next lint` exits 1 on pre-existing issues only (no Phase 1 file failures) — visual verify still needed for `verified` |
