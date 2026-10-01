/** Deterministic independent reference plugin using generic host admission. */
import { createHash } from 'node:crypto'
import { writePluginEnvelope } from '@hiveforge-ai/dsh-plugin-transport-file'
import { pluginWorkEnvelopeSchema, workFactSchema } from '@hiveforge-ai/dsh-plugin-contract'
import type { PluginWorkEnvelope, PluginWorkFact } from '@hiveforge-ai/dsh-plugin-contract'
import { PluginHostRegistry } from '@hiveforge-ai/dsh-plugin-host'

/** Plugin #2's standard manifest: it requests no ambient execution capability. */
export const transformManifest = {
  id: 'transform-text',
  version: '1.0.0',
  contractVersion: 1,
  capabilities: [],
} as const

/** Deterministically uppercase one receipt and retain a digest as durable evidence. */
export function transformReceipt(host: PluginHostRegistry, workId: string, input: string): PluginWorkFact {
  const output = input.toUpperCase()
  const sha256 = createHash('sha256').update(output).digest('hex')
  return host.acceptFact({
    pluginId: transformManifest.id,
    workId,
    lifecycle: 'completed',
    summary: output,
    evidence: [{ id: 'transform-output', sha256 }],
  })
}

/**
 * Produce the portable generic Workroom transport envelope for one transform result.
 * @param sessionId - Exact Workroom Session selected by the receiving host.
 * @param workId - Stable UUID identity for this transform work item.
 * @param input - Text transformed by this deterministic producer.
 * @param revision - Strictly increasing producer revision for this work item.
 * @returns JSON validated against the shared generic work-fact transport.
 */
export function transformWorkFact(
  host: PluginHostRegistry,
  sessionId: string,
  workId: string,
  input: string,
  revision = 1,
  observedAt = new Date().toISOString(),
): PluginWorkEnvelope {
  const output = input.toUpperCase()
  const digest = createHash('sha256').update(output).digest('hex')
  const fact = workFactSchema.parse({
    id: workId,
    kind: 'transform',
    subject: input,
    data: { output, lifecycle: 'completed' },
    observedAt,
    evidence: [{ kind: 'transform-output', locator: `sha256:${digest}`, digest: `sha256:${digest}` }],
  })
  return host.acceptEnvelope(pluginWorkEnvelopeSchema.parse({
    sessionId,
    pluginId: transformManifest.id,
    pluginVersion: transformManifest.version,
    revision,
    fact,
  }))
}

/**
 * Atomically publish one generic transform fact for a host-selected Workroom transport.
 * @param filename - Host-selected destination for the complete JSON document.
 * @param sessionId - Exact Workroom Session selected by the receiving host.
 * @param workId - Stable UUID identity for this transform work item.
 * @param input - Text transformed by this deterministic producer.
 * @param revision - Strictly increasing producer revision for this work item.
 * @returns The published transport envelope.
 */
export async function writeTransformWorkFact(
  host: PluginHostRegistry,
  filename: string,
  sessionId: string,
  workId: string,
  input: string,
  revision = 1,
): Promise<ReturnType<typeof transformWorkFact>> {
  const envelope = transformWorkFact(host, sessionId, workId, input, revision)
  await writePluginEnvelope(filename, envelope)
  return envelope
}

/** Mount this plugin through ordinary host registration. */
export function mountTransform(host: PluginHostRegistry): () => void {
  return host.register(transformManifest)
}
