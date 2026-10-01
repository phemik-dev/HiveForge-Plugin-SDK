/** Generic host admission registry; it never issues execution authority. */
import {
  PluginManifestSchema,
  PluginWorkFactSchema,
  pluginWorkEnvelopeSchema,
  type PluginCapability,
  type PluginManifest,
  type PluginWorkEnvelope,
  type PluginWorkFact,
} from '@hiveforge-ai/dsh-plugin-contract'

/** Validated facts grouped by admitted plugin and work identity. */
export type PluginWorkProjection = ReadonlyMap<string, ReadonlyMap<string, PluginWorkFact>>

/** Host-side admission and durable-fact registry. */
export class PluginHostRegistry {
  private readonly manifests = new Map<string, PluginManifest>()
  private readonly facts = new Map<string, Map<string, PluginWorkFact>>()
  private readonly ceiling: ReadonlySet<PluginCapability>

  /** @param capabilities - capability names this host permits plugins to request. */
  constructor(capabilities: Iterable<PluginCapability> = []) {
    this.ceiling = new Set(capabilities)
  }

  /** Register one manifest and return its exact unmount disposer. */
  register(input: unknown): () => void {
    const manifest = PluginManifestSchema.parse(input)
    if (this.manifests.has(manifest.id)) throw new Error(`plugin manifest ${JSON.stringify(manifest.id)} is already registered`)
    for (const capability of manifest.capabilities) {
      if (!this.ceiling.has(capability)) throw new Error(`plugin manifest ${JSON.stringify(manifest.id)} requests unavailable capability ${JSON.stringify(capability)}`)
    }
    this.manifests.set(manifest.id, manifest)
    return () => {
      if (this.manifests.get(manifest.id) === manifest) {
        this.manifests.delete(manifest.id)
        this.facts.delete(manifest.id)
      }
    }
  }

  /** Validate and retain a fact from an admitted plugin. */
  acceptFact(input: unknown): PluginWorkFact {
    const fact = PluginWorkFactSchema.parse(input)
    if (!this.manifests.has(fact.pluginId)) throw new Error(`plugin ${JSON.stringify(fact.pluginId)} is not admitted`)
    let byWork = this.facts.get(fact.pluginId)
    if (byWork === undefined) {
      byWork = new Map()
      this.facts.set(fact.pluginId, byWork)
    }
    byWork.set(fact.workId, fact)
    return fact
  }

  /**
   * Validate one portable Workroom envelope from the currently admitted plugin.
   * @param input - Untrusted serialized cross-host envelope.
   * @returns A detached validated envelope.
   */
  acceptEnvelope(input: unknown): PluginWorkEnvelope {
    const envelope = pluginWorkEnvelopeSchema.parse(input)
    const manifest = this.manifests.get(envelope.pluginId)
    if (manifest === undefined) throw new Error(`plugin ${JSON.stringify(envelope.pluginId)} is not admitted`)
    if (manifest.version !== envelope.pluginVersion) throw new Error('plugin work envelope version does not match its manifest')
    return structuredClone(envelope)
  }

  /** Return a detached work-fact projection suitable for restart replay. */
  projection(): PluginWorkProjection {
    return new Map([...this.facts].map(([pluginId, works]) => [pluginId, new Map(works)]))
  }

  /** Read a manifest, if it remains admitted. */
  manifest(id: string): PluginManifest | undefined {
    return this.manifests.get(id)
  }
}
