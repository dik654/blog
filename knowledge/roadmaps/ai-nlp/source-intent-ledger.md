# NLP & Attention source-intent ledger

This ledger explains why the curriculum and each deep section exist. It is private authoring provenance, not public article prose.

## Curriculum intent

The order follows the lifetime of one text representation: string boundary -> vector geometry -> recurrent state -> gated memory -> sequence transduction -> content lookup -> parallel block -> bidirectional pre-training. Each article inherits a limitation from the previous one and supplies the mechanism needed by the next.

## Tokenizer

| Section | Source and anchor | Original evidence | Inclusion intent | Public transformation | Scope |
|---|---|---|---|---|---|
| Unicode pipeline | Unicode TR15; Hugging Face Tokenizers pipeline docs | Normalization precedes model tokenization; post-processing adds model-specific special tokens | Prevent the common error of treating BPE alone as the whole tokenizer | Editable multilingual string, normalization mode and word/grapheme/byte/subword output | deep |
| BPE merge | Sennrich et al., 2016; algorithm section | Frequent symbol pairs are merged to represent rare words as subword sequences | Make vocabulary/sequence trade-off computable | Slider applies a real ordered merge list and exposes the current segmentation | deep |
| Algorithm distinction | Hugging Face tokenizer summary; SentencePiece paper | BPE, WordPiece and Unigram use different selection procedures; SentencePiece operates on raw text with BPE or Unigram | Remove category confusion before later model articles mention their tokenizers | One comparison surface organized by training objective, inference decision, strength and risk | deep |
| Production evaluation | Byte-level BPE documentation and tokenizer pipeline contract | Byte base vocabulary removes unknown input; normalizer and post-processor changes require compatible training/serving setup | Connect theory to multilingual deployment regressions | Fertility, unknown and round-trip slices for Korean, code and emoji | deep |

### Tokenizer source locators

- Unicode TR15: `https://unicode.org/reports/tr15/`
- Hugging Face tokenizer pipeline: `https://www.huggingface.co/docs/tokenizers/python/latest/pipeline.html`
- Hugging Face algorithm summary: `https://huggingface.co/docs/transformers/main/tokenizer_summary`
- BPE for NMT: `https://arxiv.org/abs/1508.07909`
- SentencePiece: `https://arxiv.org/abs/1808.06226`

### Tokenizer interpretation boundaries

- The interactive subword split is intentionally illustrative; it is not presented as a trained production model.
- Fertility values in the UI are a controlled comparison, not benchmark results for a named tokenizer.
- NFKC is shown as an available policy, not a universal recommendation.

## Remaining article ledgers

### Distributional semantics

| Section | Source and anchor | Original evidence | Inclusion intent | Public transformation | Scope |
|---|---|---|---|---|---|
| Co-occurrence | Harris distributional hypothesis; CS224N word-vector material | Meaning can be operationalized through contextual distribution, but context definition is a modeling choice | Connect tokenizer output to the first computable semantic representation | Window control recomputes context counts over a visible corpus | deep |
| PPMI | Levy et al., 2015, PMI definition and PPMI comparison | Joint probability must be compared with marginal expectation; negative PMI is commonly clamped | Eliminate raw-frequency intuition before geometry | Pair selector exposes joint, marginals, expectation, ratio and PPMI | deep |
| SVD | Distributional matrix-factorization literature | Truncated factorization preserves high-energy directions and discards low-energy detail | Explain where dense coordinates come from and what compression loses | Rank control changes retained energy and reconstruction error | deep |
| Geometry | Cosine definition and distributional evaluation practice | Normalized dot product compares direction without vector length | Make similarity computation inspectable and expose its limits | SVG vectors plus exact dot, norm product and cosine | deep |
| Contextual handoff | Static embedding limitations; later contextual representation work | One vocabulary vector conflates senses used in different contexts | Motivate RNN and Transformer state without pretending static vectors are obsolete | Same token receives different sentence-conditioned evidence | deep |

