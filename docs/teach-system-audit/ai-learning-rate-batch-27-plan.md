# AI 학습률 제어 묶음 27

## 범위

- `ai/lr-scheduling` — 개념
- `ai/lr-decay-policies` — 실무

## 직속 부모 지도

`시계 고정 → 값 계산 → 감소 조건 → 궤적 복원 → 종료 순서`

## 변경 원칙

- sample 51,200개, rank별 micro-batch 16개, 누적 4회, rank 8개인 실행에서 effective batch 512와 총 1,000 optimizer updates를 계산합니다.
- 학습률의 시계는 epoch 이름이나 backward 호출 수가 아니라 parameter가 실제로 바뀐 optimizer update로 고정합니다.
- scheduler가 반환하는 값과 optimizer가 만드는 이동 방향을 분리하고, 연속 실행과 재개 실행의 다음 update가 같은지 비교합니다.
- 감소 정책은 update만 읽는 고정 시계 정책과 validation event·best·미개선 횟수를 읽는 정체 판정 정책으로 나눕니다.
- 같은 validation metric을 읽는 LR 감소와 조기 종료의 상태 소유자와 실행 순서를 시각적으로 먼저 보여줍니다.
- 각 절은 설명보다 먼저 흐름 그림이나 계산 그림을 배치해 가정·상태·판정 경계를 먼저 확인하게 합니다.
- 순서와 상태 변화가 있는 첫 그림만 명시적 재생 장면으로 만들고, 복원 비교와 종료 순서는 정적으로 유지합니다.
- JavaScript가 없어도 동작 그림의 모든 장면과 결론을 정적 목록으로 제공합니다.
- 기존 수식·공식 문서 근거·연습문제는 보존합니다.

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
- [x] 공개 경로 배포 확인 — GitHub Pages run `40132519023` 성공, 공개 390×844·1440×1000·키보드·reduced-motion·JavaScript 비활성 검증 통과
