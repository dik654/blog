# 개념 시각화 감사 — batch 2 (2026-10-15)

기준: `RUBRIC.md`. 기준 예시는 `prefill-decode-phase-dynamics/viz/LayerPassViz.tsx`(32층×6위치 격자, 장면마다 fresh/past 칸이 바뀌고 셀 수 있음)입니다. 글 본문에 import되어 실제로 렌더링되는 Viz만 셌습니다. 폴더에 있지만 import되지 않은 파일은 "미사용"으로 따로 적었습니다.

---

## inference-optimization-layers

1. **핵심 메커니즘**
   - 관계 계산 40 ms를 두 배 빠르게 해도 왜 전체는 1.25배(100→80 ms)에 그치고, 왜 60 ms 밑으로는 내려갈 수 없는가? (Amdahl)
   - 동시에 도는 계산 80 ms와 준비 20 ms를 왜 더하지 않고 max로 보는가? 준비를 10 ms로 줄여도 왜 80 ms 그대로인가? (critical path)
   - 요청 20개가 아낀 400 request-ms와 GPU가 실제로 덜 일한 20 GPU-ms는 왜 다른 양인가?
2. **기존 Viz**
   - `OptimizationBudgetViz.tsx` · **B** · 15/40/35/10 칸을 ms 축에 두고 칸 하나만 줄이지만, 결국 막대 두 개의 길이 장부입니다. 남은 60 ms가 상한이 된다는 점만 보이고 겹침이나 의존 관계는 그리지 않습니다.
   - `InferenceOptimizationLayersViz.tsx` · 미사용(import 없음)
3. **커버 여부**: Amdahl은 B, critical path는 없음, request-ms 대 GPU-ms도 없음.
4. **새 Viz 설계안: `CriticalPathViz`** → `#overlap`
   - 구조: 가로는 ms 축(0–100)이고 세로로 레인 두 줄(계산 / 준비)을 둡니다. 오른쪽 끝에 "결과 전송" 마커를 놓고, 마커를 가장 늦게 끝난 레인 끝에 붙입니다. 마지막 장면만 레인 이름을 "메모리 읽기 / 계산"으로 바꿉니다.
   - 장면:
     1. 직렬 오해: 두 레인을 이어 붙이면 100 ms입니다.
     2. 실제 동시 시작: 계산 80 ms와 준비 20 ms를 함께 그리면 마커가 80에 섭니다.
     3. 준비 20→10: 준비 칸만 줄고 마커는 80에 그대로 있습니다.
     4. 계산 80→15로 줄인 가상 장면: 준비 20 레인이 임계 경로가 되어 마커가 20으로 옮겨 갑니다.
     5. roofline 하한: 읽기 28과 계산 7이 겹쳐 하한 28이 됩니다. 읽기를 절반으로 줄이면 14와 7이 겹쳐 하한 14가 됩니다.
   - 셀 수 있는 숫자: 80, 20, 10, max(80,20)=80, 28/7→14/7.

## vllm-paged-attention

1. **핵심 메커니즘**
   - 길이 35→38→49로 늘 때 위치 37·48은 table을 거쳐 어느 물리 block의 몇 번째 칸을 읽는가? 새 block은 언제 붙는가?
   - fork한 두 갈래가 P9에 쓰려 할 때 왜 block 하나만 복사하는가? (ref count와 CoW)
   - B가 A의 앞 32 token을 재사용할 때 parent hash 사슬은 어떻게 H₀→H₁에서 hit하고 끝 3 token에서 miss하는가?
2. **기존 Viz**
   - `BlockAddressViz.tsx` · **C** · 정지된 카드 3장(j=37, table, P9[5])입니다. 길이가 늘어나는 장면이 없습니다.
   - `FragmentationViz.tsx` · **C** · 64칸 예약과 paged 방식을 카드 칩으로 비교한 정지 그림입니다.
   - `BlockLifecycleViz.tsx` · **C** · 상태 카드 3장을 나열했습니다.
   - `ForkCopyOnWriteViz.tsx` · **A** · table 두 개와 물리 block 4개의 ref가 2→1→0으로 바뀌는 5장면이라 셀 수 있습니다.
   - `AllocationContractViz.tsx` · **C** · 단계 카드 흐름도입니다.
   - `PrefixHashViz.tsx` · **C** · 카드 3장을 나열했습니다.
   - `PrefixScopeViz.tsx` · **C** · 칩을 나열했습니다.
