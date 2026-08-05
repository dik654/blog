# LLM Serving 학습 경로 재구성 보고서

이 문서는 글 요약이 아니라, `서빙 · 인프라`를 최신 운영 질문에서 request runtime과 배포 제어면으로 내려가는 학습 시스템으로 바꾼 판단 기록이다. 같은 이름의 JSON은 작은 모델용 작업 packet과 기계 검증값을 보존한다.

## 1. 기존 글을 버리지 않고 책임 경계를 다시 세웠다

기존 10편은 vLLM 내부 실행 5편과 운영 5편으로 각각 깊이가 있었다. 문제는 사이드바에서 모두 같은 평면에 놓여 `PagedAttention`과 `Kubernetes fleet`, `scheduler`와 `gateway`가 어떤 관계인지 보이지 않았다는 점이다.

- `00 · Request Runtime`: request phase, KV ownership, model runner, block manager, scheduler, speculative decode와 VLM input path.
- `01 · 운영 제어면`: release, GPU fleet, gateway, SLO, observability와 recovery.

부모 `서빙 · 인프라`는 두 분기 카드만 보여 주고 끝나지 않는다. 두 실제 학습 경로와 11개 핵심 글을 같은 화면에서 이어 보여 준다. 다만 모든 부모 주제를 자동으로 평탄화하면 독립 목표가 다시 섞이므로 `aggregateChildArticles`를 콘텐츠 설계자가 명시한 부모에만 적용했다.

## 2. 최신 상단에는 Disaggregated Serving이 빠져 있었다

기존 vLLM 글은 한 engine 안의 request execution을 잘 설명하지만, 현재 production serving에서 중요한 다음 질문이 없었다.

1. Prefill과 decode가 TTFT와 TPOT에 서로 다른 압력을 만드는가.
2. 두 phase를 다른 pool로 나누면 어떤 간섭이 줄고 어떤 KV 이동 비용이 새로 생기는가.
3. Prefix cache locality와 queue load를 router가 어떻게 함께 판단하는가.
4. 언제 aggregated baseline이 더 낫고, 어떤 SLO·failure evidence로 분리를 승인하는가.

따라서 새 글 `llm-disaggregated-serving`을 Runtime 경로의 첫 글로 두고, 그 뒤에 vLLM 전체 실행, PagedAttention, scheduler, speculative decode, VLM serving을 배치했다. 최신 제품 이름을 나열하는 글이 아니라 뒤의 다섯 구현 글을 읽을 이유를 먼저 만드는 역할이다.

## 3. 원문 근거와 주장 경계

- NVIDIA Dynamo 공식 설계: PrefillRouter, P/D worker 선택, NIXL KV transfer와 runtime-reconfigurable deployment 경계에 사용했다. 모든 workload에서 분리가 빠르다는 근거로 사용하지 않았다.
- Mooncake: Kimi long-context workload의 P/D cluster, multi-tier KV cache, SLO-aware scheduling 사례에 사용했다. 일반 채팅 workload의 보편 optimum으로 확대하지 않았다.
- Orca: autoregressive request를 iteration 단위로 다시 batch하는 최소 scheduler 기준점으로 사용했다. 더 오래된 queueing 역사로 계속 내려가지 않았다.
- PagedAttention: 동적으로 늘어나는 KV를 block으로 할당·공유하는 engine 내부 memory 기준으로 사용했다. P/D routing이나 remote transfer와 같은 기술로 섞지 않았다.
- vLLM 공식 예제: KV connector와 push/pull handoff의 현재 공개 구현 예로 사용했다. Version-sensitive API를 영구 계약처럼 쓰지 않았다.

최소 바닥은 Orca 2022다. 더 오래된 virtual memory, queueing, RDMA 논문은 profiler나 failure trace가 그 기반을 요구할 때만 연다.

## 4. 본문만으로 풀어야 하는 비공개 전이 문제

가상의 32-layer GQA 모델은 8 KV heads, head dimension 128, BF16 KV를 사용한다. Prompt는 8,192 tokens, 예상 output은 512 tokens, 동시 request는 24개다. P/D pool 사이는 100 Gb/s fabric이고 유효 payload 효율은 80%다.

독자는 본문만으로 다음을 해야 한다.

