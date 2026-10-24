# AI LLM 요청 운영 묶음 31

## 범위

- `ai/llm-monitoring-observability-and-drift` — 개념
- `ai/llm-application-caching` — 개념
- `ai/llm-gateway-and-model-routing` — 개념
- `ai/rate-limiting-and-reliability-patterns` — 개념

## 직속 부모 지도

`요청 관측 → 응답 재사용 → 모델 선택 → 과부하 보호`

## 변경 원칙

- 네 글은 LLM 온라인 운영의 서로 다른 책임을 맡으며, 같은 상태를 바꾸는 하나의 제품 묶음으로 설명하지 않습니다.
- 각 글은 설명보다 먼저 같은 요청 하나의 상태 전이를 보여 줍니다.
- 관측 글은 `root span → child spans → latency breakdown → token throughput`을 추적합니다.
- 캐시 글은 `cache key → exact miss → semantic hit → 나머지 조회 생략`을 추적합니다.
- 게이트웨이 글은 `저비용 모델 → 품질 신호로 승격 → 실행 실패로 제공자 우회 → 응답 확정`을 추적합니다.
- 안정성 글은 `closed → open → half-open → closed/open` 상태 전이를 추적합니다.
- 동작 그림은 명시적 재생 전까지 멈추고 장면당 6.2초를 사용합니다.
- JavaScript가 없어도 각 장면의 순서와 결론을 정적 목록으로 제공합니다.
- 기존 수식·공식 근거·연습문제는 보존합니다.

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