3. **커버 여부**: 주소 변환과 성장은 C, CoW는 A, hash 사슬 hit도 C.
4. **새 Viz 설계안: `BlockTableGrowthViz`** → `#logical-physical-address`
   - 구조: 왼쪽은 A의 block table 행(L0–L3)입니다. 오른쪽은 물리 block 열(P2·P5·P7·P9…)이고 block마다 16칸 띠를 둡니다. 채운 칸과 빈칸을 구분하고, 읽는 위치를 화살표로 표시합니다.
   - 장면:
     1. 길이 35: table [7,2,9], P9에 3칸, 빈칸 13.
     2. 위치 34를 읽음: floor 2 → P9[2].
     3. +3 token으로 길이 38: P9가 6칸이 되고 새 block은 0개.
     4. 위치 37을 읽음: P9[5].
     5. +11 token으로 길이 49: P5가 붙어 table [7,2,9,5], 빈칸 15.
     6. 위치 48을 읽음: P5[0]. 앞의 P7·P2·P9는 움직이지 않습니다.
   - 셀 수 있는 숫자: 16칸 block, 빈칸 13→10→15, 추가 block 0→1.
   - 2순위: `PrefixHashChainViz` → `#prefix-caching`. A와 B의 35 token을 16·16·3으로 나누고 H₀→H₁ hit, 끝 3 token miss, P7·P2의 ref 2를 보여 줍니다.

## serving-memory-admission-and-preemption

1. **핵심 메커니즘**
   - free 14에서 C(9 block)는 왜 받고, free 11이면 왜 기다리게 하는가? (수용 뒤 하한 3)
   - C가 10 block을 돌려줬는데 왜 재개에는 11 block이 필요한가?
   - 멈춘 C를 되살릴 때 재계산(161 token, 약 6.44 ms)과 교환(20 MiB 왕복, 약 1.678 ms)은 무엇을 다르게 쓰는가?
2. **기존 Viz**
   - `ServingMemoryAdmissionAndPreemptionViz.tsx` · **A** · 40칸 격자에 칸 주인(A/B/C)이 9→10→0→11로 바뀌는 6장면입니다. 빈칸 수를 셀 수 있습니다.
   - `LongContextPoolViz.tsx` · **C** · 27,648 block을 막대 하나로 그리고 숫자 3개만 바뀝니다.
3. **커버 여부**: 수용 하한은 A, 중단과 11 block 재개도 A, 재계산 대 교환은 없음.
4. **새 Viz 설계안: `RecomputeVsSwapViz`** → `#preemption-modes`
   - 구조: 왼쪽 열은 GPU pool 40칸(9절 끝 상태 A16·B14·C10)입니다. 가운데는 C의 token 이력 띠 161칸으로 줄였다가 펼칩니다. 오른쪽 열은 CPU swap 영역입니다. 아래 두 레인에 GPU 계산 시간과 PCIe 전송 시간을 둡니다.
   - 장면:
     1. 압박: 다음 수요 3이 free 2보다 큽니다.
     2. 재계산 경로: C의 10칸이 비고 이력 161은 그대로 남으며, 재개 때 11칸이 다시 차고 GPU 레인 6.44 ms가 켜집니다.
     3. 교환 경로: C의 10칸 20 MiB가 CPU로 이동하고 GPU 칸은 빕니다.
     4. 교환 재개: 10칸이 돌아오고 161번째 위치용 +1칸이 더 붙어 11칸이 됩니다. 왕복 40 MiB, 1.678 ms입니다.
     5. free 10에서는 두 경로 모두 재개할 수 없습니다. A가 반환해 free가 26이 되어야 재개됩니다.
   - 셀 수 있는 숫자: 10/11 block, 161 token, 20 MiB×2, 6.44 ms 대 1.678 ms.

## prefix-caching-radix-attention

1. **핵심 메커니즘**
   - R1 [1..8] 뒤에 R2 [1..6,9,10]이 오면 왜 구간을 6과 2로 쪼개고 6+2+2=10자리만 보관하는가?
   - R3 경로가 잠겨 있을 때 5자리를 요구하면 왜 4자리만 반환하는가?
   - 같은 6개 요청을 X1,Y1,X2…처럼 번갈아 실행하면 hit 0이고, 묶어서 실행하면 왜 24/48=50%가 되는가? (cache-aware 순서)
