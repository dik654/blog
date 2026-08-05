# 2026 AI 기술 지형 영상 재구성

> **폐기된 접근:** 사용자는 이 영상을 독립 아티클로 요약하라는 뜻이 아니라, 기존 최신 흐름에서 빠진 부분을 찾는 감사 자료로 쓰라는 뜻이었다. 공개 아티클과 전용 UI는 제거했으며, 이 문서는 잘못된 의도 해석과 수정 과정을 보존하는 실패 기록이다. 후속 구현은 `2026-07-20-ai-current-flow-gap-audit-report.md`에 기록한다.

## 목표

사용자가 제공한 약 3시간 3분의 한국어 transcript를 요약문으로 줄이지 않고, **검증 가능한 기술 주장과 기존 학습 경로를 연결하는 source synthesis**로 재구성했다.

이 작업에서 가장 중요한 제한은 원본 영상 주소가 없다는 점이다. timestamp는 제공된 transcript 안의 위치로만 사용했으며 외부 영상 링크를 만들거나 추정하지 않았다. 상장 일정, 채용 동향, 부품 가격, 기업과 인물의 의도처럼 날짜에 민감하거나 검증하기 어려운 발언은 기술 사실층에서 제외했다.

## 왜 시간순 요약을 버렸는가

라이브 transcript에는 같은 기술이 멀리 떨어져 반복되고, 논문에서 온 메커니즘과 개인 경험, 산업 전망, 즉석 의견이 연속해서 나타난다. 이를 시간순으로 줄이면 독자가 다시 사실과 의견을 분류해야 하고, 유보해야 할 전망도 검증된 결론처럼 읽힌다.

그래서 발언을 다음 다섯 축으로 다시 묶었다.

1. Architecture efficiency: MoE, Mamba, BitNet, multi-token prediction, cache
2. Reasoning and data: post-training, RLVR, test-time compute, distillation, synthetic data
3. Agent and retrieval: workflow, agent loop, context, RAG, evaluation
4. World model and robot: prediction, planning, simulation, sim-to-real
5. Infrastructure and on-device: KV cache, bandwidth, tiered memory, device budget

각 축은 `발언 → 1차 근거 → 변하지 않는 메커니즘 → 근거의 경계 → 기존 아티클` 순서로 읽힌다. 사용자는 Viz의 탭을 바꾸며 이 다섯 요소를 한 화면에서 비교할 수 있다.

## 내용 깊이의 기준

본문을 쓴 뒤 어려운 transfer problem을 비공개 검사로 사용했다.

> 고정된 GPU 예산으로 8B 모델 제품을 만들 때 긴 문맥 Agent, 모바일 보조 기능, 향후 Robot AI를 고려한다. MoE, 1.58-bit, Mamba, test-time compute, RAG, V-JEPA, on-device 가운데 무엇을 지금 채택하고 무엇을 관찰만 할지 결정하고 최소 실험을 설계하라.

이 문제를 풀려면 최소한 다음 구분이 필요하다.

- 전체 parameter와 token마다 활성화되는 parameter는 다르다.
- 저장 bytes와 실제 이동 bytes, arithmetic compute와 latency는 다르다.
- post-training과 test-time search는 서로 다른 시점의 최적화다.
- Agent는 base model이 아니라 context, tool, state, evaluator가 포함된 system이다.
- world model의 이해, 예측, 계획은 각각 다른 계약이다.
- 새로운 이름이 등장했다고 기반 글을 추가하지 않는다.

본문은 이 전제를 모두 제공하도록 구성했다. 문제 자체를 본문 퀴즈로 넣지는 않았다.

## 수식과 시각 설명

다섯 개의 display 수식을 KaTeX로 작성했다.

- MoE active parameter 근사
- memory bandwidth가 만드는 latency 하한
- 반복 sampling의 적어도 한 번 성공할 확률
- latent world-model planning objective
- KV-cache byte budget

모든 수식에는 한국어 `underbrace`로 연산의 역할을 적고, 바로 아래 FormulaNote에서 문장 의미와 기호를 다시 설명한다. 360px에서 KV 식이 약 5px 넘치던 결함은 할당식과 token 증가식을 두 행으로 나눠 해결했다. 축소나 가로 스크롤로 숨기지 않았다.

Claim Router는 모바일에서 한 축씩 세로로 읽고 desktop에서는 transcript claim과 evidence matrix가 나란히 보인다. source label이 좁은 화면에서 잘리던 문제는 단일 행 truncate를 제거하고 줄바꿈 가능한 inline grid로 바꿨다.

## 기반 델타 판단

이번 source에서 언급한 메커니즘은 모두 기존 글에 연결할 수 있었다.

- 구조·효율 → LLM architecture, DeepSeek, quantization, MoE streaming
- 추론·데이터 → RLVR, RLHF, Open-R1, distillation
- Agent·RAG → context engineering, RAG pipeline, knowledge compiler
- World model → image·video, world-model RL, Robot AI
- 인프라 → serving, tiered memory, quantization

따라서 새 source 글은 현재 지형을 연결하는 위쪽 층에만 추가했다. 하단 기반은 늘리지 않았다. `Curriculum Delta Gate`는 향후 source가 기존 계산·데이터·런타임·증거 계약으로 설명되지 않을 때만 새 prerequisite를 추가하도록 두 갈래를 명시한다.

