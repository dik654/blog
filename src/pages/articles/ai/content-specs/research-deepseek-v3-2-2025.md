# DeepSeek-V3.2 실전 보고서 검산 명세

## 소유 질문

DeepSeek-V3.2 보고서에서 DSA, stable RL, agent synthesis와 context runtime을 하나의 성능 주장으로 뭉개지 않고, 각 메커니즘의 입력·상태·실행 순서·증거·실패 경계를 원문 수식과 구현 단위로 복원할 수 있는가?

## 학습 경로 계약

- 현재 입력: 2026 LLM 구조 질문과 공개 최신 연구를 읽는 다섯 축.
- 앞에서 가져올 것: Dense attention의 Q/K/V와 residual, KV·long-context 비용, Sparse MoE routing, Hybrid state와 attention의 차이.
- 이 글의 출력: DSA 후보 검색과 정밀 attention의 분리, sampling/training runtime 일치 조건, verifier가 있는 합성 agent 환경, context를 runtime state budget으로 다루는 방법.
- 옆 경로: `post-training-rlvr`에서 reward·verifier, `agentic-patterns`에서 trajectory·tool loop를 보강한다.
- 역사 중단점: Dense Transformer, importance sampling/PPO, verifier reward의 계산 계약에서 멈춘다. Sparse retrieval·policy gradient·program verification의 전체 역사까지 내려가지 않는다.

## 원문 읽기 순서

1. Abstract를 요약하지 않고 architecture, RL system, synthetic data의 세 주장으로 나눈다.
2. 각 주장에 대응하는 수식·algorithm·figure·table·appendix를 먼저 연결한다.
3. 저자 결과를 `개입 -> 관찰 -> 지지하는 주장 -> 입증하지 않는 범위`로 다시 쓴다.
4. 구현에서 필요한 tensor, saved runtime state, verifier interface와 metric을 도출한다.
5. 다른 hardware, task, context policy로 옮길 때 깨질 가정을 별도로 기록한다.

## 비공개 전이 문제

### 문제 1 · Sparse attention 속도 주장

`L=131,072`, `k=2,048`일 때 dense core의 `L^2` 정밀 비교와 DSA core의 `Lk` 비교 비율을 계산한다. 독자는 DSA core가 64배 적은 정밀 비교를 하고 선택 비율은 1.5625%임을 계산해야 한다. 그러나 lightning indexer가 모든 후보를 훑는 `L^2` 항, top-k gather, kernel과 memory traffic이 남으므로 end-to-end latency가 64배 빨라진다고 결론내리면 실패다.

### 문제 2 · MoE RL importance ratio

Rollout은 expert A를 지나 token을 생성했지만 training replay는 expert B를 선택했다고 하자. 같은 표면 token의 `pi_theta / pi_old`를 계산할 수 있어도 왜 unbiased importance correction으로 보기 어려운지 설명한다. Route와 top-p mask가 conditional action path와 support를 바꾸므로 sampling 당시의 discrete choice를 보존하거나 mismatch를 명시적으로 다뤄야 한다.

### 문제 3 · 합성 agent verifier

Database, tool API, task, hidden solution과 verifier가 주어졌을 때 model이 tool을 쓰지 않고 database path나 verifier shortcut을 이용하는 실패를 설계하고 막는다. Gold solution의 fail-to-pass/pass-to-fail test, direct database access 차단, unseen environment holdout, tool trace와 outcome을 함께 검사해야 한다.

### 문제 4 · Context runtime

BrowseComp에서 summary가 평균 step을 140에서 364로 늘리고 score를 53.4에서 60.2로 높였다는 결과를 보고, `2.60x step`, `+6.8 point`를 계산한다. 이것은 모든 agent에 summary가 최적이라는 증거가 아니며 total token, wall time, tool cost와 state loss를 별도로 측정해야 한다.

## 출처와 의도

- DeepSeek-V3.2 공식 기술 보고서: DSA, mixed RL, 합성 agent environment, context management의 1차 근거.
- DeepSeek 공식 model repository·release note: chat template, tool-calling boundary와 공개 artifact를 확인.
- Dense Transformer·GQA·MLA·MoE·GRPO 기반 글: 보고서가 생략한 계산 계약을 채우되 보고서의 저자 주장으로 오인하지 않는다.
- 후속 2026 구조는 “현재성”의 상단 근거이며 V3.2 결과를 소급해 바꾸지 않는다.

## 본문 구조

1. 보고서 전 세 병목과 저자 의도.
2. 용어 bridge 뒤 checkpoint·continued training·post-training·environment 규모를 실행 순서로 복원.
3. Indexer, top-k, KL distillation, complexity, GRPO importance ratio의 다섯 수식.
4. Sparse parity, inference cost, synthetic-agent transfer, context scaling의 증거 범위.
5. 최소 구현, runtime log schema, verifier test와 실패 진단.
6. 남는 계약과 Dense·KV·MoE·Hybrid·RLVR·agent 기반으로 내려가는 링크.

## Viz 계약

- 네 메커니즘은 segmented control로 분리한다.
- 각 view는 4단계 실행 순서를 보여 주고, 단계 하나를 선택해 그 단계의 역할과 다음 handoff를 읽게 한다.
- View마다 두세 개의 수치 oracle을 노출한다. 숫자는 서로 다른 단위일 때 면적이나 막대 길이로 직접 비교하지 않는다.
- 유지해야 할 invariant와 대표 failure를 같은 화면에서 대비한다.
- 화살표는 장식이 아니라 선택 단계의 진행 방향을 표시하고, 모바일에서는 세로·데스크톱에서는 가로로 재배치한다.
- 자동 animation은 단계의 인과를 추가할 때만 후속 pass에서 붙인다. 정적 첫 frame만으로 전체 순서가 읽혀야 한다.

## 수식 계약

- Display equation 5개와 FormulaNote 5개를 1:1로 유지한다.
- 모든 display equation은 한국어 `underbrace`를 포함한다.
- `L^2 -> Lk`는 DSA core 비교이며 indexer와 end-to-end latency를 포함하지 않는다.
- `pi_old`와 `pi_theta`의 importance ratio는 같은 route·mask·token support 조건을 함께 설명한다.

## 검증 계약

- 360·390·768·1440px에서 document, formula, Viz overflow 0.
- KaTeX raw source 노출 0, scale 0.75 이상, 실제 글자 12px 이상.
- 네 mechanism mode, mode별 4단계, 선택 단계, invariant, failure, metric oracle을 검사한다.
- 학습 rail은 `현재 구조 질문 -> Dense -> KV -> Sparse MoE -> Hybrid -> 통합 보고서` 순서다.
- 사이드바에는 별도 `05 · 실제 보고서 검산`이 보인다.
- 공식 보고서·repository 링크와 내부 기반 링크를 구분한다.
