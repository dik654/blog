# Practical tabular static and temporal reconstruction

Date: 2026-07-24 KST

## Scope

`테이블 · 이벤트 모델링`을 하나의 긴 모델 목록이 아니라 두 개의 목표 경로로 다시 나눴다.

1. 정적 표: 데이터 감사 → 피처 계약 → 평가 계약 → 강한 tree 기준선 → neural/foundation model 승격
2. 시간축 표: 데이터 감사 → point-in-time 피처 → forward validation → event sequence 승격

이번 배치는 다음 네 글과 공용 수식·Viz 계약을 소유한다.

- `gradient-boosting`
- `tabular-deep-learning`
- `time-features`
- `sequence-modeling-tabular`

본문 설계 원장은
`src/pages/articles/ai/content-specs/practical-tabular-static-temporal.md`다.

## Why this structure

기존 구성이 모델 이름을 먼저 나열하면 독자는 XGBoost, TabNet, Transformer와 TabPFN을
고정 순위표처럼 읽게 된다. 시간 피처와 sequence model도 서로 연결되지 않아 “새 모델을
언제 추가해야 하는가”를 판단하기 어렵다.

새 구조는 먼저 배포 질문과 증거 계약을 고정한다.

- 정적 표는 동일 row·target·split·metric·budget에서 tree 기준선을 닫는다.
- Neural/foundation model은 tree가 잃은 표현 재사용, multimodal 결합 또는 prior가 필요할 때만
  같은 OOF 계약으로 승격한다.
- 시간축 표는 event time, availability time, cutoff와 label-finalization time을 먼저 분리한다.
- Event sequence는 last/count/rolling/n-gram 기준선이 잃은 order evidence가 있을 때만 추가한다.

이렇게 하면 최신 모델이 추가되어도 경로 전체를 다시 쓰지 않는다. 새 모델은 기존 승격 gate의
새 후보로 들어가고, 새로 요구하는 개념만 하단 기반에 추가한다.

## Hard transfer questions

본문을 쓰기 전에 다음 비공개 판별 문제를 만들었다. 문제 자체를 본문에 퀴즈로 싣지 않고,
현재 본문만 읽은 독자가 해결에 필요한 축을 얻는지를 역으로 검사했다.

1. 10:01에 발생하고 10:07에 도착한 사건을 10:05 prediction row에 넣을 수 있는가?
2. Squared loss residual 설명을 logistic/ranking loss의 gradient boosting으로 어떻게 일반화하는가?
3. GBDT와 PFN 후보를 model별 기본 benchmark 순위가 아니라 동일 release evidence로 비교하려면
   무엇을 고정해야 하는가?
4. Count와 mean이 같은 두 history가 다른 label을 가질 때 어떤 증거가 sequence model 승격을
   정당화하는가?
5. `[t-w,t)` rolling feature와 `[t,t+H)` label을 late arrival와 label latency까지 포함해
   어떻게 재현하는가?
6. 평균 AUROC는 올랐지만 calibration, rare slice, p95 latency가 나빠진 후보를 왜 자동
   release하면 안 되는가?

## Content reconstruction

### Gradient boosting

- Squared-loss residual을 일반 손실의 음의 functional gradient의 한 사례로 올렸다.
- XGBoost의 first/second derivative, leaf weight와 split gain을 한국어 의미가 붙은 수식으로
  연결했다.
- XGBoost, LightGBM과 CatBoost를 승자표로 만들지 않고 sparsity, scale, category와 serving
  병목에 따른 비교 후보로 배치했다.
- Early stopping, preprocessing과 calibration을 fold 경계 안의 model-selection 책임으로
  고정했다.

### Neural and foundation models

- 숫자·범주 셀을 feature token으로 바꾸는 단계에서 시작한다.
- FT-Transformer의 feature attention, TabNet의 sequential mask와 PFN의 prior-task objective를
  서로 다른 adaptation 계약으로 설명한다.
- TabPFN v2와 2026년 TabPFN-3를 분리하고, 100만 row와 확장 task는 보편 보장이 아니라
  저자 보고서의 실험 경계라고 명시한다.
