# Viz 개념 감사 — batch 1 (serving 계열 10편)

기준: `docs/viz-concept-audit/RUBRIC.md` (기준 예시 `LayerPassViz`·`LayerLoopProcessViz`). 판정은 각 글 본문과 import한 Viz `.tsx`를 직접 읽고 내렸다. CalculationWalkthrough·AlgorithmBlock·ExplainedFormula·표·`FactorStructureViz`는 Viz로 세지 않았다.

---

## vllm-serving

1. **핵심 메커니즘**
   - M1. token 예산 4·요청 상한 2에서 A(6/3)·B(2/2)·C(3/1)가 네 번의 실행에 어떻게 나뉘어 들어가고, B가 끝난 자리에 C가 언제 들어오나?
   - M2. 세 관문(token 수·sequence 수·KV 여유)은 각각 무엇을 세고, 하나라도 막히면 왜 못 들어가나?
   - M3. prefill과 decode는 한 실행에서 무엇이 다른가?
2. **기존 Viz**
   - `RequestLifecycleViz` · C · 01~04 번호 카드 네 장. 반복 경계가 그림에 없음.
   - `PrefillDecodeViz` · C · 칩 몇 개와 입력·출력·지표 텍스트 카드 두 장.
   - `ContinuousBatchViz` · C · "3번째 → 4번째" 텍스트 행 두 열. 정지 화면이고 token 칸·예산이 없음.
   - `ResourceGateViz` · C · 관문 카드 세 장. 수치를 대입하지 않음.
   - `EngineBoundaryViz` · C · 4계층 텍스트 행.
   - `ParallelLayoutViz` · C · DP/TP/PP 설명 카드 세 장.
3. **커버 여부**: M1 C(카드 전후 비교뿐) · M2 C · M3 C.
4. **새 Viz 설계안 — `IterationSlotTraceViz`** (넣을 절: `#request-trace`, `ContinuousBatchViz` 교체)
   - 구조: 행 = 실행 1~4, 열 = token 슬롯 4칸(예산), 오른쪽에 sequence 좌석 2칸, 그 옆에 요청별 진행 막대(A 입력 6칸+출력 3칸, B 2+2, C 3+1).
   - 장면:
     1. 실행 1: A가 슬롯 4칸을 다 씀. 좌석 1/2 사용, A 진행 4/6, 출력 0.
     2. 실행 2: A 2칸과 B 2칸 = 4/4. 좌석 2/2. 두 요청 prefill이 끝나 첫 출력 칸이 켜짐.
     3. 실행 3: A 1칸, B 1칸. 빈 슬롯 2칸이 회색으로 남고 B가 2/2 출력으로 좌석을 비움. C는 큐에서 도착 표시.
     4. 실행 4: A 1칸과 C 3칸 = 4/4. 좌석 2/2. A는 출력 3/3, C는 1/1로 완료.
     5. 반례: 예산을 8로 늘려도 좌석이 2칸이라 C가 막히는 모습. 슬롯 4칸이 남은 채로 C가 큐에 머묾.
   - 셀 수 있는 수: 실행별 사용 슬롯 4·4·2·4, 좌석 1·2·2·2, 요청별 진행 칸 6/3·2/2·3/1.
5. **우선순위: P1** (핵심 M1·M2가 모두 C)

---

## serving-latency-metrics-and-slo

1. **핵심 메커니즘**
   - M1. 1.000·1.040·1.085·1.285·1.327초에 도착한 다섯 토큰에서 TTFT·ITL·TPOT·E2E는 어떻게 나오고, 평균 81.75ms는 왜 200ms 멈춤을 감추나? 토큰이 1·1·3개 묶음으로 오면 ITL 목록이 40·287ms 두 개로 줄어드는 이유는?
   - M2. percentile은 정렬 순위인데, P95가 1.45초라는 건 정확히 무슨 뜻인가?
   - M3. 5분 구간 288개 중 99% 통과라는 SLO에서 실패 2개는 괜찮고 3개는 왜 초과인가? 관측이 빠진 구간은 어떻게 다루나?
