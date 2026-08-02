# AI 블로그 재구성 추론 기록과 4B·9B 재현 프로토콜

## 1. 이 문서의 목적

이 문서는 2026-07-23까지 진행한 AI 블로그 재구성 작업을 다시 수행할 수 있게 만든 실행 기록이다.

목표는 글을 많이 만드는 것이 아니었다. 독자가 현재 논문·제품·산업 질문에서 출발해 필요한 개념과 최소 기반만 내려가고, 다시 구현과 검증으로 올라올 수 있는 학습 시스템을 만드는 것이었다.

4B·9B 모델은 저장소 전체, 논문 전체, UI 전체를 한 번에 판단하기 어렵다. 따라서 이 프로토콜은 작업을 작은 결정으로 분해한다. 각 단계는 구조화된 입력을 받고, 하나의 artifact를 만들고, deterministic gate를 통과한 뒤에만 다음 단계로 간다.

## 2. 최종적으로 만든 시스템

### 학습 구조

```text
현재 목표
  ↓
실행 계약과 실패 질문
  ↓
핵심 mechanism
  ↓
막힐 때만 여는 최소 수학·과학·공학 기반
  ↓
기준 논문 또는 공식 연구 글
  ↓
구현·운영·release evidence
```

### 글의 내부 구조

```text
QuestionLead
  ↓
ConceptPrimer
  ↓
원인과 실행 순서
  ↓
조작 가능한 Viz
  ↓
KaTeX + FormulaNote
  ↓
실패 모드와 오해 방지
  ↓
CapabilityCheck
  ↓
1차 출처와 다음 글 handoff
```

### 검증 구조

```text
Codex inventory
  ↓
Context Manager를 통한 Claude 단건 검토
  ↓
Codex의 독립 source·code·DOM 대조
  ↓
확인된 결함만 수정
  ↓
Playwright viewport·상호작용·수식 회귀
  ↓
route sequencing 재검토
```

## 3. 왜 이 구조를 선택했는가

### 3.1 과거부터 읽는 계보는 끝이 없다

어떤 개념도 더 오래된 기반을 찾을 수 있다. Attention은 sequence model로, sequence model은 확률과 선형대수로, 선형대수는 더 오래된 수학으로 내려간다. 이 방식은 독자가 현재 질문에 도달하기 전에 이탈하게 만든다.

그래서 역사적 최초가 아니라 현재 글을 이해하는 데 필요한 최소 설명 바닥을 cutoff로 삼았다.

예시:

- Promptable vision은 SAM 3.1에서 시작한다.
- Detection은 현재 fixed/open-vocabulary 선택에서 시작한다.
- 논문 계보는 DETR·Deformable DETR 같은 mechanism floor에서 멈춘다.
- CNN·Tensor·통계는 해당 계산이 막힐 때만 연다.

### 3.2 한 글이 여러 경로에서 재사용된다

`vision-system-contracts`는 공통 작업 계약이면서 Promptable Vision과 Detection 양쪽에 쓰인다. 글 하나에 `learningPath` 하나만 저장하면 재사용 경로에서 클릭한 뒤 기본 소유 경로로 튀는 문제가 생긴다.

최종 수정은 다음과 같다.

- `getArticleNavigation`은 선택된 `learningPathId`가 현재 글을 실제로 포함할 때 우선한다.
- `ArticleLayout`의 rail과 앞/다음 링크가 path ID를 전달한다.
- 전역 `InternalLinkHandler`도 capture 단계에서 이 state를 보존한다.
- path ID가 없거나 유효하지 않으면 글의 기본 소유 경로로 안전하게 돌아간다.

### 3.3 표와 카드 나열은 mechanism을 설명하지 못한다

모델명, 특징, 장단점을 표로 나열하면 검색에는 편하지만 학습 흐름은 만들어지지 않는다. 독자는 입력이 어떤 state를 지나 어떤 output이 되는지 보지 못한다.

따라서 표를 줄이는 대신 다음 종류의 Viz를 사용했다.

- execution trace
- state transition
- artifact handoff
- budget ledger
- invariant failure
- alternative comparison

