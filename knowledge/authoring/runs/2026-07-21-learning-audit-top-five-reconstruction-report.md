# 상위 5개 학습 흐름 재구성 기록

## 목표

`2026-07-21-learning-flow-audit`에서 점수가 가장 높았던 다섯 문서를, 단순히 감사 규칙을 통과시키는 것이 아니라 실제 독자가 `질문 → 최소 개념 → 구조 → 판단 기준 → 다음 글`로 이동할 수 있게 고쳤다.

- `fm-boundary-practice`: 경계를 자르는 일반 방법을 가르치는 학습 글
- `geth-blob-tx-fm`: 위 방법을 실제 코드에 적용하는 사례 글
- `stable-diffusion-open-models`: 현재 공개 이미지 모델에서 구현 기준선과 원리로 내려가는 학습 글
- `geth-test-units`: 큰 코드베이스에서 증거 위치를 찾는 탐색 레지스트리
- `vllm-test-units`: request lifecycle의 고장 경계를 찾는 탐색 레지스트리

## 처음 관찰한 문제

1. 다섯 글 모두 요약, 난이도, 예상 시간, 선행지식 중 일부가 비어 있어 글의 역할을 입구에서 알 수 없었다.
2. 핵심 질문, 용어의 책임 경계, 읽은 뒤 할 수 있어야 할 판단이 본문에 명시되지 않았다.
3. 표가 넓은 두 레지스트리는 모바일에서 스크롤해야 했고, 행을 읽어도 상세 설명으로 내려가는 원리가 약했다.
4. Stable Diffusion 글은 제목 다음에 장면이 너무 빨리 나오고, 860px SVG를 모바일에 축소해 노드가 읽히지 않았다. 첫 데스크톱 장면은 아직 나타나지 않은 노드 때문에 빈 공간이 컸다.
5. core article route가 `ArticleLayout`에 article metadata를 전달하지 않아 metadata를 작성해도 실제 화면에는 나타나지 않았다.
6. `geth-blob-tx-fm`은 `getCoreItem`에 slug 대신 제목을 넘겨 연결 개념을 잃고 있었다.
7. 감사 스크립트가 default export 바깥의 재사용 `Table` 함수 정의를 본문의 첫 표로 오인했다.

## 역할을 먼저 분류한 이유

모든 문서를 같은 장문 강의 형식으로 바꾸면 레지스트리의 검색성이 사라진다. 따라서 먼저 문서가 답해야 할 질문을 나눴다.

- 학습 글: “왜 그런가, 어떤 순서로 계산되는가, 다른 경우에 어떻게 판단하는가?”
- 레지스트리: “어느 책임 경계가 고장 났고, 어떤 코드·테스트·명령으로 내려가야 하는가?”

`geth-test-units`와 `vllm-test-units`는 처음부터 끝까지 읽는 강의가 아니라 탐색 도구라고 본문에 선언했다. 표의 한 행은 설명의 끝이 아니라 상세 문서로 내려가는 주소다.

## 본문만으로 풀 수 있어야 하는 내부 검증 문제

이 문제들을 공개 퀴즈로 넣지 않았다. 초안을 평가하는 비공개 acceptance test로 사용했다.

1. 상태 DB를 읽지 않는 geth 함수가 Blob transaction의 무엇을 거절할 수 있고, nonce와 balance는 왜 거절할 수 없는가?
2. `commitment hash mismatch`와 `KZG proof failure`는 검증 순서와 책임이 어떻게 다른가?
3. Stable Diffusion에서 checkpoint, scheduler, VAE, text encoder를 바꿀 때 각각 어느 tensor 계약이 바뀌는가?
4. 512px에서 1024px로 올릴 때 latent 위치 수와 attention 비용이 왜 같은 비율로 증가하지 않을 수 있는가?
5. vLLM 응답 지연을 API, scheduler, KV allocation, forward, sampling 중 어디에서 시작해 좁힐 것인가?
6. go-ethereum reorg 오류와 RPC contract 오류를 같은 테스트 묶음으로 다루면 안 되는 이유는 무엇인가?

각 문제의 답에 필요한 전제, 구조, 실패 경계, 실행 증거와 다음 문서가 본문 안에 있는지를 확인했다.

