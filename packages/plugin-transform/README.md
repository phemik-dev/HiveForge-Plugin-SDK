# hiveforge-plugin-example-transform

English | [中文](README.zh.md)

Deterministic headless reference plugin. `mountTransform()` registers the `transform-text` manifest through `PluginHostRegistry`; `transformWorkFact()` is accepted only while that exact version remains mounted and returns the shared Session-bound envelope. `writeTransformWorkFact()` publishes it atomically with SHA-256 evidence.

## Model Experience

None, as this deterministic transform emits host evidence without making a model request.

#### KV Cache effect

None. Transform execution does not create or alter model requests.

## Known Limitations and Deferred Work

- **Reference operation** — the plugin uppercases one string and requests no ambient capability. It proves the contract and lifecycle, not arbitrary third-party execution.
