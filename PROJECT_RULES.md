# PROJECT_RULES.md

## Project Identity

### Name and Description

- **Project name:** outpost
- **Description:** Self-hosted container auto-updater for Docker, shipped as a non-root s6-overlay image (a Watchtower replacement).
- **Primary language:** TypeScript
- **Framework / runtime:** Node.js (Express API, croner scheduler), s6-overlay on Debian trixie slim, Docusaurus documentation

### Repository URL

- **URL:** https://github.com/cbnventures/outpost

## Repository Structure

### Repository Layout

```
outpost/
├── .github/workflows/     — Nova-generated GitHub Actions workflows
├── apps/
│   ├── docs/              — Docusaurus documentation site
│   └── server/            — Dashboard, HTTP API, and scheduler (the container's main process)
├── packages/
│   ├── docker/            — s6-overlay image assembly (manifest.json, rootfs)
│   ├── docker-engine/     — Typed Docker Engine API client over the unix socket
│   ├── registry/          — Image references, registry credentials, remote digests
│   └── updater/           — Selection, recreation, rollback, and the update cycle
├── tests/                 — Root tooling tests
├── Dockerfile             — Single image built from the repository root
├── compose.yml            — Example deployment
├── nova.config.json       — Nova project and workspace configuration
└── package.json           — Private monorepo coordinator
```

### Source Structure

Every TypeScript workspace uses the same layout:

```
<workspace>/src/
├── index.ts         — Entry point or barrel export
├── <module>.ts      — Implementation
├── <module>.test.ts — Tests next to the module they cover
└── types/           — Named types mirroring each module and test
```

### Key Files

| File                                                       | Purpose                                 | When to modify                                     |
|------------------------------------------------------------|-----------------------------------------|----------------------------------------------------|
| `packages/updater/src/run.ts`                              | Update cycle and per-container decision | Changing how updates are detected or applied       |
| `packages/updater/src/plan.ts`                             | Container recreation body               | Changing what is carried over to the new container |
| `packages/updater/src/recreate.ts`                         | Swap and rollback                       | Changing the recreate or health-wait sequence      |
| `packages/updater/src/select.ts`                           | Label rules and dependency order        | Changing which containers are considered           |
| `packages/registry/src/digest.ts`                          | Registry digest lookup and auth         | Supporting new registry auth flows                 |
| `packages/docker-engine/src/engine.ts`                     | Docker Engine API calls                 | Adding Engine endpoints                            |
| `apps/server/src/config.ts`                                | Environment variables                   | Adding or changing settings                        |
| `apps/server/src/app.ts`                                   | HTTP app, limits, and route wiring      | Adding middleware or route modules                 |
| `apps/server/src/routes/`                                  | API, sign-in, dashboard, and metrics    | Adding or changing endpoints or metrics            |
| `apps/server/src/lib/state.ts`                             | SQLite account, sessions, and tokens    | Changing what the server stores                    |
| `apps/server/src/web/`                                     | Dashboard (React + Vite)                | Changing the dashboard UI                          |
| `apps/server/src/self-update.ts`                           | Self-update helper and hand-off         | Changing how Outpost updates itself                |
| `packages/docker/manifest.json`                            | s6 services                             | Changing services, health, or writable paths       |
| `packages/docker/rootfs/etc/s6-overlay/s6-rc.d/server/run` | Service start and socket group          | Changing how the server process starts             |
| `Dockerfile`                                               | Image build                             | Changing stages, base images, or build order       |

## Build and Tooling

### Prerequisites

| Tool    | Version                   | Purpose                        |
|---------|---------------------------|--------------------------------|
| Node.js | See root `engines`        | Runtime, build, and tests      |
| npm     | See root `packageManager` | Package manager                |
| Docker  | Engine with Buildx        | Building and running the image |

### Commands

| Command             | What it does                                                  |
|---------------------|---------------------------------------------------------------|
| `npm install`       | Install every workspace dependency                            |
| `npm run dev`       | Run workspace development processes                           |
| `npm run check`     | Lint, type-check, and test every workspace (deps built first) |
| `npm run build`     | Build every workspace in dependency order                     |
| `npm run deploy`    | Build and start the image with Docker Compose                 |
| `npm run clean`     | Remove build output                                           |
| `npm run changelog` | Record or release Nova changelog entries                      |

### Environment Variables

Environment variables carry only what Outpost needs before its database opens: `DOCKER_HOST`, `OUTPOST_DATA_DIRECTORY`, `PORT`, `PUID`, `PGID`, and `TZ`. Update behavior (the schedule, label mode, monitor-only mode, cleanup, replacement timing, and private registry sign-ins) is saved in SQLite and changed on the dashboard's **Settings** page. `apps/server/src/config.ts` reads the server's variables and holds the behavior defaults; `compose.yml` documents the common ones.

## Workspace Rules

### Naming Conventions

| Entity           | Convention                        | Example                                |
|------------------|-----------------------------------|----------------------------------------|
| Source files     | kebab-case                        | `docker-engine`, `recreate.ts`         |
| Workspace names  | `outpost-<role>-<name>`           | `outpost-package-updater`              |
| Environment vars | `OUTPOST_` + UPPER_SNAKE          | `OUTPOST_DATA_DIRECTORY`               |
| Container labels | `io.cbnventures.outpost.<name>`   | `io.cbnventures.outpost.enable`        |
| Type files       | Mirror source path under `types/` | `packages/updater/src/types/plan.d.ts` |
| Test files       | Next to the module, `.test.ts`    | `packages/updater/src/plan.test.ts`    |