## 구현 결정

### 공통 학습 구조

- metadata에 summary, level, minutes, prerequisites를 추가했다.
- `QuestionLead`로 글이 답할 한 질문을 먼저 고정했다.
- `ConceptPrimer`로 용어 정의뿐 아니라 “왜 필요한가”를 함께 적었다.
- 첫 visual은 질문과 최소 설명 뒤에 배치했다.
- `CapabilityCheck`로 독자가 수행할 수 있어야 할 판단을 적었다.
- `SourceNotes`와 이전·다음 문서 링크를 추가했다.

### 표와 모바일

- 데스크톱에서는 비교와 스캔에 유리한 table을 유지했다.
- 모바일에서는 같은 데이터를 `dl` 또는 독립 article row로 렌더해 가로 스크롤을 없앴다.
- 명령은 `whitespace-pre-wrap`과 `break-all`을 사용해 컨테이너를 밀지 않게 했다.
- `대표 테이블 33개` 하드코딩은 계산된 `totalUnits`로 바꿨다.

### Stable Diffusion 장면

- 첫 장면을 제목 바로 아래가 아니라 질문·개념·실행 그래프 설명 뒤로 옮겼다.
- 모바일에서 860px SVG를 축소하지 않는다. 다섯 실행 단계를 세로 흐름으로 보여 주고 현재·완료·다음 상태를 구분한다.
- 데스크톱에서는 전체 실행 그래프를 항상 남기고 현재까지의 단계만 높은 대비로 표시한다.
- `VAE decoder → RGB image` 연결을 명시했다.
- 긴 tensor 수식의 annotation을 한국어로 줄이고, visible KaTeX box가 컨테이너 폭 안에 드는지 브라우저에서 측정했다.

### 레지스트리 링크 정확도

- tracing, journal, metrics 행은 metrics/tracing 상세 문서로 보낸다.
- RPC, WebSocket, node lifecycle 행은 RPC/node 상세 문서로 보낸다.
- vLLM의 절대 코드 줄 번호에는 `2026-07-21 UTC` 기준 시각을 표시했다.

### 감사기 수정

재사용 컴포넌트 정의가 아니라 default-export render body를 검사하도록 범위를 좁혔다. 설명보다 먼저 실제로 렌더되는 table만 `table-before-explanation`으로 판정한다. 출력 파일 날짜도 실행일의 KST 날짜를 사용한다.

## 출처와 의도