## 1차 근거 사용 원칙

Mamba, multi-token prediction, BitNet, test-time compute, V-JEPA 2 같은 주장은 논문을 기준으로 경계를 잡았다. Agent와 retrieval은 Anthropic과 Microsoft Research의 원문, on-device는 Google의 Gemma 3n 개발자 문서, inference 제약은 NVIDIA 기술 문서를 사용했다.

회사 글은 해당 회사가 보고한 구현과 측정 범위까지만 근거로 썼다. 이를 노동시장 전체, 범용 지능, 모든 hardware에서의 우월성으로 확장하지 않았다.

## 4B·9B로 재실행하는 방법

작은 모델에 transcript 전체와 사이트 전체를 한 번에 주지 않는다.

### 4B pass

- claim을 12개 이하로 뽑고 `mechanism/evidence/experience/forecast`로 분류한다.
- claim 하나마다 `status/source/route/delta`만 고정 schema로 출력한다.
- unsupported claim은 반드시 `HOLD`로 만들고 본문을 쓰지 않는다.
- immutable KaTeX 하나만 한국어로 설명한다.
- viewport, selector, expected, actual이 있는 결함 하나만 수정한다.

### 9B pass

- 승인된 claim packet을 축별 `problem/mechanism/evidence/boundary` section으로 합친다.
- 다섯 축 사이의 중복 설명과 모순을 검사한다.
- control, observable, invariant, failure가 있는 Viz 하나를 설계한다.
- transfer problem에 필요한 premise가 본문에 실제로 있는지 감사한다.
- 모든 축에 foundation-delta gate를 실행한다.

### 상위 오케스트레이터의 책임

- 정확한 1차 출처 검색과 원문 범위 감사
- transcript와 근거가 충돌할 때의 판정
- 변동성 높은 claim의 보류 해제
- 기존 전체 학습 그래프와의 중복 검사
- 전 viewport browser QA와 배포

각 pass의 결과는 최종 문장만 저장하지 않고 `observed → inference → decision → changed artifact → verification` event로 남긴다. 이번 source label 잘림과 KV 수식 overflow도 같은 형식으로 JSON ledger에 기록했다.

## 배치 위계 재설계

최초 배치에서는 이 글이 `전체 지도` 하위에 있으면서 slug의 `research-` 규칙 때문에 `선택 원문 근거` 안에 숨겨졌다. 하지만 이 글은 한 논문을 복원한 source deep dive가 아니다. 여러 현재 신호를 검증해 안정된 기반과 목표 경로 사이에 놓는 **변하는 상단 지형**이다.

아티클 역할을 slug 추론과 분리해 `current-landscape`로 명시하고 전체 지도 화면을 세 단계로 바꿨다.

1. `00 START`: 입력, 메모리, 계산, 전달, 피드백의 공통 지도
2. `01 CURRENT`: 2026 AI 기술 지형과 검증 상태
3. `02 DESTINATION`: 모델 구조, 학습과 추론, Agent와 지식, 영상과 World Model, Robot AI, GPU와 분산 실행

본문의 학습 좌표도 `R / SOURCE DEEP DIVE`에서 `NOW / CURRENT LANDSCAPE`로 바꿨다. 따라서 목록에서 보이는 역할과 글을 열었을 때의 역할이 일치한다.

## 구현 산출물

- Content spec: `src/pages/articles/ai/content-specs/research-honglab-ai-landscape-2026.md`
- Article: `src/pages/articles/ai/research-honglab-ai-landscape-2026.tsx`
- Interactive Viz: `src/pages/articles/ai/research-honglab-ai-landscape-2026/viz/TranscriptClaimRouter.tsx`
- Article metadata: `src/content/ai/articlesSystemsFoundation.ts`
- Placement UI: `src/pages/category/SystemsFoundationPath.tsx`
- Article role contract: `src/content/types.ts`, `src/components/ArticleLayout.tsx`
- Responsive QA: `tests/honglab-ai-landscape-qa.spec.ts`
- Replay ledger: `knowledge/authoring/runs/2026-07-20-honglab-ai-landscape-video-reconstruction.json`

## 현재 검증 상태

- Production build: 배치 수정 후 19.11초에 통과
- 집중 Playwright: 배치 수정 후 로컬 5/5 통과, 7.0초
- 화면 폭: 360, 390, 768, 1440px
- Screenshot review: 390·1440px 전체 지도 위계와 390px CURRENT LANDSCAPE 글 머리 통과
- 전체 Playwright: 배치 수정 후 170/170 통과, 34.6초
- 강제 TypeScript: 이번 변경 파일은 진단 0건, 기존 다른 아티클의 누적 오류로 저장소 전체 검사는 실패
- 공개 집중 Playwright: 배치 수정 후 5/5 통과, 6.9초
- 재배포: `cm-blog.service`를 2026-07-20 21:59:41 KST에 재시작
- 공개 HTTP: 수정된 전체 지도와 CURRENT LANDSCAPE 글 모두 200

구현, 전체 회귀 검사, 공개 서버 검증을 모두 완료했다. 상세한 claim 상태, primary source 의도, 실패·수정 순서와 4B·9B 재실행 계약은 같은 이름의 JSON ledger에 고정했다.
