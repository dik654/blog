# AI 정보 구조 재구성 기록

## 목적

AI 블로그의 300개 글을 한 화면에 많이 보여 주는 것이 아니라, 독자가 현재
목표에서 출발해 필요한 개념·최소 기반·원문 근거·구현으로 내려가도록 정보
구조를 다시 정리했다. 이번 묶음은 다음 사용자 증상을 직접 해결한다.

1. 같은 글과 논문이 여러 경로에서 반복되어 무엇부터 읽을지 알 수 없다.
2. Robot AI와 LLM처럼 큰 분야가 너무 평평해 세부 책임의 연결이 보이지 않는다.
3. 연구 트랙, 학습 경로와 원문 목록이 한 페이지에서 서로 경쟁한다.
4. 연구 경로에서 글로 이동하면 원래 목표와 최소 기준점으로 돌아갈 수 없다.
5. 지도에서 같은 연구 트랙이 featured와 cluster에 중복될 수 있다.

## 입력과 판단 근거

### 사용자 의도

- 최신 논문·회사 리서치를 최상단에 놓는다.
- 필요한 기반으로 내려가되, 첫 번째 충분한 기준점에서 과거 계보를 끊는다.
- 기반 논문을 이해하는 데 필요한 수학·과학·공학만 하단에 연결한다.
- 기존 독립 아티클은 유지하되, 목록 UI 때문에 전체 흐름이 깨지면 계층과
  렌더 방식을 바꾼다.
- 원문은 사라지게 하지 않지만 기본 독해 경로보다 먼저 펼치지 않는다.

### 코드와 렌더 증거

`scripts/audit-ai-learning-graph.mjs`가 category, subcategory, article,
learning path, research track와 sidebar stage를 하나의 정규화 그래프로
추출했다. 최초 감사에서 Robot AI는 48개 글이 136개 행으로 펼쳐졌고 그중
90개 행이 중복이었다. 참조 무결성보다 한 화면에서 여러 renderer가 같은
관계를 동시에 소유하는 문제가 더 컸다.

따라서 정보 구조의 단위는 “글 수”가 아니라 다음 다섯 ownership으로 잡았다.

| 소유자 | 화면 책임 |
| --- | --- |
| Research track | 현재 목표 → 핵심 개념 → 최소 기반 → 원문 → 구현 |
| Branch selector | 큰 분야에서 독립된 하위 책임 하나 선택 |
| Authored sequence | 선택한 leaf 안에서만 글 순서를 전개 |
| Path directory | child가 없는 연구 진입점에서 세부 경로의 시작점만 제시 |
| Source disclosure | 필수 경로에 포함되지 않은 원문·역사 자료를 접어서 보존 |

한 화면에서는 이 소유자들이 같은 article list를 중복해서 펼치지 않는다.

## 계층 재구성

### Robot AI

48개 글을 다음 여섯 실행 책임으로 나눴다.

| 순서 | 책임 | 글 수 |
| --- | --- | ---: |
| 00 | 전체 실행 계약 | 3 |
| 01 | Perception · State | 9 |
| 02 | Planning · Control | 8 |
| 03 | Runtime · Embedded | 4 |
| 04 | Actuation · Power | 11 |
| 05 | Mechanics · Qualification | 13 |

상위 `ai-robotics`는 전체 연구 경로와 여섯 분기만 보여 준다. 실제 학습
sequence는 각 child에서만 전개한다. 그 결과 desktop 문서 높이는
26,411px에서 2,296px, mobile은 42,345px에서 3,726px로 줄었다.

### LLM

20개 leaf를 한 단계에 나열하지 않고 두 lifecycle로 묶었다.

- 모델을 만드는 과정: data·pre-training, architecture, post-training,
  interpretability
- 모델을 실행·출시하는 과정: efficient inference·on-device, serving·infra

기존 leaf slug와 article URL은 유지했다. 상위 두 단계는 분기 선택만 하고,
논문·개념·구현의 상세 경로는 해당 leaf의 research track이 소유한다.

### 연구 지도

19개 `topDownResearchTracks`를 featured, 목표 cluster와 fallback의 정확한
partition으로 렌더한다. featured 두 트랙은 cluster/fallback 후보에서 먼저
제외했고, 각 카드에는 `data-research-track-card`를 넣어 브라우저에서
19개/19개 unique를 확인할 수 있게 했다.

