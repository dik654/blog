# AI 서빙 묶음 09 · 모델 계산을 여러 GPU에 나누기

## 부모 질문

한 모델의 계산과 가중치를 여러 GPU에 나눌 때 무엇을 나누며, 그 결과 생기는 통신을 실제 GPU 연결 위에 어떻게 배치해야 합니까?

## 글과 역할

- `ai/expert-parallelism-moe-systems` · concept · 선택된 expert와 token의 왕복
- `ai/tensor-and-pipeline-parallel-inference` · concept · TP·PP·DP·context parallel의 분할 축과 통신
- `ai/parallelism-strategy-and-placement` · practice · 물리 연결과 부하를 넣은 배치 판단
- `ai/disaggregated-prefill-decode-serving`은 요청 단계 사이의 상태 인계 문제이므로 다음 묶음으로 분리합니다.

## 이번 변경

- [x] 세 글 위에 같은 부모 지도와 현재 위치를 표시합니다.
- [x] 핵심 동작 시각화를 첫 설명보다 앞에 둡니다.
- [x] 각 글에서 확인한 사실을 부모 지도에 되돌립니다.
- [x] 장면 재생은 명시적 조작으로만 시작합니다.
- [x] 뷰포트를 벗어나면 재생을 멈추도록 실제 재생 대상과 관찰자를 연결합니다.
- [x] JavaScript가 없어도 장면 순서와 결론을 읽을 수 있는 정적 경로에 등록합니다.

## 검증

- [x] 변경 파일 ESLint
- [x] TypeScript 및 production build
- [x] strict topology·architecture-flow·reading-order·coverage
- [x] 390×844 모바일: 현재 위치, 가로 넘침, Viz 잘림, 장면 경계
- [x] 1440×900 데스크톱: 현재 위치, 가로 넘침, Viz 잘림
- [x] 키보드 이전·다음·재생 및 뷰포트 이탈 정지
- [x] reduced-motion
- [x] JavaScript 비활성 상태
- [x] 공개 경로와 GitHub Pages 배포

## 로컬 검증 결과

- 세 경로를 390×844와 1,440×900에서 검사했고 문서·모든 `data-viz-canvas`의 가로 넘침과
  console warning/error가 0이었습니다.
- 첫 동작 그림에 초점을 둔 뒤 `ArrowRight`를 누르면 각 글의 두 번째 장면으로 이동했습니다.
  Space로 재생한 뒤 화면 밖으로 이동하면 그 장면을 유지한 채 `재생` 상태로 멈춥니다.
- reduced-motion에서는 첫 장면과 `재생 꺼짐`을 유지합니다. JavaScript 비활성 상태에서는
  조작 대신 모든 장면의 이름과 결론을 순서대로 표시합니다.
- 시각화 안의 중첩 `<noscript>`가 페이지 전체 정적 fallback을 조기에 끝내던 문제를 발견했습니다.
  정적 장면 목록은 `static-reading-only`로 렌더하고 앱의 `#root` 안에서만 감추도록 바꿨습니다.
  그 결과 JavaScript가 켜진 화면의 본문 중복과 정적 읽기 모드의 장면 누락을 함께 제거했습니다.
- GitHub Pages run `40106525022`가 전체 감사·build·990개 공개 글 브라우저 검사를 통과했습니다.
  세 공개 URL을 390×844에서 다시 열어 HTTP 200, 부모 지도·현재 위치·반환 지도, 문서와 모든
  시각화의 가로 넘침 0, console warning/error 0을 확인했습니다. 결과는
  `output/playwright/ai-serving-public-batch-09-10/summary.json`에 남겼습니다.
