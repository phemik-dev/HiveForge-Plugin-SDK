import { describe, expect, it } from 'vitest'
import { PluginHostRegistry, PluginWorkFactStore, pluginWorkEnvelopeSchema } from '../src/index.ts'

describe('HiveForge Plugin SDK umbrella', () => {
  it('exports the contract, host, and durable store from one package', () => {
    expect(new PluginHostRegistry()).toBeDefined()
    expect(new PluginWorkFactStore()).toBeDefined()
    expect(pluginWorkEnvelopeSchema).toBeDefined()
  })
})