2. **기존 Viz**
   - `PrefixCachingRadixAttentionViz.tsx` · **A**(분기)·**B**(반환) · tree가 8→6+2+2→6+2+2+2로 갈라지는 3장면은 A입니다. 반환은 마지막 한 장면에서 점선으로 처리하는 데 그쳐, 잠금 ref와 leaf 순서를 따라가지 않습니다.
3. **커버 여부**: 분기와 공유는 A, 잠금 보호와 반환은 B, 실행 순서와 hit의 관계는 없음. 4자리 block에서 hit이 6→4로 깎이는 문제(`#block-hash`)도 Viz가 없습니다.
4. **새 Viz 설계안: `CacheAwareOrderViz`** → `#scheduling`
   - 구조: 위쪽은 대기열 6칸(X1–X3, Y1–Y3)입니다. 가운데는 8칸 용량의 cache 띠 하나로, 공통 6과 끝 2를 색으로 구분합니다. 아래에는 요청마다 hit 칸을 쌓는 누적 막대를 둡니다.
   - 장면:
     1. 번갈아 실행하는 순서 X1→Y1: Y1이 X의 6칸을 밀어내 hit 0이 됩니다.
     2. 같은 순서로 나머지 4개를 실행해도 hit은 계속 0, 합계 0/48입니다.
     3. 묶은 순서로 X1을 실행하면 6+2가 등록됩니다.
     4. X2와 X3은 공통 6을 재사용해 hit 6+6이 되고, 끝 2칸만 교체합니다.
     5. Y 계열로 넘어갈 때 cache를 비우고, Y2·Y3이 hit 6+6을 얻어 합계 24/48입니다.
   - 셀 수 있는 숫자: 6/2칸, hit 0 대 24, 분모 48.
   - 2순위: `PageGranularityHitViz` → `#block-hash`. 같은 R1·R2를 page 1과 B=4 칸으로 나란히 놓아 hit 6과 4, 저장 12와 16자리를 비교합니다.

## sglang-runtime-anatomy

1. **핵심 메커니즘**
   - 둘째 회에 실행 중인 A·B·C의 남은 출력 999를 ×0.7=699.3으로 셈하면 왜 D(1,201칸)가 들어오는가?
   - 칸이 모자라면 왜 출력 100개짜리 요청이 먼저 빠지고, 비율은 왜 0.098에서 0.2199로 올라가는가?
   - CPU가 결과를 한 step 늦게 읽으면 왜 step이 12→10 ms로 줄고, EOS를 낸 요청은 token 하나를 더 계산하는가?
2. **기존 Viz**
   - `SglangRuntimeAnatomyViz.tsx` · **C** · 상자 5개의 강조만 바뀌는 텍스트 흐름도입니다.
   - `AdmissionPolicyViz.tsx` · **B** · 4,096칸 막대를 요청별 written/reserved 구간으로 나누어 3/20/4개를 셀 수 있습니다. 다만 비율이 남은 출력에 곱해지는 구조(요청 행과 999→699.3)는 그리지 않은 1차원 막대입니다.
   - `RatioRetractViz.tsx` · **C** · 비율이 시간에 따라 바뀌는 선 그래프 위로 점 하나가 움직입니다. 누가 빠지는지는 보이지 않습니다.
   - `OverlapTimelineViz.tsx` · **A** · CPU/GPU 두 레인에 1+10+1 ms 칸을 놓고 36→32 ms와 X의 낭비 step을 보여 줍니다.
3. **커버 여부**: 비율 수용은 B, retract는 C, overlap은 A.
4. **새 Viz 설계안: `RetractOrderViz`** → `#retract`
   - 구조: 요청 4행이고, 각 행에 입력 200칸과 출력 칸(250/200/150/100)을 그립니다. 오른쪽에 free 칸 카운터, 아래에 대기열 슬롯을 둡니다.
   - 장면:
     1. `check_decode_mem`이 4칸을 요구하는데 free가 그보다 적습니다.
     2. 출력 내림차순으로 정렬하면 250·200·150·100 순서가 됩니다.
     3. 맨 끝의 100짜리 행이 빠지면서 300칸이 free로 반환되고, radix에는 넣지 않습니다.
     4. 남은 3행으로 (600+20×3)/(3,000+1)=0.2199를 다시 계산하고, 비율 눈금이 0.098에서 0.2199로 오릅니다.
     5. 빠진 요청이 대기열 앞에 들어가고, 재진입 때 300 token을 prefill합니다.
   - 셀 수 있는 숫자: 출력 250/200/150/100, 반환 300칸, 0.2199.
   - 2순위: `AdmissionPolicyViz`를 "요청 행 × (쓴 칸 | 예약 칸)" 격자로 바꿔 999×0.7=699.3이 행마다 줄어드는 모습을 보이면 A가 됩니다.

