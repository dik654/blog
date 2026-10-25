# Triplet Metric Learning 재작성 계획

## 문서 카드

- 트랙: concept
- 형식: explanation
- 매체: article
- 독자: 대조 학습의 pair 의미를 읽었고, triplet loss의 계산과 negative 선택이 어떻게 이어지는지 이해하려는 개발자
- 독자의 현재 작업: `anchor·positive·negative` 한 조가 어떤 조건에서 loss를 남기며, miner가 후보 하나를 고르는 과정을 설명합니다.
- 사전 지식: positive·negative 관계, embedding, cosine similarity
- 한 문장 답: Triplet loss는 anchor 기준 positive 제곱 거리보다 negative 제곱 거리가 margin만큼 더 크지 않은 위반량만 남기며, mining은 후보 생성·관계 필터·난이도 판정·선택을 분리해야 합니다.
- 다음 질문: 같은 negative 후보라도 encoder와 candidate pool이 달라지면 왜 선택 결과가 달라질까요?
- 범위 밖: 특정 서비스의 margin 선택, 운영 배포, release gate, SLO, miner 주기 결정
- 진실 상태: FaceNet의 식과 semi-hard 조건은 [O], SKU-42 수치는 설명용 가정, 일반화 경계는 [A]

## 이어지는 사례

앞 글의 상품 `SKU-42`를 그대로 사용합니다.

- `A₁`: SKU-42의 정면 사진, anchor
- `A₂`: SKU-42의 측면 사진, positive
- `B₁`: 다른 catalog ID지만 실제 SKU-42인 hidden positive
- `C₁`: 다른 상품이며 anchor보다 positive에 더 가까운 hard negative
- `D₁`: 다른 상품이며 positive보다 멀지만 margin 안에 있는 semi-hard negative
- `E₁`: 다른 상품이며 margin 밖에 있는 easy negative

모든 학습 계산은 L2 정규화된 embedding의 squared Euclidean distance를 사용합니다.

## 수치 고정

| 값 | 의미 | 수치 |
|---|---|---:|
| `cos(a,p)` | anchor-positive cosine | 0.8 |
| `d²(a,p)` | `2 - 2 × 0.8` | 0.4 |
| `α` | 설명용 margin | 0.2 |
| `d²(a,B₁)` | hidden positive 후보 | 0.35 |
| `d²(a,C₁)` | hard negative 후보 | 0.3 |
| `d²(a,D₁)` | semi-hard negative 후보 | 0.5 |
| `d²(a,E₁)` | easy negative 후보 | 0.9 |

`D₁`의 loss는 `max(0, 0.4 - 0.5 + 0.2) = 0.1`입니다. `E₁`은 0이고, `C₁`은 0.3이지만 FaceNet의 semi-hard 조건에서는 선택하지 않습니다. `B₁`은 거리 계산 전에 관계 필터에서 제외합니다.

## 독자 순서

1. 부모 지도에서 Triplet 영역을 찾습니다.
2. SKU-42 사진 세 자리를 고정하고 anchor 기준 두 거리를 봅니다.
3. unit-vector cosine 0.8이 squared distance 0.4가 되는 과정을 계산합니다.
4. 같은 `d²(a,p)=0.4`에 세 negative 거리를 넣어 hard·semi-hard·easy를 구분합니다.
5. 후보 네 개를 생성한 뒤 hidden positive를 제외하고, FaceNet 조건을 적용해 `D₁`을 고릅니다.
6. 선택이 encoder·candidate pool·filter에 의존한다는 사실을 부모 지도에 반환합니다.

## 그림 질문

1. `TripletRoleViz`: 세 sample 중 어떤 두 거리를 같은 anchor에서 비교합니까?
2. `UnitGeometryViz`: unit embedding의 cosine 0.8이 왜 squared distance 0.4입니까?
3. `TripletMarginViz`: 세 negative 중 어느 것이 loss를 남기며 semi-hard 조건을 만족합니까?
4. `MiningFunnelViz`: 생성된 후보가 어떤 순서로 제외·분류·선택됩니까?

모든 그림은 사용자가 눌러야 시작하며, reduced-motion에서는 마지막 상태를 보입니다. JavaScript가 없으면 같은 단계와 결론을 번호 목록으로 제공합니다.

## 근거 장부

| 주장 | 근거 | 범위 |
|---|---|---|
| Unit hypersphere의 squared Euclidean triplet loss | FaceNet CVPR 2015 [O] | 얼굴 identity와 논문 식 |
| Semi-hard negative는 positive보다 멀지만 margin 안에 있음 | FaceNet CVPR 2015 [O] | 논문의 online mining 조건 |
| PyTorch `TripletMarginLoss`는 Lp distance를 사용 | PyTorch 공식 문서 [O] | 현재 공식 API 문서 |
| SKU-42와 네 후보의 거리 | 설명용 가정 [A] | 측정 결과가 아님 |
| Miner 선택은 encoder·pool·filter에 종속 | 알고리즘 입력에서 따른 분석 [A] | 운영 주기는 실무 글로 이관 |

## 완료 조건

- 제곱 거리와 비제곱 거리를 한 계산에서 섞지 않습니다.
- 후보 생성, 관계 필터, 난이도 분류, 최종 선택을 서로 다른 장면으로 보여줍니다.
- 각 수치는 화면에서 다시 계산할 수 있습니다.
- 부모 locator와 return map이 같은 curriculum 데이터를 사용합니다.
- 데스크톱, 390×844, 키보드, reduced-motion, JavaScript 비활성 상태를 검증합니다.
