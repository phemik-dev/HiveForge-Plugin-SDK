import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { PluginEnvelopeFileTransport, writePluginEnvelope } from '../src/index.ts'

const roots: string[] = []
const value = { sessionId: 'session-1', pluginId: 'transform-text', pluginVersion: '1.0.0', revision: 1, fact: { id: '123e4567-e89b-12d3-a456-426614174000', kind: 'transform', subject: 'hello', data: { output: 'HELLO' }, observedAt: '2026-09-05T00:00:00.000Z', evidence: [] } }

afterEach(async () => Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true }))).then(() => undefined))

describe('PluginEnvelopeFileTransport', () => {
  it('publishes complete envelopes, retains absence, and suppresses unchanged reads', async () => {
    const root = await mkdtemp(join(tmpdir(), 'plugin-sdk-file-'))
    roots.push(root)
    const filename = join(root, 'fact.json')
    const received: unknown[] = []
    const transport = new PluginEnvelopeFileTransport({ filename, sink: { record: input => { received.push(input); return input } } })
    expect(await transport.refresh()).toBeUndefined()
    await writePluginEnvelope(filename, value)
    expect(await transport.refresh()).toEqual(value)
    expect(await transport.refresh()).toEqual(value)
    expect(received).toHaveLength(1)
    await rm(filename)
    expect(await transport.refresh()).toEqual(value)
  })

  it('rejects malformed replacements without losing the accepted value', async () => {
    const root = await mkdtemp(join(tmpdir(), 'plugin-sdk-file-'))
    roots.push(root)
    const filename = join(root, 'fact.json')
    const transport = new PluginEnvelopeFileTransport({ filename, sink: { record: input => input } })
    await writePluginEnvelope(filename, value)
    await transport.refresh()
    await writeFile(filename, '{"bad":true}\n')
    await expect(transport.refresh()).rejects.toThrow()
    expect(transport.latest).toEqual(value)
  })
})
