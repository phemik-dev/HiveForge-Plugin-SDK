# Architecture

The SDK separates five responsibilities:

1. `plugin-contract` defines portable JSON validation and compatibility.
2. `plugin-host` owns current registration, capability ceilings, and availability.
3. A producer maps domain work into `PluginWorkEnvelope`.
4. A transport moves complete envelopes without granting authority.
5. `plugin-work-fact` persists and folds durable facts through a structural Session sink.

Current registration is process-local. Durable work evidence is Session-owned. Unmount removes current availability but never deletes historical evidence.

HiveComb remains a domain adapter because RECON grants, fences, decisions, receipts, and limitations are not generic plugin concepts. Transform is the reference plugin proving the generic path requires no domain-specific host branch.
