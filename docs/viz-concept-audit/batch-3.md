# Viz 개념 감사 · batch 3 (2026-10-15)

기준: `docs/viz-concept-audit/RUBRIC.md`. 참고 기준 Viz는 `prefill-decode-phase-dynamics/viz/LayerPassViz.tsx`, `LayerLoopProcessViz.tsx`.
읽기 전용 감사라 소스는 고치지 않았습니다. 등급은 A(메커니즘)·B(부분)·C(장부·카드)·—(없음)로 매깁니다.

---

## flash-attention-io-aware-kernel

**1. 핵심 메커니즘**
- M1. 점수를 두 조각 [1,3]·[2,5]로 나눠 읽어도 7.376113이 나오는 이유는 무엇이고, 옛 ℓ·u **둘 다**에 e⁻²를 곱해야 하는 이유는 무엇인가? (`#picture`, `#mechanism`)
- M2. N×N 점수·확률 배열을 HBM에 쓰지 않으면 무엇이 사라지는가? 32MiB 배열 2개를 쓰고 읽는 128MiB 왕복이다. (`#need`)
- M3. FA4는 왜 기준 3을 유지해도 되는가? 조건부 rescale이다. (`#comparison`)

**2. 기존 Viz**
- `BasisTraceViz.tsx` · **C** · u·ℓ 상자 두 개에 든 숫자만 장면마다 바뀌는 계산 장부입니다. 점수 4칸, 조각 경계, 기준 m이 3에서 5로 옮겨 가는 모습은 화면에 없습니다.
- `FlashAttentionIoAwareKernelViz.tsx` · **B** · 본문에 **삽입되지 않은 고아 파일**입니다. HBM 칸 7개의 읽기·쓰기 표시는 구조라 할 수 있지만, SRAM 쪽은 값을 행으로 늘어놓은 장부입니다.

**3. 커버 여부**: M1 C · M2 —(본문에는 Viz가 없음) · M3 C(BasisTraceViz 장면 2의 숫자뿐)

**4. 새 Viz 설계안: `OnlineSoftmaxTileViz` → `#picture`**
- 구조: 가로 4칸 점수 행 [1,3,2,5]와 그 아래 값 행 [2,4,6,8]을 둡니다. 2칸 폭 tile 괄호를 씌우고, 칸마다 e^(s−m) 막대를 세우며 공통 기준 m을 가로선으로 긋습니다. 오른쪽에는 상태 레지스터 3칸(m, ℓ, u)을 둡니다.
- 장면:
  1. tile 1 [1,3]을 읽습니다. m선이 3에 놓이고 막대는 0.135·1, ℓ=1.135335, u=4.270671입니다.
  2. tile 2 [2,5]를 읽습니다. m선이 5로 뛰고 옛 막대 두 개가 e⁻²배(0.018·0.135)로 줄어듭니다.
  3. 새 막대 0.050·1을 더해 ℓ=1.203438, u=8.876695가 됩니다. tile 1 칸은 회색 "버림"으로 바뀝니다.
  4. 오답 경로: ℓ만 줄이고 u는 그대로 두면 u=12.569393, O=10.444571(빨강)이 됩니다.
  5. O=u/ℓ=7.376113이 나옵니다.
- 셀 수 있는 것: 점수 4칸, tile 2개, 막대 4개의 높이, 레지스터 3칸.
- 보조: 고아 파일은 `#need`에 장면 하나를 더해 삽입하는 편이 좋습니다. 표준 경로의 S 쓰기·S 읽기·P 쓰기·P 읽기 화살표 4개(32MiB × 4 = 128MiB)와 flash 경로의 0개를 대비하는 장면입니다.

**5. 우선순위: P1**

---

## attention-kernel-anatomy-and-backends

