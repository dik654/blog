# Transformer 아키텍처 재구성 명세

## 소유 질문

Recurrence를 없앤 뒤 token 순서·위치 간 정보 혼합·feature 변환·깊은 gradient path와 autoregressive runtime을 어떤 block 계약으로 다시 구성하는가?

## 경로 계약

- 이전 입력: Attention의 Q/K/V, score·mask·softmax, head split·concat.
- 이 글의 출력: residual stream, position, block shape, causal training, Pre/Post-LN, FFN, family, prefill/decode와 KV cache.
- 다음 글: 양방향 encoder와 corruption objective를 결합한 BERT.
- 최소 역사선: Vaswani et al. 2017. RNN/CNN sequence backbone의 전체 계보는 앞 글에서 닫고 반복하지 않는다.

## 비공개 전이 문제

`B=2,N=8,d_model=512,H_q=8,d_k=64,L=24`인 decoder Transformer가 있다. Runtime은 bf16, context 4096, KV head `H_kv=8` 또는 2를 사용한다.

본문을 읽은 독자는 다음을 스스로 해결할 수 있어야 한다.

1. `X [B,N,d] -> Q/K/V [B,H,N,d_k] -> score [B,H,N,N] -> concat [B,N,d]`를 계산한다.
2. Position signal이 없으면 token 순열에 맞춰 output도 같은 순열로 바뀌는 permutation equivariance를 설명한다.
3. Causal row t가 `0...t`만 읽되 dense kernel의 `N^2` score cell은 그대로인 이유를 구분한다.
4. Attention의 token mixing과 FFN의 per-token channel mixing을 shape로 구분한다.
5. Post-LN과 Pre-LN의 identity path에서 normalization 위치를 표시하고 “Pre-LN이면 항상 더 좋다”는 과장을 피한다.
6. Encoder-only, encoder-decoder, decoder-only를 Q source, KV source, mask, objective로 판별한다.
7. KV cache bytes `2BLNH_kv d_k bytes`를 계산하고 `H_q/H_kv` query group 수를 구한다.
8. Cache가 K/V projection 재계산은 없애지만 새 query가 과거 cache를 읽는 attention work와 memory bandwidth까지 없애지는 않는다고 설명한다.

## 출처와 저자 의도

| 근거 | 복원할 의도 | 범위 |
|---|---|---|
| Vaswani et al. 2017 | recurrence·convolution 없이 병렬izable attention block으로 sequence transduction | 원 Post-LN, sinusoidal PE, ReLU FFN |
| Ba et al. 2016 | batch 통계가 아니라 sample 내부 feature 통계로 recurrent/sequence representation 정규화 | LayerNorm 연산 |
| Xiong et al. 2020 | Post-LN과 Pre-LN의 초기 gradient·warmup 차이를 분석 | normalization 위치를 현대 기본값으로 과장하지 않음 |
| Ainslie et al. 2023 | MHA와 MQA 사이의 GQA로 KV head 수·quality·decode speed trade-off | runtime bridge |
| Runtime docs | cache tensor와 implementation strategy | 원 Transformer 논문의 주장과 분리 |

## 전체 범위 지도

| 항목 | 깊이 | 이 글의 책임 | 경계 |
|---|---|---|---|
| Residual stream | 깊게 | 모든 sublayer의 `[B,N,d]` interface | interpretability는 별도 글 |
| Position | 깊게 | no-position counterexample와 sinusoidal 원 설계 | RoPE는 현대 구조 글 |
| Attention block shape | 깊게 | QKV부터 residual 복귀 | score 연산 자체는 앞 글 |
| Causal mask | 깊게 | 병렬 training과 정보 누출 | sparse kernel은 효율화 글 |
| FFN·normalization | 깊게 | token/channel mixing과 Pre/Post path | SwiGLU 상세는 dense LLM 글 |
| Architecture family | 깊게 | source·mask·objective 계약 | 모델 이름 목록 금지 |
| KV cache·GQA | 깊게 | bytes·group·재사용과 남는 비용 | paged cache는 serving 글 |

## 섹션과 Viz

### 1. Residual stream
- Input ID부터 output head까지 `[B,N,d_model]`을 block interface로 유지한다.
- 앞 Attention 글을 직접 연결하고 recurrence 제거가 memory 제거가 아님을 설명한다.

### 2. Position
- Sinusoidal 채널을 위치별로 계산한다.
- 별도 counterexample에서 같은 token multiset의 순서를 바꾸고 position off/on에 따라 token signature가 달라지는지 비교한다.

### 3. Shape ledger
- B, N, H를 조작해 head dimension, score elements, QK+AV 주 MAC를 계산한다.
- Residual add 전 output width가 반드시 d_model로 돌아오는 invariant를 표시한다.

### 4. Causal mask
- 6×6 행/열 계약을 responsive square grid로 표시하며 inner scroll을 만들지 않는다.
- 선택 query row의 허용 key 수와 dense score cell 수를 함께 보여 준다.

### 5. Block 완성
- Attention/FFN, Post/Pre-LN을 독립 선택한다.
- Identity path와 transformed path를 분리한다.
- FFN은 모든 token에 같은 MLP를 독립 적용한다.

### 6. Family
- Encoder, encoder-decoder, decoder의 context·output·objective를 mode 하나씩 깊게 보여 준다.

### 7. Training과 inference
- Batch, layer, context, KV heads를 조작한다.
- Query head 32를 고정하고 MHA 32, GQA 16/8/4/2, MQA 1의 group 수와 cache bytes를 계산한다.
- Prefill의 병렬 계산과 decode의 append+read를 구분한다.

## 검증

- 390·768·1440px에서 formula scale 0.8 이상, inner scroll·clipping 없음.
- Position, order signal, shape, mask row, sublayer/norm, family, batch/layer/context/KV heads를 전환한다.
- KV cache와 group 수는 같은 H_kv에서 계산한다.
- Raw LaTeX와 비한글 FormulaNote가 없다.
