# AI 서빙 묶음 10 · 분산 추론에서 용량 결정까지

## 부모 질문

분산 추론의 상태 인계와 최적화 후보를 어떻게 같은 조건에서 측정하고, 실제 GPU 용량과 비용 결정으로 이어야 합니까?

## 글과 역할

- `ai/disaggregated-prefill-decode-serving` · concept · 단계 사이의 KV 상태와 완료 신호
- `ai/inference-optimization-layers` · concept · 변경 위치와 전체 효과의 구분
- `ai/serving-benchmark-methodology` · practice · 동일 조건 부하와 정상 구간 측정
- `ai/inference-cost-and-capacity-planning` · practice · 처리량에서 GPU 수·여유·비용 산정

## 이번 변경

- [x] 네 글 위에 같은 부모 지도와 현재 위치를 표시합니다.
- [x] 핵심 동작 시각화를 첫 설명보다 앞에 둡니다.
- [x] 각 글에서 확인한 사실을 부모 지도에 되돌립니다.
- [x] 개념 글과 실무 글의 책임을 섞지 않습니다.
- [x] JavaScript가 없어도 장면 순서와 결론을 읽을 수 있는지 확인합니다.

## 검증

- [x] 변경 파일 ESLint
- [x] TypeScript 및 production build
- [x] strict topology·architecture-flow·reading-order·coverage
- [x] 390×844 모바일: 현재 위치, 가로 넘침, Viz 잘림, 장면 경계
- [x] 1440×900 데스크톱: 현재 위치, 가로 넘침, Viz 잘림
- [x] 키보드 조작과 명시적 재생
- [x] reduced-motion
- [x] JavaScript 비활성 상태
- [ ] 공개 경로와 GitHub Pages 배포

로컬 Chromium 최종 결과는 `output/playwright/ai-serving-batch-10-final/2026-10-24T15-15-21/summary.json`에 남겼습니다. 네 경로×두 viewport 모두 실패 0입니다. JavaScript 비활성 모바일 문서는 폭 390px 안에 들어오며 작동하지 않는 현재 장면 대신 모든 장면의 순서와 결론만 표시합니다.
