# Hybrid·Linear Attention 재구성 명세

## 직접 진입 계약

- 이 글은 LLM이 모든 token의 과거 K/V 목록을 저장하는 기본 attention부터 한 문단으로 다시 세운다.
- `state`를 처음 보는 독자는 "지금까지의 목록을 고정 크기 메모로 압축한 것"으로 먼저 이해한다. recurrence·DeltaNet·kernel은 그 뒤에만 등장한다.
- 본문 첫 전문 질문보다 앞에서 이 글이 필수 본선이 아니라 KV cache 이후의 선택 분기임을 밝힌다.
- 선행 글은 링크와 함께 읽는 이유를 적는다. `KV Cache와 Long Context`는 목록형 기억의 byte 비용, `신호와 시스템·state`는 반복식이 과거를 남기는 원리를 소유한다.
- 제목만 보고 직접 들어온 독자도 `attention 목록 → state 압축 → hybrid 선택 → 메모리·검색 능력 trade-off`를 한 화면 안에서 파악할 수 있어야 한다.

## 소유 질문

`3 Gated DeltaNet : 1 full attention` 같은 현재 구조를 보았을 때, 어떤 층이 과거 token 목록을 KV cache로 보존하고 어떤 층이 고정 크기 state로 압축하는지, 그 state가 어떻게 쓰고 지우며, 학습과 decode에서 왜 서로 다른 kernel이 필요한지 설명하고 계산하는가?

## 경로 계약

- 현재 입력: Qwen3.6의 Gated DeltaNet·full attention hybrid와 FlashQLA runtime 최적화.
- 앞에서 가져올 것: Dense Transformer의 token mixer·residual 경계, KV·Long Context의 `2BLNH_kvd_hb`, Sparse MoE의 total/active parameter 분리.
- 이 글의 출력: state shape·byte, hybrid layer cadence, additive write collision, delta overwrite, global decay, recurrent decode와 chunkwise training의 차이.
- 다음 필수 경로: 실제 current model report에서 attention sparsity, state memory, MoE active path, kernel throughput을 독립 축으로 판독한다.
- 최소 역사선: Mamba/Mamba-2, DeltaNet, Gated DeltaNet, Kimi Linear, Qwen3-Next→Qwen3.6. S4 이전의 긴 SSM 역사와 모든 linear-attention 변형은 기본 경로에서 숨긴다.

## 비공개 전이 문제

교육용 48-layer decoder가 3 state layer : 1 full-attention layer를 반복한다. State layer는 `H=8`, `d_k=d_v=128`, bf16 matrix state를 head마다 하나 보존한다. Attention layer는 `H_kv=8`, `d_h=128`, bf16 K/V를 token마다 보존한다.

본문을 읽은 독자는 다음을 해결할 수 있어야 한다.

1. State layer 하나의 persistent state가 `H d_k d_v b = 256 KiB`임을 계산한다.
2. `N=32,768`에서 attention layer 하나의 KV가 `2NH_kvd_hb = 128 MiB`임을 계산한다.
3. 36 state + 12 attention layer의 persistent memory가 `9 MiB + 1,536 MiB = 1,545 MiB`이고, 48 all-attention의 `6,144 MiB`보다 `74.85%` 작음을 계산한다.
4. `N=131,072`에서는 hybrid가 `6,153 MiB`, all-attention이 `24,576 MiB`, 절감률이 `74.96%`임을 계산한다.
5. 위 계산이 실제 Qwen·Kimi 메모리의 정확한 재현이 아니라 state shape와 cache width를 고정한 교육용 장부임을 말한다. 실제 runtime에는 convolution buffer, normalization/gate state, allocator와 kernel workspace가 추가된다.
6. `S_0=0`, `k=(1,0)^T`, 첫 value `v_1=(1,0)^T`, 두 번째 value `v_2=(0,1)^T`에서 additive write는 같은 key를 읽으면 `(1,1)^T`가 되지만, `beta=1` delta update는 두 번째 write 뒤 `(0,1)^T`가 됨을 계산한다.
7. Unit key와 `beta=1`이면 `S_t k_t=v_t`가 되는 이유를 delta error와 projection으로 증명한다.
8. `alpha=0.8`인 기억이 새 write 없이 10 step 지나면 `0.8^10=0.1074`, 20 step이면 `0.0115`만 남음을 계산하고, 빠른 정리가 장기 보존 손실이기도 함을 설명한다.
9. Recurrent decode는 token 하나의 state를 갱신해 constant-size memory를 얻고, training/prefill은 recurrence를 chunk 안에서 WY·scan·matrix multiplication으로 재표현해 GPU 병렬성을 얻는다는 차이를 설명한다.
10. Hybrid block은 attention과 state update를 한 층에서 병렬 덧셈하는 식이 아니라, 대표 구현에서 `linear_attention` 또는 `full_attention` 중 하나를 layer type으로 선택한다는 것을 판별한다.

## 출처와 저자 의도

