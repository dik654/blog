# Viz 개념 감사 · batch 4 (2026-10-15)

기준: `docs/viz-concept-audit/RUBRIC.md`, 기준 예시 `prefill-decode-phase-dynamics/viz/LayerPassViz.tsx`·`LayerLoopProcessViz.tsx`.
판정 대상은 글이 실제로 import해 렌더하는 Viz입니다. 디렉터리에 있지만 import되지 않은 orphan Viz는 따로 표시했습니다.

---

## qwen36-long-context-deployment

1. **핵심 메커니즘**
   - head 256차원 중 어느 64차원만 위치 회전을 받고, visual token은 그 64차원을 t·h·w 축으로 어떻게 나눠 쓰나?
   - text 30K와 visual 2K는 왜 하나의 T(≈32K) 예산을 함께 쓰나?
   - 48 GiB에서 28.75 + 16 + 0.14 = 44.89 GiB를 채우고 남은 3.11 GiB를 왜 "여유"라고 부를 수 없나?
2. **기존 Viz**
   - `viz/ContextEnvelopeViz.tsx` · **C** · profile 카드 3장과 Input→Position→Evidence 텍스트 상자만 바뀝니다. 구조가 없습니다.
   - `../model-vram-budgeting/viz/WeightVramViz.tsx`(공유) · **C** · 누적 막대 하나의 폭과 숫자 카드만 있어 셀 수 있는 칸이 없습니다.
3. **커버 여부**: partial RoPE 없음 · 예산 공유 없음 · 48 GiB floor C.
4. **새 Viz 설계안 · `PartialRopeHeadViz`** → `#partial-rope`
   - 구조: head 하나를 16×16 격자(칸 하나가 1차원, 256칸)로 그립니다. rotary 64칸(4행)과 content 192칸(12행)을 나누고, rotary 64칸 안에 temporal·height·width 구간을 둡니다. 구간 경계는 config의 mrope section 값을 쓰며, 본문에 이 값이 없으므로 확인한 뒤 채웁니다. 옆에 token 두 개(q 위치 p, k 위치 p′)를 둡니다.
   - 장면:
     1. 256칸 전부 회색으로 시작하고 "d_h = 256"을 표시합니다.
     2. ρ = 0.25를 적용하면 위쪽 4행 64칸에 색이 들어오고, 아래 192칸은 "content"로 남습니다.
     3. text token을 넣으면 64칸이 2칸씩 짝을 이뤄(32쌍) 위치 p만큼 회전 화살표를 받습니다. 192칸은 그대로입니다.
     4. visual token을 넣으면 64칸이 t·h·w 세 구간으로 나뉘고, 각 구간이 다른 좌표(frame·row·col)를 받습니다.
     5. q·k 내적을 하면 64칸만 p−p′ 상대 위치를 반영하고 192칸은 위치와 무관하게 곱해집니다. 장면 하단에 "memory 절감 0"을 둡니다.
   - 셀 숫자: 256, 64, 192, 32쌍.
   - 보조안: `#memory-profile`의 WeightVramViz는 1 GiB = 1칸인 48칸 격자로 바꿉니다(weight 28.75 · KV 16 · Δ 0.14 · 남은 3.11 점선).
5. **우선순위: P1**

---

## qwen38-flash-next-architecture

1. **핵심 메커니즘**
   - 질의 하나가 262K 문맥에서 읽을 위치를 어떻게 최대 2,051자리로 줄이나? (4토큰 블록 → 점수 → 상위 512 → 원본 K/V)
   - 블록은 네 갈래 stream(10,240차원)에서 무엇을 받아, 어느 갈래에 얼마나 되돌리나?
   - 요청 하나의 상태 중 무엇이 token을 따라 자라고(희소 12층의 K/V 24 KiB/token, indexer 3 KiB/token), 무엇이 고정인가(선형 36층 108 MiB)?
