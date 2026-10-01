# hiveforge-plugin-contract

English | [中文](README.zh.md)

Strict portable schemas for plugin manifests, capability declarations, authority/evidence references, work facts, and Session-bound cross-host envelopes. `pluginWorkEnvelopeSchema` binds one semantic plugin version and monotonic producer revision to a validated `WorkFact`.

## Model Experience

None, as this package exports schemas and erased types without registering model-visible behavior.

#### KV Cache effect

None. Validation does not create or alter model requests.

## Known Limitations and Deferred Work

- **Distribution** — the RECON proof uses an unpublished prerelease archive. Registry publication and remote installation remain outside this milestone.
