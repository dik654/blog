# Practical model compression release contract

## Editorial intent

These four articles teach a deployment decision process, not a fixed recipe such
as pruning -> distillation -> quantization.

1. define the request shape, hardware, runtime, quality slices, and cost target,
2. measure a dense high-precision baseline end to end,
3. identify whether weights, KV cache, arithmetic, runtime overhead, or model
   capability is the binding constraint,
4. choose one compression branch that can change that constraint,
5. verify that the target runtime has a realizable kernel and file/packing path,
6. compare quality, latency, throughput, memory, and operational behavior under
   the same workload,
7. combine methods only after each method has earned its place independently.

The reader should be able to reject a smaller model that does not improve the
production objective.

## Learning-path topology

Compression methods are branches, not mandatory consecutive steps.

```text
Deployment contract
└─ Compression release loop
   ├─ Quantization: reduce representation precision
   ├─ Pruning: remove values or model structure
   └─ Distillation: train a new student from teacher signals
```

Each branch starts from `compression-pipeline` and returns to the same release
loop. The sidebar therefore exposes four paths:

- release loop only,
- release loop -> quantization,
- release loop -> pruning,
- release loop -> distillation.

## Article contracts

### Compression pipeline

- Replace the fictional EXAONE case study and fixed order with a deployment
  contract.
- Decompose peak memory into weights, KV cache, activations/workspace, and
  runtime reserve.
- Separate time to first token, inter-token latency, request latency, throughput,
  and cost per accepted output.
- Attribute the bottleneck before selecting a method.
- Use a controlled intervention matrix rather than a universal method order.
- Require end-to-end release evidence, rollback artifacts, and shadow/canary
  monitoring.

### Quantization

- Explain affine quantization, clipping, rounding, scale, zero point, granularity,
  and outliers from first principles.
- Separate weight-only, weight-and-activation, KV-cache, and training-storage
  quantization.
- Separate algorithm, numeric representation, packing layout, container format,
  runtime, kernel, and hardware.
- Present RTN, GPTQ, AWQ, SmoothQuant, and QAT as candidates with different
  assumptions, not a ranking.
- Explain that GGUF is a model container format, not a peer quantization
  algorithm.
- Explain that NF4 in QLoRA primarily reduces training memory; its matmul is
  dequantized to a compute dtype and does not imply a universal speedup.

### Pruning

- Begin with the difference between zero values and skipped computation.
- Separate unstructured, N:M semi-structured, block, channel/head, layer, and
  architecture-level removal.
- Connect each sparsity pattern to an actual runtime/kernel path.
- Present magnitude, activation-aware, gradient/Taylor, and approximate
  second-order scoring as different evidence sources.
- Keep SparseGPT results inside OPT/BLOOM and its paper protocol; keep Wanda at
  ICLR 2024.
- Treat recovery training and combination order as experiment-dependent.

### Knowledge distillation

- Explain hard-label, logit, feature, sequence, and teacher-generated-data
  signals.
- State the output-space/tokenizer contract for token-level KL.
- Require feature adapters when teacher and student hidden spaces differ.
- Separate white-box teacher access from black-box sampled outputs.
- Track teacher version, prompt, decoding policy, license, consent, provenance,
  and generation cost.
- Present DistilBERT, sequence-level KD, and MiniLLM as bounded examples.
- Explicitly state that TinyLlama is small-model pretraining, not a distillation
  pipeline.

## Hard transfer questions

The prose is complete only if a reader can reason through these private tests.

1. A 7B model fits after INT4 weight quantization, but 32 concurrent long-context
   requests still OOM. Which memory term was not changed?
2. A quantized file is four times smaller but the generic runtime is slower than
   BF16. What missing kernel or dequantization evidence must be checked?
3. Why can a GGUF file use multiple quantization encodings and run with CPU or
   GPU offload?
4. A tensor has one extreme outlier. Why can per-tensor INT4 damage ordinary
   values, and how can granularity or outlier handling change the error?
5. A model has 70% zero weights but the dense checkpoint and latency are
   unchanged. Why is this not a deployment speedup?
6. Why does 2:4 sparsity have a clearer acceleration path on supported NVIDIA
   hardware than arbitrary unstructured zeros?
7. Teacher and student tokenizers differ. Why is token-wise KL not immediately
   defined, and what alternative signal can still be used?
8. A distilled student matches the teacher on the teacher-generated evaluation
   set but fails human data. Which shared-bias and provenance tests were missed?
9. Why is there no universally correct order for pruning, distillation, and
   quantization?
10. Which end-to-end metrics must remain comparable before a compressed artifact
    can replace the baseline?

## Formula policy

- Every displayed formula uses KaTeX through `FormulaPair`.
- Each semantic operation has a Korean underbrace where the expression remains
  readable.
- Every symbol is decoded directly below the expression.
- No raw LaTeX appears in prose.
- At 390 px, each formula must fit without horizontal scrolling and without an
  auto-fit scale below 0.80.

## Viz policy

Interactive labs must expose a decision:

1. `memory-envelope`: context and concurrency change KV pressure inside a fixed
   device budget.
2. `compression-gate`: the observed bottleneck changes the viable method branch.
3. `range-outlier`: bit width, granularity, and outliers change quantization
   error.
4. `kernel-realization`: stored precision and execution path separate memory
   savings from latency savings.
5. `sparsity-realization`: sparsity pattern and runtime support determine whether
   zeros become skipped work.
6. `distillation-signal`: teacher access and tokenizer compatibility determine
   which transfer signal is valid.

Labs use stable responsive grids, restrained multi-hue accents, no SVG text, and
no decorative card nesting.

## Primary-source boundary

- Quantization stack/runtime: torchao and ONNX Runtime official documentation.
- LLM PTQ: GPTQ, AWQ, and SmoothQuant primary papers.
- QLoRA/NF4: QLoRA NeurIPS 2023 paper.
- GGUF boundary: ggml GGUF specification and llama.cpp repository.
- Runtime compatibility: current vLLM quantization documentation.
- Pruning: SparseGPT (ICML 2023), Wanda (ICLR 2024), and NVIDIA structured
  sparsity documentation.
- Distillation: Hinton et al. (2015), sequence-level KD (EMNLP 2016),
  DistilBERT, and MiniLLM (ICLR 2024).

Paper numbers stay inside the named model, dataset, hardware, implementation,
metric, and publication date. No latency multiplier, safe sparsity ratio,
accuracy-retention percentage, batch size, or method order is a universal rule.
