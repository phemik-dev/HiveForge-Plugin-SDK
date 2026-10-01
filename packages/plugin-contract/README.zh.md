# @hiveforge-ai/dsh-plugin-contract

[English](README.md) | 中文

面向 plugin manifest、capability declaration、authority/evidence reference、work fact 与 Session-bound cross-host envelope 的严格可移植 schema。`pluginWorkEnvelopeSchema` 将一个 semantic plugin version 与 monotonic producer revision 绑定到经验证的 `WorkFact`。

## Model Experience

无，因为本包只导出 schema 与 erased type，不注册 model-visible behavior。

#### KV Cache effect

无。验证不会创建或改变 model request。

## Known Limitations and Deferred Work

- **分发** — RECON proof 使用未发布 prerelease archive。registry publication 与 remote installation 不属于本 milestone。
