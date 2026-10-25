# Supervised Contrastive Learning 재작성 계획

## 문서 카드

- 트랙: concept
- 형식: explanation
- 매체: article
- 독자: SimCLR의 `2N` view와 anchor별 softmax를 이해했고, label이 여러 positive로 바뀌는 지점을 계산하려는 개발자
- 독자의 현재 작업: 여섯 view의 label mask에서 anchor 하나의 positive set을 만들고, 논문 식 (2)의 loss를 직접 계산합니다.
- 사전 지식: augmented view, anchor, temperature-scaled softmax
- 한 문장 답: Supervised contrastive learning은 같은 label의 다른 view를 anchor의 positive set으로 모으고, 자기 자신을 뺀 공통 분모에서 positive별 negative log-probability를 각각 계산한 뒤 같은 비중으로 평균합니다.
- 다음 질문: 합을 log 안으로 옮겨도 같은 positive 집합을 쓰는데 왜 gradient와 학습 결과가 달라질까요?
- 범위 밖: 특정 서비스의 sampler 선택, 배포 metric, release 승인, label hierarchy 운영 정책
- 진실 상태: NeurIPS 2020 논문의 multiview batch와 식 (1)~(3)은 [O], 여섯 view의 지수 점수는 설명용 가정 [A], 일반화 경계는 [A]

## 이어지는 사례

앞 글의 `N=3`, `2N=6` 구조를 유지하되 label을 추가합니다.

- 원본 `A`: 운동화 사진, label `신발`
- 원본 `B`: 다른 운동화 사진, label `신발`
- 원본 `C`: 가방 사진, label `가방`
- 원본마다 두 view를 만들어 `A₁·A₂·B₁·B₂·C₁·C₂`를 얻습니다.
- Anchor는 `A₁`입니다.
- `P(A₁)={A₂,B₁,B₂}`이고, 분모 후보 `A(A₁)`은 anchor를 제외한 다섯 view입니다.

논문의 원래 two-view 구성에서는 `C₁`에도 같은 원본의 `C₂`가 있으므로 positive set이 비지 않습니다. 한 view만 쓰는 변형이나 custom sampler에서는 빈 positive set이 생길 수 있다는 경계만 별도로 설명합니다.

## 수치 고정

Softmax 이전 logit 대신 지수 점수 `exp(zᵢ·zₐ/τ)`를 설명용으로 고정합니다.

| 후보 | 관계 | 지수 점수 | 후보 확률 |
|---|---|---:|---:|
| `A₂` | 같은 원본·같은 label | 8 | 0.5 |
| `B₁` | 다른 원본·같은 label | 4 | 0.25 |
| `B₂` | 다른 원본·같은 label | 2 | 0.125 |
| `C₁` | 다른 label | 1 | 0.0625 |
| `C₂` | 다른 label | 1 | 0.0625 |

- 공통 분모 `Z=16`
- 논문 식 (2), 합이 log 밖: `-(log .5 + log .25 + log .125)/3 = log 4 ≈ 1.386`
- 논문 식 (3), 합이 log 안: `-log((.5+.25+.125)/3) = -log(7/24) ≈ 1.232`
- 식 (2)의 positive target weight: 각 `1/3`
- 식 (3)의 positive target weight: `8/14, 4/14, 2/14`

두 loss 값의 크기만 비교해 우열을 말하지 않습니다. 논문은 식 (2)의 positive normalization이 gradient에 남는다는 분석과 ImageNet·ResNet-50·batch 6144 조건의 결과를 제시합니다.

## 독자 순서

1. 부모 지도에서 여러 positive 영역을 찾습니다.
2. 원본 세 개가 view 여섯 개로 바뀌고 label이 복사되는 과정을 봅니다.
3. `A₁` 행에서 self를 지우고 same-label 세 칸을 positive로 표시합니다.
4. 다섯 후보의 지수 점수를 더해 `Z=16`을 만듭니다.
5. 세 positive probability에 negative log를 각각 적용하고 평균해 식 (2)를 계산합니다.
6. 합을 log 안으로 옮긴 식 (3)과 gradient target weight를 비교합니다.
7. official two-view setup과 empty-positive가 가능한 변형을 구분한 뒤 부모 지도에 결과를 반환합니다.

## 그림 질문

1. `SupConBatchViz`: 세 원본과 label이 어떻게 여섯 view로 펼쳐집니까?
2. `PositiveMaskViz`: `A₁` 행에서 self·positive·negative는 어떤 칸입니까?
3. `MultiPositiveLossViz`: `8·4·2·1·1`이 어떻게 `Z=16`과 loss `1.386`이 됩니까?
4. `LogPlacementViz`: 같은 세 positive를 써도 log 바깥과 안에서 target weight가 어떻게 달라집니까?

모든 그림은 사용자가 눌러야 시작하고, reduced-motion에서는 마지막 상태를 보입니다. JavaScript가 없으면 같은 단계와 결론을 번호 목록으로 제공합니다.

## 근거 장부

| 주장 | 근거 | 범위 |
|---|---|---|
| `N`개 sample을 두 번 augment해 `2N` multiview batch를 만듦 | Khosla et al., NeurIPS 2020 §3.1–3.2 [O] | 논문의 image classification framework |
| `P(i)`는 anchor를 제외한 same-label view index 집합 | 논문 식 (2)·(3) [O] | 논문의 supervised contrastive objective |
| 식 (2)는 positive별 log-probability를 평균함 | 논문 식 (2) [O] | `L_out^sup` |
| 식 (3)은 positive 확률 평균에 한 번 log를 적용함 | 논문 식 (3) [O] | `L_in^sup` |
| 식 (2)와 식 (3)의 gradient target weight가 다름 | 논문 식 (4)~(6) [O] | 논문의 분석 전제 |
| `8·4·2·1·1`과 계산 결과 | 설명용 가정 [A] | 측정 결과가 아님 |
| 한 view 변형에서는 empty positive가 생길 수 있음 | 식 정의에서 따른 구현 경계 [A] | 논문의 기본 two-view batch와 구분 |

## 완료 조건

- 논문의 원래 two-view batch와 일반화된 one-view 구현 경계를 섞지 않습니다.
- `P(i)`와 denominator candidate set을 다른 색과 이름으로 구분합니다.
- 식 (2)와 식 (3)을 괄호 위치, 수치 결과, gradient target weight까지 같은 사례로 비교합니다.
- AlgorithmBlock이 label mask부터 valid-anchor 평균까지 옮길 수 있는 의사코드를 제공합니다.
- 운영 release 판단은 다음 평가 글로 보내고 이 글은 objective mechanism에서 끝냅니다.
- 부모 locator와 return map이 같은 curriculum 데이터를 사용합니다.
- 데스크톱, 390×844, 키보드, reduced-motion, JavaScript 비활성 상태를 검증합니다.
