# Paper article reconstruction protocol

## Goal

A paper article must let a reader place the work in the field, reconstruct the method, interpret the evidence and identify the limits without depending on a conventional section-by-section summary.

## Promotion and stopping gate

Apply `knowledge/authoring/foundation-floor-policy.md` before drafting. A paper is not promoted merely because the current source cites it or because it is historically first. Record the branch's shared floor, one domain-floor source, current-evidence slot, source budget and stop reasons.

The default source bundle for one concept is one canonical foundation plus one current evidence source. Older predecessors stay in citations or a lineage note when they add provenance but no unique premise needed by the private hardest problem. A standalone exception must name the distinct calculation, implementation, experiment interpretation or failure diagnosis the reader gains.

## Ingestion

Read the complete paper before drafting, including captions, tables, appendix and ablations. Normalize the material into evidence records while retaining page and figure anchors.

For a long paper, parsing may be staged, but interpretation waits until the whole evidence map exists. Missing extraction is represented as missing, not silently summarized away.

## Required article structure

### 1. Research position

- Literal research question and task definition
- What prior systems could not do
- Which assumptions the paper keeps and changes
- Where the paper sits in the prerequisite and successor graph
- Why this paper passes the standalone promotion gate and where backward tracing stops

### 2. Claim map

- One falsifiable claim per row
- Evidence type: theorem, controlled experiment, ablation, qualitative example or engineering observation
- Evidence strength and alternative explanation

### 3. Method reconstruction

- Input and output contract
- Component graph and execution order
- Tensor/data shapes at every boundary
- Training objective and inference procedure separated
- Implementation choices required to reproduce behavior

### 4. Equation reconstruction

- Intuition before notation
- Symbols, units and shapes
- Why the operation is used instead of a plausible alternative
- Small numeric example
- Gradient or optimization consequence when relevant

### 5. Figure reconstruction

- What data is visible at each step
- Direction of information flow
- Which invariant the figure proves
- Which visual elements are illustrative rather than measured
- Interactive reconstruction when changing a value clarifies the mechanism

### 6. Evidence and ablation

- Dataset, split, baseline, metric and compute conditions
- Main result separated from supporting ablations
- Negative results and appendix details that change interpretation
- Statistical or measurement limitations

### 7. Failure and boundary

- Assumptions required for the method to work
- Known failure cases and likely production failures
- What the paper does not claim
- Later work that repaired or replaced the limitation

### 8. Reproduction and handoff

- Minimum implementation plan and checks
- Expected tensor shapes, metrics and sanity tests
- Concept graph links to prerequisites and successors
- Remaining questions that require another paper or article
- Older sources intentionally kept as embedded or cite-only lineage, with the stop reason

## Private mastery audit

Research course assignments, reproduction issues and expert critiques related to the paper. Create private problems in four modes: numerical derivation, shape/algorithm trace, experiment interpretation and failure diagnosis.

Do not publish the audit questions as filler. Use them to find missing evidence. The article passes only when its own prose, equations and Viz provide every premise needed for a reasoned solution.

## Video and presentation companion

When a talk exists, align transcript timestamps with slide frames and paper claims. A speaker explanation can clarify intent but cannot replace the paper as evidence for a reported result. Demos are recorded as qualitative evidence with their setup and selection limits.
