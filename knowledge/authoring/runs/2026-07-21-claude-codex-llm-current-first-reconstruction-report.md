# Claude-Codex LLM current-first reconstruction report

이 문서는 결과물을 요약하는 문서가 아니라, LLM 아키텍처 경로를 왜 이 순서로 다시 만들었는지와 같은 작업을 4B·9B급 작은 모델에 어떻게 분해할지를 보존하는 판단 기록이다. 기존 전역 연결 보고서가 사이트 전체의 경로 계약을 다뤘다면, 이번 기록은 `LLM 아키텍처` 묶음의 실제 본문·Viz 재구성과 독립 검토에 집중한다.

## 1. 출발점에서 확인한 실패

기존 gallery는 모델 이름, 분류, 스펙을 먼저 보여 줬다. 독자는 `Dense`, `Sparse MoE`, `KV & Long Context`, `Hybrid & Linear Attention`이라는 이름은 볼 수 있었지만 다음 질문에는 답하기 어려웠다.

1. 지금 모델에서 실제 병목은 계산량, 활성 파라미터, KV cache, 메모리 이동 중 무엇인가.
2. 이전 모델의 어떤 계산은 그대로이고 어느 block만 바뀌었는가.
3. 한 token이 그 구조 안에서 어떤 순서로 실행되는가.
4. 얻은 이점 때문에 새로 생긴 비용은 무엇인가.
5. 새 논문을 읽을 때 무엇을 근거로 주장과 구현을 검증해야 하는가.

같은 모델이 Dense와 KV 글에 반복되고, 여러 모델 카드가 사실상 같은 cluster 문장을 재사용해 계보보다 목록처럼 보였다. 모바일에서는 큰 SVG가 작게 축소되어 전체 구조가 존재해도 읽을 수 없었다.

## 2. 선택한 학습 구조

경로의 시작점을 가장 오래된 논문으로 두지 않았다. 현재 프런티어 구조를 읽을 수 있는 최소 기준점인 decoder-only Dense Transformer를 공통 바닥으로 두고, 현재의 병목에서 아래로 내려갔다.

```text
현재 모델에서 느린 것 찾기
-> Dense Transformer의 계산 계약 확인
-> KV cache가 왜 커지는지 확인
-> MLA가 무엇을 저장하고 계산 때 무엇을 복원하는지 확인
-> MoE가 총 파라미터와 활성 파라미터를 어떻게 분리하는지 확인
-> linear/hybrid attention이 상태와 메모리 계약을 어떻게 바꾸는지 확인
-> 새 모델 논문을 같은 질문으로 읽기
```

Gallery는 이 경로의 지도만 소유한다. Dense 글은 공통 계산 기준, KV 글은 memory contract, MoE 글은 routing contract, Hybrid 글은 state contract를 소유한다. 같은 모델을 여러 글에서 반복하지 않고, 필요한 곳에서는 이전 글의 결론을 링크로 가져온다.

## 3. 본문 계약과 모델 카드 계약

모든 핵심 모델은 표의 한 행이 아니라 다음 네 단락으로 읽힌다.

- `왜 필요한가`: 바로 전 구조에서 관찰한 병목
- `어떻게 실행되는가`: 한 token의 실제 실행 순서
- `무엇이 바뀌었나`: 이전 계산 계약과의 정확한 delta
- `무엇을 얻고 치르는가`: 성능, 메모리, 통신, 구현 복잡도의 교환

Dense 글은 GPT-2식 decoder contract를 먼저 고정한 뒤 Llama, Gemma 계열의 변화만 보여 준다. KV 글은 Mistral Small 3.1, SmolLM3, Tiny Aya, Gemma 4 E4B, Gemma 4 31B를 서로 다른 문제로 설명한다. MoE 글은 DeepSeek V3, Qwen3 235B-A22B, GPT-OSS 120B, GLM-5, DeepSeek V4-Pro를 routing·load balance·active compute 관점에서 분리한다. Hybrid 글은 xLSTM, Qwen3 Next, Kimi Linear, Nemotron 3 Nano, Qwen3.5를 state update와 attention 배치 방식의 차이로 읽는다.

전체 모델 catalog는 삭제하지 않았지만 기본 서사 뒤의 선택 탐색으로 내렸다. 독자가 먼저 핵심 다섯 모델의 인과를 읽고, 그다음 비교가 필요할 때만 확장 목록을 연다.

## 4. 가장 어려운 전이 문제

본문을 쓰기 전에 공개하지 않는 전이 문제를 만들었다. 핵심은 `MLA가 KV cache를 줄인다`를 외우는 것이 아니라, 저장 표현과 attention 계산 표현을 분리해 추론할 수 있는지를 보는 것이었다.

> 61-layer decoder에서 token마다 FP16 latent 512차원과 RoPE key 64차원만 cache한다. 왜 이것을 head별 K/V를 모두 저장한 것과 같은 attention 문제로 다시 계산할 수 있으며, bytes/token은 얼마인가? 이 구조가 memory traffic을 줄여도 projection 계산과 구현 복잡도가 사라지지 않는 이유는 무엇인가?

이 문제를 풀려면 독자는 다음 insight에 도달해야 한다.

- cache에는 `계산에 바로 쓰는 완성 K/V`가 아니라 저차원 latent와 위치 정보가 저장될 수 있다.
- head별 표현은 계산 시 복원하거나 weight를 흡수한 동치 계산으로 얻는다.
- 저장량과 계산량은 별개의 축이다.
- `61 × (512 + 64) × 2 = 70,272 bytes/token`이다.
- 병목 이동은 병목 제거가 아니다.

