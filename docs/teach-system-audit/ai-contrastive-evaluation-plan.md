# Contrastive Evaluation 재작성 계획

## 문서 카드

- 트랙: practice
- 형식: lab
- 매체: article
- 독자: 새 contrastive encoder·miner·pair policy를 운영 환경에 반영해도 되는지 판단해야 하는 ML 엔지니어
- 독자의 현재 작업: 고정된 후보 산출물을 감사하고 기존 모델과 같은 조건에서 비교한 뒤 release·revise·block 중 하나를 결정합니다.
- 출발할 개념: pair 의미, triplet miner receipt, supervised pair 경계, train·validation·test selection feedback
- 한 문장 답: 후보와 평가 버전을 먼저 고정하고 위험 구간별 표본 감사와 같은 split·seed의 downstream 비교를 함께 통과시킨 뒤에만 출시합니다.
- 범위 밖: contrastive loss 재유도, 모든 서비스에 적용할 공통 임계값, 실제 운영 환경의 측정값 주장
- 진실 상태: 논문의 false-negative 문제와 linear evaluation은 [O], 표본 설계 원칙은 [O], 수치와 release 기준은 설명용 [A], 대상 서비스의 실제 threshold와 비용은 [?]

## 이어지는 사례

`encoder-v8`과 `miner-v5`로 만든 검색 후보를 현재 운영 중인 `encoder-v7`과 비교합니다. 후보 모집단은 similarity 위험에 따라 세 구간으로 나누고 각 구간에서 20개씩 무작위로 검토합니다.

| 구간 | 모집단 | 표본 | hidden positive | 관측 비율 | Wilson 95% 구간 |
|---|---:|---:|---:|---:|---:|
| 높음 | 100 | 20 | 8 | 40% | 21.9–61.3% |
| 중간 | 900 | 20 | 2 | 10% | 2.8–30.1% |
| 낮음 | 9,000 | 20 | 0 | 0% | 0–16.1% |

- 세 표본을 단순 합치면 `10/60=16.7%`입니다.
- 모집단 비중을 반영한 설명용 추정치는 `(100×0.40 + 900×0.10 + 9,000×0)/10,000=1.3%`입니다.
- 낮음 구간의 `0/20`은 위험이 0이라는 뜻이 아닙니다. 이 표본의 Wilson 상한은 약 16.1%입니다.
- 같은 split·seed의 downstream gain은 `[+0.02, −0.01, 0, +0.01, −0.02]`이고 평균은 0입니다.
- 따라서 이 설명용 사례의 결정은 `release`가 아니라 `revise`입니다.

## 상태 소유권

| 상태 | authoritative writer | 읽는 쪽 |
|---|---|---|
| candidate receipt | miner/index build pipeline | audit·evaluation job |
| pair verdict | reviewer와 adjudicator | audit report·pair policy owner |
| paired metric receipt | versioned evaluation job | release gate |
| release decision | release owner | deployment pipeline·audit log |

동일한 candidate receipt, split, seed, metric 구현을 평가 도중 다른 프로세스가 덮어쓰지 못하게 합니다.

## 독자 순서

1. 정확한 개념 anchor에서 실무 글로 들어옵니다.
2. `encoder-v8` 후보와 비교 조건을 변경 불가능한 receipt로 고정합니다.
3. similarity 세 구간에서 같은 수를 검토하되 구간별 결과와 모집단 크기를 함께 보존합니다.
4. 단순 표본 비율과 모집단 가중 추정치가 왜 다른지 계산합니다.
5. 같은 split·seed에서 baseline과 후보의 차이를 짝지어 계산합니다.
6. audit·downstream 결과를 함께 읽고 release·revise·block 중 하나를 정합니다.
7. stale snapshot, unknown 강제 분류, test 재사용, 평가 설정 불일치의 복구 경로를 확인합니다.

## 그림 질문

1. `ReleaseEvidenceFlowViz`: 어떤 산출물을 누가 쓰고 어떤 근거가 모여야 release gate가 열립니까?
2. `StratifiedPairAuditViz`: 같은 20개씩 검사했는데 단순 합계와 모집단 가중 추정치가 왜 다릅니까?
3. `PairedDownstreamViz`: 같은 seed의 baseline·candidate 차이가 어떻게 평균 0이 됩니까?
4. `EvaluationFailureViz`: 평가 계약이 깨졌을 때 어떤 근거를 폐기하고 어디서 다시 시작합니까?

모든 그림은 사용자가 눌러야 시작하며 자동 반복하지 않습니다. reduced-motion에서는 마지막 상태를 보이고, JavaScript가 없으면 같은 단계와 결론을 번호 목록으로 제공합니다.

## 근거 장부

| 주장 | 근거 | 범위 |
|---|---|---|
| Unlabeled negative에 같은 latent class가 섞일 수 있음 | Debiased Contrastive Learning [O] | 논문의 latent-class 가정과 실험 |
| Representation은 linear evaluation·fine-tuning 같은 downstream protocol로 평가할 수 있음 | SimCLR [O], DCL 공식 구현 [O] | 각 논문의 데이터·평가 설정 |
| 비율 추정에는 신뢰구간과 표본 설계가 필요함 | NIST e-Handbook [O] | 일반 통계 절차 |
| 세 구간의 모집단·표본·판정 수 | 설명용 가정 [A] | 실제 서비스 측정값이 아님 |
| release 기준과 owner 구분 | 운영 설계 [A] | 대상 환경 합의 전 제안 |

## 완료 조건

- 글을 `practice` 트랙으로 분류하고 정확한 개념 anchor를 표시합니다.
- candidate receipt, pair verdict, downstream receipt, release decision의 writer를 구분합니다.
- 단순 표본 합계와 모집단 가중 추정치를 혼동하지 않습니다.
- `0/20`을 위험 0으로 표현하지 않습니다.
- 같은 split·seed의 paired comparison을 화면에서 다시 계산할 수 있습니다.
- 실패 시 근거 폐기 범위, 재시작 지점, 이전 revision으로의 rollback을 적습니다.
- 데스크톱, 390×844, 키보드, reduced-motion, JavaScript 비활성 상태를 검증합니다.
