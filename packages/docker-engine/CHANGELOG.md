# outpost-package-docker-engine

## 1.2.1 - 2026-11-21

### UPDATED
- Tests now report coverage through a `check:coverage` script, which fails when line, function, branch or statement coverage drops below the project minimum, and the README badges now include that coverage.
- Nova 0.49.0, which supplies the coverage thresholds behind `check:coverage` through its `VitestCoverage` toolkit and brings updated ESLint presets and stricter type checks to the workspace's tooling.
- README introduction, which now describes the project with its new long description.

## 1.2.0 - 2026-11-17

No changes.

## 1.1.0 - 2026-11-17

No changes.

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
- A validated Docker Engine API client for container, image, network, and lifecycle operations over the local Unix socket.
