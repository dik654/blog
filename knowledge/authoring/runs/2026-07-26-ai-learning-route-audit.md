# AI 학습 경로 전수 감사와 재구성 기록

- 기준일: 2026-07-26
- 범위: `/lab/blog/ai`의 정보 구조, 공개 아티클 283개, 학습 경로, 탑다운 연구 트랙, 본문 연결, Viz·KaTeX 품질
- 상태: 진행 중인 실행 기록. 완료 선언이 아니라 다음 배치가 같은 판단 기준을 이어받기 위한 기준선이다.

## 1. 목표를 어떻게 해석했는가

블로그의 목표는 “AI 용어를 많이 모은 사전”이 아니다. 독자가 현재 논문·연구 글·산업 시스템을 먼저 고른 뒤 다음 질문에 답할 수 있어야 한다.

1. 지금 무엇이 달라졌는가?
2. 그 변화가 해결하는 병목은 무엇인가?
3. 실행 순서와 데이터 흐름은 어떻게 되는가?
4. 이해에 꼭 필요한 최소 수학·과학·공학 기반은 무엇인가?
5. 어떤 원문 근거가 이 설명을 지지하는가?
6. 코드·실험·운영에서 어떻게 검산하는가?

이 목표 때문에 “가장 오래된 역사부터 모두 읽기”와 “최신 모델 이름만 나열하기”를 모두 배제한다. 최상단은 계속 갱신하되, 아래로는 현재 주장을 설명하는 최소 기준 논문과 최소 기반에서 멈춘다.

## 2. 입력을 어떻게 정규화했는가

작은 모델도 같은 감사를 수행할 수 있도록 먼저 입력을 네 종류의 구조화된 목록으로 바꾼다.

| 입력 | 정규화 필드 | 감사 질문 |
|---|---|---|
| Category·Subcategory tree | slug, parent, depth, stage, order | 같은 개념이 형제로 중복되거나 조상이 사라지지 않는가? |
| Article registry | slug, subcategory, summary, level, minutes, prerequisites, learningPath, role | 글의 질문·난이도·선행·다음 이동이 명시되는가? |
| Learning path | id, ordered steps, step question | 처음부터 끝까지 하나의 문제를 해결하는가? |
| Top-down research track | current, canonical, concepts, foundations, implementation, stop rule, promotion rule | 최신에서 최소 바닥과 구현까지 닫히는가? |

2026-07-26 최초 로컬 import 기준:

- 감사 입력의 AI 아티클: 284개. 이 중 1개는 공개 학습 글이 아닌 `scene-engine-test`였다.
- 공개 레지스트리 정리 후 AI 아티클: 283개
- 공개 독립 설명 글: 222개
- 선택 원문 글: 61개
- 전체 learning path: 112개
- AI top-down research track: 18개
- AI 하위 subcategory: 92개
- 메타데이터가 하나 이상 비어 있는 독립 글: 43개
- learning path와 top-down dependency 어디에도 직접 연결되지 않은 공개 독립 글: 13개

1차 연결·공개 정리 뒤 현재 기준:

- 공개 AI 아티클: 283개
- 전체 learning path: 115개
- AI top-down research track: 18개
- 메타데이터가 하나 이상 비어 있는 독립 글: 36개
- learning path와 top-down dependency 어디에도 직접 연결되지 않은 공개 독립 글: 10개

감소 원인은 글을 임의 삭제한 결과가 아니다. `scene-engine-test`만 공개 registry에서 제외했고, Z-Image·Illustrious·Wan 사례는 실제 제작 경로와 메타데이터를 부여했다.

## 3. 유지·통합·추가 판정 규칙

### 유지

다른 글로 대체할 수 없는 독립 질문이 있고, URL 자체가 검색·참조 단위인 글은 유지한다. 예를 들어 KV cache, Sparse MoE, Diffusion, PID처럼 독자가 별도로 다시 열 질문은 하나의 글로 남긴다.

### 흐름 속에 통합

용어 정의, 얕은 fact sheet, 모델 이름 표처럼 독립적인 결론이 없고 상위 글의 실행 흐름 안에서만 의미가 생기는 글은 상위 본문으로 녹인다. 원 URL이 이미 공유되었다면 redirect 또는 얇은 handoff를 유지한다.

### 새 글 추가

다음 중 하나를 만족할 때만 추가한다.

- 최신 상단 연구가 기존 경로에 없던 계산·메모리·학습 신호·평가 계약을 도입했다.
- 기존 글만으로 자체 검증 문제를 풀 수 없다.
- 서로 다른 책임을 한 글에 합치면 독자가 잘못된 인과를 학습한다.
- 새 제품명이 아니라 재사용 가능한 새 개념이 생겼다.

### 최소 역사 바닥

“더 오래된 논문이 존재한다”는 이유만으로 필수 경로에 넣지 않는다. 현재 구조를 더 이상 설명하지 못하는 지점에서 멈추고, 그 아래는 선택 원문으로 숨긴다.

## 4. 이번에 발견한 구조 문제

### 4.1 `LLM 아키텍처`와 `LLM`이 루트 형제로 노출됨

