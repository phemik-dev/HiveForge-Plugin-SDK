# @hiveforge-ai/dsh-plugin-work-fact

Harness-neutral durable storage logic for validated plugin work envelopes. It preflights Session binding and revision order, appends `plugin/work-fact`, folds the latest fact for every `(pluginId, workId)` identity, and treats exact replay idempotently.

Harness integrations provide a structural Session sink. This package does not depend on Cordis, React, Workroom, or a model runtime.
