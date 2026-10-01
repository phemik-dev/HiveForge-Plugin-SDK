# Installation

## Prerelease registry installation

```bash
npm install hiveforge-plugin-sdk@next
```

The umbrella package exports the contract, host registry, durable work-fact store, and atomic-file transport. The reference plugin is optional:

```bash
npm install hiveforge-plugin-example-transform@next
```

## Public GitHub prerelease

Until npm publication completes, install the public release with one reviewed installer command.

PowerShell:

```powershell
& ([scriptblock]::Create((Invoke-RestMethod https://raw.githubusercontent.com/phemik-dev/HiveForge-Plugin-SDK/main/scripts/install-release.ps1)))
```

macOS or Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/phemik-dev/HiveForge-Plugin-SDK/main/scripts/install-release.sh | sh
```

Both scripts install the six checksum-published tarballs from `v0.1.1-rc.2`. Review the scripts before piping them into a shell when required by local security policy.

## Local tarball installation

For an air-gapped installation:

```powershell
pnpm install --frozen-lockfile --ignore-scripts
pnpm run check
pnpm run pack:all
npm install (Get-ChildItem .\dist\*.tgz | Select-Object -ExpandProperty FullName)
```

## Harness integration

A headless host imports `PluginHostRegistry` from the SDK and mounts plugin manifests. A Session-capable Harness adapts `PluginWorkFactStore` to its own append/persistence service. UI is optional and remains a consumer of the generic projection.

The standalone packages use currently unclaimed public npm names, so the first authenticated npm account can publish them without creating an organization scope.
