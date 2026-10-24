# AI 학습률 곡선 묶음 28

## 범위

- `ai/cosine-restart-scheduling` — 개념
- `ai/one-cycle-scheduling` — 실무
- `ai/warmup-scheduling` — 개념

## 직속 부모 지도

`시계 고정 → 감소 조건 → 주기 곡선 → 진단 후 실행 → 경계 결합`

## 변경 원칙

- Cosine 글은 900-update cycle의 t=450에서 LR=.0505를 계산하고, restart되는 cursor·LR phase와 보존되는 parameter·optimizer state를 나눕니다.
- OneCycle 글은 별도 range test에서 불안정 경계를 찾고, 깨끗한 checkpoint에서 시작하는 실제 rise·decay run과 rollback gate를 분리합니다.
- Warmup 글은 total T=1,000 중 W=100을 앞 구간에 쓰고, 본 schedule의 local cursor 0과 길이 900을 만드는 이음새를 추적합니다.
- 세 글은 같은 학습률 지도에서 현재 위치와 직속 개념 부모, 다음 글을 공유합니다.
- 각 글의 첫 설명보다 동작 그림을 먼저 배치하고, 계산은 설명형 수식, 실패 경계는 별도 비교 그림으로 먼저 보여줍니다.
- 애니메이션은 명시적 재생 전에는 멈추며 장면당 6.2초를 사용합니다. 장식용 반복 모션은 넣지 않습니다.
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
