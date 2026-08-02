# AI Foundations 재구성 마일스톤

## 1. 이번 작업이 해결하려 한 문제

기존 블로그에는 좋은 개별 설명이 많았지만 독자가 다음 세 가지를 한 번에 판단하기 어려웠다.

1. 지금 연구·산업에서 중요한 목표가 무엇인가.
2. 그 목표를 이해하려면 어느 기반까지만 내려가야 하는가.
3. 읽은 내용을 실제 수식·코드·실험·운영 판단으로 옮길 수 있는가.

그래서 글 수를 늘리는 대신 `현재 목표 → mechanism → 최소 기반 → 1차 출처 → 구현·검증`의 학습 계약을 먼저 고정했다. 역사적으로 더 오래된 개념이 있다는 이유만으로 계속 내려가지 않고, 현재 글의 hidden challenge를 풀 수 있는 최초의 설명 바닥에서 멈췄다.

## 2. 추론 순서

### 2.1 목록이 아니라 질문을 inventory했다

사이드바 제목만 세지 않고 각 글에 다음을 물었다.

- 독자가 이 글을 여는 현재 질문은 무엇인가.
- 이 글이 독점적으로 설명할 mechanism은 무엇인가.
- 앞 글에서 어떤 artifact를 받아야 하는가.
- 다음 글에 무엇을 넘기는가.
- 이 글을 빼도 경로가 이어진다면 중복이 아닌가.

독립 질문이 있는 글은 유지했다. 모델명·용어만 나열하거나 다른 글과 같은 책임을 반복하는 글은 통합 후보로 두었다.

### 2.2 어려운 내부 문제를 먼저 만들었다

문제를 본문에 그대로 싣기 위한 것이 아니다. 글의 깊이를 검사하기 위한 저자용 oracle이다.

예를 들어 학습 파이프라인에는 다음 transfer question을 두었다.

> 마지막 batch가 작고 AMP를 쓰는 run에서 epoch loss와 checkpoint 선택이 흔들린다. 어느 값이 잘못 집계됐고 어떤 artifact를 release해야 하는가?

이 문제를 풀려면 본문이 다음 insight를 모두 제공해야 한다.

- `autocast`는 전체 forward를 무조건 FP16으로 바꾸는 기능이 아니라 op별 dtype을 선택한다.
- `GradScaler`는 작은 gradient의 underflow를 줄이는 장치이지 loss dtype을 설명하는 장치가 아니다.
- batch mean을 다시 단순 평균하면 작은 마지막 batch에 같은 가중치를 주게 된다.
- scheduler는 batch마다 호출하는 종류와 epoch마다 호출하는 종류가 있다.
- checkpoint는 validation으로 고르고 마지막 untouched test는 한 번만 평가한다.

빠진 insight가 있으면 문제를 쉽게 바꾸지 않고 본문·Viz·FormulaNote를 보강했다.

### 2.3 주장마다 source boundary를 고정했다

출처를 글 끝에 모으는 것으로 끝내지 않았다. 각 숫자·버전·구조 주장에 대해 다음을 분리했다.

```text
원문이 직접 말한 사실
Codex가 코드에서 관찰한 사실
교육용으로 만든 예시
여러 사실을 연결한 추론
```

예를 들어 FlashAttention의 GPT-2 3배 결과와 Long Range Arena의 2.4배 결과를 섞어 일반 성능처럼 인용하던 문장은 원 논문 범위에 맞게 분리했다. Kubernetes DRA도 “1.35에서 GA”가 아니라 1.34에서 core GA, 1.35에서 feature gate가 항상 켜지는 상태로 바로잡았다.

### 2.4 Viz는 장식이 아니라 실행 증거로 만들었다

색을 바꾸는 것은 개선으로 세지 않았다. 좋은 Viz는 조작할 때 다음 중 하나가 실제로 바뀐다.

- 입력과 출력
- state와 transition
- memory·token·latency 장부
- 실패가 처음 발생한 stage
- 선택에 따른 보존값과 손실값

모바일에서는 데스크톱 SVG를 축소하지 않고 semantic row 또는 단계 설명으로 전환했다. 360·390·768·1440 viewport에서 문서 폭, Viz 내부 폭, KaTeX 크기와 상호작용 결과를 검사했다.