기존 루트는 `LLM 아키텍처`와 `LLM`을 같은 단계에 놓았다. 그러나 구조, pre-training, post-training, interpretability, on-device, serving은 모두 LLM을 읽는 독립 분기다. 형제 배치는 “LLM”이 구조를 제외한 나머지를 뜻하는 것처럼 보이게 했다.

결정:

- `LLM`을 하나의 목표 진입점으로 둔다.
- 그 아래에 `LLM 아키텍처`를 첫 분기로 넣는다.
- 나머지 다섯 분기와 합쳐 여섯 독립 경로로 설명한다.
- 기존 `?sub=ai-llm-architectures` URL과 아티클 URL은 그대로 유지한다.

### 4.2 깊은 아티클에서 사이드바 조상이 열리지 않음

기존 `SubcategoryItem`은 활성 아티클의 직계 자식만 검사했다. `LLM → LLM 아키텍처 → KV와 긴 문맥`처럼 깊이가 3 이상이면 상위 항목이 자동으로 열리지 않았다.

결정:

- 활성 아티클의 subcategory를 찾는다.
- 재귀 `containsSubcategory`로 모든 조상을 판정한다.
- 390px와 1440px 직접 진입 테스트에서 두 disclosure와 활성 leaf를 검증한다.

### 4.3 본문 breadcrumb가 중간 계층을 생략함

사이드바를 고쳐도 본문 상단은 `AI → 목표 분야 → KV와 긴 문맥`만 보여 주었다.

결정:

- 실제 subcategory tree에서 전체 trail을 계산한다.
- `AI → 목표 분야 → LLM → LLM 아키텍처 → 02 · KV와 긴 문맥`을 표시한다.
- 모바일에서는 줄바꿈을 허용하고 가로 overflow는 허용하지 않는다.

### 4.4 루트의 `경로 21`이 실제 의미와 다름

표시된 숫자는 learning path 수가 아니라 최상위 subcategory 수였다.

결정:

- 라벨을 `진입점`으로 바꾼다.
- LLM 중복을 합친 뒤 AI 진입점은 20개다.
- 별도의 `/lab/blog/map`은 전체 연구 흐름 지도 역할을 유지한다.

### 4.5 목표별 연결 데이터가 루트에서 보이지 않음

`topdownResearchTracks`에는 이미 current, canonical, concepts, foundations, implementation, stop rule과 promotion rule이 있었다. 그러나 이 정보는 목표 페이지에 들어간 뒤에만 보여 루트에서는 전역 4단계를 사용자가 직접 연결해야 했다.

결정:

- 목표 카드에 `현재 연구 → 기준 논문 → 핵심 N → 기반 N → 구현 N` 계약을 노출한다.
- `읽는 방법`은 `공통 읽기 프레임`으로, 별도 `/map`은 `연구 트랙 지도`로 이름과 역할을 분리한다.
- 루트의 기반·구현은 전 분야 공통 선행과목이 아니라 목표 경로가 선택한 링크의 보강 허브임을 명시한다.
- 모든 AI 목표는 직접 top-down track을 갖거나 각 즉시 자식 분기가 track을 가져야 한다.

### 4.6 잘못된 sidebar slug가 조용히 사라짐

기존 resolver는 정의에 없는 slug를 조용히 버리고 미분류 항목을 `그 밖의 주제`로 밀었다. 실제로 암호학 stage에 존재하지 않는 최상위 `mpc`가 선언돼 있었지만 UI에서 사라져 발견되지 않았다.

결정:

- stage slug 누락·중복을 즉시 실패시킨다.
- cluster는 stage의 정확한 partition이어야 한다.
- 미분류 최상위 subcategory도 즉시 실패시킨다.
- MPC는 별도 최상위가 아니라 `지갑 키 관리` 내부 구현 단계라는 실제 tree에 맞춘다.

## 5. 현재 메타데이터와 연결 공백

### 최초 우선 연결 대상

| 묶음 | 글 | 판정 방향 |
|---|---|---|
| 공통 관점 | `systems-foundation-map` | 모든 글의 선수 과목이 아니라 읽는 방법 stage의 단일 출발점으로 유지 |
| LLM 구조 | `moe-ssd-streaming` | Sparse MoE의 “저장 계층” 선택 사례로 연결 |
| 수학·신호 | `fft` | 신호와 시스템의 선택 확장으로 연결 |
| 내부 테스트 | `scene-engine-test` | 공개 AI 목록에서 제거하거나 명시적 개발 전용 registry로 이동 |
| 오픈 미디어 | `wan22`, `z-image`, `illustrious-xl` | 모델 나열이 아니라 Image/Video runtime과 제작 목표의 사례로 연결 |
| Agent | `prompt-engineering`, `skills-anatomy`, `agent-frameworks`, `claude-code`, `openclaw-assistant`, `agent-devlog-patterns` | agent loop·tool action·product case·운영 기록의 책임별 경로로 재배치 |
| Post-training | `qwen-korean-consistency` | 언어별 verifier·held-out slice 사례로 구현 경로에 연결 |

`scene-engine-test`를 제외한 글은 자동 삭제하지 않는다. 먼저 질문이 독립적인지 읽고, 유지하면 summary·난이도·시간·선행·path를 채운다.

