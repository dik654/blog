# Attention Is All You Need · source reconstruction contract

## Reader decision

The reader must be able to reconstruct the 2017 encoder-decoder Transformer without silently replacing
it with a modern decoder-only LLM. The article starts from the recurrent dependency bottleneck and ends
at a minimal faithful implementation and evidence boundary.

## Primary source boundary

- Primary paper: Vaswani et al., *Attention Is All You Need*, NeurIPS 2017 / arXiv:1706.03762.
- Reconstruct the published Post-LN, encoder-decoder architecture: six encoder layers, six decoder
  layers, sinusoidal positions, ReLU FFN, causal decoder self-attention and encoder-decoder attention.
- Do not attribute Pre-LN, RMSNorm, RoPE, GQA, SwiGLU, FlashAttention or decoder-only KV caching to
  the 2017 paper.
- Table 1 is an asymptotic comparison under the paper's assumptions, not a universal hardware benchmark.
- Table 2 couples architecture, data, regularization, optimizer, checkpoint averaging and beam search.
- Table 3 is a limited WMT EN-DE development-set ablation, not proof that every head specializes.

## Private transfer problem

The finished article alone must let a reader solve this without publishing it as a quiz:

1. For `B=2`, source length `S=5`, target length `T=4`, `d_model=512`, `h=8`, derive every Q, K,
   V, score and concatenated tensor shape for encoder self-attention, masked decoder self-attention
   and cross-attention.
2. Explain why the decoder cross-attention query length is `T` while key/value length is `S`.
3. Draw the causal mask and prove that target position 2 cannot read position 3.
4. Compute the FFN expansion and contraction dimensions and distinguish token mixing from feature mixing.
5. Explain why `1/sqrt(d_k)` stabilizes score variance under the paper's stated independent-unit-variance
   intuition.
6. Reproduce the original base recipe and identify every modern substitution that would invalidate a
   source-faithful claim.
7. Read Tables 1–3 without turning BLEU or FLOP estimates into a timeless model ranking.

## Narrative

1. Start with the exact operation that recurrence serializes.
2. Follow one source token and one shifted target token through the full encoder-decoder graph.
3. Separate the three attention sites before introducing the shared attention equation.
4. Derive tensor shapes and scaling.
5. Explain FFN and positional encoding as different responsibilities.
6. Reconstruct the training recipe separately from architecture.
7. Read each evidence table with its comparison and limit.
8. Hand off to the implementation article and current LLM architecture route.

## Formula contract

Every display equation has Korean underbrace annotations and an adjacent `FormulaNote`.

1. Scaled dot-product attention with shape-bearing Q, K and V.
2. Multi-head split, concatenate and output projection.
3. Position-wise ReLU FFN.
4. Sinusoidal position encoding.
5. Original warmup learning-rate schedule.

No raw LaTeX, horizontal formula scroll or formula text below 12 px at 390 px.

## Viz contract

### `TransformerPathLab`

- Modes: encoder self-attention, masked decoder self-attention, encoder-decoder attention.
- Each state names query owner, key/value owner, mask, input/output artifact and shape.
- Mobile is a vertical execution ledger; desktop may use a four-column grid.

### `AttentionShapeLab`

- Controls source and target lengths and one of the three attention sites.
- Shows Q, K, V, score and output shapes with deterministic numeric values.
- Makes `T x S` cross-attention distinct from `S x S` and `T x T`.

### `TransformerEvidenceLab`

- Tabs for Table 1, Table 2 and Table 3.
- Shows exact source receipts and an adjacent "supports / does not prove" boundary.
- No HTML table or inner horizontal scroll.

## Small-model author packet

### 4B

One primary-source claim, one formula or Viz state, exact line/table anchor, one misconception, one
viewport and one forbidden modern conflation.

### 9B

One complete causal section: historical bottleneck, tensor execution, original receipt, evidence limit,
implementation invariant and route handoff.

The orchestrator retains source conflict resolution, shared symbols, private transfer checks, responsive
QA and deployment.
