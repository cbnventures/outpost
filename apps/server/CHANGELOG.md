# outpost-app-server

## 1.0.4 - 2026-11-06

### FIXED
- Fixed updates rolling back containers whose healthcheck first runs after the health timeout, such as one that checks every 15 minutes. Such a container is now kept once it stays running through the settle period, and the result says the healthcheck had not answered yet.

## 1.0.3 - 2026-11-05

### UPDATED
- Updated the new notification dialog to start on "— Select one —", so a service is chosen on purpose and its fields appear once it is.
- Updated text boxes to resize only vertically and never shrink below three lines.

### FIXED
- Fixed update checks rolling the same container back on every run. A container that was already unhealthy now keeps its new image as long as it stays running, and an image that was rolled back is skipped until a newer one appears or that container is checked on its own.
- Fixed the API rate limit and the sign-in limit so an IPv6 client can no longer reset them by switching addresses; IPv6 clients now count by their /56 network.
- Fixed password managers offering to fill or save the Outpost sign-in in notification and registry secret fields.

## 1.0.2 - 2026-11-03

### UPDATED
- Updated the Compose file and Quick Start to publish port 22601 on IPv6 as well as IPv4, and gave Outpost's network IPv6 so the dashboard sees each IPv6 client's own address.

## 1.0.1 - 2026-11-03

### UPDATED
- Updated Outpost to use port 22601 by default while preserving custom PORT values across startup and health checks.

## 1.0.0 - 2026-11-03

### ADDED
- Added the web dashboard for live overview, container, history, notification, settings, registry, token, and account-security management.
- Added named, scoped access tokens with expiration, editing, revocation, and immediate live-stream enforcement.
- Added configurable notifications for update results, monitor-only findings, failures, rollbacks, locked sign-ins, and secrets removed after encryption-key loss.
- Added database-backed runtime settings, update history, accounts, sessions, encrypted secrets, backup continuity, and migration from the earlier account file.
- Added database-backed private registry sign-ins with encrypted passwords or access tokens and recovery notices when an encryption key is lost.
- Added scheduled and manual update checks with live progress, persisted reports, readable schedule summaries, HTTP API access, Watchtower-compatible routes, and Prometheus metrics.
- Added self-updates that run after managed containers and use a short-lived helper to preserve data, roll back failed replacements, and avoid retrying a known-bad image.
- Added safe handling for locally built images and Docker containerd image storage so registry checks do not replace host-built workloads.
- Added first-run account claiming with persistent sessions, sign-in rate limits, authenticator codes, recovery codes, and passkeys.
