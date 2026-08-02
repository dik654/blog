# NLP & Attention Core — Content Spec

## Learning Contract

The eight articles form one chain:

`text -> token IDs -> vectors -> recurrent state -> gated memory -> encoder/decoder -> attention lookup -> Transformer blocks -> bidirectional pre-training`

Every article must answer the structural limitation that motivates the next article. Historical chronology is secondary to executable data flow.

The curriculum has two interleaved spines. Concept articles build the tools; foundational paper articles immediately use those tools to reconstruct the work that changed the field. A paper is never placed before its equations, tensor shapes and predecessor limitation are readable from the concept spine.

## Private mastery audit

Problems are an authoring and review instrument, not public article content. Before drafting each article:

1. Research original papers, official implementations, and university problem sets.
2. Build private transfer problems that require calculation, tensor-shape tracing, implementation judgment, and failure analysis.
3. Draft the article without exposing those problems or their answer choices.
4. Solve the private problems using only claims and evidence present in the article.
5. Expand any section whose evidence is missing, implicit, or only memorized from outside knowledge.

The audit must reject shallow coverage even when definitions are correct. A reader should be able to derive the answer, not merely recognize terminology.

## Evidence compiler

Each source is normalized into the same evidence record:

`source -> claim -> mechanism -> equation/shape -> figure data flow -> experiment -> assumption -> failure -> implementation consequence`

- Paper: include the full method path, central equation intuition, figure data flow, experiment that supports the claim, and appendix/ablation caveats when they change interpretation.
- Video: align transcript chapter, slide/OCR frame, code or demo state, and the speaker's claim before extracting an insight.
- Documentation/GitHub: tie conceptual behavior to API contract, tensor shape, execution order, and versioned limitation.
- Multilingual input: preserve source language and technical terms in the evidence record; render Korean only after the semantic record is complete.

Public Viz components are reconstructed explanations. They should prove the source mechanism with small inspectable data, not reproduce paper figures as decoration.

## Required Comparison Axes

- Input and output tensor shape
- What state or memory is available at each position
- Which positions can interact under the mask
- What objective supplies the gradient
- Which operations are sequential and which are parallel
- Training versus inference data flow
- Expected failure and the metric that exposes it

## Visual and Math Rules

- A section starts with a question and prose before any large visualization.
- One control must change a real computed value: token boundary, recurrent state, gradient product, attention weight, beam score, mask, or MLM loss.
- Required equations must fit a 320px content width without horizontal scrolling.
- Split long matrix objectives into shape declarations, local operation, and result.
- Do not use dozens of step buttons as a substitute for explanation.
- Use stable grids and viewBox plots with protected labels; mobile switches horizontal pipelines to vertical flow.

## Article Scopes

### Tokenizer
Unicode normalization, byte fallback, BPE merge, WordPiece/Unigram distinction, special tokens, Korean morphology, fertility and round-trip evaluation.

### Distributional Semantics
Distributional hypothesis, co-occurrence windows, PMI/PPMI, SVD, cosine geometry, static embedding limits, link to Word2Vec and contextual representations.

### RNN
Shared recurrent cell, scalar and tensor recurrence, language modeling, teacher forcing, BPTT, gradient products, truncation, padding/masks and sequential bottleneck.

### LSTM
Forget/input/candidate/output gates, cell update, gradient highway, saturation diagnostics, GRU, bidirectionality and remaining sequential bottleneck.

### Seq2Seq
Conditional generation, encoder bottleneck, decoder start/stop, teacher forcing and exposure bias, greedy/beam decoding, length bias and attention motivation.

### Attention
Query/key/value roles, score-mask-softmax-value composition, additive versus scaled dot product, self/cross attention, multi-head shape, quadratic cost and attention interpretation limits.

### Transformer
Token/position input, QKV projection, scaled attention, masks, heads, output projection, residual/norm/FFN, encoder/decoder/decoder-only families, training versus autoregressive inference, KV cache.

### BERT
Bidirectional encoder mask, input packing, MLM corruption and loss positions, NSP historical role, task heads, fine-tuning versus frozen embeddings, limits and modern encoder use.

## Completion Checks

- 360, 768 and 1440px
- Every tab and every range endpoint
- No document or required internal horizontal scrolling
- No visible raw LaTeX or KaTeX errors
- No clipped SVG labels, cards, values or controls
- No browser console or page errors
