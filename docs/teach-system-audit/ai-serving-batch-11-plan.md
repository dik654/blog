# AI 서빙 묶음 11 · 측정 사례에서 이식 가능한 배포까지

## 부모 질문

특정 장비와 모델에서 확인한 사실을 실제 배포 범위, 여러 리전의 요청 경로, 다른 환경으로 옮길 수 있는 경계까지 어떻게 연결해야 합니까?

## 글과 역할

- `ai/sionic-glm-b300` · reference · 특정 TP8 실험의 수치와 병목을 근거 범위 안에서 읽기
- `ai/qwen36-long-context-deployment` · practice · 긴 입력의 위치·메모리·회수 품질을 릴리스 단위로 승인하기
- `ai/region-agnostic-inference-routing` · concept · 모델·리전·클러스터·복제본 선택의 책임과 실패 경계
- `ai/inference-stack-standard-levels` · concept · 표준 API·요청 경로 구현·운영 선언의 이식성 구분

## 이번 변경

- [x] 네 글 위에 같은 부모 지도와 현재 위치를 표시합니다.
- [x] 핵심 시각화를 첫 설명과 가정보다 앞에 둡니다.
- [x] 각 글에서 확인한 사실을 부모 지도에 되돌립니다.
- [x] 개념·실무·참고 글의 책임을 지도에서 구분합니다.
- [x] 자동으로 시작되던 장면을 명시적 재생으로 바꿉니다.
- [x] JavaScript가 없어도 장면 순서와 결론을 읽을 수 있는 정적 목록을 둡니다.

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

로컬 Chromium 결과는 `output/playwright/ai-serving-batch-11-final/summary.json`에 남겼습니다. 네 경로×두 viewport 모두 부모 지도와 반환 지도가 한 번씩 나오고, 현재 링크가 실제 경로와 일치하며, 문서와 시각화의 가로 넘침 및 console 오류가 0입니다. 장면은 사용자가 재생하거나 넘기기 전에는 바뀌지 않고, reduced-motion과 JavaScript 비활성 상태에서도 같은 순서와 결론을 확인할 수 있습니다.