2. **기존 Viz**
   - `LayerScheduleViz.tsx` · **A** · 48칸 격자에서 36/12를 직접 셀 수 있습니다.
   - `QsaIndexViz.tsx` · **A** · 4토큰 블록 → 점수 → 선택 → 원본 K/V가 장면마다 바뀌고, 꼬리 토큰도 그렸습니다.
   - `GatedResidualViz.tsx` · **B** · 4갈래 lane과 주입 계수는 그렸습니다. 핵심인 저랭크 gate 섞기는 "10240 → 320 → 10240" 텍스트 상자뿐이고, 갈래별 가중치는 보이지 않습니다.
   - `PleNgramViz.tsx` · **B** · 해시·게이트·conv가 텍스트 상자입니다. "head마다 다른 행"이 표 안의 서로 다른 위치로 보이지 않습니다.
   - `ParamClassesViz.tsx` · **A** · 512칸 중 10칸이 켜지는 것을 셀 수 있습니다.
   - `RequestStateViz.tsx` · **C** · 3줄 누적 막대에 MiB 숫자를 붙인 장부입니다. 어느 층이 자라는지는 보이지 않습니다.
3. **커버 여부**: QSA A · gated residual B · 요청 상태 C.
4. **새 Viz 설계안 · `RequestStateLayerGridViz`** → `#request-state`
   - 구조: 행은 48층(LayerSchedule과 같은 3:1 배열)입니다. 열은 token 블록이며 한 칸이 32K token이고 최대 8열(262K)입니다. 희소 12행에는 K/V 칸(칸당 768 MiB)과 그 아래 얇은 indexer 칸(칸당 96 MiB)이 자랍니다. 선형 36행은 왼쪽 고정 칸 하나(3 MiB)만 가집니다.
   - 장면:
     1. 4K에서는 선형 36칸(=108 MiB)이 켜지고, 희소 12행에는 1/8칸 조각(K/V 96 + indexer 12 MiB)만 생깁니다.
     2. 32K에서는 희소 12행에 1열이 차서 768 + 96 MiB가 되고, 선형 칸은 그대로입니다.
     3. 262K에서는 8열이 차서 6 GiB + 0.75 GiB가 되고, 선형 칸은 여전히 그대로입니다.
     4. token 하나의 단면을 보여 줍니다. 12층 × K·V 2 × head 2 × 256 × 2 B = 24,576 B를 칸으로 분해합니다.
     5. 같은 눈금에 Qwen3.6-27B 비교 행(64 KiB/token → 16 GiB)을 겹쳐 6.9 GiB와 비교합니다.
     6. 2번 층의 짧은 상태(conv 9 token, n-gram 2 token)만 깜빡여 "작지만 이전할 때 필요"를 보여 줍니다.
   - 셀 숫자: 12/36행, 열 8개, 24 KiB·3 KiB, 108 MiB, 6 GiB·0.75 GiB.
   - 보조안: GatedResidualViz의 장면 2에 갈래별 gate 가중치 4개를 넣고 가중 평균 하나로 모이는 그림을 추가합니다. 그러면 A가 됩니다.
5. **우선순위: P1** (요청 상태가 C)

---

## model-vram-budgeting

1. **핵심 메커니즘**
   - "FP8 27B"가 왜 27 GB가 아니라 24.699B×1 B + 3.084B×2 B ≈ 28.75 GiB인가? (dtype별 원소 수)
   - hybrid에서 KV는 attention 16층에만 token 비례로 쌓이고, DeltaNet 48층 state는 request당 고정입니다. T와 R이 바뀌면 known floor는 어떻게 자라나?
   - MoE의 total(resident)과 active(token path)는 왜 다른 질문에 답하나?
2. **기존 Viz**
   - `viz/BudgetPipelineViz.tsx` · **C** · 장면마다 INPUT→OUTPUT 텍스트 카드만 바뀌는 흐름도입니다.
   - `viz/WeightVramViz.tsx` · **C** · 48 GiB 누적 막대 하나와 숫자 카드 3장입니다.
   - `viz/MoEResidencyViz.tsx` · **C** · 정적 3열 장부 카드입니다.
