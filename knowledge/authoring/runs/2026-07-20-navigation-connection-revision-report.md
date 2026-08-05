# Blog navigation connection revision

> Superseded in visual and root-order semantics by `2026-07-20-systematic-topdown-curriculum-report.md`. The article fallback resolver remains valid, but the root is no longer presented as a foundation-first architectural layer list.

## 1. Why the previous hierarchy still felt disconnected

The sidebar had gained stages, but nodes at different semantic levels still looked equivalent. `AI 전체 지도` is an orientation document, while `지식 시스템` and `로봇 AI` are destination tracks. Putting all three beneath `AI 전체 지도 · 특화 경로` implied that they were alternate maps.

The same ambiguity continued below the sidebar. A parent such as `LLM` flattened every descendant article into one long list, even though its children represent independent goals: data, theory/alignment, efficient inference, serving and application. A leaf such as `Reth` exposed many articles but did not state where the reader was. Most articles also had no declared learning path, so opening one directly hid its local before/after relationship.

## 2. Navigation contract

Each level now answers one question only:

1. Root layer: where does this domain sit in the technical system?
2. Category stage: is this a map, target, just-in-time foundation or implementation track?
3. Parent subcategory: which independent branch matches the reader's goal?
4. Leaf subcategory: in what local order should the core articles be read?
5. Source or paper: what optional evidence supports the core explanation?
6. Article page: where am I, what came before and what comes next?

This is top-down globally and bottom-up only inside the selected local path. Historical age never decides placement by itself. A source is promoted into the core only when the next capability cannot be understood without it.

## 3. Structural changes

- Removed the artificial `AI 전체 지도 · 특화 경로` wrapper.
- Kept `AI 전체 지도` as the only stage `00` entry.
- Moved `지식 시스템` and `로봇 AI` into stage `01 목표 분야`.
- Made a parent label a real route and its chevron a separate disclosure control.
- Parent pages now show child branches first instead of flattening descendant articles.
- Parent-owned articles remain visible after the branches, fixing the AML/CFT exception.
- Leaf pages show a numbered core sequence, start/end context and a separate collapsed source section.
- Article breadcrumbs link back to their leaf topic.
- Articles without a hand-authored learning path receive a deterministic same-subcategory route with previous/current/next context.
- Long previous/next labels wrap inside the card instead of clipping or overflowing.

## 4. Corpus audit

The runtime audit covered 9 categories, 159 subcategories and 541 articles.

- 108 articles belong to a valid declared learning path.
- 433 articles use deterministic leaf-level fallback navigation.
- 0 articles have unresolved navigation.
- 0 learning-path steps point to a missing article.
- 0 articles reference an unknown learning-path ID.

The invalid frontier chain was removed because it mixed GPU HPC, Knowledge Compiler, robot systems, post-training and MoE streaming into one compulsory order. The NLP paper spine was restored as an explicit optional six-paper sequence from long dependencies and LSTM through Seq2Seq, attention, Transformer and BERT.

## 5. Decision trace and provenance

The placement decision was derived from the repository's category tree, article metadata, declared learning paths and rendered routes. No title-only semantic ordering was accepted.

For every node the audit asks:

- Reader intent: what can the reader do after this node?
- Strict dependency: which concept blocks that capability?
- Scope: is the node a branch selector or a read-through leaf?
- Evidence role: is this explanatory core or optional source reconstruction?
- Continuity: can a direct article visit expose its parent, position and adjacent step?

Future research and company articles should retain source identity, publication date, claim scope and the core concept they update. A new frontier item is appended at the top of the relevant target route; newly required foundations are added below only when the frontier item introduces a real prerequisite.

## 6. Small-model replay

A 4B worker receives one parent or one leaf at a time. It returns `node_kind`, `reader_outcome`, `strict_prerequisites`, `core_articles`, `optional_sources` and a one-sentence placement reason. It must not order by publication year or title similarity alone.

A 9B reviewer receives the complete category and checks branch exclusivity, orphan articles, cycles, missing source links and whether the first and last core articles form a coherent capability progression.

The orchestrator owns cross-category consistency, declared-path validation, fallback generation, responsive rendering, regression tests and deployment. The deterministic fallback is:

1. Find the exact containing subcategory recursively.
2. Separate source/paper records from core records.
3. Preserve authored order within each group.
4. Navigate inside the matching group only.
5. Prefer a valid declared path when one explicitly contains the article.

## 7. Verification

- Production Vite build passed; the existing large-chunk warning remains.
- Connection and sidebar tests passed 16/16.
- Full local Playwright regression passed 191/191.
- Public connection and sidebar tests passed 16/16; the targeted long-title mobile overflow test passed 1/1.
- LLM branch, Reth sequence and direct article context were visually inspected at 390, 768 and 1440 pixels.
- The inspected pages have zero horizontal document overflow.
- `cm-blog.service` is active after the 2026-07-20 23:16:08 KST restart; the root, LLM branch and direct article routes return HTTP 200.

## Artifacts

- Classification stages: `src/content/sidebar-learning-structure.ts`
- AI hierarchy: `src/content/ai/index.ts`
- Learning paths: `src/content/learning-paths.ts`
- Navigation resolver: `src/content/article-navigation.ts`
- Parent/leaf rendering: `src/pages/CategoryPage.tsx`
- Article context: `src/components/ArticleLayout.tsx`
- Connection QA: `tests/article-learning-connections.spec.ts`
- Sidebar QA: `tests/sidebar-information-architecture.spec.ts`
- Machine record: `knowledge/authoring/runs/2026-07-20-navigation-connection-revision.json`