Interpretation boundaries: the tiny corpus and contextual weights are explanatory data, not reported benchmark results; the singular values are a controlled rank example rather than a factorization of the displayed corpus.

## Remaining article ledgers

### RNN

| Section | Source and anchor | Inclusion intent | Public transformation |
|---|---|---|---|
| State recurrence | Standard Elman recurrence and CS224N RNN language-model notes | Make weight sharing and prefix compression numerically visible | Scalar recurrence recomputes every state as recurrent weight changes |
| Language model | Autoregressive conditional factorization | Separate shifted training targets from free-running generation | Train/infer control plus temperature-dependent next-token probabilities |
| BPTT | Bengio et al., 1994; Pascanu et al., 2013 | Derive vanishing/exploding behavior instead of naming it | Local-Jacobian and distance controls show the exponential product |
| Runtime boundaries | Framework sequence batching practice | Expose mask, reset and detach bugs hidden by the core equation | Variable-length batch with PAD and truncated-BPTT boundary |

Interpretation boundary: the scalar Jacobian plot isolates exponential behavior and is not a measured gradient trace from a trained RNN.

### LSTM

| Section | Source and anchor | Inclusion intent | Public transformation |
|---|---|---|---|
| Modern cell | Hochreiter & Schmidhuber, 1997 plus later forget-gate work | Explain cell/hidden separation while preserving historical accuracy | Gate controls compute keep, write, cell and visible hidden values |
| Retention | Cell-state derivative path | Show that LSTM learns a retention rate rather than guaranteeing permanent memory | Forget-gate and distance controls compute retention and half-life |
| Variants | GRU/bidirectional definitions; Greff et al. variant study | Separate cell family from directionality and service constraints | Constraint-based variant comparison |
| Diagnostics | Gate saturation and sequence-length evaluation practice | Turn a correct equation into an operable debugging model | Gate presets connect symptoms, causes and required logs |

Interpretation boundary: modern LSTM equations include the later forget gate; the paper-spine article will reconstruct the 1997 architecture separately.

### Seq2Seq

| Section | Source and anchor | Inclusion intent | Public transformation | Boundary |
|---|---|---|---|---|
| Encoder-decoder contract | Sutskever et al., 2014, architecture and conditional probability | Connect variable input/output length to one computable objective | Source-length and hidden-width controls expose the fixed context bottleneck | Compression ratio is an explanatory pressure indicator, not mutual information |
| Teacher forcing | Target log-likelihood training procedure | Separate clean training prefixes from self-generated inference prefixes | Sequence-length and teacher-forcing controls expose compounding error | Independent 92% step accuracy is a controlled illustration |
| Beam search | Paper decoding procedure and later length-normalization practice | Separate model distribution from search and stopping policy | Beam width and alpha rerank visible hypotheses | Displayed hypotheses are illustrative, not a corpus benchmark |
| Attention bridge | Bahdanau et al., fixed-vector critique | Make the next paper necessary from the current architecture | Decoder step changes source weights and context | Alignment weights are not claimed as complete causal explanations |

### Attention

| Section | Source and anchor | Inclusion intent | Public transformation | Boundary |
|---|---|---|---|---|
| Q/K/V retrieval | Bahdanau; Luong; Vaswani attention equations | Establish one retrieval contract before naming variants | Query direction, temperature and mask recompute score, stable softmax and weighted output | Vectors are controlled explanatory data |
| Score families | Bahdanau additive, Luong dot/general, Vaswani scaled dot | Show historical change in compatibility function and compute shape | Segmented equation and cost comparison | No universal quality ranking is asserted |
| Self/cross | Transformer section 3 | Track Q/K/V source and score matrix shape | Source selector and causal toggle rebuild the flow | N is deliberately small; quadratic cost is explained separately |
| Multi-head | Transformer section 3.2 and CS224N attention exploration | Explain projection subspaces without anthropomorphizing heads | Stable head-count surface and concat/output flow | Example head names are possible views, not discovered functions |

### Transformer