오픈 미디어 세 사례를 연결하고 내부 scene test를 제외한 뒤 현재 직접 연결 공백은 다음 10개다.

`systems-foundation-map`, `moe-ssd-streaming`, `fft`, `prompt-engineering`, `skills-anatomy`, `agent-frameworks`, `claude-code`, `qwen-korean-consistency`, `openclaw-assistant`, `agent-devlog-patterns`

### 메타데이터 공백

큰 묶음은 다음과 같다.

- Claw Code 16개: learning path는 있지만 summary·level·minutes·prerequisites가 없다.
- 오픈 이미지·비디오 사례 글: 오래된 모델별 페이지가 current-first 제작 경로와 느슨하게 연결돼 있다.
- Agent의 오래된 개별 글: 현재 runtime 경로와 연결되지 않은 채 남아 있다.
- DeZero 3개와 실전 CV 4개: 구현 순서 또는 prerequisites가 비어 있다.

메타데이터만 일괄 채우지 않는다. 먼저 글의 질문과 실제 본문 깊이를 읽은 뒤, 얕으면 통합하고 살아남은 글에만 메타데이터를 부여한다.

## 6. 자체 난문을 이용한 본문 깊이 검증

문제를 본문에 그대로 싣는 것이 목적이 아니다. 저자가 먼저 어려운 문제를 만들고, 완성된 본문만 읽은 사람이 풀이 전략에 도달할 수 있는지 검사한다.

### LLM 구조 검증 문제

128K context를 지원하는 두 모델이 있다. 하나는 GQA와 local/global attention을 쓰고, 다른 하나는 MLA와 sparse attention을 쓴다. Batch size, head 수, latent 차원과 global layer 간격이 주어졌을 때:

- KV 저장량을 비교할 수 있는가?
- 직접 볼 수 있는 token과 state로 전달되는 정보를 구분하는가?
- MoE 총 파라미터와 token당 활성 계산을 혼동하지 않는가?
- SSD expert streaming이 dense model에는 왜 그대로 적용되지 않는지 설명하는가?

현재 LLM architecture 6단계 경로는 이 문제의 계산 축을 제공해야 한다.

### 오픈 미디어 검증 문제

12GB GPU, 동일 캐릭터 8명, 20초 영상, 수정 가능한 workflow와 상업 배포 근거가 필요한 프로젝트에서:

- Image와 Video branch를 언제 분리하는가?
- Krea·Ideogram 같은 제품/서비스와 실제 공개 weight·runtime을 구분하는가?
- prompt, reference, control, LoRA, full fine-tuning 중 최소 개입을 고르는가?
- workflow snapshot, model artifact, seed, sampler, resolution, frame budget을 재현 manifest로 남기는가?

이 문제를 풀 수 없다면 모델 이름을 더 추가하는 것이 아니라 제작 계약과 provenance 본문을 보강해야 한다.

### Agent 검증 문제

외부 문서를 읽고 shell과 browser를 사용하는 장기 agent가 prompt injection을 만났고, 중간 worker 하나가 timeout 뒤 늦게 성공했다.

- model, harness, sandbox, permission, durable state의 책임을 분리하는가?
- tool call 성공과 실제 effect evidence를 구분하는가?
- retry가 중복 side effect를 만들지 않게 idempotency를 설계하는가?
- worker 결과를 provenance와 함께 병합하고 release gate를 통과시키는가?

Agent 글은 프레임워크 이름보다 이 실행 계약을 해결해야 한다.

## 7. 본문·수식·Viz 공통 품질 계약

### 본문

1. 섹션 제목 다음에 맥락 없이 Scene을 두지 않는다.
2. 먼저 독자가 답할 질문과 직관을 설명한다.
3. 전문 용어는 처음 등장할 때 쉬운 말, 역할, 필요한 이유를 함께 쓴다.
4. 원문 claim, 저자의 해석, 구현 권고를 구분한다.
5. 마지막에는 다음 글로 넘어가는 조건을 명시한다.

### KaTeX

1. `\theta`, `\tau`, `\dot{s}` 같은 raw LaTeX가 화면에 남지 않아야 한다.
2. 수식은 화면 너비 안에서 읽을 수 있어야 하며 박스 밖으로 자르지 않는다.
3. 각 주요 수식에는 한글 FormulaNote를 둔다.
4. `underbrace` 설명도 가능한 한 한글로 쓰고, 각 연산이 왜 필요한지 설명한다.
5. 기호 사전만 두지 않고 실제 수치나 shape로 한 번 검산한다.

### Viz

1. 본문이 먼저 설명하고 Viz는 그 설명을 조작·검산한다.
2. 장식용 직선과 두꺼운 색 띠를 피하고 정보 계층을 간격·정렬·타입으로 만든다.
3. 390·768·1440px에서 내부 수평 스크롤, 잘린 control, 겹친 label이 없어야 한다.
4. 변화하는 control은 실제 모델·수식·판정 결과를 바꿔야 한다.
5. 색만 바꾼 것을 개선으로 보지 않는다. 선 굵기, 연결 경로, whitespace, label 길이, focus, contrast를 함께 검사한다.

