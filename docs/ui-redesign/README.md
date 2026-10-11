# IRFGC UI Redesign — Implementation Guide

Persistent source of truth for implementing the Figma design in the Next.js web app. Any agent can resume from these docs without chat history.

## Document index

| Doc | Purpose |
|-----|---------|
| [01-overview.md](./01-overview.md) | Scope, Figma entry points, architecture, strategy |
| [02-design-inventory.md](./02-design-inventory.md) | Frame inventory, route/component mapping |
| [03-requirements-catalog.md](./03-requirements-catalog.md) | Trackable requirements with IDs and sources |
| [04-component-guide.md](./04-component-guide.md) | Component boundaries, props, integration |
| [05-roadmap.md](./05-roadmap.md) | Phased implementation plan |
| [06-progress.md](./06-progress.md) | Status, next tasks, decisions, gaps |
| [07-validation.md](./07-validation.md) | Acceptance criteria and evidence rules |
| [figma-page1-frames.tsv](./figma-page1-frames.tsv) | Machine-readable Page 1 top-level frames |

## Agent workflow

### Planning agent

1. Read `01-overview.md`, `06-progress.md`, and the relevant phase in `05-roadmap.md`.
2. Pull requirement IDs from `03-requirements-catalog.md` for that phase.
3. If docs are ambiguous, inspect Figma via MCP (`plugin-figma-figma`):
   - `create_session` with file key `FcxoZyDVuta0GSzG678bFy`
   - Prefer `get_design_context` on concrete node IDs from the inventory
   - Treat `*specification*`, `*handoff*`, `*rationale*`, `*patterns*` frames as requirements sources, not rendered UI
4. Inspect current code under `apps/web`.
5. Emit a bounded plan: tasks → requirement IDs → files → acceptance criteria.

### Execution agent

1. Read the plan + linked docs before editing.
2. Implement only the agreed scope; preserve business logic unless a requirement says otherwise.
3. Validate per `07-validation.md`.
4. Update `06-progress.md` and requirement statuses in `03-requirements-catalog.md`.
5. Leave docs accurate for the next agent.

## Figma access notes

- **File:** [IRFGC](https://www.figma.com/design/FcxoZyDVuta0GSzG678bFy/IRFGC?node-id=0-1)
- **File key:** `FcxoZyDVuta0GSzG678bFy`
- **MCP namespace:** `plugin-figma-figma`
- **Page 1 (`0:1`):** Primary design + Persian product/behavior specification frames (source of truth)
- **Page 2 (`44:1365`):** Appears to duplicate Page 1 frame set; use Page 1 node IDs unless Page 2 diverges
- **Session ID** is ephemeral per agent run; recreate with `create_session`

## Status snapshot

See [06-progress.md](./06-progress.md). Phase 0 docs complete; Phase 1 foundations + global hub implemented (verify lint/visual next); Phase 2 game home is the next implementation phase.
