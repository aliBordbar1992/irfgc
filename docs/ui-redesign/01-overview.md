# 01 — Overview and Scope

## Design objective

Bring the IRFGC web application UI into conformance with the Figma product design: dark RTL Persian-first surfaces, shared visual language (arcade lime accent, Vazirmatn + Inter), and the documented behavioral contracts for Hub, Game community home, News, Posts, and Profile.

Success is progressive visual/behavioral fidelity **with full requirement traceability** — not screenshot matching alone.

## Application scope (in redesign)

| Area | Routes (current) | Figma scope |
|------|------------------|-------------|
| Global hub | `/` | IRFGC Desktop/Mobile guest, signed-in, empty, loading, unavailable |
| Game community home | `/[gameSlug]` | Mortal Kombat hub variants + Scope 4 rationale |
| News | `/news`, `/news/[id]`, `/[gameSlug]/news` | All News / game news / article / empty / error |
| Posts | `/posts`, profile-embedded feeds | Global feed, create/edit, comments, lightbox, patterns |
| Profile | `/profile`, `/users/[username]` | Public + private surfaces, follow machine, notifications |

### Explicitly deferred / out of redesign frames

- Full redesign of Events, LFG, Forum, Chat destination UIs (Profile/News specs say those destinations are not redesigned here)
- Admin/moderator dashboard chrome (role path via user menu; not player nav)
- Subdomain product split (aliases resolve to same community identity)

## Figma entry points

| Artifact | Node ID | Role |
|----------|---------|------|
| Page 1 | `0:1` | Source of truth |
| Page 2 | `44:1365` | Duplicate inventory (verify before use) |
| Hub guest desktop | `3:8315` | Primary hub visual target |
| Game entry handoff | `3:9253` | Navigation metadata contract (not UI) |
| Scope 4 rationale | `15:13163` | Community home product assumptions |
| News specification | `22:18781` | News display/behavior contract |
| Posts specification | `26:28389` | Posts model/behavior contract |
| Profile specification | `40:5225` | Profile product/behavior contract |

Full frame list: [figma-page1-frames.tsv](./figma-page1-frames.tsv)

## Existing architecture

- **App:** `apps/web` — Next.js 15 App Router, React 19, TypeScript
- **UI:** Tailwind CSS v4, shadcn/ui (new-york), Radix, Lucide
- **State/auth:** NextAuth credentials, Jotai, Prisma
- **Root:** `lang="fa"` `dir="rtl"` already set; copy and fonts still English/system-first
- **Features:** `src/features/{auth,games,profile,posts,news,events,lfg,forum,chat,dashboard}`
- **Shared shell:** `MainNav`, `UserMenu`, `LoginPromptModal`, `src/components/ui/*`

See [02-design-inventory.md](./02-design-inventory.md) for detailed mapping.

## Implementation strategy

1. **Document first** (this folder) so phases are resumable.
2. **Foundations:** design tokens, fonts (Vazirmatn/Inter), dark shell, GlobalNav.
3. **Component-first replacement:** rebuild shared chrome and page sections against Figma contracts; reuse existing data hooks/APIs.
4. **Domain phases:** Hub → Game home → News → Posts → Profile (dependency order in roadmap).
5. **Validate + update progress** after each phase; never mark complete without evidence.

## Design system signals (from MCP inspection)

Extracted from hub/spec frames (no Figma Variables returned for `3:8315`):

| Token role | Hex (approx) | Notes |
|------------|--------------|-------|
| Canvas | `#0c1014` | Page background |
| Surface | `#151b22` | Cards/panels |
| Surface muted | `#1b242d` | Chips, secondary fills |
| Accent surface | `#202c1c` | Lime-tinted badges |
| Border | `#2b3642` | Dividers/borders |
| Accent | `#c7f878` | Primary interactive lime |
| Text primary | `#f4f6f8` | Headings/body strong |
| Text secondary | `#adb8c4` | Supporting copy |
| Text tertiary | `#778695` | Footers/meta |
| Text on media | `#d0d8e0` | Card body over art |
| Danger | `#f0a49c` | Error copy |
| Fonts | Vazirmatn (FA), Inter (EN/brand) | Load via `next/font` or Google fonts |

## Dependencies

- Figma MCP (`plugin-figma-figma`) for node inspection during implementation
- Existing `/api/games`, news/posts/profile APIs — preserve unless a requirement mandates change
- Auth session for guest vs member chrome

## Related docs

- [02-design-inventory.md](./02-design-inventory.md)
- [03-requirements-catalog.md](./03-requirements-catalog.md)
- [05-roadmap.md](./05-roadmap.md)
