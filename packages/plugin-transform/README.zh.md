# hiveforge-plugin-example-transform

[English](README.md) | 中文

确定性 headless reference plugin。`mountTransform()` 通过 `PluginHostRegistry` 注册 `transform-text` manifest；只有该精确 version 保持 mounted 时，`transformWorkFact()` 才会被接受并返回共享 Session-bound envelope。`writeTransformWorkFact()` 使用 SHA-256 evidence 原子发布 envelope。

## Model Experience

无，因为这个确定性 transform 只产生 host evidence，不发起 model request。

#### KV Cache effect

无。transform execution 不会创建或改变 model request。

## Known Limitations and Deferred Work

- **Reference operation** — plugin 只把一个 string 转为大写，并且不请求 ambient capability。它证明 contract 与 lifecycle，而不是任意 third-party execution。
