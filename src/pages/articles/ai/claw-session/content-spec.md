# Claw Session content specification

## Target question

If a Session JSONL file can be loaded again, which parts of an agent run are
actually restorable, and which parts still belong to permission, effect,
checkpoint, and evaluation owners?

## Pinned source

- revision: `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`
- `rust/crates/runtime/src/session.rs`
- `rust/crates/runtime/src/session_control.rs`
- `rust/crates/runtime/src/conversation.rs`

## Required structure

1. Define Session as persisted conversation state, not the whole agent runtime
   or a crash-durable effect checkpoint.
2. Name the actual fields and the three `ContentBlock` variants.
3. Follow the write order from metadata snapshot to appended prompts/messages.
4. Separate fork lineage from a restart-safe checkpoint.
5. Map the Session evidence to the six harness ownership boundaries.
6. Use one interactive state lab to show what save and fork preserve and what
   remains external.
7. Hand off from Session to compaction, then to tool dispatch.

## Forbidden claims

- A `ToolResult` is an authorization receipt.
- Fork automatically rolls back or reconciles external side effects.
- JSONL alone provides deterministic replay.
- Session owns worker scheduling, model retry policy, permission approval, or
  evaluator verdicts.
- Unpinned `main` links are sufficient provenance.

## Visual contract

The DOM lab has four states: live turn, saved session, forked session, and
external effect boundary. Switching a state must change both preserved fields
and missing evidence. Controls are at least 44 CSS pixels high and wrap without
horizontal scrolling at 390, 768, and 1440 CSS pixels.

## Hidden transfer checks

1. A `ToolResult("ok")` is present after a deployment tool call. Can the reader
   prove the deployment exists after process restart?
2. A fork changes a file, while the parent later changes the same file. Can the
   reader explain why Session lineage cannot merge those effects?
3. A JSONL message has usage tokens but no permission decision. Which owner must
   supply the missing evidence?
4. A rotated session file exists. Which metadata must still match before load?

## Stop rule

Stop when the learner can reconstruct the conversation state and identify every
external owner. Do not descend into general database event sourcing or
distributed transaction theory.