2. **기존 Viz**
   - `ServingLatencyMetricsAndSloViz` · B · 한 요청의 queue·prefill·token 세로선 타임라인이 장면마다 바뀐다. 다만 본문의 5토큰 기록이 아니라 batch 1/8/32 숫자를 쓰고, t(B)를 공유하는 batch 요청들은 그리지 않아 "요청에는 ITL, 서버에는 tokens/s"를 그림으로 말하지 못한다. 결론은 아래 수치 장부가 전달한다.
   - `LatencyPercentileHistogramViz` · A · 본문의 표본 100개 그대로 histogram을 그리고, P50→P95·P99→SLO 순서로 자르는 선이 움직인다. 꼬리 bin을 직접 셀 수 있다.
3. **커버 여부**: M1 B(숫자도 다르고 묶음 수신은 없음) · M2 A · M3 없음.
4. **새 Viz 설계안 — `SloWindowBudgetViz`** (넣을 절: `#slo`, 이어서 `#slo-procedure`)
   - 구조: 하루 288구간을 24행(시) × 12열(5분) 격자로 그림. 칸은 통과(파랑)·실패(주황)·관측 누락(빗금) 세 상태. 오른쪽에 error budget 막대를 floor(288×0.01)=2칸으로 표시.
   - 장면:
     1. 전부 통과. 9절 구간(P95 1.45초 ≤ 1.5초)을 한 칸으로 강조.
     2. 실패 2칸. budget 2칸이 모두 차고 2/288≈0.69%로 달성.
     3. 실패 3칸. budget을 넘친 1칸이 빨갛게 표시되고 1.04%로 초과.
     4. 누락 10칸. 278칸이 전부 통과해도 판정이 "달성 미확인"으로 바뀜. 분모 288이 유지되는 것을 보여 줌.
     5. 한 칸에 요청 1개, 다른 칸에 10,000개를 넣은 구간 가중 반례. 칸마다 한 표라는 점을 보여 줌.
   - 셀 수 있는 수: 288칸, 실패 칸 0·2·3, 누락 10칸, budget 2칸.
   - (보조) M1용 `TokenArrivalGapsViz`, 넣을 절 `#small-case`→`#source-client-events`: 시간축 위에 다섯 도착 점을 찍고 간격 40·45·200·42를 칸 폭으로 그린다. 평균 장면에서는 칸을 81.75로 평탄화하고, 묶음 장면에서는 1·1·3 이벤트로 바꿔 간격 칸을 2개(40·287)로 줄인다.
5. **우선순위: P1** (M3 없음, M1 B)

---

## serving-benchmark-methodology

1. **핵심 메커니즘**
   - M1. throughput은 μ=10에서 포화하는데, latency는 왜 그 전(λ=8)에 먼저 꺾이나? 대기열에 무엇이 쌓이나?
   - M2. cold 첫 요청(6.8s), ramp-up, drain 표본은 왜 버리고 steady-state 창만 세나?
   - M3. 반복 5회의 평균 차이 0.024s가 표준편차 0.021s 한 개 수준이면 왜 판정하지 않나?
2. **기존 Viz**
   - `ServingBenchmarkMethodologyViz` · B · recharts 곡선 두 개가 λ=2→5→8→9.5까지 자라고 ρ·W·L 수치 장부가 붙는다. 결과 곡선은 보여 주지만, 곡선이 꺾이는 원인인 대기열(L=λW개 요청)은 그리지 않는다.
