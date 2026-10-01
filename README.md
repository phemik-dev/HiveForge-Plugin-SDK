# HiveForge Plugin SDK

A versioned, capability-aware, headless-compatible protocol and host architecture for registering plugins, transporting durable work facts across HiveForge processes, persisting them in Sessions, and reconstructing multi-plugin state without plugin-specific core infrastructure.

## Packages

| Package | Role |
|---|---|
| `hiveforge-plugin-sdk` | One-package SDK entry point |
| `hiveforge-plugin-contract` | Strict manifest, evidence, work-fact, and cross-host envelope schemas |
| `hiveforge-plugin-host` | Headless registration, capability ceiling, admission, unmount, and remount |
| `hiveforge-plugin-work-fact` | Harness-neutral durable event store and multi-plugin projection fold |
| `hiveforge-plugin-transport-file` | Atomic-file producer/consumer transport |
| `hiveforge-plugin-example-transform` | Independent deterministic reference plugin |

## Generic path

```text
plugin
→ manifest registration
→ portable work-fact envelope
→ transport provider
→ durable plugin/work-fact
→ multi-plugin projection
```

HiveComb is a domain integration using this path; it is not part of the generic SDK core.

## Install

```bash
npm install hiveforge-plugin-sdk@next
```

Install the reference plugin separately when needed:

```bash
npm install hiveforge-plugin-example-transform@next
```

## Development

```powershell
pnpm install
pnpm run check
pnpm run pack:all
```

## Distribution status

This repository is a prerelease consolidation. Packages are configured for public npm publication under unscoped `hiveforge-plugin-*` names; npm account authentication is the only remaining registry prerequisite.

See [`docs/architecture.md`](docs/architecture.md), [`docs/installation.md`](docs/installation.md), [`docs/publishing.md`](docs/publishing.md), and [`docs/provenance.md`](docs/provenance.md).
