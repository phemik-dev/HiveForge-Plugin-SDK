# Installation

## Prerelease registry installation

```bash
npm install hiveforge-plugin-sdk@next
```

The umbrella package exports the contract, host registry, durable work-fact store, and atomic-file transport. The reference plugin is optional:

```bash
npm install hiveforge-plugin-example-transform@next
```

## Local tarball installation

Before registry publication, or for an air-gapped installation:

```powershell
pnpm install --frozen-lockfile --ignore-scripts
pnpm run check
pnpm run pack:all
npm install .\dist\hiveforge-plugin-sdk-0.1.1-rc.2.tgz
```

## Harness integration

A headless host imports `PluginHostRegistry` from the SDK and mounts plugin manifests. A Session-capable Harness adapts `PluginWorkFactStore` to its own append/persistence service. UI is optional and remains a consumer of the generic projection.

The standalone packages use currently unclaimed public npm names, so the first authenticated npm account can publish them without creating an organization scope.