3. **커버 여부**: M1 B · M2 없음 · M3 없음.
4. **새 Viz 설계안 — `SteadyStateWindowViz`** (넣을 절: `#protocol`)
   - 구조: 가로는 실행 시간축. 위 행은 요청별 TTFT 막대열(요청 하나 = 칸 하나), 아래 행은 대기열 길이와 batch 크기 계단. 구간 띠는 cold → warmup → ramp-up → steady → drain.
   - 장면:
     1. 첫 요청: TTFT 6.8s 칸 하나가 튀고 다음부터 0.35s. cold 칸이 별도 상자로 빠짐.
     2. warmup 요청 n_w칸을 회색으로 버림.
     3. ramp-up: 대기열이 0에서 차오르는 동안의 TTFT 칸이 정상보다 낮음. 버림 표시.
     4. steady: 대기열이 평평해진 구간의 칸만 측정 창에 들어감.
     5. drain: 도착이 끊긴 뒤 batch가 작아지고 ITL이 빨라지는 칸들을 버림.
     6. 반복 5회: A 0.80·0.83·0.79·0.84·0.81과 B 0.78·0.80·0.76·0.82·0.79를 점 열 개로 찍고 ±σ 띠가 겹쳐 "판정 보류"로 끝남.
   - 셀 수 있는 수: cold 1칸(6.8s), steady 창의 칸 수, 반복 점 5+5개.
   - (보조) M1용 `QueueFillViz`, 넣을 절 `#load`: 서버 상자 1개 앞에 대기 요청 상자를 L=λW개 쌓는다. λ=5이면 1개, λ=8이면 4개, λ=9.5이면 19개.
5. **우선순위: P1** (M2 없음, M1 B)

---

## inference-cost-and-capacity-planning

1. **핵심 메커니즘**
   - M1. peak 6,000 tokens/s에 GPU 6장이면 raw로는 맞는데, 왜 9장이 필요한가? raw headroom 50%와 planning margin 5%는 분모가 어떻게 다른가?
   - M2. 하루 트래픽이 4~20 RPS로 움직일 때, 고정 용량은 왜 over와 under 중 하나를 고를 수밖에 없나? reserved와 autoscale은 이를 어떻게 메우나?
   - M3. 트래픽을 3등분했을 뿐인데 405B가 GPU의 92.4%를 가져가는 이유는? 16장 replica라는 단위 때문이다.
2. **기존 Viz**
   - `InferenceCostAndCapacityPlanningViz` · B · 24시간 트래픽 면 위에 용량 계단선과 위반 점이 장면마다 바뀐다(9장 고정, 6장 고정, reserved 6+auto). 다만 용량이 RPS 선이라 GPU 장수와 0.7 이용률 칸을 셀 수 없다.
   - `TierMixFleetViz` · C · 등급별 가로 막대 세 개와 수치 장부. replica 단위(1·2·16장)가 그림에 없음.
   - (`FactorStructureViz` 헤드룸 월비용은 곱셈 인수 표시라 Viz로 세지 않음)
3. **커버 여부**: M1 B(설명문의 "headroom 5%"뿐, 분모 차이는 그림에 없음) · M2 B · M3 C.
4. **새 Viz 설계안 — `GpuHeadroomStackViz`** (넣을 절: `#capacity`, 첫 Viz 바로 앞의 `#problem` 예측 질문과 연결)
   - 구조: GPU 기둥 N개. 기둥 하나의 높이는 1,000 tokens/s(10칸 × 100)이고, 7칸째에 이용률 0.7 선이 있다. peak 6,000은 60칸의 수요 물로 왼쪽부터 채운다.
   - 장면:
     1. 6장: 60칸이 기둥 6개를 꼭대기까지 채움. 0.7 선 위 18칸이 "ρ=1 구간"으로 빨갛게 표시됨.
     2. 9장, 0.7 선까지만 채움: 63칸 용량에 60칸 수요가 들어가고 남는 3칸 = planning margin 5%.
     3. 같은 9장의 raw 90칸 기준: 남는 30칸 = 50%. 그중 27칸은 0.7 선 위의 비워 둔 몫이라 색을 다르게 칠함.
     4. 처리량 저하(1,000→800, 기둥당 8칸): 0.7 선이 5.6칸으로 내려가 11장이 필요해짐.
     5. 12장(2× headroom): 추가된 기둥 3개에 "$4,320/월" 라벨. 평균 8 RPS(24칸)일 때 이용률 27%를 빈칸으로 보여 줌.
   - 셀 수 있는 수: 기둥 6·9·11·12개, 수요 60칸, margin 3칸, raw 여유 30칸.
