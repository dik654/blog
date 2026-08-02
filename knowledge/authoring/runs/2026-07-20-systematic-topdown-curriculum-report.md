# Systematic top-down curriculum revision

## 1. Failure found after the connection audit

The earlier pass made every article reachable, but reachability did not create a curriculum. Three conflicting visual and semantic rules remained:

- The root ordered categories as foundation, capability and operations, while category pages ordered target, foundation and build.
- AI placed fourteen target areas in an unstructured card grid, so nearby placement looked like dependency even when no dependency existed.
- The home page promoted a bottom-up foundation path above the requested current-first route.

The card grid also changed height and emphasis according to thumbnail availability. Readers saw a gallery, not a system.

## 2. Single navigation grammar

The root, sidebar, category page and article breadcrumb now use one direction:

1. `STEP 01 목표 시스템`: choose the current system or research outcome.
2. `STEP 02 필요한 기반`: descend only when a concept blocks the target.
3. `STEP 03 구현 · 운영`: return to code, deployment, observation and control.

Inside a category the only stage roles are `ORIENT`, `START`, `REFERENCE` and `APPLY`. A parent is a branch selector, a leaf is an ordered reading sequence, and a paper or research reconstruction is optional evidence unless a strict dependency promotes it.

## 3. AI target taxonomy

The fourteen AI targets are no longer one flat list. They are grouped without creating fake routes:

- `언어 · 지식`: LLM architecture, LLM, NLP/attention, speech/audio and knowledge systems.
- `인식 · 생성`: generative models, open image/video, computer vision and Document AI.
- `행동 · 예측`: agents, reinforcement learning, world/physical models, robot AI and time series.

These clusters answer what kind of capability the reader is building. They do not impose a cross-cluster reading order.

## 4. Visual grammar

Every curriculum node now has the same stable fields:

- two-digit position,
- route name as a semantic heading,
- outcome-oriented description,
- leaf article count or descendant path count,
- one navigation arrow.

Random thumbnail height, icon-card grids and card hover elevation were removed from navigation. Category pages use a connected stage rail. Parent pages reuse the same numbered rows. Article breadcrumbs expose `category → stage → leaf`, and long text wraps instead of clipping.

Color is limited to small semantic signals: green orientation, blue target, amber foundation and rose implementation. Structure remains legible without relying on color.

## 5. Small-model replay

A 4B classifier receives one node and must return:

```json
{
  "role": "map | target | foundation | build",
  "capability_after_reading": "one concrete outcome",
  "strict_prerequisite": false,
  "cluster": "language-knowledge | perception-generation | action-prediction | null",
  "evidence_only": false
}
```

It may not infer order from publication year, title similarity or current sidebar position.

A 9B reviewer receives one category and checks that every top-level node is claimed exactly once, clusters do not overlap, target nodes appear before foundations, and every direct article breadcrumb resolves to one stage and one leaf.

The orchestrator owns root ordering, cross-category consistency, responsive layout, corpus-wide overflow audit, regression testing and deployment.

## 6. Verification

- Production Vite build passed; the existing large-chunk warning remains.
- Sidebar and article connection tests passed 16/16.
- Systematic map tests passed 3/3 across all nine categories on mobile and desktop.
- Full local Playwright regression passed 194/194.
- All nine category pages passed a mobile internal-element overflow audit.
- AI was visually inspected at 390, 768 and 1440 pixels; home, ZKP parent and a direct article were also inspected.

## Artifacts

- Root order: `src/content/category-groups.ts`
- Stage and cluster model: `src/content/sidebar-learning-structure.ts`
- Sidebar: `src/components/Sidebar.tsx`, `src/components/sidebar/CategoryItem.tsx`
- Roadmap rendering: `src/pages/CategoryPage.tsx`
- Stable route rows: `src/pages/category/SubcategoryCard.tsx`
- Home route: `src/pages/home/LearningPaths.tsx`
- Article coordinate: `src/components/ArticleLayout.tsx`
- QA: `tests/systematic-learning-map.spec.ts`
- Machine record: `knowledge/authoring/runs/2026-07-20-systematic-topdown-curriculum.json`