## 8. 작은 모델용 분할 실행 절차

4B·9B 모델에는 전체 283개 공개 글을 한 번에 맡기지 않는다.

### Pass A · Inventory

입력: 한 category tree와 article metadata만 제공한다.  
출력: 중복 slug, orphan, metadata gap, 최대 깊이, 공개되면 안 되는 internal item.

### Pass B · Route contract

입력: 한 top-down track, 관련 learning path, 해당 글의 제목·요약만 제공한다.  
출력: current → concepts → minimum foundation → source → implementation 순서와 stop rule.

### Pass C · Article reconstruction

입력: 한 글, 직접 연결 글 2개, 원문 2–5개를 제공한다.  
출력: 독자 질문, 3–5개 깊은 섹션, 수식별 FormulaNote, prose-to-Viz spec, 출처 locator.

### Pass D · Adversarial problem

입력: 완성 초안만 제공한다.  
출력: 초안의 사실만으로 풀 수 있어야 하는 고난도 문제, 필요한 inference, 막히는 문장.

### Pass E · Independent verifier

입력: 초안, source locator, 렌더 screenshot을 제공한다.  
출력: MUST/SHOULD, 사실 근거, 수식 raw/overflow, Viz clipping, 다음 경로 단절.

각 pass는 JSON처럼 고정된 필드로 넘기고, 한 모델이 작성과 최종 승인을 동시에 맡지 않는다.

## 9. 구현된 1차 수정

변경 파일:

- `src/content/ai/index.ts`
- `src/content/sidebar-learning-structure.ts`
- `src/components/sidebar/SubcategoryItem.tsx`
- `src/components/sidebar/CategoryItem.tsx`
- `src/components/ArticleLayout.tsx`
- `src/pages/CategoryPage.tsx`
- `src/pages/category/SubcategoryCard.tsx`
- `tests/sidebar-information-architecture.spec.ts`
- `tests/sidebar-learning-structure-contract.spec.ts`
- `tests/topdown-research-schema-contract.spec.ts`
- `tests/systematic-learning-map.spec.ts`

검증:

- 변경 파일 ESLint: 통과
- `git diff --check`: 통과
- Sidebar·systematic map Playwright: 13/13 통과
- Breadcrumb 포함 Sidebar 회귀: 10/10 통과
- 390·768·1440 screenshot: LLM 루트 중복 없음, 깊은 조상 자동 열림, breadcrumb 전체 trail 확인
- `scene-engine-test`: 개발용 소스는 보존하고 공개 article registry에서 제외
- 목표 카드에서 current·canonical·concept·foundation·implementation 연결 계약 노출
- stage·cluster·top-level partition 오류와 끊어진 research dependency를 정적 테스트로 차단
- 전체 `tsc -b`: 현재 작업 트리의 기존 다른 파일 오류 28건 때문에 실패. 이번 변경 파일에서는 새 오류가 보고되지 않았다.

## 10. 병렬 Claude 검증 상태

최초 세 요청은 Context Manager 500 이후 180초 제한에서 모두 code 143 timeout으로 종료됐다. 검증을 다음 세 묶음으로 줄여 다시 실행했다.

1. IA·sidebar·breadcrumb와 LLM 계층
2. 284개 글의 학습 연속성·유지·통합·추가 우선순위
3. production 390·768·1440 UX, Viz, KaTeX

### IA 감사

넓은 요청은 timeout됐고 세 분할 요청은 성공했다. 판정은 FAIL이었다. 핵심은 전역 4단계가 목표별 edge를 루트에서 드러내지 못한다는 점, 공통 읽기 프레임과 별도 연구 지도의 역할이 겹쳐 보인다는 점, 잘못된 slug가 조용히 사라진다는 점이었다. 이번 배치에서 목표 카드 계약, 명칭 분리, fail-fast resolver와 정적 edge 검사를 반영했다.

### Production UX·Viz·KaTeX 감사

세 분할 요청이 성공했다.

- 대표 6개 페이지의 document horizontal overflow와 내부 horizontal scroller는 0이었다.
- 화면에 보이는 raw `\theta`, `\frac`는 없었고 FormulaNote는 한국어였다.
- 대표 Viz 앞에는 설명 문단이 있었으며 Diffusion은 제목 바로 아래 scene이 나오지 않았다.
- Worker Boot의 optional receipt Some/None 문구와 긴 timeout wrapping은 소스와 production 직접 검증에서 닫혔다.
- LLM architecture gallery의 외부 raster diagram 5개는 1440px에서도 약 430px라 내부 label을 읽기 어렵다.
- 같은 페이지의 모바일 수식은 0.52–0.67배까지 줄어 약 10px가 되므로 수식을 의미 단위 여러 줄로 재구성해야 한다.
- Neural Network·Perceptron·Backprop Viz는 768px에서 폭을 충분히 활용하지 못하고 세로로 길어진다.
- 색만 바꾸는 수정이 아니라 neutral base, 의미색, connector 굵기·곡률, 단계별 focus와 spacing rhythm을 다시 설계해야 한다.

### 본문 깊이 감사