1. `128 KiB/token`, `1 GiB/request`의 prompt KV를 유도한다.
2. 100 Gb/s를 12.5 GB/s line rate와 10 GB/s effective bandwidth로 바꾸고, 순수 handoff 하한이 약 `107 ms`임을 계산한다.
3. 24개 request의 prompt+output resident KV가 약 `25.5 GiB`임을 계산한다.
4. TTFT가 나빠졌을 때 compute, queue, KV transfer, TCP fallback 중 무엇을 trace로 분리할지 정한다.
5. Cache hit만 높은 router가 hot worker를 만들 수 있음을 설명하고 cache locality와 queue cost를 같은 request 단위로 비교한다.
6. 짧은 prompt·낮은 동시성·4B/9B 모델에서 aggregated mode가 더 나을 수 있는 이유와 release gate를 제시한다.

문제는 제품 이름을 기억하는지 보지 않는다. Byte, bandwidth, phase, state ownership과 SLO를 연결할 수 있는지 검사한다.

## 5. 수식과 Viz를 검산 도구로 만들었다

표시 수식 네 개는 KV/token, handoff lower bound, decode capacity, release SLO를 담당한다. 모든 수식 안에 한글 설명을 넣고 바로 뒤 `FormulaNote`에서 기호와 적용 경계를 설명한다. 첫 모바일 검증에서 긴 KV 수식이 11.1px까지 줄어든 문제를 발견해 의미 단위로 세 줄로 나눴다. 최종 360px 최소 수식 글자는 `12.22px`, 첫 수식은 `14.24px`이며 overflow는 0이다.

KaTeX가 tall floor delimiter를 만들 때 잘못된 SVG path `MM319...`를 출력하는 것도 브라우저 console gate에서 발견했다. Capacity 식을 `M_request` 중간량과 `B_max \lesssim M_free/M_request`로 분해해 수학 의미를 보존하면서 잘못된 path와 console error를 제거했다.

- `ServingPressureLab`: prompt, output, concurrency, 100/200/400G를 바꾸며 KV와 transfer를 직접 계산한다.
- `DisaggregatedFlowLab`: aggregated와 P/D topology를 전환하고 각 단계의 입력, 작업, 출력, invariant, failure를 읽는다.
- `ServingReleaseGate`: workload fixture, baseline, transport audit, failure·SLO gate를 순서대로 검증한다.

모바일에서는 내부 가로 스크롤을 쓰지 않는다. 768px의 5개 진단 칸은 마지막 실패 신호가 빈 열을 남기지 않도록 전체 폭을 차지하고, 1440px에서는 다시 5열로 정렬한다.

## 6. 4B·9B 모델로 좁혀 재현하는 packet

4B 모델에는 한 번에 하나의 계산 또는 경계만 준다.

```text
source claim 1개
-> 허용 주장 / 금지 과장
-> model shape 숫자
-> 수식 1개
-> 기대 byte·latency oracle
-> viewport와 console acceptance
```

9B 모델에는 request phase 하나 또는 topology 판단 하나를 준다.

```text
workload fixture
-> SLO symptom
-> phase pressure
-> state ownership
-> transport / queue tradeoff
-> failure injection
-> aggregated baseline 비교
-> source boundary
```

오케스트레이터는 Runtime과 운영 제어면의 분리, 최소 역사 중단점, 공통 수치, private transfer problem, 반응형 Viz와 public deployment를 유지한다. 작은 모델 출력은 prose가 아니라 `claim/evidence/boundary/equation/viz-state/test` IR로 먼저 받는다.

## 7. Claude 협업 기록

Context-manager의 `ai-researcher`에게 serving·on-device 원문 및 커리큘럼 감사를 새 세션으로 요청했고, 배포 전에는 현재 글의 과장·누락·내부 난문과 다음 On-device 원문 뼈대를 다시 독립 검토 요청했다. 두 요청 모두 `Provider error: All providers failed` HTTP 500으로 종료됐다. 사용자가 지정한 경계를 지켜 direct Claude CLI로 우회하지 않았다. 실패 요청과 결과는 숨기지 않고 이 기록에 남겼으며, 구현은 공식 문서·원 논문 대조와 Playwright 수치 oracle으로 검증했다.

## 8. 검증과 배포 결과

- Targeted ESLint와 `git diff --check`: 통과.
- Production build: 통과.
- 개발 서버 관련 회귀: 36/36 통과.
- 로컬 production contract: 5/5 통과.
- 공개 URL contract: 5/5 통과.
- 검증 viewport: 360, 390, 768, 1440px.
- 표시 수식/한글 설명: 4/4.
- Article HTML table: 0.
- Document overflow, formula overflow, console error, malformed SVG path: 0.
- `cm-blog.service` 재시작: 2026-07-23 00:21:30 KST.
- 배포 chunk: `llm-disaggregated-serving-B4yEbsPq.js`, `31,523 bytes`.
- SHA-256: `02086ce8c64ca7003e1016757dffee7ceb93d821982cf134d44b7a3a9047cad3`.