Viz는 색만 바꾸지 않는다. Step마다 데이터, 선택, 실패 이유 또는 계산값이 실제로 변해야 한다.

### 3.4 수식은 렌더링만 되면 끝이 아니다

수식 아래에는 기호 사전과 연산 이유가 모두 필요하다.

예를 들어 cosine similarity라면 다음 질문을 답해야 한다.

- 왜 내적하는가?
- 왜 두 norm으로 나누는가?
- 왜 temperature를 곱하거나 나누는가?
- 값이 커지거나 작아지면 시스템 판단이 어떻게 바뀌는가?

모든 display KaTeX는 `FormulaNote`와 한 쌍으로 검증한다. 모바일에서는 overflow뿐 아니라 축소 비율과 실제 font size도 검사한다.

## 4. Source of truth

| Artifact | 역할 |
|---|---|
| `src/content/learning-paths.ts` | 독자가 따라갈 순서와 각 step의 질문 |
| `src/content/ai/index.ts` | 사이드바 분류와 branch 설명 |
| `src/content/ai/topdownResearchTracks.ts` | 현재 연구, 기준 논문, 개념, 기반, 구현의 연결 |
| `src/content/ai/articles*.ts` | article 소유권, prerequisites, sections, lazy import |
| `src/pages/articles/ai/*.tsx` | 실제 본문, 수식, Viz, handoff, source |
| `src/components/ArticleLayout.tsx` | article route 문맥과 학습 연속성 UI |
| `tests/*.spec.ts` | 브라우저에서 증명해야 하는 학습·수식·반응형 계약 |
| `knowledge/authoring/runs/2026-07-23-claude-review-backfill-report.json` | Claude backfill와 route 검증 source of truth |

문서와 코드가 다르면 실행되는 코드와 DOM을 우선한다. 문서가 오래된 경우 문서를 갱신한다.

## 5. 작업 상태 머신

각 article과 route는 다음 상태만 가진다.

```text
unseen
  → inventoried
  → scoped
  → sourced
  → drafted
  → visualized
  → independently_reviewed
  → fixed_or_rejected
  → browser_verified
  → route_verified
```

금지되는 전이는 다음과 같다.

- `unseen → drafted`: 전체 범위를 모른 채 본문부터 쓰지 않는다.
- `drafted → route_verified`: article 내부 검증 없이 경로만 맞다고 하지 않는다.
- `Claude finding → fixed`: Codex 독립 확인 없이 외부 finding을 바로 적용하지 않는다.
- `build passed → browser_verified`: build 성공은 overflow·상호작용·수식 가독성을 증명하지 않는다.

## 6. Route IR

작은 모델은 먼저 route를 다음 JSON으로 정규화한다.

```json
{
  "route_id": "ai-vision-promptable-current-first",
  "goal": "concept prompt에서 video identity까지 설명",
  "current_target": "vision-promptable-segmentation-tracking",
  "steps": [
    {
      "slug": "vision-promptable-segmentation-tracking",
      "owns": "prompt, propagation, identity, runtime",
      "requires_from_previous": [],
      "hands_off": ["mask contract", "track state", "runtime evidence"]
    }
  ],
  "optional_foundations": [],
  "cutoff": "CNN feature map 아래 역사는 필수로 내려가지 않음"
}
```

### Route gate

각 인접 step에 대해 다음 네 문장을 채워야 한다.

1. 앞 글이 무엇을 산출하는가?
2. 다음 글은 그 산출물을 어디서 처음 사용하는가?
3. 다음 글이 아직 배우지 않은 개념을 이미 안다고 가정하는가?
4. 이 step이 현재 목표에 필수인가, 막힐 때만 여는 선택 기반인가?

한 문장이라도 근거 없이 비면 sequencing defect 후보로 기록한다.

## 7. Article Contract IR