3. **커버 여부**: dtype 장부 C · request state 성장 C · MoE 구분 C.
4. **새 Viz 설계안 · `HybridStateGrowthViz`** → `#kv-state`
   - 구조: 왼쪽에는 64층 행(4층 묶음 16개, 묶음마다 DeltaNet 3 + Attention 1)을 둡니다. 오른쪽에는 token 열(칸 1개 = 32K token, 최대 8열)을 두고, 맨 오른쪽에 48 GiB 용량 막대(1칸 = 1 GiB, 48칸)를 둡니다.
   - 장면:
     1. weight 28.75칸이 용량 막대에 찹니다(BF16 51.75로 바꾸면 48칸을 넘쳐 빨간색).
     2. req1 32K에서는 attention 16행에만 KV 1열(2 GiB)이 생기고, DeltaNet 48행에는 고정 state 점(0.14 GiB)이 켜집니다.
     3. req1을 128K로 늘리면 attention 4열(8 GiB)이 되고 DeltaNet 점은 그대로입니다.
     4. 262K에서는 8열(16 GiB)이 되어 floor 44.89, 남은 3.11칸이 점선 "workspace 후보"가 됩니다.
     5. req2(32K)를 추가하면 KV 1열과 DeltaNet 고정 점 한 세트가 더해집니다. R이 고정항을 늘리는 것을 보여 줍니다.
   - 셀 숫자: 64 KiB/token, 16/48층, 2·8·16 GiB, 0.14, 44.89, 3.11.
   - 보조안 · `MixedDtypeTensorViz` → `#weight-estimate`: tensor 타일을 FP8 1 B/BF16 2 B 폭으로 깔아 28.75 vs 51.75 GiB를 칸으로 세게 합니다.
5. **우선순위: P1**

---

## llama-cpp-local-inference

1. **핵심 메커니즘**
   - 두 대화가 cell 배열을 공유하고 반환할 때 실제로 바뀌는 것은 무엇인가? (seq bitset, mask)
   - `-ngl 25`는 어느 층을 GPU로 보내고 몇 MB를 쓰나? (i_gpu_start = 33 − ngl)
   - Q4_K 4비트 가중치와 int8 활성값의 내적을 왜 정수 합 두 개와 블록당 몇 번의 실수 곱으로 끝낼 수 있나?
2. **기존 Viz**
   - `viz/KvCellArrayViz.tsx` · **A** · 16칸 cell에 pos와 소유 비트가 장면마다 바뀌고, mask 0/−∞까지 셀 수 있습니다.
   - `viz/LayerOffloadViz.tsx` · **A** · 34칸 층 띠의 GPU 색이 ngl에 따라 바뀌고 4,851/5,041 MB가 표시됩니다.
   - `viz/KvStreamSplitViz.tsx` · **B** · slot 칸막이와 unified를 비례 막대로 그렸습니다. 구조와 변화는 있지만 cell 단위로 셀 수 없습니다.
   - `viz/Q4KBlockViz.tsx` · **B** · byte 막대 길이 비교입니다. 256값·sub-block 8개 구조와 d·sc·q − dmin·m 복원은 그리지 않았고, 4번째 장면은 막대 3줄 장부입니다.
