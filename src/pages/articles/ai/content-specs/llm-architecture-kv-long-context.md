# KV Cache와 Long Context 재구성 명세

## 소유 질문

모델 카드의 `128K`, `1M context` 숫자를 보았을 때, 실제 GPU 메모리와 attention 경로를 config만으로 어떻게 계산하고 그 숫자가 보장하지 않는 retrieval 품질을 어떻게 구분하는가?

## 경로 계약

- 현재 입력: 2026 모델의 256K~1M context, compressed attention, local/global cadence.
- 앞에서 가져올 것: Dense decoder의 Q/K/V projection, Q head와 KV head, residual block.
- 이 글의 출력: prefill/decode 분리, batch-aware KV byte, MHA/GQA/MLA 저장 계약, mixed local/global cache, direct visibility와 inherited reachability.
- 다음 필수 경로: Sparse MoE에서 attention cache와 FFN capacity를 독립 축으로 다시 결합한다.
- 최소 역사선: GQA 원 논문, Mistral 7B, DeepSeek-V2 MLA, Gemma 3. Transformer 이전 sequence model 역사는 내려가지 않는다.

## 비공개 전이 문제

모델 A는 `B=2`, `L=62`, `Hq=32`, `Hkv=16`, `dh=128`, bf16을 사용한다. 52개 local layer는 `w=1024`, 10개 global layer는 전체 `N=32768`을 본다. 별도 모델 B는 DeepSeek-V2의 60개 layer, query head 128개, head dimension 128, MLA `dc=512`, `dr=64`를 사용한다. 같은 폭 비교를 위한 반사실적 GQA 기준선만 KV head 8개로 둔다.

본문을 읽은 독자는 다음을 해결할 수 있어야 한다.

1. 모델 A의 모든 layer가 full attention이면 KV cache가 `31.00 GiB`임을 계산한다.
2. Mixed cache는 `2BHkv dh b(GN + S min(N,w)) = 5.81 GiB`, full 대비 절감률은 `81.25%`임을 계산한다.
3. GQA share가 `Hq/Hkv=2:1`임을 설명한다. Query projection까지 절반으로 줄었다고 말하지 않는다.
4. Full causal prefill pair-layer 수 `33.29B`와 mixed pair-layer 수 `7.09B`를 계산해 `78.71%` 감소를 확인한다.
5. 다음 token 한 개를 decode할 때 읽는 위치-layer 수가 full `2,031,616`, mixed `380,928`임을 계산한다. Prefill의 삼각형 계산과 decode의 한 행 계산을 구분한다.
6. Toy sequence `N=24`, local window 4에서 layer 7이 직접 보는 token은 4개지만, layer 6이 global이면 입력 표현을 통해 도달 가능한 prefix는 24개임을 설명한다. 도달 가능성이 정확한 retrieval 보증은 아님을 지적한다.
7. 모델 B에서 32K context, batch 2의 MHA/GQA/MLA cache가 각각 `240.00`, `15.00`, `4.22 GiB`임을 계산한다. MLA는 head sharing ratio가 아니라 `dc+dr` 저장 폭으로 설명한다.
8. DeepSeek-V2 MLA에서 content K/V up projection이 inference matrix에 흡수될 수 있지만 decoupled RoPE key는 cache에 남는 이유를 설명한다.

## 출처와 저자 의도

| 근거 | 복원할 의도 | 사용 범위 |
|---|---|---|
| Ainslie et al. 2023 GQA | MHA와 MQA 사이의 KV head 수·quality·decode speed 절충 | head sharing과 cache 식 |
| Jiang et al. 2023 Mistral 7B | GQA와 sliding-window로 decode memory traffic과 attention 범위 축소 | SWA 기준점 |
| DeepSeek-V2 2024 | low-rank KV joint compression과 decoupled RoPE로 cache width 교체 | MLA 저장·복원·흡수 경계 |
| Gemma 3 Technical Report 2025 | 5 local : 1 global, 1024 window로 long-context KV memory를 낮춤 | mixed cache와 cadence |
| 2026 official model reports | compressed/local attention을 다른 축과 재결합 | 현재 목표, 세부 성능 일반화 금지 |

## 본문 구조

1. 현재 모델의 context 상한이 답하지 못하는 두 질문: 얼마를 저장하는가, 누구를 직접 보는가.
2. Prefill은 causal triangle을 한 번 만들고 decode는 매 token마다 cache 한 행을 읽는다는 실행 순서.
3. MHA→GQA→MLA: head 수를 줄이는 방법과 저장 표현 폭을 바꾸는 방법의 차이.
4. Sliding/global: local cache의 lifetime, global cache의 선형 성장, 직접 가시 범위와 간접 전달의 차이.
5. GQA→Mistral→DeepSeek-V2→Gemma 3 최소 계보.
6. 2026 current recombination, 전이 체크, Sparse MoE로 handoff.

## Viz 계약

### Cache layout lab

- MHA/GQA/MLA segmented control, batch 1~4, context 4K/32K/128K.
- 고정 비교 config는 DeepSeek-V2와 같은 60 layer, 128 query heads, head dimension 128, MLA `dc=512`, `dr=64`, fp16이다. GQA KV head 8개는 같은 폭에서 차이를 보기 위한 비교 기준이지 DeepSeek-V2 config라고 주장하지 않는다.
- 선택 방식의 per-token width, total cache, MHA 대비 절감률, 저장 객체, decode 경로를 보여 준다.
- MLA에 GQA sharing ratio를 표시하지 않는다.

### Local/global lab

- Gemma 3 27B형 설명용 config: 52 local, 10 global, 16 KV heads, head dimension 128, window 1024, bf16.
- Context와 window를 조작해 full/mixed KV, prefill pair-layer, decode read-position, 절감률을 계산한다.
- 24-token toy strip에서 selected depth의 direct visible token과 inherited reachable token을 다른 색/명도로 표시한다.
- Global layer 이전, 해당 layer, 이후 local layer 상태를 모두 실행한다.

## 수식 계약

- Display equation은 batch-aware KV, full/local prefill pairs, GQA ratio, MLA compression/cache, mixed cache, SWA direct set/receptive reach를 분리한다.
- 모든 display equation은 한국어 underbrace와 바로 뒤 FormulaNote를 가진다.
- 긴 식은 font 축소 대신 aligned row 또는 보조 항으로 나눈다.
- `context length support`, `direct attention`, `reachable path`, `retrieval accuracy`를 같은 의미로 쓰지 않는다.

## 검증 계약

- 390·768·1440px에서 document/formula/Viz overflow 0, 실제 KaTeX 내부 font 12px 이상.
- article table 0, core lineage chapter 4개, cache lab 1개, local/global lab 1개.
- FormulaNote 수가 display equation 수와 같다.
- 기본 numeric oracle `240.00/15.00/4.22 GiB`, `31.00→5.81 GiB`, `81.25%`, `33.29B→7.09B`, `2,031,616→380,928`.
- Batch 1, context 128K, window 4096, depth 4/6/7의 non-default state를 실행한다.
- Source figure tab, image natural width, fullscreen, primary source links, Dense 이전 링크와 Sparse MoE 다음 링크를 확인한다.
- Claude 검토는 context-manager를 통해서만 요청하고 provider 실패도 collaboration trace에 기록한다.
