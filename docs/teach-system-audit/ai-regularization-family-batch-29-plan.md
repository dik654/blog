# AI 일반화·정규화 묶음 29

## 범위

- `ai/regularization-practice` — 실무
- `ai/dropout-regularization` — 개념
- `ai/weight-decay` — 개념
- `ai/early-stopping` — 실무
- `ai/label-smoothing` — 개념

## 직속 부모 지도

`원인 진단 → 경로 무작위화 → 가중치 축소 → 궤적 선택 → 정답 재분배`

## 변경 원칙

- Generalization gap은 원인 판정이 아니라 조사 시작 신호로 두고, leakage·pipeline mismatch·label noise·distribution shift를 먼저 배제합니다.
- Dropout은 `h=2, p=.25, q=.75`에서 가능한 두 출력과 평균·분산, train/eval mode를 추적합니다.
- Weight decay는 `w=10, η=.1, λ=.02, g=3`의 SGD 계산에서 AdamW의 분리된 shrink와 parameter-group coverage까지 이어갑니다.
- Early stopping은 `.42→.38→.39→.40→.41`, `P=2`, `c>P`에서 stop index 5와 return index 2를 구분합니다.
- Label smoothing은 `K=4, ε=.1`에서 one-hot·uniform·최종 target 질량을 계산하고 Mixup과의 결합 순서를 확인합니다.
- 다섯 글은 같은 지도에서 직속 부모·현재 위치·다음 글을 공유하고 확인한 사실을 부모 지도에 반환합니다.
- 동작 그림은 첫 설명보다 먼저 배치하며, 명시적 재생 전에는 멈추고 장면당 6.2초를 사용합니다.
- 장면 전환은 실제 계산·상태 변화만 보여 주고 장식용 fade·선 이동은 사용하지 않습니다.
- JavaScript가 없어도 모든 장면의 순서와 결론을 정적 목록으로 제공합니다.
- 기존 수식·논문 근거·연습문제는 보존합니다.

## 검증

- [x] TypeScript
- [x] 데스크톱 1440×1000
- [x] 모바일 390×844
- [x] 문서·그림 가로 넘침과 글자 잘림 없음
- [x] 직속 부모·현재 위치·같은 묶음의 이웃 링크 일치
- [x] 키보드 장면 이동과 명시적 재생
- [x] reduced-motion
- [x] JavaScript 비활성 전체 장면
- [x] 전체 build 및 strict audit
- [ ] 공개 경로 배포 확인
