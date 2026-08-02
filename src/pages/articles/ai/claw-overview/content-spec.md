# Claw Overview content specification

## Target question

Which source files execute production requests, which only model a porting
surface, and which provide reproducible parity evidence? After that distinction,
which of the five bounded Claw reading routes should answer the learner's next
question?

## Pinned source

- revision: `ab44985916cb0d53d2f7a55ea90e0d7be97d4626`
- `rust/Cargo.toml`
- `rust/crates/*/Cargo.toml`
- `src/runtime.py`
- `src/query_engine.py`
- `rust/crates/compat-harness/src/lib.rs`
- `rust/crates/mock-anthropic-service/src/lib.rs`
- `rust/crates/rusty-claude-cli/tests/mock_parity_harness.rs`

## Required structure

1. Split Rust production, Python porting simulation, TypeScript manifest
   extraction, and mock CLI E2E before discussing details.
2. Derive the nine Rust crate dependency direction from Cargo manifests.
3. Teach the real `PortRuntime` and `QueryEnginePort` methods and state.
4. Separate surface presence evidence from behavioral execution evidence.
5. Enumerate the exact twelve mock scenarios in readable groups.
6. End with a five-route map: one-turn state ownership, side-effect safety,
   extension lifecycle, provider/MCP/CLI boundaries, and multi-task operations.
   This is a route selector, not another exhaustive system map.

## Forbidden claims

- `PortRuntime.route_tool_call()` exists.
- `QueryEnginePort.query(path)` or `subsystems` exists.
- Python runtime directly dispatches into Rust runtime.
- `compat-harness` runs the same job as `mock-anthropic-service`.
- runtime depends on tools.
- mock-anthropic-service has no internal crate dependency.
- unsafe workspace lint proves all transitive dependencies contain no unsafe.
- the twelve scenarios prove full Claude Code parity.
- unpinned history, leaked source, people, dates, or LOC compression ratios.

## Visual contract

The interactive boundary visual exposes input, core, output, evidence level,
and limitation for four layers. It is DOM-based and must not overflow at 390,
768, or 1440 CSS pixels.

The route selector uses short numbered rows with one learner question and one
first article per route. It must remain readable without horizontal scrolling.

## Adversarial checks

1. Ask whether a matching command name proves command execution.
2. Ask whether deterministic Python output is a provider integration test.
3. Ask which Cargo manifest creates the tools-to-runtime edge.
4. Ask which evidence catches a wrong write permission decision.
5. Ask what remains unverified after all twelve mock scenarios pass.
6. Ask which route should be read next when the defect is a wrong permission
   decision versus a missing provider stream versus an unverified worker result.
