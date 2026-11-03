# outpost-app-server

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
