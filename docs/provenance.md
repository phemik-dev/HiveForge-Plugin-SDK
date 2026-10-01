# Provenance

The standalone SDK consolidates generic code proven in two integration repositories.

## HiveForge-Build

Repository: `phemik-dev/HiveForge-Build`

Relevant commits:

- `6432e89` — initial contract, host, and Transform reference
- `4de2c0b` — generic Transform work facts
- `caf2599` — atomic Transform publication
- `56bda69` — portable envelope and lifecycle completion
- `feb5b96` — host absence proof

## HiveForge-Workroom

Repository: `phemik-dev/HiveForge-Workroom`

Relevant commits:

- `b241b16` — generic durable Session fact/projection
- `3ae6f39` — HiveComb generic dual emission
- `d145b40` — generic revision sequencing
- `ceb74a1` — generic file transport
- `a3e8bc7` — generic projection integration
- `bec0241` — portability completion
- `997325b` and `80e7b9b` — HiveComb absence/lifecycle proof

The original integration branches remain consumer evidence. This repository becomes the canonical home for generic SDK packages; HiveComb-specific RECON translation remains outside it.

## Contract artifact

The final local prerelease used in portability proof was `@hiveforge-ai/dsh-plugin-contract@0.1.1-rc.2-recon0041.3`, SHA-256 `2b5e5d713644dfee71f225ea1a7da35d40ca93d0df7e41f42284fd2eba6e8a1d`.
