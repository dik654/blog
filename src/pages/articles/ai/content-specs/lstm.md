# LSTM 재구성 명세

## 소유 질문

RNN의 반복 nonlinear Jacobian을 어떤 additive cell path와 gate 계약으로 바꾸면 필요한 정보와 gradient를 더 오래 보존할 수 있는가?

## 경로 계약

- 이전 입력: RNN의 state update, BPTT product와 vanishing/exploding 진단.
- 이 글의 출력: fused gate computation, cell/hidden update, direct retention product, recurrent architecture·direction·shape 계약.
- 다음 글: LSTM encoder와 decoder가 고정 vector를 주고받는 Seq2Seq.
- 최소 역사선: 1997 constant error carousel과 이후 forget gate. 모든 RNN 변형 계보는 기본 경로 밖에 둔다.

## 비공개 전이 문제

Input size `e=128`, hidden size `h=256`, batch `B=32`, sequence `T=50`인 현대 LSTM이 있다. Gate 값은 `f=.8, i=.4, g=.6, o=.7, c_prev=1`; 별도 retention 실험은 `f=.9`와 40 step을 쓴다.

본문을 읽은 독자는 다음 논리를 스스로 구성할 수 있어야 한다.

1. Fused gate output이 `[B,T,4h]`이고 conceptual weight가 `4h×(e+h)`임을 계산한다.
2. `c=.8×1+.4×.6=1.04`, `h=.7×tanh(1.04)≈.545`를 복원한다.
3. Gate 출력을 고정한 direct cell path에서 `dc_t/dc_{t-1}=f_t`이고 여러 step은 forget product임을 설명한다.
4. `.9^40≈1.48%`, half-life `ln(.5)/ln(.9)≈6.58 step`을 계산해 “0.9면 오래 기억한다”를 정량화한다.
5. Gate histogram과 cell/hidden norm은 진단 단서이지 causal proof가 아님을 알고 candidate write·forget product·intervention을 추가한다.
6. LSTM/GRU cell 선택과 causal/bidirectional direction을 독립 선택하고 bidirectional output `[B,T,2h]`와 streaming 불가를 판단한다.

## 출처와 저자 의도

- Hochreiter & Schmidhuber 1997: constant error carousel과 input/output gate의 원 설계를 복원한다.
- Gers et al. 후속 연구: continuous stream에서 reset을 학습하기 위해 forget gate가 추가된 계보를 분리한다.
- PyTorch LSTM 계약: batch·layer·direction별 hidden/cell shape를 구현 기준으로 확인한다.

## 섹션과 Viz

### 1. RNN에서 cell path로

- RNN BPTT와 직접 연결하고 original LSTM·forget-gate LSTM의 역사선을 분리한다.

### 2. Fused gate와 산술

- 네 affine을 한 `4h` output으로 묶는 구현 shape를 제시한다.
- Cell explorer는 keep·write·add·expose 경로를 공간과 숫자로 분리한다.

### 3. Retention

- Direct cell derivative라는 조건을 식 안과 FormulaNote에 함께 둔다.
- Forget와 distance를 조작해 product와 half-life를 같은 화면에 표시한다.

### 4. Architecture 선택

- Cell type LSTM/GRU와 direction causal/bidirectional을 별도 segmented control로 둔다.
- Output·final-state shape와 streaming 가능 여부가 함께 바뀐다.

### 5. 진단과 Seq2Seq handoff

- Gate 평균, symptom, norm을 함께 보되 causal overclaim을 막는다.
- Seq2Seq로 직접 연결한다.

## 검증

- 390·1440px에서 formula scale 0.8 이상, inner scroll·clipping 없음.
- 모든 gate, previous cell, forget retention, distance, cell type, direction, diagnostic state를 전환한다.
- Formula·Viz·metric이 같은 gate 값과 shape를 사용한다.
- Raw LaTeX와 비한글 FormulaNote가 없다.