## 렌더 규칙

`CategoryPage`는 research-track entry에서 다음 순서를 지킨다.

1. `TopDownResearchRoute`
2. child가 있으면 `SubcategoryCard` 분기
3. child가 없으면 compact `LearningPathDirectory`
4. 선택 원문은 닫힌 `SourceArticleDisclosure`

이 분기에서는 `AuthoredArticleSequences`를 렌더하지 않는다. 일반 leaf는
반대로 research route 없이 authored sequence를 렌더한다.

`expandFullPaths`가 필요한 일부 leaf에서는 source checkpoint가 번호가 있는
경로에 명시될 수 있다. 이때 첫 sequence가 article을 claim하고, 같은 source는
다른 sequence와 disclosure에서 제외한다. 화면에 같은 `data-article-card`가
두 번 나오지 않는 것이 최종 계약이다.

## 연구 문맥 보존

`TopDownResearchRoute`의 모든 내부 current·canonical·concept·foundation·
implementation 링크에 `?track=<track-id>`를 붙였다. anchor가 있으면
`?track=<id>#<anchor>` 순서를 쓴다.

`ArticleLayout`은 query의 track을 그대로 믿지 않는다. registry의 각 대상을
`(category, articleSlug)`로 정규화한 뒤 현재 article과 정확히 일치할 때만
연구 경로 복귀 문맥을 보여 준다. 각 track은 자신의 `category`를 명시하며,
복귀 URL도 hardcoded category가 아니라 그 값을 사용한다.

## 감사와 자동 판정

### 정적 그래프 감사

최종 IR:

- top-level subcategory 21
- 전체 subcategory 101
- article 300
- AI learning path 114
- research track 19
- sidebar stage 4

배포 차단 finding:

- duplicate article slug 0
- missing subcategory 0
- empty/source-only leaf 0
- track/sequence renderer collision 0
- unresolved learning step 0
- unresolved track reference 0
- duplicate track owner 0

17개 potential overlap은 데이터상 research track과 learning path가 같은
subcategory를 참조한다는 뜻이다. renderer owner가 research track으로
고정되어 실제 화면 collision은 0이다.

### 브라우저 계약

`scripts/qa-ai-information-architecture.mjs`는 1440×1000과 390×844에서
다음을 재현한다.

- 연구 지도 19개 카드, unique 19
- Robot entry: research 1, branch 1, sequence 0, source disclosure 1
- Robot child: research 0, branch 0, sequence 1
- LLM entry와 lifecycle group: branch만 렌더
- LLM architecture: research 1, branch 1, sequence 0
- child 없는 생성 모델 track: research 1, compact directory 1
- 모든 검사 페이지에서 article card 중복 0
- research link 실제 click 후 query, slug, return context와 return URL 보존
- LLM serving → GPU HPC cross-category dependency에서 문맥 유지
- 같은 track query를 무관한 Perceptron 글에 붙이면 return context 0
- desktop/mobile document horizontal overflow와 runtime error 0

결과는 `.codex-tmp/ai-ia-local-final-qa-2026-07-28.json`에 남겼다.

## Claude 협업과 영수증

Context Manager endpoint에 `claude-code:sonnet`을 강제하고 동시 요청을
최대 2개로 제한했다. 결과는 다음 조건을 모두 만족할 때만 채택했다.

- HTTP 200
- `.ok == true`
- `.decision.worker == "claude-code:sonnet"`
- `.attempts[0].ok == true`
- 비어 있지 않은 substantive result

첫 broad IA 요청 두 건은 code 143으로 끝났으므로 결과로 인정하지 않았다.
renderer ownership과 hierarchy를 더 작은 두 packet으로 나눈 retry는 모두
첫 시도에 strict-valid였고 두 구조를 PASS로 판정했다.

후속 post-edit packet A/B도 첫 시도에 strict-valid였다.

- A: 19개 지도 카드 partition과 research/sequence owner를 확인
- B: 모든 내부 연구 링크의 track query와 article return context를 확인