- GBDT, MLP, task-trained neural과 pretrained model을 동일 split·budget·hardware·latency에서
  비교하게 한다.

### Point-in-time features

- Event time과 availability time을 동시에 통과한 history만 cutoff에서 허용한다.
- Label horizon과 label-finalization time을 분리해 아직 확정되지 않은 row를 train에서 뺀다.
- Regular shift와 irregular as-of lag, 반열린 rolling window, TTL point-in-time join,
  bitemporal replay를 연결한다.
- Forward validation에서 gap, purge와 entity novelty가 deployment question에 따라 달라짐을
  설명한다.

### Event sequence

- Entity, episode, observation cutoff와 target event에서 sample generator를 정의한다.
- Last, count, rolling, recency, n-gram, small sequence와 attention의 복잡도 사다리를 둔다.
- 같은 집계지만 순서가 다른 history pair의 target/error 차이로 order loss를 진단한다.
- Event type, numeric value, time delta와 position을 별도 token 책임으로 만든다.
- Padding mask와 causal mask를 task 기준으로 구분하고 RNN, TCN과 Transformer를 기억 방식과
  운영 비용으로 비교한다.

## Formula and visual contract

모든 display 수식은 `String.raw`와 공용 `FormulaPair`를 사용한다. 각 수식 바로 아래에 한국어
의미와 기호 설명을 두고, 긴 식은 중간 변수와 여러 행으로 나눴다.

390px browser 측정의 최소 auto-fit scale:

- Gradient boosting: `0.85`
- Neural/foundation tabular: `0.95`
- Point-in-time features: `0.82`
- Event sequence: `0.81`

모두 기준 `>= 0.80`을 통과했다.

새 공용 Viz는 fixed-coordinate SVG가 아니라 CSS grid와 stable state 영역으로 만들었다.

- `BoostingResidualLab`: round가 바뀌면 prediction, residual과 MSE가 함께 변한다.
- `TreeSystemChoiceLab`: data bottleneck을 바꾸면 후보와 검증 질문이 함께 변한다.
- `TabularEscalationLab`: 필요한 능력에 따라 tree, task-trained neural과 PFN 후보를 분리한다.
- `FeatureTokenLab`: numeric/category tokenization의 값과 설명을 바꾼다.
- `PriorDatasetLab`: synthetic task pretraining과 새 표 inference를 분리한다.
- `TemporalCutoffLab`: event/arrival/cutoff 조건에 따라 사용 가능 여부가 바뀐다.
- `RollingWindowLab`: window와 endpoint를 바꾸면 포함 event와 집계가 바뀐다.
- `OrderLossLab`: 같은 count에서 event order와 target이 달라짐을 보여 준다.
- `SequenceInputLab`: truncation, padding과 causal visibility를 바꿔 input 계약을 보여 준다.

색만 바뀌는 state는 없고, 선택이 설명·숫자·판정 또는 tensor 구성에 반영된다.

## Primary-source boundary

- Friedman 2001: negative functional-gradient stage-wise boosting
- Chen and Guestrin 2016: XGBoost objective, sparsity-aware split와 scalable system
- LightGBM 2017, CatBoost 2018: 각 시스템이 최적화한 효율·범주 처리 메커니즘
- TabNet, FT-Transformer, Grinsztajn tree-vs-deep: task-trained tabular architecture와 비교 경계
- TabArena 2025: version·validation·ensemble budget을 갱신하는 living benchmark
- Nature TabPFN v2, TabPFN-3 2026 technical report: prior-data fitted network와 최신 확장 claim
- scikit-learn, Feast, pandas 공식 문서: temporal split, periodic features, point-in-time join,
  window operation의 구현 경계
- Attention Is All You Need, GRU4Rec, BERT4Rec: attention과 event sequence model의 대표 원류

`TreeSystemChoiceLab`, baseline ladder, order-loss audit와 release gate는 원문에 있는 보편
정답이 아니라 위 근거를 현재 블로그의 evidence contract로 조합한 engineering synthesis다.