5. **우선순위: P2** (핵심 M1·M2가 B, 보조 M3가 C)

---

## inference-runtime-anatomy

1. **핵심 메커니즘**
   - M1. 80GB GPU에서 KV pool 49GB는 어떤 뺄셈 순서로 정해지나? (72−17.5−4.5−1)
   - M2. API server, EngineCore, worker는 왜 별도 process이고, 각자 무엇을 소유하나?
   - M3. TP 8 worker가 140GB 중 자기 17.5GB만 읽을 때 load 하한이 70s, 9s, 140s로 갈리는 이유는? 공유 link와 local link 중 무엇이 병목인가?
2. **기존 Viz**
   - `InferenceRuntimeAnatomyViz` · A · GPU 두 장의 memory 지도가 weight→peak→KV→graph 순서로 채워지고 process 상자의 하위 함수명이 장면마다 바뀐다. GB 구간 폭을 비례로 그렸다. 다만 process 분리와 memory 지도 두 메커니즘을 한 Viz에 겹쳐 놓아 "한 Viz = 한 메커니즘"을 조금 벗어난다.
3. **커버 여부**: M1 A · M2 B(상자 이름만 있고 ZMQ 경계나 소유 state의 이동은 없음) · M3 없음.
4. **새 Viz 설계안 — `ShardLoadPathViz`** (넣을 절: `#loading`)
   - 구조: 왼쪽 checkpoint 140GB를 17.5GB 칸 8개로 나눈 띠, 가운데 link(공유 1개 또는 local 8개), 오른쪽 worker/GPU 8개. 각 칸이 흐르는 진행률과 경과 초 시계를 둔다.
   - 장면:
     1. 비분할: 한 worker가 140GB 8칸을 2GB/s 공유 link 하나로 받음 → 70s.
     2. TP 8 + local NVMe 2GB/s × 8: 칸 8개가 동시에 흘러 17.5/2 = 8.75s. 나머지 7칸은 각 worker가 "읽지 않음"으로 흐리게 표시.
     3. TP 8 + 공유 NFS 1GB/s: 8칸이 한 줄로 서서 140s.
     4. safetensors mmap과 .pt 비교: .pt는 140GB 전체를 CPU에 풀고 나서 자르는 우회 경로가 추가됨.
   - 셀 수 있는 수: 칸 8개 × 17.5GB, 동시에 흐르는 칸 1개 또는 8개, 70·8.75·140s.
5. **우선순위: P1** (M3가 절 하나와 식 하나를 차지하는 핵심인데 Viz 없음. M1은 A)

---

## multimodal-serving-pipeline

1. **핵심 메커니즘**
   - M1. 1,024×1,024 사진 한 장이 왜 1,369자리가 되나? (1,036px → 74×74 patch → 2×2 merge)
   - M2. prefix cache key에 사진 hash가 없으면 왜 다른 사진의 KV를 잘못 내주나? hit가 1,376에서 끝나면 사진 마지막 9칸 때문에 왜 사진 전체를 다시 encode하나?
   - M3. encoder 예산과 encoder cache(8,192)는 사진 단위(1,369)로 어떻게 차고, U는 왜 이번 step에 0 token을 받으며, 다음 step에 P는 언제 쫓겨나나?
