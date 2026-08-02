# Document Structure Assembly Content Spec

## Reader contract

This article starts from a document-level failure: every page looks correct, but a retrieval answer attaches a number to the wrong heading because the paragraph and table were split at page boundaries. A reader should be able to:

1. distinguish page parsing from document assembly,
2. normalize heterogeneous OCR output into provenance-preserving typed blocks,
3. score paragraph, table, title and caption relations from explicit evidence,
4. abstain instead of inventing a missing cell or hierarchy edge,
5. synchronize overlapping long-document chunks without silently overwriting conflicts,
6. build a document tree while keeping rendering units and retrieval units separate,
7. design release gates for cross-page structure and citation fidelity.

## Current-first spine

1. Current pressure: page-level VLM OCR is strong, but RAG needs coherent document-level structure.
2. Input contract: typed blocks preserve page, bbox, reading order, content, confidence and source references.
3. Relation contract: geometry, type, style and semantic continuity are evidence, not permission to hallucinate.
4. Repair contract: paragraph continuation, table continuation, title hierarchy and image-text association are separate decisions.
5. Long-document contract: dynamic chunks overlap; repeated decisions synchronize or enter conflict review.
6. Output contract: a rooted document tree plus provenance-preserving retrieval nodes.
7. Release contract: relation metrics, hierarchy TEDS, retrieval correctness, citation fidelity and abstention coverage.

## Source claim boundaries

- PaddleOCR-VL-1.6 official documentation establishes a compact 0.9B page parser, claimed OmniDocBench/Real5 performance and its progressive post-training recipe. It does not establish document-level cross-page correctness.
- MinerU-Popo establishes the four post-processing subtasks, 30K generated examples, Qwen3-VL-4B fine-tuning, overlap synchronization and a tree-structured output. Reported hierarchy and RAG gains remain paper claims.
- DoclingDocument is used as an implementation example of a unified, serializable document IR. It is not presented as the only valid schema.
- PubTabNet/TEDS establishes tree-edit evaluation for table HTML. TEDS alone does not prove correct business meaning or cross-page association.

## Private transfer problem

A 264-page multilingual clinical-trial binder contains:

- page 136 ending with a seven-column adverse-event table under a two-row merged header,
- page 137 starting with six detected columns because one severity header spans two cells,
- page 203 ending with an unnumbered safety heading whose body starts on page 205 after a blank separator page,
- a dosage figure on page 219 whose candidate caption appears on page 221 with a conflicting figure number,
- two page parsers that disagree about reading order on pages 137 and 205.

The reader must produce relation decisions with evidence, abstention states, a provenance-preserving document tree and a fail-closed release decision without creating any text or numeric value absent from the source.

## Formula contract

1. Relation score combines geometry, type/schema, style and semantic evidence with Korean underbraces.
2. Relation acceptance includes an explicit abstention threshold and margin.
3. Long-document chunk interval shows chunk length and overlap with Korean annotations.
4. Release decision requires every critical gate to pass.

Every display formula is followed by `FormulaNote`. Raw LaTeX must not appear in prose.

## Viz contract

### PageToDocumentAssemblyLab

- Toggle between page-only and assembled views.
- Show page fragments, typed block identities, accepted/review relations and the resulting tree.
- The default fixture must expose a split paragraph, table and caption.
- CSS grid only; no fixed-width SVG and no horizontal pan.

### CrossPageRelationLab

- Select paragraph, table, title or caption.
- Show independent evidence channels and the final accept/review/reject decision.
- A high semantic similarity fixture with incompatible table schema must abstain.

### OverlapSynchronizationLab

- Select agreement, conflict or missing-overlap fixtures.
- Show chunk windows, duplicate relation IDs, merge result and review queue.
- Never resolve a conflict by choosing the more fluent output.

## Small-model authoring packets

### 4B writer packet

One relation type, one source claim, one typed input fixture, one decision oracle, one Viz state and exact mobile acceptance criteria.

### 9B writer packet

One full causal section: document symptom, page/assembly boundary, evidence features, abstention rule, provenance result, transfer question and release check.

The orchestrator owns source conflicts, path order, symbol consistency, private transfer tests, browser QA and deployment.
