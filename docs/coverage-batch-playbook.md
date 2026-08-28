# Coverage batch playbook — 개념 공백 채우기 작업자 안내

이 문서는 `docs/concept-coverage-plan.json` 에 배정된 글 하나를 맡은 작업자가 처음부터 끝까지
따라가는 절차다. `docs/blog-rewrite-contract.md` 와 `docs/viz-design-standard.md` 의 요구를 이 작업
범위에 맞게 압축했으므로, 이 문서와 충돌하는 판단이 필요하면 원 계약 문서를 우선한다.

## 0. 이 배치가 존재하는 이유

2026-08-23~29 세션에서 받은 개념 목록 1,649개 가운데 913개는 지식 그래프에도 본문에도 없고,
412개는 본문에 이름만 스치듯 나온다. 목표는 그 개념들을 **독자가 처음부터 따라갈 수 있는 canonical
설명**으로 채우는 것이다. 용어집을 만드는 작업이 아니다. 각 개념은 정확히 한 글이 정본으로 소유하고,
나머지 글은 링크로 재사용한다.

## 1. 문체 — 두괄식, 여백, 사람이 쓴 글

독자는 그 용어를 처음 보는 개발자다. 아래 규칙은 `audit:prose` · `audit:terms` 가 기계적으로
검사하는 것과, 검사하지 못하지만 반드시 지켜야 하는 것을 함께 적었다.

**두괄식.** 글 제목·절 제목(h2)·첫 문단이 모두 결론을 먼저 말한다. 제목은 "X 란 무엇인가"가 아니라
"X 는 Y 때문에 Z 를 한다" 꼴의 한 문장이다(58자 미만, `·/+→` 기호 3개 이상 금지). 절의 첫 문단은
그 절의 답을 한 번 더 쉬운 말로 적고, 그 뒤에 이유 → 작은 수치 예 → 한계 → 다음 질문 순서로 풀어 간다.

**여백.** 한 문단은 생각 하나, 260자 이하다. 문단 사이에 빈 줄을 두고, 세 가지 이상을 나열해야 하면
문단을 나누거나 `TermBreakdown` 으로 옮긴다. 본문 `<p>` 안에 `·` 를 5개 이상 이어 붙이지 않는다
(목록형 문단으로 잡힌다). 증명 세부·논문별 조건·긴 실패 목록은 `ProgressiveDetail` 로 내리되,
접힌 `preview` 에도 결론 한 줄을 남긴다. 접지 않아도 문제 → mechanism → 결론 → 한계가 읽혀야 한다.

**용어.** 처음 나오는 전문 용어는 그 자리에서 한 문장으로 풀고(별도 글이 있으면 `<Link>`), 이후에는
같은 표기를 유지한다. 업계 표준 영문 용어(KV cache, prefill, warp)는 그대로 쓰고 억지 번역을 하지
않는다. 약어는 첫 등장에만 풀어 쓴다. `artifact / receipt / fixture / gate / canonical` 같은 편집 운영어를
결론 문법으로 반복하지 않는다(글 전체 8회 이하).

**사람이 쓴 문장 (humanize-korean quick-rules 요약).**
- 종결은 `~합니다` 체로 통일한다. 원인·관찰·결론이 이어지는 내용을 `~다. ~다.` 단문으로 잘게 끊지 않는다.
- 문장 길이를 섞는다. 짧은 문장 한둘 뒤에 이어지는 긴 문장 하나.
- `~에 대해`, `~를 통해`, `~에 있어`, `~할 수 있다`, `~되어진다`, `~에 의해` 를 남발하지 않는다. 단언할 수 있으면 단언한다.
- 문두 접속사(`또한/따라서/즉/나아가`)를 문단마다 쓰지 않는다. `결론적으로/요약하면/정리하자면` 은 글에 한 번도 없어도 된다.
- `A 가 아니라 B` 대구, `X 에서 Y 로` 전환 공식은 글에 한 번이면 충분하다.
- 볼드는 절당 한 번 이내. 따옴표 강조, 이모지, 대시 삽입구를 쓰지 않는다.
- 비유는 직관을 여는 장치로 한 번 쓰고 mechanism 과 일대일로 대응시키지 않는다.
- 원문에 없던 상투구("혁신적인", "주목할 만하다", "시사하는 바가 크다")를 넣지 않는다.

## 2. 무엇을 써야 하는가

각 새 concept 는 `직관적 상황 → 작은 수치 예 → 표준 용어 → 수식(있다면) → 전제·반례` 를 갖춘다.
사전식 한 줄 정의로 끝내면 완료가 아니다. 글 전체는 `문제와 위치 → 전체 mechanism → 구성 요소와
수식 → 한계·비교 → 구현·운영 판단 → 다음 읽기` 순서를 따른다.