모든 article source URL은 2026-07-24에 HTTP 200을 확인했다. ACM DOI에서 직접 열 때 403을
반환하던 XGBoost와 BERT4Rec 링크는 각각 KDD 원문 PDF와 arXiv 원문으로 교체했다.

## Context Manager and Claude evidence

첫 transport header가 정확히 `[claude-code:sonnet`으로 시작하는 결과만 true-Claude 검토로
채택한다. Timeout, headerless result, provider error와 Codex fallback은 검토 내용이 있어도
coverage에서 제외한다.

초기 broad batch 3건과 첫 article batch의 일부는 timeout으로 폐기했다. 현재 wrapper와 직접
사용하는 Formula/Viz, metadata와 path만 읽는 네 개의 bounded article audit을
`cm_route_delegate(worker=claude-code:sonnet)`로 병렬 재실행했다.

유효한 wrapper 감사:

- Gradient boosting: `[claude-code:sonnet · L1 · $0.0000 · 113216ms]`
- Neural/foundation tabular: `[claude-code:sonnet · L1 · $0.0000 · 72846ms]`
- Point-in-time features: `[claude-code:sonnet · L1 · $0.0000 · 61543ms]`
- Event sequence: `[claude-code:sonnet · L1 · $0.0000 · 88312ms]`

독립 판정 후 반영한 finding:

- Boosting Viz의 양수 raw term과 부호가 있는 leaf score를 명시적으로 구분했다.
- FT-Transformer 범주 token에 feature bias를 복구했다.
- Lag는 `Delta > 0`으로 제한하고 `Delta = 0`은 strict-history 규칙으로 보냈다.
- Gap, purge와 embargo를 서로 다른 시간 경계로 정의했다.
- Sequence 첫 event의 정의되지 않은 시간 차이를 `delta_BOS` 계약으로 바꿨다.

TabPFN-3의 첫 저자가 Grinsztajn이 아니라는 finding은 arXiv `2605.13986` 원문 저자 목록과
충돌하므로 기각했다. 네 본문 수정은 각각 다음 유효한 좁은 재검토로 통과했다.

- `[claude-code:sonnet · L1 · $0.0000 · 8768ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 7884ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 10236ms]`
- `[claude-code:sonnet · L1 · $0.0000 · 11221ms]`

Viz 감사에서는 temporal availability가 timeline에 직접 보이지 않는 문제와 recent-only
truncation이 보편 규칙처럼 보이는 문제를 발견했다. 늦게 도착한 event를 취소선과 도착 시각으로
표시하고, recent-first와 early-first 정책이 실제 retained history를 바꾸도록 수정했다. 좁은
재검토 결과:

- Temporal cutoff/rolling: `[claude-code:sonnet · L1 · $0.0000 · 75268ms]`, PASS
- Sequence truncation/padding: `[claude-code:sonnet · L1 · $0.0000 · 81515ms]`, PASS
- Shared segmented control: `[claude-code:sonnet · L1 · $0.0000 · 20934ms]`, PASS

이 기록에서 “Claude 검증”은 위처럼 provider header와 elapsed time이 남은 결과만 뜻한다.
500, timeout, headerless fallback은 결과가 그럴듯해도 검증 수에 포함하지 않는다.

## Verification before deployment

- `npx tsc --noEmit`: pass
- Targeted ESLint: pass
- Targeted `git diff --check`: pass
- `tests/practical-tabular-static-temporal.spec.ts`: 11/11 pass
- 390, 768, 1440px: document overflow 0, raw LaTeX 0, formula pairing pass
- All nine interactive labs: state transition assertions pass
- Practical tabular path/sidebar regression: 1/1 pass
- All cited article URLs: HTTP 200

## Production evidence

- `npm run build`: pass, Vite production build completed in 19.43s
- `systemctl --user restart cm-blog.service`: pass
- Service state: active/running from 2026-07-24 15:15:45 KST
- Four article routes and `?sub=ai-practical-tabular`: HTTP 200
- Production `tests/practical-tabular-static-temporal.spec.ts`: 11/11 pass
- Production authored-path/sidebar regression: 1/1 pass

따라서 이 배치는 local source, primary-source boundary, true-Claude review, responsive browser,
interaction state와 production deployment까지 닫혔다.
