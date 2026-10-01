# hiveforge-plugin-host

[English](README.md) | 中文

面向 generic plugin manifest 与 work fact 的 headless host admission registry。注册会强制 host capability ceiling，并返回幂等 disposer。只有匹配的 plugin ID 与 semantic version 保持 mounted 时，portable envelope 才会被接受。

## Model Experience

无，因为这个 headless registry 记录 admission 与 evidence，不注册 model-visible behavior。

#### KV Cache effect

无。registry operation 不会创建或改变 model request。

## Known Limitations and Deferred Work

- **进程内 availability** — registration 与 active fact projection 属于进程内状态。durable evidence 属于接收方 Session store，而不属于本 registry。
