# Small-model deep article protocol

This protocol narrows the blog reconstruction workflow so a 4B-9B model can complete one bounded article without carrying the whole curriculum in context.

## 1. Fixed input packet

Give the model only:

1. One article slug and one-sentence reader outcome.
2. The immediately previous and next curriculum nodes.
3. One content spec with scope, private transfer problem, source ledger, narrative, formula contract, Viz contract, and coverage gate.
4. One immutable foundation-floor record with source budget, standalone sources and explicit cite-only stop reasons.
5. Extracted source passages grouped by claim. Do not ask a small model to discover and read an unbounded corpus in the same pass.
6. Two nearby repo articles and the shared components it must reuse.
7. A file allowlist and exact validation commands.

## 2. Decompose by artifact, not by vague role

Run separate bounded passes. Each pass receives the prior artifact, not the entire conversation.

| Pass | Input | Output | Reject when |
|---|---|---|---|
| Gap audit | curriculum neighbors, current article metadata, floor record | missing concept chain inside the declared floor | it lists topics without a dependency reason or recursively expands below the floor |
| Evidence compile | primary-source excerpts | claim/boundary/intent rows | a claim lacks source location or is stronger than evidence |
| Transfer gate | scope and claims | hardest private problem and required insights | it can be solved by memorizing definitions only |
| Narrative | transfer gate and source ledger | section claims and derivations | a premise has no public section |
| Formula pass | narrative equations | raw LaTeX, Korean annotations, notes | units, operation reason, or failure boundary is missing |
| Viz pass | one section at a time | one measurable interactive Viz | interaction changes decoration but not evidence |
| Integration | completed section artifacts | TSX, metadata, paths | it invents a new design system or breaks ordering |
| QA repair | screenshots and machine checks | defect list and minimal patch | it declares success without rerunning the failed check |

## 3. Claim packet schema

```json
{
  "claim_id": "camera.pixel_is_ray",
  "public_claim": "One pixel defines a camera ray but not metric depth.",
  "source": "OpenCV calib3d pinhole model",
  "source_excerpt": "short extracted passage or equation",
  "boundary": "Assumes a calibrated pinhole model before distortion handling.",
  "section": "pixel-ray",
  "formula": "r_c proportional to K^-1 [u v 1]^T",
  "viz_observable": "multiple depths project to the same pixel",
  "transfer_requirement": "reader distinguishes Z depth from Euclidean range"
}
```

## 4. Section packet schema

```json
{
  "section_id": "image-geometry",
  "question": "What changes when an image is cropped and resized?",
  "prerequisite": ["intrinsic matrix", "pixel origin"],
  "derivation_steps": ["subtract crop origin", "apply axis scale"],
  "failure_case": "reuse original K",
  "formula_ids": ["camera.resize_crop_k"],
  "viz": {
    "control": ["crop_x", "scale", "correct_or_stale"],
    "measured_output": ["ray_x", "miss_distance_cm"],
    "invariant": "correct K preserves the physical ray"
  },
  "coverage_gate_ids": ["crop_resize_changed_image"]
}
```

## 5. Context budget rules for 4B-9B models

- One pass handles one section or one Viz. Never request a complete deep article plus paper reconstruction in one generation.
- The model may not add a standalone predecessor paper. It emits a promotion request with the unique missing premise and lets the orchestrator run the source budget gate.
- Keep no more than 4-6 source claims in a generation packet.
- Replace full PDFs with section extracts and a source map prepared by a stronger retrieval pass.
- Use exact equations and symbol tables as immutable input; small models may explain them but should not silently rewrite them.
- Require structured output before prose. Validate IDs and missing fields mechanically.
- Use deterministic templates for metadata, SourceNotes, FormulaNote, learning paths, and paper specs.
- Keep design tokens, viewBox sizes, mobile breakpoints, and color roles fixed. Let the model choose data and explanation, not arbitrary styling.
- Feed QA failures back as one defect packet at a time: viewport, selector, expected invariant, observed value, screenshot path.

## 6. Mechanical gates

Every article must pass:

1. Every private transfer premise maps to a public section, formula, Viz, or validation ledger.
2. Every primary claim has source, evidence boundary, and inclusion intent.
3. Every source bundle stays within its declared foundation floor and standalone budget, or carries an approved exception with a unique reader capability.
4. Every display formula renders, has a Korean in-equation annotation, and a nearby operation-rationale note.
5. Every Viz has a control, a measurable output, a stated invariant, fixed responsive dimensions, and no clipped text.
6. 360, 390, 768, and 1440 px have zero document horizontal overflow.
7. KaTeX errors, missing annotations, clipped SVG text, and console errors are zero.
8. Targeted lint and production build pass.
9. Public URL returns 200 and repeats the browser checks after deployment.

## 7. Escalation rules

A small model must stop and emit a structured escalation when:

- two primary sources disagree and the difference affects the public claim;
- transform direction, tensor shape, units, or equation notation is ambiguous;
- a requested Viz needs a domain simulator not present in the repo;
- QA requires editing outside the allowlist;
- the transfer problem exposes a premise absent from the source packet.
- a requested predecessor would cross the declared foundation floor or exceed the source budget.

The escalation output contains `blocking_claim`, `candidate_interpretations`, `missing_evidence`, and `smallest_next_action`.

## 8. Persist a replayable run ledger

Do not rely on chat history. After every pass, append a compact event to the run JSON.

```json
{
  "event_id": "qa.math.mobile.001",
  "phase": "qa_repair",
  "input_artifact": "360px browser metrics and screenshot",
  "observed": "minimum display-math scale is 0.52",
  "inference": "the formula contains multiple semantic operations in one row",
  "decision": "split the derivation into named aligned rows",
  "changed_files": ["article.tsx"],
  "verification": {
    "command": "node article-qa.cjs",
    "expected": "minimum scale >= 0.75 and overflow = 0",
    "actual": "minimum scale = 0.78 and overflow = 0"
  }
}
```

The ledger must preserve failed attempts. A small model learns more reliably from `observed -> inference -> repair -> verification` than from a final diff without rejected states.

## 9. Replay strategy for 4B and 9B models

- A 4B model receives one claim packet or one QA defect. Limit code context to the target component, its shared primitive, and one reference implementation.
- A 9B model may receive one complete section packet with 4-6 claims and one Viz, but not the whole article and paper spine together.
- The orchestrator owns retrieval, dependency ordering, immutable equations, file allowlists, and final integration.
- Use JSON schema validation between passes. Reject missing IDs instead of asking the next model to infer them from prose.
- Run browser checks outside the model and return normalized defect packets containing viewport, selector, expected invariant, actual metric, and screenshot path.
- Escalate after two failed repairs of the same invariant. Do not let a small model broaden scope to compensate for missing evidence.
