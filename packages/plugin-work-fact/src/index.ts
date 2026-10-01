/** Harness-neutral durable store for portable plugin work envelopes. */
import { pluginWorkEnvelopeSchema, type PluginWorkEnvelope } from 'hiveforge-plugin-contract'

export interface PluginWorkEvent {
  type: 'plugin/work-fact'
  data: PluginWorkEnvelope
}

export interface PluginSessionSink {
  id: string
  events: readonly PluginWorkEvent[] | readonly { type: string; data: unknown }[]
  append(type: 'plugin/work-fact', data: PluginWorkEnvelope): unknown
}

export type PluginWorkProjection = PluginWorkEnvelope[]

function keyOf(value: Pick<PluginWorkEnvelope, 'pluginId' | 'fact'>): string {
  return `${value.pluginId}:${value.fact.id}`
}

export function foldPluginWorkFacts(events: readonly { type: string; data: unknown }[]): PluginWorkProjection {
  let state: PluginWorkProjection = []
  for (const event of events) {
    if (event.type !== 'plugin/work-fact') continue
    const next = pluginWorkEnvelopeSchema.parse(event.data)
    const key = keyOf(next)
    const index = state.findIndex(candidate => keyOf(candidate) === key)
    state = index === -1
      ? [...state, next]
      : state.map((candidate, candidateIndex) => candidateIndex === index ? next : candidate)
  }
  return state
}

export class PluginWorkFactStore {
  prepare(session: PluginSessionSink, input: unknown): PluginWorkEnvelope {
    const next = pluginWorkEnvelopeSchema.parse(input)
    if (next.sessionId !== session.id) throw new Error('plugin work fact session mismatch')
    const current = foldPluginWorkFacts(session.events).find(candidate => keyOf(candidate) === keyOf(next))
    if (current !== undefined) {
      if (JSON.stringify(current) === JSON.stringify(next)) return next
      if (next.revision <= current.revision) throw new Error('plugin work fact is stale or out of order')
    } else if (next.revision !== 1) {
      throw new Error('first plugin work fact must have revision 1')
    }
    return structuredClone(next)
  }

  commit(session: PluginSessionSink, next: PluginWorkEnvelope): PluginWorkEnvelope {
    const current = foldPluginWorkFacts(session.events).find(candidate => keyOf(candidate) === keyOf(next))
    if (current !== undefined && JSON.stringify(current) === JSON.stringify(next)) return current
    session.append('plugin/work-fact', next)
    return next
  }

  record(session: PluginSessionSink, input: unknown): PluginWorkEnvelope {
    return this.commit(session, this.prepare(session, input))
  }
}
