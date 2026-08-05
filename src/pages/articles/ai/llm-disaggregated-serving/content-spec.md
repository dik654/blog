# Disaggregated LLM Serving · content spec

## Reader contract

The reader starts with one production question: a mixed workload contains long prompts, long reasoning outputs, bursts, and repeated prefixes. They must decide whether one aggregated worker pool is enough or whether prefill and decode should be separated. The article must not become a catalog of vLLM, SGLang, TensorRT-LLM, Dynamo, Mooncake, DistServe, and LMCache.

By the end, the reader can:

1. Separate TTFT from TPOT/ITL and explain which phase pressures each metric.
2. Compute KV bytes per token, prompt handoff bytes, ideal/effective transfer time, and decode-pool KV capacity.
3. Explain why disaggregation trades prefill/decode interference for a new KV-transfer critical path.
4. Keep KV-aware routing, prefix caching, disaggregation, and multi-tier offload as separate mechanisms.
5. Reject disaggregation for a small/short/low-concurrency workload or a slow fabric.
6. Approve a release only after an aggregated A/B baseline, in-cluster transport verification, p95/p99 SLO checks, and failure tests.

## Current-first spine

1. Current top: NVIDIA Dynamo's request plane, disaggregated prefill/decode, KV-aware routing, NIXL transfer, and independently scalable xPyD pools.
2. Production canonical: Mooncake's KVCache-centric architecture and SLO-aware scheduling for Kimi long-context traffic.
3. Minimum runtime foundations: Orca iteration-level scheduling, PagedAttention block allocation, exact speculative decoding.
4. Just-in-time systems foundation: bytes, bandwidth, queue interference, RDMA/RoCE/InfiniBand, tail latency.
5. Implementation close: same-workload aggregated baseline, transfer trace, capacity ledger, overload/recovery gate.

Stop below Orca 2022. General distributed-systems history, every cache paper, and every network transport are optional unless a measured failure changes the serving contract.

## Claim boundaries

- Dynamo is an orchestration layer above engines, not a replacement for vLLM/SGLang/TensorRT-LLM.
- Prefill is commonly more compute-intensive and decode more memory-bandwidth/KV-capacity constrained, but the actual boundary depends on model, prompt/output mix, batch, kernels, and hardware.
- Disaggregation is not automatically faster. It is useful only when independent scaling and interference reduction exceed handoff, routing, and operational cost.
- `KV bytes / link bandwidth` is a lower bound. Protocol, topology, serialization, queueing, registration, synchronization, and fallback transport add time.
- An advertised 100/200/400 Gb/s line rate is not application GB/s. Divide by eight and measure effective utilization.
- Vendor speedup numbers stay attached to the model, hardware, workload, baseline, and SLO used in the source.
- vLLM's disaggregated feature status and connector behavior are version-sensitive and must be labeled as official runtime documentation, not timeless architecture.

## Private transfer problem

A Llama-like model has 32 layers, 8 KV heads, head dimension 128, and BF16 KV. Traffic has an 8,192-token prompt, 512-token output, concurrency 24, and a 100 Gb/s fabric whose measured payload efficiency is 80%.

The article alone must let a reader derive:

- KV per token = 128 KiB.
- Prefill handoff per request = 1 GiB.
- Ideal effective payload = 10 GB/s and lower-bound handoff = about 100 ms.
- Decode-pool resident KV at peak = about 25.5 GiB for prompt plus output tokens.
- Why the team must compare this against an aggregated baseline instead of assuming separate pools help.
- Which p99 TTFT, p99 TPOT, cache-hit, transport-fallback, worker-loss, and overload observations would block release.

## Narrative sections

### 1. Start from two promises, not GPU count

Question: Why can average tokens/s be healthy while users see slow first tokens or stalls between output tokens?

Explain arrival, queue, prefill, KV handoff, decode, stream. Introduce TTFT and TPOT/ITL as separate promises.

### 2. Prefill and decode contend for different things

Show the same request as a compute-dense prompt phase and a repeated one-token phase. Explain interference in an aggregated batch. Do not state a universal roofline result.

### 3. Splitting creates a KV handoff debt

Derive KV/token and transfer lower bound. Contrast 100/200/400 Gb/s. Explain same-node and cross-node paths without claiming pod-to-pod NVLink universally works.

### 4. Routing must know both load and reusable state

Separate:

- load-aware routing,
- prefix/KV overlap routing,
- prefix caching,
- P/D split,
- KV offload.

Explain why chasing cache overlap can overload a worker and why decode routing should not pretend transferred KV was locally reusable unless the backend guarantees it.

### 5. When one pool is better

Small model, short prompt, low concurrency, slow fabric, or unstable connectors can make aggregated serving simpler and faster. Include an explicit stop rule.

### 6. Release by measured invariants

Use identical traffic and model settings. Measure TTFT, TPOT, throughput, rejection, KV hit, handoff time, effective bandwidth, HBM, GPU utilization, and fallback transport. Test prefill loss, decode loss, transfer timeout, cache miss, and overload shedding.

## Formula contract

Every display formula gets Korean internal annotations and an adjacent `FormulaNote`.

1. KV bytes per token.
2. Prompt handoff lower bound.
3. Decode-pool KV capacity.
4. TTFT/TPOT release constraints.

No formula may require horizontal scroll at 360 px. Split long equations into aligned causal lines.

## Viz contract

### `ServingPressureLab`

Controls: prompt tokens, output tokens, concurrency, fabric speed. Observable outputs: per-token KV, request handoff GiB, effective handoff ms, peak decode KV GiB. It must expose the default numeric oracle from the private transfer problem.

### `DisaggregatedFlowLab`

Toggle aggregated/disaggregated. Aggregated shows no handoff but coupled scaling and prefill/decode interference. Disaggregated shows router -> prefill pool -> KV transfer -> decode pool, independent scaling, and the transfer failure boundary. A selected stage explains input, work, output, invariant, and failure.

### `ServingReleaseGate`

Four interactive stages: workload fixture, aggregated baseline, transport/capacity audit, failure/SLO gate. Do not auto-animate. Static state must be understandable before interaction.

## Responsive and visual acceptance

- 360, 390, 768, and 1440 px.
- No document or formula overflow.
- No nested cards.
- Controls keep stable dimensions and labels wrap safely.
- Thin connectors, restrained blue for request flow, violet for KV state, emerald for pass, amber for risk.
- Mobile is a deliberate single-column execution order, not a shrunken desktop graph.
- No HTML tables.

## Primary sources

- NVIDIA Dynamo design and disaggregated-serving documentation.
- Mooncake, arXiv:2407.00079.
- Orca, OSDI 2022.
- PagedAttention/vLLM, arXiv:2309.06180.
- vLLM official disaggregated-serving examples and feature docs.

## 4B / 9B authoring packets

### 4B packet

One source claim, one formula or one Viz state, fixed numeric oracle, one viewport, one allowed file, explicit forbidden overclaim.

### 9B packet

One full causal section: production symptom -> phase bottleneck -> mechanism -> new cost -> source boundary -> transfer-question coverage -> responsive acceptance.

The orchestrator retains path ordering, source conflict resolution, shared symbols, private transfer tests, browser QA, and deployment.
