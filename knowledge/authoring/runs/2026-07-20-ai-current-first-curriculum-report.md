# AI current-first curriculum reconstruction

## 목표

AI 블로그를 오래된 논문부터 순서대로 외우는 연표가 아니라, **현재 논문·회사 연구·산업 구현에서 시작해 필요한 기반만 내려가고 다시 현재로 돌아오는 학습 시스템**으로 바꿨다.

독자가 항상 답할 수 있어야 하는 질문은 네 가지다.

1. 지금 이 분야에서 읽을 공개 근거는 무엇인가?
2. 그 근거가 의존하는 변하지 않는 계산 계약은 어느 대표 논문인가?
3. 그 논문을 구현·진단하기 위한 최소 개념은 무엇인가?
4. 어느 지점에서 수학·과학 기반을 열고, 어디서 더 과거로 내려가기를 멈추는가?

## 핵심 판단

### 최상단은 포인터이고 하단은 안정된 그래프다

최신 연구가 나오면 먼저 `CURRENT TOP`을 비교·교체한다. 기존 글과 같은 메커니즘에서 숫자나 제품 이름만 바뀌었다면 하단은 건드리지 않는다. 새로운 계산·데이터·런타임·증거 계약이 생겼고 기존 기반만으로 설명·구현·진단할 수 없을 때만 `새 델타`를 하단에 추가한다.

이 판단은 다음 네 조건을 모두 요구한다.

- 실제 메커니즘이 바뀌었는가?
- 기존 글로 정직하게 설명할 수 없는가?
- 학습자가 직접 계산·구현·실패 진단해야 하는가?
- 한 checkpoint를 넘어 다시 쓰일 기반인가?

따라서 “최신을 계속 위에 쌓는다”와 “새 개념은 아래에 추가한다”는 충돌하지 않는다. 최신 포인터는 자주 움직이지만 기반 그래프는 메커니즘 변화가 있을 때만 작게 자란다.

### 대표 논문은 역사상 최초가 아니라 실행 가능한 중단점이다

논문이 인용한 모든 과거 논문을 독립 글로 만들면 학습 경로는 끝나지 않는다. 각 분야에는 현재 메커니즘을 설명하는 대표 논문 하나를 기본 중단점으로 두었다. 더 오래된 자료가 식의 출처나 역사만 추가하고 새로운 실행 능력을 주지 않으면 citation으로만 남긴다.

현재 공개 경로는 12개 분야를 같은 네 단계로 정규화한다.

- Knowledge Systems
- Robot AI
- LLM Architecture
- LLM Post-training
- Generative Models
- Open Image·Video
- Computer Vision
- OCR·Document AI
- NLP·Attention
- Reinforcement Learning
- Time Series
- Agents

## 첫 실제 재구성: DeepSeek-V3.2

경로 UI만 만들고 끝내지 않기 위해 LLM Architecture의 현재 최상단을 실제 아티클로 재구성했다. 23쪽 기술 보고서 전체와 appendix를 먼저 읽고 다음을 서로 다른 주장으로 분리했다.

- DSA: 가벼운 indexer가 후보를 고르고 선택된 KV에만 정밀 attention을 수행한다.
- Stable RL: rollout 당시 expert route와 sampling mask를 training에서 재생해야 policy ratio의 의미가 유지된다.
- Agent synthesis: environment, tools, task, solution, verifier를 실행 가능한 중간 표현으로 만든다.
- Context runtime: 긴 trajectory에서 무엇을 보존하고 버리는지는 model architecture와 별도의 runtime 정책이다.

핵심은 `O(Lk)`만 강조하지 않는 것이다. 정밀 attention core는 줄지만 lightning indexer는 여전히 모든 후보를 훑어 `O(L²)` 항을 남긴다. 실제 이득은 작은 head·dimension, FP8과 hardware-aligned kernel이라는 시스템 조건을 포함한다.

본문은 원문 순서 요약이 아니라 다음 계약으로 작성했다.

1. 저자 의도와 이전 병목
2. 실행 가능한 6단계 reconstruction
3. 한국어 underbrace가 있는 5개 KaTeX 식과 symbol/operation note
4. Sparse Attention, Stable RL, Agent Synthesis, Context Runtime을 분리하는 Viz
5. parity, inference cost, synthetic agent, context scaling의 증거와 한계
6. 최소 재현, 가정, 실패·과장 경계, 다음 기반 델타

## 실패에서 얻은 구현 규칙

### Source deep dive는 분류가 아니라 글의 계약이다

새 연구 글은 정상 로드됐지만 `SOURCE DEEP DIVE` 표식이 나타나지 않았다. 기존 구현이 `ai-foundations` 같은 기초 분류 안의 `paper-*`만 원문 재구성으로 취급했기 때문이다.

