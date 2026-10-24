# AI Prompt 요청 묶음 32

## 범위

- `ai/prompt-engineering` — 개념·직속 부모 지도
- `ai/prompt-reasoning` — 개념
- `ai/prompt-few-shot` — 개념
- `ai/prompt-structured-output` — 개념

## 학습 경로

`요청 계약 → 풀이와 판정 → 예시 조건 → 출력 검증`

## 변경 원칙

- Prompt 문구 기법을 나열하지 않고 하나의 요청이 계약에서 검증된 record로 바뀌는 순서를 먼저 보여 줍니다.
- Reasoning path 생성, answer 집계, 외부 verifier의 판정을 서로 다른 일로 그립니다.
- Few-shot은 weight update가 아니라 현재 context의 조건이며, 예시 순서와 반복 token 비용을 함께 보여 줍니다.
- Structured output은 parse·schema·domain·fallback의 네 문을 차례로 통과합니다.
- 동작 그림은 명시적 재생 전까지 멈추고 장면당 6.2초를 사용합니다.
- JavaScript가 없어도 각 장면의 순서와 결론을 정적 목록으로 제공합니다.
- 기존 공식 근거·수식·연습문제는 보존합니다.

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
