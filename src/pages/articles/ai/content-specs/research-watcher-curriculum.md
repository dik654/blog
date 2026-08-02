# Research watcher and curriculum promotion content spec

## 1. Reader outcome

The reader can turn paper feeds, company research posts and repository releases into a versioned review queue, compare each candidate with a track's current top, and decide whether it is duplicate evidence, a current-source replacement, or a rare reusable foundation delta.

This article owns one decision: **what may change in the learning graph when a new source arrives, and what evidence must block automatic publication?**

Knowledge Compiler already owns normalization and Knowledge IR. RAG Pipeline already owns retrieval, claim provenance and evaluation. This article must not repeat those mechanisms; it applies them to longitudinal curriculum maintenance.

## 2. Private transfer problem

Do not print this problem verbatim in the article. Use it as the completion audit.

> A daily watcher collects 180 items from arXiv categories, company sitemaps and repository releases. It treats canonical URL as the only identity, summarizes every item, and automatically creates a new required article when keyword score exceeds 3. The batch includes an arXiv v1, its v2 with a corrected ablation, a company post describing the same work, a GitHub release that changes the runtime interface, a benchmark-only model scale-up, and a correction that invalidates a number already cited in the blog. After a month, the sidebar has 70 new required articles and four stale claims remain published. Redesign identity, evidence lineage, mechanism comparison, promotion, foundation delta, authoring and rollback gates.

### Expected reasoning

1. Separate `SourceEvent` from a stable `Work` and a specific `WorkVersion`; URL alone cannot merge paper versions, company explanations and code releases.
2. Preserve source organization, canonical identifier, version, retrieved time, content hash and `wasRevisionOf`/`hadPrimarySource`/`invalidates` relations.
3. Deduplicate manifestations of the same claim without discarding their distinct evidence roles. A company post is not automatically an independent confirmation of its own paper.
4. Route candidates to a track with deterministic recall-first rules, then use a bounded reviewer packet for relevance and claim extraction. Keyword score never publishes.
5. Compare the candidate against the current top on five contracts: compute, data, objective, runtime and verification.
6. Benchmark or scale changes become comparison evidence. A changed reusable contract may replace the current top. Publication date alone never promotes.
7. Add a foundation delta only if the mechanism changed, existing concepts cannot explain or reproduce it, the learner must calculate/implement/diagnose it, and it will be reusable.
8. Preserve the previous current source as hidden evidence history; do not append it as another mandatory paper.
9. Corrections, retractions and changed source hashes invalidate downstream claims and queue targeted rebuilds before new publishing.
10. Automatic stages may discover, normalize, deduplicate, route and draft review packets. Evidence validation, promotion, final article QA and release remain gated.
11. Evaluate discovery recall, routing precision, duplicate-merge error, stale-claim detection, promotion precision and review cost separately.
12. A 4B extractor sees one section/source event; a 9B reviewer sees the current-track packet and proposed delta; only the orchestrator changes graph order and publishes.

## 3. Source and claim ledger

| Source | Use | Boundary |
|---|---|---|
| arXiv API Access and API manual | Public metadata/API collection, identifier and version-aware retrieval | arXiv metadata is discovery evidence, not peer review or a truth score |
| W3C PROV-O | Entity, Activity, Agent, `wasDerivedFrom`, `wasRevisionOf`, `hadPrimarySource`, invalidation | Use the minimal subset needed; an OWL graph is not required for the first implementation |
| Crossref versioning and Retraction Watch API | Significant corrections/retractions and `update-to` relations | Coverage depends on deposited metadata and does not replace source-page checks |
| GitHub official webhooks and release event docs | Event-driven release evidence and delivery identity | A repository release proves artifact change, not paper claims or production quality |
| RFC 4287 Atom | Stable feed entry fields and update timestamps | Feed timestamps and publisher semantics vary; preserve the raw entry |
| Sitemaps protocol | Company research page discovery and last-modified hints | `lastmod` is a crawl hint, not proof that a scientific claim changed |
| Local `research-discover.mjs` and systemd timer | Existing deterministic discovery, routing hints, isolated source failures and daily schedule | Current implementation stops at a review queue and intentionally does not publish |

## 4. Required narrative

### 01. A queue is not a curriculum

- Start with a busy morning queue, not a history timeline.
- Separate automatic discovery from editorial promotion.
- State the one-current/one-canonical/minimum-foundation cap.

### 02. Identity and revision lineage

- Explain Work, WorkVersion, SourceEvent and Claim.
- Interactive event lineage: paper v1, paper v2, company post, code release, correction.
- Use content hashes and explicit relations; never overwrite prior evidence.

### 03. Normalize and route without publishing

- Poll Atom/sitemaps and accept webhooks where appropriate.
- Canonicalize URLs, preserve raw payloads, deduplicate identifiers/title/claim relations.
- Deterministic routing is recall-first; bounded LLM review is a second stage.

### 04. Compare contracts, not names

- Compute, data, objective, runtime and verification delta.
- Show examples of benchmark-only, current-top replacement and foundation-delta candidates.
- Explain evidence tier without treating vendor identity as correctness.

### 05. Promotion and foundation delta

- Watchlist, evidence-only, replace-current and add-foundation outcomes.
- Previous current becomes hidden evidence history.
- Foundation adds only when all four gates pass.

### 06. Correction and invalidation

- Source revision/retraction walks claim provenance edges.
- Rebuild affected claims/articles only; block publishing until stale evidence is resolved.

### 07. Small-model authoring packet

- 4B section extraction, 9B track comparison, orchestrator graph/order/QA.
- Private transfer problem, claim ledger, visualization misconception and forbidden claims.
- Drafts are not published automatically.

### 08. Evaluation and implementation

- Separate discovery, routing, dedup, promotion and freshness metrics.
- Connect to repository files, command and daily timer.
- State next implementation boundary: review packet compilation and signed editorial decision.

## 5. Formula contract

1. Contract delta as a set difference between candidate and current contracts, annotated in Korean.
2. Downstream invalidation closure from changed evidence through provenance edges, annotated in Korean.

Every display formula must have an adjacent `FormulaNote` explaining every symbol and why set difference or graph reachability is used.

## 6. Visual contract

### SourceLineageExplorer

- Manual source-event selection.
- Stable paper/work lane and event-specific evidence lane.
- Shows identity, relation, affected claims and action.
- No SVG or internal horizontal scroll at 360 px.

### PromotionDecisionWorkbench

- Three candidate scenarios: benchmark-only, changed contract explained by existing foundation, changed contract requiring a reusable foundation.
- Five contract-axis deltas and four foundation gates.
- Explicit outcome and reason, never a generic score or best badge.
- Mobile uses compact rows, not nested cards.

## 7. Small-model replay packet

Give a 4B-9B pipeline only:

- one source event plus stable identity hints;
- one current-track packet;
- the five contract axes;
- four foundation gates;
- source/claim ledger and evidence boundary;
- private problem answer key;
- exact output schema and forbidden claims.

### Forbidden claims

- Newer means required.
- Higher benchmark means a new mechanism.
- A company post independently confirms its own paper.
- A new current source makes the previous current another mandatory prerequisite.
- A keyword score can publish an article.
- arXiv publication status proves correctness.
- GitHub release activity proves production quality.
- A correction may be handled only on the next full rebuild.
- An LLM draft may bypass evidence, responsive UI and release QA.