넓은 전체 구조 요청 1건과 Robot 본문 3개 통합 요청 1건은 timeout됐다. 둘 다 더 작은 범위로 나눴고, 최종적으로 16개 분할 호출이 성공했다. 전체 판정은 PARTIAL이다.

- 통과한 경로: Vision promptable/detection, LLM interpretability, Open-R1, POMDP state estimation, safe constrained RL.
- 약한 경로: RL의 일부 branch가 한 step이라 학습 경로보다 단일 링크에 가깝다.
- Open-R1은 자체 난문을 닫지만, reasoning frontier·RLVR·RLHF, pre-training 3편, architecture gallery는 수식에 실제 숫자 대입과 go/no-go threshold가 부족하다.
- Robot trajectory는 `\tau=a(s)\ddot{s}+b(s)\dot{s}^2+c(s)`의 계수 유도 bridge와 end-to-end 수치 release gate가 부족하다.
- ROS 2 runtime은 causal chain은 있으나 수치 timing budget, failure injection과 release gate가 부족하며, 별도 학습 경로에는 camera·SLAM·scene·planning·control이 중복 삽입돼 있었다.
- LTX·Wan·Animation은 registry와 learning path를 재확인해 고아가 아님을 검증했다.
- Agent는 `ai-agents`, `ai-agents-ops`, `ai-agents-claw`, `ai-practical-llm`에 책임이 분산돼 소유권 정리가 필요하다.

P0는 Agent 소유권과 canonical link 정리, ROS 2 runtime 경로 정리, LLM 여섯 경로의 aggregate 규칙 통일, `olmocr-2`의 document runtime 경로 복구다. Open-model 초기 고아 판정은 제한된 registry만 읽은 오판이었고 `articlesGen.ts` 재검증 뒤 정정했다. 실패한 넓은 호출은 성공 횟수에 포함하지 않았다.

### 이번 배치에서 닫은 Claude P0

- `ai-robot-ros2-runtime`을 신호·전체 graph·runtime·Casini의 네 단계로 줄였다. Camera·SLAM·scene·planning·control은 각 domain 경로가 소유한다.
- `robot-ai-top-down`에 `motion planning → trajectory generation → feedback control → ROS 2 deadline` 직접 링크를 추가했다.
- Agent 영역을 공통 계약, 운영 증거·기록, Claw Rust 구현, LLM adapter release의 네 책임으로 다시 명명했다.
- `mcp-protocol → claw-mcp`, `llm-harness → claw-overview`, `prompt-injection-defense → claw-permissions·claw-bash`의 canonical handoff를 실제 본문 링크로 검증했다.
- Agent Ops에 `evaluation trace → decision log → telemetry → bounded recovery` 학습 경로를 추가했다.
- LLM의 Architecture·Post-training·Data·Interpretability·Efficiency·Serving 여섯 부모가 모두 같은 child article 집계 규칙을 사용하게 했다.
- `olmocr-2`를 `ai-document-runtime-current-first` 경로에 다시 연결했다.

## 11. 다음 구현 우선순위

1. 오래된 Agent 사례 글의 유지·통합 판정을 닫고 공통 계약과 특정 제품 설명이 중복되는 문단을 줄인다.
2. LLM architecture의 외부 raster를 responsive semantic diagram으로 교체하고 모바일 수식을 14px 이상 여러 줄 구성으로 바꾼다.
3. Perceptron·Neural Network·Backprop Viz에 768px 전용 2열/단계 묶음 layout을 추가한다.
4. PARTIAL 판정 글에 실제 숫자 대입, 실패 threshold, go/no-go release gate를 추가한다.
5. Robot trajectory의 dynamics 대입에서 `a(s)`, `b(s)`, `c(s)`가 나오는 계산 bridge를 쉬운 문장과 FormulaNote로 복원한다.
6. ROS 2 runtime에 end-to-end 수치 timing budget, failure injection과 release gate를 추가한다.
7. Claw·DeZero·실전 CV의 메타데이터는 본문을 읽은 뒤 살아남은 글에만 채운다.
8. 각 배치마다 Claude 독립 검증, 로컬 Playwright, production 재배포와 공개 URL 재검증까지 닫는다.

## 12. 2026-07-27 시각화·수식·원문 일치 배치

Context Manager 500과 넓은 요청 timeout으로 검증되지 않았던 항목을 세 갈래로 나눠 Claude에 다시 맡겼다. 작성과 승인을 분리하기 위해 Claude는 파일을 수정하지 않고 소스·원문·Playwright 결과만 보고했으며, Codex가 재현 뒤 수정하고 같은 범위를 다시 검증했다.

### LLM architecture gallery

외부 raster 구조도는 큰 화면에서도 본문 폭 안에서 약 430px로 줄어 내부 label을 읽기 어려웠다. 다섯 모델을 각각 고유한 native semantic diagram으로 교체했다.

- GPT-2: 48개 dense block 반복과 attention·MLP residual 우회
- Llama 3: RoPE+GQA의 query/KV 공유와 SwiGLU gate·up·down 흐름
- Gemma 3: local 5개와 global 1개의 반복
- DeepSeek V3: MLA, router, shared·selected·skipped expert와 671B/37B
- Kimi Linear: KDA state 3개와 MLA global 1개의 hybrid