최신 연구 글은 목표 분야에 있어도 원문 재구성 계약을 가져야 한다. 그래서 `paper-*`와 `research-*`를 모두 source deep dive로 인식하고, 같은 학습 좌표·수식 주석·깊은 글 UI를 적용했다.

### 긴 수식은 축소하지 말고 의미를 나눈다

360px에서 두 식이 각각 0.70과 0.71까지 축소됐다.

- `TopK 선택 + attention 출력`
- `group advantage + importance ratio`

글로벌 최소 글자 크기를 더 낮추거나 가로 스크롤을 허용하지 않았다. 두 개의 의미 연산을 각각 `aligned`의 별도 행으로 나눴다. 결과적으로 모든 식이 360·390·768·1440px에서 KaTeX로 렌더되고, 가시 raw LaTeX·가로 이탈 없이 0.75 이상 크기를 유지한다.

### Viz의 불변량은 방향이 아니라 인과 순서다

네 단계를 모바일에서도 가로로 유지하면 글자와 카드가 작아진다. 대형 화면에서는 stage와 arrow가 이어지는 가로 grid를 쓰고, 작은 화면에서는 같은 순서를 세로로 쌓았다. 사용자는 네 메커니즘을 segmented control로 바꾸고 각 mode의 질문, 네 단계, 반드시 유지할 계약, 실패 지점을 비교한다.

## 자동 갱신

연구 discovery 후보에는 이제 `proposedTrack`과 다음 review state가 붙는다.

```text
currentTopCompared
mechanismChanged
existingFoundationsSufficient
foundationDelta
decision
```

따라서 discovery가 새 논문을 찾았다는 이유만으로 과거 기반 논문을 먼저 추가하지 않는다. 기존 최상단과 메커니즘을 비교하고, 공식 원문·코드·benchmark 조건을 재구성할 수 있을 때만 current pointer를 바꾼다. 하단 변경은 foundation-delta gate를 별도로 통과해야 한다.

## 4B·9B 재실행 방법

작은 모델에게 전체 사이트와 전체 PDF를 동시에 주지 않는다.

### 4B 단위

- 한 section의 claim 4개 이하를 고정 JSON schema로 추출
- 하나의 immutable equation을 한국어로 설명
- foundation 후보 하나를 네 조건으로 분류
- viewport·selector·expected·actual이 정규화된 QA defect 하나를 수정

### 9B 단위

- claim packet 4~6개를 section packet으로 통합
- 분야 하나의 current/canonical/concept/foundation 경로 구성
- control, measurable output, invariant, failure가 있는 Viz 하나 설계
- private transfer problem의 premise coverage 감사

### 상위 오케스트레이터가 유지할 일

- 원문 전체를 읽었는지와 appendix·figure·table 누락 검사
- 서로 다른 분야 사이 대표 논문·기반 중복과 충돌 조정
- 수식과 symbol identity를 immutable input으로 고정
- source budget 예외 승인
- 전체 사이트 반응형 QA와 배포

각 pass는 최종 문장만 남기지 않고 `observed → inference → decision → changed artifact → verification` event를 JSON ledger에 추가한다. 이번 수식 축소 실패와 source-deep-dive 분류 실패도 같은 형식으로 보존했다.

## 구현 산출물

- Track graph: `src/content/ai/topdownResearchTracks.ts`
- Route UI: `src/pages/category/TopDownResearchRoute.tsx`
- Curriculum spec: `src/pages/articles/ai/content-specs/ai-topdown-minimum-paper-curriculum.md`
- DeepSeek reconstruction: `src/pages/articles/ai/paper-spine/aiCurrentResearchSpecs.tsx`
- DeepSeek Viz: `src/pages/articles/ai/paper-spine/viz/DeepSeekV32StudyViz.tsx`
- Discovery pipeline: `scripts/research-discover.mjs`
- Responsive QA: `tests/ai-topdown-research-paths.spec.ts`
- Replay ledger: `knowledge/authoring/runs/2026-07-20-ai-current-first-curriculum.json`

## 최종 검증

- Production build: 통과, 기존 large-chunk 경고만 유지
- Current-first·DeepSeek 집중 검사: 로컬 10/10 통과
- 전체 Playwright: 165/165 통과
- 공개 배포 집중 검사: 10/10 통과
- 화면 폭: 360, 390, 768, 1440px
- 배포: `cm-blog.service`를 2026-07-20 20:55:41 KST에 재시작
- 공개 HTTP: 블로그 루트, LLM 경로, DeepSeek 재구성 글 모두 200

상세 결과와 실패·수정 순서는 같은 JSON ledger의 `events`와 `qa`에 고정했다.
