# NLP foundational paper spine

## Placement principle

Readers alternate between a concept reconstruction and the paper that made the next structural move. Publication order is preserved only when it also respects prerequisites.

## Core sequence

| Order | Concept foundation | Paper reconstruction | Why it belongs here | Next limitation |
|---|---|---|---|---|
| 1 | Tokenizer | Sennrich et al., 2016, subword NMT | Unicode/vocabulary trade-offs must be understood before the rare-word result and merge procedure are interpretable | Token IDs still have no learned semantic geometry |
| 2 | Distributional semantics + Word2Vec | Mikolov et al., 2013 / GloVe 2014 bridge | Count, context prediction and vector geometry become one representation family | One vector cannot encode order or sentence-specific meaning |
| 3 | RNN and BPTT | Bengio et al., 1994, long-term dependency difficulty | The gradient product can be derived before reading the paper's optimization dilemma | Long-range error flow decays or explodes |
| 4 | Modern LSTM cell | Hochreiter & Schmidhuber, 1997, LSTM | The modern gate equations are separated from the original constant-error argument and later forget-gate addition | Computation remains sequential and memory is fixed-size |
| 5 | Seq2Seq | Sutskever et al., 2014, sequence to sequence learning | Encoder/decoder state and teacher forcing make the experiment and reversal trick interpretable | One final vector bottlenecks long inputs |
| 6 | Attention | Bahdanau et al., 2015, jointly learning alignment and translation | Score, softmax and context vector are already computable before the paper's alignment claim | Recurrence still prevents full sequence parallelism |
| 7 | Transformer | Vaswani et al., 2017, Attention Is All You Need | QKV, heads, masks, residual/norm/FFN and training/inference paths are prerequisites | Autoregressive/translation objectives do not give a bidirectional encoder representation |
| 8 | BERT | Devlin et al., 2018, BERT | Encoder masking and MLM supervision make the pre-training/fine-tuning claims testable | Objective mismatch, corruption scheme and encoder-only limits motivate successors |

## Article contract

Each paper node uses `knowledge/authoring/paper-article-protocol.md`, owns a source-intent ledger and passes numerical, tensor-shape, experiment-interpretation and failure-diagnosis audits. Company research articles discovered later can attach as successor nodes but cannot replace these foundations.

## Automatic growth rule

When discovery finds a new paper or company research post:

1. Extract its prerequisites and predecessor claims.
2. Link it to the lowest existing node that supplies every prerequisite.
3. Compare the missing prerequisite with the branch's declared foundation floor and standalone source budget.
4. If it lies inside the floor, create or expand a concept bridge first; do not recursively promote historical predecessor papers.
5. Decide whether the source updates an existing node, becomes the one canonical/current reconstruction, stays cite-only, or becomes an optional application branch.
6. Publish only after the promotion gate, provenance, mastery and responsive visual gates pass.

The automatic process discovers sources, not articles. A new source creates a public route only when it contributes a unique premise needed by the hardest problem and cannot be represented safely as an update, embedded evidence or lineage citation.