```json
{
  "slug": "article-slug",
  "reader_question": "이 글이 답할 한 문장",
  "owned_claims": [],
  "not_owned": [],
  "prerequisites": [],
  "terms_to_define": [],
  "execution_flow": [],
  "formulas": [
    {
      "latex": "...",
      "symbols": [],
      "operation_reasons": [],
      "decision_effect": "..."
    }
  ],
  "failure_modes": [],
  "source_anchors": [],
  "viz_claims": [],
  "handoff": {
    "next_slug": "...",
    "artifact": "..."
  },
  "stop_rule": "이 글에서 더 내려가지 않는 이유"
}
```

### Article gate

- 전문 용어는 첫 사용 전에 정의한다.
- 제목 바로 아래에 맥락 없는 scene을 두지 않는다.
- prose가 설명한 순서와 Viz step 순서가 같아야 한다.
- 수식의 symbol과 FormulaNote의 symbol이 일치해야 한다.
- 본문 마지막 링크와 `learningPath`의 다음 step이 일치해야 한다.
- source는 주장 범위를 직접 지지해야 한다.

## 8. Hidden challenge를 만드는 법

사용자에게 문제를 본문으로 노출하는 것이 목적이 아니다. 작성자가 깊이를 놓쳤는지 검사하는 내부 도구다.

### 생성 절차

1. 현재 글의 핵심 mechanism을 선택한다.
2. 정상 경로 하나와 헷갈리기 쉬운 실패 경로 둘을 만든다.
3. 단순 정의 암기로는 풀 수 없게 숫자, state 또는 artifact handoff를 넣는다.
4. 정답에 필요한 insight를 목록으로 만든다.
5. 본문의 어느 section이 각 insight를 제공하는지 매핑한다.

### 판정 예

```json
{
  "challenge": "VFI 뒤 impact silhouette가 무너졌지만 native frame은 정상이다. 다음 한 변화는?",
  "required_insights": [
    "earliest failure ownership",
    "native/VFI/encode artifact separation",
    "one-change experiment"
  ],
  "coverage": {
    "earliest failure ownership": "animation-fps-vfi#failure",
    "artifact separation": "animation-video-evaluation#report",
    "one-change experiment": "animation-lora-training#experiment"
  },
  "pass": true
}
```

필요 insight가 본문에 없으면 문제를 쉽게 바꾸지 않는다. 본문을 보강한다.

## 9. Source 처리 프로토콜

### 우선순위

1. 로컬 vendored source와 공식 repository
2. 원 논문
3. 공식 documentation과 공식 research post
4. 보조 설명 자료

### Claim ledger

```json
{
  "claim": "PaddleOCR-VL은 whole-page 단일 pass parser다",
  "source": "official docs",
  "source_scope": "layout detection 후 crop recognition",
  "verdict": "reject",
  "reason": "공식 실행 구조와 반대"
}
```

출처가 모델 전체를 설명한다고 과장하지 않는다. 공식 문서가 deployment만 설명하면 architecture 근거로 쓰지 않는다.

## 10. Context Manager와 Claude 협업

### 호출 규칙

- Claude CLI를 직접 부르지 않는다.
- `/home/heru/code/context-manager`의 `runDelegatedPrompt`를 사용한다.
- worker는 `claude-code:sonnet`으로 고정한다.
- 동시에 최대 4개만 실행한다.
- 한 worker에는 article 하나 또는 좁은 route 하나만 준다.
- timeout이 나면 시간을 늘리기 전에 scope를 더 작게 나눈다.
- 응답 header가 실제로 `[claude-code:sonnet ...]`인지 저장한다.
- `codex:*` fallback, provider error와 timeout은 Claude 검토 완료로 세지 않는다.

### 모델 정체성 gate

Context Manager가 성공 응답을 반환했다는 사실과 Claude가 답했다는 사실은 같지 않다. Provider 500·429·timeout 뒤에 router가 Codex로 fallback할 수 있기 때문이다.

```json
{
  "requested_worker": "claude-code:sonnet",
  "observed_header": "[claude-code:sonnet · L3 · ...]",
  "fallback": false,
  "counts_as_claude_review": true
}
```

`observed_header`가 없거나 `codex:`로 시작하면 본문이 유용해도 Claude 독립 검증 ledger에는 넣지 않는다. 별도 baseline으로만 보존하고 같은 article을 더 작은 scope로 다시 요청한다.

