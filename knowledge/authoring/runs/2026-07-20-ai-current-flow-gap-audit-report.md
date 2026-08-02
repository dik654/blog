# AI 최신 흐름 공백 감사와 보강

## 의도 수정

제공된 영상 transcript 자체를 요약하는 것이 목표가 아니었다. 이 자료는 기존 current-first curriculum에서 빠진 메커니즘을 찾기 위한 감사 입력이었다. 잘못 만든 `research-honglab-ai-landscape-2026` 공개 글과 전용 Viz·배치 UI는 제거했고, 이전 실행 기록은 삭제하지 않고 실패 원인과 함께 `superseded`로 남겼다.

## 무엇을 추가하지 않았는가

다음 흐름은 기존 글만으로 현재 연구에서 기반까지 내려갈 수 있어 새 글을 만들지 않았다.

- MoE·hybrid attention: Architecture Gallery, Sparse MoE, Hybrid & Linear Attention
- Reasoning RL·RLVR·distillation: Post-training, RLHF, Open-R1, Knowledge Distillation
- Agent·RAG·harness: Context Engineering, RAG Pipeline, Claw Code
- 일반 GPU serving: vLLM, KV cache, speculative decoding, GPU HPC

이 판단이 중요하다. transcript에 등장했다는 이유로 새 노드를 만들면 최신 흐름이 아니라 중복 목록이 된다.

## 실제로 비어 있던 네 흐름

### LLM 데이터 엔진

수집, extraction, dedup, quality filter, domain mixture, verified synthetic data와 benchmark contamination을 하나의 실행 가능한 pipeline으로 묶었다. 핵심은 “좋은 데이터”라는 형용사가 아니라 어떤 선택 함수가 실제 training distribution을 만들었고 compute를 고정했을 때 성능이 개선됐는지 검증하는 것이다.

### 효율 추론 · On-device

Model file 크기와 resident memory를 분리하고, weight·KV·activation·workspace를 합산한다. PTQ, QAT, native low-bit training을 구분하며 MTP training objective와 speculative verification runtime을 분리한다. CPU·GPU·NPU placement는 peak TOPS가 아니라 operator coverage, memory movement와 thermal budget으로 판단한다.

### Speech · Audio AI

Sample과 frame에서 STFT, semantic/acoustic token으로 올라간 뒤 cascade와 native speech-to-speech를 비교한다. Model latency만이 아니라 endpointing, transport, queue, codec, jitter, playback과 barge-in을 하나의 turn state machine으로 설명한다.

### World Model · Physical AI

Video generator, latent representation learner, action-conditioned world model과 VLA policy를 interface로 구분한다. V-JEPA·Genie·Cosmos의 서로 다른 증거 범위를 표시하고, learned dynamics rollout을 MPC의 cost와 closed-loop replanning으로 닫는다. Visual plausibility를 robot task success로 확대하지 않는다.

## 글의 깊이를 판단한 방법

각 글을 쓰기 전에 공개하지 않는 전이 문제를 정했다.

- 30B token budget에서 corpus mixture와 contamination 검증 설계
- RAM 8GB·60GB/s device에서 4B·9B 모델 memory와 latency 계산
- 불안정한 network와 interruption이 있는 모바일 음성 비서 설계
- 영상 예측 모델과 action-conditioned 모델 중 robot planner 선택

본문의 각 절은 이 문제를 풀기 위한 전제, 식, 경계 또는 검증 절차를 하나 이상 제공한다. 마지막 capability check는 단순 복습 문항이 아니라 해당 판단을 실제로 수행할 수 있는지 확인한다.

## 수식과 Viz 수정

한 줄에 모든 항을 넣은 식은 모바일에서 잘리지 않더라도 7-9px까지 작아질 수 있었다. Data gate, token latency, dequantization, sampling, STFT, audio latency, JEPA와 MPC 식을 의미 단위의 aligned row로 분리했다. QA는 이제 다음을 동시에 요구한다.

- KaTeX 렌더링
- 가시 raw LaTeX 없음
- 각 항의 한국어 역할 annotation과 FormulaNote
- 360·390·768·1440px에서 수평 이탈 없음
- 모바일 계산 글자 크기 9.5px 이상

Viz는 고정 canvas 대신 responsive DOM grid를 사용한다. Data pipeline의 filter·synthesis 조절, device memory budget, speech turn latency, action-conditioned rollout horizon을 직접 바꾸면 숫자와 상태, 설명이 함께 변한다.

## 배치 수정

`데이터 엔진`과 `효율 추론 · On-device`는 LLM 아래에 둔다. `음성 · 오디오 AI`와 `World Model · Physical AI`는 표현·시간·행동 계약이 text LLM과 달라 목표 분야의 독립 경로로 둔다. transcript 제목이나 발표자 이름은 curriculum에 노출하지 않는다.

AI 전체 목록에서 썸네일이 없는 항목은 큰 빈 band와 깨진 emoji가 보였다. Fallback card를 semantic Lucide icon이 있는 compact layout으로 바꾸고 기존 SVG thumbnail에는 고정 크기를 부여했다.

## 4B·9B로 다시 실행하는 법

4B 모델은 한 번에 한 claim, source excerpt, equation 또는 viewport defect만 처리한다. 출력은 자유 문장이 아니라 claim/evidence/boundary, retain/extend/add, equation rows, before/after measurement 같은 고정 schema를 쓴다.

9B 모델은 검증된 packet 4-6개를 section으로 합치고 분야 하나의 current/canonical/concepts/foundations 경로를 만든다. 상위 orchestrator는 사용자 의도, 중복·cycle, source 승인, immutable notation, 전이 문제 coverage와 전체 browser QA만 담당한다.

모든 단계는 `observed -> inference -> decision -> changed artifact -> verification` ledger를 남긴다. 이번에는 독립 영상 요약을 만든 판단 자체도 실패 event로 보존했다.

## 산출물

- 공백 감사 명세: `src/pages/articles/ai/content-specs/ai-current-flow-gap-audit-2026-07.md`
- Metadata: `src/content/ai/articlesCurrentFlows.ts`
- Current-first graph: `src/content/ai/topdownResearchTracks.ts`
- Shared Viz: `src/pages/articles/ai/current-flows/viz/CurrentFlowExplorers.tsx`
- Browser QA: `tests/ai-current-flow-gaps.spec.ts`
- 상세 실행 ledger: `knowledge/authoring/runs/2026-07-20-ai-current-flow-gap-audit.json`

## 최종 검증

- Production build 통과, 기존 large-chunk warning만 유지
- 수식 안정성 반복 검사 `36/36` 통과
- 새 경로와 기존 전력전자 회귀 집중 검사 `40/40` 통과
- 전체 Playwright `183/183` 통과
- 공개 도메인 current-flow·current-first 검사 `28/28` 통과
- 새 아티클 네 경로 모두 HTTP 200
- `cm-blog.service` 2026-07-20 22:45:02 KST 재시작 후 active

상세 수치와 실패·수정 순서는 JSON ledger의 `events`와 `qa`에 고정했다.