**1. 핵심 메커니즘**
- M1. 미래를 가리면 왜 16조각 중 10조각만 처리하고, 그 40칸 중 36칸만 허용되는가? (`#case`, `#causal`)
- M2. 위치 7의 한 행을 key 범위 3·3·2로 나눴을 때 부분 평균 2·5·7.5는 어떻게 4.5로 합쳐지는가? 답은 LSE 비중 3/8·3/8·2/8과 combine kernel이다. (`#split-merge`, `#split-source`)
- M3. 같은 512 FLOP라도 K·V를 네 번 읽으면 왜 128B가 320B로 늘어 FLOP/B가 4에서 1.6으로 떨어지는가? (`#regimes`)

**2. 기존 Viz**
- `AttentionKernelAnatomyAndBackendsViz.tsx` · **A**(장면 1·2) / 장면 3은 **B** · 8×8 격자에서 건너뛴 6조각과 대각선 안 가린 4칸을 직접 셀 수 있습니다. 셋째 장면은 평균 상자 3개를 놓은 정지 그림이고, 한 Viz에 메커니즘 두 개가 섞여 있습니다.
- `AttentionArithmeticViz.tsx` · **B** · 2×2 격자가 있지만 정지 그림이고, 다루는 것도 주변 개념(FLOP 장부)입니다.
- `AttentionTrafficViz.tsx` · **B** · Q·K·V·O 칸 격자와 "Q 0·1~6·7이 K·V를 다시 읽는" 4행은 구조입니다. 그러나 장면이 카드째 바뀌기만 하고, 칸이 HBM에서 칩으로 움직이지 않습니다.
- `AttentionScaleViz.tsx` · **C** · 축소한 장식 격자와 숫자 카드입니다.
- `AutotuneCandidateViz.tsx` · **C** · 카드 5장을 차례로 바꿔 보여 줍니다. 36→21→9 후보가 칸으로 지워지지 않습니다.

**3. 커버 여부**: M1 A · M2 B · M3 B

**4. 새 Viz 설계안: `SplitKvCombineViz` → `#split-merge`**(`#split-source`까지 커버)
- 구조: 맨 위에 위치 7이 읽는 key 8칸(값 1~8)을 둡니다. 그 아래 작업 lane 3개(3칸·3칸·2칸)마다 누적 슬롯(합, 개수)을 붙입니다. 그 아래 workspace 버퍼 3칸(oaccum O_j, lseaccum L_j)과 combine kernel 상자를 둡니다.
- 장면:
  1. 8칸을 lane별 색으로 칠합니다(3/3/2).
  2. lane마다 합 6·15·15, 개수 3·3·2가 차오릅니다.
  3. kernel 1이 끝나면서 O_j=2·5·7.5와 L_j=ln3·ln3·ln2를 workspace에 씁니다.
  4. 오답: 단순 평균을 내면 4.833333(빨강)입니다.
  5. combine: e^(L_j−L) 비중을 8칸 띠 위의 3+3+2칸으로 그리고, 출력 4.5를 냅니다.
- 셀 수 있는 것: key 8칸, lane 3개, workspace 3칸, 비중 띠 8칸.
- 보조(P2): `AttentionTrafficViz`의 장면 2는 K·V 칸이 4번 왕복하는 이동으로 바꿔 64B×4를 세게 하면 좋습니다.

**5. 우선순위: P2**

---

## tensorrt-llm-kv-cache-and-kernels

**1. 핵심 메커니즘**
- M1. 출력 한도까지 38칸을 미리 떼면 왜 4개만 받고(빈칸 88칸), 필요할 때 받으면 왜 10개를 받는 대신 선점이 생기는가? (`#picture`)
- M2. block 하나가 80층을 담으면 왜 복사 1번이고, 층별 tensor면 왜 64KiB 160번인가? (`#pool-layout`)
- M3. 오래된 system prompt A(우선순위 90)는 왜 남고, 하한 30 미만인 D·E는 왜 host로 내려가지 않고 지워지는가? (`#retention`)
- (부가) XQA에서 query 8개가 KV 한 조각을 함께 읽는 구조(`#xqa`), 52 token 부분 재사용(`#reuse`)

