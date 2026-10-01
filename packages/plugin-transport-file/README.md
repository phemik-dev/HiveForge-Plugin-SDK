# @hiveforge-ai/dsh-plugin-transport-file

Atomic-file transport for `PluginWorkEnvelope` documents. Writers validate and atomically replace complete JSON files. Readers retain the latest accepted result during producer absence and suppress unchanged input. Authority and Session persistence remain owned by the configured host sink.
