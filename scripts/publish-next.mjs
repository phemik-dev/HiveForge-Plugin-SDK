import { execFileSync } from 'node:child_process'

const packages = [
  'hiveforge-plugin-contract',
  'hiveforge-plugin-host',
  'hiveforge-plugin-work-fact',
  'hiveforge-plugin-transport-file',
  'hiveforge-plugin-sdk',
  'hiveforge-plugin-example-transform',
]

const pnpm = process.env.npm_execpath
if (pnpm === undefined) throw new Error('publish must run through pnpm')
const dryRun = process.argv.includes('--dry-run')
for (const name of packages) {
  const args = [pnpm, '--filter', name, 'publish', '--access', 'public', '--tag', 'next', '--no-git-checks']
  if (process.env.GITHUB_ACTIONS === 'true') args.push('--provenance')
  if (dryRun) args.push('--dry-run')
  execFileSync(process.execPath, args, { stdio: 'inherit' })
}
