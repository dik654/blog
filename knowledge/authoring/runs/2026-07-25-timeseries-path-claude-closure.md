# Time-series path Claude closure

## 목적

시계열 글을 단순한 알고리즘 목록이 아니라 두 개의 실제 의사결정 경로로 다시 묶었다.

- 값을 예측하려는가: 문제 정의와 rolling backtest → ARIMA → LSTM
- 이상 사건을 찾으려는가: 이상 유형과 운영 계약 → 시간 feature → ECOD 분포 기준선

두 경로는 시간 순서를 다룬다는 공통점만 있을 뿐, 목표 변수와 실패 비용이 다르다.
따라서 하나의 연대기나 모델 계보로 합치지 않았다. SSM, foundation model과 world model은
현재 최소 경로의 강제 선행 지식이 아니므로 확장 분기로 남겼다.

Context Manager 응답은 첫 줄이 `[claude-code:sonnet`으로 시작하는 경우만 Claude 검토로
채택했다. 넓은 검토가 timeout이면 파일 하나 또는 시각 책임 하나로 다시 분할했다.

## 근거와 사실 경계

모델 이름을 나열하기보다, 현재 글에서 독자가 판단할 수 있어야 하는 계약을 먼저 고정했다.

- forecasting: horizon, available-at-prediction-time feature, split, rolling-origin 평가
- anomaly detection: point/contextual/collective anomaly, score와 threshold의 분리,
  연속 경보를 incident로 합치는 규칙, event recall과 false alerts/day
- ARIMA: 정상성, 차분, ACF/PACF, AICc, Ljung-Box 잔차 점검
- LSTM: 1997년 원 구조와 2000년 forget gate의 역사 구분, 게이트 기억,
  causal window와 forecasting head
- ECOD: 각 feature의 empirical tail을 결합하는 tabular distribution baseline이며,
  시간 문맥을 직접 모델링하는 detector가 아님

현재 모델 동향은 다음 1차 자료와 공식 발표로 경계를 확인했다.

- TimesFM 2.5: 200M parameters, 16K context, quantile forecast와 XReg
- Chronos-2: zero-shot univariate, multivariate, covariate-informed forecasting
- Moirai 2.0: cross-variate dependency를 직접 모델링하지 않는 independent-univariate 경계
- GIFT-Eval: 학습 누수 방지 corpus와 forecasting benchmark
- Hochreiter & Schmidhuber 1997, Gers et al. 2000
- Box-Jenkins 계열 진단, Dickey-Fuller, Hurvich-Tsai AICc, Ljung-Box

최신 모델은 “기본기를 대체하는 정답”으로 넣지 않았다. 어떤 데이터가 예측 시점에 실제로
존재하는지, 어떤 split이 누수를 막는지, baseline보다 나은지가 먼저다.

## Claude 검토 분할

초기 broad UI 요청 세 건과 통합 UI 요청 한 건은 180초 timeout으로 폐기했다.

- Forecast broad UI: timeout 180561ms
- Forecast Viz broad UI: timeout 180358ms
- LSTM broad UI: timeout 180588ms
- 전체 시계열 UI broad audit: timeout 180632ms

콘텐츠와 경로는 article 단위로 검토했다.

- 전체 경로 구조: `[claude-code:sonnet · L1 · $0.0000 · 125112ms]`, PASS
- 최신 모델 사실 경계: `[claude-code:sonnet · L1 · $0.0000 · 97414ms]`
- ARIMA: `[claude-code:sonnet · L1 · $0.0000 · 96217ms]`
- 초기 LSTM: `[claude-code:sonnet · L1 · $0.0000 · 163777ms]`
- ECOD: `[claude-code:sonnet · L1 · $0.0000 · 118724ms]`, PASS
- 시간 feature: `[claude-code:sonnet · L1 · $0.0000 · 155200ms]`, PASS

수정 후에는 더 작은 책임으로 다시 보냈다.

- LSTM 콘텐츠: `[claude-code:sonnet · L2 · $0.0000 · 81563ms]`, PASS
- 새 anomaly 글: `[claude-code:sonnet · L2 · $0.0000 · 137424ms]`, PASS
- 두 경로 연결: `[claude-code:sonnet · L1 · $0.0000 · 90002ms]`, PASS
- Forecast UI: `[claude-code:sonnet · L1 · $0.0000 · 70224ms]`, PASS
- LSTM UI: `[claude-code:sonnet · L1 · $0.0000 · 57651ms]`, PASS
- ECOD UI: `[claude-code:sonnet · L1 · $0.0000 · 64580ms]`, 모바일 축소 결함 발견
- ECOD 모바일 수정 closure:
  `[claude-code:sonnet · L1 · $0.0000 · 38883ms]`, PASS

## 확인하고 수정한 결함