2. **기존 Viz**
   - `ImageTokenViz` · A · 실제 74칸, 37칸 격자선을 긋고 크기 맞춤→patch→merge→placeholder 장면으로 넘어간다.
   - `PrefixKeyViz` · A · 88개 block 칸을 R1과 비교해 hit·wrong·partial로 칠한다. 장면마다 key 규칙이 바뀌고 칸을 셀 수 있다.
   - `KvFootprintViz` · C · 같은 눈금의 가로 막대(2, 88, 88×4, 86+8 block)와 수치. block 칸이 아닌 막대 길이라 공유 구조가 그림으로 드러나지 않음(공유는 `PrefixKeyViz`가 더 잘 보여 줌).
   - `EncoderScheduleViz` · B · 의사코드 줄이 강조되며 넘어가는 형식은 기준 예시와 같다. 그러나 예산과 cache가 진행 막대 두 개와 "P Q R S T" 텍스트뿐이라 사진 칸과 남는 1,347칸, 참조 수를 셀 수 없다.
3. **커버 여부**: M1 A · M2 A · M3 B.
4. **새 Viz 설계안 — `EncoderCacheSlotViz`** (넣을 절: `#encoder-budget`, 또는 `EncoderScheduleViz`의 아래 상태부를 교체)
   - 구조: 8,192칸 띠 두 줄(위는 이번 step의 encoder 예산, 아래는 encoder cache). 사진 하나 = 1,369칸 블록(P·Q·R·S·T·U 색 구분). cache 블록마다 참조자 배지(R1, R2…). 오른쪽에 R1~R7 상태 칩.
   - 장면:
     1. R1·P: 예산과 cache에 P 블록 1개. 예산이 6,823 남음. 참조 {R1}.
     2. R2·P: 새 블록 없이 P 배지에 R2만 추가. 예산 6,823 그대로.
     3. R3~R6: Q·R·S·T 블록 4개가 쌓여 cache 6,845칸, 예산 1,347칸 남음.
     4. R7·U: U 블록(1,369)이 남은 1,347칸보다 22칸 길어 튀어나오고 거부됨. R7은 0 token.
     5. 다음 step: 예산 띠가 8,192로 리셋. P 배지가 0이 되어 P 블록이 빠지고 그 자리에 U가 들어감.
   - 셀 수 있는 수: 블록 1·1·5·5개, 남은 칸 6,823·1,347, 초과분 22칸, 참조 수 1→2→0.
5. **우선순위: P2** (M3가 B. M1·M2는 A)

---

## vllm-scheduler

1. **핵심 메커니즘**
   - M1. batch를 끝까지 고정하면 길이 편차가 왜 idle slot으로 남나? (static, dynamic, iteration-level 비교)
   - M2. 전체 예산 5, P 조각 상한 4에서 R1·R2가 1씩 먼저 쓰면, P=12는 왜 최소 3번이 아니라 실제로 4번(3·3·3·3)에 걸쳐 읽히나?
   - M3. preemption 뒤 재개할 때 8 token 중 실제 hit 3을 빼고 왜 5 token을 다시 계산하나? block 해제와 counter reset은 어떤 순서인가?
2. **기존 Viz**
   - `BatchingGenerationsViz` · A · 4 slot × 10 iteration 격자에서 세대마다 busy·idle 칸이 바뀐다. idle 21/22/16칸을 직접 셀 수 있다.
   - `ChunkedPrefillViz` · C · "R1·R2 + P₁ 3" 같은 텍스트 상자 나열. 정지 화면이고 예산 칸이 없음.
   - `PreemptionTraceViz` · C · RUNNING→PRESSURE→PREEMPT→RESUME 텍스트 카드 네 장.
   - `ProgressGapViz` · C · computed·target·need 숫자 카드 세 장.
   - `SchedulerContractViz` · C · 입력, 결정, 출력 텍스트 박스 흐름도.
   - `SchedulerLoopViz` · C · 01~04 단계 카드.
   - `SchedulerKnobViz` · C · knob 장부 카드.
