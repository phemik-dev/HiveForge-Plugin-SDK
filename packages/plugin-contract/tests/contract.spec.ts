import { describe, expect, it } from 'vitest'
import {
  PluginManifestSchema, PluginWorkFactSchema, pluginWorkEnvelopeSchema, semanticVersionSchema, workFactSchema,
} from '../src/index.ts'

describe('plugin contract', () => {
  it('rejects malformed manifests and duplicate capabilities', () => {
    expect(() => PluginManifestSchema.parse({ id: 'Transform', version: '', contractVersion: 2, capabilities: ['a', 'a'] })).toThrow()
  })
  it('requires an evidence digest for completed work facts', () => {
    expect(() => PluginWorkFactSchema.parse({ pluginId: 'transform.text', workId: 'receipt-1', lifecycle: 'completed', summary: 'done', evidence: [{ id: 'result', sha256: 'nope' }] })).toThrow()
  })
  it('validates Workroom-compatible durable work facts and their portable envelope', () => {
    const fact = workFactSchema.parse({ id: '123e4567-e89b-12d3-a456-426614174000', kind: 'transform', subject: 'receipt', data: { output: 'ok' }, observedAt: '2026-09-05T00:00:00.000Z', evidence: [{ kind: 'receipt', locator: 'local://receipt', digest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }] })
    expect(fact.kind).toBe('transform')
    expect(pluginWorkEnvelopeSchema.parse({
      sessionId: 'session-1', pluginId: 'transform-text', pluginVersion: '1.0.0', revision: 1, fact,
    })).toMatchObject({ pluginId: 'transform-text', pluginVersion: '1.0.0', revision: 1 })
    for (const revision of [0, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => pluginWorkEnvelopeSchema.parse({
        sessionId: 'session-1', pluginId: 'transform-text', pluginVersion: '1.0.0', revision, fact,
      })).toThrow()
    }
  })

  it('requires semantic manifest and envelope versions', () => {
    expect(semanticVersionSchema.parse('1.2.3-rc.1')).toBe('1.2.3-rc.1')
    expect(() => PluginManifestSchema.parse({ id: 'transform-text', version: 'latest', contractVersion: 1, capabilities: [] })).toThrow()
  })
})