## vllm-spec-decode

1. **핵심 메커니즘**
   - 후보 A→B→B→A에서 왜 셋째 B의 첫 거부에서 멈추고, 넷째는 버리는가?
   - 거부된 30%를 (p−q)₊=(.3,0)으로 채우면 왜 정확히 70/30이 되고, p에서 다시 뽑으면 왜 61/39가 되는가?
   - 출력은 7자리인데 유효 KV는 왜 6자리인가?
2. **기존 Viz**
   - `SpecTraceViz.tsx` · **A** · 후보 4칸이 유지/거부/제외로 바뀌고 확정 글 3칸이 차는 5장면입니다. 다만 분포 보존은 장면 note 문장으로만 설명합니다.
   - 미사용: `RejectionResampleViz`, `SpecCycleViz`, `AcceptanceTraceViz`, `MtpAmortizationViz`, `ProposalMethodsViz`, `ServingBreakEvenViz`. 모두 ModernArticle에서 import되지 않습니다.
3. **커버 여부**: 첫 거부에서 멈추는 동작은 A, 잔여 분포 보존은 없음, 7 대 6 KV도 없음.
4. **새 Viz 설계안: `ResidualMassViz`** → `#distribution-proof`
   - 구조: 10×10 격자 = 확률 100칸이고, 열은 A·B 두 묶음입니다. 칸 색은 제안됨 / 수락 / 거부 / 보충 네 가지입니다.
   - 장면:
     1. draft q: A 40칸, B 60칸.
     2. 수락 min(p,q): A 40칸 전부, B 60칸 중 30칸.
     3. 거부 30칸이 회색으로 떨어져 나갑니다.
     4. 보충 (p−q)₊=(.3,0): 30칸이 전부 A로 가서 A 70, B 30이 됩니다.
     5. 오답 경로: 30칸을 p(.7/.3)로 다시 뽑으면 A 21, B 9가 되어 61/39로 깨집니다.
   - 셀 수 있는 숫자: 40/60, 40+30, 30, 70/30, 61/39.
   - 2순위: `KvCommitViz` → `#state-commit`. 글 4 / KV 3에서 입력 5칸을 넣고, 수락 2와 교체 1로 글이 7이 되지만 KV는 6이 되는 과정을 그립니다(logits_indices [0..4]).

## speculative-decoding-variants

1. **핵심 메커니즘**
   - 후보 [R,A,B,X,Y,X,Y] 7칸을 한 번에 계산할 때 각 칸은 왜 자기 조상만 읽는가? 같은 Y인데 Y₄와 Y₆은 왜 다른가?
   - 승인된 경로 [0,1,4]의 KV를 왜 연속 자리 4·5·6으로 옮기는가?
   - MTP는 왜 방금 고른 토큰을 다시 넣어 순차로 후보를 만들고, Medusa head는 같은 hidden에서 병렬로 만드는가?
2. **기존 Viz**
   - `TreeTraceViz.tsx` · **A** · tree 7노드에서 경로 0→1→4를 고르고, 4·5·8을 4·5·6으로 옮기는 4장면입니다.
   - `MtpCostViz.tsx` · **C** · 슬라이더 하나와 속도비 곡선입니다.
   - `MaskTable.tsx`는 표라서 Viz로 세지 않았습니다.
3. **커버 여부**: 경로 선택과 KV 정리는 A, tree mask는 없음(정지 표만 있음), MTP와 Medusa 후보 생성 차이도 없음.
4. **새 Viz 설계안: `TreeMaskViz`** → `#request-trace`
   - 구조: 왼쪽에 tree 7노드, 오른쪽에 7×7 마스크 격자(행 = 읽는 자리, 열 = 기록)를 둡니다. 행을 하나 고르면 tree에서 그 조상 경로가 함께 켜집니다.
   - 장면:
     1. 한 줄 R·A·X: 하삼각 3×3, 1이 6개.
     2. tree 7칸으로 펼침: 아직 빈 격자.
     3. A₁ 행 {0,1}, B₂ 행 {0,2}.
     4. Y₄ 행 {0,1,4}, Y₆ 행 {0,2,6}: 같은 글자지만 다른 행입니다.
     5. 전체 1의 개수 17개, 승인된 경로 행 0·1·4만 남깁니다.
   - 셀 수 있는 숫자: 7칸, 1의 개수 6 대 17, 조상 집합.
   - 2순위: `MtpChainViz` → `#mtp`. 깊이 1과 2 모듈에 (상태, 토큰 embedding)이 들어가는 사슬과 Medusa의 병렬 head를 나란히 놓고, R→A→Y를 보여 줍니다.