3. **커버 여부**: M1 A · M2 C · M3 C.
4. **새 Viz 설계안 — `ChunkBudgetGridViz`** (넣을 절: `#prefill-decode`, `ChunkedPrefillViz` 교체)
   - 구조: 행 = 실행 1~4, 열 = 예산 슬롯 5칸. 각 행에 P의 조각 상한 4를 점선 틀로 표시. 오른쪽에 P 입력 12칸 진행 띠.
   - 장면:
     1. 비교: 예산을 늘려 P 12칸을 한 번에 넣음. R1·R2 칸이 그 실행 뒤로 밀림.
     2. 실행 1: R1 1, R2 1, P 3. 상한 4 틀 안의 1칸은 비어 있음. P 진행 0→3.
     3. 실행 2~3: 같은 모양이 반복되며 P 진행 3→6→9.
     4. 실행 4: P 진행 9→12. 하한 ⌈12/4⌉=3과 실제 4를 나란히 표시.
   - 셀 수 있는 수: 슬롯 5칸 × 4행, P 칸 3·3·3·3, 매 행 남는 상한 1칸, 진행 12칸.
   - (보조) M3용 `PreemptRecomputeViz`, 넣을 절 `#preemption`: P의 KV 칸 8개 → 할당 실패로 8칸 해제와 counter 0 → 재개 시 prefix hit 3칸은 파랑, 재계산 5칸은 주황, 미처리 입력은 별색.
5. **우선순위: P1** (M2·M3가 C. M1은 A)

---

## continuous-batching-step-anatomy

1. **핵심 메커니즘**
   - M1. 예산 8에서 A·B가 1씩 먼저 가져가고 남은 6이 C(10)의 첫 조각이 되는 과정. 다음 실행에서 C4+D2로 다시 8이 되고, 셋째는 4가 되는 이유는?
   - M2. token이 6 남아도 sequence 상한 2나 KV 할당 실패 때문에 C가 못 들어오는 경우는? 세 조건이 독립이고, 실패하면 break하며 잔액을 빼지 않는다.
   - M3. C에 6을 배정하면 `num_computed_tokens`가 0→6이 되지만, 이것이 GPU 완료를 뜻하지 않는 이유는? (예약 시점과 완료 시점의 차이)
2. **기존 Viz**
   - `ContinuousBatchingStepAnatomyViz` · B · running과 waiting 목록, decode 점, C prefill 진행 막대, 예산 막대가 장면마다 바뀐다. 구조와 상태 변화는 있다. 하지만 예산이 8칸이 아닌 비례 막대(라벨 "A+B 2")라 칸을 셀 수 없고, C의 0/10 진행도 연속 막대다. sequence 상한과 KV 조건은 화면에 없다.
3. **커버 여부**: M1 B · M2 없음 · M3 없음.
4. **새 Viz 설계안 — `StepGateTripleViz`** (넣을 절: `#why-two-limits`, 이어서 `#source-admission`)
   - 구조: 세 줄의 칸. ① token 슬롯 8칸, ② sequence 좌석 4칸(장면에 따라 2칸), ③ KV block 칸(free 개수). 왼쪽에 waiting C(10칸 입력)가 있고, 각 줄 끝에 통과/거부 램프.
   - 장면:
     1. 기본: A·B가 슬롯 2칸과 좌석 2칸을 차지. C가 슬롯 6칸, 좌석 1칸, KV 칸을 받아 세 램프 모두 통과.
     2. 좌석 상한 2: 슬롯 6칸이 비어 있어도 좌석 줄에서 거부. C는 큐에 남음.
     3. KV free 부족: 슬롯과 좌석은 통과했지만 allocate가 실패해 break. 슬롯 6칸은 차감되지 않은 채 되돌아감.
     4. `long_prefill_token_threshold`=4: C가 4칸만 받고 슬롯 2칸이 남음.
     5. (M3) 예약과 완료: C의 `computed` 칸이 배정 순간 6으로 먼저 칠해지고(점선), GPU 결과 도착 뒤 실선이 됨.
   - 셀 수 있는 수: 슬롯 8칸 중 2·6·4, 좌석 4 또는 2칸, 거부 위치 1곳, C 진행 0→6/10.
   - 함께 할 작은 수정: 기존 Viz의 예산 막대를 8칸 격자로 바꾸면 M1이 A가 된다.