**2. 기존 Viz**
- `ReservationPoolViz.tsx` · **A** · 160칸 pool에서 예약 38칸·사용 16칸·선점 16칸을 셀 수 있고 장면마다 상태가 바뀝니다.
- `PoolLayoutViz.tsx` · **A** · 층 × block 격자에서 160조각과 1덩어리를 셀 수 있습니다.
- `RetentionQueueViz.tsx` · **B** · 우선순위 줄 3개와 칩의 상태(취소선·점선) 변화는 있습니다. 하지만 GPU와 host 두 단이 장소로 그려지지 않아 offload가 "이동"으로 보이지 않습니다. 빈칸을 요청하는 쪽과 leaf 제약도 없는 칩 나열입니다.
- `XqaGroupViz.tsx` · **A** · q 8행과 tile 16행, 읽기 선 8개가 1개로 줄어드는 변화를 셀 수 있습니다.

**3. 커버 여부**: M1 A · M2 A · M3 B · XQA A · 부분 재사용 —

**4. 새 Viz 설계안: `RetentionTierViz` → `#retention`**
- 구조: 위쪽 GPU pool 슬롯 행에 A90·B35·C35·D10·E10을 두고 마지막 사용 순서 1~5를 표기합니다. 왼쪽에 우선순위 queue 3층(10/35/90), 아래쪽에 host 슬롯 행을 두고 그 사이에 offload 하한 30 기준선을 긋습니다. 오른쪽에는 빈칸을 요청하는 새 요청 화살표를 둡니다.
- 장면:
  1. 초기 상태입니다.
  2. 빈칸 1개를 요청하면 queue 10에서 오래된 D를 꺼냅니다. 10<30이라 휴지통으로 가고, 그 슬롯을 새 block이 차지합니다.
  3. E도 같은 방식으로 지워집니다.
  4. 2칸을 더 요청하면 B·C(35≥30)가 host 행으로 내려가고 A는 남습니다.
  5. 다음 요청이 B의 prefix를 찾습니다. B가 host에서 GPU로 1회 복사(block 하나 = 10MiB 한 덩어리)되어 올라옵니다.
  6. vLLM 대비: 한 줄 LRU라 A와 B가 먼저 사라집니다.
- 셀 수 있는 것: block 5개, GPU·host 슬롯, queue 3층, 사라진 수와 내려간 수(2/2).
- 보조(P3): `PartialReuseCopyViz`(`#reuse`)는 52 token을 32칸 block 1개와 둘째 block의 20칸 복사로, 16칸 block 3개(48)에 4 token 재계산과 대비하는 그림입니다.

**5. 우선순위: P2**

---

## inference-engine-design-axes

**1. 핵심 메커니즘**
- M1. 아직 만들지 않은 출력을 얼마나 떼어 두느냐가 왜 받는 수를 3·3·19·4로 가르고, 19개를 받은 쪽이 500 token에서 8개만 남기고 11개를 선점하는 대가를 치르는가? (`#reservation`)
- M2. 같은 system prompt 1,000 token을 vLLM은 왜 992만, TRT·SGLang은 1,000을, llama.cpp는 같은 slot일 때만 재사용하는가? (`#reuse`)
- M3. CPU 준비를 GPU 계산 뒤에 숨기면 왜 결과를 한 step 늦게 읽고, 끝 token 뒤에 token 하나를 더 계산하게 되는가? (`#overlap`)
- (부차) 저장 단위가 남기는 빈칸 12칸은 본문 스스로 "작다"고 결론 내는 주변 개념입니다.

**2. 기존 Viz**
- `InferenceEngineDesignAxesViz.tsx` · **B** · 4,096 막대를 요청 수만큼 칸으로 나눠 3/19/8/4는 셀 수 있습니다. 하지만 장면이 서로 독립된 정지 상태라, 19개가 500 token으로 자라며 11개가 밀려나는 과정이 그려지지 않습니다.
- `KvUnitTailViz.tsx` · **C** · 막대 하나의 폭만 바뀝니다. 12칸 빈칸이 544 척도에서 약 2%라 거의 보이지 않습니다.