## multi-adapter-serving

1. **핵심 메커니즘**
   - token 4개의 adapter 번호 [0,1,0,2]를 정렬해 [0,2,3,4] 구간으로 나누면 왜 adapter 행렬을 3번만 읽는가? (SGMV)
   - 처음 보는 adapter C 요청은 어떤 순서로 들어오는가? step 한도 2에서 건너뛰고, 파일을 읽어 CPU에 등록하고, GPU 슬롯의 LRU를 내리고, 복사하는 순서입니다.
   - max_lora_rank=16 고정 슬롯에서는 rank 8 adapter가 왜 13 MiB를 비워 두고, Unified Paging에서는 그 자리가 왜 KV 208 token으로 돌아가는가?
2. **기존 Viz**
   - `AdapterLedgerViz.tsx` · **C** · 원소 수 표 다음에 byte 막대가 나오는 숫자 장부입니다.
   - `SegmentBatchViz.tsx` · **A** · token 행이 재정렬되고 개수와 시작 위치 표가 생기는 4장면이라 셀 수 있습니다.
   - `AdapterMemoryViz.tsx` · **B** · 104 MiB 막대 하나를 구간 색으로 나눈 비교입니다. 장면마다 구간은 바뀌지만, 슬롯과 page라는 실제 칸 구조는 그리지 않습니다.
   - `SoftPromptKvViz.tsx` · **C** · MiB 막대 비교입니다.
3. **커버 여부**: SGMV는 A, 두 층 적재와 수용은 없음(AlgorithmBlock만 있음), 슬롯 대 page는 B.
4. **새 Viz 설계안: `TwoTierAdapterCacheViz`** → `#loading` (또는 `#request-trace`)
   - 구조: 위에 대기열 A,B,C,A, 가운데에 GPU 슬롯 2칸(26 MiB씩), 아래에 CPU 등록 목록을 둡니다. 슬롯마다 last-used step을 표시합니다.
   - 장면:
     1. step 1(max_loras=2): A·B는 들어가고 C는 건너뛰며 마지막 A는 들어갑니다.
     2. step 2에서 C를 받습니다. 파일을 읽고 검증한 뒤 CPU에 등록해 CPU가 A·B·C가 됩니다.
     3. GPU 슬롯이 가득 차 있어 last-used가 더 오래된 쪽을 내립니다. CPU 등록은 유지합니다.
     4. 빈 슬롯에 C를 복사하고, 이번 batch의 번호 열로 구간 표를 만듭니다.
     5. 내린 adapter가 다시 오면 파일을 읽지 않고 CPU에서 복사만 합니다.
   - 셀 수 있는 숫자: 슬롯 2, 한도 2, 26 MiB, 대기열 4.

## kv-cache-fundamentals

1. **핵심 메커니즘**
   - 새 K/V 16byte를 붙여 48→64byte가 되는데, 현재 Q 16byte는 왜 남기지 않는가?
   - Q head 4개를 유지하면서 KV head를 4·2·1로 줄이면 왜 96·48·24byte가 되는가? repeat_kv의 0·0·1·1은 왜 저장량을 바꾸지 않는가?
   - MLA는 latent c(1·2·3·4)만 남기고도 왜 K/V를 펼치지 않고 (2.5, 5)를 얻는가?
2. **기존 Viz**
   - `KVCacheLifecycleViz.tsx` · **A** · 위치 × K₀V₀K₁V₁ 격자에 3→4행이 차고, 48→64byte로 바뀌는 5장면입니다.
