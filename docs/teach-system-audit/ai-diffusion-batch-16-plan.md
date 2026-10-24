# AI 확산 모델 학습 묶음 16

## 범위

- `ai/diffusion-models` — 개념
- `ai/diffusion-continuous-time` — 개념
- `ai/latent-diffusion-guidance` — 실무
- `ai/visual-representation-tokenizers` — 개념
- `ai/diffusion-transformer-architecture` — 개념
- `ai/modern-image-model-stack` — 참고
- `ai/diffusion-language-models` — 개념

## 직속 부모 지도

`생성 모델 · 점수 방향 → 손상과 복원 → 연속시간 전송 → {이미지: 잠재공간 생성 → 표현 계약 → 복원기 구조 → 전체 조립 | 언어: 마스크 복원}`

## 변경 원칙

- 확산을 하나의 제품 구조가 아니라 손상과 반복 복원이라는 공통 원리에서 시작합니다.
- 공통 원리 뒤에 이미지의 연속 잠재값 경로와 언어의 이산 MASK 경로가 갈라짐을 먼저 보여 줍니다.
- 이미지 경로에서는 표현·복원기·전체 조립의 텐서 계약과 상태 소유권을 분리합니다.
- 핵심 동작 그림은 용어·수식·가정보다 먼저 배치합니다.
- 모바일에서는 부모 지도와 핵심 그림 하나가 844px 높이 안에 들어오도록 압축하고 가로 이동을 없앱니다.
- 동작 장면은 명시적인 입력 전까지 시작하지 않으며 JavaScript 비활성 상태에는 순서와 결론을 모두 남깁니다.

## 검증

- [x] 데스크톱 1440×1000
- [x] 모바일 390×844
- [x] 부모 지도 675px, 가장 큰 첫 그림 832px
- [x] 문서·그림 가로 넘침과 SVG 글자 잘림 없음
- [x] 부모 지도와 현재 단계 링크 일치
- [x] 키보드 장면 이동과 명시적 재생
- [x] reduced-motion
- [x] JavaScript 비활성 전체 장면
- [x] 전체 build 및 strict audit
- [ ] 공개 경로 배포 확인
