# outpost-app-server

## 1.2.0 - 2026-11-17

### UPDATED
- App state lives at /config, with the installation key in keys/ and the database in database/, all owned by PUID and PGID; an existing /data install moves over on its first start, and the container uses the shared health check, shutdown timing and plain log lines of the other Docker apps.

## 1.1.0 - 2026-11-17

### UPDATED
- Revoke and Remove buttons for API tokens, notification services, registries, and passkeys show a trash icon.
- The dashboard's phone layout has bottom tabs that match the sidebar, with Settings, Access tokens and Notifications under More, and Security sits in the account menu as Sign-in and security.
- Manual checks report available updates and hold previously rolled-back images without pulling or recreating containers, with separate dashboard and API actions to apply updates, result-accurate checked times, and full container ID tooltips.
- A new token shows in the token dialog itself, and disabled switches look disabled.
- The dashboard's icons and select arrows use the Lucide icon set.
- Scheduled runs in monitor-only mode only ask the registry for new images and no longer pull them.
- Toasts and page ends in the console stay clear of the save bar, copy rows show their label above the value, the sidebar fades where more items are below, and disabled switches keep the Off look, faded.

### FIXED
- The notification service "— Select one —" choice is selectable again, with its required error shown on submission.
- Self-updates no longer fail or freeze old image defaults after Docker's containerd image store removes the outgoing image record; the prior defaults are cached while user overrides are preserved.

### ADDED
- Debug logging under Diagnostics on the Settings page. While it's on, the container log names each check and update cycle with how long it took, each registry digest and token request with its answer and time, Docker calls that were slow or failed, each self-update step, and slow or canceled requests.
- Every console page has its own address, so Back, Forward, refresh and bookmarks open the same page, and signing in returns to the page you asked for.
- Export and Import under Settings > Backup cover runtime settings, registry sign-ins, notification destinations, and access-token hashes. Imports preview replacements, additions, and skipped duplicates, then apply every selected section in one transaction after a fresh account confirmation.
- An option to keep a failed replacement when updating one container turns off automatic rollback for that update, with its recovery details kept in History and long names and details wrapping cleanly on small screens.

### REMOVED
- The PORT variable; the console always listens on 22601 inside the container, and a different host port is set with the port mapping (`-p 8080:22601`).

## 1.0.4 - 2026-11-06

### FIXED
- Updates no longer roll back containers whose healthcheck first runs after the health timeout, such as one that checks every 15 minutes. Such a container is now kept once it stays running through the settle period, and the result says the healthcheck had not answered yet.

## 1.0.3 - 2026-11-05

### UPDATED
- The new notification dialog starts on "— Select one —", so a service is chosen on purpose and its fields appear once it is.
- Text boxes resize only vertically and never shrink below three lines.

### FIXED
- Update checks no longer roll the same container back on every run. A container that was already unhealthy now keeps its new image as long as it stays running, and an image that was rolled back is skipped until a newer one appears or that container is checked on its own.
- The API rate limit and the sign-in limit can no longer be reset by an IPv6 client switching addresses; IPv6 clients now count by their /56 network.
- Password managers no longer offer to fill or save the Outpost sign-in in notification and registry secret fields.

## 1.0.2 - 2026-11-03

### UPDATED
- The Compose file and Quick Start publish port 22601 on IPv6 as well as IPv4, and Outpost's network has IPv6 so the dashboard sees each IPv6 client's own address.

## 1.0.1 - 2026-11-03

### UPDATED
- Outpost uses port 22601 by default while preserving custom PORT values across startup and health checks.

## 1.0.0 - 2026-11-03

### ADDED
- The web dashboard for live overview, container, history, notification, settings, registry, token, and account-security management.
- Named, scoped access tokens with expiration, editing, revocation, and immediate live-stream enforcement.
- Configurable notifications for update results, monitor-only findings, failures, rollbacks, locked sign-ins, and secrets removed after encryption-key loss.
- Database-backed runtime settings, update history, accounts, sessions, encrypted secrets, backup continuity, and migration from the earlier account file.
- Database-backed private registry sign-ins with encrypted passwords or access tokens and recovery notices when an encryption key is lost.
- Scheduled and manual update checks with live progress, persisted reports, readable schedule summaries, HTTP API access, Watchtower-compatible routes, and Prometheus metrics.
- Self-updates that run after managed containers and use a short-lived helper to preserve data, roll back failed replacements, and avoid retrying a known-bad image.
- Safe handling for locally built images and Docker containerd image storage so registry checks do not replace host-built workloads.
- First-run account claiming with persistent sessions, sign-in rate limits, authenticator codes, recovery codes, and passkeys.
