# LLM Pre-training Run content spec

## Reader contract

The reader arrives after choosing a 4B/9B model-token-compute budget and a versioned data recipe. This article must close those decisions into a reproducible distributed LLM run without turning the generic PyTorch training article into an LLM-specific article.

Direct entry is still supported. Before the first diagnostic question, define a `training run` as the entire repeated update execution and `train.py` as only its launcher. Link the model/token budget and data recipe back to their owning articles instead of relying on "앞 글" as invisible context.

## Required insight checks

1. Recompute effective tokens per optimizer update from micro-batch, DP ranks, gradient accumulation and sequence length.
2. Detect that changing GPU count while preserving step count changes consumed tokens and the learning-rate schedule contract.
3. Separate BF16/FP32/Adam model state from activations, temporary buffers and fragmentation.
4. Distinguish replicated DDP `18N`, Megatron distributed optimizer `6N+12N/d`, and idealized FSDP full-shard `18N/d`; do not call all three simply "sharded".
5. Choose DDP, FSDP, TP, PP or CP from the state or axis that no longer fits, not from popularity.
6. Explain why a weight-only checkpoint cannot reproduce the next update.
7. Design a resume-equivalence check against an uninterrupted control run.
8. Refuse a 9B scale-up when clean slice quality, resume or cost evidence fails.

## Visualization contract

- RunLedgerLab changes execution, evidence and failure text for all six stages.
- BatchAndMemoryLab changes tokens/update, target update count and rank-local state memory when model size, DP ranks, accumulation or state ownership changes.
- The state ownership control has three explicit modes: DDP replica, optimizer-state shard, and FSDP full shard.
- At 360, 390, 768 and 1440 pixels, neither lab nor any formula may create document overflow.
- The memory number is explicitly labeled as an educational ledger, not a measured peak.

## Source boundary

- Megatron Core owns the current LLM training and parallelism examples.
- Megatron Core distributed optimizer owns the BF16/FP32 `6+12/d` byte ledger; it must not be cited as proof of `18/d` full sharding.
- PyTorch FSDP2 owns the claim that parameter, gradient and optimizer states are all sharded in full-shard mode.
- PyTorch owns the reproducibility and distributed checkpoint API boundaries.
- The generic `training-pipeline` article remains a deeper implementation handoff for Dataset, AMP, validation and checkpoint mechanics.

## Hard-transfer oracle

1. For a 4B model on 8 DP ranks, derive 72GB for replicated DDP, 30GB for the Megatron distributed optimizer ledger, and 9GB for the ideal full-shard steady state before adding activations and communication buffers.
2. When DP ranks change from 8 to 32, recompute effective tokens/update and decide whether target steps and the learning-rate schedule must change.
3. Given a loss spike after resume, use sample cursor, shard id, optimizer/scheduler state, RNG state and the uninterrupted control to distinguish data corruption from a non-equivalent checkpoint.
4. Given a 9B model that fits only after TP is enabled, explain why adding PP and CP without a depth or sequence bottleneck adds communication and failure surfaces rather than automatically improving throughput.