1. 하나였던 시계열 목록을 forecast와 anomaly 목적 경로로 분리했다.
2. anomaly detector 선택 전에 이상 유형, score, threshold, incident와 운영 지표를
   결정하게 하는 `time-series-anomaly-detection` 글을 새로 작성했다.
3. LSTM 원 논문에 forget gate가 있었다는 잘못된 역사를 1997 원 구조와 2000 forget
   gate로 분리했다.
4. PatchTST와 DLinear를 같은 patching 계열처럼 보이게 하던 설명을 선형 baseline과
   patch Transformer로 분리했다.
5. LSTM 수식을 gate별 줄로 나누고 모든 기호에 한글 underbrace와 `FormulaNote`를
   붙였다. 390px 최소 수식 scale은 0.68에서 0.95로 올라갔다.
6. 단순 cell animation을 기억 경로, 게이트, sequence model 선택, forecast shape
   네 판단 Viz로 재구성했다.
7. Forecast 글은 horizon과 availability contract, rolling-origin 검증, 비교 가능한
   metric을 본문과 Viz가 같은 순서로 설명하도록 맞췄다.
8. ARIMA에 Dickey-Fuller, AICc, Ljung-Box 1차 출처와 학습 확인 질문을 추가했다.
9. ECOD는 `-log`의 의미, 분포 tail 기준선의 한계와 시간 feature 연결을 명시했다.
10. ECOD의 660px SVG가 390px에서 축소되며 18 unit 글자가 실제 약 9px로 보였다.
    모바일에는 12px 이상 HTML ECDF/rank/tail 도식을 별도로 제공하고, 데스크톱 SVG와
    `sm:hidden` / `hidden sm:block`으로 상호 배타적으로 렌더링했다.
11. 모든 핵심 글에 question lead, concept primer, 내부 경로 링크와 capability check를
    추가해 표를 읽고 끝나는 대신 다음 판단으로 이동하게 했다.

## 시각·수식 계약

- SVG는 geometry를 담당하고, 축소되면 읽을 수 없는 설명문은 HTML이 담당한다.
- 모바일 interactive text는 12px 미만을 허용하지 않는다.
- 수식은 가로 스크롤로 숨기지 않고 의미 단위로 줄을 나눈다.
- `\underbrace{...}_{\text{한글 설명}}`과 본문 `FormulaNote`를 함께 둔다.
- 색만으로 상태를 표현하지 않고 버튼의 현재 상태와 단계명을 텍스트로 표시한다.
- animation은 장식이 아니라 한 번에 하나의 인과관계만 보여 준다.

## 작은 모델 재실행 계약

4B worker에는 파일 하나와 책임 하나만 준다.

- 한 식의 기호·부호·한글 의미와 원 출처 확인
- 한 section의 질문 → 직관 → 수식 → 실패 조건
- 한 Viz의 390px 글자 크기·overflow·상태 전환
- 한 학습 경로의 목표 → 최소 선행 지식 연결

4B worker가 “전체 시계열을 검토”하게 하지 않는다. ARIMA 정상성, LSTM gate 역사,
anomaly threshold와 incident처럼 서로 독립된 판정으로 좁힌다.

9B reviewer에는 관련 article과 4B 결과만 주고 다음 경계를 반박하게 한다.

- 예측과 이상 탐지를 같은 점수 문제로 섞었는가
- anomaly score와 운영 threshold를 같은 것으로 썼는가
- tabular tail detector를 temporal detector로 과장했는가
- random split이나 future covariate로 누수를 만들었는가
- 최신 모델 이름이 baseline과 평가 계약을 가렸는가

최종 orchestrator는 source ledger, Claude identity header, 브라우저 측정,
Playwright assertion과 screenshot을 서로 다른 증거로 보관한다. 넓은 검토가 timeout이면
같은 요청을 반복하지 않고 article, formula, responsive Viz로 분해한다.

## 검증

- Targeted ESLint: pass
- `git diff --check`: pass
- Local Playwright: 15/15
- 다섯 article route의 horizontal overflow: 0
- Raw LaTeX: 0
- KaTeX error: 0
- 390px formula scale: Forecast 0.83, ARIMA 0.88, LSTM 0.95, anomaly 0.75,
  ECOD 0.88
- Forecast, LSTM, anomaly, ECOD interactive text: 12px 이상
- 다섯 article의 learning-flow audit issue: 모두 빈 배열
- Production build: 8,863 modules, 18.25s, pass
- 기존 large-chunk advisory만 존재하며 build failure가 아님
- 전역 `build:tsc`: 기존 저장소의 unrelated type error 29건으로 실패했고,
  현재 시계열 변경 파일은 오류 목록에 없음

## 배포

- `cm-blog.service`: active, 2026-07-25 15:39:15 KST
- Category + five article routes: HTTP 200
- Production Playwright: 15/15
- 프로덕션에서도 390/1440px overflow, KaTeX, raw LaTeX, interactive state와
  ECOD mobile HTML Viz 계약을 같은 테스트로 확인했다.
