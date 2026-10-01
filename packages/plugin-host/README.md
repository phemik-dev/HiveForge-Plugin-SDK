# hiveforge-plugin-host

English | [中文](README.zh.md)

Headless host admission registry for generic plugin manifests and work facts. Registration enforces the host capability ceiling and returns an idempotent disposer. Portable envelopes are accepted only while the matching plugin ID and semantic version remain mounted.

## Model Experience

None, as this headless registry records admission and evidence without registering model-visible behavior.

#### KV Cache effect

None. Registry operations do not create or alter model requests.

## Known Limitations and Deferred Work

- **Process-local availability** — registration and active fact projection are process-local. Durable evidence belongs to the receiving Session store, not this registry.
