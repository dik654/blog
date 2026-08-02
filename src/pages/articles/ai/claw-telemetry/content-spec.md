# Claw Telemetry content spec

## Reader outcome

The reader must be able to predict the exact event count and sequence-bearing
records produced by a direct trace, an HTTP helper, and an analytics helper.
They must also distinguish instrumentation from delivery guarantees.

## Source boundary

Source snapshot: Claw Code commit
`ab44985916cb0d53d2f7a55ea90e0d7be97d4626`.

Primary local sources:

- `/home/heru/code/claw-code/rust/crates/telemetry/src/lib.rs`
- `/home/heru/code/claw-code/rust/crates/runtime/src/conversation.rs`

Current source contains:

- five `TelemetryEvent` variants;
- a synchronous `TelemetrySink::record` method with no result;
- unbounded in-memory storage and append-only JSONL storage;
- one sequence counter shared by clones of a `SessionTracer`;
- helper methods that emit a typed event and a second sequence-bearing trace;
- opt-in `ConversationRuntime` instrumentation for turn and tool boundaries.
- no common event ID between a typed envelope and its companion trace record;
- no tool-call, operation, task, lane, action, or recovery ID sufficient for
  cross-module causal pairing.

Current source does not contain:

- a bounded queue, exporter worker, retry, batch, backpressure, or shutdown
  drain;
- a sink-visible delivery error;
- redaction or privacy policy;
- token/cost events in the telemetry enum.
- a delivery receipt that proves JSONL bytes survived `writeln`, `flush`, process
  crash, and storage acknowledgement.

## Private transfer problem

Start a tracer at sequence zero. Emit HTTP-started, a direct trace, and
analytics in that order. Derive:

- the number and order of sink records;
- which records carry sequence values and what those values are;
- what the caller can infer after a JSONL `writeln` or `flush` failure;
- whether two same-name tool calls in one iteration can be paired uniquely;
- whether a typed event and its companion trace can be rejoined after one side
  is lost;
- whether a runtime without `with_session_tracer` emits any of these records.

The article succeeds only if the reader avoids assigning a sequence to the
typed HTTP/analytics envelope and does not confuse silent loss with durable
delivery.

## Section plan

1. **Instrumentation boundary**
   - `ConversationRuntime` starts with no tracer.
   - `with_session_tracer` enables turn/tool records.
2. **Event topology**
   - Five enum variants.
   - Helper calls can produce two sink records for one logical fact.
3. **Sequence semantics**
   - Sequence belongs only to `SessionTraceRecord`.
   - Cloned tracers share an atomic counter; ordering is scoped to one tracer.
4. **Sink semantics**
   - Memory `Vec` and JSONL append/flush behavior.
   - Synchronous latency and silent loss boundaries.
5. **Production handoff**
   - Specify operation/correlation IDs, parent links, queue, overflow, retry,
     redaction, storage acknowledgement, and shutdown contracts before adding a
     remote exporter.

## Viz contract

The lab must:

- show exact sink record order and trace sequence values;
- change behavior when instrumentation, event helper, sink, or write outcome
  changes;
- distinguish `producer returned` from `event durably delivered`;
- distinguish `record attempted` from `storage confirmed`;
- display silent JSONL loss without claiming the agent failed;
- expose the inability to pair duplicate same-name tool calls without a
  tool-call ID;
- remain readable without horizontal scrolling at 360px.
