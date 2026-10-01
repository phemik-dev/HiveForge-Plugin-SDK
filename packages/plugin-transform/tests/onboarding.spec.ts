import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { PluginHostRegistry } from '@hiveforge-ai/dsh-plugin-host'
import { mountTransform, transformReceipt, transformWorkFact } from '../src/index.ts'

describe('transform.text reference plugin', () => {
  it('onboards through generic registration and emits deterministic evidence', () => {
    const host = new PluginHostRegistry()
    expect(() => transformReceipt(host, 'receipt-absent', 'not mounted')).toThrow('not admitted')
    const unmount = mountTransform(host)
    const fact = transformReceipt(host, 'receipt-1', 'hello receipt')
    expect(fact).toMatchObject({ pluginId: 'transform-text', summary: 'HELLO RECEIPT' })
    expect(fact.evidence[0]?.sha256).toBe(createHash('sha256').update('HELLO RECEIPT').digest('hex'))
    expect(host.projection().get('transform-text')?.get('receipt-1')).toEqual(fact)
    unmount()
    expect(() => transformReceipt(host, 'receipt-after-unmount', 'unmounted')).toThrow('not admitted')
    expect(host.projection().size).toBe(0)

    const remount = mountTransform(host)
    const remountedFact = transformReceipt(host, 'receipt-2', 'hello again')
    expect(remountedFact.summary).toBe('HELLO AGAIN')
    expect(host.projection().get('transform-text')?.has('receipt-1')).toBe(false)
    remount()
  })

  it('emits the shared generic Workroom transport envelope only while admitted', () => {
    const host = new PluginHostRegistry()
    expect(() => transformWorkFact(
      host,
      'session-1',
      '123e4567-e89b-12d3-a456-426614174000',
      'hello receipt',
    )).toThrow('not admitted')
    const unmount = mountTransform(host)
    const envelope = transformWorkFact(
      host,
      'session-1',
      '123e4567-e89b-12d3-a456-426614174000',
      'hello receipt',
    )

    expect(envelope).toMatchObject({
      sessionId: 'session-1',
      pluginId: 'transform-text',
      pluginVersion: '1.0.0',
      revision: 1,
      fact: { kind: 'transform', subject: 'hello receipt', data: { output: 'HELLO RECEIPT', lifecycle: 'completed' } },
    })
    expect(envelope.fact.evidence[0]?.digest).toBe(
      `sha256:${createHash('sha256').update('HELLO RECEIPT').digest('hex')}`,
    )
    unmount()
    expect(() => transformWorkFact(
      host,
      'session-1',
      '123e4567-e89b-12d3-a456-426614174000',
      'hello receipt',
    )).toThrow('not admitted')
  })
})