| Section | Source and anchor | Inclusion intent | Public transformation | Boundary |
|---|---|---|---|---|
| Input and position | Vaswani et al., section 3.5 | Restore order information after recurrence removal | Position slider recomputes sinusoidal channels | Original sinusoidal position is separated from RoPE and later choices |
| Attention shape | Vaswani et al., sections 3.2-3.3 | Make B,H,N,d axes auditable before architecture prose | Batch, sequence and head controls recompute all tensor shapes and N-squared cells | Kernel-level fusion and memory constants are not benchmarked |
| Causal mask | Decoder masking description | Explain parallel teacher-forced training without target leakage | Query row exposes allowed and negative-infinity cells | Mask alone is not presented as sparse compute |
| Residual/norm/FFN | Original Post-LN block; LayerNorm paper; modern Pre-LN distinction | Separate token mixing, channel mixing and optimization path | Sublayer and norm-placement controls change execution flow | Modern Pre-LN is labeled as a later common variant |
| Families and KV cache | Architecture contracts and current inference cache documentation | Connect original encoder-decoder to encoder-only and decoder-only systems | Family comparison and exact cache-byte calculator | Cache number is for batch 1 fp16 and varies by architecture/layout |

### BERT

| Section | Source and anchor | Inclusion intent | Public transformation | Boundary |
|---|---|---|---|---|
| Bidirectional context | Devlin et al., introduction and model architecture | Contrast representation learning with causal generation | Target-position selector exposes visible context | Does not claim bidirectional is universally superior |
| Input contract | BERT input representation figure | Make special, segment and position embeddings separable | Sentence-pair toggle rebuilds token cells and shape | WordPiece splitting itself is taught in the tokenizer article |
| MLM recipe | BERT section 3.1 | Prevent confusion between 15% selection and 80/10/10 corruption | Token-count and policy controls calculate all categories | NSP is identified as original recipe, not a permanent requirement |
| Fine-tuning | BERT task figures | Turn “add a head” into a representation and tensor contract | Task selector changes read position, shape, loss and use | Frozen and parameter-efficient variants are later operational options |
| Limits | RoBERTa and subsequent encoder work | Show what later research changed instead of freezing BERT as doctrine | Limitation ledger connects symptom, consequence and response | Follow-up methods are directional context, not a benchmark ranking |

## Foundational paper spine

Every paper article uses the same reconstruction contract: historical bottleneck -> author intent -> executable claim -> equation semantics -> evidence intervention -> support/limit -> reproduction -> assumptions/failures -> legacy. The public article contains the knowledge needed to reason; the private mastery audit contains the problems used to test that sufficiency.

| Paper | Primary anchor | Original intent retained | Public reconstruction decision | Critical boundary |
|---|---|---|---|---|
| Bengio et al. 1994 | DOI `10.1109/72.279181`, Jacobian analysis and synthetic tasks | Distinguish representational memory from gradient-based learnability | Jacobian product, delay experiment, clipping limitation | Does not claim every modern RNN must fail |
| Hochreiter & Schmidhuber 1997 | Neural Computation paper, CEC and gate equations | Build constant error flow with controlled write/read | Original cell equation and long-lag evidence | The 1997 architecture has no forget gate |
| Sutskever et al. 2014 | Google Research/arXiv, architecture, reversal, experiments | Validate end-to-end variable-length transduction | Conditional factorization, reversal evidence, beam pipeline | Search quality is not model quality |
| Bahdanau et al. 2015 | arXiv paper, equations, length plot, alignments | Remove fixed-vector bottleneck by joint soft alignment | Additive score, dynamic context and evidence inspector | Heatmaps are not complete causal explanations |
| Vaswani et al. 2017 | Google Research/arXiv, architecture, tables, ablation | Replace recurrence/convolution with attention | Original block, translation evidence and head ablation | Original Transformer is not identical to a modern LLM |
| Devlin et al. 2018 | arXiv paper, MLM/NSP and task transfer figures | Create a reusable deeply bidirectional encoder | Exact corruption recipe, transfer evidence and later NSP boundary | Follow-up RoBERTa evidence prevents treating NSP as mandatory |