### Do / Don't

**Do:**
- Keep Docker, registry, and update logic in their packages; `apps/server` wires them together and owns notifications, which share their design with the other Docker apps.
- Inject I/O (engine, fetch, clock, sleep) into the updater so every decision is unit-testable without Docker.
- Validate every Docker Engine and registry response with Zod.
- Roll back on any failure after the old container has been stopped.
- Keep the database readable by the previous release; a self-update that rolls back starts the old Outpost on it.

**Don't:**
- Don't remove volumes when removing containers.
- Don't swap Outpost's own container from inside it; the self-update helper container does that.
- Don't run the server process as root; grant access through the socket's group instead.
- Don't let notification failures affect an update cycle.

## Architecture and Data

### Architecture

```
Cron schedule ───────┐
POST /v1/update ─────┤
Dashboard check now ─┴─> Scheduler (one cycle at a time)
                             |
                             v
                       runUpdateCycle
  list containers -> select (labels) -> sort (depends_on, then Outpost last)
       |
       v  for each container
  inspect -> pinned to a digest or ID?           -> skipped
          -> shares another container's network? -> skipped
          -> registry digest == running digest?  -> up-to-date
          -> monitor-only, registry answered?    -> available
          -> pull -> same image ID?              -> up-to-date
          -> monitor-only?                       -> available
          -> recreate (stop, rename, create, connect, start, wait healthy)
                -> success: remove old (+ old image if cleanup) -> updated
                -> failure: remove new, restore old             -> rolled-back
          -> Outpost itself (last): a helper container runs the same recreate,
             and the Outpost running afterwards records the result
       |
       v
  report -> notifications (the destinations on the Notifications page), /v1/status, /metrics
```

### Data Flow and Ownership

1. **Schedule or API** — The scheduler starts a cycle unless one is already running.
2. **Select** — Running containers are filtered by label mode and ordered by Compose dependencies.
3. **Check** — The registry digest (or a pull and image ID comparison) decides whether an update exists.
4. **Recreate** — The container is swapped with rollback on failure. Outpost's own container is checked last and swapped by a short-lived helper container, so the swap survives Outpost stopping.
5. **Report** — Results are stored for the API and metrics and sent to notification targets.

### Error Strategy

| Layer         | Strategy                                                                                  |
|---------------|-------------------------------------------------------------------------------------------|
| Config        | Invalid environment values stop startup with a readable message.                          |
| Engine client | Non-2xx responses throw with the daemon's error message.                                  |
| Registry      | Unreachable registries fall back to pull-and-compare; a missing image is a local build.   |
| Recreation    | Any failure after stopping triggers rollback; rollback failures are reported as `failed`. |
| Self-update   | An image that rolled back or never started is skipped until a newer one appears.          |
| Cycle         | One container's failure is recorded and the cycle continues.                              |
| Notifications | Failures are collected and never thrown.                                                  |

## Project Guardrails

No additional project-specific guardrails are currently documented beyond the workspace rules and shared convention files.

## Testing and Verification

The supported verification commands are documented under Build and Tooling. Changes must pass every check applicable to the affected workspaces, and image changes must pass `docker build` from the repository root.

## Documentation and Ownership

### Documentation Structure

#### Framework

- **Framework:** Docusaurus with `@cbnventures/docusaurus-preset-nova`
- **Source directory:** `apps/docs/`

#### Commands

- `npm run dev --workspace outpost-docs` starts the documentation site.
- `npm run check --workspace outpost-docs` validates docs, links, types, and formatting.
- `npm run build --workspace outpost-docs` builds the production site.

## Publishing and Deployment

### Release Process

1. Record user-facing changes through `npm run changelog` while developing.
2. Preview the release with `npm run changelog -- --release --dry-run`, then run the real release after approval.
3. Run a clean install, `npm run check`, `npm run build`, and `docker build .`.
4. Publish a GitHub release; the publish workflow pushes the multi-arch image and deploys the docs.

### CI/CD Workflows

| Workflow file                                       | Trigger                  | What it does                                                                    |
|-----------------------------------------------------|--------------------------|---------------------------------------------------------------------------------|
| `nova-check-sponsor-gated-issues-sponsor-check.yml` | Issue open/close/comment | Apply GitHub Sponsors-based support policy                                      |
| `nova-lock-inactive-issues-lock-inactive.yml`       | Weekly cron or manual    | Lock inactive issues and pull requests                                          |
| `nova-publish-project.yml`                          | Version tag or manual    | Push `linux/amd64` and `linux/arm64` images to Docker Hub and GHCR, deploy docs |

### Environments

| Environment   | URL / Identifier                             | Purpose                   |
|---------------|----------------------------------------------|---------------------------|
| Docker Hub    | https://hub.docker.com/r/cbnventures/outpost | Published image           |
| GHCR          | ghcr.io/cbnventures/outpost                  | Published image (mirror)  |
| Documentation | https://outpost.cbnventures.io/              | Public documentation site |

## Additional Project Rules

No additional project rules are currently documented.