Remote image는 본문 diagram이 아니라 원문 구조도 link로만 남겼다. 390·768·1440px에서 다섯 종류, 최소 label 12px, clipping·horizontal overflow 0을 검증했다.

긴 수식은 한 줄 축소 대신 실제 계산 순서로 분해했다. 한글 내부 주석을 켜기 전에는 raw 수식이 15px 이상이었지만, Provider를 활성화하자 KV byte와 MoE active ratio가 0.69배까지 줄어드는 문제가 드러났다. 이를 다음 단계로 다시 분해했다.

1. KV head 너비
2. token 하나의 K·V byte
3. batch·layer·context를 곱한 전체 cache
4. 공개 active·total parameter
5. active ratio 계산

`Article.mathAnnotations` 메타데이터를 추가해 foundation 분류가 아닌 글도 명시적으로 `MathAnnotationProvider`를 사용할 수 있게 했다. Gallery의 18개 수식은 모두 `data-math-annotated=true`, missing 0, 모바일 scale 0.8 이상, KaTeX 14px 이상을 통과했다.

### Shin–McKay trajectory 원문 경계

Claude가 Shin–McKay p.532 Eq.(1),(4b), p.533 Eq.(9b)를 다시 대조해 기존 3항식이 점성 마찰을 잃은 교육용 단순화임을 발견했다. 원문 기반 경로는 다음 4항식으로 통일했다.

`tau = a(s) s_ddot + b(s) s_dot^2 + d(s) s_dot + c(s)`

본문과 paper reconstruction에 manipulator dynamics, chain rule, `J/C/R/G` 성분, `a/b/d/c` 계수 유도를 연결했다. 3항식은 `d=0`인 frictionless 교육용 수치 예제에만 남겼다. `tau=2 s_ddot+0.5 s_dot^2+1`, `-3<=tau<=5`, `s_dot=2`를 대입해 `L=-3`, `U=1`을 직접 계산하고 derivative·bound orientation·feasible margin·discretization convergence·corner perturbation·controller replay release gate를 추가했다.

초기 수정 뒤 전역 annotation registry에 과거 3항식 고아 key 두 개가 남아 있다는 Claude 재감사 결과를 받았고, 두 key도 4항식으로 교체했다. Robot trajectory 390·768·1440px 6개 테스트는 통과했다.

### Foundation Viz의 768px 구조

Perceptron XOR, neural-network composition, backprop computational graph는 공통적으로 `lg` breakpoint 때문에 768px에서도 세로로 길었다. `md`에서 의미 있는 수평 구조로 전환하고 색 역할과 선 굵기를 다시 정리했다.

- XOR: 두 plot을 나란히 두고 rejected candidate는 하나의 dashed line만 유지
- NN composition: boundary는 neutral, learned transform은 violet, representation은 blue
- Backprop graph: node는 neutral, 방향색은 forward·backward tab에만 부여
- Connector는 hairline으로 통일하고 직접 label은 최소 12px

Claude와 Playwright 재감사에서 390은 수직 stack, 768·1440은 수평 전환, overlap·clipping·overflow 0, forward·backward toggle과 ARIA 상태가 통과했다.

### Image RAG에서 드러난 숨은 공백

전체 회귀 테스트는 처음에 `precision@K` 누락에서 중단됐다. 첫 항목을 보강한 뒤 순차적으로 확인하자 다음 학습 공백과 두 Viz 누락이 더 드러났다.

- Recall@K와 Precision@K의 recall 누락·검토 목록 오염 차이
- MRR의 첫 relevant 순위 의미
- DCG·IDCG·NDCG의 graded relevance와 이상적 순서
- `왜 norm`을 쓰는지와 방향이 같을수록 score가 커지는 이유
- offline metric과 판정자 만족도·치명적 false neighbor release gate
- 입력→좌표→후보→검증→근거 확정 흐름
- ROI와 공정 맥락을 추가할 때 false neighbor가 줄어드는 정책 실험

`DefectEvidenceLab`은 Home·End·방향키 tab 이동과 source version 보존을, `RetrievalPolicyLab`은 0.33에서 ROI·공정 맥락을 선택해 1.00과 false neighbor 0에 도달하는 변화를 구현한다. 다섯 FormulaNote는 모두 `이 식은`으로 시작하며 390·768·1440px 6개 formula/Viz QA를 통과했다.

### 로컬 검증 결과

- LLM architecture overview: 3/3
- Robot trajectory derivation: 6/6
- Foundation Viz tablet layout: 5/5
- CLIP·Image RAG formula/Viz QA: 6/6
- 관련 IA·학습 경로·runtime 계약을 합친 전체 회귀: 87/87
- 변경 파일 ESLint: 통과
- `git diff --check`: 통과

### 세 갈래 최종 Claude 재감사

Context Manager Claude가 수정 후 상태를 세 갈래로 다시 읽고, 별도 Playwright 실측과 함께 모두 `PASS`, P0 0으로 판정했다.

