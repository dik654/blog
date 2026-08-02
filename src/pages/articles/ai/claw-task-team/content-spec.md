# Claw Task control plane content specification

## Target question

When `RunTaskPacket`, `TeamCreate`, or `CronCreate` returns JSON, did any worker
or schedule actually execute, or did the runtime only create an in-memory
control record?

## Pinned source

- revision: `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`
- `rust/crates/runtime/src/task_packet.rs`
- `rust/crates/runtime/src/task_registry.rs`
- `rust/crates/runtime/src/team_cron_registry.rs`
- `rust/crates/tools/src/lib.rs`
- focused source tests:
  - `cargo test -p runtime task_packet --lib`
  - `cargo test -p runtime team_cron_registry --lib`
  - `cargo test -p tools run_task_packet_creates_packet_backed_task --lib`

## Required structure

1. Begin with the control-plane record versus execution-plane effect
   distinction.
2. Follow one actual packet through ToolSpec schema, serde deserialization,
   `validate_packet`, `TaskRegistry::create_from_packet`, and the returned
   `Created` JSON.
3. Separate the model-facing ToolSpec from the Rust `TaskPacket`. The schema
   exposes neither `scope_path` nor `worktree` and forbids additional
   properties, while validation requires `scope_path` for
   module/single-file/custom. Therefore only workspace scope can pass through a
   schema-conforming model call in the pinned revision. Then explain the
   remaining validation rules: required strings and non-empty acceptance test
   strings.
4. Explain TaskRegistry as `Arc<Mutex<HashMap>>` state: create/get/list,
   message/output append, unrestricted `set_status`, terminal-only stop guard,
   team id assignment, and process-lifetime storage.
5. Expose the current TeamCreate schema/wiring contradiction: the item schema
   documents prompt/description and does not forbid extra item properties,
   while `run_team_create` only extracts the undocumented `task_id`; ordinary
   prompt/description calls therefore produce an empty task id list.
6. Explain CronRegistry as schedule-string storage, not a scheduler. The public
   tools create/delete/list records, and agent completion may separately
   disable keyword-matched records; no parser, clock loop, task spawn, lease,
   or `record_run` call is shown in the scoped source.
7. End with the minimum production handoff: schema repair, worker executor,
   terminal receipt, durable store, scheduler/lease/idempotency, and integration
   tests.

## Forbidden claims

- `TaskPacket` has Goal, Constraint, AcceptanceCriterion, dependency, deadline,
  tag, or completion callback fields.
- `TaskStatus` has Pending, Assigned, InProgress, Review, Rejected states.
- `TaskRegistry` persists itself to disk.
- `RunTaskPacket` launches a subprocess or advances status to Running.
- `TeamRegistry` assigns by tags or manages a worker pool.
- `CronRegistry` parses cron expressions or has a scheduler loop.
- `resolve_scope`, `check_completion`, `assign_by_team`, or `CronScheduler`
  exists in the pinned implementation.
- Private Claude Code implementation comparisons without a public source.

## Visual contract

Use one DOM-based causal lab with four tabs:

1. Packet: a schema-valid workspace case passes; a module case cannot provide
   the required `scope_path` and shows the exact validation failure.
2. Task: distinguish `Created` record, manually changed status, output string,
   and missing worker receipt.
3. Team: contrast model-facing schema fields with executor-consumed `task_id`
   and make the empty assignment result visible.
4. Cron: distinguish stored schedule text from absent parser, clock, spawn, and
   lease owners.

The lab must have no SVG diagram or chart beyond Lucide control/status icons,
no horizontal scrolling, controls at least 44 CSS pixels high, and readable
labels at 390, 768, and 1440 CSS pixels.

## Hidden transfer checks

1. `RunTaskPacket` returns `{"status":"created"}`. Can the reader prove any
   command ran?
2. The model sends `scope=module` using only schema-exposed fields. Can the
   reader predict the missing `scope_path` validation failure and identify the
   schema repair rather than inventing a worker failure?
3. `set_status(task, Completed)` is called directly after create. Can the reader
   detect the missing state transition guard and acceptance evidence?
4. A schema-valid TeamCreate call sends two prompt objects. Can the reader
   predict why `task_count` is zero?
5. CronCreate stores `*/5 * * * *`. Can the reader list every missing component
   before claiming five-minute execution?
6. Process restart occurs. Which task, team, and cron state survives?

## Stop rule

Stop after the learner can separate record creation, execution, and verification
and can point to the exact current gaps. Do not descend into a full distributed
scheduler history or generic project-management theory.
