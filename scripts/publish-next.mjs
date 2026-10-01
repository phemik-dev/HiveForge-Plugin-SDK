import { execFileSync } from 'node:child_process'

const packages = [
  '@hiveforge-ai/dsh-plugin-contract',
  '@hiveforge-ai/dsh-plugin-host',
  '@hiveforge-ai/dsh-plugin-work-fact',
  '@hiveforge-ai/dsh-plugin-transport-file',
  '@hiveforge-ai/dsh-plugin-sdk',
  '@hiveforge-ai/dsh-plugin-example-transform',
]

const pnpm = process.env.npm_execpath
if (pnpm === undefined) throw new Error('publish must run through pnpm')
const dryRun = process.argv.includes('--dry-run')
for (const name of packages) {
  const args = [pnpm, '--filter', name, 'publish', '--access', 'public', '--tag', 'next', '--no-git-checks']
  if (dryRun) args.push('--dry-run')
  execFileSync(process.execPath, args, { stdio: 'inherit' })
}