5. **우선순위: P1** (M2 없음, M1 B)

---

## prefill-decode-phase-dynamics

1. **핵심 메커니즘**
   - M1. decode는 위치 하나만 넣는데 왜 32층을 모두 지나나? 줄어드는 것은 깊이가 아니라 폭이다.
   - M2. C 조각을 늘리면 계산은 위치당 100 MFLOP씩 늘지만 전송은 2MB씩만 느는 이유는? 가중치 100MB는 한 번만 읽기 때문이고, 그래서 c=4는 전송, c=16은 계산이 하한을 정한다.
   - M3. 예산 6에서 A1·B1을 먼저 넣으면 C20은 왜 4→8→12→16→20으로 다섯 번 걸리고, 첫 출력은 다섯 번째에야 나오나?
2. **기존 Viz**
   - `LayerPassViz` · A · (기준 예시) 층 × 위치 격자, 층을 올라가는 띠, 과거 K/V 읽기 깜빡임.
   - `LayerLoopProcessViz` · A · (기준 예시) 의사코드를 한 줄씩 실행하며 행 수 4와 1을 대조.
   - `PrefillDecodePhaseDynamicsViz` · C · 계산과 전송 가로 막대 두 개와 목표선, 수치. 막대 길이만 늘고, 전송량이 왜 천천히 느는지(공유 가중치 대 요청별 KV)를 구조로 그리지 않음. 수치 장부를 막대로 옮긴 형태다.
3. **커버 여부**: M1 A · M2 C · M3 없음.
4. **새 Viz 설계안 — `WeightReuseCrossoverViz`** (넣을 절: `#mixed-model`, `PrefillDecodePhaseDynamicsViz` 교체 또는 보강)
   - 구조: 왼쪽 "읽을 byte" 더미는 가중치 100MB 큰 블록 1개(공유), A의 KV 20MB와 B의 KV 20MB, C 위치마다 2MB 작은 칸. 오른쪽 "할 계산" 더미는 위치마다 100 MFLOP 칸(2+c개). 아래 시간축에서 두 더미를 각각 100GB/s와 1TFLOP/s로 나눈 길이를 그리고 2ms 목표선을 둔다.
   - 장면:
     1. c=0: byte 140MB(블록 3개), 계산 칸 2개. 전송 1.40ms가 하한.
     2. c=4: C 작은 칸 4개 추가(+8MB), 계산 칸 6개. 1.48 대 0.60, 여전히 전송.
     3. c=16: 작은 칸 16개(+32MB), 계산 칸 18개. 1.72 대 1.80으로 역전(ridge 10 FLOP/byte를 넘음).
     4. c=20: 계산 칸 22개 → 2.2ms가 목표선을 넘어 하한부터 불가능.
     5. 측정 대비: c=16의 하한 1.8 옆에 관측 2.3 칸을 붙여 "하한은 통과 증거가 아님"을 보여 줌.
   - 셀 수 있는 수: 계산 칸 2·6·18·22개, C의 KV 칸 0·4·16·20개, 공유 블록 1개.
   - (보조) M3용 `ChunkFiveRunsViz`, 넣을 절 `#request-trace`: 6슬롯 × 5실행 격자에 A1·B1·C4를 칠하고, C 진행 띠 20칸이 4칸씩 채워지며, 5행째에서만 C 첫 출력 칸이 켜진다.
5. **우선순위: P1** (M2가 C, M3 없음. M1은 A)

---

## disaggregated-prefill-decode-serving