MoE 전이 문제는 총 파라미터와 token당 활성 파라미터를 분리하고, expert imbalance가 통신과 throughput에 미치는 영향을 예측하게 했다. Linear attention 전이 문제는 전체 과거 K/V 목록 대신 recurrent state를 유지할 때 정보 압축, 순서, 병렬 학습, 장문 recall 사이의 교환을 설명하게 했다.

## 5. Viz 설계 의도

세 개의 새 Viz는 장식이 아니라 각각 하나의 관찰 가능한 인과를 소유한다.

- `MlaCacheExplorer`: context와 표현 방식을 바꾸며 token당·전체 cache byte가 어떻게 달라지는지 본다.
- `MoeRoutingExplorer`: token routing, 활성 expert, load balance가 active compute와 병목을 어떻게 바꾸는지 본다.
- `LinearAttentionExplorer`: attention history와 recurrent state의 성장 방식 및 기억 손실 가능성을 비교한다.

모바일에서 큰 SVG를 그대로 축소하지 않았다. Dense 구조는 좁은 화면에서 여섯 단계 HTML flow로 바꾸고, 데스크톱에서만 상세 SVG를 유지한다. 공통 slider 행은 좁은 화면에서 label/value와 full-width control의 두 줄 grid가 된다. 선 굵기, border, spacing, 색은 상태 구분에 필요한 만큼만 사용하고 텍스트가 geometry보다 우선하도록 했다.

## 6. Claude와 Codex의 역할 분리

Claude Opus는 두 번의 read-only 비판 역할을 맡았다. 첫 검토는 현재 gallery가 bottom-up catalog인지, 빠진 개념 Viz가 무엇인지, 네 글의 소유 경계가 겹치는지를 찾았다. 구현 후 두 번째 검토는 다음 반례를 제기했다.

- Dense와 KV catalog의 모델 중복
- KV·MoE·Hybrid 카드의 반복적인 cluster prose
- 모바일 Dense SVG의 실질적 가독성 실패
- MLA bytes/token의 산술 오류
- 이름이 불명확한 current model 표기
- fallback catalog가 다시 fact sheet가 되는 문제

Codex는 각 지적을 소스와 렌더 결과로 확인한 뒤 수정했다. MLA 수치는 70,656에서 70,272로 바로잡았고, 모델 소유권과 per-model narrative를 분리했으며, `DeepSeek-V3.2-Speciale`를 완전한 이름으로 표기했다. Claude의 의견을 그대로 적용하는 대신 계산, 코드 위치, 브라우저 렌더를 각각 검증하는 critic-implementer 구조를 사용했다.

## 7. 검증 결과

- 변경 파일 ESLint 통과
- production build 통과, 기존 large-chunk warning만 유지
- 핵심 LLM 5개 등록 경로의 narrative audit: 10 checks, errors 0, warnings 0
- 핵심 LLM 5개 등록 경로의 Viz audit: 10 checks, 15 surfaces, 7 SVG, errors 0, warnings 0
- 전체 541개 등록 경로 narrative audit: 1,082 checks, errors 0, warnings 0
- 전체 Viz audit에서 발견한 기존 모바일 overflow 10건을 보정
- 해당 8개 경로 재검증: 16 checks, 222 surfaces, 224 SVG, errors 0, warnings 0
- 모바일·데스크톱 screenshot에서 category route, Dense flow, MLA, MoE, Linear Viz를 직접 확인
- 공개 도메인 8개 경로를 390px·1440px에서 확인: 16 checks, HTTP 200, overflow 0, raw LaTeX 0, KaTeX error 0
- 공개 Viz interaction 확인: MLA·Linear slider의 측정치가 바뀌고, MoE routing은 expert load가 `3/3/3/3`에서 `6/4/2/0`으로 바뀜
- 과거 Honglab 정리 URL은 빈 화면 대신 현재 LLM 아키텍처 경로로 redirect되며 모바일 overflow 0을 확인
- `cm-blog.service`를 최종 build 뒤 2026-07-21 09:58:41 KST에 재시작하고 active 상태를 확인

전역 audit의 `enrichmentBacklog`는 개별 글 557개를 모두 이번에 깊게 다시 썼다는 뜻이 아님을 명확히 한다. 이번 배치는 LLM 아키텍처 경로를 실제로 재구성했고, 나머지 글은 같은 계약으로 우선순위에 따라 보강해야 한다.

## 8. 4B·9B 모델 재현 프로토콜

작은 모델에 “이 분야를 모두 다시 써라”라고 요청하지 않는다. 먼저 orchestrator가 current target, 최소 바닥, source claim, 용어, 파일 소유권, 비공개 전이 문제를 고정한다.

### 4B packet

- 한 모델의 predecessor와 changed block 비교
- 한 수식의 직관·연산 이유·기호 설명
- 한 Viz의 input, transition, observable, failure state
- 한 viewport의 selector, expected invariant, observed defect 수정
- 출력은 prose 이전에 구조화된 JSON IR로 제출

### 9B packet

- 한 branch 글 또는 세 개 이하의 model milestone
- `problem -> inherited contract -> delta -> execution -> gain -> cost -> evidence`
- 모델마다 서로 다른 narrative인지 검사하는 counterexample 포함
- formula check와 responsive browser acceptance를 함께 제출

### Orchestrator가 유지할 것

- 최신 연구와 기준 논문의 source provenance
- 가장 오래된 논문으로 무한히 내려가지 않는 중단 조건
- 글 사이의 개념 소유권과 중복 제거
- 비공개 최고난도 전이 문제
- critic의 지적을 산술·소스·렌더로 재검증하는 단계
- build, audit, deploy, public URL 확인

기계가 재사용할 수 있는 event와 검증 수치는 인접 JSON에 보존한다.
