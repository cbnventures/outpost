# VISION.md

## Purpose

### Problem Statement

Self-hosters run dozens of containers that need to stay on current images for security fixes and features. Watchtower became the default answer, but it is no longer actively maintained, runs as root, and its recreate logic has known gaps: anonymous volumes can come back empty, environment defaults from the old image get frozen into the new container, and a broken update leaves the service down with no automatic recovery. Updating by hand does not scale, and full orchestrators are overkill for a single Docker host.

### Origin

Outpost was built by CBN Ventures as a maintained, security-conscious replacement for Watchtower, using the same Nova monorepo and s6-overlay image layout as the other CBN Ventures Docker images.

### Target Audience

- **Homelab and single-host operators** — People running Compose stacks on a NAS, mini PC, or VPS who want images kept current without babysitting them.
- **Former Watchtower users** — People who want a drop-in style replacement with labels, schedules, notifications, an HTTP API, and metrics.
- **Cautious operators** — People who want to be told about new images (monitor-only) or update only opted-in containers, with automatic rollback when an update fails.

### Value Proposition

Outpost watches registries on a schedule and recreates containers on new images with their original configuration, volumes, and networks intact. If the new container stops or reports unhealthy, Outpost puts the old container back. It runs as a non-root s6-overlay appliance and needs nothing but the Docker socket.

## Product Direction

Outpost targets a single Docker host through the local socket. Swarm services, Kubernetes, and remote multi-host fleets are out of scope. Outpost never updates its own container while running; it is updated like any other image (for example with `docker compose pull`).

## Product Design

Configuration is environment variables only, so a Compose file fully describes an instance. Each cycle checks containers one at a time in dependency order, compares the registry digest before pulling, and records one result per container in a report that feeds notifications, the status endpoint, and Prometheus metrics.

## Positioning

### Differentiators

| This project                                                           | Alternatives                                                       |
|------------------------------------------------------------------------|--------------------------------------------------------------------|
| Automatic rollback when the new container stops or turns unhealthy     | Watchtower leaves a failed update in place                         |
| Reattaches anonymous volumes and drops stale image defaults            | Naive recreation loses anonymous volume data or freezes old env    |
| Runs as a non-root user that only joins the Docker socket's group      | Updaters commonly run as root                                      |
| Registry digest check before pulling                                   | Pull-and-compare downloads every image on every run                |
| Updates Compose dependencies before their dependents                   | Updates run in arbitrary order                                     |
| Actively maintained, typed, tested TypeScript                          | Unmaintained or loosely tested scripts                             |

## Risks and Future

- Docker credential helpers (`credsStore`) are not supported; private registries need credentials in a mounted `config.json`.
- Containers sharing another container's network namespace (`network_mode: container:…`) are skipped for now.
- Some registries rate-limit anonymous digest lookups; credentials raise those limits.

## Marketing Copy

### Tagline

Keep every container current, and roll back when an update breaks.

### Elevator Pitch

Outpost is a self-hosted container updater for Docker and a modern Watchtower replacement. On a schedule you choose, it checks each container's registry for a newer image, pulls it, and recreates the container with the same settings, volumes, and networks. If the new container fails to start or turns unhealthy, Outpost restores the old one automatically. Opt containers in or out with labels, run in monitor-only mode, get ntfy or webhook notifications, and trigger or scrape it through a small HTTP API.

### Key Features

- **Safe recreation** — Keeps env, labels, ports, volumes (including anonymous ones), and every network attachment.
- **Automatic rollback** — Restores the previous container when the new one stops or reports unhealthy.
- **Digest-first checks** — Asks the registry before pulling, so up-to-date containers cost one HEAD request.
- **Label control** — Opt-out (update everything) or opt-in mode, plus per-container monitor-only.
- **Dependency order** — Compose `depends_on` services are updated before the services that need them.
- **Notifications** — ntfy and JSON webhook summaries when something was updated, found, or failed.
- **Web dashboard** — See every container's status, run a check for everything or one container, and browse the last 50 checks.
- **HTTP API and metrics** — Trigger updates, read the last report, and scrape Prometheus metrics with a bearer token.
- **Non-root appliance** — s6-overlay image on Debian trixie slim; runs as PUID/PGID.

## Glossary

| Term             | Definition                                                                                                       |
|------------------|------------------------------------------------------------------------------------------------------------------|
| Cycle            | One pass over all selected containers, started by the schedule or the API, producing one report.                 |
| Report           | The per-container results of a cycle: updated, available, up-to-date, skipped, rolled-back, or failed.          |
| Label mode       | `opt-out` updates every container unless labeled off; `opt-in` updates only containers labeled on.               |
| Monitor-only     | Report available updates without recreating containers, globally or per container.                              |
| Remote digest    | The manifest digest the registry reports for an image tag, compared with the digest of the running image.        |
| Recreation       | Stopping a container, starting an identical one on the new image, and removing the old one once the new is up.   |
| Rollback         | Removing a failed replacement and restarting the previous container under its original name.                     |
| Settle period    | How long a container without a healthcheck must keep running before an update counts as successful.             |

## Additional Vision Notes

No additional vision notes are currently documented.
