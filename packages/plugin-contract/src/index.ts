/** Strict, portable declarations for host-admitted plugins. */
import { z } from 'zod'

const identifier = z.string().regex(/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/)
const digest = z.string().regex(/^[a-f0-9]{64}$/)

/** Capability names requested by an admitted plugin. */
export const PluginCapabilitySchema = identifier
export type PluginCapability = z.infer<typeof PluginCapabilitySchema>

/** Host-issued reference; a manifest cannot contain one. */
export const AuthorityReferenceSchema = z.strictObject({ id: identifier, revision: z.number().int().positive() })
export type AuthorityReference = z.infer<typeof AuthorityReferenceSchema>

/** Immutable evidence named by a work fact. */
export const EvidenceReferenceSchema = z.strictObject({ id: identifier, sha256: digest })
export type EvidenceReference = z.infer<typeof EvidenceReferenceSchema>

/** Strict semantic-version text accepted by this release. */
export const semanticVersionSchema = z.string().regex(
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/,
  'expected semantic version',
)

/** Identity and compatibility declaration presented to a host. */
export const PluginManifestSchema = z.strictObject({
  id: identifier,
  version: semanticVersionSchema,
  contractVersion: z.literal(1),
  capabilities: z.array(PluginCapabilitySchema).max(32).superRefine((value, ctx) => {
    if (new Set(value).size !== value.length) ctx.addIssue({ code: 'custom', message: 'capabilities must be unique' })
  }),
})
export type PluginManifest = z.infer<typeof PluginManifestSchema>

/** Durable, host-validated lifecycle observation for one plugin work item. */
export const PluginWorkFactSchema = z.strictObject({
  pluginId: identifier,
  workId: identifier,
  lifecycle: z.enum(['proposed', 'admitted', 'completed', 'failed']),
  summary: z.string().min(1),
  authority: AuthorityReferenceSchema.optional(),
  evidence: z.array(EvidenceReferenceSchema),
})
export type PluginWorkFact = z.infer<typeof PluginWorkFactSchema>

/** Stable lower-kebab identifier for plugin-owned work facts. */
export const pluginIdentifierSchema = z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/, 'expected lower-kebab identifier')
/** Evidence a plugin associates with a durable work fact. */
export const evidenceSchema = z.strictObject({
  kind: pluginIdentifierSchema,
  locator: z.string().min(1),
  digest: z.string().regex(/^sha256:[a-f0-9]{64}$/, 'expected sha256 digest').optional(),
})
/** One validated, JSON-durable fact reported by admitted plugin work. */
export const workFactSchema = z.strictObject({
  id: z.uuid(),
  kind: pluginIdentifierSchema,
  subject: z.string().min(1),
  data: z.json(),
  observedAt: z.iso.datetime({ offset: true }),
  evidence: z.array(evidenceSchema),
})
export type Evidence = z.infer<typeof evidenceSchema>
export type WorkFact = z.infer<typeof workFactSchema>

/** Portable cross-host envelope for one Session-bound plugin work update. */
export const pluginWorkEnvelopeSchema = z.strictObject({
  sessionId: z.string().min(1),
  pluginId: pluginIdentifierSchema,
  pluginVersion: semanticVersionSchema,
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  fact: workFactSchema,
})
/** Portable cross-host envelope for one Session-bound plugin work update. */
export type PluginWorkEnvelope = z.infer<typeof pluginWorkEnvelopeSchema>