**3. 커버 여부**: M1 B · M2 — · M3 — · (저장 단위) C

**4. 새 Viz 설계안: `PrefixReuseUnitViz` → `#reuse`**
- 구조: 엔진 4행(vLLM·TensorRT-LLM·SGLang·llama.cpp)을 두고 행마다 1,000 token prefix를 1칸=8 token, 125칸으로 그립니다. block 경계선은 vLLM이 2칸(16 token)마다, TRT가 4칸(32 token)마다입니다. SGLang은 경계가 없고, llama.cpp 행은 slot 2개(같은 slot / 다른 slot)로 나눕니다.
- 장면:
  1. 첫 요청이 125칸을 씁니다.
  2. vLLM: 꽉 찬 block 62개(124칸, 992)가 적중하고 마지막 1칸(8 token)은 빨강 재계산입니다.
  3. TRT: block 31개가 적중하고, 마지막 부분 block의 8 token을 복사 화살표로 이어 써서 1,000이 됩니다.
  4. SGLang: token 단위 radix라 125칸 전부 적중합니다.
  5. llama.cpp: 같은 slot이면 1,000, 다른 slot이면 그 slot에 남은 기록과만 비교합니다.
- 셀 수 있는 것: 125칸, 경계선 수(62/31), 재계산 칸 1.
- 보조:
  - `OverlapStepViz`(`#overlap`)는 CPU·GPU 2레인 타임라인 step 1~4를 그립니다. 직렬 실행의 GPU 빈칸과 겹친 실행을 대비하고, step k의 결과를 step k+1에서 읽는 화살표와 끝 token 뒤 1 token 추가 계산을 보여 줍니다.
  - `InferenceEngineDesignAxesViz`(P2)에는 "19→500 token 성장 중 칸 부족 → 마지막 11개가 대기열로 이동" 장면을 연속으로 추가합니다.

**5. 우선순위: P1**

---

## hybrid-kv-cache-allocation

**1. 핵심 메커니즘**
- M1. local layer가 최근 1,024개만 읽는데 왜 physical 메모리는 저절로 줄지 않는가? visibility와 allocation은 다르다. (`#overview`, `#kv-cache`)
- M2. global 2층·local 6층의 보존 길이를 합하면 왜 회수할 때는 14,336이고 회수하지 않을 때는 32,768인가? (`#overview`)
- M3. T가 커질 때 local 항 min(T,W)는 왜 포화하고 global 항만 계속 자라는가? (`#kv-cache`)

**2. 기존 Viz**
- `HybridKvCaseViz.tsx` · **C** · 숫자 카드 2장을 대비할 뿐입니다(정지).
- `hybrid-attention-serving/viz/AttentionPatternViz.tsx` · **C** · L/G 칩 나열입니다(정지).
- `hybrid-attention-serving/viz/KVCapacityViz.tsx` · **C** · 비율 막대 하나와 숫자입니다.

**3. 커버 여부**: M1 C · M2 C · M3 C

**4. 새 Viz 설계안: `WindowReclaimViz` → `#overview`**
- 구조: 8행(G1·G2, L1~L6) × 16열을 두고 1열=256 token block, T는 최대 4,096입니다. L행에는 마지막 4열(1,024)을 덮는 읽기 창 괄호를 씌우고, 오른쪽에 free pool 트레이를 둡니다.
- 장면:
  1. T=1,024: 모든 행이 4칸이고 창이 전부를 덮습니다. 8×1,024=8,192입니다.
  2. T=2,048·회수 OFF: L행 앞 4칸이 "안 읽음·보유"로 흐려집니다. 합은 16,384입니다.
  3. T=4,096·회수 OFF: 128칸, 32,768입니다.
  4. 같은 T에서 회수 ON: L행마다 창 밖 12칸이 트레이로 미끄러집니다(6×12=72칸 반환). 2×16+6×4=56칸, 14,336입니다.
  5. (선택) T=8,192: G행만 늘고 L행은 4칸 그대로입니다. 2×8,192+6×1,024=22,528이 되어 포화를 보여 줍니다.