### 2.5 수식은 FormulaNote와 한 계약으로 다뤘다

display 수식마다 다음을 요구했다.

- 한국어 underbrace 또는 수식 안의 의미 단위
- 기호별 뜻
- 왜 더하고, 곱하고, 나누거나 threshold를 적용하는지
- 값의 변화가 실제 판단을 어떻게 바꾸는지

JavaScript 문자열의 `\tau`, `\delta`, `\star`가 tab 또는 잘못된 escape로 변하는 결함은 `String.raw`와 DOM의 실제 KaTeX glyph 검사로 막았다. 긴 식은 전체를 작게 축소하지 않고 의미 단위의 여러 행으로 나눴다.

## 3. 실제 수정으로 확인한 추론

### 학습 실행

- AMP Viz에서 forward와 loss 전체를 FP16으로 표시하던 오류를 op별 `autocast` 선택으로 수정했다.
- epoch loss를 batch mean의 평균이 아니라 `loss × batch_size`의 합을 sample 수로 나누도록 수정했다.
- scheduler 호출 주기를 batch·epoch 계약으로 분리했다.
- validation-selected checkpoint와 untouched final test를 분리했다.

### 추론·서빙

- PagedAttention과 Scheduler 설명을 vendored vLLM source의 실제 line과 반환값에 맞췄다.
- FlashAttention과 EAGLE의 잘못 귀속된 성능 문장을 원 논문 범위로 교정했다.
- startup, engine initialization, readiness warmup을 하나의 시간처럼 더하던 계약을 분리했다.
- Kubernetes DRA release 상태와 observability의 KV·preemption·canary 첫 정의를 보강했다.

### 수학·비전·문서

- Vision Transformer pre-LN block에 빠진 두 번째 LayerNorm을 복구했다.
- CNN equivariance FormulaNote의 `T_\delta`, `K\star X`, `\delta` escape를 수정했다.
- Document assembly의 generic `j`를 1위 후보 `j_i^\star`로 고정하고 1위·2위 margin을 명시했다.
- Object detection의 `\tau` escape를 수정했다.
- TEDS를 첫 사용에서 Tree-Edit-Distance-based Similarity로 풀고, 구조 점수와 source fidelity gate가 다른 증거임을 설명했다.

### 제작·그래프

- Animation production을 성공 계약, baseline, data, condition, 최소 개입, temporal finishing, release의 일곱 단계로 맞췄다.
- Prompt → structural control → LoRA → full tune의 최소 개입 순서를 본문과 두 Viz에서 통일했다.
- Caption field mask `c_i'`가 실제 conditional loss 입력으로 이어지게 했다.
- Animation pair 비교는 품질 vector가 아니라 scalar `S(y)`의 차이로 정의했다.
- ComfyUI 실행 Viz는 결과 output에서 upstream dependency closure를 역추적한 뒤 producer-first로 실행하는 두 방향을 모두 보여 주게 했다.

## 4. Claude 협업을 신뢰한 방식

Context Manager의 성공 응답을 곧 Claude 검증으로 세지 않았다.

```text
요청 worker = claude-code:sonnet
AND 관측 header가 [claude-code:sonnet ...]
AND timeout·provider error가 아님
AND Codex fallback이 아님
```

이 gate를 통과하지 못한 응답은 내용이 유용해도 Claude 독립 검증 수에 넣지 않았다. 같은 글을 더 작은 파일·질문 단위로 다시 요청했다.

Claude finding도 바로 수정하지 않았다.

1. 현재 worktree에서 같은 결함이 재현되는지 확인한다.
2. 원 논문·공식 문서·vendored code 중 맞는 source를 대조한다.
3. 이미 수정된 stale finding인지 판정한다.
4. 확인된 최소 원인만 수정한다.
5. DOM·상호작용·viewport test로 닫는다.

이 절차 덕분에 `Context Manager 200`과 `Claude가 실제로 검토함`, `Claude가 지적함`과 `현재 코드에 결함이 있음`을 서로 다른 사실로 보존했다.

## 5. 4B·9B 모델로 재현하는 방법

