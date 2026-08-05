# Claw Policy Engine content spec

## Reader outcome

The reader must be able to explain why the current `PolicyEngine` is a pure
decision layer rather than a lane scheduler, then predict the complete ordered
`Vec<PolicyAction>` for a concrete `LaneContext`.

## Source boundary

Source snapshot: Claw Code commit `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`.

Primary local sources:

- `/home/heru/code/claw-code/rust/crates/runtime/src/policy_engine.rs`
- `/home/heru/code/claw-code/rust/crates/runtime/src/green_contract.rs`
- `/home/heru/code/claw-code/rust/crates/runtime/tests/integration_tests.rs`

Current source contains:

- priority-sorted `PolicyRule` values;
- recursive `And`/`Or` conditions and eight leaf conditions;
- ten action variants including recursive `Chain`;
- an eight-field `LaneContext`;
- all-match evaluation and recursive action flattening;
- a separate four-level `GreenContract`.

Current source does not contain:

- a lane repository or status mutation;
- first-match or short-circuit evaluation across rules;
- YAML or custom-script rule loading;
- a polling loop, CI client, cache, event log, or consecutive-green counter.

## Private transfer problem

Given three rules whose priorities are out of order, two of which match the same
lane and one of which contains a nested `Chain`, derive the exact returned action
order. Then identify which component must own action execution, idempotency,
receipts, and state mutation.

The article succeeds only if its prose and Viz let the reader solve this without
assuming that `PolicyEngine` performs the effects itself.

## Section plan

1. **Decision boundary**
   - Question: does matching a merge rule merge a branch?
   - Answer: no; it emits a typed action proposal.
   - Viz: change lane evidence and inspect matching rules and returned actions.
2. **Evaluation semantics**
   - Rules sort by ascending numeric priority.
   - Every matching rule contributes actions.
   - `Chain` is recursively flattened in place.
3. **Evidence packet**
   - Explain all `LaneContext` fields and why stale/time-based conditions both
     read `branch_freshness`.
   - Separate observation production from policy evaluation.
4. **Green boundary**
   - Explain the separate typed `GreenContract`.
   - Call out the current integration gap: policy context still stores a raw
     `u8`, not `green_contract::GreenLevel`.
5. **Runtime handoff**
   - Connect decision intent to the currently disconnected telemetry and
     recovery-simulation modules, then specify the missing production
     coordinator and effect verification contract.
   - State what is current implementation and what remains an orchestration
     responsibility.

## Viz contract

The lab must expose:

- lane green level, review, scoped diff, completion, startup blocker, stale age;
- rule order after priority sorting;
- all matching rules, not only the first;
- flattened returned action order;
- a visible statement that no branch or lane state was mutated.
