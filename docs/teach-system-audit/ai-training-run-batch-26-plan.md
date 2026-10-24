# AI 학습 실행 묶음 26

## 범위

- `ai/training-pipeline` — 개념
- `ai/transfer-learning-practice` — 실무

## 직속 부모 지도

`입력 고정 → 상태 갱신 → 중단 복원 → 범위 선택 → 전이 판정`

## 변경 원칙

- train-v7의 sample ID 네 개가 micro-batch 두 개와 optimizer update 120→121을 거쳐 checkpoint로 저장되는 한 실행을 끝까지 추적합니다.
- 학습 파이프라인에서는 data 순서, update clock, optimizer·RNG·sampler 상태, metric 분자·분모를 하나의 run contract로 묶습니다.
- 전이 학습에서는 같은 pretrained checkpoint·split·seed·budget에서 fixed→partial→full 범위를 비교하고 target 이득과 source 회귀를 함께 판정합니다.
- 각 절은 설명보다 먼저 흐름 그림이나 계산 그림을 배치해, 독자가 상태와 가정을 먼저 본 뒤 이름과 근거를 읽게 합니다.
- 순서와 상태 변화가 있는 두 첫 그림만 명시적 재생 장면으로 만들고, 수식·비교 그림은 정적으로 유지합니다.
- JavaScript가 없어도 두 동작 그림의 모든 장면과 결론을 정적 목록으로 제공합니다.
- 기존 수식·공식 문서·논문 근거·연습문제는 보존합니다.

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
