# RNN에서 LSTM 시계열로 이어지는 재구성 명세

## 소유 질문

RNN의 recurrent state와 BPTT gradient 문제를 LSTM의 gated cell path로 바꾼 뒤, 그 state를 causal time-series window와 forecast target에 배치하고 누출 없는 rolling validation으로 어떻게 검증하는가?

## 글 사이의 책임 경계

- `rnn`: shared recurrence, hidden-state update, teacher-forced next-token likelihood, ordered BPTT Jacobian product와 reset·detach를 소유한다.
- `lstm`: fused gate, cell/hidden update, direct forget-product와 original/modern LSTM의 구조 계보를 깊게 소유한다.
- `lstm-timeseries`: 필요한 gate 산술만 복습하고 state ownership, look-back/target, covariate availability, leakage, direct/recursive horizon과 rolling-origin validation을 소유한다.
- `paper-long-term-dependencies-1994`: 장기 dependency가 capacity뿐 아니라 gradient optimization 문제라는 1차 근거다.
- `paper-lstm-1997`: constant error carousel과 input/output gate의 원 설계 근거다. 현대 forget-gate 식 전체를 1997년 증거로 돌리지 않는다.

## Hard transfer problems

본문만 읽은 독자는 다음 네 묶음을 외부 힌트 없이 진단해야 한다.

### 1. Hidden-state ownership

길이 24의 overlapping window를 한 sensor에서 만들고 dataloader가 window 순서를 shuffle한다. 별도 실험은 같은 sensor stream을 길이 24 chunk로 시간순 처리한다.

1. Shuffled independent window는 `(h_0,c_0)=(0,0)`으로 시작해야 한다.
2. 연속 chunk는 이전 끝 state value를 이어 받되 `detach`해야 한다.
3. Sensor ID, episode 또는 긴 missing gap이 바뀌면 state를 reset해야 한다.
4. Reset은 state value의 소유권을 끊고, detach는 이전 computation graph의 gradient만 끊는다는 차이를 설명한다.
5. Overlapping window 사이에 state를 carry하면 같은 history를 두 번 압축하고 batch order가 prediction을 바꾸는 증상을 찾는다.

### 2. Gradient path

Dependency span은 40 step이다. Vanilla RNN local Jacobian의 대표 크기는 `0.8`, LSTM direct cell path의 일정한 forget gate는 `0.95`다.

1. Vanilla 경로 `0.8^40≈1.33e-4`와 LSTM direct 경로 `0.95^40≈0.1285`를 비교한다.
2. LSTM 식은 gate output을 고정한 direct derivative이며 total derivative에는 hidden을 거쳐 gate로 돌아오는 우회 경로가 있음을 명시한다.
3. Gradient clipping은 exploding norm을 제한하지만 이미 사라진 `0.8^40` 신호를 복원하지 못한다고 판정한다.
4. Gate 평균 하나는 causal memory 사용의 증거가 아니므로 forget product, candidate write, cell intervention과 horizon별 성능을 함께 요구한다.

### 3. Window leakage

Look-back `T=24`, horizon `H=6`, validation origin `o=100`이다.

1. Input timestamp는 모두 `≤100`, target timestamp는 `101…106`이어야 한다.
2. Raw timeline을 target/origin 기준으로 나누기 전에 모든 overlapping window를 만든 뒤 random split하면 거의 같은 history와 target neighborhood가 양쪽에 섞임을 찾는다.
3. 전체 timeline에 scaler·imputer를 fit하면 validation 이후 분포와 missing pattern이 training transform에 들어감을 찾는다.
4. Centered rolling mean과 `shift(-1)` feature는 이름이 과거형이어도 미래 값을 읽는다는 점을 timestamp lineage로 검출한다.
5. Calendar와 확정된 tariff는 known-future일 수 있지만 미래 측정 온도는 forecast 시점에 관측되지 않으므로 별도 forecast나 exclusion이 필요하다고 판정한다.
6. Validation target 이전의 train history를 context로 쓰는 것 자체는 causal하며, 금지할 것은 origin 이후 정보와 target contamination임을 구분한다.

### 4. Recursive forecast error

One-step decoder는 training에서 직전 정답을 입력해 MAE `1.0`을 얻지만 serving에서는 자기 예측을 6번 재입력한다. Local sensitivity `∂F/∂u=1.2`, 첫 local error가 `1`인 단순화 사례를 쓴다.

1. Teacher forcing input `y_{o+h-1}`와 serving input `ŷ_{o+h-1}`를 구분한다.
2. 이전 error가 `1.2`배로 전달되면 horizon이 길수록 rollout error가 누적될 수 있음을 계산한다.
3. Direct `[B,H]` head에는 자기 예측 재입력 경로가 없지만 horizon별 joint error가 사라지는 것은 아니라고 설명한다.
4. 두 모델을 동일 rolling origins와 horizon별 metric으로 비교하고 seasonal-naive보다 나쁜 경우 LSTM을 채택하지 않는다.

## 본문 구조

### 1. RNN에서 gated memory로

- `rnn`의 hidden recurrence와 ordered Jacobian product를 먼저 링크한다.
- 1994 gradient 분석, 1997 CEC와 2000 forget gate의 역사선을 분리한다.
- LSTM도 forget product가 작으면 기억이 사라지는 조건부 개선임을 명시한다.

### 2. Gate 산술

- Forget·input·candidate·output의 한 step 산술과 `C_t`, `h_t`를 분리한다.
- Core `lstm` 글과 중복되는 fused tensor·variant 설명은 handoff로 보내고 여기서는 forecasting에 필요한 state contract만 유지한다.

### 3. Forecast sample과 state

- `X_o=[z_{o-T+1},…,z_o]`, `Y_o=[y_{o+1},…,y_{o+H}]`로 origin 경계를 표시한다.
- Independent window zero-init과 continuous chunk carry+detach를 별도 식으로 둔다.
- Padding final state와 마지막 valid timestep을 구분한다.

### 4. Leakage와 rollout

- Split-before-window, fold-local transform, feature availability를 timestamp 기준으로 검사한다.
- Direct multi-horizon과 recursive decoder, teacher forcing과 serving input을 분리한다.
- Recursive error recurrence를 FormulaNote로 해석한다.

### 5. Rolling validation과 선택

- Transform과 model을 각 origin 과거에서만 fit한다.
- Origin·horizon별 error, seed, latency와 seasonal-naive·ARIMA를 같은 protocol로 비교한다.
- Gate·gradient 진단과 forecast evidence를 다른 artifact로 유지한다.

## 수식 계약

- 모든 display 수식은 `String.raw` template literal을 사용한다.
- 수행 연산은 한국어 `\underbrace{...}_{\text{...}}`로 표시한다.
- 모든 display 수식 바로 뒤에 `FormulaNote`가 meaning과 symbols를 설명한다.
- Direct cell derivative와 total derivative, teacher-forced loss와 rollout metric의 범위를 식 안과 설명에서 함께 제한한다.

## 검증

- Focused ESLint: `rnn/Rebuilt.tsx`와 `lstm-timeseries`의 non-Viz article files.
- KaTeX strict rendering: 수정한 display `String.raw` 식 전체.
- TypeScript project build.
- Viz, shared curriculum과 shared learning-path 파일은 수정하지 않는다.
