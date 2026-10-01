import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const destination = resolve('dist')
const pnpm = process.env.npm_execpath
if (pnpm === undefined) throw new Error('pack must run through pnpm')
mkdirSync(destination, { recursive: true })
execFileSync(process.execPath, [pnpm, '-r', '--filter', './packages/*', 'pack', '--pack-destination', destination], {
  cwd: process.cwd(),
  stdio: 'inherit',
})