3. **커버 여부**: append와 Q 폐기는 A, MHA/GQA/MQA head 공유는 없음, MLA 흡수도 없음.
4. **새 Viz 설계안: `KvHeadSharingViz`** → `#kv-shape-sharing`
   - 구조: 위쪽에 Q head 4칸(Q0–Q3), 아래쪽에 위치 3행 × KV head 열의 K·V 격자를 둡니다. Q와 KV head를 잇는 선을 그립니다.
   - 장면:
     1. MHA: KV head 4열, 선 4개가 1:1, 96byte.
     2. GQA: KV head 2열, Q0·Q1→KV0, Q2·Q3→KV1, 48byte.
     3. MQA: KV head 1열, 선 4개가 한 열로 모임, 24byte.
     4. GQA에서 repeat_kv: 계산용 4열(0·0·1·1)을 점선으로 펼치되, 저장 격자는 2열(64byte, 4위치)로 남습니다.
   - 셀 수 있는 숫자: 격자 칸 수(위치 × KV head × K·V × 폭 2), 96/48/24, 0·0·1·1.
   - 2순위: `MlaAbsorbViz` → `#mla-vs-gqa`. c 4칸을 비율 1/4로 먼저 평균해 2.5를 얻고 ×(1,2)로 (2.5,5)를 만드는 순서와 K/V를 펼친 뒤 합치는 순서를 나란히 보여 줍니다.

## kv-cache-quantization

1. **핵심 메커니즘**
   - FP8로 바꾸면 token당 칸 수(32층×16 head)는 그대로이고 폭만 절반이 됩니다. 왜 그래서 40 GiB에 327,680→655,360 token이 들어가는가?
   - 0.47, −1.3, 3.1, 12.0을 ÷0.02→E4M3 격자→×0.02로 왕복시키면 왜 작은 값은 0.01–0.10만 틀리고 12.0은 448에 걸려 8.96이 되는가?
   - scale을 tensor/head/32원소/채널/token 단위로 둘 때 큰 채널 5번이 다른 칸의 격자를 넓히는 범위는 어떻게 달라지는가?
2. **기존 Viz**
   - `KvByteLedgerViz.tsx` · **A** · 32×16 칸 격자가 켜지고 FP8에서 칸 폭이 절반이 됩니다. 이름은 ledger지만 실제 칸 구조를 그립니다.
   - `QuantRoundTripViz.tsx` · **C** · 숫자 표의 열이 하나씩 드러나는 장부입니다. FP8 격자 간격이나 448 상한을 구조로 그리지 않습니다.
   - `ScaleGranularityViz.tsx` · **A** · 8×8 행렬의 scale 묶음 색이 장면마다 바뀌고, 큰 채널과 같은 묶음인 칸을 셀 수 있습니다.
3. **커버 여부**: 용량 2배는 A, 왕복 오차와 포화는 C, scale 단위는 A.
4. **새 Viz 설계안: `Fp8GridSnapViz`** → `#round-trip`
   - 구조: 가로 수직선(0–600, 구간별로 스케일을 끊음)에 E4M3 격자 눈금을 둡니다. 16–32는 간격 2, 64–128은 8, 128–256은 16, 448은 붉은 상한 벽입니다. 위 띠에는 원래 x, 아래 띠에는 복원값을 놓고 값 4개의 점이 이동합니다.
   - 장면:
     1. 원래 값 4개.
     2. ÷0.02로 23.5, −65, 155, 600으로 이동.
     3. 가장 가까운 눈금으로 스냅: 24, −64, 160, 448(벽에 막힘).
     4. ×0.02 복원: 0.48, −1.28, 3.2, 8.96, 오차 막대 0.01/0.02/0.10/3.04.
     5. 12.0만 s=0.06: 200→192, 11.52, 오차 0.48.
   - 셀 수 있는 숫자: 눈금 간격 2/8/16, 상한 448, 오차 4개.

---

## 요약

| slug | 우선순위 | 제안 새 Viz (대상 절) |
|---|---|---|
| inference-optimization-layers | P1 | `CriticalPathViz` (#overlap) |
| vllm-paged-attention | P1 | `BlockTableGrowthViz` (#logical-physical-address) |
| serving-memory-admission-and-preemption | P1 | `RecomputeVsSwapViz` (#preemption-modes) |
| prefix-caching-radix-attention | P1 | `CacheAwareOrderViz` (#scheduling) |
| sglang-runtime-anatomy | P1 | `RetractOrderViz` (#retract) |
| vllm-spec-decode | P1 | `ResidualMassViz` (#distribution-proof) |
| speculative-decoding-variants | P1 | `TreeMaskViz` (#request-trace) |
| multi-adapter-serving | P1 | `TwoTierAdapterCacheViz` (#loading) |
| kv-cache-fundamentals | P1 | `KvHeadSharingViz` (#kv-shape-sharing) |
| kv-cache-quantization | P1 | `Fp8GridSnapViz` (#round-trip) |
