# 확률과 정보 이론 content spec

## Goal
- 독자가 관측 전 분포, 관측 likelihood, posterior, parameter likelihood를 서로 구분한다.
- log, expectation, cross-entropy, KL이 학습 objective에 쓰이는 연산 이유를 설명한다.

## Hidden mastery problem
> Prevalence 0.5%, sensitivity 98%, false-positive rate 2%인 검사에서 positive posterior를 10,000명 frequency table과 Bayes 식으로 각각 계산한다. 이어 성공 8회·실패 2회의 Bernoulli likelihood를 쓰고 log가 argmax를 보존하면서 곱을 합으로 바꾸는 이유를 설명한다. 마지막으로 고정된 P에서 cross-entropy 최소화가 KL 최소화와 같은 이유와 `KL(P||Q) != KL(Q||P)`의 실패 사례를 설명한다.

## Source and intent ledger
| Source | Adopted claim | Writing intent | Boundary |
|---|---|---|---|
| Deep Learning Book ch. 3 | random variables, expectation, Bayes, information theory | AI objective에 필요한 공통 표기 사용 | measure-theoretic probability는 defer |
| Harvard Stat 110 | conditional probability and Bayes through frequency reasoning | 조건부 방향 오류를 자연 빈도로 교정 | 의료 의사결정 조언으로 확장하지 않는다 |
| Cover & Thomas | entropy, cross-entropy, relative entropy | code-length intuition과 수식 연결 | KL을 metric distance라고 부르지 않는다 |

## Full-scope map
| Topic | Depth | Article section | Failure mode |
|---|---|---|---|
| random variable and distribution | deep | `random-variable` | X와 관측 x 혼동 |
| expectation, variance, entropy | deep | `expectation` | 기대값을 다음 관측 예측으로 오해 |
| conditional probability and Bayes | deep | `conditional-bayes` | inverse fallacy, base-rate neglect |
| likelihood and MLE | deep | `likelihood` | likelihood를 parameter probability로 오해 |
| entropy, cross-entropy, KL | deep | `information` | KL symmetry 오해 |

## Section intent and proof
1. `random-variable`: 실험, mapping, distribution, observation을 순서대로 분리한다.
2. `expectation`: p slider로 mean, variance, entropy가 서로 다른 요약임을 확인한다.
3. `conditional-bayes`: base-rate explorer로 likelihood를 고정해도 prior가 posterior를 바꾸는 것을 증명한다.
4. `likelihood`: 데이터 고정/parameter 가변이라는 읽기 방향을 명시한다.
5. `information`: P를 고정하면 H(P)가 상수여서 CE와 KL 최적화가 같다는 조건을 밝힌다.

## Viz handoff
- Bayes explorer는 10,000명 중 true/false positive의 절대 수와 posterior를 동시에 갱신한다.
- `prevalence=1%`에서 99/495/16.7%가 본문 숫자와 일치해야 한다.
- 좁은 화면에서는 결과 bar와 posterior가 세로로 배치되고 수평 스크롤이 없어야 한다.

## Coverage gate
- 모든 조건부 확률은 조건 방향을 말로 다시 읽는가?
- likelihood와 posterior가 무엇을 고정하는지 구분하는가?
- log를 쓰는 이유가 수치 안정성, 합산, argmax 보존으로 설명되는가?
- entropy, cross-entropy, KL의 기대 분포가 명시되는가?