| 근거 | 복원할 의도 | 사용 범위 |
|---|---|---|
| Gu & Dao 2023 Mamba | 입력에 따라 SSM parameter를 바꿔 content selection을 만들고 hardware-aware scan을 설계 | selective state의 최소 기준점 |
| Dao & Gu 2024 Mamba-2/SSD | scalar-identity SSM과 semiseparable masked attention의 dual form, recurrent·quadratic·block 알고리즘 | state와 attention을 같은 것으로 뭉개지 않고 실행 형태를 연결 |
| Yang et al. 2024 DeltaNet | delta rule의 targeted erase/write와 WY chunkwise parallelization | 덮어쓰기와 training kernel의 기준 |
| Yang et al. 2024 Gated DeltaNet | scalar decay와 delta rule의 상보성, hybrid 실험 | 전체 state 정리와 key 방향 수정의 분리 |
| Moonshot AI 2025 Kimi Linear | channel-wise KDA gate, 3:1 KDA/MLA, 공개 kernel과 1M-context 비교 | production-sized hybrid의 공개 기준, 저자 측정값은 범위 제한 |
| Qwen Team 2025–2026 | Qwen3-Next의 3:1 GDN/attention, Qwen3.5·3.6 계승, FlashQLA kernel | 현재 목표와 runtime 증거 |
| Preconditioned DeltaNet 2026 | recurrence를 online least squares로 해석하고 curvature/preconditioner 축을 추가 | 최신 연구 방향, production 배치 사실로 사용 금지 |

## 본문 구조

1. Qwen3.6 current target을 attention·state·MoE·runtime 네 축으로 분해한다.
2. 3:1 cadence를 펼치고 KV cache와 matrix state의 byte를 같은 장부에서 계산한다.
3. SSM recurrence를 unroll해 sequence matrix와 recurrent state가 같은 linear operator의 두 실행 관점일 수 있음을 보인다.
4. Additive fast weight의 collision을 숫자로 재현하고 delta rule의 error-correction으로 같은 key를 덮어쓴다.
5. Gated DeltaNet의 scalar decay와 KDA의 channel-wise decay가 무엇을 더 제어하는지 분리한다.
6. Decode recurrence와 training/prefill chunk kernel의 실행 순서를 비교한다.
7. 다섯 번의 설계 전환으로 최소 계보를 닫고 현재 보고서를 다시 읽는 질문으로 끝낸다.

## Viz 계약

### State memory ledger

- 48 all-attention과 36 state + 12 attention preset을 비교한다.
- `32K`와 `128K` context를 segmented control로 전환한다.
- 48칸 layer cadence를 `S,S,S,A` 색과 legend로 보여 준다.
- State bytes, attention KV bytes, hybrid total, all-attention total, reduction을 별도 metric으로 노출한다.
- State와 attention의 막대는 면적·두께가 아니라 동일 높이에서 로그 눈금 또는 명시적 byte label로 비교한다.
- 교육용 shape 고정과 실제 runtime의 추가 state를 명확히 표시한다.

### Delta overwrite lab

- Additive와 Delta를 전환한다.
- 첫 write와 같은 key에 대한 rewrite를 stepper로 실행한다.
- 2×2 state를 cell grid로 표시하고 read 결과를 vector로 연결한다.
- Additive의 `(1,1)` collision과 Delta의 `(0,1)` overwrite를 data attribute oracle로 노출한다.
- Forget gate는 1, 10, 20 step retention으로 보여 주고 `alpha=0.8`의 `10.74%`, `1.15%`를 노출한다.

### Execution-form explorer

- Recurrent decode와 chunkwise training을 전환한다.
- Decode는 `state → token → update → next token` 순차 dependency를, training은 `chunk local transform → boundary state → matrix output`을 보여 준다.
- “완전 병렬”이라고 쓰지 않는다. Chunk 내부 보조량 계산과 chunk 경계 recurrence를 분리한다.

## 수식 계약

- KV byte, state byte, hybrid sum, SSM recurrence/unroll, additive write/read, delta error/update, exact overwrite, gated delta, retention, chunk boundary, KDA channel decay를 분리한다.
- 모든 display equation은 한국어 underbrace와 바로 뒤 FormulaNote를 가진다.
- `state size`, `training activation memory`, `KV cache`, `FLOPs`, `throughput`을 같은 의미로 쓰지 않는다.
- Mamba의 SSM state와 DeltaNet의 associative matrix state가 모두 fixed-size라고 해서 같은 update rule이라고 말하지 않는다.
- Kimi 논문의 state orientation이 본문의 `d_v×d_k` convention과 전치 관계임을 밝힌다.

## 검증 계약

- 390·768·1440px에서 document/formula/Viz overflow 0, 실제 KaTeX 내부 font 12px 이상.
- article table 0, core lineage chapter 5개, memory lab·delta lab·execution explorer 각 1개.
- FormulaNote 수가 display equation 14개와 같다.
- Numeric oracle `256 KiB`, `128 MiB`, `1,545 MiB`, `6,144 MiB`, `74.85%`, `6,153 MiB`, `24,576 MiB`, `74.96%`, additive `(1,1)`, delta `(0,1)`, retention `10.74%`, `1.15%`.
- Current target, exact cadence, previous KV·MoE links, primary source links를 확인한다.
- Claude 검토는 context-manager로만 요청하며 provider failure도 collaboration trace에 기록한다.
