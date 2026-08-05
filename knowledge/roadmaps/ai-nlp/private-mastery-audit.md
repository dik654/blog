# NLP & Attention private mastery audit

This document is an authoring QA artifact. Problems and answer keys are not rendered in the public article.

## Source policy

- Primary evidence: original papers, official project documentation, official framework tutorials.
- Depth calibration: Stanford CS224N assignments and lecture notes.
- Each article must support four answer modes using only its public body: numeric calculation, tensor-shape trace, implementation decision, failure diagnosis.
- A pass requires the reasoning path, not only the final choice.

## Research anchors

| Source | Coverage extracted | Public article consequence |
|---|---|---|
| Hugging Face tokenizer documentation | Normalizer -> pre-tokenizer -> model -> post-processor; BPE, WordPiece, Unigram, byte fallback | Tokenizer must cover the whole pipeline and round-trip, not only merge animation. |
| CS224N Assignment 2 | Distributional objective, vector shape, derivative and error analysis | Distributional semantics must connect counts to a learnable objective and geometry failure. |
| CS224N NMT Assignment 4 | Bidirectional encoder shapes, decoder initialization, attention score/context, output projection, error analysis | Seq2Seq and attention must preserve every tensor boundary and training/inference split. |
| CS224N Attention Exploration | Key magnitude perturbation, output variance, multi-head retrieval | Attention must explain scale, normalization, head diversity and misleading weight interpretation. |
| CS224N Transformer Assignment | Positional information, causal masking, from-scratch block implementation | Transformer must connect equations to batch/head/sequence shapes and residual placement. |
| Original Transformer and BERT papers | Architecture, objectives, experimental claims and limitations | Historical claims must be tied to mechanism and reported evidence, not chronology alone. |

## Private transfer problems

### Tokenizer

- Design under a fixed vocabulary and context budget for Korean, code, decomposed Unicode and unseen emoji. Justify normalization, pre-tokenization, subword model, fallback and special-token contract.
- Given a tiny corpus, compute the next BPE merge and show how the merge changes vocabulary size and sequence length.
- Diagnose a production regression where training and serving use different normalization or BOS/EOS post-processing.
- Required public evidence: Unicode boundary explorer, merge counts, algorithm distinction, fertility/unknown/round-trip slices.

### Distributional semantics

- Build a co-occurrence vector at two window sizes, compute PMI/PPMI for a selected pair, and explain why raw frequency ranks function words too highly.
- Determine when cosine preserves semantic direction but hides confidence or frequency information.
- Explain which information truncated SVD preserves and loses, then predict a polysemy failure for a static word vector.
- Required public evidence: count construction, marginals and PPMI arithmetic, low-rank geometry, contextual handoff.

### RNN

- Unroll a scalar recurrence, compute hidden states and next-token logits, then trace a gradient product over the same steps.
- Diagnose vanishing versus exploding gradients from recurrent Jacobian magnitude and activation saturation.
- Specify padding masks, hidden-state reset and truncated BPTT boundaries for a batched implementation.

### LSTM

- Compute one full gate/cell/hidden update and compare the cell-state derivative to a tanh RNN path.
- Predict retention half-life from a constant forget gate and diagnose saturated gates from observed activations.
- Compare LSTM, GRU and bidirectional recurrence under latency and future-context constraints.

### Seq2Seq

- Trace encoder and decoder tensor shapes through a bidirectional encoder, state bridge, attention context and vocabulary projection.
- Explain why teacher forcing lowers training loss while free-running inference can fail; choose a decoding strategy under length bias.
- Diagnose translation errors using attention alignment, beam score and source-length slices.

### Attention

- Compute score -> mask -> scale -> softmax -> value sum for a small Q/K/V example.
- Predict the effect of key norm perturbation and temperature on output variance.
- Construct two heads that retrieve two different values and explain why a single convex combination cannot preserve both independently.

### Transformer

- Implement shape-correct multi-head attention from batch/sequence/model dimensions and restore the output projection.
- Derive which logits change under padding and causal masks; explain why position information is required.
- Trace prefill versus one-token decode with KV cache and identify which tensors grow with context.
- Diagnose pre-norm/post-norm, residual and FFN placement errors from a broken block diagram.

### BERT

- Construct input IDs, segment IDs, position IDs and attention masks for a sentence pair.
- Compute MLM loss only at selected positions and distinguish visible context from supervised positions.
- Select and shape a token, pooled or span head for a downstream task; explain why a causal-generation workload is a mismatch.
- Diagnose pretrain/fine-tune mismatch, truncation and static-embedding misuse.

## Completion gate per article

| Gate | Pass condition |
|---|---|
| Numeric | All quantities needed for the calculation are defined and one inspectable example is worked. |
| Shape | Inputs, local operation and outputs name dimensions without relying on an unexplained figure. |
| Implementation | Training/inference order, masks, special state and failure boundaries are explicit. |
| Evidence | Major claims connect to an original source or official implementation behavior. |
| Visual | Viz changes real data and remains legible at 360, 768 and 1440px. |
