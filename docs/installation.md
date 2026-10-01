# Installation

## Current local prerelease

```powershell
pnpm add C:\path\to\hiveforge-ai-dsh-plugin-contract-0.1.1-rc.2-recon0041.3.tgz
```

The remaining SDK packages can be packed from this monorepo:

```powershell
pnpm install
pnpm run check
pnpm -r pack
```

## Harness integration

A headless host typically installs `plugin-contract`, `plugin-host`, and one transport. A Session-capable Harness additionally adapts `PluginWorkFactStore` to its Session append and projection services. UI is optional.

The packages are not published to npm yet. Public installation under `@hiveforge-ai` requires authorization for that npm organization.