3. **커버 여부**: cell 배열 A · offload A · Q4_K 저장 B · integer dot 없음 · streams B.
4. **새 Viz 설계안 · `Q4KIntegerDotViz`** → `#integer-dot`
   - 구조: 4열 표를 그립니다. 1행 q = [3,0,15,7](4비트 칸), 2행 u = [1,−2,3,4](int8 칸), 3행은 곱 칸입니다. 오른쪽에는 배율 칸 d = 0.5, sc = 2, dmin = 0.25, m = 1, d8 = 0.1을 두고, 하단에 "실수 곱 횟수" 카운터를 둡니다.
   - 장면:
     1. 실수 경로: q를 [2.75, −0.25, 14.75, 6.75]로, u를 [0.1, −0.2, 0.3, 0.4]로 복원한 뒤 곱해 7.45를 얻습니다. 실수 곱 카운터가 원소마다 오릅니다.
     2. 정수 곱: q·u = 3, 0, 45, 28이 곱 행에 차고 합 76이 됩니다.
     3. Σu = 1 − 2 + 3 + 4 = 6입니다.
     4. 배율을 합 밖으로 꺼냅니다. 0.5·2·76 − 0.25·1·6 = 74.5이고, 실수 곱은 블록당 2회입니다.
     5. ×d8 0.1 = 7.45로 장면 1과 같은 답이 나옵니다. 카운터를 비교합니다(원소 수 vs 블록당 상수).
     6. 확장: 32값 q8_1 블록과 8 sub-block 단위로 같은 패턴이 반복됩니다.
   - 셀 숫자: 76, 6, 74.5, 7.45, 곱 4개.
   - 보조안: Q4KBlockViz를 256칸(16×16) 격자로 바꿔 32칸 sub-block 8개와 sc·m 칸을 보이게 합니다.
5. **우선순위: P2**

---

## expert-parallelism-moe-systems

1. **핵심 메커니즘**
   - token 37의 hidden은 왜 GPU 1과 GPU 5로 8 KiB씩 두 번 나가고, 결과 두 개가 모두 돌아와야 .25y₁₃ + .75y₄₂를 합칠 수 있나? (왕복 32 KiB)
   - 2048 token × top-2에서 GPU별 수신 개수와 remote 왕복 56 MiB는 어떻게 나오나?
   - 평균 byte가 같아도 hot expert 하나(1.75×)가 layer 완료를 1.847 → 3.232 ms로 늦추는 이유는?
2. **기존 Viz**
   - `viz/ExpertRouteCaseViz.tsx` · **C** · 정적 텍스트 상자 3개와 화살표 문자입니다.
   - `FactorStructureViz`(공용, `#mechanism`) · **C** · 곱셈 인수 카드에 장식용 칸을 붙인 정적 그림입니다.
   - `viz/ExpertParallelismMoeSystemsViz.tsx` · **orphan** · 내용은 A 수준(dispatch/compute/combine/straggler)이지만 글이 import하지 않습니다. 숫자도 4 GPU·8 expert로, 본문의 8 GPU·64 expert와 다릅니다.
3. **커버 여부**: 왕복 경로 C · 규모 바이트 C · straggler 없음(orphan에만 있음).
4. **새 Viz 설계안 · `ExpertDispatchCombineViz`** (orphan을 본문 숫자로 재작성) → `#picture` (6장면은 `#mechanism`에서 재사용 가능)
   - 구조: GPU 0~7 상자 8개를 두고, 각 상자에 expert 칸 8개(8g…8g+7, 합 64칸)를 넣습니다. GPU 0 아래에는 token 행을 두고, 상자 아래에 GPU별 수신 개수 막대와 왕복 KiB 카운터를 둡니다.
   - 장면:
     1. router: token 37이 e13·e42를 고르고 칸이 하이라이트됩니다. 13 // 8 = 1, 42 // 8 = 5입니다.
     2. dispatch: 8 KiB 복사본 2개가 GPU 1과 GPU 5로 이동하고 카운터는 16 KiB가 됩니다.
     3. 각 GPU에서 해당 expert 칸만 계산합니다.
     4. combine: 결과 2개가 돌아오고(카운터 32 KiB), 하나가 늦으면 결합 칸이 대기 상태로 남습니다.
     5. 규모 확장: 2048 token이면 GPU당 수신이 4096으로 고르고, 1/8은 local입니다. 카운터는 64 MiB, 그중 remote 56 MiB입니다.
     6. hot expert: 한 GPU의 수신이 7,168(1.75×)이 되어 계산 막대가 1.847 → 3.232 ms로 늘고, 나머지 7개 GPU는 combine에서 대기합니다.
   - 셀 숫자: 64칸, 2개 복사본, 8/16/32 KiB, 4096 vs 7168, 56 MiB.
