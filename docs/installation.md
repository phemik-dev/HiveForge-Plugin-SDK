# Installation

## Prerelease registry installation

```bash
npm install @hiveforge-ai/dsh-plugin-sdk@next
```

The umbrella package exports the contract, host registry, durable work-fact store, and atomic-file transport. The reference plugin is optional:

```bash
npm install @hiveforge-ai/dsh-plugin-example-transform@next
```

## Local tarball installation

Before registry publication, or for an air-gapped installation:

```powershell
pnpm install --frozen-lockfile --ignore-scripts
pnpm run check
pnpm run pack:all
npm install .\dist\hiveforge-ai-dsh-plugin-sdk-0.1.1-rc.2.tgz
```

## Harness integration

A headless host imports `PluginHostRegistry` from the SDK and mounts plugin manifests. A Session-capable Harness adapts `PluginWorkFactStore` to its own append/persistence service. UI is optional and remains a consumer of the generic projection.

Public publication under `@hiveforge-ai` requires npm organization authorization. Until that access exists, the tarballs in `dist/` are the installable release artifacts.
