# Publishing

## First publication

The first npm publication requires an authenticated npm account. The unscoped `hiveforge-plugin-*` names were checked as available, so no npm organization is required.

```bash
npm login
npm whoami
pnpm run publish:next
```

Packages publish in dependency order under the `next` dist-tag.

## Trusted publishing

After the packages exist, configure each package on npm with this GitHub trusted publisher:

- Organization or user: `phemik-dev`
- Repository: `HiveForge-Plugin-SDK`
- Workflow: `publish.yml`
- Environment: leave empty unless repository policy requires one

Then run the `Publish prerelease` workflow from GitHub Actions. It uses OIDC provenance and requires no long-lived npm token in repository secrets.

## Verification

```bash
npm view hiveforge-plugin-sdk@next version
npm install hiveforge-plugin-sdk@next
```
