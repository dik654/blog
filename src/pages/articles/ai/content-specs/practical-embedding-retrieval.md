# Practical embedding retrieval and adaptation

## Editorial intent

This branch teaches how to turn an embedding into a versioned retrieval system.
It does not rank model names in a static table.

The common decision loop is:

1. define the query, corpus, relevance judgement, deployment novelty and action,
2. create leakage-safe query/corpus/evaluation partitions,
3. freeze encoder, preprocessing, instruction, normalization and index versions,
4. measure an exact-search baseline before approximate search,
5. inspect false neighbors and missed positives,
6. change pair geometry or domain adaptation only when the error evidence asks
   for it,
7. rebuild the full corpus index and release query encoder and index together.

## Learning-path topology

```text
Image retrieval
└─ Defect retrieval contract
   └─ Contrastive pair geometry
      └─ Domain adaptation and reindex

Text retrieval
└─ Query/document embedding contract
   └─ Domain adaptation and reindex
```

`domain-finetuning` is a shared optional branch. It follows
`contrastive-learning` on the image path and `sentence-embeddings` on the text
path. It is not a mandatory final step.

## Article contracts

### Defect image retrieval

- Define relevant by the operational action: same appearance, defect type, root
  cause or disposition are different labels.
- Split by independent product, lot, capture session, equipment, site or future
  period before generating query/corpus pairs.
- Keep encoder, checkpoint, preprocessing, crop, normalization, dimension and
  index versions in one coordinate-system manifest.
- Separate exact similarity quality, approximate-index recall, metadata
  filtering, reranking and final evidence packaging.
- Audit missed positives and false neighbors by slice.
- Rebuild and atomically swap the index when the coordinate system changes.

### Contrastive pair geometry

- Begin from a concrete false-neighbor report.
- Explain that augmentation defines an invariance claim and can erase the
  defect if chosen incorrectly.
- Explain normalized embeddings, temperature-scaled InfoNCE and multi-positive
  supervised contrastive learning.
- Make false negatives, duplicate entities and batch composition visible.
- Present triplet loss as a targeted alternative, not a historical mandatory
  stage.
- Evaluate with the fixed production query/corpus set, not only loss or linear
  probe accuracy.

### Domain adaptation

- Diagnose acquisition shift, vocabulary shift and relevance-definition shift
  separately.
- Compare frozen baseline, preprocessing repair, unsupervised continued
  pretraining and supervised metric/task tuning as different interventions.
- Preserve tokenizer/preprocessing and old-domain anchors unless a deliberate
  migration is planned.
- Track source, license, deduplication, split and objective lineage.
- Measure target-domain gain and general-capability regression.
- Release through a shadow index, full reindex, dual-read comparison and
  rollback.

### Text embeddings

- Begin from query, document, relevance and action, not CLS versus mean pooling.
- Explain masked mean pooling from token states and the attention mask.
- Separate bi-encoder candidate retrieval from cross-encoder reranking.
- Explain asymmetric query/document instructions as model-specific input
  contracts.
- Treat E5, BGE-M3 and Qwen3 Embedding as bounded lineages/current candidates,
  not a permanent ranking.
- Include Korean, multilingual, code and long-document slices when relevant.
- Distinguish public MTEB/MMTEB orientation from the production corpus release
  gate.

## Hard transfer questions

The prose is complete only if a reader can reason through these private tests.

1. A model retrieves the same component photographed from another angle, but
   not a different component with the same root cause. Is that a model failure
   or a relevance-label mismatch?
2. Why does putting two images from the same lot on opposite sides of a random
   split overstate retrieval quality?
3. A new HNSW index loses 3% recall although embeddings are unchanged. Which
   layer should be debugged?
4. Why can a color-jitter augmentation erase the signal for discoloration
   defects while helping shape retrieval?
5. A batch treats two samples from the same cause as negatives. What gradient
   error does InfoNCE receive?
6. Why does adding only the hardest negatives destabilize training when labels
   are noisy?
7. In-domain retrieval rises after continued pretraining while general queries
   collapse. Which anchor evaluation and release policy were missing?
8. Why must changing a tokenizer, prefix, pooling rule or checkpoint trigger a
   full reindex?
9. Query and document use a Qwen3 embedding model, but the query instruction is
   omitted. Why can a high public leaderboard score fail to transfer?
10. Bi-encoder recall is high but the top five are poorly ordered. Why is
    reranking a separate intervention rather than an embedding replacement?

## Formula policy

- Every displayed formula uses `FormulaPair` and `String.raw`.
- Korean underbraces explain semantic operations.
- A Korean meaning and symbol ledger immediately follow every formula.
- Long formulas are split into aligned rows.
- At 390 px, formulas must fit without horizontal scroll and keep an auto-fit
  scale of at least 0.80.

## Viz policy

Every lab must change a decision, not only a color.

1. `relevance-contract`: operational goal changes positives and hard negatives.
2. `retrieval-stack`: exact/vector search, ANN, metadata and reranking have
   different failure evidence.
3. `pair-mining`: identity-safe labels change positive, negative and false
   negative assignments.
4. `domain-shift-gate`: observed shift and label availability change the first
   adaptation intervention.
5. `pooling-mask`: including padding changes the sentence vector.
6. `text-retrieval-contract`: instruction and reranking choices change the
   valid release path.

Labs use stable responsive grids, restrained multi-hue accents, icons with text
labels, no SVG text, no nested decorative cards and no internal horizontal
scroll.

## Primary-source boundary

- Image encoders: CLIP, SigLIP and DINOv2 primary papers.
- Approximate search: HNSW primary paper.
- Contrastive objectives: SimCLR, Supervised Contrastive Learning and FaceNet.
- Domain adaptation: Don't Stop Pretraining, used within its NLP domain/task
  protocol rather than as a universal recipe.
- Text representation: Sentence-BERT, E5, multilingual E5, BGE-M3 and Qwen3
  Embedding primary papers/model card.
- Evaluation: MTEB documentation and MMTEB paper.

No paper accuracy, batch size, temperature, margin, prefix, embedding dimension,
index parameter or latency multiplier becomes a universal recommendation.
