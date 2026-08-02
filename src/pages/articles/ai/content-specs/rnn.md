# RNN 재구성 명세

## 소유 질문

고정 embedding sequence를 같은 transition rule로 순서대로 읽을 때, forward state·next-token loss·shared-weight gradient와 장기 credit assignment가 어떻게 하나의 계산 graph가 되는가?

## 경로 계약

- 이전 입력: Word2Vec이 만든 token embedding과 cross-entropy의 logit gradient.
- 이 글의 출력: recurrent state, masked language-model loss, BPTT Jacobian product, padding/reset/detach 실행 계약.
- 다음 글: `lstm`은 local derivative를 입력에 따라 제어하는 gated cell path를 소유하고, `lstm-timeseries`는 그 state를 causal window·forecast target·rolling validation에 배치한다.
- 최소 역사선: shared recurrence와 chain rule. Elman 이전의 automata 역사는 기본 경로 밖에 둔다.

## 비공개 전이 문제

Scalar tanh RNN과 길이 40 sequence가 주어진다. Input weight는 0.8이고 recurrent weight를 조절할 수 있다. 한 step local Jacobian의 대표 크기는 0.8 또는 1.1이며 batch 길이는 `[7,5,3]`, TBPTT chunk는 2 또는 4다.

본문을 읽은 독자는 다음 논리를 스스로 구성할 수 있어야 한다.

1. Scalar state를 순서대로 계산하고 current input과 previous memory 기여를 분리한다.
2. 모든 timestep이 같은 `W_h`를 쓸 때 `dL/dW_h`가 timestep별 기여의 합인 이유를 설명한다.
3. Input과 한 칸 이동한 target, PAD mask를 넣은 평균 next-token NLL을 구성한다.
4. 40 step에서 `0.8^40≈1.33e-4`, `1.1^40≈45.26`을 계산하고 clipping이 후자만 제한함을 판단한다.
5. Gradient plot에서 1배 기준선 아래는 vanishing, 위는 exploding으로 읽는다.
6. Chunk 2에서는 t2·t4·t6, chunk 4에서는 t4를 detach하되 state 값은 전달한다고 지정한다.
7. PAD loss, 다른 sequence로 hidden leakage, graph 미분리의 증상과 수정 위치를 구분한다.
8. 독립 문장·독립 window·하나의 연속 stream에서 hidden state를 각각 reset, zero-init, carry+detach 중 무엇으로 소유할지 판정한다.
9. Teacher-forced NLL과 free-running rollout이 다른 input prefix를 사용하므로 낮은 training loss가 recursive generation error를 막지 못함을 설명한다.

## 출처와 저자 의도

- Bengio, Simard, Frasconi 1994: 장기 기억 문제가 단순 capacity가 아니라 gradient-based credit assignment라는 분석을 복원한다.
- Pascanu et al. 2013: exploding geometry와 norm clipping의 적용 범위를 확인한다.
- CS224N RNN 자료: language-model tensor 계약과 BPTT 구현 순서를 기준으로 삼는다.

## 섹션과 Viz

### 1. Recurrence와 공유 weight

- Word2Vec의 static vector를 현재 입력으로 받는다.
- 같은 cell을 시간에 재사용하므로 shared-weight gradient는 시간별 경로의 합이다.

### 2. State update

- Scalar explorer에서 `a_t`와 `h_t`를 현재 입력·이전 state 기여로 분리한다.
- Tanh saturation이 forward boundedness와 backward attenuation을 동시에 만든다.

### 3. Language model

- Train/infer를 전환하고 shifted target, softmax temperature와 exposure 차이를 본다.
- PAD mask가 들어간 mean NLL을 명시한다.

### 4. BPTT

- Distance와 local Jacobian을 독립 조작한다.
- True signed log10 scale에서 `1×` 기준선, vanishing과 exploding 방향을 분리한다.
- Matrix product의 시간 순서를 명시한다.

### 5. 실행 계약

- `[7,5,3]` batch의 모든 detach boundary를 표시한다.
- Padding mask, hidden reset, graph detach를 다른 연산으로 유지한다.
- `rnn → lstm-timeseries` handoff에서는 token prefix를 causal look-back window로, next token을 forecast horizon target으로 바꾸되 state ownership과 teacher-forcing mismatch는 그대로 남는다는 점을 명시한다.

## 검증

- 390·1440px에서 formula scale 0.8 이상, inner scroll·clipping 없음.
- Recurrent weight, timestep, train/infer, temperature, gradient distance/Jacobian, TBPTT chunk를 실제로 전환한다.
- Plot의 화면 방향과 수치 regime이 일치한다.
- Raw LaTeX와 비한글 FormulaNote가 없다.