### 좋은 route prompt

```text
Read-only, no browse, no edits.
Audit only route <route-id>.
Read exact steps in learning-paths.ts, direct registry ownership/prerequisites,
and only opening/final handoff of listed articles.
Report at most 4 sequencing, ownership, or missing-foundation defects
with file:line and the smallest fix.
Do not inspect viz files, tests, full prose, or other routes.
```

### 왜 범위를 제한했는가

넓은 worker는 300~420초 timeout이 반복됐다. Computer Vision은 contract, promptable, detection 세 worker로 나눈 뒤 모두 완료됐다. 범위 제한은 품질을 낮추는 것이 아니라 한 worker가 내려야 할 판단 종류를 줄인다.

## 11. Finding 독립 검증 규칙

Claude finding은 다음 셋 중 하나로 분류한다.

### Accept

코드, DOM, source 또는 수식 재계산으로 결함이 재현된다.

예시:

- Speech 네 sibling branch가 한 serial path에 묶여 있었다.
- HTML table 글이 occupancy grid를 만들지만 runtime gate로 넘기는 링크가 없었다.
- Promptable route의 재사용 글을 클릭하면 다른 path로 바뀌었다.

### Reject

실제 구현이 이미 요구를 만족하거나 제안이 의도한 설계를 깨뜨린다.

예시:

- vLLM field-guide anchor가 없다는 finding은 component가 `section id={guide.id}`를 렌더하므로 반려했다.
- Animation 공유 Viz 디렉터리 rename은 사용자 동작이나 학습 흐름을 고치지 않아 반려했다.
- Detection current target보다 foundation을 앞에 두라는 제안은 current-first 원칙을 뒤집으므로 문구만 수정했다.

### Partial

문제는 맞지만 제안한 수정 범위가 크거나 원인이 다르다.

예시:

- Multi-path navigation 문제는 Promptable route metadata만 고쳐서는 해결되지 않았다.
- 실제 원인은 `InternalLinkHandler`가 capture 단계에서 React Router state를 버린 것이었다.
- 전역 state 보존으로 root cause를 수정했다.

## 12. 수식 QA

각 display formula에 대해 자동으로 확인할 값:

```json
{
  "overflow_px": 0,
  "math_scale": 0.82,
  "font_size_px": 14,
  "raw_latex_visible": false,
  "formula_note_present": true,
  "formula_note_korean": true
}
```

권장 gate:

- overflow ≤ 1px
- scale ≥ 0.70, 복잡한 글의 기존 계약이 더 높으면 그 값을 유지
- font size ≥ 12px
- `.katex-error` 0개
- raw `\underbrace`, `\operatorname`, `\begin` 문자열이 화면에 보이지 않음
- FormulaNote가 의미, symbols, operation reason을 모두 포함

수식이 너무 길면 전체를 더 작게 축소하지 않는다. 의미 단위로 `aligned` 행을 나눈다.

## 13. Viz QA

### Viz가 있어야 하는 경우

- 상태가 시간에 따라 변한다.
- 입력 선택이 output과 실패 이유를 바꾼다.
- 같은 데이터가 여러 stage를 통과한다.
- memory, token, latency 또는 bitrate budget을 계산한다.
- 정상과 실패 invariant를 비교한다.

### Viz를 만들지 않는 경우

- 단순 출처 목록
- 짧은 정의 둘
- interaction이 새로운 insight를 만들지 않는 정적 reference

### 반응형 규칙

- mobile에서 desktop SVG를 단순 축소하지 않는다.
- 필요한 경우 semantic row나 step card로 바꾼다.
- 고정 `viewBox` 안의 글자 크기만 줄이지 않는다.
- 오른쪽이 잘리거나 내부 scroll이 생기면 실패다.
- 비활성 상태도 읽을 수 있는 opacity를 유지한다.

## 14. Browser regression protocol

최소 viewport:

```text
360×800
390×844
768×1024
1440×900
```

각 article test는 다음을 확인한다.