- 셀 수 있는 것: 행별 칸 수 × 256, 반환 72칸.

**5. 우선순위: P1**

---

## sliding-window-kv-and-attention-sinks

**1. 핵심 메커니즘**
- M1. 창 밖 token이 생겨도 block은 언제 돌려주는가? n−W+1을 block 단위로 내린다. W=8·block 4에서 n=12면 1개, n=20이면 3개다. (`#small-case`, `#trace`)
- M2. 고리 버퍼는 왜 처음 token 0·1부터 덮고, sink 4칸을 고정하면 [0,1,2,3,6,7,8,9]가 남는가? (`#ring-buffer`)
- M3. 처음 token을 지우면 왜 attention 분포가 무너지는가? softmax 합이 1이라 sink 항이 남는 무게를 받기 때문이다. (`#why-sink`, `#names`)

**2. 기존 Viz**
- `WindowBlockReleaseViz.tsx` · **A** · 20칸·5 block 격자가 n=7/12/20에서 반환 block으로 바뀌는 것을 셀 수 있습니다. 마지막 gpt-oss 장면만 막대 2개짜리 장부입니다.
- `SinkRingViz.tsx` · **A** · slot 8칸의 내용이 장면마다 바뀌고, 덮인 칸과 cache 안 위치 번호를 셀 수 있습니다.

**3. 커버 여부**: M1 A · M2 A · M3 —(ExplainedFormula뿐)

**4. 새 Viz 설계안: `SinkMassViz` → `#names`**
- 구조: 창 안 token 4열과 value가 없는 sink 1열을 둡니다. 각 열을 100칸 세로 격자로 그려 무게를 0.01 단위로 셀 수 있게 하고, 합 1 괄호를 씌웁니다.
- 장면:
  1. 점수가 모두 0이고 sink가 없으면 각 25칸, 합 100칸입니다.
  2. sink b=2(e²=7.39)를 더하면 token 열이 각 약 9칸(0.088)으로 줄고 sink 열이 65칸을 받습니다. token 합은 35칸입니다.
  3. StreamingLLM: sink 자리를 실제 token 0~3(value 있음)이 맡습니다.
  4. sink를 지운 창 전용 cache: 남는 무게가 창 token에 강제로 다시 나뉩니다. 캡션에 PPL 5,158.07과 4+1020의 5.40을 적습니다.
- 셀 수 있는 것: 열 5개, 무게 칸.
- 보조: `WindowBlockReleaseViz`에 TRT 기준(W + tokensPerBlock, 128~159 진동) 장면을 추가할 수 있습니다.

**5. 우선순위: P3**(핵심 둘은 A이고 M3만 보강)

---

## llm-serving-capacity

**1. 핵심 메커니즘**
- M1. 남은 VRAM 바이트가 어떻게 token slot이 되고(10GiB ÷ 256KiB = 40,960), 그것이 다시 max-length 요청 몇 개분이 되는가? (`#capacity`)
- M2. startup log의 cache token ÷ 65,536이 Gemma(88,824 → 1.36)·Muse(352,736 → 5.38)에서는 맞는데, 왜 Qwen(97,216 → 1.48인데 보고값 5.17)에서는 어긋나는가? (`#overview`, `#capacity-logs`)
- M3. max_model_len을 줄이거나 실제 길이 분포(p50 4k·p95 24k)로 admission하면 왜 받는 수가 늘어나는가? (`#capacity-admission`)

**2. 기존 Viz**
- `hybrid-attention-serving/viz/VllmCapacityLogViz.tsx` · **C** · 숫자 카드 3장입니다.
- `Capacity.tsx` 안의 `serving-memory-budget` 블록 · **C** · 예산 카드 5장과 식 한 줄입니다.
- `Deployment.tsx` 안의 `airgap-deployment-checklist` · **C** · 체크리스트 카드 5장으로, 주변 개념입니다.

