import { describe, expect, it } from 'vitest'
import { PluginWorkFactStore, foldPluginWorkFacts, type PluginWorkEvent } from '../src/index.ts'

function envelope(pluginId: string, id: string, revision = 1) {
  return {
    sessionId: 'session-1', pluginId, pluginVersion: '1.0.0', revision,
    fact: { id, kind: 'progress', subject: pluginId, data: { lifecycle: 'completed' }, observedAt: '2026-09-05T00:00:00.000Z', evidence: [] },
  }
}

function session() {
  const events: PluginWorkEvent[] = []
  return { id: 'session-1', events, append: (type: 'plugin/work-fact', data: PluginWorkEvent['data']) => events.push({ type, data }) }
}

describe('PluginWorkFactStore', () => {
  it('tracks multiple identities, orders revisions, and replays idempotently', () => {
    const store = new PluginWorkFactStore()
    const target = session()
    const first = envelope('hivecomb-recon', '123e4567-e89b-12d3-a456-426614174000')
    const second = envelope('transform-text', '123e4567-e89b-12d3-a456-426614174001')
    store.record(target, first)
    store.record(target, second)
    store.record(target, first)
    expect(target.events).toHaveLength(2)
    expect(foldPluginWorkFacts(target.events).map(value => value.pluginId)).toEqual(['hivecomb-recon', 'transform-text'])
    expect(() => store.record(target, { ...first, fact: { ...first.fact, subject: 'changed' } })).toThrow('stale')
  })

  it('preflights before commit and reconstructs after restart', () => {
    const store = new PluginWorkFactStore()
    const target = session()
    const first = envelope('transform-text', '123e4567-e89b-12d3-a456-426614174001')
    const prepared = store.prepare(target, first)
    expect(target.events).toHaveLength(0)
    store.commit(target, prepared)
    const restarted = { ...session(), events: [...target.events] }
    expect(foldPluginWorkFacts(restarted.events)).toEqual([first])
  })
})