5. **우선순위: P1**

---

## tensor-and-pipeline-parallel-inference

1. **핵심 메커니즘**
   - MLP 첫 GEMM은 column, 둘째 GEMM은 row로 자르면 왜 GeLU 앞 통신이 사라지고 layer당 all-reduce가 2번만 남나?
   - PP 4·microbatch 8에서 왜 시간의 3/11 = 27%가 빈 slot인가? (m = 32면 8.6%)
   - Ring Attention에서 KV block은 이웃으로 어떻게 돌고, 언제 c ≥ F/B로 전송이 계산 뒤에 숨나?
2. **기존 Viz**
   - `viz/TensorAndPipelineParallelInferenceViz.tsx` · **B** · GPU 2 lane, all-reduce 지점, 단계별 활성 상태가 있습니다. 하지만 A₁/A₂·B₁/B₂가 텍스트 상자라 열·행 분할이 행렬 모양으로 보이지 않고, 셀 수 있는 것이 없습니다. 텍스트 박스 흐름도에 가깝습니다.
3. **커버 여부**: TP 분할 B · PP bubble 없음 · context parallel 없음.
4. **새 Viz 설계안 · `PipelineBubbleGridViz`** → `#pipeline-parallel`
   - 구조: 행 4개(stage 0~3, 각 20 layer)와 열 11개(time slot = m + p − 1)의 격자입니다. 칸에는 microbatch 번호 1~8이 들어가고, 빈칸은 점선입니다. 하단에 빈칸 카운터를 둡니다.
   - 장면:
     1. m = 1(batch 통째)이면 4 slot 동안 한 번에 한 stage만 칠해지고 빈칸은 12/16입니다.
     2. 채우기: slot 1~3에서 대각 계단이 생기고 빈칸 6개를 셉니다.
     3. steady: slot 4~8에서 4행이 모두 바쁩니다.
     4. 비우기: slot 9~11에서 빈칸 6개가 더해집니다. 합계 12/44 = 3/11 ≈ 27%입니다.
     5. m = 32이면 열 35개로 축약 표시하고 빈칸은 3/35 ≈ 8.6%입니다.
     6. decode: token 하나가 4 stage를 직렬로 지나고 hop 3개가 붙습니다(PP 8 예시 5.2 ms × 8 ≈ 42 ms vs TP 8 약 6 ms).
   - 셀 숫자: 4행 × 11열 = 44칸, 빈칸 12, 3/11, 3/35.
   - 보조안:
     - 기존 TP Viz의 X·A₁/X·A₂를 8192 × (FFN 폭) 행렬의 열 조각 2개로, B₁/B₂를 행 조각 2개로 그리면 A가 됩니다.
     - `RingAttentionBlockViz` → `#sequence-context-parallel`
5. **우선순위: P1**

---

## parallelism-strategy-and-placement

1. **핵심 메커니즘**
   - 같은 16 GPU라도 TP 그룹이 node 경계(IB 50 GB/s)를 넘으면 무엇이 몇 번 IB를 타나? (A: 160회/token 8.4 ms, B: 1회 35 μs, C: 0)
   - 통신/계산 비율 R이 1을 넘으면 왜 overlap으로 구제되지 않나? (A: R = 3.2, o = 0.5여도 E = 38%)
   - degree를 memory → TP, node → PP, 나머지 → DP 순서로 정하는 이유는?