**3. 커버 여부**: M1 C · M2 C · M3 —

**4. 새 Viz 설계안: `PoolToRequestViz` → `#capacity`**
- 구조: token slot 띠를 1칸=4,096 token으로 그리고, 요청 블록 하나(65,536)는 16칸 테두리로 표시합니다.
- 장면:
  1. 10GiB ÷ 256KiB = 40,960 token, 곧 10칸입니다(바이트를 slot으로 바꾸는 단계).
  2. Gemma 88,824 → 21.7칸. 16칸 요청 1개와 나머지 5.7칸이라 1.36입니다.
  3. Muse 352,736 → 86.1칸. 요청 5개와 0.38이라 5.38입니다.
  4. Qwen 97,216 → 23.7칸이라 직접 나누면 1.48입니다. 그런데 로그대로 5.17개(84.7칸)를 그리면 띠를 넘칩니다. Δ 3.69를 "단위 확인"으로 표시합니다.
  5. Gemma에서 max_model_len을 32,768(8칸)로 줄이면 2.7개, 곧 상한이 두 배가 됩니다.
  6. Muse 띠에 p50 4k(1칸)와 p95 24k(약 6칸) 요청을 채워 넣어, admission이 길이 분포로 정해진다는 것을 보여 줍니다.
- 셀 수 있는 것: 띠의 칸 수, 요청 테두리 수, 넘친 칸.

**5. 우선순위: P1**

---

## qwen36-hybrid-architecture

**1. 핵심 메커니즘**
- M1. 64층인데 왜 KV는 16층에만 생기는가? 3Δ+1ATTN을 16번 반복하기 때문이다. (`#overview`)
- M2. context가 늘 때 KV는 64KiB×T(4K 0.25GiB → 262K 16GiB)로 자라는데, Delta state는 왜 144MiB로 고정인가? (`#attention-kv`, `#kv-bytes`, `#state-bytes`)
- M3. Delta rule은 왜 새 value 전체가 아니라 오차만 고쳐 쓰는가? 감쇠 → 예측 → 오차 → 쓰기 → 읽기 순서다. (`#delta-update`)

**2. 기존 Viz**
- `HybridScheduleViz.tsx` · **B** · 4칸 블록의 강조가 이동하지만, ×16 반복과 48/16 집계는 화면에서 셀 수 없습니다. 오른쪽 메모리 그림(격자·막대)은 숫자와 연결되지 않은 장식입니다.
- `CacheStateViz.tsx` · **B** · KV 막대 수가 2·5·8·12인데 실제 비율 1:8:32:64와 맞지 않아 셀 수 없습니다. Delta 격자 40칸은 고정 장식입니다.
- `ServingPathViz.tsx` · 본문에 삽입되지 않은 고아 파일이라 감사 대상에서 뺐습니다.

**3. 커버 여부**: M1 B · M2 B · M3 —

**4. 새 Viz 설계안: `DeltaUpdateViz` → `#delta-update`**
- 구조: 2(key 방향) × 2(value 성분) state 행렬 S를 둡니다. 왼쪽에 one-hot key 벡터 k, 오른쪽에 예측 읽기 칸·실제 value 칸·오차 칸을 두고, 그 옆에 같은 step에 KV 열이 1개 늘어나는 attention 띠를 대조용으로 놓습니다.
- 장면:
  1. 이전 S: k 행의 셀이 3.333, 다른 행이 2.0입니다.
  2. 감쇠 γ=.9를 적용하면 모든 셀이 ×0.9가 되어 3.0, 1.8입니다.
  3. k로 읽으면 예측이 3입니다.
  4. 오차 5−3=2에 β=.25를 곱해 쓸 양이 .5입니다.
  5. k 행에만 +.5를 더해 3.5가 되고, 다른 행은 1.8 그대로입니다. 행렬 칸 수는 4로 변하지 않고, attention 띠만 1열 늘어납니다.
  6. 대비(단순 누적): +5를 더하면 8.0으로 과적재됩니다.
