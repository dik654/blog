# Contrastive Learning 재작성 계획

## 질문

상품 이미지 두 장을 가깝게 만들기 전에 어떤 근거로 positive·negative·unknown 관계를 정하고, encoder 표현 `h`와 loss용 projection `z`를 어디서 나눠야 합니까?

## 직속 부모와 고정 사례

- 부모: `/cs/ai?sub=ai-practical-embedding`
- 현재 트랙: concept
- 입력: 상품 `SKU-42`의 정면 이미지와 밝기만 바꾼 crop
- 비교 대상: 다른 상품 `SKU-77`, 중복 상품인지 확인되지 않은 판매자 이미지
- 수치 fixture: projection `z̃=(3,4)`, reference `r=(1,0)`

## 전개

1. 같은 파일인지가 아니라 현재 task가 보존할 의미를 먼저 정합니다.
2. 세 pair를 positive·negative·unknown으로 나누고 근거를 receipt에 기록합니다.
3. 같은 색 변화도 상품 식별과 피부 병변 분류에서 다른 관계가 되는 반례를 확인합니다.
4. 두 입력을 encoder `f`로 `h`에 옮긴 뒤 projection head `g`로 `z̃`를 만듭니다.
5. `z̃=(3,4)`를 unit vector `(0.6,0.8)`로 만들고 `(1,0)`과 cosine `0.6`을 계산합니다.
6. Pair 형식에 따라 SimCLR·triplet·supervised contrastive의 다음 글로 갈라지는 지점을 부모 지도에 반환합니다.

## 1차 근거

- Chen et al., SimCLR, PMLR v119, 2020: 두 augmentation view, encoder `h`, projection head `z`, 학습 뒤 projection head를 버리고 representation을 쓰는 실험 계약
- Wang & Isola, Alignment and Uniformity, PMLR v119, 2020: positive alignment와 normalized hypersphere uniformity 관점

## 검증할 수치

- `||z̃||₂ = sqrt(3²+4²) = 5`
- `z = (3/5,4/5) = (0.6,0.8)`
- `cos(z,(1,0)) = 0.6`

## 경계

- SimCLR의 ImageNet·ResNet 실험 결과를 모든 데이터와 domain에 일반화하지 않습니다.
- 색 변화가 label을 보존하는지는 augmentation 이름이 아니라 업무상 target으로 판단합니다.
- 이 글은 pair 의미와 `h/z` 경계를 소유합니다. NT-Xent 분모·temperature는 다음 글에서 계산합니다.
