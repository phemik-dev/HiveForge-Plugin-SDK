import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { PluginHostRegistry } from '@hiveforge-ai/dsh-plugin-host'
import { PluginWorkFactStore, foldPluginWorkFacts, type PluginWorkEvent } from '@hiveforge-ai/dsh-plugin-work-fact'
import { PluginEnvelopeFileTransport } from '@hiveforge-ai/dsh-plugin-transport-file'
import { mountTransform, writeTransformWorkFact } from '@hiveforge-ai/dsh-plugin-example-transform'

const roots: string[] = []
afterEach(async () => { await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true }))) })

describe('standalone Plugin SDK portability', () => {
  it('moves Plugin #2 through one generic path across absence, unmount, remount, and restart', async () => {
    const root = await mkdtemp(join(tmpdir(), 'plugin-sdk-portability-'))
    roots.push(root)
    const filename = join(root, 'transform.json')
    const host = new PluginHostRegistry()
    const store = new PluginWorkFactStore()
    const events: PluginWorkEvent[] = []
    const session = { id: 'session-1', events, append: (type: 'plugin/work-fact', data: PluginWorkEvent['data']) => events.push({ type, data }) }
    const transport = new PluginEnvelopeFileTransport({ filename, sink: { record: input => store.record(session, input) } })

    expect(await transport.refresh()).toBeUndefined()
    expect(foldPluginWorkFacts(events)).toEqual([])
    await expect(writeTransformWorkFact(host, filename, session.id, '123e4567-e89b-12d3-a456-426614174000', 'hello')).rejects.toThrow('not admitted')

    const unmount = mountTransform(host)
    await writeTransformWorkFact(host, filename, session.id, '123e4567-e89b-12d3-a456-426614174000', 'hello')
    expect(await transport.refresh()).toMatchObject({ pluginId: 'transform-text', pluginVersion: '1.0.0', revision: 1 })
    unmount()
    await expect(writeTransformWorkFact(host, filename, session.id, '123e4567-e89b-12d3-a456-426614174000', 'again', 2)).rejects.toThrow('not admitted')

    const remount = mountTransform(host)
    await writeTransformWorkFact(host, filename, session.id, '123e4567-e89b-12d3-a456-426614174000', 'again', 2)
    expect(await transport.refresh()).toMatchObject({ revision: 2, fact: { data: { output: 'AGAIN', lifecycle: 'completed' } } })
    remount()

    const restarted = [...events]
    expect(foldPluginWorkFacts(restarted)).toEqual([expect.objectContaining({ pluginId: 'transform-text', revision: 2 })])
    expect(events).toHaveLength(2)
  })
})
