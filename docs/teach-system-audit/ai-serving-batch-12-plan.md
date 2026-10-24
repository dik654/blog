# AI 서빙 묶음 12 · 운영 계약에서 용량 조달까지

## 부모 질문

자체 추론 서비스를 출시한 뒤 어떤 요청을 보호하고, 누가 상태를 소유하며, 장애를 어디서 흡수하고, 필요한 GPU를 어떤 방식으로 확보해야 합니까?

## 글과 역할

- `ai/llm-serving-ops` · concept · 사용자 경험을 요청 계약과 관측·제어 루프로 바꾸기
- `ai/onprem-k8s-inference-platform` · practice · 자체 Kubernetes에서 요청·복제본·GPU 상태의 담당자 정하기
- `ai/inference-failure-absorption` · concept · 고장 난 계층과 요청 진행 상태에 따른 복구 경계
- `ai/own-vs-rent-inference-capacity` · practice · 예비 용량과 가동률을 포함해 소유·임대를 같은 단위로 비교하기

## 적용할 변경

- [x] 네 글 위에 같은 부모 지도와 현재 위치를 표시합니다.
- [x] 핵심 시각화를 첫 설명과 가정보다 앞에 둡니다.
- [x] 각 글에서 확인한 사실을 부모 지도에 되돌립니다.
- [x] 개념·실무 글의 책임과 상태 소유권을 지도에서 구분합니다.
- [x] 움직이는 그림은 명시적 입력 전에는 시작하지 않고 JavaScript 비활성 상태에서도 순서가 남게 합니다.
- [x] `닫는다` 같은 번역투를 자연스러운 운영 표현으로 고칩니다.

## 검증

- [x] 변경 파일 ESLint
- [x] TypeScript 및 production build
- [x] strict topology·architecture-flow·reading-order·coverage
- [x] 390×844 모바일: 현재 위치, 가로 넘침, Viz 잘림, 장면 경계
- [x] 1440×1000 데스크톱: 현재 위치, 가로 넘침, Viz 잘림
- [x] 키보드 조작과 명시적 재생
- [x] reduced-motion
- [x] JavaScript 비활성 상태
- [ ] 공개 경로와 GitHub Pages 배포

로컬 Chromium 결과는 `output/playwright/ai-serving-batch-12-final/summary.json`에 남겼습니다. 네 경로×두 viewport 모두 HTTP 200, 부모 지도와 반환 지도 각 1개, 현재 위치 일치, 문서와 시각화의 가로 넘침 및 console 오류 0입니다. 움직이는 그림은 4.5초 동안 사용자의 입력을 기다리고, 키보드로 다음 장면에 이동합니다. reduced-motion과 JavaScript 비활성 상태에서도 같은 순서와 결론을 확인할 수 있습니다.
