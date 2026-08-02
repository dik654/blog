# Attention 이론 재구성 명세

## 소유 질문

현재 query가 memory의 어떤 위치를 얼마나 읽을지 결정할 때, score·mask·stable softmax·value sum과 multi-head shape가 어떻게 하나의 미분 가능한 조회 연산이 되는가?

## 경로 계약

- 이전 입력: Seq2Seq의 encoder state memory와 target step별 fixed-context 병목.
- 이 글의 출력: Q/K/V 역할, score axis, pre-softmax mask, scaling, self/cross source, multi-head tensor contract.
- 다음 글: Attention을 recurrence 없는 residual block으로 쌓는 Transformer.
- 최소 역사선: Bahdanau의 additive soft alignment. Hard alignment와 전통 translation alignment의 전체 계보는 선택 source로 둔다.

## 비공개 전이 문제

`B=2,N_q=4,N_k=6,d_model=8,H=2,d_k=d_v=4`인 attention이 있다. 한 행의 score는 `[2,1,0]`이고 마지막 key는 금지된다. 별도 scaling 실험의 `d_k`는 64다.

본문을 읽은 독자는 다음 논리를 스스로 구성할 수 있어야 한다.

1. `QK^T`가 `[B,H,N_q,N_k]`이고 context가 `[B,N_q,Hd_v]`가 되는 축을 추적한다.
2. `[2,1,0]`에서 max 2를 빼도 softmax가 변하지 않음을 보이고, mask 전 softmax 뒤 단순 zeroing은 weight 합을 1보다 작게 만든다고 계산한다.
3. Independent unit-variance query/key component에서 `Var(q^Tk)=d_k`, 표준편차 `sqrt(d_k)=8`이고 scaling 뒤 표준편차가 1임을 유도한다.
4. Additive, dot, scaled-dot score가 모두 compatibility function이고 value aggregation 계약은 같음을 설명한다.
5. Self attention과 cross attention에서 Q/K/V source와 score 행·열의 의미를 구분한다.
6. Cross attention에 decoder causal triangle을 그대로 적용하면 안 되는 이유를 설명한다. Decoder causal mask는 target self-attention에 적용되고 cross attention은 보통 source padding만 막는다.
7. `H`가 늘 때 head width가 줄어 총 projection width와 score MAC의 주항이 유지되는 조건을 계산한다.
8. Attention weight가 value mixing coefficient이지 최종 예측의 causal explanation과 같지 않은 반례를 제시한다.

## 출처와 저자 의도

| 근거 | 복원할 의도 | 범위 |
|---|---|---|
| Bahdanau et al. 2015 | fixed vector 대신 target step별 additive soft search | cross-attention의 출발점 |
| Luong et al. 2015 | global/local 범위와 dot/general/concat compatibility 비교 | score family와 조회 범위를 분리 |
| Vaswani et al. 2017 | scaled dot-product와 multi-head를 recurrence 없는 backbone의 주 연산으로 사용 | self-attention·scaling·parallelism |
| Jain & Wallace 2019 | 매우 다른 attention 분포가 유사 output을 만들 수 있음을 실험 | weight의 인과 설명 과장 방지 |
| CS224N attention exercises | key norm, multiplicative score, head shape를 수치로 검산 | 교육용 transfer check |

## 전체 범위 지도

| 항목 | 깊이 | 이 글의 책임 | 실패 위험 |
|---|---|---|---|
| Q/K/V role separation | 깊게 | address와 payload 분리 | 세 vector를 같은 의미의 복사본으로 오해 |
| Stable softmax | 깊게 | max shift와 확률 질량 | overflow와 normalization 이유 누락 |
| Mask order | 깊게 | pre-softmax `-inf` | forbidden key가 분모에 남음 |
| `sqrt(d_k)` scaling | 깊게 | variance derivation과 numeric anchor | temperature와 같은 heuristic으로 오해 |
| Additive/dot/scaled | 깊게 | compatibility family | 역사와 architecture 전환 혼합 |
| Self/cross source | 깊게 | axis·mask contract | cross attention에 causal triangle 오용 |
| Multi-head | 깊게 | split·concat·projection·cost | head별 고정 문법 기능 과장 |
| Interpretability | 짧고 정확하게 | mixing weight와 causality 분리 | heatmap을 explanation으로 단정 |
| Efficient/linear attention | defer | 별도 효율화 경로 | 기본 exact operator 이해를 흐림 |

## 섹션과 Viz

### 1. Content-addressable memory

- Query는 찾는 조건, key는 비교 주소, value는 전달 payload다.
- Viz: Seq2Seq의 source memory를 Q → QKᵀ → mask/softmax → AV로 연결한다.

### 2. Stable softmax와 mask

- Visible data: raw score, max-shifted score, masked 여부, final weight, output vector.
- Invariant: 허용된 key의 weight 합은 1이고 masked key는 0이다.
- Counterexample: softmax 후 단순 zeroing은 합이 1이 아니며, 뒤에 renormalization을 또 해야 같은 결과를 회복한다.

### 3. Score family와 scaling

- Additive는 joint learned projection, dot은 같은 feature space의 batched matmul, scaled dot은 variance normalization을 추가한다.
- Viz 1: score family를 바꾸며 식·dimension constraint·주 연산을 함께 변경한다.
- Viz 2: `d_k=8,64,512`에서 unscaled standard deviation과 `[+sqrt(d),0,-sqrt(d)]` softmax saturation을 scaling 전후로 비교한다.

### 4. Self와 cross attention

- Shape: `Q [B,H,N_q,d_k]`, `K,V [B,H,N_k,d_k/d_v]`, score `[B,H,N_q,N_k]`.
- Viz: source 종류와 causal control을 바꾸되 cross mode에서는 target causal checkbox를 disable한다.
- Edge case: source padding mask와 target causal mask는 broadcast 축과 책임이 다르다.

### 5. Multi-head와 한계

- Head width `d_model/H`, concat `[B,N,Hd_v]`, output projection `W^O`를 계산한다.
- Viz: H 변화에 따라 head width와 score tensor 수가 바뀌지만 총 projected width가 유지되는 조건을 표시한다.
- Misconception: head 이름은 설계 예시이며 학습 후 기능이 고정되거나 서로 독립이라는 보장이 없다.
- Handoff: Transformer에서 residual·normalization·MLP·position과 결합한다.

## 검증

- 390·1440px에서 formula scale 0.8 이상, inner scroll·clipping 없음.
- Query angle·teaching temperature·mask, score family, scaling dimension, self/cross·causal, head count를 전환한다.
- Masked weight 합, scaling standard deviation, tensor shape와 비용이 동일 데이터에서 계산된다.
- Raw LaTeX와 비한글 FormulaNote가 없다.