2. **기존 Viz**
   - `viz/ParallelismStrategyAndPlacementViz.tsx` · **A** · 2 node × 8 GPU 격자의 shard 라벨(t·s·r)이 장면마다 바뀝니다. node 경계 선 개수와 TPOT 막대로 A/B/C를 비교하고, GPU 16칸을 셀 수 있습니다. 하단 막대는 장부 성격입니다.
3. **커버 여부**: placement A · overlap/R은 막대 수치로만(부분) · 절차는 Viz 필수 아님.
4. **새 Viz 설계안(선택) · `ChunkedOverlapTimelineViz`** → `#overlap-bottleneck`
   - 구조: GEMM lane과 all-reduce lane 두 줄의 μs 시간축입니다.
   - 장면:
     1. decode 1 MB all-reduce 7 μs(α 5 + 전송 2)가 overlap 없이 붙습니다.
     2. 4 chunk로 자르면 chunk마다 α 5 μs가 다시 붙어 이득이 없습니다.
     3. prefill 33 MB는 bandwidth 영역이라 chunk 전송이 뒤 GEMM 아래로 숨습니다.
     4. 후보 A(R = 3.2): o = 0.5여도 E = 38%로, 남는 통신 막대가 계산보다 깁니다.
   - 셀 숫자: α 5 μs × chunk 수, 7 μs, 0.21/3.2, 83%/24%/38%.
   - 기존 Viz 보완: "같은 TP 8 × DP 2인데 rank를 4+4로 잘못 배치" 장면을 하나 추가하면, C가 A로 바뀌는 경고를 보여 줄 수 있습니다.
5. **우선순위: P3**

---

## cuda-graph-capture

1. **핵심 메커니즘**
   - graph 재생은 무엇을 줄이고 무엇을 남기나? (계산 4번 8 μs는 그대로, 빈 시간 6 → 2 μs, 완료 14 → 10 μs)
   - 새 입력은 왜 기록된 주소 A에 `copy_`해야 하나? (변수를 B로 바꾸면 여전히 22, A에 5를 복사하면 30, Z 참조도 덮어써짐)
   - 5토큰을 왜 8자리 기록으로 패딩하고, 33토큰이면 왜 NONE인가?
2. **기존 Viz**
   - `viz/CudaGraphTimelineViz.tsx` · **A** · 전달/계산 두 lane 블록이 장면마다 이동하고, μs 눈금에서 14/10/20을 셀 수 있습니다.
   - `viz/CaptureSizePaddingViz.tsx` · **A** · 실제 칸과 점선 패딩 칸(5→8, 17→24, 33→NONE)을 직접 셀 수 있습니다.
3. **커버 여부**: 재생 시간표 A · 고정 주소 없음 · 패딩 A.
4. **새 Viz 설계안 · `StaticAddressReplayViz`** → `#mechanics`
   - 구조: 메모리 칸 한 줄(A, t1, t2, t3, Z, 그리고 바깥의 B·보관칸)을 두고, 그 위에 graph node 4개(+1, ×2, +3, ×2)를 놓습니다. node에서 메모리로 가는 포인터 화살표는 capture 후 고정됩니다. Python 변수 `x` 라벨은 따로 떠 있습니다.
   - 장면:
     1. capture: node 4개가 A→t1→t2→t3→Z 주소를 기록하고, A = 3입니다(아직 계산 전이라 Z는 빈칸).
     2. replay → 4·8·11·22가 칸에 차고 Z = 22입니다.
     3. `x = B(5)`로 재바인딩한 뒤 replay해도 포인터는 그대로 A이므로 Z = 22입니다(변화 없음 강조).
     4. `A.copy_(5)` 후 replay → 6·12·15·30이 되어 Z = 30입니다.
     5. 이전 결과 참조 `r = Z`도 30으로 바뀝니다. 22를 남기려면 보관칸으로 복사하는 화살표가 추가로 필요합니다.
   - 셀 숫자: 포인터 4개, 3→22, 5→30, 덮어쓴 칸 수.
5. **우선순위: P1** (A Viz 2개가 있지만, 핵심인 "주소 고정" 메커니즘에 Viz가 없음)