- 셀 수 있는 것: 행렬 4칸의 값, 바뀐 칸 1개, KV 열 증가 1.
- 보조(P2): `CacheStateViz`의 막대 수를 비례로 고치면 좋습니다. 1칸=4K로 두면 1·8·32·64칸입니다.

**5. 우선순위: P1**

---

## qwen36-hybrid-runtime

**1. 핵심 메커니즘**
- M1. MTP가 4개를 제안하고 2개만 승인되면, 왜 KV·Delta matrix·convolution history를 같은 경계 a에서 commit하고 rollback해야 하는가? (`#state-commit`)
- M2. 128K 1개와 32K 4개는 KV 총량(8GiB)이 같은데, 왜 메모리가 다른가? M_Δ 144MiB × N 때문이다. (`#hybrid-runtime`)
- M3. chunked prefill은 chunk 사이에서 KV와 마지막 Delta state를 어떻게 이어 붙이는가? (`#prefix-transaction`)

**2. 기존 Viz**
- `HybridRuntimeFlowViz.tsx` · **C** · 단계 카드 5장의 강조가 이동할 뿐입니다. KV 열 수(3+2×단계)는 실제 token과 무관한 장식이고, 승인 2/4와 rollback, 세 state의 경계 정렬은 그려지지 않습니다.

**3. 커버 여부**: M1 C · M2 — · M3 C

**4. 새 Viz 설계안: `SpeculativeCommitViz` → `#state-commit`**
- 구조: token 축을 따라 레인 3개를 정렬합니다. Attention KV(token당 1열), Delta S 스냅샷 칸(S_t), conv history 창입니다. 세 레인을 관통하는 generation pointer G와 draft 분기 영역(점선)을 둡니다.
- 장면:
  1. 정본 prefix t에서 세 레인이 G_t에 정렬되어 있습니다.
  2. MTP draft 4개: KV 점선 4열, S_(t+1..t+4) 점선, conv 창이 이동합니다.
  3. verify: 2개는 초록 승인, 2개는 빨강 거절입니다.
  4. commit: G가 t+2로 세 레인에서 동시에 이동하고, t+3·t+4는 세 레인 모두에서 폐기됩니다.
  5. 오류 사례: KV만 되돌리고 S가 t+4에 남으면 레인 경계가 어긋나 빨강으로 표시됩니다.
- 셀 수 있는 것: draft 4, 승인 2, 레인 3, 폐기 열 2×3.
- 보조: `RequestMemoryMixViz`(`#hybrid-runtime`)는 128K×1(KV 8GiB 블록 + Δ 144MiB 1칸)과 32K×4(2GiB 블록 4개 + Δ 4칸 = 576MiB)를 같은 눈금에서 비교합니다.

**5. 우선순위: P1**

---

## 요약

| slug | P1/P2/P3 | proposed new Viz name |
|---|---|---|
| flash-attention-io-aware-kernel | P1 | OnlineSoftmaxTileViz (`#picture`) |
| attention-kernel-anatomy-and-backends | P2 | SplitKvCombineViz (`#split-merge`) |
| tensorrt-llm-kv-cache-and-kernels | P2 | RetentionTierViz (`#retention`) |
| inference-engine-design-axes | P1 | PrefixReuseUnitViz (`#reuse`) (+ OverlapStepViz `#overlap`) |
| hybrid-kv-cache-allocation | P1 | WindowReclaimViz (`#overview`) |
| sliding-window-kv-and-attention-sinks | P3 | SinkMassViz (`#names`) |
| llm-serving-capacity | P1 | PoolToRequestViz (`#capacity`) |
| qwen36-hybrid-architecture | P1 | DeltaUpdateViz (`#delta-update`) |
| qwen36-hybrid-runtime | P1 | SpeculativeCommitViz (`#state-commit`) (+ RequestMemoryMixViz `#hybrid-runtime`) |