1. 핵심 heading이 보인다.
2. Viz control을 누르면 state와 보이는 evidence가 바뀐다.
3. Formula와 FormulaNote 수가 같다.
4. 수식 overflow·scale·font gate를 통과한다.
5. document width overflow가 0~1px 이하다.
6. console error가 없다.
7. 다음 글 link가 route의 실제 다음 step으로 간다.
8. 재사용 article을 클릭해도 선택한 path rail이 유지된다.

## 15. 4B·9B 모델용 분할 실행

작은 모델에는 한 번에 최대 한 route 또는 한 article만 준다.

### Pass A: inventory

입력:

- `learning-paths.ts`의 해당 route 1개
- 해당 article registry entry
- article의 section heading과 마지막 30줄

출력:

- Route IR
- missing slug
- ownership conflict
- handoff mismatch 후보

### Pass B: scope

입력:

- article 1개
- content spec
- 직접 import한 Viz 이름

출력:

- Article Contract IR
- must-cover / defer 목록
- term definition 목록

### Pass C: source extraction

입력:

- 1차 source 1~3개 또는 vendored file 일부

출력:

- claim ledger
- source scope
- 숫자와 버전
- 추론인지 직접 주장인지 구분

### Pass D: prose

입력:

- 승인된 Article Contract IR
- claim ledger
- 한 section의 source anchor

출력:

- section 하나만 작성
- 입력→변환→출력→실패 순서
- 첫 용어 정의

### Pass E: formula

입력:

- section prose
- formula 1~2개

출력:

- LaTeX
- 한국어 underbrace
- FormulaNote meaning
- symbol list
- operation reasons

### Pass F: Viz spec

입력:

- prose의 execution flow

출력:

- Step 0~N의 visible state
- control
- transition
- 각 step이 증명하는 invariant
- mobile alternative

### Pass G: integration

입력:

- 완성 section들
- registry
- route IR

출력:

- section ID parity
- intro/handoff parity
- route next-link parity
- source coverage gap

### Pass H: browser evidence

작은 모델이 DOM을 추측하지 않게 Playwright가 만든 JSON만 준다.

출력 판정:

- pass
- confirmed defect
- stale test expectation
- needs human visual review

## 16. 작은 모델 prompt contract

```text
You own exactly one decision stage.
Do not rewrite files.
Use only the supplied route/article/source packet.
Return JSON matching the requested schema.
Separate observed facts from inferences.
Do not add a foundation merely because it is historically older.
Add it only when a later step uses an unexplained concept.
When reporting a defect, cite the exact supplied anchor and the smallest fix.
If evidence is insufficient, return needs_more_context with the exact missing file or symbol.
```

모델이 자유 형식 장문을 내지 않게 한다. 다음 worker는 이전 worker의 prose가 아니라 승인된 IR만 받는다.

## 17. 실행 결과

2026-07-23 최초 ledger는 고유 article 70개를 Claude backfill 완료로 기록했지만 provider header를
보존하지 않았다. 재감사에서 57/71만 증명된 상태로 낮춘 뒤, HTTP 500·timeout·Codex fallback로
남은 14개를 Context Manager에서 다시 실행했다.

- 최종 true-Claude article coverage: **71/71**
- 실제 `[claude-code:sonnet` 채택 실행: 74
- 실패·Codex fallback·headerless 실행: 50
- 전체 시도: 124
- 같은 slug의 좁은 보조 검토: 3회. 고유 coverage에는 중복 산입하지 않음
- route sequencing 11건: article-level identity와 분리
- 확인된 gap finding 중 현재 open: 0

최종 identity source of truth는
`2026-07-23-claude-review-final-identity-audit.{json,md}`다. 특히 작은 모델은
`Context Manager 200`, `Sonnet header`, `confirmed defect`, `browser pass`를 서로 다른 필드로
유지해야 한다.

최종 실행 증거는 production build 9,357 modules pass, local Playwright 83/83, production
Playwright 5/5다. 공통 Viz·narrative audit은 각각 24 checks에서 error와 warning 0이었다.
운영 asset `index-DUuEljND.js`, `index-yuuw-KUu.css`는 HTTP 200이며 legacy `/blog/`는
canonical `/lab/blog/`로 308이다.

