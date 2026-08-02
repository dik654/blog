# On-device LLM Runtime Content Spec

## Reader contract

This article starts from a release failure, not from a framework installation guide. A reader who knows only that a decoder model performs prefill and repeated decode should be able to:

1. turn a checkpoint into a target-specific runtime artifact,
2. distinguish export, quantization, lowering, partitioning, delegation, kernel execution and app integration,
3. prove which graph regions actually ran on CPU, GPU or NPU,
4. calculate why operator-count coverage can disagree with time coverage,
5. keep KV, planned arena, runtime and app memory in one resident-memory ledger,
6. run cold, warm and sustained real-device traces and reject a build that only wins a short benchmark.

## Current-first spine

1. Product contract: target device, OS, workload, privacy, TTFT, ITL, memory, energy and quality.
2. Export contract: eager model plus example inputs, dynamic bounds and mutable KV become an exported graph.
3. Backend contract: target-aware quantization and partitioner lower compatible subgraphs to a delegate.
4. Boundary contract: unsupported ops use portable kernels; copies and synchronization at delegate boundaries are measured.
5. Runtime contract: target-specific `.pte`, tokenizer, sampler, explicit load, callback stream, cancel and context reset.
6. Evidence contract: ETRecord/ETDump or platform trace, memory plan, release build, real device, cold/warm/sustained run.
7. Release decision: the same prompt fixture must pass latency, memory, energy, quality and thermal gates.

## Source claim boundaries

- ExecuTorch 1.3 LLM docs establish `.pte` export and C++/Swift/Java runtime integration. They do not prove that one exported file is optimal across all backends.
- ExecuTorch custom LLM export docs establish target-specific partitioning and portable fallback. They do not make a high node-delegation count equivalent to high speedup.
- ExecuTorch Inspector/ETDump docs establish trace linkage to operators and delegates. They do not replace platform-level power and thermal measurement.
- ExecuTorch memory planning docs establish planned tensor arenas and device-aware pools. They do not include every allocator, delegate, tokenizer, app and OS byte.
- Android Power Profiler and Apple Instruments/MetricKit establish device-level power and thermal evidence. Device-level power rails contain noise and are not automatically per-model energy.
- Every API and backend support claim is version-sensitive and must be labeled ExecuTorch 1.3 / target OS and hardware.

## Private transfer problem

The hidden transfer test uses two measured synthetic traces and one release fixture.

### Trace A: cheap shape fallback

- delegated: linear 184 nodes / 58 ms, attention 32 / 26 ms, norm+activation 96 / 12 ms
- fallback and boundary: shape+assert 420 nodes / 16 ms
- expected node coverage: 312 / 732 = 42.6%
- expected time coverage: 96 / 112 = 85.7%
- boundary traffic: 96 MiB

### Trace B: attention fallback

- delegated: cheap elementwise 600 / 15 ms, linear 184 / 58 ms
- fallback: attention 32 / 52 ms, shape+boundary 16 / 20 ms
- expected node coverage: 784 / 832 = 94.2%
- expected time coverage: 73 / 145 = 50.3%
- boundary traffic: 768 MiB

The reader must explain why more than 94% node coverage can still be the worse deployment.

### 8 GB-class device release fixture

- usable app budget after OS and reserve: 6.2 GiB
- 4B INT4 resident weight: 2.20 GiB
- KV: 96 KiB/token
- planned arena: 0.70 GiB
- runtime+app: 0.45 GiB
- context: 8,192 tokens
- expected resident total: 2.20 + 0.75 + 0.70 + 0.45 = 4.10 GiB
- 15 minute attention-fallback trace: TTFT 6.24 s, decode 5.8 tok/s, energy 62 mJ/token
- team gate: TTFT <= 3.0 s, decode >= 10 tok/s, resident <= 6.2 GiB, energy <= 65 mJ/token

The build fits memory and energy but must be rejected on sustained TTFT and decode latency. Switching to a cold full-delegation fixture yields TTFT 2.80 s, 14.8 tok/s and 42 mJ/token, but this remains a diagnostic comparison; release still requires the sustained full-delegation run.

## Section plan

### 1. Why desktop success is not a device release

- Start with one 4B/8 GB counterexample.
- Define artifact, delegate, portable fallback and sustained trace.
- Viz: export-to-release overview with target backend selector.

### 2. What export freezes

- Example inputs and dynamic bounds are part of the executable contract.
- KV mutation, prefill/decode methods and tokenizer metadata must remain runner-visible.
- A checkpoint is not a device executable.

### 3. What the partitioner actually does

- Separate operator, kernel, backend, partition and delegate.
- Explain target-aware quantization and separate artifacts per backend.
- Fallback is correctness insurance, not a performance guarantee.

### 4. Why delegation percentage lies

- Derive node coverage and time coverage.
- Add boundary byte/synchronization cost.
- Viz: switch between cheap-shape fallback and attention fallback.

### 5. Where resident memory comes from

- Weight, KV, planned arena, delegate workspace, runtime, tokenizer and app.
- Dynamic upper bounds affect planning and artifact validity.
- Load mode changes paging behavior, not total model semantics.

### 6. How the app executes it

- Explicit load before first generation.
- Generate off the UI thread.
- Streaming callback, error path, stop and reset context.
- Keep model/tokenizer/revision/backend manifest together.

### 7. What evidence permits release

- Release/profileable build, physical device, fixed prompt fixture.
- Cold load, warm TTFT, ITL, p95 jitter, memory high-water, quality.
- 5/15 minute power and thermal trace, unplugged where required.
- Viz: 4B/9B device release lab with fail-closed gates.

## Formula contract

1. `C_node` and `C_time` with Korean annotations.
2. `T_boundary >= B_boundary/BW_effective + n_sync t_sync` with Korean annotations.
3. Resident memory and usable device budget with Korean annotations.
4. Sustained performance ratio and fail-closed release gate with Korean annotations.

Every formula is followed by `FormulaNote`. No raw LaTeX may appear. At 360 px scale must remain >= 0.70 and computed KaTeX font >= 12 px.

## Viz contract

### EdgeExportPipelineLab

- Inputs: XNNPACK CPU, Core ML, QNN backend; five execution stages.
- State: artifact name, input, output, invariant, common failure.
- The backend selector must change the target artifact and backend-specific risk.
- No auto animation and no horizontal pan.

### DelegationCoverageLab

- Inputs: cheap-shape fallback, attention fallback, full delegation.
- State: node coverage, time coverage, boundary traffic, trace duration.
- Must expose 42.6%/85.7% and 94.2%/50.3% oracles.
- Must label values as an educational measured fixture, not vendor benchmark.

### DeviceReleaseLab

- Inputs: 4B/9B, 2K/8K, cold/5m/15m, full delegation/attention fallback.
- State: resident GiB, TTFT, decode tok/s, energy/token and pass/fail gates.
- Default 4B/8K/15m/fallback must reject with 4.10 GiB, 6.24 s, 5.8 tok/s and 62 mJ/token.
- 4B/8K/cold/full must show 2.80 s, 14.8 tok/s and 42 mJ/token.

## Small-model authoring packets

### 4B writer packet

One source claim, one contract boundary, one formula or Viz state, exact numeric oracle, allowed files and viewport acceptance.

### 9B writer packet

One causal section: product symptom, graph/runtime boundary, evidence, failure case, transfer question and release test.

The orchestrator owns route order, source conflicts, symbol consistency, private transfer problems, browser QA and deployment.