- LLM architecture: 수식 18/18 annotation, 390px 최소 scale 0.85·KaTeX 14.42px, 768·1440px scale 1.0, native diagram 5종, remote image·overflow·clipping·console error 0
- Robot trajectory: Shin–McKay 일반식의 점성 마찰항 보존, 3항식은 명시한 `d=0` 예제에만 존재, 390·768·1440px overflow·error 0
- Image RAG: 390·768·1440px overflow·atomic clipping·console/page error 0, 모바일 최소 display 수식 16.90px, EvidenceLab과 PolicyLab의 키보드 이동 및 `0.33/2 → 1.00/0` 상태 전환 확인

### 빌드

- `npm run build`: 통과
- Vite는 일부 기존 대형 chunk에 대한 크기 경고를 냈지만 빌드는 정상 완료됐다.
- `cm-blog.service`: 2026-07-27 01:10:40 KST 재시작, `active (running)` 확인
- 공개 URL 회귀: 56/56 통과
- 공개 URL 검증 범위: LLM architecture overview·네 branch·KV 계약, Robot trajectory, Foundation Viz, CLIP·Image RAG 수식/Viz, Sidebar·breadcrumb·학습 지도·Agent/ROS/Document AI route 계약

## 13. Agent 운영·ROS 2 qualification 후속 배치

### 왜 이 범위를 다시 열었는가

Context Manager의 넓은 Claude 호출은 180초 timeout과 500 계열 실패로 Agent 전체 소유권, ROS 2 수치 계약, 모바일 시각 회귀를 한 번에 검증하지 못했다. 실패를 “Claude 검증 완료”로 간주하지 않고 세 작업으로 분리했다.

1. Agent의 공통 계약·평가·운영 기록·Claw 구현 소유권
2. ROS 2 queue·executor·lifecycle·end-to-end qualification의 수학적 근거
3. Agent/ROS 글의 390·768·1440px 글자 크기, 수식 축소, overflow와 keyboard focus

각 Claude 세션은 파일을 수정하지 않고 P0/P1, 재현 경로와 실측만 보고했다. Codex가 원인을 재현하고 수정한 뒤 같은 세션에 다시 검증을 요청했다. 이 방식은 작은 모델에서도 “작성자와 검증자 분리”를 유지하면서 context를 한 책임 단위로 줄일 수 있다.

### Agent 책임을 어떻게 나눴는가

Agent 글을 프레임워크 이름 순서로 읽으면 동일한 loop·tool·trace 설명이 반복되고, 실패를 어느 계층에서 고쳐야 하는지 알 수 없었다. 그래서 실행 증거의 생산과 판정을 기준으로 소유권을 고정했다.

- Harness: run·parent·version, state revision, tool/gate/error owner, token·latency·cost를 trace로 발행한다.
- Eval: final state, invariant, trace와 반복 trial을 채점해 release 여부를 판정한다.
- Ops: 통과·실패 evidence를 release record, ADR, Lesson과 bounded recovery로 승격한다.
- Claw: 위 공통 계약을 Rust registry, permission, orchestration과 telemetry code path에서 검산한다.

`agent-devlog-patterns`는 단순 일지 글에서 `Trace → release record → ADR → Lesson → recovery`를 조작하는 evidence-promotion 글로 재작성했다. `agent-evaluation-trace` 마지막에는 Ops로 넘기는 명시적 링크를 추가했고, `llm-harness`의 중복 release 식은 trace emission packet으로 교체했다.

부모 Agent 허브는 처음에 상세 current-first route를 모두 보여 준 뒤 여섯 분기를 노출해, 실제 branch chooser가 모바일에서 3.15 viewport 아래에 있었다. Claude 재감사 뒤 다음과 같이 수정했다.

- 여섯 책임 분기를 상세 research route 앞으로 이동
- 자식 카드에서 동일한 `현재 연구 → 기준 논문 → 핵심 → 기반 → 구현` 문구 반복 제거
- `06`, 바깥 `01`, 제목 `00`이 겹치던 번호를 `6개 분기`와 제목 번호 하나로 정리
- `Agent Systems · 현재 좌표 → 최소 계약 → 응용·안전·평가`로 실제 읽기 순서와 설명을 일치

수정 후 branch 시작 위치는 390px에서 y=289px, 768·1440px에서 y=274px였다. 여섯 카드의 반복 research contract와 중복 href, 전체 가로 overflow는 모두 0이었다.

### ROS 2 수치 주장을 어떻게 바로잡았는가

초기 end-to-end Lab은 executor·통신 지연에 임의 penalty를 더해 `RUN/DEGRADE/CANCEL`을 표시했다. 이 값은 WCET, arrival curve, reservation이나 network bound에서 유도되지 않았으므로 safety 판정 근거가 될 수 없었다. 이를 두 수준으로 분리했다.

- Lab 09: callback work, 사용자가 제공한 executor wait·communication·trigger bound를 더하는 교육용 worksheet
- Lab 10: 정해 둔 fault fixture 집합 전체에서 local allocation, global envelope, bad command, stop, time·epoch·lifecycle gate를 검사하는 qualification

