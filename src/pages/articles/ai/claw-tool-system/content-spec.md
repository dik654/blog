# Claw Tool System content spec

## Reader outcome

The reader must separate four contracts that are easy to collapse:

1. a tool definition is visible to the model;
2. a permission policy can authorize, deny, or ask about the invocation;
3. an executor allowlist and dispatch table can actually admit the named tool;
4. the runtime can normalize an executor return or pre-execution failure into
   an observed `ToolResult`.

## Source boundary

Source snapshot: Claw Code commit `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`.

Primary local sources:

- `/home/heru/code/claw-code/rust/crates/tools/src/lib.rs`
- `/home/heru/code/claw-code/rust/crates/runtime/src/permissions.rs`
- `/home/heru/code/claw-code/rust/crates/runtime/src/permission_enforcer.rs`
- `/home/heru/code/claw-code/rust/crates/runtime/src/conversation.rs`

Current source contains:

- built-in, runtime, and plugin definition composition;
- name-conflict rejection;
- allowed-tool normalization and filtering;
- separate definition and permission-spec projections;
- built-in match dispatch, plugin execution, and a separate runtime-tool path in
  the higher-level runtime;
- dynamic bash/PowerShell permission classification;
- a conversation loop that records executor returns, permission denials, and
  hook failures as observations.

Do not claim that registry exposure alone proves dispatch support. In particular,
`GlobalToolRegistry::execute` handles built-ins and plugin tools, while runtime
tool execution is wired by the higher-level runtime path.

Do not claim that `Prompt` always opens a prompt. The production
`PermissionPolicy::authorize_with_context` may allow an ordinary Prompt
requirement under the active mode. An ask rule or hook `Ask` result invokes the
prompter. `PermissionEnforcer` is a separate projection and is not the whole CLI
authorization path.

## Private transfer problem

For a built-in read, a mutating shell command, a plugin tool, a discovered
runtime tool, and a forged hidden tool call, decide:

- whether the definition can be shown to the model;
- where its permission requirement comes from;
- whether authorization invokes the prompter;
- whether the executor allowlist admits the forced call;
- which executor owns the effect;
- what receipt or observation must return before the next model turn.

The article succeeds only if the reader can identify a visible-but-not-dispatched
integration bug and can explain how a hidden tool call may still reach the
permission and executor gates when injected outside normal model selection.

## Section plan

1. **Four independent gates**
   - Visible, authorized, dispatched, observed.
   - Interactive lab changes origin, allowlist, permission mode, and action.
2. **Registry projection**
   - Collision checks and canonicalized allowed-tool names.
   - `definitions()` and `permission_specs()` are separate projections.
3. **Execution boundary**
   - Built-in match dispatch and typed input parsing.
   - Plugin and runtime execution ownership.
   - Unknown tools return errors rather than invented effects.
4. **Permission boundary**
   - Static tool requirements versus dynamic command classification.
   - Separate plain Prompt requirements from ask rules and hook `Ask` outcomes.
   - Explain which branch invokes the prompter in the production policy path.
5. **Observation closure**
   - An executor return or pre-execution denial/failure can become the next
     normalized observation.
   - Timeout and ambiguous effects require receipt/state verification before
     retry; this is a production design requirement, not a current Claw
     durability guarantee.

## Viz contract

The lab must:

- use responsive HTML rather than a tiny SVG;
- show the current path through definition, permission, executor, and receipt;
- change the outcome when origin/action/mode changes;
- allow a forced hidden call so definition filtering and executor allowlisting
  cannot be mistaken for the same gate;
- expose a visible warning for a definition whose executor path is not wired;
- avoid decorative scores or unsupported performance numbers.
