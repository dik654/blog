# Blog sidebar information architecture report

> Correction: the first revision incorrectly grouped `AI 전체 지도`, `지식 시스템`, and `로봇 AI` under one map wrapper. The follow-up connection audit moved the latter two to `목표 분야` and made `전체 지도` a single orientation entry. Article-level sequencing is documented in `2026-07-20-navigation-connection-revision-report.md`.
>
> Final correction: treating the root as a foundation-first architecture map still reversed the category-level direction. `2026-07-20-systematic-topdown-curriculum-report.md` replaces it with one global `목표 시스템 → 필요한 기반 → 구현 · 운영` order.

## 1. Observed conflict

The old sidebar used one flat `도메인 지식` list for all nine categories. Its order mixed AI, computer science, blockchain, cryptography, networking, hardware and operations without declaring whether the order represented dependencies or interests.

AI repeated the same ambiguity internally. `AI Systems from Scratch` was a top-down destination map, while `Foundations` and `Math & Science` looked like the start of a bottom-up textbook. Current LLM, vision, generative, agent and implementation tracks then followed in another order. Readers had to infer the navigation rule from names alone.

## 2. Chosen navigation rule

Two different questions now have two explicit levels:

- The blog root is an architectural layer map, not a reading order: `컴퓨팅 기반`, `모델 · 신뢰 시스템`, `운영 · 통제`.
- A category is a top-down learning route: `전체 지도`, `목표 분야`, `필요한 기반`, `구현 · 운영`.

This matches the curriculum floor policy. Readers choose a current capability first, descend only to the prerequisite that blocks them, then return to implementation. A foundation article may still teach its own local concepts bottom-up; it is no longer confused with the global entry point.

## 3. Category placement

`컴퓨팅 기반` contains computer systems, hardware/GPU, cryptography and P2P/networking. `모델 · 신뢰 시스템` contains AI, blockchain and TEE. `운영 · 통제` contains operations and ISMS/AML.

Every published category received a bounded internal stage map. No subcategory falls into the fallback `그 밖의 주제` bucket.

AI is organized as:

1. 전체 지도: AI 전체 지도 only.
2. 목표 분야: LLM architectures, LLM, generative/open media, vision, OCR, NLP, reinforcement learning, time series, agents, knowledge systems and robot AI.
3. 필요한 기반: deep-learning foundations and math/science reinforcement.
4. 구현 · 운영: practical ML, Rust framework implementation, agent operations and Claw Code.

## 4. UI and accessibility changes

- Desktop sidebar width increased from 224 to 256 pixels so Korean labels do not crowd the chevron.
- Layer headers now carry a restrained Lucide icon, stable layer number and short Korean label.
- Expanded category stages use a compact numbered rail rather than another card stack.
- English/Korean mixed navigation labels were normalized to Korean-first labels.
- Category links and expand buttons are no longer nested interactive elements.
- Hand-drawn menu, close and chevron SVGs were replaced with Lucide icons.
- The active `?sub=` route now opens its parent branch and highlights the exact subcategory and stage.
- Category index pages render the same stages and order as the sidebar.

## 5. Verification

- Production Vite build passed in 19.71 seconds; the existing large-chunk warning remains.
- New sidebar information-architecture tests passed 8/8.
- Full local Playwright regression passed 155/155 in 34.4 seconds.
- Public-host sidebar tests passed 8/8 in 7.0 seconds.
- Desktop 1440x900, tablet 768x1024, mobile 390x844 and mobile 360x800 were visually inspected.
- All four widths have zero document or sidebar horizontal overflow.
- Root layer order, all nine category placements, AI stage order and active foundation highlighting are asserted.
- `cm-blog.service` is active after the 20:14:40 KST restart; the blog root and AI foundation routes return HTTP 200.
- Repository-wide TypeScript checking still reports 21 pre-existing diagnostics in unrelated article Viz/spec files; none names a changed sidebar, category or navigation file.

## 6. Small-model replay

A small model should never invent an ordering from article titles. It receives one category, the declared reader goal, subcategory slugs and four fixed questions:

1. Is this an orientation map, a target capability, a prerequisite or an implementation/operation track?
2. What can the reader do after this node?
3. Which earlier node is strictly required rather than merely historically related?
4. Does this placement create a cycle or leave an item unclaimed?

A 4B worker classifies one subcategory and returns one label plus a dependency justification. A 9B worker may classify a complete category and propose stage ordering. The orchestrator owns cross-category layers, the top-down policy, cycle detection, fallback auditing, naming consistency and browser verification.

## Artifacts

- Navigation stages: `src/content/sidebar-learning-structure.ts`
- Category layers: `src/content/category-groups.ts`
- Sidebar: `src/components/Sidebar.tsx`
- Category row: `src/components/sidebar/CategoryItem.tsx`
- Subcategory row: `src/components/sidebar/SubcategoryItem.tsx`
- Category index: `src/pages/CategoryPage.tsx`
- Responsive QA: `tests/sidebar-information-architecture.spec.ts`
- Machine record: `knowledge/authoring/runs/2026-07-20-sidebar-information-architecture.json`
