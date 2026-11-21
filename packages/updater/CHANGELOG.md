# outpost-package-updater

## 1.2.1 - 2026-11-21

### UPDATED
- Tests now report coverage through a `check:coverage` script, which fails when line, function, branch or statement coverage drops below the project minimum, and the README badges now include that coverage.
- Nova 0.49.0, which supplies the coverage thresholds behind `check:coverage` through its `VitestCoverage` toolkit and brings updated ESLint presets and stricter type checks to the workspace's tooling.
- README introduction, which now describes the project with its new long description.

## 1.2.0 - 2026-11-17

No changes.

## 1.1.0 - 2026-11-17

### FIXED
- Updates stop before touching a container when a leftover <name>-outpost-previous from an interrupted swap is in the way, and the result names it so it can be renamed or removed.

## 1.0.4 - 2026-11-06

No changes.

## 1.0.3 - 2026-11-05

No changes.

## 1.0.2 - 2026-11-03

No changes.

## 1.0.1 - 2026-11-03

No changes.

## 1.0.0 - 2026-11-03

### ADDED
- Label-based container selection, monitor-only behavior, dependency ordering, network-namespace safeguards, and self-update ordering.
- Local-image detection, per-cycle private-registry credential reuse, image cleanup, and structured update reports.
- Digest-aware image checks and container recreation that preserves runtime settings, volumes, and networks with automatic rollback.