---

## launch-overhead-and-cpu-gpu-synchronization

1. **핵심 메커니즘**
   - CPU가 값을 읽는 위치 하나가 다음 준비를 얼마나 미나? (완료 10·18·26 → 10·20·30 μs)
   - 묶어 제출(graph)해도 남는 비용은 무엇이고, CPU 제출 종료(9 μs)와 GPU 완료(15 μs)는 왜 다른가?
   - 누가 무엇을 기다리나? stream 대기(26 μs), device synchronize(50 μs), `A.wait_stream(B)`(GPU끼리 연결, CPU는 진행)는 어떻게 다른가?
   - (보조) 미완료 회 수 D = 1/2가 완료 시각을 바꾸나? (D = 1이면 7·14·21, D = 2이면 15 그대로)
2. **기존 Viz**
   - `viz/SubmissionTimelineViz.tsx` · **A** · 준비/전달/계산 lane과 4장면(미리 전달·매회 기다림·목록·목록+기다림)에서 완료 시각을 셀 수 있습니다.
   - `viz/LaunchOverheadAndCpuGpuSynchronizationViz.tsx` · **orphan** · import되지 않았고, ms 축이라 본문 숫자와 다릅니다.
3. **커버 여부**: 대기 위치 A · graph 잔여 비용 A · 대기 범위·주체 없음 · queue depth 없음.
4. **새 Viz 설계안 · `SyncScopeStreamsViz`** → `#source-scope`
   - 구조: lane 3줄(CPU, stream A, stream B)에 0~50 μs 시간축을 둡니다. event 마커와 의존 화살표를 쓰고, CPU lane의 막힌 구간은 빗금으로 표시합니다.
   - 장면:
     1. 기준: A의 마지막 계산은 26 μs, 독립 B 작업은 50 μs에 끝나고 CPU는 계속 진행합니다.
     2. A 범위 대기(`.item()` 류): CPU 빗금이 26 μs에서 해제됩니다.
     3. `torch.cuda.synchronize()`: CPU 빗금이 50 μs까지 늘어나 B 때문에 24 μs를 더 기다립니다.
     4. `A.wait_stream(B)`: B에 event 마커가 찍히고 A의 다음 작업이 50 μs 뒤로 밀리지만, CPU lane에는 빗금이 없습니다.
     5. wait_stream 호출 뒤 B에 추가한 작업은 A가 기다리지 않습니다(화살표 없음).
   - 셀 숫자: 26, 50, 24 μs, event 1개.
   - 보조안 · `InflightDepthViz` → `#queue-capacity`: graph 사례에서 D = 1(7·14·21, 제출 종료 17)과 D = 2(완료 15, 제출 종료 10)를 같은 lane에 놓습니다.
5. **우선순위: P1**

---

## 요약

| slug | 우선순위 | 제안 새 Viz |
|---|---|---|
| qwen36-long-context-deployment | P1 | PartialRopeHeadViz (`#partial-rope`) |
| qwen38-flash-next-architecture | P1 | RequestStateLayerGridViz (`#request-state`) |
| model-vram-budgeting | P1 | HybridStateGrowthViz (`#kv-state`) |
| llama-cpp-local-inference | P2 | Q4KIntegerDotViz (`#integer-dot`) |
| expert-parallelism-moe-systems | P1 | ExpertDispatchCombineViz (`#picture`, orphan 재작성) |
| tensor-and-pipeline-parallel-inference | P1 | PipelineBubbleGridViz (`#pipeline-parallel`) |
| parallelism-strategy-and-placement | P3 | (선택) ChunkedOverlapTimelineViz (`#overlap-bottleneck`) |
| cuda-graph-capture | P1 | StaticAddressReplayViz (`#mechanics`) |
| launch-overhead-and-cpu-gpu-synchronization | P1 | SyncScopeStreamsViz (`#source-scope`) |
