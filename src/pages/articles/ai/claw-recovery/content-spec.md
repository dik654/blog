# Claw Recovery content spec

## Reader outcome

The reader must be able to trace a classified failure through recipe lookup,
the per-scenario attempt gate, simulated step execution, the exact
`RecoveryResult`, and emitted events. They must identify the component that is
still required to apply the recipe's escalation policy.

## Source boundary

Source snapshot: Claw Code commit
`ab44985916cb0d53d2f7a55ea90e0d7be97d4626`.

Primary local sources:

- `/home/heru/code/claw-code/rust/crates/runtime/src/recovery_recipes.rs`
- `/home/heru/code/claw-code/rust/crates/runtime/src/worker_boot.rs`

Current source contains:

- seven `FailureScenario` variants and seven fixed recipes;
- a bridge from six `WorkerFailureKind` values into four scenario outcomes;
- per-scenario attempt counters and `max_attempts = 1` for every recipe;
- counters scoped to one in-memory `RecoveryContext`, keyed only by scenario;
- a test-only `fail_at_step` simulation knob;
- `Recovered`, `PartialRecovery`, and `EscalationRequired` results;
- structured attempt and terminal recovery events.

Current source does not contain:

- production shell, git, MCP, plugin, or worker effect execution;
- a producer bridge for stale branch, cross-crate compile, or partial plugin
  scenarios;
- lane/global retry budgets, cooldowns, or idempotency keys;
- incident/action IDs, durable attempt reservations, effect receipts,
  observation windows, or undo actions;
- code that applies `AlertHuman`, `LogAndContinue`, or `Abort`.

## Private transfer problem

For `PartialPluginStartup`, fail the second of two steps on the first call and
invoke recovery again. Derive:

- the first and second `RecoveryResult`;
- the recovered and remaining step lists;
- the attempt count after both calls;
- the exact event suffixes;
- whether `LogAndContinue` was executed.

Then repeat the reasoning for a `WorkerFailureKind::Protocol` input and for a
`StaleBranch` input that has no bridge in `from_worker_failure_kind`.
Finally run the same scenario in lane A and lane B using one context, then create
a new context as if the process restarted. Explain why the lanes share one
budget before restart and why the budget resets after restart.

The article succeeds only if the reader separates recipe policy metadata from
the returned result and from an outer coordinator's actual escalation effect.

## Section plan

1. **Failure classification**
   - Map worker boot failures into four reachable scenarios.
   - Mark three scenarios as requiring another producer.
2. **Recipe data**
   - Explain all seven fixed recipes and the scenario-keyed, in-memory
     one-attempt limit.
3. **Attempt algorithm**
   - Gate before steps, simulate steps, derive exact result, emit events.
4. **Policy ownership**
   - Keep escalation policy metadata separate from result and effect.
   - Explain why `Escalated` is evidence, not `AlertHuman` execution.
5. **Production handoff**
   - Add incident/action IDs, durable reservation, real step executors,
     idempotency, receipts, observation, undo, and outer policy handling.
   - Connect failures to telemetry and policy decisions.

## Viz contract

The lab must:

- expose reachable and unmapped upstream scenarios;
- support success, first-step failure, and later-step partial recovery;
- block a second call before any step executes;
- show that two lanes share a scenario counter in one context and that a new
  context resets it;
- display the exact result independently from recipe escalation policy;
- show emitted events and the still-unowned next effect;
- never label a simulated `Recovered` result as verified external recovery;
- remain readable without horizontal scrolling at 360px.
