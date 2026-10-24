# AI 생성 모델 계열 묶음 14

## 범위

- `ai/generative-theory` — 개념 허브
- `ai/autoregressive-generative-models` — 개념
- `ai/latent-variable-generative-models` — 개념
- `ai/normalizing-flows` — 개념
- `ai/adversarial-density-ratios` — 개념
- `ai/score-based-generative-models` — 개념

## 직속 부모 지도

이 묶음은 순차 파이프라인이 아닙니다. 하나의 공통 생성 문제에서 다음 다섯 계산 갈래로 분기합니다.

`공통 생성 문제 → {조건부 분해 | 숨은 원인 | 가역 밀도 | 비교 신호 | 점수 방향}`

## 변경 원칙

- 허브와 형제 계열을 직선 단계처럼 표현하지 않습니다.
- 각 글의 핵심 동작 그림을 용어 설명과 수식보다 먼저 배치합니다.
- 장면은 명시적인 입력 전까지 시작하지 않으며 화면 밖에서는 정지합니다.
- JavaScript 비활성 상태에서는 현재 장면 대신 모든 장면의 순서와 결론을 제공합니다.
- 시각화 안의 영문 역할 설명은 수식·정식 기술명만 남기고 짧은 한국어 동작으로 바꿉니다.

## 검증

- [x] 데스크톱 1440×1000
- [x] 모바일 390×844
- [x] 가로 넘침과 SVG 잘림 없음
- [x] 분기 지도와 현재 갈래 링크 일치
- [x] 키보드 장면 이동과 명시적 재생
- [x] 화면 이탈 정지와 재진입 자동 재생 없음
- [x] reduced-motion
- [x] JavaScript 비활성 전체 장면
- [x] 전체 build 및 strict audit
- [ ] 공개 경로 배포 확인
