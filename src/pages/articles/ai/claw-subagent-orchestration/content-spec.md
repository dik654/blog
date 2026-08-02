# Claw Subagent Orchestration content spec

## Reader outcome

The reader must be able to trace one `Agent` tool call from input validation to
the immediate running manifest, then to the background worker's completed or
failed terminal manifest. They must also predict the tool boundary for a known
alias, a blank type, and an unknown custom type.

## Source boundary

Source snapshot: Claw Code commit
`ab44985916cb0d53d2f7a55ea90e0d7be97d4626`.

Primary local sources:

- `/home/heru/code/claw-code/rust/crates/tools/src/lib.rs`
- `/home/heru/code/claw-code/rust/crates/runtime/src/conversation.rs`

Current source contains:

- required `description` and `prompt`, plus optional type, name, and model;
- alias normalization and a fixed per-type tool allowlist;
- a broad default allowlist for unknown types;
- one fresh `Session` and a maximum of 32 conversation iterations;
- output and manifest files written before a background thread starts;
- panic/error conversion into a failed terminal manifest and lane event.
- transcript isolation through a fresh `Session`, but no separate process,
  filesystem, working directory, environment, or network containment;
- ordinary filesystem writes for terminal manifests, without an atomic rename,
  lock, or `sync_all` durability protocol.

Current source does not contain:

- dynamic worker ranking;
- parent-context inheritance;
- a lease, deadline, global token budget, or late-result merge window;
- parent-side artifact acceptance and effect verification.
- parent task/session/trace propagation into the worker;
- a connected telemetry → policy → recovery production pipeline.

## Private transfer problem

Given three requests whose types are `explorer`, blank, and
`security-review`, predict the normalized type and whether `edit_file` reaches
the executor allowlist. Then explain what the caller knows at the moment
`execute_agent_with_spawn` returns, and what additional evidence is required
before a parent may accept the eventual worker result.

The article succeeds only if the reader notices that an unknown type is not a
fail-closed registry miss and that a running manifest is not a completed task.

## Section plan

1. **Spawn contract**
   - Validate input and create disk paths.
   - Distinguish the immediate running manifest from terminal evidence.
2. **Worker isolation**
   - Fresh `Session`, bounded iterations, system prompt, and allowed tools.
   - Use the same allowlist for model-visible definitions and executor checks.
   - Separate transcript isolation from process, filesystem, environment, and
     network containment.
3. **Type interpretation**
   - Alias, blank, canonical, and unknown branches.
   - Explain why the broad unknown fallback is a security design gap.
4. **Terminal persistence**
   - Completed, runtime failure, spawn failure, and panic paths.
   - Explain what output/manifest/lane events prove and do not prove.
   - A terminal manifest write is not crash-durable; failure can leave stale
     `running` state.
5. **Parent handoff**
   - Connect manifest evidence to telemetry, policy, and recovery.
   - Keep trace/task IDs, lease, deadline, acceptance, late-result handling,
     and cross-module wiring explicitly proposed.

## Viz contract

The labs must:

- change the normalized type and executable tools when the request changes;
- show the immediate `running` return separately from background terminal state;
- expose unknown-type broad fallback without describing it as safe;
- show that allowlist filtering occurs both before model choice and before
  executor dispatch;
- label a fresh Session as transcript isolation, not a sandbox;
- distinguish an attempted terminal write from an acknowledged durable receipt;
- remain readable without horizontal scrolling at 360px.
