# Foundation floor and source stopping policy

## Problem

Every paper cites earlier work, and every scientific idea has older mathematical or physical ancestors. Recursively promoting each predecessor into a full article produces an infinite historical syllabus that a reader cannot finish. This blog builds an executable learning path, not a complete chronology.

## The floor

Every field or branch declares one **foundation floor** before source discovery begins.

1. **Shared floor**: the smallest reusable mathematics, physics, statistics, systems, or programming concepts needed to follow the branch. These are concept articles or compact bridges. They do not recurse into historical papers about arithmetic, calculus, mechanics, probability, or programming language history.
2. **Domain floor**: at most one canonical source per causal branch whose method, equation identity, experiment, or design contract must be reconstructed to gain a capability that the concept article cannot supply honestly on its own.
3. **Current layer**: the current concept article plus, when it materially changes a production decision, at most one modern paper, company research post, standard, or reference implementation.

The required reading path normally ends at these three layers. Older ancestors remain citations or a compact lineage note.

## Standalone source budget

- Default per concept node: **one canonical foundation + one current evidence source**.
- A concept may cite any number of relevant sources, but citation does not imply a standalone article.
- A source article may name predecessor work, but it does not recursively require predecessor source articles.
- A second canonical source is an exception. It requires a distinct reader capability, a separate causal branch, and a written reason that embedding it would make the public article misleading.
- Publication date, citation count, institutional prestige, and historical priority never justify the exception by themselves.

## Promotion gate

A discovered source becomes a standalone article only when all mandatory questions and at least one value question pass.

### Mandatory

1. Does it contribute a unique premise required by the branch's private hardest problem?
2. Is that premise absent from the existing concept and source nodes?
3. Can the reader name a calculation, implementation, experiment interpretation, or failure diagnosis they gain from reconstructing it?
4. Is its claim/evidence boundary important enough that a short citation would likely cause overclaim or method mixing?

### Value

- The source becomes a prerequisite for one of the next two public nodes.
- It repairs a documented misconception or equation-identity failure.
- It supplies current production evidence that changes a design or release decision.

If a mandatory answer is no, the decision is `embed`, `cite-only`, or `defer`, not `standalone`.

## Stop test

Backward prerequisite tracing stops when any one condition holds:

- the older source adds provenance but no new executable premise;
- the needed premise already exists in the shared or domain floor;
- the hardest problem can be solved without reconstructing the older artifact;
- the source would only explain where a known equation/name came from;
- promoting it would exceed the source budget without a documented exception.

The run ledger records the exact stop reason. `No more sources found` is not an acceptable reason; the stop must follow from reader capability and scope.

## Machine-readable floor record

Each new branch stores this object in its content spec or run JSON:

```json
{
  "branch": "robot-contact-tribology",
  "sharedFloor": ["calculus", "signals", "statistics", "actuator mechanics", "structural mechanics"],
  "domainFloor": {
    "source": "Hamrock-Dowson 1978",
    "uniqueCapability": "preserve four-regime and minimum-film equation identity"
  },
  "currentEvidence": "SKF RTD 2023",
  "standaloneSourceBudget": 2,
  "olderSources": [
    {"source": "Hertz/Reynolds/Barus antecedents", "decision": "cite-only", "stopReason": "the shared concept floor already supplies the required mechanics"}
  ]
}
```

## Discovery behavior

New-paper and company-research tracking first creates a discovery/evidence record. It does not automatically create a public article.

1. Attach the source to the lowest existing concept node that already supplies its prerequisites.
2. Run the promotion gate against that node's hardest problem and source budget.
3. Prefer updating the existing concept, evidence ledger, or current-source article.
4. Create a new public source article only when the gate passes.
5. Never reopen the branch below its declared floor because a new source cites older work.

## Reader-facing consequence

Required paths show the minimal floor and current route. Historical lineage, optional deep dives, and deferred sources must be visually and semantically separate from required reading so a reader knows where they may stop.

### Top-down prerequisite ladder

When a retained canonical source still assumes mathematics, science, or engineering that the target reader cannot explain, build a short concept ladder downward from that source.

- Each rung must name the exact source sentence, equation operation, figure transition, or implementation step it unlocks.
- A rung is a concept article, interactive bridge, or existing shared foundation. It is not another historical paper unless the standalone-source promotion gate independently passes.
- The ladder stops when the reader can execute the canonical source's hardest required calculation or diagnosis. It does not continue to the historical origin of calculus, mechanics, probability, or numerical methods.
- Reuse an existing shared article before creating a new one. Create a new rung only when the source has a named prerequisite that no existing article teaches at the needed operational depth.
- Default visible ladder budget is five rungs. Additional references remain inside the article or evidence ledger.
- The source is the top of the ladder: readers may skim it first, descend only at the point of failure, and return. Do not force completion of every rung before the source can be opened.

### Default visibility

- Concept routes are expanded by default.
- Standalone source articles are reachable by direct link and search but are collapsed in category listings.
- A source bundle is opened only by an explicit reader action such as `원문 근거 펼치기`.
- Discovery records, lineage-only sources, and sources below the declared floor never appear in the default public list.