작은 모델에게 “전체 블로그를 고쳐라”라고 시키지 않는다. 한 worker는 한 결정만 소유한다.

### 입력 packet

```json
{
  "stage": "formula-audit",
  "article": "document-structure-assembly",
  "reader_question": "어느 block을 자동 연결할 수 있는가",
  "approved_claims": ["1위 score", "2위 margin", "hard conflict"],
  "formula_source": "...",
  "formula_note_source": "...",
  "required_output_schema": "formula_audit_v1"
}
```

### 출력 schema

```json
{
  "observations": [],
  "inferences": [],
  "defects": [
    {
      "anchor": "file:line",
      "contract_broken": "symbol|operation|source|render",
      "evidence": "",
      "smallest_fix": ""
    }
  ],
  "needs_more_context": []
}
```

### 모델 역할 분리

1. Inventory 모델: route와 article ownership만 본다.
2. Source 모델: 원문 claim과 숫자만 추출한다.
3. Prose 모델: 승인된 claim으로 section 하나만 쓴다.
4. Formula 모델: 수식·기호·연산 이유만 만든다.
5. Viz 모델: state·control·transition·mobile alternative만 설계한다.
6. Verifier 모델: source·code·DOM evidence를 대조하고 accept/reject/partial만 판정한다.

다음 worker에는 이전 worker의 자유 형식 장문이 아니라 검증된 IR만 전달한다. 작은 모델이 앞 단계의 과장을 그대로 증폭시키지 않게 하기 위해서다.

## 6. 재현용 완료 gate

한 글은 다음을 모두 만족해야 닫힌다.

```text
reader question 한 개
AND owned mechanism이 겹치지 않음
AND 첫 용어 정의가 사용보다 앞섬
AND 모든 display formula에 FormulaNote 존재
AND Viz control이 evidence를 실제로 바꿈
AND primary source가 핵심 claim을 직접 지지
AND hidden challenge의 required insight가 본문에 모두 존재
AND 360·390·768·1440에서 overflow 없음
AND 다음 글이 앞 글의 artifact를 실제로 받음
```

Build 성공만으로 이 gate를 대체하지 않는다.

## 7. 검증 기록

Context Manager identity gate를 끝까지 적용한 최종 결과는 다음과 같다.

- 고유 article: 71/71 true-Claude header 확인
- 실제 Sonnet 채택 실행: 74
- 실패·Codex fallback·headerless 실행: 50
- 전체 시도: 124
- Architecture 보조 원장은 상위 원장에 이미 합쳐져 이중 산입하지 않음
- 확인된 gap finding 중 현재 open: 0

MDP의 저자용 hidden challenge는 공개 Viz 숫자를 재사용하지 않는 별도 fixture와 oracle로
교체했다. 이 변경은 ‘본문 예제를 기억하면 통과’하는 시험을 ‘새 상태·보상에서 Bellman 구조를
전이해야 통과’하는 시험으로 바꾼다.

카테고리 경로도 같은 article을 축약 nav와 상세 카드로 두 번 링크하던 중복을 제거했다. 상세
article 행 자체가 하나의 학습 `nav`가 되고, 연구 루트·overview에서는 전체 authored path를,
독립 leaf에서는 그 leaf가 소유한 글만 보여 준다.

최종 실행:

- production build: 9,357 modules, pass
- local Playwright: 83/83
- Viz audit: 24 checks, 21 surfaces, error·warning 0
- narrative audit: 24 checks, StepViz 15, 21 surfaces, error·warning 0
- production Playwright: 5/5
- production JS/CSS: `index-DUuEljND.js`, `index-yuuw-KUu.css`, HTTP 200
- 핵심 route: HTTP 200
- legacy `/blog/`: `/lab/blog/`로 308
- `cm-blog.service`: active

관련 ledger:

- `2026-07-23-claude-review-final-identity-audit.json`
- `2026-07-23-claude-review-final-identity-audit.md`
- `2026-07-23-claude-review-backfill-serving-on-device.json`
- `2026-07-23-claude-review-backfill-serving-on-device.md`
- `2026-07-23-small-model-blog-reconstruction-protocol.md`