1. **핵심 메커니즘**
   - M1. P가 4ms에 기록을 완성해도 D가 6ms에 복사 완료를 확인할 때까지 왜 양쪽에 128B씩, 합쳐 256B가 묶이나? 첫 출력은 왜 D의 8ms 출력이 되나?
   - M2. 기록을 앞 두 자리만큼 가진 서버(대기 3 + 계산 2 = 5ms)가, 아무것도 없는 서버(0.5 + 4 = 4.5ms)보다 왜 느릴 수 있나? load 40과 8, 41과 8에서 SGLang 균형 판정은 어떻게 갈리나?
   - M3. P 풀 크기: 0.095 GPU·초 × 100 req/s ÷ 0.8에서 왜 12 replica인가?
2. **기존 Viz**
   - `DisaggregatedPrefillDecodeServingViz` · A · 앞·뒤 장치의 입력 4칸(32B씩)이 0, 4, 5, 6, 8ms 장면마다 보관과 복사 상태로 바뀐다. 칸을 직접 셀 수 있다. (사소한 점: 6ms "반환 가능" 장면에서도 앞 칸이 4칸 그대로 칠해져 있어 해제 시점이 그림으로는 8ms처럼 보인다.)
3. **커버 여부**: M1 A · M2 없음 · M3 없음(장부 수준이라 Viz 필요성은 낮음).
4. **새 Viz 설계안 — `CacheVsQueueRouteViz`** (넣을 절: `#routing-estimate`, 이어서 `#routing-source`)
   - 구조: 서버 2개의 레인. 각 레인은 대기 칸(0.5ms 단위), 보유 prefix 칸(입력 4자리 중 몇 칸), 새로 계산할 칸(자리당 1ms)으로 이루어진 시간축 막대. 위쪽에는 router의 load 숫자 두 개와 판정 램프 두 개(차이 > 32, 큰 쪽 > 1.1 × 작은 쪽)가 있다.
   - 장면:
     1. 서버 X: prefix 2칸 hit, 대기 6칸(3ms), 계산 2칸 → 5ms.
     2. 서버 Y: hit 0칸, 대기 1칸(0.5ms), 계산 4칸 → 4.5ms. Y가 먼저 끝나는 것을 나란히 보여 줌.
     3. load 40 대 8: 차이 32라 첫 램프가 꺼짐 → 균형 판정 미발동.
     4. load 41 대 8: 두 램프 모두 켜짐 → 최소 load 서버로 보냄.
   - 셀 수 있는 수: 대기 칸 6과 1, hit 칸 2와 0, 계산 칸 2와 4, 결과 5와 4.5ms, load 차이 32·33.
   - 함께 할 작은 수정: 기존 Viz의 6ms 장면에서 앞 장치 칸을 "반환 가능" 상태색으로 바꾼다.
5. **우선순위: P1** (M2 라우팅 두 절에 Viz 없음. M1은 A)

---

## 요약

| slug | P1/P2/P3 | proposed new Viz name |
|---|---|---|
| vllm-serving | P1 | IterationSlotTraceViz |
| serving-latency-metrics-and-slo | P1 | SloWindowBudgetViz (+ TokenArrivalGapsViz) |
| serving-benchmark-methodology | P1 | SteadyStateWindowViz (+ QueueFillViz) |
| inference-cost-and-capacity-planning | P2 | GpuHeadroomStackViz |
| inference-runtime-anatomy | P1 | ShardLoadPathViz |
| multimodal-serving-pipeline | P2 | EncoderCacheSlotViz |
| vllm-scheduler | P1 | ChunkBudgetGridViz (+ PreemptRecomputeViz) |
| continuous-batching-step-anatomy | P1 | StepGateTripleViz |
| prefill-decode-phase-dynamics | P1 | WeightReuseCrossoverViz (+ ChunkFiveRunsViz) |
| disaggregated-prefill-decode-serving | P1 | CacheVsQueueRouteViz |