- **수식**: 주요 KaTeX 는 `ExplainedFormula` 로만 쓴다. `annotatedFormula` 에 `\underbrace{}` 로 각 항의 역할을 달고, `operations[].expression` 은 식에 실제로 있는 기호를 그대로 쓴다(제네릭 `\text{요인}_1\times\text{요인}_2` 금지). 유도가 있는 결과식은 유도 경로를 본문이나 연결 글에 실제로 둔다.
- **절차**: sampling loop·scheduler step·allocator·protocol 처럼 순서가 있는 개념은 `AlgorithmBlock` 으로 입력 → 단계 → 출력 pseudocode 를 쓴다. 정의만 있는 개념에는 억지로 만들지 않는다.
- **Viz**: 글마다 최소 1개, 한 Viz 에 한 mechanism. `VizFrame + useAnimatedScenes + AnimatedSceneControls` 조합을 쓰고(scaffold 가 뼈대를 만든다), stage 높이는 모든 장면의 최대 필요 크기로 고정해 장면을 넘겨도 frame 과 버튼이 움직이지 않게 한다. gradient·glow·shadow·`strokeWidth` 1.25 초과·SVG 긴 문장 금지. 카드 나열은 Viz 가 아니다 — 원인 → 상태 변화 → 결과가 보여야 한다.
- **근거**: 원 논문·공식 문서·공식 구현을 `CitationBlock` 으로 인용하고, `papers[]` 에 문제·기여·전제·범위·비주장을 적는다. 수치·성능·지원 범위는 `공식 artifact / 논문 자기보고 / 독립 평가 / 현장 경험` 중 무엇인지 본문에서 드러낸다. 미공개 model 이름·체감 수치는 본문 사실로 승격하지 않는다.
- **비교**: 두 계열의 결합(예: MLA + differential attention)은 "진화형·상위호환"으로 쓰지 않는다. 각 계열이 푸는 병목, 결합 지점, 새 비용을 따로 보여 준다.
- **길이 목표는 없다.** 독자가 구현·판정에 필요한 내용이 닫히면 끝난다. 다만 topology 휴리스틱상 새 글은 `introducedHere` 4~8개, section 4~7개, stage 7개 미만이 안전하다.

## 3. 파일과 컴포넌트

```
src/pages/articles/<category>/<slug>.tsx            조립 파일 (섹션 5~7개, 각 <section id=...>)
src/pages/articles/<category>/<slug>/viz/*Viz.tsx   장면형 Viz
src/content/registrations/<slug>.ts                 등록 module (아래 4절)
```

새 글은 `node scripts/scaffold-article.mjs --category ai --slug <slug> --subcategory <sub> --catalog <catalog file> --after <앞 글 slug> --title "<제목>"` 로 뼈대를 만든다. 기존 글 보강(enrich)은 해당 글의 tsx 를 직접 고치고 registration module 에는 `*_PATCH` export 를 쓴다.

컴포넌트 import 경로와 props:

- `ExplainedFormula` (`@/components/ui/explained-formula`): `question, idea, formula, annotatedFormula, operations[{expression, annotation: string|string[]}], terms[{symbol, name, description}], assumptions?, interpretation`
- `AlgorithmBlock` (`@/components/ui/algorithm-block`): `title, input: string[], steps[{code, note?}], output, repeatUntil?`
- `TermBreakdown` (`@/components/articles/term-breakdown`): `title, description?, items[{term, description, example?, boundary?}]`
- `ProgressiveDetail` (`@/components/articles/progressive-detail`): `title, preview, children, label?`
- `CitationBlock` (`@/components/ui/citation`): `source, citeKey, href?, type?: "paper"|"code", children`
- `ContentBoundary` (`@/components/articles/content-boundary`): `article=<slug>` — OWNERSHIP 에 같은 slug 가 있어야 한다.
- Viz: `VizFrame` (`@/components/viz/VizFrame`: `eyebrow, title, description, note, children`), `useAnimatedScenes(length, intervalMs)` → `{active, playing, reducedMotion, setActive, setPlaying, onKeyDown}`, `AnimatedSceneControls {...scenes} labels={SCENES}`.
- 다른 글 링크는 `<Link to="/ai/<slug>#<section>">` (react-router-dom).

## 4. Registration module — 정본 파일은 직접 고치지 않는다

`src/content/knowledge-graph.ts`, `article-learning.ts`, `article-evidence.ts`, `editorial-ownership.ts`,
`article-topology-decisions.ts`, category catalog 는 여러 작업자가 동시에 편집하면 서로의 변경을
지운다. **절대 직접 편집하지 말고** `src/content/registrations/<slug>.ts` 에 아래 export 를 쓴 뒤
`node scripts/merge-registrations.mjs src/content/registrations/<slug>.ts` 로 병합한다. 병합은
잠금 아래에서 upsert 하므로 고친 뒤 몇 번이고 다시 돌려도 된다.