- [Hugging Face Diffusers Stable Diffusion pipeline](https://huggingface.co/docs/diffusers/api/pipelines/stable_diffusion/overview): tokenizer, text encoder, denoiser, scheduler, VAE의 실행 책임을 확인했다.
- [Hugging Face Diffusers Stable Diffusion 3](https://huggingface.co/docs/diffusers/api/pipelines/stable_diffusion/stable_diffusion_3): SD3 계열의 transformer/text encoder pipeline을 확인했다.
- [Stability AI SD3 research](https://stability.ai/news/stable-diffusion-3-research-paper): MMDiT와 rectified-flow 계열 전환 설명의 1차 출처로 사용했다.
- [Stability AI SD3.5](https://stability.ai/news/introducing-stable-diffusion-3-5): SD3.5의 공개 계열과 구현 차이를 현재 설명에 연결했다.
- [EIP-7594](https://eips.ethereum.org/EIPS/eip-7594): blob sidecar wrapper version과 cell proof 경계를 확인했다.
- [go-ethereum repository](https://github.com/ethereum/go-ethereum): 함수, 테스트, 실행 명령의 원본이다.
- [vLLM architecture](https://docs.vllm.ai/en/latest/design/arch_overview/): Engine core, worker와 request lifecycle의 책임을 확인했다.
- [vLLM prefix caching](https://docs.vllm.ai/en/latest/design/prefix_caching/): KV block과 prefix reuse의 공식 설계 근거다.

출처는 문장을 장식하기 위해 붙이지 않았다. 바뀔 수 있는 모델 구조, protocol fork, 함수 위치를 로컬 설명과 분리해 다시 검증할 수 있게 하기 위해 붙였다.

## Claude 독립 검토

첫 Claude 실행은 응답 없이 멈춰 종료했다. 두 번째 실행은 읽기 전용, 다섯 파일 한정, 120초 제한으로 수행했다. 서사, 레지스트리 역할, 출처 연결은 통과했고 다음 유효 결함을 찾았다.

- tracing/RPC 레지스트리 행의 잘못된 기본 상세 링크
- vLLM 절대 줄 번호의 snapshot 날짜 누락
- geth 대표 단위 개수 하드코딩
- Blob table cell React key 안정성
- 모바일 tensor 수식 annotation 폭

모두 수정한 뒤 lint와 브라우저 검사를 다시 실행했다.

## 검증 결과

- targeted ESLint: 통과
- `git diff --check`: 통과
- `npm run build`: 통과, 기존 large chunk warning만 남음
- learning-flow audit: registered 567, release blockers 0, review needed 3
- 이번 다섯 문서: 모두 score 0, issues 없음
- Playwright: 390×844, 768×1024, 1440×900에서 5개 경로, 총 15/15 통과
- 공개 호스트에서도 같은 15개 검사를 반복해 15/15 통과
- 확인 항목: 질문·개념·시각화 DOM 순서, raw LaTeX 부재, visible KaTeX overflow, document overflow, visual overflow, 모바일 table 부재, console/page error
- 직접 시각 검토: Stable Diffusion top·tensor·pipeline, geth registry top·coverage
- 배포: `cm-blog.service`를 2026-07-21 14:03:43 KST에 재시작하고 active 상태를 확인

`npm run build:tsc`는 이번 변경과 무관한 기존 타입 오류 때문에 전체 통과하지 않는다. 오류는 `articlesZkpMath2`, backprop Dropout, cnn BiasDetail, data augmentation, FFT, llm-serving, regularization, robot localization/motion planning, `WafVpn`에 남아 있다. Vite production build와 이번 변경 파일 lint는 통과했다.

## 4B·9B 모델로 재현하는 작업 분해

### 4B가 맡을 수 있는 좁은 작업

1. registry에서 slug, title, summary, level, minutes, prerequisites를 구조화한다.
2. default export 안에서 질문, primer, visual, capability, sources, local links의 존재와 순서를 검사한다.
3. 표·수식·명령의 overflow 후보를 정규식과 DOM 수치로 수집한다.
4. 출처 URL, snapshot 날짜, 코드 위치처럼 변할 수 있는 claim을 별도 목록으로 뽑는다.

4B는 글의 기술적 책임 경계와 출처의 적합성을 최종 판정하지 않는다.

### 9B가 맡을 수 있는 한 문서 작업

1. 목표 독자와 문서 역할을 `teaching | registry | reference` 중 하나로 고른다.
2. 가장 어려운 내부 검증 문제를 3~6개 만든다.
3. 제공된 1차 출처 묶음만 읽고 각 문제에 필요한 전제를 추출한다.
4. `질문 → 최소 개념 → 인과 구조 → 수식/코드 → 실패 경계 → 도달점 → 다음 글` 순서로 한 문서만 고친다.
5. 답을 직접 쓰지 않고, 본문만으로 내부 검증 문제를 풀 수 있는지 역검사한다.

### 강한 모델 또는 인간 통합자가 맡을 일

- 분야 간 최소 바닥을 어디에서 끊을지 결정한다.
- 현재 claim을 1차 출처와 대조한다.
- registry와 teaching article을 통폐합할지 결정한다.
- 브라우저에서 실제 정보 밀도와 장면 가독성을 본다.
- 배포 뒤 public route를 다시 검사한다.

기계 판독 가능한 사건 기록은 `2026-07-21-learning-audit-top-five-reconstruction.json`에 있다.

## 다음 배치

현재 `reviewNeeded`에 남은 세 글은 다음 순서다.

1. `comfyui-edit-models-flux-qwen`
2. `discrete-log`
3. `qwen-korean-consistency`

`enrichmentBacklog` 546은 즉시 결함 목록이 아니라 장기 보강 목록이다. 다음 배치도 점수만 낮추지 않고 문서 역할과 실제 독자 경로를 먼저 판정한다.
