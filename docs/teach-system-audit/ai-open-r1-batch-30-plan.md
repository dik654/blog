# AI Open-R1 재현 묶음 30

## 범위

- `ai/open-r1` — 논문·프로젝트 해설

## 직속 부모 지도

`재현 범위 → SFT 경계 → 온라인 갱신 → 검증기 → 데이터 계보 → 평가 계약`

## 변경 원칙

- Model weight가 아니라 distillation·pure RL·multi-stage 중 어떤 재현 주장을 하는지 먼저 고정합니다.
- 각 절의 그림을 설명보다 먼저 배치해 checkpoint·token mask·rollout·reward·lineage·evaluation 조건을 먼저 봅니다.
- GRPO는 `θ₀ + q → completion 4개 → reward [1,0,1,0] → relative signal → θ₁`의 한 update를 추적합니다.
- 동작 그림은 명시적 재생 전까지 멈추고 장면당 6.2초를 사용합니다.
- 장식용 fade나 의미 없는 선 이동 없이, 현재 기록과 이번 단계의 결과가 실제로 바뀌게 합니다.
- JavaScript가 없어도 다섯 장면의 상태·결과·결론을 정적 목록으로 제공합니다.
- 기존 수식·원문 코드 참조·논문과 공식 프로젝트 근거·연습문제는 보존합니다.

## 검증

- [x] TypeScript
- [x] 데스크톱 1440×1000
- [x] 모바일 390×844
- [x] 문서·그림 가로 넘침과 글자 잘림 없음
- [x] 직속 부모·현재 위치·같은 글의 단계 링크 일치
- [x] 키보드 장면 이동과 명시적 재생
- [x] reduced-motion
- [x] JavaScript 비활성 전체 장면
- [x] 전체 build 및 strict audit
- [ ] 공개 경로 배포 확인