이 검증이 발견한 source checkpoint 이중 ownership과 slug-only membership은
각각 sequence claim/disclosure 제외, `(category, articleSlug)` membership으로
보강했다.

후속 C/D와 좁힌 C-retry도 모두 strict-valid였다. C는 source 첫 claim과
disclosure 제외를, D는 category-aware membership과 cross-category GPU
dependency를 PASS로 판정했다. C가 남긴 낮은 위험의 stale-path 비대칭에는
outer source claim에도 inner sequence와 같은 `belongsToPath` 조건을 적용했다.
마지막 E 영수증은 이 수정으로 missing·stale·non-owning path가 disclosure의
source를 잘못 숨길 수 없음을 확인하고 PASS를 반환했다.

영수증:

- `.codex-tmp/claude-ai-ia-retry-2026-07-28/results/`
- `.codex-tmp/claude-ai-ia-postedit-2026-07-28/`
- `.codex-tmp/claude-ai-ia-postfix-2026-07-28/`
- `.codex-tmp/claude-ai-ia-postfix-final-2026-07-28/`
- `.codex-tmp/context-manager-recheck-agent-2026-07-28.md`

## 4B·9B 모델용 절차

작은 모델에는 전체 저장소와 “체계적으로 정리하라”는 요청을 주지 않는다.
다음처럼 compiler pipeline으로 좁힌다.

1. Registry extractor가 category, child, article, path step, track dependency를
   ID 기반 JSON IR로 만든다.
2. 정적 감사기가 duplicate, missing reference, empty leaf와 multi-owner
   후보를 기계적으로 찾는다.
3. 모델에는 한 subcategory와 연결된 path/track row만 주고
   `현재 목표·독립 책임·최소 기반·중단점` 네 필드를 채우게 한다.
4. renderer owner는 enum으로 고정한다. 모델이 UI 목록을 임의로 섞지 못하게
   `research-track | branch | sequence | directory | source` 중 하나를 고른다.
5. 별도 reviewer packet은 입력 IR과 출력 hierarchy만 받아 leaf 보존,
   중복, source ownership과 category/slug navigation을 반례로 검사한다.
6. Playwright가 route, viewport, selector와 expected count를 실행해 의미
   판단이 실제 DOM 계약과 일치하는지 확인한다.
7. 실패 packet만 다시 모델에 보내며, 성공한 전체 문맥은 재전송하지 않는다.

이 방식은 큰 모델의 암묵적 장기 기억을 `ID 그래프 + 불변식 + 작은 반례`로
치환한다. Context Manager 500·timeout도 packet을 작게 나누고 동시성을 2로
제한하면 특정 실패 범위만 다시 검증할 수 있다.

## 검증 상태

- Production Vite build: pass. 기존 large-chunk warning만 유지된다.
- Focused ESLint와 `git diff --check`: pass.
- `npm run build:tsc`: 기존 article/Viz 타입 오류로 fail. 이번 IA 변경 파일은
  오류 목록에 없으며, 일반 production build는 통과했다.
- 최종 local IA browser QA: desktop/mobile, failure 0.
- 최종 public IA browser QA: desktop/mobile, failure 0.
- 공개 QA에는 지도, Robot entry/child, LLM entry/group/architecture,
  expanded source 경로 3개, 생성 모델 directory, 실제 연구 링크 click,
  GPU cross-category 양성 경로와 무관 article 음성 경로가 포함됐다.

## Production 배포

- `cm-blog.service`: 2026-07-28 10:42:39 KST 재시작, active/running.
- `dist/index.html`, service-local HTML, public HTTPS HTML SHA-256:
  `e0bd7c5cf1bf785a79bb88894246947a8e2dc7a176659987653fa28101737ed4`.
- AI root, Robot entry/child, LLM entry/group/architecture, 연구 지도와 GPU HPC
  cross-category article route: 모두 HTTP 200.
- 공개 desktop/mobile 계약: failure 0, runtime error 0, horizontal overflow 0,
  research card 19/19 unique, article card duplicate 0.
- 공개 화면 증거:
  - `.codex-tmp/ai-ia-public-final-qa-2026-07-28.json`
  - `.codex-tmp/ia-public-robot-final-2026-07-28.png`
  - `.codex-tmp/ia-public-map-final-2026-07-28.png`