Lab 09는 입력이 분석·측정된 상한임을 사용자가 명시하기 전까지 `ILLUSTRATIVE · NOT A RELEASE GATE`만 표시한다. Lab 10의 baseline도 선택한 fixture 하나의 통과일 뿐이므로 `RELEASE CANDIDATE`를 제거하고 `BASELINE PASS · SUITE NO-GO`로 바꿨다. 현재 fixture 집합에는 DDS burst, priority inversion, clock jump, restart history와 inactive failure가 있으므로 `F` 전체를 요구하는 release 식은 거짓이다.

Queue 식은 숨은 0.8초 가정을 control로 드러냈다.

- `mu=1/C`
- `B(t)=min(N, ceil((lambda-mu)^+ t))`
- `t_full=N/(lambda-mu)^+`

기본값 `lambda=30 Hz`, `C=42 ms`, `N=8`, `t=0.8 s`에서는 `mu=23.81 Hz`, `rho=1.26`, backlog `5/8`, `t_full=1292 ms`다. 관찰 구간을 2초로 늘리면 `8/8`과 backpressure가 나타난다. 이는 빈 queue에서 시작하는 교육용 fluid approximation이며 burst·multiple callback·executor wait가 들어간 실제 worst case를 대신하지 않는다.

Priority inversion은 `35 ms`를 임의 delta로 남기지 않았다.

1. 낮은 우선순위 task가 공유 lock을 점유하는 최장 critical section으로 `B_H=35 ms`를 둔다.
2. 기존 detect·ack 경로 `12 ms`에 blocking을 더한다.
3. `R_stop=12+35=47 ms>30 ms`이므로 stop contract가 닫힌다.

긴 식은 360px에서 0.63배까지 줄어든다는 Claude P1을 받아 의미 행으로 분리했다. 360·390·768·1440px의 qualification 수식은 모두 scale 0.75 이상이어야 테스트를 통과한다. `underbrace`도 처리 용량, 표본 나이, 발행 주기, blocking, 단계 예산과 release 조건을 한글로 설명하도록 바꿨다.

### Agent Eval 시각 판독성

Workbench의 `기준/후보`, `01–05`, `INPUT/TOOL/OUTPUT`은 비교와 trace 순서를 결정하는 핵심 라벨인데 9px였다. 이를 10px로 올렸다. Release 식은 한 줄에 안전·품질·비용 gate를 모두 넣어 모바일에서 scale 0.62, KaTeX 본문 약 10.5px와 주석 약 8.4px까지 줄었다. 다음 세 행으로 나눴다.

1. 치명적 안전 조건 통과
2. 작업 품질 하한 통과
3. 운영 비용 상한 통과

Claude 재실측에서 390·768·1440px 모두 scale 1.00, 모바일 KaTeX 16.94px, 핵심 라벨 10px, overflow·clipping·console error 0을 확인했다.

### 이 배치의 독립 검증

- Agent Ops·소유권·현재 경로·ROS·Sidebar·top-down 통합 회귀: 126/126
- Agent branch-first·소유권·ROS formula/interaction 후속 회귀: 72/72
- Agent Eval 10px/scale과 ROS 360px scale 0.75 후속 회귀: 48/48
- 모든 후속 수정을 합친 로컬 통합 회귀: 128/128
- Agent 허브 Claude 재감사: P0/P1 0
- Agent Eval Claude 재감사: P0/P1 0
- ROS 2 Claude 재감사: P0/P1 0. 17개 display math의 최소 scale은 360px 0.77, 390px 0.85, 768·1440px 1.00이었다.

### 공개 배포 검증

- `npm run build`: 성공. 8,853 modules를 변환했으며 새 ROS 2 runtime asset을 포함했다.
- `cm-blog.service`: 2026-07-27 02:10:59 KST에 재시작했고 `active (running)`을 확인했다.
- 공개 URL 계약 회귀: Agent Ops·소유권·branch-first·Model Adaptation·ROS 2·Sidebar·systematic map 102/102
- 공개 회귀 viewport: 360·390·768·1440px
- 남은 build 경고: 기존 900 kB 초과 chunk 경고. 이 배치의 동작·레이아웃 실패는 아니다.

### 작은 모델에 넘길 최소 작업 패킷

4B·9B 모델에는 이 전체 문서를 주지 않고 아래 여섯 필드만 한 번에 한 글씩 준다.

```yaml
owner: harness | eval | ops | implementation
question: 이 글이 단독으로 답해야 하는 한 문장
inputs: 실제 파일 1~3개와 직접 원문 locator
claim_boundary: 측정값 | 분석 상한 | 교육용 가정 | release 판정
adversarial_check: 완성된 본문만 읽고 풀어야 하는 자체 난문
verification: 360/390/768/1440 수식 scale, overflow, interaction, source consistency
```

Verifier는 문장 완성도를 채점하지 않고 다음 순서로 실패를 보고한다.

1. 원문에 없는 숫자나 안전 판정을 찾는다.
2. 개별 fixture 통과와 suite 전체 release를 혼동했는지 찾는다.
3. 수식의 항이 어디서 왔고 왜 더하거나 곱하는지 한글 설명이 있는지 본다.
4. 조작 control이 실제 수치·판정·상태를 바꾸는지 본다.
5. 360px에서 수평 스크롤 없이 핵심 글자와 수식이 읽히는지 실측한다.