- Document AI regression: 12/12
- Computer Vision regression: 15/15
- ComfyUI regression: 25/25
- Speech·Animation 통합 regression: 기존 두 stale expectation을 제외한 115/117 통과, expectation 수정 후 대상 2/2 통과
- production smoke: Promptable Vision 경로 문맥 1/1, Document AI handoff 1/1, Speech·Audio handoff 2/2 통과
- production assets: 새 hash의 JS·CSS `200`, legacy `/blog/`는 canonical `/lab/blog/`로 `308`

대표적인 구조 개선:

- LLM pretraining에 실제 LLM run·checkpoint·scale-up 글 추가
- RLHF에서 PPO 이전 policy gradient·critic·advantage·importance ratio 다리 추가
- vLLM runtime과 serving control plane 경계 정리
- On-device route에서 topic-mismatched hardware와 중복 quantization 제거
- Speech sibling responsibility 분리
- Document occupancy grid와 release gate 연결
- Animation LTX 사례와 production route 연결
- Vision multi-path navigation root cause 수정

### 완료 범위와 저장소 전체 backlog를 구분한다

위 완료 수치는 이번 AI current-first 재구성에서 명시적으로 소유한 고유 글 70개와 11개 경로에만 적용한다. `audit:learning-flow`는 저장소 전체 590개 글을 별도로 검사했고, 2026-07-23 기준 다음 장기 backlog를 보고했다.

- release blocker 29: 대부분 blockchain·crypto의 FormulaNote 누락
- review needed 1
- enrichment backlog 480
- missing prerequisite metadata 374
- local connection backlog 415

따라서 작은 모델은 `AI route review queue = 0`을 `전체 저장소 완료`로 바꾸어 해석하면 안 된다. route-owned 완료와 repository-wide 자동 감사 결과를 서로 다른 필드로 유지하고, 현재 작업 범위 밖의 결함은 다음 batch 입력으로 넘긴다.

## 18. 완료 조건

한 route는 다음이 모두 참일 때만 완료다.

```text
모든 slug가 존재한다
AND 각 article 소유권이 명확하다
AND 인접 handoff artifact가 이어진다
AND 전문 용어가 사용 전에 설명된다
AND display formula마다 FormulaNote가 있다
AND Viz가 실제 state를 바꾼다
AND mobile·tablet·desktop overflow가 없다
AND primary source가 핵심 claim을 지지한다
AND hidden challenge insight가 본문에서 회수된다
AND 선택한 learning path가 재사용 article에서도 유지된다
```

이 중 하나라도 실패하면 최신 글을 더 추가하지 않는다. 먼저 기존 경로의 끊어진 계약을 고친다.

## 19. 남은 위험

- Link state는 같은 browser history에서는 유지되지만 URL만 복사한 새 세션에서는 article의 기본 소유 path로 돌아간다. 공유 URL에도 path 문맥이 필요해지면 query parameter를 별도 제품 결정으로 추가해야 한다.
- Playwright는 의미 없는 색·형태의 미적 품질을 완전히 판정하지 못한다. 핵심 route별 screenshot review는 계속 필요하다.
- 최신 모델·논문 tracking은 새 source의 존재만 감지해서는 안 된다. 기존 current claim을 대체하는지, foundation delta가 생기는지 promotion rule로 판정해야 한다.
- 작은 모델은 source scope를 과장하기 쉽다. claim ledger와 독립 verifier를 생략하면 안 된다.

## 20. 다음 실행자가 먼저 볼 파일

1. `CLAUDE.md`
2. `src/content/learning-paths.ts`
3. `src/content/ai/topdownResearchTracks.ts`
4. 대상 article registry
5. 대상 article과 content spec
6. 관련 Playwright test
7. `knowledge/authoring/runs/2026-07-23-claude-review-final-identity-audit.json`
8. 이 문서

이 순서를 바꾸지 않는다. UI를 먼저 보고 감으로 글을 늘리는 대신, route와 source contract를 먼저 고정한 뒤 본문과 Viz를 만든다.