| export | 대상 | 규칙 |
|---|---|---|
| `CONCEPTS` | `KNOWLEDGE_CONCEPTS` | id 로 upsert. 새 node 만. 기존 node 는 절대 재정의하지 않는다 |
| `EDGES` | `KNOWLEDGE_EDGES` | (from,to,relation) 으로 upsert. 새 concept 마다 1개 이상, 기존 node 와 연결 |
| `LEARNING` | `ARTICLE_LEARNING` | 새 글: route 전체 |
| `LEARNING_PATCH` | `ARTICLE_LEARNING` | 기존 글: `introducedHere/assumedKnowledge/conceptExplanations` 는 id 로, `papers` 는 title 로 upsert. `conceptStages/exercises` 는 배열 전체 교체(기존 항목을 복사해 넣고 수정). `coreIdea/entryNote` 는 값 교체 |
| `EVIDENCE` / `EVIDENCE_PATCH` | `ARTICLE_EVIDENCE` | 새 글 전체 / 기존 배열에 label 로 upsert |
| `OWNERSHIP` / `OWNERSHIP_PATCH` | `EDITORIAL_BOUNDARIES` | 새 글 전체 / `owns`(문자열)·`reuses`(href)·`evidence`(rule) append-if-missing |
| `CATALOG` | category catalog 배열 | `{ file, after?, entry }` slug 로 upsert. 선수 글 뒤에 놓는다 |
| `LEDGER` | `docs/concept-coverage-ledger.json` | 배정받은 term 마다 한 row (5절) |

`TOPOLOGY` 와 fingerprint 는 오케스트레이터가 배치 종료 시 처리한다 — 작성자는 넣지 않는다.

기존 node 확인은 `grep -n '"<label 일부>"' src/content/knowledge-graph.ts` 또는 `label:`·`aliases:` 검색으로 한다. 같은 개념이 이미 있으면 새 node 를 만들지 말고 `assumedKnowledge` 로 재사용하고 LEDGER 에 `existing` 으로 적는다. 같은 이름이지만 층위가 다른 개념(GPU `Pipeline Stage` vs 분산 추론 `Pipeline Stage`)은 qualified id 로 분리한다. API 이름·설정값(`tl.load`, `num_stages`)은 독립 node 가 아니라 상위 개념의 alias 또는 본문 설명으로 처리한다.

## 5. Ledger row

배정받은 term 은 빠짐없이 `LEDGER` 에 적는다. `docs/concept-coverage-ledger.json` 에서 `plannedArticle` 이 자기 slug 인 row 를 찾으면 된다.

```ts
{ batch: "1560", sourceIndex: 276, term: "FlashAttention", action: "new", conceptId: "flash-attention-io-aware-kernel", owner: "/ai/flash-attention-io-aware-kernel#online-softmax", status: "done", reason: "IO-aware tiled attention 의 canonical" }
{ batch: "1560", sourceIndex: 281, term: "Running Maximum", action: "alias", conceptId: "online-softmax", owner: "/ai/flash-attention-io-aware-kernel#online-softmax", status: "done", reason: "online softmax 의 구성 요소 — alias 로 등록" }
{ batch: "vla", term: "Action Grounding", action: "existing", conceptId: "...", status: "existing", reason: "기존 node 재사용" }
```

`action`: `new`(새 node) · `alias`(기존/새 node 의 alias 로 흡수 — 그 node 의 `aliases` 에 원문 표기를 넣는다) · `enrich`(기존 node 의 본문 설명만 보강) · `existing`(이미 있음) · `defer`(근거 부족으로 보류, reason 필수).
vla·qwen batch 는 `sourceIndex` 를 생략한다.

## 6. 절차와 완료 기준

1. `docs/concept-coverage-ledger.json` 에서 자기 글의 row 를 읽고, 각 term 이 그래프에 이미 있는지 확인한다.
2. 근거를 정한다: 원 논문(arXiv), 공식 문서(NVIDIA·vLLM·SGLang·PyTorch 등), 공식 구현. 링크가 실제로 존재하는지 확인한다.
3. 본문을 쓴다(1·2절). 새 글이면 scaffold 의 TODO 를 전부 지운다. `id=` anchor 는 registration 의 `sectionId` 와 정확히 일치해야 한다.
4. Viz 를 쓴다. `npm run audit:viz -- --strict <경로>` 통과.
5. registration module 을 쓰고 병합한다. 기초 6·심화 4 문제, concept 마다 `conceptExplanations`(intuition·workedExample·boundary 각 20자 이상, theorem 은 proofIdea·counterexample 추가), 새 concept 는 모두 `conceptStages` 에 포함.
6. `scripts/check-article.sh <category>/<slug>` 가 통과할 때까지 고친다. 마지막에 `scripts/check-article.sh <route> --full` 로 formula·topology·tsc 까지 확인한다. topology 에서 `unreviewed` 가 뜨면 `introducedHere` 나 section 수를 줄여 `keep` 범위(concept ≤ 8, section ≤ 7, stage ≤ 6)로 맞춘다.
7. 보고에는 파일 수 대신: 처리한 term 수(new/alias/existing/defer), 통과한 검사, 남은 미통과 항목을 적는다. 미통과가 있으면 "완료"라고 쓰지 않는다.

브라우저(Playwright) 검사는 오케스트레이터가 배치 단위로 1440px·390px 에서 일괄 수행한다. 작성자는 Viz stage 높이 고정과 `overflow-x` 를 코드에서 보장하는 데 집중한다.
