import { describe, expect, it } from 'vitest'
import { PluginHostRegistry } from '../src/index.ts'

const manifest = { id: 'transform-text', version: '1.0.0', contractVersion: 1, capabilities: [] }
const fact = { pluginId: 'transform-text', workId: 'receipt-1', lifecycle: 'completed', summary: 'upper-case receipt', evidence: [{ id: 'output', sha256: 'a'.repeat(64) }] }

describe('PluginHostRegistry', () => {
  it('rejects duplicate, incompatible, and absent producers', () => {
    const host = new PluginHostRegistry(['approved.tool'])
    const dispose = host.register(manifest)
    expect(() => host.register(manifest)).toThrow('already registered')
    expect(() => host.register({ ...manifest, id: 'foreign', contractVersion: 2 })).toThrow()
    expect(() => host.acceptFact({ ...fact, pluginId: 'absent' })).toThrow('not admitted')
    dispose()
  })
  it('enforces the host capability ceiling and unmounts facts', () => {
    const host = new PluginHostRegistry()
    expect(() => host.register({ ...manifest, capabilities: ['approved.tool'] })).toThrow('unavailable capability')
    const dispose = host.register(manifest)
    host.acceptFact(fact)
    expect(host.projection().get('transform-text')?.get('receipt-1')).toEqual(fact)
    dispose()
    expect(host.manifest('transform-text')).toBeUndefined()
    expect(host.projection().size).toBe(0)

    const remount = host.register(manifest)
    expect(host.manifest('transform-text')).toEqual(manifest)
    expect(host.projection().size).toBe(0)
    host.acceptFact({ ...fact, workId: 'receipt-2' })
    expect(host.projection().get('transform-text')?.has('receipt-1')).toBe(false)
    expect(host.projection().get('transform-text')?.get('receipt-2')).toMatchObject({ summary: 'upper-case receipt' })
    remount()
    expect(host.projection().size).toBe(0)
  })

  it('keeps unrelated host admission healthy while a disposed plugin remains absent', () => {
    const host = new PluginHostRegistry()
    const unmountTransform = host.register(manifest)
    host.acceptFact(fact)
    unmountTransform()

    expect(host.manifest(manifest.id)).toBeUndefined()
    expect(host.projection().size).toBe(0)
    expect(() => host.acceptFact(fact)).toThrow('not admitted')

    const observer = { id: 'observer', version: '1.0.0', contractVersion: 1, capabilities: [] }
    const unmountObserver = host.register(observer)
    expect(host.manifest(observer.id)).toEqual(observer)
    expect(host.manifest(manifest.id)).toBeUndefined()
    unmountObserver()
    expect(host.projection().size).toBe(0)
  })
})
