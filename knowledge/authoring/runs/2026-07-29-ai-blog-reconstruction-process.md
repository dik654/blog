# AI blog reconstruction process

Date: 2026-07-29  
Purpose: current research → canonical idea → minimum foundations → implementation
으로 이어지는 기술 학습 시스템을 작은 모델에서도 재현할 수 있게 남긴다.

## 1. 문제를 어떻게 다시 정의했는가

초기 요청을 "기존 글에 색과 애니메이션을 더한다"로 해석하면 실패한다.
실제 문제는 서로 연결된 다섯 층이었다.

1. **정보 구조**: 사이드바 이름과 글 순서만 봐서는 왜 다음 글을 읽는지 알 수 없었다.
2. **학습 전이**: 용어를 읽은 뒤 새로운 문제를 풀 수 있는가가 검증되지 않았다.
3. **근거 시간**: 최신 문서, 오래된 원 논문, 현재 코드와 교육용 수치가 섞였다.
4. **시각 인과**: 작은 고정 SVG와 카드 나열은 예뻐져도 원인을 설명하지 못했다.
5. **출시 품질**: KaTeX, overflow, 모바일 폭, source pin과 실제 배포가 한 계약으로 묶이지 않았다.

따라서 성공 기준을 다음처럼 바꿨다.

> 독자는 현재 목표에서 출발해 필요한 최소 기반까지 내려가고, 각 글이 넘겨주는
> 산출물로 다음 글을 읽으며, 마지막에는 처음 보지 못한 운영·수학·구현 문제의
> 첫 병목과 다음 행동을 설명할 수 있어야 한다.

## 2. 전체 추론 파이프라인

### 단계 A. 렌더된 전체 코퍼스를 먼저 계측한다

등록 metadata만 세지 않고 실제 route를 브라우저로 연다. 각 글에서 다음을
검사한다.

```yaml
learning_contract:
  question: 독자가 답해야 할 중심 질문
  prerequisite: 바로 앞에서 가져올 지식
  capability: 글을 읽은 뒤 할 수 있는 판단
  source: 근거 종류와 시점
  formula_note: 수식의 한국어 의미와 기호
  viz: 시각적 설명
  causal_viz: 입력을 바꾸면 결과와 판단이 바뀌는가
  next_link: 다음 글로 넘길 산출물
  prose_depth: 제목과 카드가 아니라 설명 본문이 충분한가
```

2026-07-29 audit 기준 등록 글은 610개였다. 이 단계의 목적은 "610개를 모두
늘린다"가 아니라, release blocker와 학습 단절을 우선순위로 바꾸는 것이다.

### 단계 B. hidden transfer problem을 먼저 만든다

본문을 쓰기 전에 해당 글의 가장 어려운 새 문제를 만든다. 문제 자체를 본문에
실을 필요는 없다. 문제는 누락된 인사이트를 찾는 내부 oracle이다.

좋은 hidden problem의 조건:

- 용어 암기로 풀리지 않는다.
- 서로 다른 두 개 이상의 개념을 연결해야 한다.
- 성공 조건과 실패 조건이 함께 있다.
- "무엇을 측정하고 다음에 어디로 갈지"를 물을 수 있다.
- 현재 글의 범위를 넘으면 다음 글을 정확히 지목해야 한다.

예:

- ARIMA: 시계열 plot 하나만 보고 차분 횟수를 확정하지 않고, ACF/PACF,
  residual과 validation을 연결할 수 있는가.
- Robot AI: 최신 VLA 목표에서 action representation, control loop, dynamics,
  signal foundations로 내려가되 실제 robot boundary를 잃지 않는가.
- olmOCR: benchmark 숫자보다 PDF renderer → anchor → decoder → reconstruction
  경계를 추적할 수 있는가.
- vLLM: 진행 중 decode, 6,144-token prompt, 반복 batch prefix와 낮은 KV
  headroom이 한 GPU에서 만날 때 SLO와 token budget을 함께 판단하는가.

### 단계 C. 최소 기반의 stop rule을 정한다

"가장 오래된 논문까지" 내려가면 학습 경로가 끝나지 않는다. 다음 조건을 모두
만족하는 첫 기반에서 멈춘다.

1. 위 글의 핵심 수식·알고리즘·구현 경계를 설명할 수 있다.
2. 더 아래 지식은 현재 경로의 결정을 바꾸지 않는다.
3. 초보자가 별도 전공 과정을 시작하지 않아도 다음 글로 돌아갈 수 있다.
4. 더 깊은 역사에는 "선택 심화" 링크만 둔다.

논문도 연도순 박물관으로 놓지 않는다. 현재 목표에서 실제로 사용되는 개념을
소유한 최소 canonical paper만 뼈대로 둔다.

### 단계 D. 네 개의 evidence clock을 분리한다

```yaml
current_behavior:
  source: release-pinned official docs
  claim: 지금 사용자가 기대할 수 있는 동작
canonical_idea:
  source: original paper or specification
  claim: 아이디어와 해당 실험 조건
code_excerpt:
  source: exact file commit
  claim: 그 파일의 실제 분기와 상태
teaching_fixture:
  source: editorial
  claim: 인과를 비교하기 위한 가상 수치
```

논문의 speedup은 현재 제품의 보장값이 아니다. `main` 코드는 release 문서와
같은 시간이 아닐 수 있다. 서로 다른 commit에서 가져온 CodeSidebar 파일은
하나의 checkout처럼 해석하면 안 된다. 이 경계를 본문에 직접 표시한다.

### 단계 E. content spec을 코드보다 먼저 고정한다

각 글의 `content-spec.md`에는 다음을 쓴다.

- 독자와 출발 지식
- hidden transfer problem
- 반드시 얻어야 할 insight
- 섹션별 질문·오해·반례·산출물
- 수식과 한국어 annotation
- Viz state, controls, causal outcome
- 원문과 source-time boundary
- 다음 글 handoff
- acceptance와 금지 주장

이 문서가 얕으면 구현도 카드 목록이나 키워드 사전으로 돌아간다.

### 단계 F. 본문을 인과 순서로 조립한다

기본 순서는 다음과 같다.

1. 현재의 구체적 실패 장면
2. 먼저 고정할 metric 또는 성공 조건
3. 가장 작은 mental model
4. 상태가 실제로 이동하는 경계
5. 식과 각 항의 한국어 역할
6. 실패 반례와 오해
7. current source 또는 pinned code
8. 독자가 남길 산출물
9. 다음 글과 그 글이 소유하는 질문

코드 버튼은 mental model보다 먼저 나오지 않는다. 표가 모델 이름을 나열하는
데 그치면 모델별 질문·변경점·실패 경계가 드러나는 서사로 풀어 쓴다.

### 단계 G. Viz는 장식이 아니라 작은 실험기로 만든다

HTML-first를 기본으로 한다. 고정 좌표 SVG는 좌표 자체가 학습 대상인 수학
그래프가 아니면 피한다.

```yaml
viz_contract:
  initial_scene: 본문의 구체적 실패 장면
  controls:
    - 실제 원인이 되는 입력
  derived_state:
    - 식 또는 구현 규칙으로 계산
  visible_output:
    - metric
    - current owner
    - intermediate artifact
    - pass_or_hold
    - next owner
  disclaimer: teaching fixture이면 benchmark가 아님을 화면에 표시
```

색만 바꾸지 않는다. 다음을 모두 확인한다.

- 읽는 순서와 시선의 시작점
- control 44px 이상
- 같은 종류는 같은 굵기와 간격
- 모바일에서 단어 단위 줄바꿈
- 긴 수식과 label의 최소 폭
- 카드 안 카드 금지
- 불필요한 화살표 track과 공백 제거
- owner, artifact, metric이 animation보다 먼저 보이는가

Animation은 인과 상태가 완성된 뒤 넣는다. 정적인 상태만으로 이해되지 않는
Viz에 움직임을 추가하면 혼란만 커진다.

### 단계 H. KaTeX는 렌더링과 의미를 따로 검증한다

수식은 문자열처럼 노출되면 실패다. display 수식 다음에는 FormulaNote를 둔다.

```yaml
formula:
  latex: "\\tau = a\\ddot{s} + b\\dot{s}^{2} + c"
  meaning_ko: 각 actuator torque가 path acceleration과 velocity에 어떻게 묶이는지
  symbols:
    tau: actuator torque
    ddot_s: path acceleration
    dot_s_squared: velocity-dependent term
  operational_question: 어떤 항이 acceleration upper/lower bound를 만드는가
```

브라우저에서는 raw `\theta`, `\frac`, `\underbrace`가 body text에 남는지,
KaTeX scale이 1보다 작아졌는지, 박스 밖으로 나가는지를 mobile/desktop에서
검사한다.

### 단계 I. 세 종류의 verifier를 통과시킨다

1. **정적 검사**: TypeScript, ESLint, source link/pin, 금지 문구.
2. **브라우저 검사**: 인과 outcome, controls, formula, overflow, screenshots.
3. **독립 검토**: Claude가 facts, transfer sufficiency, visual causality를
   서로 다른 task로 읽는다.

Claude 영수증은 아래 조건을 모두 만족해야 한다.

```yaml
valid_receipt:
  http: 200
  ok: true
  worker: claude-code:sonnet
  first_attempt_ok: true
  first_line: ACCEPT | REVISE
  substantive: true
  source_hash_before_equals_after: true
```

500, timeout, 빈 응답, malformed first line, 다른 worker와 hash drift는 판정으로
세지 않는다. 실패한 task만 새 ID로 다시 요청한다. `REVISE`는 수정 후 새
해시로 재검증한다.

이번 복구에서는 이전 pending manifest와 실패 영수증도 같은 규칙으로 다시
대조했다.

```yaml
historical_recovery:
  submitted_with_stored_receipts: 50
  strict_valid_sonnet: 46
  invalid_transport: 4
  invalid_without_smaller_valid_replacement: 0
  new_http_500: 0
  concurrency: 2
```

무효 4건은 모두 HTTP 200이지만 `ok=false`, Sonnet code 143이었다. broad
packet의 판정을 추측하지 않고 작은 packet으로 나눠 모두 유효 영수증으로
대체했다. 전체 표는
`.codex-tmp/claude-recovery-all-pending-2026-07-28/ledger.md`, 초기 500과
timeout 복구 과정은
`2026-07-27-context-manager-strict-claude-revalidation.md`에 보존했다.

### 단계 J. 빌드와 공개 URL을 다시 검사한다

로컬 개발 서버 통과는 배포 완료가 아니다.

1. production build
2. service restart
3. service active 상태
4. local/public index hash 비교
5. 공개 asset HTTP 200
6. 공개 URL에서 focused Playwright
7. 공개 mobile/desktop screenshot

## 3. 기존 글을 유지·통합·숨기는 판단

독립 질문이 있으면 기존 route를 유지한다. 단순 용어 목록, 중복 요약,
표 중심 fact sheet는 상위 글의 흐름 속으로 통합한다.

```yaml
keep:
  - 고유한 hidden problem이 있다
  - 다음 글에 넘길 산출물이 있다
  - source 또는 구현 경계를 독립적으로 소유한다
merge:
  - 같은 질문을 더 얕게 반복한다
  - 모델명/용어를 나열할 뿐 판단을 만들지 않는다
hide_from_default_path:
  - 최소 기반 아래의 역사 심화
  - 현재 목표에 필요하지 않은 우회 분기
  - 아직 source/learning contract 검증 전인 글
```

사이드바는 "전체 지도"라는 한 항목에 모든 것을 넣지 않는다. 목표 경로,
현재 연구 branch, 공통 기반, 구현·운영의 역할을 분리하고 각 항목에서
"왜 다음인가"가 보이게 한다.

## 4. 4B 모델로 재현하는 방법

4B 모델에는 전체 저장소와 긴 논문을 한 번에 주지 않는다. 한 번에 한 장부만
맡긴다.

### 4B 역할 분해

```yaml
jobs:
  inventory:
    input: article metadata + rendered signals
    output: missing contract fields
  claim_tagger:
    input: one paragraph + source excerpt
    output: current | paper | code | fixture | unsupported
  section_writer:
    input: one question + three insights + one counterexample
    output: 500-800 Korean words
  formula_annotator:
    input: one LaTeX expression + symbol glossary
    output: meaning_ko + symbols + failure interpretation
  viz_planner:
    input: state variables + transition rules
    output: controls + derived outputs + pass/hold
  verifier:
    input: one acceptance criterion + rendered excerpt
    output: pass/fail + one evidence line
```

4B 출력은 자유 산문보다 JSON/YAML schema로 받는다. `unknown`을 허용하고
근거 없는 숫자를 만들면 전체 task를 실패시킨다.

### 4B 최소 packet

```yaml
article_goal: 한 문장
reader_start: 최대 3개
hidden_case: 5-8개 state field
required_insights: 최대 5개
source_excerpt: 한 종류, 1-2k tokens
forbidden_claims: 명시
output_schema: 고정
```

한 섹션을 작성한 뒤 verifier에게 "이 본문만으로 hidden case의 다음 결정을
할 수 있는가"만 묻는다. 전체 품질 평가는 4B에게 맡기지 않는다.

## 5. 9B 모델로 재현하는 방법

9B 모델은 한 글 전체의 인과 순서와 반례를 맡길 수 있다. 그래도 source clock은
분리해서 준다.

```yaml
packet:
  content_spec: full
  current_docs: selected excerpts
  canonical_paper: abstract + relevant figure/equation/experiment
  code: exact function excerpts
  rendered_article: current draft
  screenshots: target Viz only
required_output:
  - claim ledger
  - missing reasoning edges
  - section reorder
  - one counterexample per major concept
  - viz transition table
  - release blockers
```

9B는 초안을 한 번에 고치게 하지 않는다.

1. read-only audit
2. bounded section rewrite
3. exact-hash read-only re-audit

이 순서를 지키면 문장을 고치며 새로운 사실 오류를 넣는 문제를 줄일 수 있다.

## 6. Orchestrator 의사코드

```text
for article in priority_queue(rendered_audit):
    spec = build_content_spec(article, hidden_transfer_problem)
    sources = freeze_evidence_clocks(spec)

    while true:
        draft = write_bounded_sections(spec, sources)
        static = run_static_checks(draft)
        browser = run_causal_and_responsive_checks(draft)

        if not static.pass or not browser.pass:
            apply_bounded_fixes(static, browser)
            continue

        receipts = parallel_audit(
            facts(draft, sources),
            transfer(draft, spec),
            visual(draft, browser.screenshots),
            max_concurrency=2
        )

        invalid = receipts where not strict_valid
        retry(invalid)

        revisions = receipts where first_line == REVISE
        if revisions:
            apply_bounded_fixes(revisions)
            continue

        build_and_deploy()
        verify_public()
        write_receipt(article)
        break
```

## 7. 이번 작업에서 발견한 반복 실패 패턴

- 색 변경을 Viz 개선으로 착각
- fixed SVG에서 `viewBox`만 넓히고 글자 크기는 그대로 둠
- 표와 카드 개수를 늘려 깊이가 생겼다고 판단
- current docs와 original paper speedup을 같은 시제로 표현
- `main` 링크를 재현 가능한 source처럼 사용
- 수식은 렌더됐지만 각 항의 역할을 설명하지 않음
- 전문 용어를 쉬운 단어로 바꾸기만 하고 인과 연결은 생략
- 최신 글을 위에 추가하면서 새 prerequisite를 아래 경로에 연결하지 않음
- 테스트가 element 존재만 검사하고 상태 전이는 검사하지 않음
- Claude 500·timeout·malformed 응답을 검증 완료로 잘못 셈
- 로컬 build 성공을 공개 배포 성공으로 착각

## 8. 생성된 상세 영수증

- `2026-07-28-ai-information-architecture-reconstruction.md`
- `2026-07-29-olmocr2-source-reconstruction.md`
- `2026-07-29-robot-ai-topdown-reconstruction.md`
- `2026-07-29-arima-reconstruction.md`
- `2026-07-29-vllm-reconstruction.md`
- `2026-07-29-learning-flow-audit-report.md`

각 영수증은 선택 이유, hidden problem, source boundary, 수정 결정, 테스트와
독립 검증을 보존한다. 이 문서는 그 여러 번의 판단을 작은 모델용 공통
프로토콜로 압축한 것이다.

## 9. 최종 완료 조건

- 우선순위로 선택한 글이 mastery contract를 충족한다.
- hidden problem의 첫 병목과 다음 owner를 본문만으로 설명할 수 있다.
- source clock과 minimum-paper stop rule이 보인다.
- causal Viz와 formula annotation이 mobile/desktop에서 읽힌다.
- 유효한 독립 검증은 모두 `ACCEPT`다.
- production build와 공개 URL 검증이 동일한 source 상태에서 끝난다.

마지막 vLLM closure는 facts, hidden transfer, responsive causality의 세
read-only scope 모두 strict `ACCEPT`로 끝났다. timeout과 형식 오류 응답은
판정에서 제외하고 축소 재호출했다.

```yaml
final_public_closure:
  route: https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/vllm-serving
  build_modules: 8764
  public_focused_playwright: 18/18
  public_representative_responsive: 2/2
  mobile_width: 390/390
  raw_latex: false
  mastery: 100
  prose_depth: 5273
  asset: dist/assets/vllm-serving-CGWBHZee.js
  asset_bytes: 43583
  index_sha256: 58594e30b662fe3bef6032b8ce3f060d02dd47194d2f4c010b8e3cf5964df913
```

이 해시는 build 산출물, local service, public index에서 동일하다. 따라서
“작성 완료”가 아니라 동일 source 상태의 독립 검증, production deploy,
공개 렌더 검증까지 닫힌 사례로 재현할 수 있다.

## 10. 누락된 Claude 검증을 복구한 방법

Context Manager의 과거 `500`, timeout, 빈 응답을 `ACCEPT`나 `REVISE`와
섞지 않았다. 기존 영수증 143개를 다음 strict receipt로 다시 분류했다.

```yaml
historical_receipts:
  total: 143
  strict_valid: 107
  invalid: 36
  valid_first_line:
    ACCEPT: 63
    REVISE: 39
    malformed_but_transport_valid: 5
  prompt_deviation: 15
```

유효 판정은 HTTP 200만으로 닫지 않았다.

```yaml
strict_receipt:
  http: 200
  ok: true
  worker: claude-code:sonnet
  attempt_ok: true
  first_nonempty_line: ACCEPT | REVISE
  result_characters: "> 120"
  source_hash_before_equals_after: true
```

현재 source에 영향을 줄 수 있는 오래된 `REVISE`는 다시 읽었다. Sidebar의
44px hit target과 role legend, branch-first 경로 라벨, agent/MCP 실제 route
crosslink를 고친 뒤 각각 별도 post-fix `ACCEPT`를 받았다. 광범위 prompt가
timeout이나 빈 결과를 반환하면 판정을 만들지 않고, 정의·runtime·responsive
같은 작은 증거 묶음으로 나눠 재호출했다.

## 11. 확률·정보이론 재구성 사례

### 선택 이유

`probability-information-theory`는 12개 top-down 경로가 공유하는 기반인데,
기존 상태는 설명 본문 깊이 1,302, 공식 9개, 오래된 탐색기 2개뿐이었다.
또 `theta^8(1-theta)^2`를 “10번 중 앞면 8번” 전체 사건처럼 설명하면서
순서가 고정된 한 sequence와 `C(10,8)`개의 순서를 합친 count 사건을
구분하지 않는 오류가 있었다. 이 오류는 likelihood, MLE, NLL, cross-entropy를
연달아 오해하게 만든다.

### 본문보다 먼저 만든 숨은 전이 문제

```yaml
hidden_transfer_fixture:
  input:
    raw_scores: [3.2, -0.4, 1.7]
    shifted_scores: [8.2, 4.6, 6.7]
    true_class: C
    coin_observation:
      trials: 17
      heads: 11
  learner_must_derive:
    - score와 probability distribution의 차이
    - sample space와 support
    - joint에서 marginal, conditional, Bayes로 이동하는 연산
    - probability와 likelihood에서 고정하는 축
    - ordered sequence와 count event의 조합계수 차이
    - iid likelihood에서 log-likelihood와 MLE
    - softmax common-shift invariance
    - one-hot NLL에서 empirical cross-entropy
    - H(P,Q)=H(P)+D_KL(P||Q)
    - P(x)>0, Q(x)=0일 때의 support failure
    - bit와 nat의 로그 밑 차이
  success:
    - 식뿐 아니라 각 단계에서 무엇을 고정하고 무엇을 합치는지 설명한다
    - runtime 책임은 PyTorch 공식 문서 범위를 넘겨 주장하지 않는다
```

본문에는 이 문제를 그대로 싣지 않았다. 대신 여섯 질문을 순서대로 배치했다.

1. score가 확률이 되기 위해 필요한 조건
2. joint에서 관측 후 posterior까지 가는 연산
3. probability와 likelihood가 갈리는 고정 축
4. logit이 softmax와 정답 label을 거쳐 loss가 되는 과정
5. entropy, cross-entropy, forward KL의 비용 분해
6. calibration과 support가 무너지는 경계

### 근거와 의도

- Deep Learning Book 3장: 확률 정의, conditional, Bayes, 기댓값, 분산,
  entropy, cross-entropy, KL의 canonical 근거
- Deep Learning Book 5장: iid likelihood, log 변환, MLE, empirical
  cross-entropy 연결
- PyTorch Softmax/CrossEntropyLoss 현재 공식 문서: stabilized runtime 의미,
  index/soft target 계약과 target 유효성 책임
- Guo et al. 2017: calibration의 집단 정의와 temperature scaling 실험 범위

책의 일반 정의, 현재 library behavior, 논문의 실험 결론을 같은 시제로 쓰지
않았다. 특히 group calibration을 개별 예측의 확실성 보장으로 확대하지 않았다.

### Viz 결정

세 Viz는 장면 재생이 아니라 계산 가능한 실험기로 만들었다.

```yaml
distribution_lab:
  controls: 세 raw weight
  derived: normalized probability, E[X], Var(X), H(P)
bayes_lab:
  controls: prevalence, sensitivity, false-positive rate
  derived: TP, FP, posterior
score_to_loss_lab:
  controls: logits, temperature, true class, common shift
  derived: stabilized softmax, prediction, NLL, CE, KL
```

마지막 Viz의 데스크톱 SCORE 열이 좁아 한글이 2~5자씩 세로로 끊긴다는 독립
검증을 받았다. 열 최소폭을 7rem으로 고정하고 설명을 “정규화 전 비교값”과
“음수·임의 합 허용”으로 압축했다. 긴 Bayes 식은 posterior 식과 evidence
경로 합으로 분리해 모바일 수식 배율을 0.86에서 1.00으로 올렸다.

공개 모바일에서는 temperature 분포와 argmax 불변식을 한 줄에 둔 식이 웹폰트
기준 0.71까지 축소됐다. 두 명제를 독립 FormulaFrame으로 나눠 둘 다 1.00으로
복구했다. hidden fixture를 실제로 풀게 한 감사에서는 다음 누락이 추가로
드러났다.

- `10회 중 8회`만 있던 식을 `n회 중 k회`, `C(n,k)`, `MLE=k/n`과 미분으로 일반화
- max logit `m`과 sample 수 `m` 충돌을 sample 수 `N`으로 분리
- 이진 Bayes evidence를 다중 class의 `sum_y`로 일반화
- aleatoric/epistemic을 Kendall & Gal 원문과 연결
- entropy의 `0 log 0=0`과 Q support의 `-log 0=+infinity`를 코드·본문·직접 함수 테스트로 분리
- PyTorch의 LogSoftmax+NLL 관계를 내부 구현 주장이 아니라 수학적 동치로 한정

### 검증 결과

광범위 수학 사후 감사 한 건은 HTTP 200이었지만 worker timeout으로 결과가
비어 있어 제외했다. 이후 작은 묶음으로 다시 실행한 strict receipt는 모두
source hash가 안정된 `ACCEPT`였다.

```yaml
claude_receipts:
  definitions_information: ACCEPT
  likelihood_learning_loss: ACCEPT
  runtime_calibration_narrative: ACCEPT
  responsive_postfix: ACCEPT
  hidden_transfer_unseen_fixture: ACCEPT
  q_support_runtime: ACCEPT
  calibration_uncertainty_provenance: ACCEPT
tests:
  focused_probability: 7/7
  related_navigation_regression: 90/90
mastery:
  score: 100
  prose_depth: 4861
  formulas: 36
  formula_notes: 11
  causal_viz: 3
  interactions: 23
  internal_links: 4
```

### 작은 모델용 작업 패킷

4B에는 위 fixture 전체를 주지 않는다. 다음 네 호출로 나눈다.

```yaml
4b_packets:
  - score_distribution: [normalization, expectation, variance]
  - bayes: [joint, marginal, conditional, evidence]
  - likelihood: [sequence, count, log, MLE]
  - information_loss: [softmax, NLL, CE, KL, support]
```

각 호출은 한 source excerpt, 한 반례, 고정 JSON 출력만 받는다. 9B에는 네
결과와 content spec을 함께 주고 섹션 순서와 handoff만 감사시킨다. 마지막
responsive 감사는 산문 감사와 분리한다. 이 분해가 큰 prompt에서 발생한
timeout을 피하면서도 같은 추론 경계를 보존한 핵심이다.

### 공개 배포와 공용 수식 맞춤 종결

첫 공개 배포는 `dist`, 로컬 서비스, 공개 URL의 index와 article asset 해시가
모두 같았지만, 390px 반복 검사에서 Bayes evidence 수식이 간헐적으로 3px
넘쳤다. 따라서 이것을 캐시나 배포 지연으로 처리하지 않고 공용
`MathFormula`의 웹폰트 로딩 경쟁 조건으로 추적했다.

기존 구현은 직전 scale에 새 비율을 누적 곱했다. KaTeX font가 바뀌는 frame과
측정 frame이 엇갈리면 `0.99`에서 조기 정지할 수 있었다. 최종 구현은 다음
불변식을 가진다.

```yaml
math_fit_invariants:
  measurement: 매번 1em 원본 폭에서 직접 계산
  resize_observer: container width가 0.5px보다 크게 바뀔 때만 재측정
  font_events: fonts.ready와 loadingdone 뒤 재측정
  readable_floor: 0.80
  cleanup: animation frame, observer, font listener 해제
```

Claude micro audit는 첫 판정에서 0.52 가독성 하한, width guard, 잔여 변수를
`REVISE`로 지적했다. 0.72로 보정한 두 번째 판정도 생성 모델 계약의 0.80과
불일치해 `REVISE`였다. 실제 96개 회귀에서도 RNN 모바일 수식이 0.78로 잡혔다.
하한과 확률 글 계약을 0.80으로 통일한 세 번째 strict receipt에서 source hash
안정성을 유지한 `ACCEPT`를 받았다.

```yaml
final_release:
  claude_math_fit_receipt:
    http: 200
    worker: claude-code:sonnet
    attempts:
      - REVISE
      - REVISE
      - ACCEPT
    source_hash_stable: true
  local_regression:
    probability_and_formula_corpus: 96/96
  public_regression:
    probability_repeat_3: 21/21
  public_mobile_audit:
    formula_count: 29
    minimum_formula_scale: 0.90
    maximum_formula_overflow_px: 0
    maximum_figure_overflow_px: 0
    document_overflow_px: 0
    raw_latex: false
  build:
    transformed_modules: 8767
    index_sha256: f8e099a2f7be307a4faec7b8103ab24b125199c8d09a4bf94ca9024a5bd49523
    article_asset: probability-information-theory-ZQ7rAVmV.js
    article_asset_bytes: 50791
    article_asset_sha256: d0c8447b6cc435467a27864aa74e26519470da458086c4e4043eba86760cf63e
    math_asset: math-DLllOwVa.js
    math_asset_sha256: fdc582463e8f7ccdf9898b51e74ad05c397bc0fe7d45ecc5541cdefc3a1080a5
  deployment:
    service: cm-blog.service
    state: active
    local_public_hashes_match: true
```

## 12. 신호와 시스템 재구성 사례

### 왜 이 글을 다음 기반으로 골랐는가

`signals-systems-convolution`은 고전 전자공학 과목 하나가 아니라 CNN, audio,
sensor sampling, control, S4·Mamba가 공유하는 계산 언어다. 기존 글을
`convolution 정의`에서 끝내면 최신 SSM 논문으로 돌아갈 수 없고, 반대로
Mamba부터 설명하면 LTI와 fixed kernel이 왜 깨지는지 알 수 없다. 따라서
다음과 같은 최소 stop rule을 사용했다.

```yaml
minimum_floor:
  include:
    - signal, index, system contract
    - linearity, time invariance, causality, BIBO
    - impulse decomposition and convolution
    - difference equation, initial rest, recurrence unroll
    - complex exponential eigenfunction and Y=HX
    - sampling theorem, alias, anti-alias ordering
    - mathematical convolution vs PyTorch cross-correlation
    - fixed SSM recurrence-kernel duality vs Mamba selection
  stop_before:
    - measure theory
    - full Fourier convergence proof
    - general Z-transform pole-zero course
    - S4 structured kernel implementation details
```

더 아래 과목이 흥미롭더라도 현재 AI 경로의 판단을 바꾸지 않으면 선택
심화로 넘겼다. 이 기준이 “기반의 기반”을 무한히 과거로 확장하는 것을
막는다.

### 본문보다 먼저 만든 숨은 전이 문제

```yaml
hidden_transfer_fixture:
  lti:
    x: [1, -2, 4, 1, -1]
    h: [0.6, 0.3, -0.1]
    required:
      - full causal linear convolution
      - output support N+M-1
      - centered smoother가 streaming에서 미래를 요구하는 이유
      - BIBO와 property counterexample
  recurrence:
    a: 0.75
    b: 1
    c: 1.4
    initial_state: 0
    required:
      - h[k]=c*a^k*b
      - scan 출력과 convolution 출력 일치
      - initial rest가 없을 때 빠지는 항
  sampling:
    sample_rate_hz: 58
    desired_hz: 12
    interference_hz: 46
    required:
      - 46 Hz가 sample 위에서 12 Hz와 겹침
      - digital filter가 원인을 되살리지 못함
      - analog anti-alias filter의 위치
  runtime:
    required:
      - asymmetric h를 뒤집어 Conv1d weight로 변환
      - dilation/stride/padding을 포함한 output length
      - fixed SSM은 kernel로 펼칠 수 있지만 input-dependent Mamba는
        static convolution으로 축약할 수 없는 이유
```

본문과 Viz에는 이 fixture를 복사하지 않았다. 공개 예시는 24 Hz sampling,
13 Hz signal, 11 Hz alias처럼 다른 수치를 사용했다. 독립 감사는 숨은
수치를 직접 계산해야만 `ACCEPT`할 수 있게 했다.

### 근거와 시간 경계

- MIT 6.003 Lecture 4~6: impulse decomposition, LTI convolution, causality,
  BIBO, difference equation과 initial rest
- MIT 6.003 Lecture 9·16: complex exponential eigenfunction의 원형과
  bandlimited sampling
- SciPy `fftconvolve`: 현재 full output 길이와 direct/FFT 선택 경계
- PyTorch `Conv1d`: 현재 cross-correlation convention, output length,
  `padding="same"`의 stride 제약
- S4·Mamba 원 논문: fixed recurrence-convolution duality와
  input-dependent selection 이후 static kernel이 깨지는 경계

Lecture 9의 continuous-time `e^{st}`·Laplace 유도는 그대로 이산 식인 것처럼
쓰지 않았다. 본문은 같은 convolution 구조에 `e^{j omega n}`을 직접 대입한
별도 유도임을 표시했다. anti-alias filter의 ADC 앞 배치는 Lecture 16의
직접 문장을 인용한 것이 아니라, sampling 뒤 alias가 비가역이라는 결과에서
도출한 engineering inference라고 표시했다.

### 서사와 Viz 결정

일곱 절은 용어 순서가 아니라 독자가 막히는 질문 순서로 배치했다.

1. 같은 입력·출력 모양이어도 어떤 system contract가 다른가
2. 왜 impulse 하나만 알면 모든 입력을 계산할 수 있는가
3. 미래 sample을 읽지 않고 안정적으로 실행 가능한가
4. recurrence가 어떻게 kernel로 펼쳐지는가
5. convolution이 왜 주파수별 곱이 되는가
6. sampling으로 어떤 정보가 영구히 사라지는가
7. 이 개념이 Conv1d, S4, Mamba에서 어디까지 유지되는가

네 Viz는 모두 입력 조작이 계산 결과와 판단을 바꾸게 만들었다.

```yaml
system_property_lab:
  controls: system choice
  outputs: linearity, time invariance, memory, causality witnesses
convolution_workbench:
  controls: shift k
  outputs: flip-shift-multiply terms, partial sum, full output
recurrence_kernel_lab:
  controls: coefficient a, impulse/step input
  outputs: scan state, unfolded kernel, stable/unstable verdict
sampling_explorer:
  controls: source frequency, sample rate
  outputs: original wave, samples, alias candidate, Nyquist verdict
```

모바일과 데스크톱은 같은 SVG 좌표계를 억지로 축소하지 않았다.
recurrence·sampling 그래프는 별도 mobile viewBox와 label을 사용했다.
상태 배지와 전체화면 버튼이 겹친 결함은 캡션 우측에 64px 안전 여백을
두고 실제 bounding box 교차를 검사해 닫았다.

### Context Manager 500·timeout 복구

넓은 확률 preaudit가 재시도에서도 timeout났기 때문에 실패 응답을 판정으로
세지 않았다. 기존 작은 receipt를 content-spec 항목별로 stitch한 뒤,
Kendall & Gal, Shannon 1948, expectation·variance, random variable·PMF의
미검증 범위를 각각 별도 호출했다. 마지막 stitch가 정의·likelihood·runtime·
숨은 전이 전부에 strict `ACCEPT`가 하나 이상 연결됐음을 확인했다.

신호 글도 LTI, frequency/sampling, runtime/SSM, responsive 네 범위로
병렬화했다. 감사 중 source가 바뀌어 hash drift가 발생한 `ACCEPT`는 내용이
좋아도 최종 영수증에서 제외했다. `REVISE`로 발견한 이산 주파수 표기 혼용과
위젯 밖 예시 수치를 고친 다음 동일 source 상태에서 네 범위를 다시 호출했다.

```yaml
local_release_evidence:
  mastery:
    score: 100
    prose_depth: 6042
    formulas: 51
    formula_notes: 16
    interactions: 17
    internal_links: 5
  learning_flow:
    release_blockers: 0
    review_needed: 0
    formula_gaps: 0
    global_continuity_coverage: 299
  responsive:
    viewports: [390, 768, 1440]
    document_overflow: 0
    figure_overflow: 0
    formula_overflow: 0
    minimum_formula_scale: 0.80
    controls_below_44px: 0
    console_errors: 0
    raw_latex: false
```

넓은 LTI 사후 감사는 마지막 재호출에서도 worker timeout으로 비어 있어
제외했다. 이를 두 범위로 나눈 최종 strict receipt와 나머지 영수증은 모두
HTTP 200, Sonnet, first attempt 성공, 120자 이상, source hash 안정 조건을
만족했다.

```yaml
final_claude_receipts:
  probability_timeout_replacement_stitch: ACCEPT
  signals_impulse_convolution: ACCEPT
  signals_properties_recurrence: ACCEPT
  signals_frequency_sampling: ACCEPT
  signals_runtime_ssm: ACCEPT
  signals_responsive: ACCEPT
final_deployment:
  build_modules: 8768
  article_asset: signals-systems-convolution-DoOxFa1P.js
  article_asset_bytes: 59327
  article_asset_sha256: 0190d88e92827b3a716c6d61c484e9ae1fbbbcedff5d2d7b1f32bf05818882f6
  index_sha256: cbc96eee93b1bcab0938a79e748710c52c8baac6d2ba1d886aadd8d93279d4dd
  local_public_index_hash_match: true
  public_asset_hash_match: true
  public_playwright:
    viewports: [390, 1440]
    figures: 4
    rendered_katex_nodes: 112
    raw_latex: false
    overflow: 0
    status_button_overlap: false
    causal_transitions:
      sampling_safe: 대역 안쪽
      sampling_alias: 4.0 Hz로 겹침
      recurrence_unstable: 기억이 감쇠하지 않음
```

### 4B·9B에 넘길 때의 분해

4B에는 다음 네 packet을 독립적으로 준다.

```yaml
4b_packets:
  - lti_witness: [linearity, shift test, causality, BIBO]
  - convolution_execution: [impulse, flip, shift, support]
  - frequency_sampling: [eigenfunction, FFT boundary, alias]
  - ai_runtime_bridge: [Conv1d convention, S4, Mamba]
```

각 packet은 한 개의 source excerpt, 한 개의 새 수치 fixture, 한 개의
반례만 가진다. 9B는 네 결과를 받아 section handoff와 용어 표기의 일관성을
검사한다. screenshot 감사는 산문·수학 감사와 합치지 않는다. 이 분해는
작은 모델이 모든 분야를 아는 척하지 않고 정확히 한 경계만 검증하게 한다.

## 13. 선형대수와 Tensor Shape 재구성 사례

### 왜 이 글을 먼저 고쳤는가

`linear-algebra-tensors`는 Robot AI, LLM architecture, interpretability,
image/video, vision, NLP·Attention, on-device inference, disaggregated
serving의 여덟 top-down track이 함께 참조하는 기반이다. 기존 글은 vector와
행렬 정의를 소개했지만, 상위 글에서 실제로 막히는 다음 경계가 한 서사로
이어지지 않았다.

- 같은 대상과 달라진 coordinate를 구분하는 기준
- dot, cosine, scalar projection, vector projection의 출력 차이
- matrix product에서 없어지는 contraction axis와 남는 free axis
- 교과서 행렬과 PyTorch `nn.Linear` 저장 convention의 차이
- broadcast 가능 여부와 의미상 올바름의 차이
- shape, stride, storage, view/copy, dtype, byte의 runtime 연결

따라서 역사를 더 내려가지 않고, 현재 모델·로봇·runtime을 읽는 데 필요한
좌표, 선형결합, 내적, 행렬곱을 최소 floor로 고정했다. rank, null space,
eigendecomposition, SVD가 실제 질문이 되는 순간은
`linear-algebra-decompositions`로 넘겼다.

### 본문보다 먼저 만든 숨은 전이 문제

```yaml
hidden_transfer_fixtures:
  A_basis:
    ask: 같은 world vector를 회전한 basis에서 읽고 다시 복원한다
  B_projection:
    ask: vector 길이만 바꿀 때 dot, cosine, scalar/vector projection을 구분한다
  C_linear_convention:
    ask: textbook W[D,O]와 PyTorch A[O,D]의 저장·계산 convention을 변환한다
  D_attention:
    ask: multi-head QK^T에서 contraction axis와 free axis를 이름으로 추적한다
  E_broadcast:
    ask: "[8,8,32] + [8,32]가 실행돼도 sample 축 의미가 충돌함을 찾는다"
  F_layout_memory:
    ask: permute 뒤 stride, view/copy 가능성, KV payload byte를 함께 계산한다
```

본문과 Viz에는 다른 vector, batch, layer, head dimension 수치를 사용했다.
따라서 공개 예시의 숫자를 복사해서는 풀 수 없고, 독자가 식과 인과관계를
새 fixture에 옮겨야 한다.

### 출처와 작성 의도

원문은 `.codex-tmp/linear-algebra-tensors-sources-2026-07-30/`에 HTML과
추출 text를 함께 저장하고 SHA-256을 고정했다.

```yaml
source_intent:
  deep_learning_book_ch2:
    use: vector, norm, dot, matrix multiplication의 수학 책임
    do_not_claim: framework storage나 runtime copy 동작
  pytorch_linear:
    use: "y = x A^T + b와 weight [out_features, in_features]"
  pytorch_matmul:
    use: batched matrix multiplication의 마지막 두 축과 batch broadcast
  pytorch_broadcasting:
    use: broadcastability의 실행 규칙
    boundary: 의미상 axis 정렬은 작성자가 별도로 검증
  pytorch_tensor_views_and_view:
    use: stride, contiguity, view/reshape의 alias와 copy 경계
  pytorch_storage:
    use: tensor view가 같은 storage를 공유할 수 있다는 runtime 근거
```

이 source ledger 때문에 수학적 정의, framework convention, 교육용 추론을
한 출처의 주장처럼 섞지 않았다.

### 최종 학습 서사와 Viz

본문은 다음 일곱 단계로 다시 썼다.

1. 대상, axis, coordinate를 분리한다.
2. linear combination과 matrix를 direction 혼합 규칙으로 읽는다.
3. norm, dot, cosine, scalar/vector projection을 분리한다.
4. matrix product에서 contraction axis를 찾는다.
5. tensor axis 이름으로 Linear와 Attention을 읽는다.
6. broadcast 가능한 연산과 의미상 올바른 연산을 구분한다.
7. shape를 stride, storage, dtype, byte와 상위 경로로 연결한다.

네 Viz는 결과를 보여주는 그림이 아니라 입력을 바꾸면 판단이 달라지는
작은 실험으로 만들었다.

```yaml
causal_viz:
  coordinate_frame:
    control: basis 회전 | vector 회전
    invariant: basis만 돌리면 world endpoint는 고정
  similarity_projection:
    control: angle | vector length
    invariant: 길이만 바꾸면 cosine은 고정, dot과 projection은 변화
    boundary: zero vector에서는 cosine undefined
  shape_contraction:
    control: 2D Linear | Batch Linear | Attention, output index
    evidence: 선택한 출력 한 칸의 실제 합을 항별로 전개
  tensor_layout_memory:
    control: origin | permute | reshape | contiguous, dtype, sequence length
    evidence: shape·stride·storage alias와 KV byte가 함께 변화
```

모바일에서는 segmented control의 열 수를 상태 수에 맞게 고정하고, 모든
control을 44px 이상으로 유지했다. 수식은 15개, `FormulaNote`는 10개이며
긴 byte 식을 둘로 나눠 390px에서 최소 배율을 `0.91`로 유지했다. 모든
underbrace 설명은 한국어로 쓰고 raw LaTeX가 보이지 않게 했다.

### Claude 교차 검증과 수정 루프

Context Manager는 넓은 한 번의 호출 대신 네 독립 범위로 병렬 호출했다.
중간 `REVISE`는 다음 실제 결함을 찾았다.

- 일반 L2 norm과 scalar projection 설명 누락
- public Viz가 hidden runtime fixture 수치를 너무 가깝게 노출
- tensor byte 공식이 KV 전용 설명에 묶인 잘못된 grouping
- vector projection Viz가 projection vector 대신 residual을 강조
- PyTorch Storage 원문 누락
- interpretability의 probe·unembedding과 vision의 mask 축으로 돌아가는
  명시적 bridge 누락

수정 뒤 최종 영수증은 모두 HTTP 200, Sonnet, first attempt 성공, 120자
이상, source hash 안정 조건을 만족했다.

```yaml
final_claude_receipts:
  coordinate_projection_attempt_5: ACCEPT
  tensor_runtime_attempt_5: ACCEPT
  formula_responsive_attempt_5: ACCEPT
  crosspath_hidden_transfer_attempt_6: ACCEPT
  historical_probability_timeout_replacement: ACCEPT
```

과거 probability runtime attempt 3의 running-only 기록도 별도 replacement
감사로 닫았다. 따라서 timeout, 500, 빈 결과를 성공 영수증으로 세지 않았다.

### 출시 증거

```yaml
local_release_evidence:
  build_modules: 8769
  playwright_contracts: 6/6
  narrative:
    viewports: [390, 768, 1440]
    errors: 0
    warnings: 0
  learning_flow:
    registered: 299
    release_blockers: 0
    review_needed: 0
    formula_gaps: 0
    global_continuity_coverage: 299
  mastery:
    top_down_references: 8
    weak_references: 0
    score_each: 100
    prose_depth: 4500
public_release_evidence:
  route_status: 200
  viewports: [390, 1440]
  figures: 4
  causal_labs: 4
  formulas: 15
  rendered_katex_nodes: 59
  minimum_formula_scale:
    mobile: 0.91
    desktop: 1
  document_overflow: 0
  formula_overflow: 0
  controls_below_44px: 0
  raw_latex: false
  console_errors: 0
  coordinate_transition: 3.5713 -> 2.8025
  article_asset: linear-algebra-tensors-ooWnjPnf.js
  article_asset_bytes: 59871
  article_asset_sha256: 42cb7d6c1793c70d066e34099178247bd558d84edf108d8dbb6ac7b329e144a0
  index_sha256: 68bcd3d4020c8213b1d2e48cddf133969df1f362a08752b4d8a6280e748c3a11
  local_public_index_hash_match: true
  public_asset_hash_match: true
```

### 4B·9B에 넘길 때의 분해

4B 모델에는 한 번에 전체 선형대수를 쓰게 하지 않는다.

```yaml
4b_packets:
  - coordinates: [object, basis, coordinate, reconstruction]
  - similarity: [norm, dot, cosine, scalar_projection, vector_projection]
  - contraction: [named_axes, free_axes, textbook_vs_pytorch, attention]
  - runtime: [broadcast_semantics, stride, storage, view_copy, dtype_bytes]
```

각 packet은 한 개의 공식 원문, 공개와 다른 hidden fixture 하나, 반례 하나,
허용된 상위 링크만 받는다. 9B 모델은 네 packet을 합쳐 용어와 symbol의
일관성, 일곱 section handoff, 여덟 top-down reason 회수, source ledger
경계를 검사한다. 수식·반응형 screenshot 감사는 산문 감사와 분리한다.
이렇게 해야 작은 모델도 정의를 길게 나열하지 않고 "무엇이 고정되고 어느
축이 사라지며 어떤 byte가 실제로 이동하는가"라는 좁은 판단을 정확히 한다.

## 14. 미분과 계산 그래프 재구성 사례

### 왜 이 글을 다음 공통 기반으로 골랐는가

`calculus-computational-graphs`는 현재 curriculum에서 29개 상위 이유가
참조하는 고빈도 기반이다. 감사 전 기준 점수는 78, prose depth는 1249였다.
기존 글은 미분·gradient·chain rule을 소개했지만 다음 상위 질문을 한 흐름으로
해결하지 못했다.

- derivative 값과 함수값의 차이, 단위가 왜 `출력/입력`인지
- gradient와 한 방향의 변화율이 왜 같은 것이 아닌지
- graph 안에서는 왜 곱하고, 공유 node·broadcast에서는 왜 더하는지
- full Jacobian을 만들지 않고 JVP·VJP를 왜 계산하는지
- PyTorch의 graph, saved value, leaf `.grad`, detach가 각각 무엇인지
- finite difference가 너무 작은 epsilon에서 오히려 실패하는 이유
- `q(s(t))`의 두 번째 미분이 path 곡률과 clock 가속으로 나뉘는 이유

따라서 "미분 공식 목록"을 늘리는 대신, 최신 모델·로봇·최적화에서 실제로
필요한 sensitivity 전달을 최소 floor로 고정했다. Newton·Leibniz의 역사,
epsilon-delta 증명, 일반 적분론, differential geometry로는 내려가지 않았다.
분포 응력의 공간 적분처럼 이 글이 가르치지 않는 기반은 잘못 연결하지 않고
별도 `integrals-fields-conservation` 후보로 남겼다.

### 본문보다 먼저 만든 숨은 전이 문제

```yaml
hidden_transfer_fixtures:
  A_local_units:
    ask: T(v)=3v^2-2v에서 함수값·derivative·선형 예측·residual과 단위를 구분
  B_direction:
    ask: 이변수 loss의 gradient를 구하고 지정 unit direction의 증가·감소 판정
  C_branch_broadcast:
    ask: 공유 branch의 path sum과 broadcast bias의 원래 shape 합산
  D_jvp_vjp:
    ask: 2x3 Jacobian에서 Jv, J^T c, full Jacobian sweep 수를 각각 계산
  E_autograd_state:
    ask: detach된 branch, 두 번 backward, zero_grad, saved value 수명을 분리
  F_float32_gradcheck:
    ask: epsilon 감소 중 truncation과 roundoff 사이의 유효 구간 판단
  G_second_chain:
    ask: q(s)=[s^2,sin(s)]에서 path curvature와 clock acceleration을 분리
  H_shared_losses:
    ask: denoiser loss와 policy loss가 공유 parameter에서 만날 때 기여 합산
```

공개 본문과 Viz는 모두 다른 함수·점·dimension을 사용했다. 숨은 문제는
공개 숫자를 복사해 풀 수 없고, local linear map, seed vector, branch sum,
state lifetime이라는 규칙을 새 상황에 옮겨야 해결된다.

### 출처와 작성 의도

원문은
`.codex-tmp/calculus-computational-graphs-sources-2026-07-30/`에 원본과 추출
text, SHA-256을 함께 고정했다.

```yaml
source_intent:
  mit_matrix_calculus:
    use: derivative를 local linear operator로 읽고 chain/JVP/VJP 비용을 도출
    boundary: 엄밀한 극한·manifold calculus는 내리지 않음
  baydin_autodiff_survey:
    use: symbolic, numerical, automatic differentiation과 forward/reverse trace
  pytorch_autograd_mechanics:
    use: dynamic graph, saved tensor, leaf accumulation, detach/no-grad 경계
  pytorch_func_vjp:
    use: tangent의 JVP와 cotangent의 VJP를 API shape 언어로 연결
  pytorch_gradcheck:
    use: central difference, precision, nondeterminism의 검산 경계
  pytorch_broadcasting:
    use: forward broadcast 규칙
    derived_by_author: backward sum-reduce는 chain rule로 도출
  modern_robotics:
    use: x_dot=J(theta)theta_dot의 velocity kinematics bridge
  sutton_policy_gradient:
    use: grad log pi와 advantage가 parameter sensitivity에 붙는 상위 bridge
```

수학 정의, framework runtime, 교육용 유도, 상위 응용을 한 출처의 직접
주장처럼 섞지 않았다. 특히 broadcast backward 합은 PyTorch 문서의 직접
문구라고 과장하지 않고 forward 복제와 chain rule에서 유도했다고 기록했다.

### 최종 서사와 인과형 Viz

본문은 다음 아홉 단계로 재구성했다.

1. 결과 변화량을 원인의 책임으로 되돌리는 질문을 세운다.
2. derivative를 접선 암기가 아니라 local linear map으로 읽는다.
3. partial, gradient, directional derivative의 출력과 방향을 분리한다.
4. path 안의 곱과 같은 node로 돌아오는 기여의 합을 연결한다.
5. Jacobian 전체 대신 필요한 JVP·VJP와 seed shape를 계산한다.
6. graph, saved value, leaf accumulation의 서로 다른 수명을 추적한다.
7. finite difference의 truncation·roundoff·nonsmooth 실패를 검산한다.
8. 두 번째 chain rule에서 path 곡률과 clock 가속을 분리한다.
9. LLM, diffusion, RL, robot, optimizer의 상위 질문으로 돌아간다.

17개 display 수식에는 17개 `FormulaNote`가 바로 뒤따르고, underbrace의
의미 라벨은 모두 한국어로 넣었다. 390px에서 긴 식을 억지로 0.8까지 줄이지
않도록 의미 단위로 나눠 실제 최소 배율을 `0.91`로 유지했다.

```yaml
causal_viz:
  local_linearization:
    control: 기준점 x | 작은 이동 delta_x
    evidence: 실제 변화, 선형 예측, residual이 함께 변함
  directional_derivative:
    control: unit direction angle
    evidence: gradient projection의 부호와 증가·감소 판정이 바뀜
  gradient_flow:
    control: shared branch | detach | broadcast, u, batch
    evidence: path contribution과 reduce sum을 분리
  jacobian_product:
    control: input/output dimension | JVP/VJP | seed
    evidence: product shape와 full Jacobian sweep 비용을 비교
  autograd_tape:
    control: forward | backward 1회 | 다음 iteration | zero_grad | detach
    evidence: graph generation과 leaf grad buffer를 별도 상태로 노출
  gradcheck_path:
    control: epsilon | smooth/kink | second-chain speed/acceleration
    evidence: numerical error와 path/clock contribution을 독립 변화
```

### Claude 교차 검증과 수정 루프

Context Manager 호출은 수학 전이, autograd runtime, 반응형 시각 품질을
분리해 병렬 실행했다. strict receipt는 HTTP 200, `.ok=true`, worker
`claude-code:sonnet`, 첫 시도 성공, 120자 이상, 첫 줄 ACCEPT/REVISE,
source hash 안정 조건을 모두 만족해야 했다.

중간 `REVISE`는 두 실제 결함을 찾았다.

- `zero_grad` 단계가 leaf `.grad`만 비우지 않고 graph generation까지
  2에서 1로 되돌리던 상태 모델 오류
- local linearization의 실제값과 선형 예측값이 가까울 때 두 SVG 라벨이
  뭉쳐 보이던 시각 결함

첫 결함은 zero 단계에서도 generation 2를 유지하고 test에 명시했다. 두 번째
결함은 라벨을 좌우로 분리하고 배경 chip과 leader line을 추가한 뒤
mobile/desktop screenshot을 다시 만들었다. 이 과정에서 소스가 실행 중
바뀐 ACCEPT는 성공으로 세지 않고 안정된 hash로 재호출했다.

```yaml
final_claude_receipts:
  calculus_math_transfer_attempt_2: ACCEPT
  calculus_autodiff_runtime_attempt_2: ACCEPT
  calculus_visual_responsive_attempt_3: ACCEPT
  calculus_crosspath_floor_attempt_1: ACCEPT
  signals_lti_historical_replacement_attempt_5: ACCEPT
  historical_500_timeout_closure_attempt_2: ACCEPT
```

과거 500·timeout·빈 응답 목록도 별도 closure에서 다시 대조했다.
`signals-article-lti-transfer-postedit`의 불안정 ACCEPT와 stable empty를
새 attempt 5의 strict·stable ACCEPT로 대체했고, 현재 추적 가능한 scope 중
replacement 없이 실패 상태로 끝난 항목은 0건이다.

### 출시 증거

```yaml
local_release_evidence:
  build_modules: 8770
  article: calculus-computational-graphs.tsx
  article_sha256: 518c1a7c991e7bf3a5e471e8fce80960149042e41efe4b09adb64dad575c6f42
  viz_sha256: 14ee149b0fb39c4f2f5728355993a7c8491c89dbe2b0ec52ac5b95444e59b6c5
  contract_sha256: 56c92391deb54e6bc24152d7be0464d00b0d4c2e16fb7bc33c85db6a2744a0f5
  playwright_contracts: 8/8
  viewports: [390, 768, 1440]
  figures: 6
  formulas: 17
  formula_notes: 17
  rendered_katex_nodes: 71
  minimum_formula_scale: 0.91
  figure_overflow: 0
  formula_overflow: 0
  controls_minimum: 44x44
  console_errors: 0
public_release_evidence:
  route_status: 200
  local_production_playwright: 8/8
  public_playwright: 8/8
  article_asset: calculus-computational-graphs-DCdte9SJ.js
  article_asset_bytes: 70412
  article_asset_sha256: 2c3b275907bd22ee8289747a7407f6e3fc35d52036ea8c78da56395abdc92014
  public_asset_hash_match: true
```

### 4B·9B에 넘길 때의 분해

작은 모델에는 전체 미적분 글을 한 번에 다시 쓰게 하지 않는다.

```yaml
4b_packets:
  - local_sensitivity: [units, local_linearization, residual]
  - multivariable_flow: [partial, gradient, direction, chain, branch_sum]
  - jacobian_products: [shape, JVP, VJP, forward_reverse_cost]
  - runtime_verification: [saved_value, leaf_grad, detach, gradcheck, second_chain]
```

각 4B packet에는 공식 원문 한 개, 공개와 다른 hidden fixture 하나, 대표
반례 하나, 허용된 상위 handoff만 준다. 9B는 네 결과를 합쳐 symbol·shape·
단위·section handoff의 일관성과 여덟 상위 링크 회수를 검사한다. 수식
render와 390/768/1440 screenshot 검사는 산문·수학 감사와 분리한다.
이 구조라면 작은 모델도 긴 글을 그럴듯하게 요약하는 대신 "어느 변화가
어느 원인으로 돌아가며 어떤 상태에서 끊기거나 누적되는가"를 좁게 검증한다.

## 2026-07-30 마일스톤 2: 적분·장·보존법칙

### 왜 이 글을 다음 기반으로 선택했는가

미적분과 계산 그래프를 완성한 뒤 상위 Robot AI 글들을 다시 따라가 보니,
서로 다른 글에서 같은 기반 공백이 반복됐다.

- 구조역학의 분포하중을 한 점의 합력과 모멘트로 바꾸는 이유
- 파괴역학의 에너지 유입·방출·저장을 하나의 장부로 읽는 방법
- 열·윤활·마모에서 면을 통과하는 flux와 내부 생성량을 구분하는 방법
- 시뮬레이션에서 연속 보존식이 cell별 finite-volume update로 바뀌는 방법

각 상위 글에 적분 정의를 반복하면 연결점이 더 흐려진다. 반대로 적분만
별도로 설명하면 실제 산업·논문 질문으로 돌아가지 못한다. 따라서 이 글의
책임을 `작은 기여의 합 -> 영역 위 적분 -> 방향 있는 경계 흐름 -> 국소
발산 -> control volume 장부 -> 이산 보존`으로 고정했다. 미분의 local
sensitivity를 맡는 앞 글과도 책임이 겹치지 않는다.

내려가는 바닥은 Riemann sum과 단위 계산에서 끊었다. measure theory,
differential forms, full tensor continuum mechanics, moving control
volume, Navier-Stokes, PDE solver는 이 글의 최소 바닥이 아니므로 포함하지
않았다.

### 숨은 전이 문제 A-F

본문 숫자를 베껴서는 풀 수 없도록 공개 예제와 다른 함수, 구간, cell 폭,
flux를 사용했다. 이 문제들은 공개 본문에 노출하지 않고 content spec과
Claude 감사 packet에서만 사용했다.

```yaml
hidden_transfer:
  A_piecewise_density:
    input: "lambda=2 kg/m on [0,1.5], 5 kg/m on (1.5,4]"
    expected: {mass: 15.5, first_moment: 36.625, centroid: 2.362903}
    insight: "density x length, first moment / total"
  B_distributed_load:
    input: "w(x)=2+3x kN/m on [0,4]"
    expected: {resultant: 32, moment_about_origin: 80, line_of_action: 2.5}
    insight: "force와 moment를 동시에 보존해야 equivalent point load"
  C_oriented_flux:
    input: "rectangle [0,2]x[0,1], F=(2x,-y)"
    expected:
      face_fluxes: [0, 4, 0, -2]
      boundary_flux: 2
      divergence_integral: 2
    insight: "outward normal과 coordinate divergence의 부호 일치"
  D_nonuniform_cells:
    input:
      widths: [0.5, 1.0, 1.5]
      face_fluxes: [-1, 2.5, 0.5, 4]
    expected:
      cell_net_outflow: [3.5, -2, 3.5]
      average_divergence: [7, -2, 2.333333]
      volume_weighted_global: 5
    insight: "cell average를 그냥 더하지 않고 measure로 다시 가중"
  E_unsteady_ledger:
    input: {initial: 18, inflow_rate: 4.5, outflow_rate: 3.1, source_rate: -0.4}
    expected: {storage_rate: 1, amount_after_6_seconds: 24}
    insight: "rate와 amount를 구분하고 delta_t를 곱해 상태 갱신"
  F_shared_face_bookkeeping:
    input:
      widths: [0.75, 1.25, 1.5]
      density: [2, 3, 4]
      source_density: [0.2, -0.1, 0.4]
      shared_faces: [-0.5, 1.2, 0.4, 2.1]
    expected:
      stored_amount: 11.25
      integrated_source: 0.625
      cell_storage_rates: [-1.55, 0.675, -1.1]
      global_storage_rate: -1.975
    counterexample:
      split_internal_face: "cell2-left=1.0, cell3-left=0.7"
      wrong_global_rate: -1.875
      ghost_residual: 0.1
    insight: "같은 internal face 값을 두 cell이 반대 부호로 공유해야 cancellation"
```

### 출처와 책임 분리

원본, 추출 text, SHA-256은
`.codex-tmp/integrals-fields-conservation-sources-2026-07-30/`에 고정했다.

```yaml
source_intent:
  mit_18_01_riemann:
    use: "partition, sample contribution, Riemann sum, integral"
  mit_18_02_line_and_surface:
    use: "line/surface measure, tangent·normal, oriented flux"
  mit_18_02_divergence_theorem:
    use: "boundary flux와 volume divergence의 연결"
  mit_1_050_distributed_loads:
    use: "분포하중의 resultant와 moment equivalence"
  roylance_statics_of_bending:
    use: "distributed load, shear, moment의 구조역학 handoff"
  mit_2_25_control_volume:
    use: "fixed control-volume storage=in-out+source 장부"
  mit_2_29_finite_volume:
    use: "cell integration, face flux, conservative discrete update"
```

원문 정의, 본문에서 직접 계산한 공개 예제, 교육용 비유, 상위 글로의 해석을
한 종류의 주장처럼 섞지 않았다. 특히 nonuniform cell에서 average
divergence를 volume-weighting하는 이유와 internal-face cancellation은
공식만 인용하지 않고 각 cell 장부를 직접 합쳐 유도했다.

### 서사와 Viz의 역할

본문은 다음 아홉 단계로 올라간다.

1. 점의 값과 전체 기여량이 왜 다른지 단위로 확인한다.
2. 작은 직사각형의 합이 partition refinement에서 적분으로 가는 것을 본다.
3. line, area, volume에 따라 같은 density라도 전체량이 달라짐을 확인한다.
4. 분포하중을 force만 같은 점하중이 아니라 moment도 같은 작용선으로 바꾼다.
5. flux가 속력만이 아니라 면의 outward normal과 dot product를 요구함을 본다.
6. 작은 상자의 net outflow를 줄인 것이 divergence이고 전체 경계와 연결됨을 본다.
7. fixed control volume에서 in, out, source, storage의 단위와 부호를 맞춘다.
8. 연속 영역을 nonuniform cell로 잘라도 shared face가 정확히 상쇄되게 만든다.
9. 구조·파괴·열·윤활 상위 글의 처음 필요 지점으로 되돌아간다.

```yaml
causal_viz:
  partition_refinement:
    control: "분할 수"
    evidence: "각 조각의 density x width와 전체 근사값의 수렴"
  domain_measure:
    control: "line | area | volume"
    evidence: "같은 density, 다른 measure와 단위, 다른 total"
  resultant_line_of_action:
    control: "uniform | triangular | trapezoidal, point-load position"
    evidence: "force residual과 moment residual을 별도로 노출"
  flux_orientation:
    control: "field direction, normal reversal"
    evidence: "dot product의 부호가 유입·유출 판정을 바꿈"
  divergence_field:
    control: "source | mixed | balanced"
    evidence: "각 face flux, net boundary flux, integrated divergence"
  internal_face_cancellation:
    control: "cell 폭과 shared face 장부"
    evidence: "unweighted average 합의 오류와 weighted global identity"
  control_volume_ledger:
    control: "inflow, outflow, source, elapsed time"
    evidence: "storage rate, delta amount, final amount을 분리"
  conservative_grid:
    control: "shared face | intentionally split face"
    evidence: "정상 cancellation과 ghost residual의 발생"
```

17개 display formula에는 17개 `FormulaNote`를 바로 붙였다. underbrace의
독자용 의미 라벨은 모두 한국어로 두었고, 긴 식은 의미 단위로 나눠 390px
화면에서도 최소 배율 `0.95`를 유지했다. 여덟 Viz는 색 변화만 보여 주지
않고 control이 물리량, residual, 방향, 장부에 실제로 영향을 주게 했다.

### Claude 병렬 감사와 실패 처리

Context Manager의 Claude Sonnet에는 한 번에 전체 글을 평가시키지 않고
수학·출처, 숨은 문제 전이, 실제 렌더, 경로·상위 handoff 네 packet을 병렬로
보냈다.

```yaml
strict_receipt:
  required:
    - "HTTP 200"
    - ".ok=true"
    - "worker=claude-code:sonnet"
    - "inner attempts[0].ok=true"
    - "result length > 120"
    - "first nonempty line is exactly ACCEPT or REVISE"
    - "source hashes before and after are identical"
  rejected:
    - "HTTP 500"
    - "timeout"
    - "empty result"
    - "본문 뒤쪽에 ACCEPT가 있어도 첫 줄 형식이 틀린 결과"
    - "호출 중 source hash가 바뀐 결과"
```

사전 감사의 500·timeout·형식 오류는 판정으로 세지 않고 같은 좁은 packet을
재호출했다. 사후 attempt 1에서 나온 두 `REVISE`는 실제 결함이었다.

- hidden-transfer: rate인 `Qdot_stored`와 amount인 `Delta Q` 사이에
  `Delta t`가 명시되지 않아 6초 뒤 상태를 안정적으로 풀 수 없었다.
- finite-volume note: `q_i Delta V_i`라는 저장량과
  `Delta V_i dq_i/dt`라는 저장 변화율을 같은 말처럼 읽을 여지가 있었다.
- visual-responsive: desktop 상태 badge가 공통 expand·fullscreen icon과
  같은 우측 공간을 점유했다.

첫 두 결함은 `Delta Q=Qdot_stored Delta t`,
`Q(t0+Delta t)=Q(t0)+Delta Q`를 본문 수식과 Viz에 넣고 finite-volume
note를 amount/rate로 분리했다. 세 번째는 caption의 desktop 우측
safe padding을 확보했다. 소스와 screenshot을 새로 고정한 attempt 2에서
네 packet 모두 strict `ACCEPT`를 받았다.

```yaml
final_claude_receipts:
  post_math_source_attempt_2: ACCEPT
  post_hidden_transfer_attempt_2: ACCEPT
  post_visual_responsive_attempt_2: ACCEPT
  post_route_handoff_attempt_2: ACCEPT
```

### 출시 증거

```yaml
local_release_evidence:
  build_modules: 8772
  article_sha256: 669062c5c4d60f395612e473549fd672a9b0e3a4ca4d35d54e8e74f3fa90ea72
  viz_sha256: a84688e6f7d1289686c2a143a192ddcd3d50cf909ed8de5853e5b398cb6f3d12
  contract_sha256: e212f57837116ea47fb5921207f6beb4774269786bc000e64824dd773bf030a1
  content_spec_sha256: 8696c927869922e05f7c8f19a7f7e053109daa53c6d02abb864ffbed216805d3
  dev_playwright: 8/8
  viewports: [390, 768, 1440]
  figures: 8
  formulas: 17
  formula_notes: 17
  minimum_formula_scale: 0.95
  document_overflow: 0
  figure_overflow: 0
  formula_overflow: 0
  clipped_svg_labels: 0
  controls_minimum: 44x44
  console_errors: 0
public_release_evidence:
  route_status: 200
  local_production_playwright: 8/8
  public_playwright: 8/8
  main_asset: index-C9ii8kqP.js
  article_asset: integrals-fields-conservation-a6tDVmVA.js
  article_asset_bytes: 76322
  article_asset_sha256: 49f57eec6d7d4165ca2aeb281b1360b3ef7f72ada8f6d9d5f664ed11d54ae2e5
  local_public_asset_hash_match: true
```

### 4B·9B 모델용 작업 분해

작은 모델에는 여덟 Viz와 아홉 절을 동시에 쓰게 하지 않는다.

```yaml
4b_packets:
  - accumulation:
      owns: [units, density_times_measure, Riemann_sum, refinement]
      hidden: A
  - resultants:
      owns: [line_integral, force, first_moment, line_of_action]
      hidden: B
  - oriented_fields:
      owns: [vector_field, normal, dot_product, divergence, boundary_flux]
      hidden: C
  - conservation_ledger:
      owns: [in_out_source_storage, rate_times_time, fixed_control_volume]
      hidden: E
  - discrete_conservation:
      owns: [nonuniform_measure, face_flux, internal_cancellation, residual]
      hidden: [D, F]
9b_integration:
  checks:
    - "point -> accumulation -> domain -> resultant -> flux -> divergence"
    - "divergence -> control volume -> finite volume -> upper handoff"
    - "symbol, sign, unit, orientation, section id consistency"
    - "공개 예제와 다른 hidden A-F의 독립 재계산"
separate_nonlanguage_checks:
  - "KaTeX DOM과 FormulaNote 1:1"
  - "390/768/1440 overflow와 44px control"
  - "interactive residual/state assertions"
  - "production asset SHA-256"
```

각 4B packet에는 공식 원문 한두 개, 공개와 다른 hidden fixture, 대표
오답 하나, 다음 packet에 넘길 기호만 준다. 9B는 새 설명을 창작하기보다
packet 간 부호·단위·서사·링크를 통합한다. Claude나 다른 큰 모델은 작성자가
아니라 독립 감사자로만 사용한다. 이렇게 해야 작은 모델도 전문용어를
나열하는 대신 독자가 실제로 새로운 분포하중, flux, conservation 문제를
풀 수 있는 기반을 만들 수 있다.

## 2026-07-30 · 미분방정식·상평면·수치적분 재구성

### 왜 이 글을 다음 기반으로 선택했는가

적분 글 다음에는 단순히 미분방정식 용어를 늘어놓는 글이 아니라, 적분 장부가
시간에 따라 어떻게 상태를 바꾸는지 연결하는 공통 기반이 필요했다. Diffusion의
연속 시간 동역학, 로봇 경로의 time scaling, 마찰열과 점도 변화, hybrid·linear
sequence model은 모두 서로 다른 분야처럼 보이지만 다음 질문을 공유한다.

> 현재 상태와 변화율을 알 때 다음 상태를 어떻게 계산하며, 그 계산을 언제
> 믿을 수 있는가?

따라서 이 글의 종료 지점은 특정 논문 한 편이 아니라 `상태 → 변화율 → 적분 →
오차·안정성 → 사건·경계 → 상위 문제`의 재사용 가능한 독해 회로로 정했다.
기반을 무한히 과거로 내리지 않기 위해 독립적으로 풀 수 있는 최소 출발점은
함수의 기울기와 누적량으로 끊었다.

### 원문과 숨은 전이 문제

공식 원문과 추출 text, SHA-256은
`.codex-tmp/ode-sources-2026-07-30/`에 고정했다.

```yaml
source_intent:
  mit_18_03_numerical_methods:
    use: "Euler·RK 계열의 한 걸음 갱신과 오차 직관"
  mit_es_1803_numerical_methods:
    use: "초기값 문제, 수치해, step size를 바꾸는 이유"
  mit_18_086_stiff_ode:
    use: "빠른 mode 때문에 explicit step이 제한되는 stiffness"
  scipy_solve_ivp:
    use: "event, dense output, tolerance의 실제 solver 계약"
  scipy_solve_bvp:
    use: "초기값 문제와 두 경계값 문제의 구분"
  modern_robotics_time_scaling:
    use: "경로 위 가속도 상·하한과 forward/backward envelope"
```

본문을 읽은 뒤 공개 예제를 외우지 않고 새로운 문제를 풀 수 있는지를 다음
비공개 fixture로 검사했다.

```yaml
hidden_transfer:
  A_storage_ledger:
    checks: "rate와 amount, 부호, delta_t를 분리해 상태 갱신"
  B_explicit_stability:
    input: "y'=-40y, h=0.1"
    expected:
      euler_multiplier: -3
      stability_condition: "h < 0.05"
    insight: "정확한 해의 감쇠와 수치해의 발산은 별개"
  C_driven_state:
    checks: "시간 의존·구간별 입력을 autonomous ODE처럼 읽지 않음"
  D_event_detection:
    private_fixture: "g(t)=(t-1)(t-1.2), coarse interval 0.8→1.3"
    insight: "양 끝의 부호만 보면 한 step 안의 짝수 개 root를 놓칠 수 있음"
  E_time_optimal_envelope:
    input: {path_length: 10, acceleration: 2, braking: 1, speed_cap: 3}
    expected: {switches: [2.25, 5.5]}
    insight: "가속·순항·감속이 두 switching point를 만듦"
  F_convergence_order:
    expected:
      euler: "global O(h), step halving error ratio about 2"
      rk4: "global O(h^4), step halving error ratio about 16"
```

공개 event Viz에는 D의 숫자를 재사용하지 않았다. 공개 root는
`[0.65, 1.35]`, 구간은 `[0.2, 1.8]`로 두어, 독립 감사자가 본문 숫자 회상이
아니라 원리를 전이하는지 검사했다.

### 서사·수식·상위 경로

본문은 아홉 절로 재구성했다.

1. 저장량 장부에서 상태와 변화율을 분리한다.
2. 외부 입력이 상태 방정식을 어떻게 바꾸는지 본다.
3. Euler 한 걸음을 기울기와 시간 폭의 곱으로 만든다.
4. local error와 global error, Euler와 RK4의 수렴 차수를 구분한다.
5. 정확도와 안정성이 다르고 stiffness가 왜 작은 step을 강제하는지 본다.
6. 2차 ODE를 상태 두 개로 바꿔 상평면과 에너지 흐름을 읽는다.
7. 두 경계에서 적분한 envelope가 경로 속도 계획에서 만나는 과정을 본다.
8. event, tolerance, dense output이 solver API의 장식이 아닌 이유를 확인한다.
9. Diffusion, 로봇 궤적, 열·윤활, hybrid·linear LLM으로 되돌아간다.

21개 display formula에는 21개 `FormulaNote`를 바로 붙였다. 각 식의
underbrace는 `현재 상태`, `변화율`, `시간 간격`, `안정 한계`처럼 한국어
의미 라벨을 사용했다. 이 글은 모바일 최소 배율을 `0.9`로 고정했고, 공통
`FormulaNote`가 `dense output`, `stiff`, `IVP / BVP` 같은 일반 영문까지
수식으로 오인하던 문제도 함께 고쳤다.

상위 글의 링크는 부록에 몰아넣지 않고 ODE가 처음 필요한 문장에 배치했다.

```yaml
upper_handoffs:
  diffusion_models: "연속 시간 forward/reverse dynamics를 도입하는 지점"
  robot_trajectory_generation: "q=q(s), x=dot(s)^2와 forward/backward 적분 직전"
  robot_contact_tribology: "마찰열·온도·점도 상태가 서로 갱신되는 지점"
  llm_architecture_hybrid_linear: "hidden state recurrence를 연속 동역학과 비교하는 지점"
```

### 여덟 Viz와 실제 렌더 결함

```yaml
causal_viz:
  rate_ledger:
    evidence: "rate × elapsed time이 amount와 final state를 바꿈"
  driven_state:
    evidence: "구간별 input이 trajectory와 final state를 바꿈"
  euler_step:
    evidence: "h가 polygonal trajectory와 global error를 바꿈"
  error_convergence:
    evidence: "step halving에서 Euler와 RK4의 error ratio가 달라짐"
  stability_stiffness:
    evidence: "slow·fast mode, multiplier, time-scale ratio, 발산 경계"
  phase_portrait:
    evidence: "damping이 궤적 geometry와 dissipated energy를 바꿈"
  boundary_envelope:
    evidence: "speed cap이 없으면 1회, 있으면 2회 switching"
  event_detection:
    evidence: "coarse endpoint signs는 두 root를 놓치고 fine sampling은 찾음"
```

Playwright 수치 검사만으로 끝내지 않고 390px과 1440px screenshot을 직접
확인했다. 그 과정에서 공통 `figcaption::before`와 caption의 row layout이
충돌해 desktop 제목 열이 지나치게 좁아지는 문제, event endpoint label이
겹치는 문제를 발견했다. caption copy를 독립 column으로 만들고 작은 화면은
column, 큰 화면은 row로 전환했으며 중복 endpoint label은 제거했다. SVG는
`440×238`의 안정된 viewBox, 실제 12px text, 44px controls를 유지한다.

### Claude 병렬 감사와 모순 판정

Context Manager에는 수학 전이, 학습 서사, 반응형 Viz, 출처·KaTeX 네 packet을
병렬로 보냈다. 500, timeout, empty result는 판정으로 세지 않고 같은 source
hash로 재시도했다.

사전·사후 감사에서 실제로 잡힌 결함은 다음과 같다.

- public event 예제가 hidden fixture D와 같아 독립 전이를 검증하지 못했다.
- stiffness 수식은 두 mode를 설명하지만 Viz는 하나만 보여 주었다.
- robot trajectory의 기반 링크가 실제 첫 필요 지점보다 늦었다.
- Modern Robotics source link가 Part 3가 아니라 Part 1을 가리켰다.
- 글이 요구한 최소 formula scale과 공통 component 기본값이 달랐다.
- plain English `FormulaNote` label이 italic math로 렌더됐다.

마지막 문제를 수정한 뒤에도 한 응답은 첫 줄에 `ACCEPT`를 쓰고 본문에
`P2 finding`을 남겼다. 형식상 성공처럼 보이지만 의미상 모순이므로 폐기했다.
이후 validator는 응답 전체에서 독립 verdict가 정확히 하나인지, `ACCEPT`
응답에 `P0/P1/P2` heading이 남지 않았는지까지 검사한다.

```yaml
final_claude_receipts:
  math_hidden_transfer: ".codex-tmp/claude-ode-postaudit-2026-07-30/math-hidden-transfer.attempt-3.raw.json"
  narrative_learning_route: ".codex-tmp/claude-ode-postaudit-2026-07-30/narrative-learning-route.attempt-3.raw.json"
  visual_responsive: ".codex-tmp/claude-ode-postaudit-2026-07-30/visual-responsive.attempt-3.raw.json"
  source_katex_receipt: ".codex-tmp/claude-ode-postaudit-2026-07-30/source-katex-receipt.attempt-4.raw.json"
  all:
    worker: "claude-code:sonnet"
    verdict: ACCEPT
    source_hash_stable: true
    semantic_contradiction: false
```

### 출시 증거

```yaml
local_release_evidence:
  article_sha256: 8480134a923bbb5ca8a80798d84d702f5d0189f4a4e25b5c90ad0bad24719da2
  viz_sha256: 72cb9427403322ec41b6bffef395478b4a19f952e48bdc10e304edea08ed93aa
  content_spec_sha256: 6a6a565b31c246c026dc9b4e712e30d52e24c37da5eb54715ad5bd63c2d788fd
  test_sha256: f286e9a762dc92f170b26be9000c620fcd95e75457cb303308e49921c3cb0e1e
  dev_playwright: 12/12
  formulas: 21
  formula_notes: 21
  figures: 8
  viewports: [360, 390, 768, 1440]
  minimum_formula_scale: 0.9
  svg_text_minimum: 8.8
  controls_minimum: 43.5
  document_overflow: 0
  figure_overflow: 0
  formula_overflow: 0
  svg_text_overlap: 0
  console_errors: 0
public_release_evidence:
  route_status: 200
  local_production_playwright: 12/12
  public_playwright: 12/12
  article_asset: differential-equations-phase-plane-numerical-integration-CYscHYlh.js
  article_asset_bytes: 60692
  article_asset_sha256: 1071c752b7dce7b6a0d817b6037fb6df5a411f30346453b501e429638e356c76
  dist_local_public_asset_hash_match: true
```

### 4B·9B 모델용 작업 분해

```yaml
4b_packets:
  - state_ledger:
      owns: [state, rate, input, units, rate_times_time]
      hidden: [A, C]
  - numerical_step:
      owns: [Euler_update, local_error, global_error, convergence_order]
      hidden: [B, F]
  - dynamics_geometry:
      owns: [second_order_to_state, phase_portrait, energy, damping]
      hidden: "새 initial state와 damping으로 궤적 방향 판정"
  - boundary_event:
      owns: [IVP, BVP, envelope, speed_cap, event, tolerance]
      hidden: [D, E]
  - upper_handoff:
      owns: [diffusion, robot, thermal_tribology, sequence_state]
      hidden: "각 상위 글에서 ODE가 처음 필요한 문장 식별"
9b_integration:
  checks:
    - "state -> rate -> step -> error -> stability -> geometry -> boundary -> event"
    - "같은 기호가 절마다 다른 뜻으로 바뀌지 않는가"
    - "정확도·안정성·stiffness를 같은 문제로 뭉개지 않는가"
    - "공개 예제와 다른 hidden A-F를 독립적으로 재계산하는가"
separate_nonlanguage_checks:
  - "KaTeX DOM, Korean underbrace, FormulaNote 1:1"
  - "360/390/768/1440 overflow와 actual SVG text size"
  - "controls가 실제 geometry와 수치 결과를 바꾸는지"
  - "Claude receipt semantic contradiction"
  - "production asset SHA-256"
```

작은 모델은 수식 전체와 여덟 Viz를 한 번에 만들지 않는다. 각 packet은 한
종류의 인과 관계, 한두 공식 원문, 공개와 다른 hidden fixture, 대표 실패
하나만 가진다. 9B 모델은 새 설명을 덧붙이는 역할이 아니라 packet 간 기호,
단위, 선후 관계와 상위 handoff를 통합한다.

## 2026-07-30 · Context Manager 500·timeout 전수 재검증

### 실패 이력을 성공으로 세지 않는 방법

과거 Context Manager 실행에서 HTTP 500, timeout, 빈 `result`, `running`만
남은 attempt를 전수 색인했다. 원본 실패를 ACCEPT로 바꾸지 않고, 같은 책임을
현재 source hash로 다시 읽는 replacement packet을 명시적으로 연결했다.

```yaml
historical_replacements:
  probability_spec_core:
    failed: "probability-spec-core-preaudit attempt 1·2 · empty timeout"
    replacement: ".codex-tmp/claude-signals-systems-preaudit-2026-07-30/results/probability-timeout-replacement-stitch.attempt-3.raw.json"
  probability_runtime:
    failed: "probability-article-runtime-postedit attempt 3 · running only"
    replacement: ".codex-tmp/claude-linear-algebra-preaudit-2026-07-30/results/probability-runtime-stuck-attempt3-replacement.attempt-1.raw.json"
  stitch_receipt: ".codex-tmp/claude-global-gap-revalidation-2026-07-30/results/historical-probability-replacement-stitch.attempt-1.raw.json"
  stitch_verdict: ACCEPT
```

첫 global 감사는 위 두 replacement를 보지 못하고 probability가 미검증이라고
판정했다. 이 판정은 버리지 않고 false finding으로 보존한 뒤, 실패 두 건과
replacement 두 건만 넣은 좁은 stitch packet으로 다시 감사했다. 현재 source와
replacement의 finding별 매핑이 모두 일치해 ACCEPT가 나왔다.

### 500을 줄인 packet 구조

큰 `math-foundations-current-b` packet은 HTTP 200이지만 빈 결과였다. 이를
signals, integrals, ODE 세 packet으로 나눠 병렬 재실행했다.

```yaml
split_results:
  signals:
    receipt: ".codex-tmp/claude-global-gap-revalidation-2026-07-30/results/math-signals-current.attempt-1.raw.json"
    verdict: ACCEPT
  integrals:
    receipt: ".codex-tmp/claude-global-gap-revalidation-2026-07-30/results/math-integrals-current.attempt-1.raw.json"
    verdict: ACCEPT
  ode:
    receipt: ".codex-tmp/claude-global-gap-revalidation-2026-07-30/results/math-ode-current.attempt-1.raw.json"
    verdict: ACCEPT
```

Foundation도 한 packet으로 묶지 않았다.

- 공개 Perceptron·Neural Network prose
- 공개 Backprop·Diffusion prose
- 실제 route가 render하는 대표 Viz

여기서 중요한 규칙은 파일 이름이 비슷하다고 감사 source에 넣지 않는 것이다.
`neural-network/Forward.tsx`, `NumericTraceViz.tsx`,
`backprop-optimization/viz/TrainingLoopViz.tsx`는 현재 public route에서
render되지 않는다. 첫 Viz 감사가 이 legacy 파일을 사용자 화면으로 오인해
결함을 보고했으므로, route entry의 import graph를 먼저 확인하고 public
packet을 다시 만들었다.

### 실제로 수정한 결함

```yaml
verified_fixes:
  probability_test_drift:
    defect: "FormulaNote 실제 13개, test 기대 11개"
    correction: "test 기대를 13개로 갱신"
    receipt: ".codex-tmp/claude-global-gap-revalidation-2026-07-30/results/math-foundations-a-postfix.attempt-1.raw.json"
  document_route_scope:
    defect: "03B가 formula만 약속하지만 대상 절은 금액·날짜·표·수식·reading order를 검증"
    correction: "Document Rule Verification과 다섯 fail-closed 규칙으로 확장"
    receipt: ".codex-tmp/claude-global-gap-revalidation-2026-07-30/results/document-multimodal-postfix.attempt-2.raw.json"
  diffusion_backprop_handoff:
    defect: "noise MSE에서 U-Net 파라미터 gradient로 가는 reverse-mode 연결 없음"
    correction: "training step 직후 계산 그래프·chain rule·backward 설명과 backprop 링크 추가"
    receipt: ".codex-tmp/claude-global-gap-revalidation-2026-07-30/results/foundation-public-prose-bd-postfix.attempt-2.raw.json"
  public_foundation_viz:
    correction: "실제 NumericForward 5단계 tab·KaTeX·mobile overflow 계약을 test로 고정"
    receipt: ".codex-tmp/claude-global-gap-revalidation-2026-07-30/results/foundation-public-viz-postfix.attempt-1.raw.json"
  agent_public_authority:
    correction: "legacy 설명과 public route를 분리하고 optional enforcer·Prompt handoff·ordinal bug를 공개 source 기준으로 확인"
    receipt: ".codex-tmp/claude-global-gap-revalidation-2026-07-30/results/agent-security-public-postfix.attempt-1.raw.json"
```

Document AI 부모 화면의 테스트도 이전 단일 5링크 path를 기대하고 있었다.
현재 UI 소유권은 `네 분기 선택 → current research route → 필요할 때 공통
기반`이고, canonical Donut까지 포함한 registry path는 6단계다. 따라서
오래된 목록을 되살리지 않고 `data-subcategory-branches`,
`data-topdown-research-route="document-ai"`, 다섯 route stage와 실제
handoff link를 검증하도록 테스트를 갱신했다.

### 작은 모델에 넘길 감사 절차

4B 모델은 한 packet에서 다음 다섯 항목만 처리한다.

1. route entry가 실제 import하는 파일 목록
2. 한 가지 학습 책임 또는 한 가지 과거 failure
3. 공개 예제와 hidden fixture의 숫자 분리
4. 정확한 source line과 최소 수정 한 건
5. `ACCEPT` 또는 `REVISE` 한 줄

9B 모델은 새 finding을 무한 확장하지 않고 다음만 통합한다.

```yaml
9b_receipt_integrator:
  input:
    - source_hash_before_after
    - http_and_worker
    - first_attempt_ok
    - one_standalone_verdict
    - bounded_findings
  rejects:
    - "HTTP 200이지만 result가 비어 있음"
    - "ACCEPT 뒤 P0/P1/P2 heading"
    - "source가 감사 중 바뀜"
    - "legacy unimported 파일을 public defect로 보고"
    - "실패 attempt 자체를 replacement로 간주"
  output:
    - "failure → replacement → current source의 명시적 매핑"
    - "REVISE마다 수정 파일과 재감사 receipt"
    - "public route·test·production asset의 최종 증거"
```

이 구조는 작은 모델이 전체 블로그를 한 번에 이해하려다 context를 소진하는
문제를 피한다. `route ownership`, `content responsibility`, `visual
contract`, `historical replacement`를 각각 좁게 판정하고 마지막에만
통합한다.

### 재검증 배포 증거

```yaml
validation:
  focused_playwright: 34/34
  public_smoke:
    - "Document AI branch-first parent route"
    - "Neural Network 5-stage numeric KaTeX trace"
    - "Diffusion source reconstruction and backprop handoff"
  public_smoke_result: 3/3
  typescript_and_production_build: pass
deployment:
  service: cm-blog.service
  status: active
  local_status: 200
  public_status: 200
  assets:
    diffusion-models-DwVpFDWx.js:
      bytes: 72048
      sha256: ad8d98cd7738be6077bd8fb2cd5c023c2bd8923fee8e4aab8de92a316cda432f
    neural-network-Bcs-Qaph.js:
      bytes: 34166
      sha256: 2bb9aba8de074dec81bde445ca340b6ec8a88a2d026005f85408df4d3f8d6788
    ocr-document-ai-map-4JDjxz00.js:
      bytes: 21267
      sha256: 86e68b952aa073568e48e370e02b0b6dd03afdab18db16c4fe04ae849ba5a7fe
  dist_local_public_hash_match: true
```

## 2026-07-30 · Prompt → XML → Skill → Runtime 학습 경로 재구성

### 왜 이 세 글을 한 묶음으로 골랐는가

2026-07-30 learning-flow audit에서 `prompt-engineering`,
`xml-prompting`, `skills-anatomy`는 같은 Agent 기초 영역에 있었지만 실제
인과 경로는 없었다.

- Prompt 글은 `500+ token`, `60B+`, `3~5 shot`, `50%→95%`처럼
  task·model·source scope가 없는 고정 수치를 포함했다.
- XML 글은 의미 경계와 권한 경계를 올바르게 구분했지만 앞뒤 학습 계약과
  공통 질문·개념·도달점 표시가 약했다.
- Skill 글은 Tool, Plugin, Skill을 maturity 계층으로 놓고, 절차를 읽는
  것과 실제 permission·side effect를 분리하지 못했다.

따라서 세 글을 독립 용어 사전으로 보강하지 않고 다음 학습 경로로 묶었다.

```text
요청 계약
  → XML 의미 경계
  → 재사용 절차 Skill
  → 판단 Context Packet
  → Tool Protocol
  → Policy·Checkpoint·Effect Evidence를 가진 Harness
```

이 경로는 전체 Agent Systems path와 중복되지 않는다. 전체 path는
`현재 Runtime → Agent Loop → Coordination → Safety → Eval`을 조립하고,
이번 path는 한 요청의 지시와 절차가 실제 effect가 되기까지 authority가
어디에서 바뀌는지를 좁게 추적한다.

### 내부 hidden transfer problem

본문을 쓰기 전에 다음 상황을 내부 판정 문제로 고정했다.

```yaml
task: "invoice document를 추출·검산하고 승인 뒤 외부 시스템에 반영"
hazards:
  - "PDF 안에 즉시 전송하라는 injected text"
  - "community Skill bundle의 script와 외부 URL"
  - "schema-valid하지만 원문 합계와 다른 값"
  - "승인되지 않은 external write"
  - "응답이 유실된 ambiguous timeout"
  - "idempotency 없는 retry가 만드는 duplicate effect"
required_owners:
  prompt: [goal, success_criteria, visible_evidence]
  xml: [semantic_delimiter_only]
  skill: [procedure, references, scripts]
  context: [source_owner, trust_label, current_state]
  schema_validator: [shape, semantic_invariant]
  policy: [principal, resource, action, approval]
  executor_harness: [dispatch, checkpoint, idempotency, effect_receipt]
```

독자가 새 문서 처리 업무에서도 이 owner를 분리할 수 있으면 본문 깊이가
충분하다고 판정했다. 문제 문장을 본문에 퀴즈로 싣는 대신 같은 invoice packet이
두 StepViz의 장면을 거치며 계약을 얻도록 만들었다.

### source와 저자 재구성의 경계

```yaml
prompt_sources:
  current:
    - "OpenAI latest model guide"
    - "Anthropic prompt engineering overview"
    - "Anthropic current prompting best practices"
    - "OpenAI·Anthropic structured outputs"
  minimum_history:
    - "Brown et al. 2020 · GPT-3 / in-context learning"
    - "Wei et al. 2022 · Chain-of-Thought prompting"
    - "Kojima et al. 2022 · Zero-shot reasoning cue"
  editorial_rule:
    - "역사적 benchmark 결과를 현재 model 보장값으로 옮기지 않는다."
    - "raw private CoT를 성공 조건으로 요구하지 않는다."
skill_sources:
  specification:
    - "agentskills.io/specification"
    - "agentskills.io/client-implementation/adding-skills-support"
  product_scope:
    - "Anthropic Agent Skills engineering article"
    - "Anthropic Agent Skills surface overview"
  editorial_rule:
    - "name·description 필수와 optional·experimental field를 분리한다."
    - "client별 discovery·sharing·sandbox를 보편 registry 동작으로 만들지 않는다."
```

`Prompt contract`, failure-owner ladder와 Skill 실행 gate는 위 source를
바탕으로 한 저자 재구성이다. 반면 “Skill이 permission을 주지 않는다”,
“schema-valid가 semantic truth를 보장하지 않는다”, “XML은 authorization이
아니다”는 production invariant로 코드 계층에서도 다시 강제해야 한다.

### 구현 결정

- `prompt-engineering/Rebuilt.tsx`: 목표, 성공 조건, authority, reasoning
  evidence, delimiter·schema·validator·policy·executor와 회귀 평가를 다섯
  인과 절로 재작성했다.
- `PromptContractLab`: 같은 invoice packet을
  `raw → success → boundary → gates → release`로 바꾼다.
- `skills-anatomy/Rebuilt.tsx`: Skill·Tool·Package 축, SKILL.md bundle,
  progressive disclosure, admission·policy·executor와 portability를
  다섯 절로 재작성했다.
- `SkillLifecycleLab`: `catalog → activation → body → resource → gate →
  evidence`에서 현재 읽은 context와 여전히 닫힌 permission을 함께 보인다.
- `xml-prompting`: 기존 올바른 경계 설명을 유지하고
  QuestionLead·ConceptPrimer·CapabilityCheck, 공식 source와 앞뒤 path link를
  추가했다.
- `ai-agent-instruction-contract`: 여섯 단계 학습 경로를 추가하고 mobile
  route label을 한국어 중심으로 바꿨다.
- 더 이상 import되지 않던 옛 Prompt·Skill section과 작은 SVG/data 파일은
  삭제했다. 잘못된 고정 수치와 maturity hierarchy가 검색·자동 작성에서
  다시 source처럼 사용되는 것을 막기 위한 조치다.

### Context Manager 감사 영수증

사전 감사 두 건은 모두 첫 시도 HTTP 200, worker
`claude-code:sonnet`, strict-valid `REVISE`였다.

```yaml
preaudit:
  prompt:
    file: ".codex-tmp/claude-prompt-skill-preaudit-2026-07-30/prompt-contract.raw.json"
    findings: [unsupported_numbers, obsolete_cot_framing, missing_authority_eval]
  skill_route:
    file: ".codex-tmp/claude-prompt-skill-preaudit-2026-07-30/skill-route-contract.raw.json"
    findings: [false_hierarchy, unscoped_format_claims, missing_permission_boundary]
```

Post-audit 중 prompt 두 응답은 내용상 `ACCEPT`였지만 verdict 앞에 문장을
출력해 `strict_valid:false`였다. 이 둘은 성공 영수증으로 세지 않았다.
현재 source만 다시 읽힌 최종 combined receipt가 처음으로 엄격 계약을
통과했다.

```yaml
final_claude_receipt:
  file: ".codex-tmp/claude-prompt-skill-preaudit-2026-07-30/final-route-receipt.raw.json"
  http: 200
  worker: "claude-code:sonnet"
  first_attempt_ok: true
  first_line: ACCEPT
  standalone_verdicts: 1
  semantic_contradiction: false
  strict_valid: true
skill_dedicated_receipt:
  file: ".codex-tmp/claude-prompt-skill-preaudit-2026-07-30/post-skill-route.raw.json"
  strict_valid: true
```

### 4B·9B 모델로 좁혀 재현하는 방법

4B 모델은 한 번에 글 전체를 쓰지 않고 owner 하나와 state transition 하나만
받는다.

```yaml
4b_packets:
  contract:
    input: [one_task, one_failure, official_source_excerpt]
    output: [goal, success_criterion, evidence]
  boundary:
    input: [trusted_instruction, untrusted_document]
    output: [source_owner, trust_label, forbidden_escalation]
  shape_meaning:
    input: [schema, one_valid_wrong_value]
    output: [syntax_result, semantic_result]
  skill_loading:
    input: [metadata, SKILL_body, one_resource]
    output: [loaded_context, still_closed_permission]
  effect:
    input: [tool_proposal, policy_record, timeout]
    output: [decision, idempotency_key, effect_query, receipt]
  viz_scene:
    input: [previous_state, one_transition]
    output: [changed_fields, visible_owner, evidence_label]
```

각 packet에는 공개 예제와 다른 hidden fixture 하나를 넣는다. 4B 모델이
설명을 길게 확장하지 못하게 `owns`, `does_not_own`, `input`, `output`,
`failure`, `evidence` 여섯 field로만 답하게 한다.

9B 모델은 packet을 새 내용으로 다시 쓰지 않고 다음 invariant만 통합한다.

```yaml
9b_route_integrator:
  order:
    - "request contract before formatting"
    - "semantic delimiter before reusable procedure"
    - "procedure before tool proposal"
    - "policy before executor"
    - "effect query before ambiguous retry"
  rejects:
    - "fixed token, model-size, shot-count or compliance-rate law"
    - "XML tag as authorization"
    - "schema validity as factual correctness"
    - "Skill activation as permission"
    - "timeout as definite failure"
    - "decorative Viz whose owner/evidence does not change"
  final_checks:
    - "registry section id == rendered section id"
    - "learning path link retains path id"
    - "390/768/1440 no document or stage overflow"
    - "old unsupported claims absent from reachable source and search"
    - "strict Claude receipt, compiler, browser and public smoke"
```

### 로컬 검증 상태

```yaml
learning_flow_audit:
  report: "knowledge/authoring/runs/2026-07-30-learning-flow-audit.json"
  target_scores:
    prompt-engineering: 0
    xml-prompting: 0
    skills-anatomy: 0
  target_blockers: 0
  target_review: 0
  target_enrichment: 0
focused_playwright:
  file: "tests/agent-instruction-contract.spec.ts"
  result: "7/7 pass"
  viewports: [390x844, 768x1024, 1440x900]
  checks: [scene_transition, rendered_claims, banned_claims, path_link, document_overflow, stage_overflow]
build:
  command: "npm run build:tsc"
  result: pass
broader_regression:
  result: "30/33 pass"
  unrelated_existing_failure:
    test: "Robot VLA source spine"
    reason: "현재 data-formula-label 7개, 오래된 test 기대 4개"
deployment:
  service: "cm-blog.service"
  status: active
  local_http: 200
  public_http:
    prompt-engineering: 200
    xml-prompting: 200
    skills-anatomy: 200
  public_playwright: "7/7 pass"
  asset_hash_match:
    prompt-engineering-BttqZDJq.js: "f5876bed50549899219edfcc069dee4134a9fc3e287a481df67ff17c7705559e"
    skills-anatomy-B5b9kHve.js: "294bd91735db7482e109e5b7a27bf521966e0b9c4ffa3df8a8af7e516ecf7d62"
    xml-prompting-D-LWsNOj.js: "4a6791813b6afae57cb61a4f355f9115111814531d54c60158a1cc68ef2110ec"
```

## 2026-07-30 · DeZero Rust 구현 경로 재구축

### 시작 신호

`dezero-autodiff`, `dezero-nn`, `dezero-advanced`는 목록상 순서는 맞았지만
다음 문제가 있었다.

- 본문이 짧은 bullet과 `<br />` 나열이라 한 claim이 다음 claim을 왜
  요구하는지 알 수 없었다.
- CodeSidebar의 `dezero_rs` 코드는 실제 repository나 실행 가능한 crate가
  아니라 사람이 적은 문자열이었다. 공식 DeZero도 Rust가 아니라 Python이다.
- 여러 작은 SVG scene은 폭이 좁을 때 글자가 잘리고, 한 장면의 원인과 다음
  장면의 상태 변화가 분리되어 있었다.
- Newton 근 찾기와 Newton 최적화, LSTM의 기울기 보존, LayerNorm identity,
  Embedding scatter-add 등에 틀리거나 과도한 설명이 있었다.
- 기존 test는 학습 계약보다 옛 SVG의 고정 `viewBox`를 보존했다.

따라서 이 batch의 목표는 “글을 더 길게”가 아니라 다음 세 질문을 실행
증거까지 닫는 것으로 정했다.

```yaml
article_contracts:
  autodiff:
    question: "공유 DAG에서 total derivative를 잃지 않고 leaf까지 어떻게 역순회하는가?"
    proof: "shared graph gradient 60, second derivative 12, no_grad restore, Weak lifetime"
  neural_network:
    question: "parameter identity와 한 번의 완전한 학습 step을 어느 경계가 소유하는가?"
    proof: "2→3→2→1 shape, deduped shared parameter, loss_after < loss_before"
  stateful_layers:
    question: "state 수명, 통계 축, mask와 sparse index가 backward 경로를 어떻게 바꾸는가?"
    proof: "detach/reset, forget product, D-axis norm, dropout expectation, repeated id gradient"
```

### 출처 바닥과 중단선

먼저 공식 DeZero source를
`.codex-tmp/dezero-official-2026-07-30`에 내려받고 commit
`b5f3cf12a9e4ed84fc97b57bf41a25610d69c9e5`로 고정했다.

```yaml
primary_sources:
  dezero:
    book: "https://koki0702.github.io/dezero-book/"
    repository: "https://github.com/oreilly-japan/deep-learning-from-scratch-3"
    language: Python
    role: "behavioral reference, not Rust source provenance"
  autodiff:
    source: "Baydin et al., JMLR 2018"
  optimizer:
    source: "Kingma and Ba, Adam 2014"
  lstm:
    source: "Hochreiter and Schmidhuber 1997"
  layer_norm:
    source: "Ba et al. 2016"
  dropout:
    source: "Srivastava et al., JMLR 2014"
  embedding:
    source: "official PyTorch Embedding API"
  rust_ownership:
    source: "Rust Book Rc/RefCell and std::rc::Weak"
```

최소 기반의 중단선은 “scalar Value에서 세 article의 invariant를 실행할 수
있는가”로 잡았다. Tensor broadcasting, GPU kernel, distributed backward,
production allocator, full Transformer는 이 crate에 계속 붙이지 않았다.
세 번째 글 끝에서 Attention·Transformer의 별도 학습 경로로 넘긴다.

### 내부 transfer fixture

본문을 quiz로 채우지 않고, 작성 전 다음 숨은 반례를 통과해야만 claim을
공개했다.

```yaml
hidden_transfer:
  autodiff:
    graph: "s=x*x; y=s+s; z=5*y at x=3"
    expected_gradient: 60
    catches:
      - "gradient overwrite instead of accumulation"
      - "backward stops after one operation"
    higher_order: "y=x^3 at x=2 => dy/dx=12, d2y/dx2=12"
  neural_network:
    shape: "[2]→[3]→[2]→[1]"
    sequence: "zero_grad→forward→loss→backward→step→new forward"
    catches:
      - "same handle updated twice"
      - "wrong input feature count silently accepted"
      - "loss measured from stale graph"
  advanced:
    state: "detach preserves numbers and cuts graph; reset makes both zero"
    forget_gates: "[0.9,0.8,0.5] => product 0.36"
    layer_norm: "[1,2,3], gamma=1, beta=0 is not identity"
    dropout: "p=.5, input=2 => outcomes 0 and 4, expectation 2"
    embedding: "ids [4,1,4] => grad row4=2, row1=1"
```

이 fixture가 잡은 중요한 작성 오류는 다음과 같다.

- `x-f'/f''`를 `f(x)=0`의 root finding으로 부르지 않는다. 이는
  `f'(x)=0`을 찾는 optimization step이다.
- LSTM cell 직접 경로의 gradient는 1이 아니라 forget gate의 곱이다.
- `gamma=1, beta=0`은 LayerNorm 뒤 affine의 identity이지 normalization
  전체의 identity가 아니다.
- Dropout은 개별 forward가 아니라 mask에 대한 기대값을 보존한다.
- 반복 token을 실제 예제에 넣지 않고 scatter-add를 주장하지 않는다.

### 실제 source를 단일 진실로 만들기

`examples/dezero-rs`에 dependency 없는 crate를 만들고 article의
CodeSidebar가 TypeScript 문자열 대신 이 파일들을 `?raw`로 직접 읽게 했다.

```yaml
crate:
  manifest: "examples/dezero-rs/Cargo.toml"
  modules:
    - "src/autodiff.rs"
    - "src/nn.rs"
    - "src/sequence.rs"
  tests:
    - "tests/autodiff_contract.rs"
    - "tests/nn_contract.rs"
    - "tests/sequence_contract.rs"
  provenance:
    file: "examples/dezero-rs/README.md"
    label: "independent educational reconstruction"
```

자동미분의 ownership 방향은 `output Value -> creator Rc -> input Value`이고
operation에서 output으로만 `Weak`를 둔다. Backward는 높은 generation부터
꺼내며 contribution을 더한 직후 각 input creator를 다시 enqueue한다.
`create_graph=true`이면 local backward의 연산도 Value graph가 되고,
RAII recording guard는 `no_grad` scope가 끝나면 이전 상태를 복원한다.

신경망 글은 trait가 parameter 누락을 compile time에 잡는다고 과장하지
않는다. `parameters()`는 책임 경계이고 contract test가 실제 누락·중복을
잡는다. Optimizer는 `Rc` pointer identity로 parameter를 deduplicate한다.
Adam은 source 경계를 설명하되 이 작은 crate에 구현했다고 주장하지 않는다.

Stateful layer 글은 `B×T×D`를 먼저 고정한다. LSTM state를 숨은 mutable
field가 아니라 `step(x,h,c)->(h_next,c_next)`로 노출하고, LayerNorm 함수가
받는 slice를 한 `(b,t)` 위치의 D축으로 정의한다. Embedding lookup은 같은
row의 Value handle을 clone하므로 기존 autodiff accumulation이 scatter-add를
만든다.

### 본문과 Viz assembly

각 public root는 하나의 Article body와 CodeSidebar만 조립한다. 과거
section 파일과 SVG는 public root에서 더 이상 import하지 않는다.

```yaml
public_assembly:
  roots:
    - "src/pages/articles/ai/dezero-autodiff.tsx"
    - "src/pages/articles/ai/dezero-nn.tsx"
    - "src/pages/articles/ai/dezero-advanced.tsx"
  bodies:
    - "dezero-autodiff/Article.tsx"
    - "dezero-nn/Article.tsx"
    - "dezero-advanced/Article.tsx"
  causal_labs:
    - "dezero-autodiff/AutodiffGraphLab.tsx"
    - "dezero-nn/TrainingContractLab.tsx"
    - "dezero-advanced/SequenceStateLab.tsx"
  shared:
    - "dezero-shared/ArticleFrame.tsx"
    - "dezero-shared/runtimeCodeRefs.ts"
```

Viz는 SVG coordinate에 본문을 넣지 않고 responsive HTML grid로 만들었다.
Mobile tab은 horizontal scrolling 대신 2열로 wrap하고 홀수 마지막 tab은
2열을 차지한다. 단계가 바뀌면 owner, 값, gradient 또는 state boundary가
실제로 바뀐다. 모든 display formula는 수식 안의 짧은 한글 underbrace와
인접 `FormulaNote`를 함께 가진다.

### Context Manager 병렬 복구와 감사

사용자가 보고한 HTTP 500 이력을 별도 closure packet으로 다시 검사했다.
과거 raw failure를 성공으로 세지 않고, narrower replacement receipt가
각 failure family를 닫았는지를 확인했다.

```yaml
historical_closure:
  receipt: ".codex-tmp/claude-gap-and-dezero-preaudit-2026-07-30/results/historical-gap-final-closure.attempt-1.raw.json"
  http: 200
  worker: "claude-code:sonnet"
  strict_valid: true
  source_hash_stable: true
  verdict: ACCEPT
  unmapped_transport_gaps: 0
```

DeZero pre-audit 세 건은 모두 strict `REVISE`였다. Claude finding을 그대로
채택하지 않고 local source와 다시 대조했다. 자동미분에서는 Claude가 잡은
Newton 목적 혼동 외에 local audit가 기존 backward snippet의 input creator
재-enqueue 누락을 추가로 발견했다. NN에서는 save/load와 lazy Adam claim,
완전한 step 순서가 비어 있었다. Advanced에서는 잘못된 `0.7^50` 수치,
detach 부재, D축 부재와 중복 없는 Embedding 예제를 잡았다.

Post-audit는 최대 동시 2개로 실행했다.

```yaml
postaudit:
  autodiff:
    receipt: ".codex-tmp/claude-dezero-postaudit-2026-07-30/results/dezero-autodiff-postaudit.attempt-1.raw.json"
    verdict: ACCEPT
    strict_valid: true
    source_hash_stable: true
  advanced:
    receipt: ".codex-tmp/claude-dezero-postaudit-2026-07-30/results/dezero-advanced-postaudit.attempt-1.raw.json"
    verdict: ACCEPT
    strict_valid: true
    source_hash_stable: true
  neural_network_attempt_1:
    verdict: REVISE
    source_hash_stable: false
    disposition: "영수증으로 세지 않음; finding 두 개는 독립 확인 후 수정"
    fixes:
      - "contract test의 zero_grad를 forward보다 앞으로 이동"
      - "존재하지 않는 Adam 수식 예고 제거"
  neural_network_attempt_2:
    receipt: ".codex-tmp/claude-dezero-postaudit-2026-07-30/results/dezero-nn-postaudit.attempt-2.raw.json"
    verdict: ACCEPT
    strict_valid: true
    source_hash_stable: true
```

### 4B·9B 모델용 축소 packet

작은 모델에는 세 글 전체를 한 번에 쓰게 하지 않는다. 다음 순서로 owner와
invariant 하나씩만 준다.

```yaml
dezero_4b_packets:
  - input: [one_forward_op, input_generations]
    output: [operation_generation, output_generation, ownership_edges]
  - input: [one_ready_operation, upstream_gradient]
    output: [local_contributions, accumulated_input_gradients, creators_to_enqueue]
  - input: [one_shared_parameter, two_layer_paths]
    output: [one_identity, summed_gradient, update_count]
  - input: [one_training_step]
    output: [ordered_state_transitions, stale_state_failure]
  - input: [one_recurrent_boundary]
    output: [detach_or_reset, preserved_data, preserved_graph]
  - input: [one_BTD_tensor, requested_norm]
    output: [reduction_axis, shared_statistics, output_shape]
  - input: [one_mask_or_token_list]
    output: [forward_selection, backward_destination, accumulation_count]
```

9B integrator는 새 설명을 발명하지 않고 packet을 다음 gate로만 연결한다.

```yaml
dezero_9b_integrator:
  required_order:
    - "numeric contract before abstraction name"
    - "forward ownership before backward traversal"
    - "gradient production before optimizer mutation"
    - "state data lifetime before graph lifetime"
    - "tensor axes before normalization equation"
    - "repeated index example before scatter-add claim"
  reject_if:
    - "official Python source is labeled as an official Rust port"
    - "one-level backward passes but multi-level traversal is absent"
    - "gradient contribution overwrites an existing gradient"
    - "same parameter identity is updated twice"
    - "reset and detach are treated as synonyms"
    - "gamma=1 beta=0 is called full LayerNorm identity"
    - "dropout is said to preserve every forward value"
    - "mobile tab requires horizontal scroll"
  evidence:
    - "cargo contract test"
    - "strict and source-stable Claude receipt"
    - "390/768/1440 browser geometry"
    - "public selector and formula-note smoke"
```

### 검증과 배포

```yaml
rust:
  command: "cargo test --manifest-path examples/dezero-rs/Cargo.toml"
  result: "11/11 contract tests pass"
frontend:
  build: "npm run build:tsc"
  result: pass
  learning_path_test: "1/1 pass"
  responsive_lab_test: "3/3 pass"
  viewports: [390x844, 768x1024, 1440x900]
  checks:
    - "all lab tabs reachable without horizontal document overflow"
    - "control height >= 44"
    - "visible lab text >= 11px"
    - "formula scale >= 0.68"
    - "no non-icon SVG in the three labs"
deployment:
  service: "cm-blog.service"
  status: active
  local_production:
    routes: 3
    http: 200
    overflow: 0
  public:
    origin: "https://heru.ragdoll-bigeye.ts.net"
    routes:
      - "/lab/blog/ai/dezero-autodiff"
      - "/lab/blog/ai/dezero-nn"
      - "/lab/blog/ai/dezero-advanced"
    http: 200
    labs_visible: true
    formula_notes: [3, 4, 5]
    overflow: 0
```

## Claw Code: 레코드와 실행을 분리한 학습 경로 재구성

### 왜 이 묶음을 다음 대상으로 골랐는가

AI 범위 학습 흐름 감사를 다시 실행했을 때 상위 결손이 Claw Code에
집중돼 있었다. 특히 `claw-task-team`은 source block과 prerequisite가
없고, 오래된 본문이 실제 Rust 구현에 없는 타입·함수·scheduler를
설명했다. `claw-session`과 overview도 자동 learning path, 수동 다음 링크,
article 배열 순서가 서로 달랐다.

먼저 목표를 “19개 파일을 모두 설명한다”가 아니라 다음 다섯 질문으로
바꿨다.

```yaml
claw_routes:
  - "01 한 Turn의 소유권: state, compaction, tool observation"
  - "02 안전한 Side Effect: permission, file, shell"
  - "03 확장과 Lifecycle: worker evidence, hook, plugin"
  - "04 Provider·MCP·CLI: bootstrap, provider, process, terminal"
  - "05 다중 작업 운영: record, worker, policy, trace, recovery"
```

이후 모든 배열·sidebar·본문 링크를 같은 인과 순서로 맞췄다. 핵심 경로는
`overview → session → compaction → tool-system`, 운영 경로는
`task-team → subagent-orchestration → policy-engine → telemetry → recovery`
다. 저장소 디렉터리 순서나 기능 이름의 알파벳 순서는 사용하지 않았다.

### 원문에서 다시 만든 실행 계약

검산 source는 `/home/heru/code/claw-code`의
`ab44985916cb0d53d2f7a55ea90e0d7be97d4626` revision으로 고정했다.

```yaml
pinned_sources:
  packet: "rust/crates/runtime/src/task_packet.rs"
  tasks: "rust/crates/runtime/src/task_registry.rs"
  team_cron: "rust/crates/runtime/src/team_cron_registry.rs"
  tools: "rust/crates/tools/src/lib.rs"
```

`TaskPacket`의 실제 필드는 10개다. objective, scope, scope_path, repo,
worktree, branch_policy, acceptance_tests, commit_policy,
reporting_contract, escalation_policy 외의 Goal, Constraint, dependency,
deadline, tag, callback은 없다. validation도 정책을 집행하지 않는다.
필수 문자열, 일부 scope의 scope_path, 비어 있지 않은 acceptance test
문자열만 검사한다.

`RunTaskPacket`은 worker를 시작하지 않는다.

```text
JSON
→ TaskPacket deserialize
→ validate_packet
→ TaskRegistry::create_from_packet
→ HashMap insert(status = Created)
→ JSON response
```

`TaskRegistry`는 `Arc<Mutex<HashMap>>` 기반 process-memory 상태다.
`set_status`는 transition graph를 강제하지 않고, `stop`만 이미 terminal인
task를 다시 멈추는 것을 거부한다. 따라서 Created 응답은 실행 증거도,
완료 증거도 아니다.

TeamCreate의 결손은 처음 감사에서 한 번 잘못 읽었다. 정확한 계약은
다음과 같다.

```yaml
team_create:
  root:
    fields: [name, tasks]
    additionalProperties: false
  task_item:
    documented_fields: [prompt, description]
    additionalProperties: "생략되어 extra field 허용"
  executor_reads: task_id
  ordinary_documented_input_result: "task_ids = []"
```

따라서 `task_id`를 item에 넣는 것이 schema-invalid인 것은 아니다.
문제는 model-facing item에 `task_id`가 문서화되지 않았는데 executor는
그 필드만 소비한다는 점이다.

Cron도 “아무 소비 경로가 없다”고 쓰지 않았다. public Cron tool은
create/delete/list를 노출하고, agent 성공 뒤
`disable_matching_crons`가 manifest/result 키워드와 맞는 record를
disable한다. 그러나 이것은 schedule을 소비하는 clock이 아니다. parser,
next-run 계산, clock loop, task spawn, lease와 production `record_run`
호출은 이 revision에 없다.

### 본문과 Viz 설계

`claw-task-team`은 과거의 긴 enum·class 나열을 public assembly에서 빼고
하나의 깊은 질문으로 다시 썼다.

```yaml
task_team_story:
  question: "created 응답이면 worker가 시작했는가?"
  sections:
    - "control record와 execution effect"
    - "실제 10-field packet과 validation"
    - "Created에서 끝나는 registry call path"
    - "Team schema/executor와 Cron clock 결손"
    - "production handoff의 다섯 owner"
  handoff:
    - "schema"
    - "executor"
    - "terminal receipt"
    - "durable store"
    - "scheduler lease"
```

새 Viz는 SVG flowchart 대신 responsive DOM state lab으로 만들었다.
Task lab의 Packet·Task·Team·Cron 탭은 색만 바꾸지 않고 input, 실제
call path, proved fact, missing owner를 함께 바꾼다. Session lab은 live,
saved, forked, effect마다 Session이 보존하는 것과 외부 owner가 다시
관찰해야 하는 것을 바꾼다. Overview lab도 2열/4열 안정 그리드와 44px
control로 맞췄다.

```yaml
responsive_contract:
  viewports: [390x844, 768x1024, 1440x900]
  tab_grid: "2 columns below sm, 4 columns at sm+"
  control_height: ">= 44px"
  index_label: ">= 11px"
  overflow: "<= 1px"
  diagrams: "DOM; Lucide control/status icons only"
```

### Context Manager와 Claude 교정 이력

Pre-audit는 최대 두 worker로 병렬 실행했다. 최초 curriculum 요청은 잘못된
local path로 model call 전에 실패해 attempt 2로 교체했다. 두 pre-audit는
모두 strict `REVISE`였고 dead slug, 세 종류의 순서 불일치, source 없는
Task 글, 존재하지 않는 API·임의 수치·장식성 Viz를 찾았다.

Post-audit attempt 1도 두 건 모두 strict `REVISE`였다. UI 감사는
content-spec의 “no SVG”가 Lucide icon까지 금지하는 문장이라는 점과
9px 순번을 잡았다. Source 감사는 Team item/root의
`additionalProperties` 귀속과 Cron의 `disable_matching_crons` 누락을
잡았다. 둘 다 local source에서 재검산한 뒤 본문·Viz·spec·test를 함께
고쳤다.

무효 응답도 버리지 않고 기록했다.

```yaml
invalid_receipts:
  curriculum_attempt_2:
    semantic_verdict: ACCEPT
    strict_valid: false
    reason: "verdict 앞에 검산 문단 출력"
  curriculum_attempt_3:
    http: 200
    ok: false
    result_characters: 0
    reason: "Claude harness 240s timeout, exit 143"
```

최종 유효 영수증은 다음 두 개다.

```yaml
valid_receipts:
  responsive:
    file: ".codex-tmp/claude-claw-flow-postaudit-2026-07-30/results/claw-responsive-learning-ui-postaudit.attempt-2.raw.json"
    verdict: ACCEPT
    strict_valid: true
    source_hash_stable: true
  curriculum_source:
    file: ".codex-tmp/claude-claw-flow-postaudit-2026-07-30/results/claw-curriculum-source-verdict-retry.attempt-1.raw.json"
    verdict: ACCEPT
    strict_valid: true
    source_hash_stable: true
```

### 4B·9B 모델용 축소 packet

작은 모델에는 `tools/src/lib.rs` 전체와 19개 글을 한 번에 주지 않는다.
한 packet이 하나의 owner와 하나의 거짓 추론만 판정하게 한다.

```yaml
claw_4b_packets:
  - input: [tool_schema, executor_fields]
    output: [documented_fields, consumed_fields, mismatch]
  - input: [TaskPacket_struct, validate_packet]
    output: [exact_fields, validated_invariants, unvalidated_policies]
  - input: [RunTaskPacket_call_path]
    output: [last_observed_effect, missing_worker_owner]
  - input: [TaskRegistry_methods]
    output: [storage_lifetime, guarded_transitions, unguarded_transitions]
  - input: [Cron_tool_specs, disable_matching_crons, record_run_calls]
    output: [record_operations, post_completion_effect, absent_clock_owners]
  - input: [one_learning_path, manual_links]
    output: [causal_order, dead_slug, order_conflict]
  - input: [one_state_lab, three_viewport_geometry]
    output: [state_changes, invariant_changes, overflow, minimum_control]
```

9B integrator는 packet 결과를 새 사실로 확장하지 않고 다음 gate로만
결합한다.

```yaml
claw_9b_integrator:
  required_order:
    - "schema before executor"
    - "record creation before worker effect"
    - "worker effect before terminal receipt"
    - "session state before external state"
    - "policy before side effect"
    - "trace before recovery"
  reject_if:
    - "status=created is called worker execution"
    - "string policy is called enforced policy"
    - "in-memory registry is called durable"
    - "stored cron text is called scheduled execution"
    - "schema root constraint is attributed to an item"
    - "one post-completion disable path is called a scheduler"
    - "Viz changes color but not evidence or missing owner"
  evidence:
    - "pinned source revision"
    - "focused Rust unit tests"
    - "Playwright causal-order and geometry assertions"
    - "strict and source-stable Claude receipt"
```

### 검증 결과

```yaml
frontend:
  build: "npm run build:tsc"
  result: pass
  new_contract: "6/6 pass"
  prior_claw_regression: "29/29 pass"
  learning_audit:
    registered_ai: 304
    release_blockers: 0
    formula_gaps: 0
    claw_articles: "19/19 score 0"
source:
  task_packet_tests: "3/3 pass"
  team_cron_registry_tests: "17/17 pass"
  run_task_packet_test: "1/1 pass"
visual:
  screenshots: "9 full-page PNG"
  viewports: [390x844, 768x1024, 1440x900]
  document_overflow: "<= 1px"
  lab_overflow: "<= 1px"
  control_height: ">= 44px"
```

## 2026-07-30 Agent Runtime 제품 사례 재구성

### 왜 이 묶음을 먼저 고쳤는가

`agent-frameworks` 다음에 놓인 `claude-code`와
`openclaw-assistant`는 서로 다른 제품 소개처럼 보였지만, 독자가 옮겨
가져가야 할 질문은 같았다.

> 모델의 문장이 실제 효과가 되기까지 어떤 경계가 있고, 각 경계의
> 소유자는 누구이며, 성공을 무엇으로 증명하는가?

따라서 제품 기능 목록을 늘리지 않고 다음 공통 골격을 사용했다.

```text
입력·신원
  -> 모델의 제안
  -> 권한·정책
  -> 실행 주체
  -> 외부 효과
  -> 관찰·검증 증거
```

Claude Code에서는 이 골격을 `permission rule -> sandbox -> tool
execution -> diff/test`로 구체화했다. OpenClaw에서는 `sender admission
-> agent route -> conversation session -> runtime effect -> channel
delivery`로 구체화했다. 같은 골격을 두 제품에 적용했기 때문에 독자는
제품 이름이 바뀌어도 “모델이 답했다”와 “효과가 실제로 전달됐다”를
구분할 수 있다.

### 원문에서 바로잡은 현재 사실

Claude Code 공개 저장소는 README, changelog, plugin 등 공개 표면을
제공하지만 비공개 런타임 내부 구현을 증명하지 않는다. 따라서 과거
본문의 임의 파일명, 평균 tool-call 수, subagent 수, 성공률 같은 숫자를
삭제했다. 공식 문서가 현재 설명하는 권한 규칙과 모드, Bash sandbox,
내장 파일 도구, `CLAUDE.md`, Skill, MCP, subagent, hook만 현재 사실로
남겼다.

OpenClaw는 더 큰 수정이 필요했다. 고정한 공식 소스에서는 Gateway가
session, channel, tool, event의 control-plane owner다. 활성 session
state는 agent별 SQLite에 있고 `sessions/` 아래 transcript는
archive·migration·import/export·support 경로다. 따라서 “JSONL이 활성
session store”, “Pi SDK가 primary runtime”, 존재하지 않는
`ChannelRouter`와 `server.impl.ts` 같은 설명을 제거했다. DM
pairing/allowlist, `session.dmScope`, identity link, partial delivery,
incognito의 in-memory 범위도 서로 다른 보장으로 분리했다.

```yaml
route:
  - agent-frameworks
  - claude-code
  - openclaw-assistant
source_revisions:
  claude_code: 7ef6eec9d9ba84ea6f233f26c45f1df5c5991843
  openclaw: 4e5bf66fb18a5f1b7767ad0e159e98d4fbde04b6
preaudit:
  claude_code: REVISE
  openclaw: REVISE
missed_500_closure:
  claw_security: ACCEPT
postaudit:
  claude_code: ACCEPT
  openclaw: ACCEPT
```

### 본문과 Viz를 만든 의도

두 글 모두 처음부터 정의·목록으로 시작하지 않고 실패할 수 있는 한
건의 흐름을 따라간다. 각 절은 “이 계층이 무엇을 안다”, “무엇을
모른다”, “무엇을 증명하지 못한다”를 함께 설명한다. 숨은 전이 문제는
본문에 퀴즈로 노출하지 않고 다음 사례로 검산했다.

```yaml
hidden_transfer_cases:
  claude_code:
    - "permission allow만으로 Bash가 안전하다고 결론 내리는가"
    - "모델의 성공 문장을 실행 성공 증거로 쓰는가"
    - "CLAUDE.md와 hook을 같은 종류의 제어로 취급하는가"
  openclaw:
    - "sender admission을 agent routing과 혼동하는가"
    - "model response를 channel delivery 완료로 부르는가"
    - "incognito를 외부 tool side effect까지 지우는 기능으로 보는가"
```

Viz는 선을 많이 그린 아키텍처 그림 대신, 한 시점에 하나의 경계와
보장만 비교하는 DOM 기반 상태 실험실로 만들었다. 탭을 바꾸면 owner,
input, proves, does-not-prove가 함께 바뀐다. 자동 문맥 rail이 lab
heading과 중복되던 문제는 의미 있는 `<header>`를 제공해 해결했다.
OpenClaw 모바일의 다섯 번째 탭은 두 column을 사용하게 해 빈 칸으로
보이는 문제도 제거했다.

### Context Manager와 Claude 영수증

이전에 500으로 누락된 검증을 포함해 최대 두 worker로 다시 병렬
실행했다. 사전 감사 두 건은 모두 strict `REVISE`였고, 그 지적을
공식 문서와 고정 source revision에서 재검산한 뒤 적용했다. sidebar
감사의 `orient`/`map` label 교환 제안은 현재 stage 의미를 오히려
뒤집으므로 적용하지 않았다.

```yaml
valid_receipts:
  claude_code:
    file: ".codex-tmp/claude-agent-runtime-preaudit-2026-07-30/results/claude-code-product-case-postaudit.attempt-1.raw.json"
    verdict: ACCEPT
    first_attempt: true
    strict_valid: true
    source_hash_stable: true
  openclaw:
    file: ".codex-tmp/claude-agent-runtime-preaudit-2026-07-30/results/openclaw-product-case-postaudit.attempt-1.raw.json"
    verdict: ACCEPT
    first_attempt: true
    strict_valid: true
    source_hash_stable: true
  claw_security_missed_500:
    verdict: ACCEPT
    first_attempt: true
    strict_valid: true
    source_hash_stable: true
```

### 4B·9B 모델용 제품 사례 packet

4B 모델에는 제품 전체 문서와 완성 원고를 함께 주지 않는다. 하나의
packet은 하나의 경계와 하나의 과장 가능성만 판정한다.

```yaml
claude_code_4b_packets:
  - input: [permission_rule_docs, claim_list]
    output: [supported_claims, unsupported_claims, current_names]
  - input: [sandbox_docs, bash_claims]
    output: [sandbox_owner, covered_effects, uncovered_effects]
  - input: [memory_skill_mcp_subagent_hook_docs]
    output: [loading_surface, lifecycle, capability_or_instruction]
  - input: [one_execution_trace]
    output: [model_statement, tool_result, diff, test_evidence]

openclaw_4b_packets:
  - input: [channel_pairing_docs, one_message]
    output: [sender_admitted, admission_evidence, not_yet_proven]
  - input: [routing_docs, session_docs]
    output: [agent_route, conversation_scope, persistence_owner]
  - input: [runtime_docs, tool_policy_docs]
    output: [instruction_source, capability_source, effect_owner]
  - input: [delivery_docs, one_partial_failure]
    output: [model_response, attempted_delivery, confirmed_delivery]
  - input: [sqlite_transcript_incognito_docs]
    output: [active_state, archive_state, memory_only_state, external_effect]
```

9B integrator는 모든 packet 판정이 끝난 뒤에만 글의 흐름을 조립한다.

```yaml
agent_runtime_9b_integrator:
  required_fields: [owner, input, proves, does_not_prove, source]
  reject_if:
    - "unsupported internal filename is presented as current"
    - "historical dependency is presented as current runtime owner"
    - "permission approval is presented as sandbox containment"
    - "model answer is presented as external delivery receipt"
    - "incognito is presented as deletion of external side effects"
  assembly_order:
    - "one motivating failure"
    - "boundary-by-boundary causal explanation"
    - "one interactive transfer visualization"
    - "independent verification procedure"
    - "official and pinned-source provenance"
```

### 검증과 배포

```yaml
frontend:
  build: "npm run build:tsc"
  result: pass
tests:
  focused_local: "7/7 pass"
  related_regression: "1/1 pass"
  public: "7/7 pass"
visual:
  screenshots: ".codex-tmp/agent-runtime-after-2026-07-30/"
  viewports: [390x844, 768x1024, 1440x900]
  document_overflow: "<= 1px"
  lab_overflow: "<= 1px"
  control_height: ">= 44px"
deploy:
  service: "cm-blog.service active"
  local_http: 200
  public_http: 200
```

## 2026-07-30 프런티어 오픈 이미지·비디오 모델 사례 재구성

### 묶음 선택과 최소 역사 바닥

이번 묶음은 모델 이름을 많이 나열하기 위해 고른 것이 아니다. 현재
제작 경로에서 서로 다른 다섯 가지 판정 문제를 대표하도록 골랐다.

```yaml
cases:
  z_image: "family 설명과 현재 실행 code의 경계"
  illustrious_xl_v11: "SDXL 상속과 짧은 derivative card의 경계"
  wan22: "같은 family 안의 sparse A14B와 dense TI2V 선택"
  ltx23: "논문 architecture와 현재 22B artifact의 version 경계"
  sulphur2: "official inference가 아직 없는 derivative claim 경계"
minimum_floor:
  image: "SDXL/latent diffusion runtime까지"
  video: "공통 video runtime의 temporal latent·condition·memory까지"
stop_rule: "private dataset·optimizer·미공개 stream split을 추정하지 않는다"
```

따라서 오래된 생성 모델 계보를 다시 필수 경로에 넣지 않았다. 독자가
현재 checkpoint를 고르고 실패 owner와 재현 증거를 판정할 수 있으면
본문을 멈춘다. 과거 이론은 그 판정에서 실제로 막힐 때만 선행 글로
내려간다.

### 고정한 원문과 바로잡은 사실

```yaml
source_revisions:
  z_image: 26f23eda626ffadda020b04ff79488e1d72004cd
  wan22: 42bf4cfaa384bc21833865abc2f9e6c0e67233dc
  ltx2: 9377758131b1ffde4b7f766804590a6617bf2ab9
cards:
  - "Illustrious XL v1.1 official model card snapshot"
  - "Sulphur 2 official Hugging Face card snapshot"
```

Z-Image는 family README의 text·visual semantic·image VAE token 설명과
현재 T2I code에서 관찰되는 caption/image 두 input branch를 분리했다.
Base 50 NFE와 Turbo 8 NFE, CFG·negative prompt 차이를 각각의
artifact에 귀속했고 Omni/Edit은 `To be released`로 잠갔다.

Illustrious는 SDXL 공통 runtime, v1.1 카드가 직접 밝힌 continuation,
stabilization hyperparameter, character understanding, `2024-07`
cutoff, 400 sample의 ELO 1617/1571, 직접 검증해야 하는 tag·LoRA·merge
가설을 세 층으로 분리했다.

Wan2.2는 A14B의 약 27B total·step당 약 14B active noise-regime MoE와
별도 dense TI2V-5B를 분리했다. TI2V의 4x16x16 VAE와 1x2x2 patch,
A14B 80GB와 TI2V 24GB는 서로 다른 command·offload 계약으로 남겼다.

LTX는 LTX-2 논문의 14B video+5B audio와 현재 LTX-2.3의 22B checkpoint
label을 같은 수치로 합치지 않았다. 2.3의 정확한 stream split은
공개 문서에서 미확인으로 보존했다. Sulphur는 LTX-2.3 base, T2V/I2V,
BF16/FP8-mixed, distill LoRA, GGUF+MMPROJ와 official inference pending만
card fact로 남겼다. Qwen, 125k clips, 500GB, full fine-tune의 정확한
의미와 품질 인과는 미확인이다.

### 본문과 Viz를 조립한 의도

각 글은 정의 목록이 아니라 다음 질문 순서로 조립했다.

```text
지금 해결할 실패
  -> artifact·version 선택
  -> tensor 또는 claim의 실제 경로
  -> 비용·품질 tradeoff
  -> 재현 evidence
  -> 공개 근거의 stop rule
```

내부 전이 문제는 본문 퀴즈로 노출하지 않고 작성 검산에만 사용했다.

```yaml
hidden_transfer_cases:
  z_image:
    - "family README의 세 token을 현재 T2I code의 세 독립 module로 발명하는가"
    - "미공개 Edit를 실행 가능한 workflow로 안내하는가"
  illustrious:
    - "LoRA 결과를 v1.1 checkpoint 고유 성능으로 귀속하는가"
    - "ELO 46을 모든 prompt의 절대 품질 증가로 일반화하는가"
  wan:
    - "TI2V-5B를 작은 A14B MoE로 보는가"
    - "24GB 수치를 A14B에도 옮기는가"
  ltx:
    - "논문 19B 합계를 2.3의 정확한 내부 split로 부르는가"
  sulphur:
    - "prompt enhancer의 기반 LLM을 Qwen으로 추정하는가"
    - "official inference pending인데 local quality를 공식 성능으로 부르는가"
```

다섯 Viz는 고정 폭 SVG를 폐기하고 DOM state lab으로 만들었다. 탭을
바꾸면 색만 달라지는 것이 아니라 owner, verified claim, unknown,
runtime tradeoff와 필요한 receipt가 함께 바뀐다. 44px control,
`aria-pressed`, 정확한 `aria-label`, `scroll-mt-28`, `min-w-0`와
responsive grid를 공통 계약으로 사용했다. LTX 데스크톱은 초기 캡처에서
왼쪽 version 설명이 지나치게 좁고 오른쪽이 비어 보여 1.4:0.6 비율로
다시 조정했다.

### Context Manager 500·timeout 회복과 Claude 영수증

사전의 큰 video lineage 요청은 timeout이었으므로 Wan과
LTX·Sulphur를 좁은 packet으로 나눴다. 최대 두 worker만 동시에
실행했고, 과거 500 누락은 이미 전체 article ledger 71/71과
`historical-gap-final-closure`의 strict `ACCEPT`로 닫힌 상태를
재확인했다. 이번 current source 사후 감사 세 건도 모두 첫 시도
`ACCEPT`였다.

```yaml
postaudit_receipts:
  frontier_image_current:
    file: ".codex-tmp/claude-frontier-media-postaudit-2026-07-30/results/frontier-image-current.attempt-1.raw.json"
    verdict: ACCEPT
    http: 200
    worker: "claude-code:sonnet"
    strict_valid: true
    source_hash_stable: true
  frontier_wan_current:
    file: ".codex-tmp/claude-frontier-media-postaudit-2026-07-30/results/frontier-wan-current.attempt-1.raw.json"
    verdict: ACCEPT
    http: 200
    worker: "claude-code:sonnet"
    strict_valid: true
    source_hash_stable: true
  frontier_ltx_sulphur_current:
    file: ".codex-tmp/claude-frontier-media-postaudit-2026-07-30/results/frontier-ltx-sulphur-current.attempt-1.raw.json"
    verdict: ACCEPT
    http: 200
    worker: "claude-code:sonnet"
    strict_valid: true
    source_hash_stable: true
```

### 4B·9B 모델용 축소 packet

4B 모델은 한 번에 한 모델 전체를 쓰지 않는다. 한 packet에서 한
owner와 한 충돌만 판정한다.

```yaml
frontier_media_4b_packets:
  - input: [family_readme_excerpt, current_code_excerpt]
    output: [shared_claims, code_observed_claims, unreleased_claims]
  - input: [base_report_excerpt, derivative_card]
    output: [inherited, explicitly_changed, experiment_required]
  - input: [two_family_configs, hardware_commands]
    output: [task, sparse_or_dense, active_compute, scoped_memory_claim]
  - input: [paper_numbers, current_artifact_names]
    output: [paper_fact, current_fact, unknown_version_delta]
  - input: [derivative_card, upstream_docs]
    output: [verified_package_fact, inherited_fact, unsupported_claim]
  - input: [one_formula, one_formula_note]
    output: [symbol_meaning, Korean_why, overflow_risk]
  - input: [one_lab_state, three_viewport_geometry]
    output: [manipulated_variable, changed_evidence, overflow, control_size]
```

각 packet은 `unknown`을 허용하고 정확한 source owner와 revision을
필수로 반환한다. 9B integrator는 새 사실을 발명하지 않고 다음 gate로만
결합한다.

```yaml
frontier_media_9b_integrator:
  required_order:
    - "current failure before model history"
    - "artifact before architecture number"
    - "inherited before changed"
    - "changed before local experiment"
    - "runtime evidence before quality conclusion"
    - "finite stop rule before deeper optional sources"
  reject_if:
    - "unreleased artifact is presented as runnable"
    - "family description is presented as current code structure"
    - "derivative workflow folklore is presented as official training fact"
    - "paper parameter split is copied into a newer checkpoint"
    - "hardware number loses its command and offload scope"
    - "pending official inference is presented as verified quality"
    - "Viz changes color without changing claim owner or evidence"
```

### 검증과 공개 배포

```yaml
build:
  command: "npm run build:tsc"
  result: pass
focused_contract:
  local: "16/16 pass"
  public: "16/16 pass"
sidebar_regression:
  structure: "4/4 pass"
  local_information_architecture: "18/18 pass"
  public_information_architecture: "18/18 pass"
visual:
  screenshots: ".codex-tmp/frontier-media-after-2026-07-30/"
  viewports: [390x844, 768x1024, 1440x900]
  document_overflow: "<= 0px"
  lab_overflow: "<= 1px"
  control_height: ">= 44px"
  katex_errors: 0
deploy:
  service: "cm-blog.service active"
  public: "https://heru.ragdoll-bigeye.ts.net/lab/blog/"
```

다음 묶음은 같은 오픈 미디어 경로의 현재 상단 사례인 Krea 2와
Ideogram 4다. 두 글은 공개 접근 범위가 서로 다르므로, 제품 소개를
늘리기 전에 official research/model page가 증명하는 architecture,
typography·layout condition, open-weight 여부와 재현 가능한 local
evidence를 먼저 분리한다.

## 2026-07-30 Krea 2·Ideogram 4 현재 사례 감사와 Viz 안정화

### 왜 이 두 사례를 한 묶음으로 골랐는가

두 모델 모두 최신 이미지 제작 사례지만 독자가 배워야 할 경계는
다르다. Krea 2는 넓은 style 분포를 data·architecture·post-training과
RAW→Turbo handoff로 만드는 사례이고, Ideogram 4는 typography와
layout 요구를 structured caption·bounding box·color·runtime·license
계약으로 보존하는 사례다. 따라서 둘을 “새 모델 목록”으로 나열하지
않고 같은 Image runtime 위에서 서로 다른 실패를 소유하는 두 leaf
article로 유지했다.

```text
제작 실패
  ├─ 한 장의 정답으로 style 분포가 수렴한다
  │    -> Krea 2: data에서 RAW·Turbo까지 lifecycle을 추적한다
  └─ 글자·배치가 sampling 중 사라진다
       -> Ideogram 4: brief가 pixel까지 살아남는 condition path를 추적한다
```

기존 두 글은 이미 독립 질문과 깊은 본문을 갖고 있었다. 그러므로
새로 쓰는 양을 목표로 삼지 않고, 최신 공식 근거와 충돌하는 주장,
학습 경로 handoff, interactive evidence와 반응형 geometry만 감사했다.

### 공식 근거를 확보한 방법과 출처 경계

공식 페이지는 plain `curl`에 HTTP 403을 반환했다. 이 상태에서
검색 결과 snippet이나 기억으로 메우지 않고 Playwright browser
context가 실제로 렌더링한 HTTP 200 페이지의 본문과 화면을 고정했다.

```yaml
browser_capture:
  script: ".codex-tmp/krea-ideogram-sources-2026-07-30/capture-official.mjs"
  krea_report: ".codex-tmp/krea-ideogram-sources-2026-07-30/krea-2-technical-report.txt"
  ideogram_release: ".codex-tmp/krea-ideogram-sources-2026-07-30/ideogram-4-release.txt"
  ideogram_details: ".codex-tmp/krea-ideogram-sources-2026-07-30/ideogram-4-technical-details.txt"
  browser_http: 200
fixed_repositories:
  krea2:
    path: "/home/heru/code/krea2-upstream"
    commit: "db3984fbc6e13b34c0064990fc2d95ac64d00058"
  ideogram4:
    path: "/home/heru/code/ideogram4-upstream"
    commit: "990fe1c4e950bb9e9dc90e01c0ad98ba434f83c2"
```

Krea 2에서 확정한 범위는 다음과 같다.

- RAW는 52 steps·CFG 3.5·최대 1K, Turbo는 8 steps·CFG 0·`mu=1.15`·
  1K–2K라는 서로 다른 inference artifact다.
- LoRA는 RAW에서 학습하고 Turbo에서 적용하는 handoff를 사용한다.
- GQA, gated attention, SwiGLU, zc-RMSNorm, 3D RoPE, light timestep
  bias, single-stream 구조와 256→512→1024 curriculum을 근거에
  귀속했다.
- early 8-bit에서 bf16으로 바뀌는 precision curriculum, 첫 epoch의
  iREPA, pretraining→midtraining→SFT→preference→RL 순서를 구분했다.
- code의 Apache-2.0과 community weight license를 분리했다. 후자는
  company-wide annual revenue가 1M USD 미만일 때만 별도 commercial
  license 없이 사용할 수 있고, 그 이상은 enterprise license가
  필요하며 공개물 filtering 의무도 있다.
- 공식 report와 repo가 총 parameter 수를 직접 밝히지 않으므로
  `12B rectified-flow DiT`라는 표현을 삭제했다. 구조를 공개했다는
  사실과 총 수치를 공개했다는 주장은 다르다.

Ideogram 4에서 확정한 범위는 다음과 같다.

- 모델은 9.3B, 34-layer single-stream 구조다.
- Qwen3-VL-8B-Instruct의 13개 intermediate layer feature를 사용한다.
- structured JSON과 y-first
  `[y_min, x_min, y_max, x_max]`, 0–1000 box를 별도 condition으로
  다룬다.
- Euler flow matching과 asymmetric CFG를 runtime 계약으로 묶었다.
- Magic Prompt의 source owner와 현재 model owner를 섞지 않았다.
- public weight는 non-commercial, code는 Apache-2.0이며 commercial
  사용은 별도 licensing 경로다.
- 현재 cutout 기능과 향후 editable text·movable layer roadmap을
  현재 기능처럼 합치지 않았다.

### 본문을 검산한 hidden transfer 문제

문제는 본문에 퀴즈로 붙이지 않았다. 작성한 본문만 읽은 사람이
새 artifact와 납품 brief를 만났을 때 경계를 옮겨 적용할 수 있는지
검산하는 데만 사용했다.

```yaml
hidden_transfer_cases:
  krea_2:
    - "Turbo가 빠르므로 Turbo weight에서 LoRA를 바로 학습해도 된다고 결론 내리는가"
    - "공개 architecture component를 더해 총 12B라고 발명하는가"
    - "Apache code license를 weight의 무제한 상업 사용권으로 옮기는가"
    - "style 다양성을 sample 한 장의 aesthetic score로만 판정하는가"
  ideogram_4:
    - "x-first box를 넣고 모델 성능 문제로 오진하는가"
    - "13 layer feature를 13개의 독립 text encoder로 해석하는가"
    - "향후 editable layer를 현재 제공 기능으로 안내하는가"
    - "API·public weight·commercial license를 하나의 공개성으로 합치는가"
  shared_runtime:
    - "모델 이름을 가린 뒤에도 실패가 condition, solver, decode, license 중 어디에 속하는지 찾는가"
```

### 색 교체가 아니라 geometry와 evidence를 고친 방법

초기 Viz는 내용은 맞았지만 모바일에서 단계마다 header와 stage 높이가
바뀌었다. 사용자가 tab을 누를 때 아래 control lab이 위아래로 이동해
같은 변수를 비교하기 어려웠다.

```yaml
before:
  ideogram_mobile_header: "156px .. 200px"
  krea_mobile_header: "177px .. 222px"
  krea_mobile_stage: "390px .. 463px"
problem:
  - "AnimatePresence 안의 설명 길이가 전체 비교 도구의 위치를 바꿨다"
  - "작은 pipeline label과 metric이 색보다 먼저 읽혀야 하는 정보를 숨겼다"
  - "검증 control이 animated stage 안에 있어 조작 대상과 관찰 결과가 흔들렸다"
```

`StepViz`에 선택적인 `headerClassName`과 `stageClassName`만 추가했다.
기존 Viz에는 아무 변화가 없고, 두 사례만 viewport별 안정 높이를
명시했다. 계약 검증 lab은 animation stage 아래의 독립 DOM 영역으로
옮겼다. 선택 상태는 검은 덩어리가 아니라 낮은 채도의 sky·indigo로
표시하고, milestone number·owner·verified/unknown boundary를 더 크게
보였다. desktop pipeline의 작은 sublabel도 다시 노출했다.

```yaml
after:
  ideogram_control_top:
    all_five_steps: "690px"
  krea_control_top:
    all_five_steps: "about 780px"
    max_delta: "<= 0.4px"
  geometry_contract:
    ideogram:
      mobile: { header: 200, stage: 368 }
      small_up: { header: 135, stage: 360 }
    krea:
      mobile: { header: 223, stage: 435 }
      small: { header: 135, stage: 384 }
      desktop_stage: 360
  shared:
    control_height: ">= 44px"
    viz_overflow: 0
    formula_overflow: 0
    scroll_anchor: "scroll-mt-28"
```

최종 screenshot은 다음 위치에 390×844, 768×1024, 1440×900으로
남겼다.

```text
.codex-tmp/krea-ideogram-visual-audit-2026-07-30/
```

긴 element screenshot 중간에 보이는 site navigation은 현재 사이트의
sticky navigation이 stitched locator capture에 겹쳐 보인 것이다.
Viz 내부 요소가 서로 겹친 것으로 오판하지 않았고, document·Viz·formula
overflow와 console error는 별도로 수치화했다.

### Claude 사후 감사와 실패를 포함한 영수증

최대 두 Context Manager worker만 병렬로 사용했다. HTTP 200만으로
성공 처리하지 않고 worker, inner attempt, standalone verdict,
source hash를 모두 검사했다.

```yaml
attempt_ledger:
  attempt_1:
    krea: "ACCEPT"
    ideogram: "ACCEPT"
  attempt_2_after_visual_edits:
    krea:
      verdict: "REVISE"
      finding: "공식 근거가 밝히지 않은 12B rectified-flow DiT 주장"
      action: "12B 삭제, total parameter count 미공개 경계 명시"
    ideogram:
      http: 200
      harness: "timeout"
      receipt: "invalid because result was empty"
  attempt_3:
    krea: "ACCEPT"
    ideogram: "ACCEPT"
final_receipts:
  krea:
    file: ".codex-tmp/claude-krea-ideogram-audit-2026-07-30/results/krea-2-current.attempt-3.raw.json"
    worker: "claude-code:sonnet"
    inner_attempt_ok: true
    strict_valid: true
    source_hash_stable: true
  ideogram:
    file: ".codex-tmp/claude-krea-ideogram-audit-2026-07-30/results/ideogram-4-current.attempt-3.raw.json"
    worker: "claude-code:sonnet"
    inner_attempt_ok: true
    strict_valid: true
    source_hash_stable: true
```

### 4B·9B 모델이 재현할 수 있는 축소 packet

4B worker에는 “Krea 2 글을 검토하라”처럼 큰 요청을 주지 않는다.
한 번에 한 claim owner와 한 failure만 판정시킨다.

```yaml
krea_ideogram_4b_packets:
  - input: [one_official_excerpt, one_article_claim]
    output: [entailed, contradicted, unknown, exact_owner]
  - input: [raw_command, turbo_command]
    output: [steps, cfg, resolution, mu, training_target, handoff]
  - input: [code_license, weight_license_excerpt, company_revenue]
    output: [code_right, weight_right, commercial_gate, obligation]
  - input: [structured_caption_example, bbox_example]
    output: [field_owner, axis_order, numeric_range, likely_failure]
  - input: [one_viz_state, three_viewport_measurements]
    output: [manipulated_variable, changed_evidence, top_offset_delta, overflow]
  - input: [one_formula, Korean_annotation]
    output: [symbol_meaning, why_this_operation, render_or_overflow_risk]
```

9B integrator는 packet 사이의 새 사실을 추론하지 않고 아래 gate만
통과시킨다.

```yaml
krea_ideogram_9b_integrator:
  required_order:
    - "production failure before model name"
    - "official artifact before architecture interpretation"
    - "condition path before sample quality"
    - "training target before fast runtime target"
    - "license owner before commercial advice"
    - "interactive evidence before visual ornament"
  reject_if:
    - "an unknown parameter count becomes an exact number"
    - "RAW and Turbo training targets are collapsed"
    - "bbox axis order or range is omitted"
    - "future roadmap is presented as current capability"
    - "code license is copied to weights"
    - "tab changes layout position enough to break comparison"
```

### 검증·빌드·공개 배포

```yaml
focused_contract:
  test: "tests/ideogram-krea-model-contract.spec.ts"
  local: "10/10 pass"
  public: "10/10 pass"
representative_viz:
  test: "tests/representative-viz-responsive.spec.ts"
  local: "6/6 pass"
  public: "6/6 pass"
frontier_media_regression:
  local: "16/16 pass"
information_architecture:
  local: "22/22 pass"
  public: "22/22 pass"
build:
  command: "npm run build:tsc"
  result: "pass"
deploy:
  service: "cm-blog.service active"
  public: "https://heru.ragdoll-bigeye.ts.net/lab/blog/"
```

다음 감사 단위는 개별 모델을 더 추가하는 일이 아니라 공통 오픈
미디어 spine이다. `open-image-video-models`에서 시작해
`image-model-runtime` 또는 `video-model-runtime`으로 갈라지고, 각
사례 뒤 `open-model-community-workflows`의 replay evidence로 다시
합류하는 경로가 실제 화면과 본문에서 보이는지 먼저 판정한다.

## 2026-07-30 오픈 미디어 공통 spine 분기 재구성

### 왜 다시 썼는가

본문은 이미 “Image 또는 Video 중 하나를 고른다”고 설명했지만 실제
학습 레일은 아래처럼 두 sibling branch를 직렬 단계처럼 보였다.

```text
00 Goal
→ 01A Image runtime
→ 01B Video runtime
→ 02 Workflow
→ 03 Budget
→ 04 Adaptation
```

이 구조에서는 이미지 작업자가 Video runtime을 선행 조건으로
오해하고, 비디오 작업자는 Image runtime부터 읽어야 하는 것으로
오해한다. 설명 문장만 고치는 것으로는 해결되지 않는다. 경로의
data model과 CategoryPage의 grouping contract를 함께 바꿔야 했다.

수정 전후 화면 근거는 아래에 남겼다.

```text
.codex-tmp/open-media-overview-before-mobile.png
.codex-tmp/open-media-overview-before-desktop.png
.codex-tmp/open-media-overview-after-mobile.png
.codex-tmp/open-media-hub-video-path-after-sync-mobile.png
```

### 먼저 고정한 학습 계약

코드보다 먼저 다음 spec을 작성했다.

```text
src/pages/articles/ai/content-specs/open-media-production-spine.md
```

최종 경로는 형제 branch를 순서로 오해할 수 없게 두 개로 분리한다.

```text
Image:
  00 Goal → 01 Image runtime → 02 Replay evidence
  → 03 Parameter budget → 04 Smallest adaptation

Video:
  00 Goal → 01 Video runtime → 02 Replay evidence
  → 03 Parameter budget → 04 Smallest adaptation

Optional floor:
  blocked only → Stable Diffusion / Latent Diffusion 2021
```

역사 하강은 Latent Diffusion 2021에서 끊는다. 현재 production
discard condition을 설명하는 데 그 아래 역사가 필요하지 않으면
선행 조건으로 올리지 않는다.

### 구현한 data model과 화면 계약

`ArticleMeta`에 `learningPaths?: string[]`를 추가했다. 기존
`learningPath`는 기본 경로로 유지하고, 정말 두 경로가 공유하는
글만 명시적으로 복수 membership을 갖는다.

```yaml
default_only:
  image-model-runtime: ai-open-image-current-first
  video-model-runtime: ai-open-video-current-first
explicitly_shared:
  open-image-video-models:
    - ai-open-image-current-first
    - ai-open-video-current-first
  open-model-community-workflows:
    - ai-open-image-current-first
    - ai-open-video-current-first
  open-model-workflow-parameters:
    - ai-open-image-current-first
    - ai-open-video-current-first
  open-model-finetuning-theory:
    - ai-open-image-current-first
    - ai-open-video-current-first
```

`CategoryPage`는 모든 membership을 읽되, 명시적으로 공유된 글만
두 authored sequence에 재등장시킨다. 일반 글은 기존처럼 첫 경로에서
claim된 뒤 다른 경로에 중복되지 않는다.

허브의 goal Viz도 query-aware하게 만들었다.
`?path=ai-open-video-current-first`로 직접 들어오면 처음부터 Video
목표가 선택되고, 시작 버튼은 다음 URL을 보존한다.

```text
/lab/blog/ai/video-model-runtime?path=ai-open-video-current-first
```

### 모델 case 연결과 글 소유권

허브가 평면 모델 표로 끝나지 않게 각 사례를 실제 상세 글로
연결했다.

```yaml
image_cases:
  - Ideogram 4
  - Krea 2
  - Z-Image
  - Illustrious XL v1.1
video_cases:
  - LTX-2.3
  - Wan2.2
```

FLUX.2와 Qwen-Image 2.0처럼 현재 상세 글이나 공개 artifact 경계가
다른 후보는 억지 링크를 만들지 않고 current candidate/watchlist로
남겼다. Stable Diffusion은 별도 질문을 답하는 구현 baseline으로
유지하되 두 production path의 필수 단계에는 넣지 않았다.

### 내부 transfer 문제

본문에 퀴즈를 넣지는 않았지만, 다음 문제를 풀 수 있는지를 감사
기준으로 사용했다.

```yaml
hidden_transfer_checks:
  - "Image 사용자에게 Video runtime을 읽지 않고 5단계 경로를 제시하라."
  - "Video 사용자가 허브 URL부터 들어와도 목표와 다음 링크가 모순되지 않게 하라."
  - "두 경로가 같은 workflow evidence에서 합류하되 runtime은 섞지 마라."
  - "공유 글과 우연히 두 주제에 걸친 일반 글을 data model에서 구분하라."
  - "공식 artifact가 없는 current candidate를 상세 글이 있는 것처럼 꾸미지 마라."
  - "왜 Stable Diffusion이 유용하지만 필수 선행은 아닌지 설명하라."
```

### Claude 감사와 영수증

Context Manager를 최대 두 worker 범위로 사용했다. 첫 IA 감사는
HTTP 200이었지만 inner attempt가 timeout으로 끝나 result가 비어
있었으므로 무효 처리했다. 판정 기준을 낮추지 않고 소유 파일을
12개에서 7개와 content spec으로 좁혀 다시 실행했다.

```yaml
runtime_source_math:
  receipt: ".codex-tmp/claude-open-media-spine-audit-2026-07-30/results/spine-runtime-source-math.attempt-1.raw.json"
  verdict: ACCEPT
  worker: claude-code:sonnet
  inner_attempt_ok: true
  strict_valid: true
  source_hash_stable: true
ia_attempt_1:
  http: 200
  inner_attempt_ok: false
  timed_out: true
  result_characters: 0
  receipt: invalid
ia_attempt_2:
  receipt: ".codex-tmp/claude-open-media-spine-audit-2026-07-30/results/spine-ia-learning-flow.attempt-2.raw.json"
  verdict: ACCEPT
  worker: claude-code:sonnet
  inner_attempt_ok: true
  strict_valid: true
  source_hash_stable: true
```

Claude는 runtime의 causal chain·수식·출처 경계를 ACCEPT했고,
재감사에서는 두 개의 정확한 5단계 경로, sibling runtime 배제,
shared rejoin, query-aware goal Viz, 상세 모델 링크, 선택적 역사
floor를 코드 단위로 확인했다.

### 4B·9B 축소 재현 packet

4B 모델은 전체 사이트를 재구성하지 않는다. 한 번에 한 membership
또는 한 링크 invariant만 판정한다.

```yaml
open_media_4b_packets:
  - input: [article_slug, default_path, alternate_paths]
    output: [image_only, video_only, explicitly_shared, invalid]
  - input: [one_path_steps]
    output: [step_count, contains_image_runtime, contains_video_runtime, rejoin_slugs]
  - input: [active_query, selected_goal, branch_href]
    output: [query_consistent, href_preserves_path]
  - input: [candidate_name, detail_slug, route_registry]
    output: [linked_detail, watchlist_only, broken_link]
  - input: [foundation_slug, production_path_steps]
    output: [optional_floor, mandatory_detour]
  - input: [one_viewport_measurement]
    output: [document_overflow, viz_overflow, formula_overflow, clipped_control]
```

9B integrator는 아래 invariant만 합친다.

```yaml
open_media_9b_integrator:
  accept_if:
    - "Image and Video each have exactly five authored steps"
    - "each branch contains only its own runtime"
    - "goal, workflow, budget and adaptation are explicit shared nodes"
    - "direct query selects and links the same branch"
    - "every linked model case resolves to a detailed article"
    - "older foundation is reachable but not mandatory"
  reject_if:
    - "sibling branches are rendered as consecutive steps"
    - "ordinary multi-topic articles duplicate across paths without explicit membership"
    - "a watchlist item is presented as a detailed implemented case"
    - "a historical baseline becomes an endless prerequisite chain"
```

### 반응형·빌드·공개 배포

```yaml
local:
  branch_contract: "1/1 pass"
  authored_paths: "1/1 pass"
  hub_390_768_1440: "3/3 pass"
  shared_runtime_workflow_budget_adaptation_360_390_768_1440: "20/20 pass"
  frontier_media_cases: "16/16 pass"
  representative_viz: "6/6 pass"
  build_tsc_vite: pass
public:
  branch_contract: "1/1 pass"
  authored_paths: "1/1 pass"
  hub_390_768_1440: "3/3 pass"
  shared_runtime_workflow_budget_adaptation_360_390_768_1440: "20/20 pass"
  frontier_media_cases: "16/16 pass"
deploy:
  service: "cm-blog.service active"
  public: "https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/open-image-video-models"
```

이 단계의 결론은 “내용을 더 많이 쓰면 체계적이 된다”가 아니다.
서로 배타적인 선택을 data model에서 먼저 분기하고, 공통 증거 단계만
의도적으로 다시 합쳐야 본문 깊이와 사이드바·경로 UI가 같은 구조를
말하게 된다.

## 2026-07-30 적응 판단에서 현재 Image Edit 구현까지

### 왜 이 배치를 따로 열었는가

공통 Open Media 경로가 `04 Adapt`에서 끝난 뒤 실제 편집 실패로
이어지는 연결이 없었다. 더 큰 문제는 기존 편집 Viz가 다섯 개
StepViz 라벨을 순서대로 밝힐 뿐, 편집 방식이 바뀔 때 무엇이
입력되고 무엇이 보존되는지 보여 주지 못했다는 점이다.

동시에 파라미터 예산 Viz에는 내부 모순이 있었다. Image 본문은
1024px를 VAE 공간 압축 8×로 설명하면서도 계산기는 Image와 Video
모두 고정 16×를 사용했다. 이 상태에서는 독자가 워크플로우의
숫자를 복사하지 말고 원인을 이해하라는 글의 목적과 계산기가
서로 다른 말을 한다.

```yaml
defects_before:
  - "Adaptation decision이 concrete Image edit 구현으로 이어지지 않는다."
  - "편집 Viz는 라벨만 바뀌고 manipulated variable과 evidence가 없다."
  - "Image latent 예산이 본문 /8 설명과 계산기 /16 사이에서 모순된다."
  - "Qwen 편집 글이 2025-08 개념에 머물러 2511과 2.0 경계를 말하지 않는다."
  - "img2img와 mask 합성의 수학적 차이가 본문에 없다."
```

변경 전 증거는 다음 두 locator screenshot에 남겼다.

```text
.codex-tmp/open-media-edit-viz-before-mobile.png
.codex-tmp/open-media-edit-before-mobile.png
```

### 출처와 current artifact 경계

원문은 전체 페이지의 스크린샷이 아니라 claim을 다시 검사할 수 있는
텍스트 snapshot으로 보존했다.

```yaml
source_snapshots:
  qwen_release_history:
    file: ".codex-tmp/open-media-adaptation-sources-2026-07-30/qwen-image-readme.md"
    intent: "2.0 announcement, Edit-2511 release, 2509와 2025-08 concept floor를 분리"
  comfy_current_workflow:
    file: ".codex-tmp/open-media-adaptation-sources-2026-07-30/comfy-qwen-edit-2511.md"
    intent: "현재 native workflow의 encoder, diffusion model, VAE, optional LoRA artifact 확인"
  flux_current_boundary:
    file: ".codex-tmp/open-media-adaptation-sources-2026-07-30/flux2-overview.md"
    intent: "FLUX.2의 generation/editing scope와 공개 variant 경계 확인"
```

Qwen-Image-2.0은 2026-02 발표·온라인 방향으로 설명하되, 공개 local
artifact가 확인되기 전에는 현재 재현 가능한
`Qwen-Image-Edit-2511` workflow를 대체하지 않게 했다.
2511은 현재 구현 기준, 2509는 multi-image·일관성 확장 기준,
2025-08 글은 semantic condition과 appearance condition을 나눠
이해하는 최소 개념 바닥으로만 남겼다. 최신 이름이 있다는 이유로
재현 가능한 artifact를 없는 것처럼 취급하지 않는 것이 의도다.

### 구현 계약

`open-model-finetuning-theory`의 끝에 선택형 implementation handoff를
추가했다. 이 링크는 Image·Video 공통 5단계의 여섯 번째 필수
단계가 아니다.

```yaml
adaptation_output:
  - failure condition
  - smallest sufficient intervention
  - frozen surface
  - changed surface
  - target fixture
  - regression fixture
  - rollback condition
optional_next:
  image_edit: comfyui-edit-models-flux-qwen
  image_prior: illustrious-xl
  video_training_artifact: ltx-23
```

파라미터 계산기는 profile을 분리했다.

```yaml
image_profile:
  model: "SDXL-like 교육 예"
  spatial_compression: 8
  1024px_grid: "128 × 128"
video_profile:
  model: "Wan2.2-VAE-like 교육 예"
  spatial_compression: 16
  temporal_compression: 4
excluded_from_estimate:
  - patchification
  - attention
  - activation
  - universal peak VRAM
```

즉 계산값은 model-agnostic VRAM 약속이 아니라, 같은 profile 안에서
resolution·frame·step 변화가 position-step을 어떻게 바꾸는지
비교하는 교육용 상대 예산이다.

### 편집 Viz를 어떻게 다시 추론했는가

StepViz를 더 화려하게 꾸미지 않았다. 네 편집 방식이 같은 장면에서
서로 다른 condition owner를 갖는다는 사실을 증명해야 했기 때문에
고정 비교 프레임을 먼저 설계했다.

```yaml
fixed_frame:
  zones: [제품, 변경 영역, 배경]
  evidence:
    - 요청 변경
    - identity 보존
    - 배경 보존
    - 편집 누출
changed_variables:
  latent_img2img: [source_latent, edit_strength]
  mask_repair: [source_latent, spatial_mask]
  instruction_edit: [source_latent, vision_semantics]
  multi_reference: [source_latent, vision_semantics, references]
```

모드를 바꿔도 zone geometry와 전체 높이는 고정한다. 달라지는 것은
active condition, 보존 상태, evidence 수치뿐이다. 그래서 학습자는
색을 외우지 않고 다음을 읽을 수 있다.

```text
mask가 켜지면 변경 허용 영역이 좁아진다
→ identity·background 보존은 올라간다
→ non-target spill은 내려간다
```

모바일과 데스크톱 최종 증거:

```text
.codex-tmp/open-media-edit-viz-after-mobile-v3.png
.codex-tmp/open-media-edit-viz-after-desktop.png
```

Claude 1차 post-edit 감사에서 desktop screenshot이 한국어 라벨
적용 전 파일이라는 점을 잡았다. 현재 소스로 다시 캡처하고
`제품/변경 영역/배경` 세 라벨을 Playwright assertion에 추가했다.
이는 화면 코드 수정이 아니라 증거 provenance와 회귀 계약 수정이다.

### 수학을 넣은 이유와 overflow 수정

편집 방식을 node 이름만으로 구분하지 않도록 두 연산을 실제
수식으로 연결했다.

```text
img2img:
  source latent와 noise를 edit strength에 따라 섞어 시작점을 만든다.
mask:
  denoised result와 source latent를 spatial mask로 합성한다.
```

두 수식은 기호만 렌더하지 않고 `FormulaNote`에서 한국어로 기호,
직관, 왜 필요한지를 설명한다. 최초 한 줄 식은 390px에서 overflow가
발생해 `aligned` multi-line으로 나눴다. 최종 측정은 두 식 모두
scale 1.00, font 16px, visible overflow 0 이하이다.

### 내부 transfer 문제

본문에 시험 문제를 넣지 않았지만 다음 문제를 풀 수 있는지로
깊이를 검사했다.

```yaml
hidden_transfer_checks:
  - "배경은 유지하고 제품 라벨만 바꿀 때 latent-only, mask, instruction, multi-reference 중 어떤 condition을 소유시켜야 하는가?"
  - "mask를 켰을 때 identity/background/spill 지표가 어느 방향으로 움직여야 하는가?"
  - "Qwen-Image-2.0 발표가 있어도 왜 2511 workflow를 현재 pinned artifact로 유지하는가?"
  - "1024px Image의 128×128 latent grid를 재현하고 Video profile과 압축 가정을 분리하라."
  - "adaptation brief를 concrete edit로 넘기되 Video learner에게 Image 구현을 필수화하지 마라."
  - "img2img의 시작 latent와 mask composition이 서로 해결하는 실패를 설명하라."
```

### Claude 감사와 실패 영수증

Context Manager는 최대 두 worker만 동시에 사용했다. HTTP 200만
성공으로 보지 않고 `.ok`, exact worker, inner attempt, result 길이,
첫 줄의 단일 verdict, source hash를 모두 검사했다.

```yaml
pre_edit_adaptation:
  verdict: REVISE
  finding: "Adaptation endpoint가 concrete edit로 이어지지 않는다."
  receipt: ".codex-tmp/claude-open-media-adaptation-audit-2026-07-30/results/adaptation-handoff.attempt-1.raw.json"
pre_edit_viz:
  http: 200
  inner_attempt_ok: false
  result_characters: 0
  verdict: invalid
  receipt: ".codex-tmp/claude-open-media-adaptation-audit-2026-07-30/results/edit-viz-learning.attempt-1.raw.json"
post_content:
  verdict: ACCEPT
  strict_valid: true
  source_hash_stable: true
  receipt: ".codex-tmp/claude-open-media-adaptation-audit-2026-07-30/results/adaptation-edit-content-post.attempt-1.raw.json"
post_viz_attempt_1:
  verdict: REVISE
  finding: "desktop evidence가 현지화 전 source이고 zone label assertion이 없다."
  receipt: ".codex-tmp/claude-open-media-adaptation-audit-2026-07-30/results/edit-viz-learning-post.attempt-1.raw.json"
post_viz_attempt_2:
  verdict: ACCEPT
  strict_valid: true
  source_hash_stable: true
  receipt: ".codex-tmp/claude-open-media-adaptation-audit-2026-07-30/results/edit-viz-learning-post.attempt-2.raw.json"
```

내용 감사의 manifest에 컴포넌트 경로를 한 단계 짧게 적어 첫
실행이 Claude 호출 전 `sha256sum` 단계에서 중단된 사례도 있었다.
경로를 고친 뒤 동일 attempt 번호로 실제 요청을 시작했다. 외부
worker 결과가 없는 로컬 패킷 오류는 ACCEPT나 REVISE 영수증으로
세지 않는다.

### 기존 테스트 계약도 함께 고친 이유

`comfyui-runtime-reconstruction.spec.ts`는 모든 ComfyUI 글이
`[data-step-viz]`를 가져야 한다고 가정했다. 새 편집 글만 이 오래된
공통화 때문에 3개 테스트가 실패했다. 편집 글은 의도적으로
`[data-edit-contract-lab]`을 쓰므로, article fixture에 visual type과
formula count를 명시했다.

```yaml
comfyui_edit_contract:
  visual: edit-contract
  formulas: 2
other_comfyui_articles:
  visual: step
```

변경 후 ComfyUI 전체 경로는 26/26 통과했다.

### 4B·9B 축소 재현 packet

4B 모델은 한 번에 한 claim이나 한 invariant만 판정한다.

```yaml
adaptation_edit_4b_packets:
  - input: [failure_condition, candidate_interventions]
    output: [smallest_sufficient_intervention, frozen_surface, changed_surface]
  - input: [source_excerpt, model_name, release_date, artifact_status]
    output: [current_pinned, released_extension, announced_watchlist, concept_floor]
  - input: [mode, strength]
    output: [active_conditions, identity, background, spill]
  - input: [formula, korean_note]
    output: [symbol_meaning_complete, causal_why_complete, raw_latex_absent]
  - input: [profile, resolution, frames]
    output: [named_compression, latent_grid, position_steps, excluded_costs]
  - input: [viewport_measurement]
    output: [overflow, clipped_label, target_size, height_delta]
```

9B integrator는 packet을 아래 reject rule로 합친다.

```yaml
adaptation_edit_9b_integrator:
  reject_if:
    - "optional Image implementation becomes a mandatory sixth shared step"
    - "a generic concept page replaces the current pinned artifact"
    - "a newer announcement is presented as a released local workflow"
    - "the visual changes only a highlighted label"
    - "comparison geometry moves between modes"
    - "compression factors are unnamed or presented as universal VRAM"
    - "formula has raw LaTeX, missing Korean semantics, or visible overflow"
    - "screenshot evidence does not match current source labels"
```

### 검증과 공개 배포

```yaml
local:
  content_and_viz_contract: "2/2 pass"
  edit_article_390_768_1440: "3/3 pass"
  shared_route_360_390_768_1440: "20/20 pass"
  authored_image_video_paths: "1/1 pass"
  comfyui_full_route: "26/26 pass"
  frontier_media_cases: "16/16 pass"
  representative_viz: "6/6 pass"
  current_source_claims: "1/1 pass"
  build_tsc_vite: pass
public:
  content_and_viz_contract: "2/2 pass"
  edit_article_390_768_1440: "3/3 pass"
  shared_route_360_390_768_1440: "20/20 pass"
  comfyui_route_and_edit: "4/4 pass"
deploy:
  service: "cm-blog.service active"
  edit_article: "https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/comfyui-edit-models-flux-qwen"
  adaptation_article: "https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/open-model-finetuning-theory"
```

이 배치의 핵심은 편집 도구 이름을 더 많이 나열한 것이 아니다.
현재 artifact 경계를 고정하고, 같은 장면에서 condition ownership과
보존 evidence가 어떻게 달라지는지 보여 주며, 공통 adaptation
판단에서 구체 구현으로 넘어가는 링크를 선택형으로 닫은 것이다.

## 2026-07-30 Stable Diffusion 최소 구현 기준선

### 왜 이 글을 유지하고 어디서 멈췄는가

현재 이미지 경로를 모두 Stable Diffusion부터 시작하게 만들지
않았다. 이 글이 독립적으로 답하는 질문은 다음 하나다.

```text
SD/SDXL 계보의 checkpoint, LoRA, ControlNet과 Illustrious를
직접 만났을 때 prompt부터 pixel까지 어느 모듈이 무엇을 소유하는가?
```

따라서 경로 역할을 다음처럼 고정했다.

```yaml
route_role:
  current_open_image_route: optional
  illustrious_route: prerequisite
  direct_sdxl_debugging: implementation_floor
historical_stop:
  paper: "High-Resolution Image Synthesis with Latent Diffusion Models"
  year: 2021
  deeper_ddpm_math: "막힐 때만 여는 JIT 보강"
```

본문 첫 부분에 `선택형 최소 구현 기준선`을 표시하고 하단 링크도
`더 아래 기반`에서 `막힐 때만 · 수학 보강`으로 바꿨다. 이로써
최신에서 시작한 독자가 과거 논문을 무한히 의무적으로 따라 내려가는
문제를 막았다.

### 원문 경계와 작성 의도

주장은 다음 원문과 현재 구현에 묶었다.

```yaml
evidence:
  ldm_2021:
    proves: [pretrained_autoencoder_latent, cross_attention_conditioning]
  sdxl_report:
    proves: [two_text_encoders, larger_unet, more_attention, refiner]
  sd3_source:
    proves: [separate_modality_weights, mmdit, rectified_flow]
  stability_sd35:
    proves: [mmdit_lineage, qk_normalization]
  diffusers_sd_pipeline:
    proves: [vae, text_encoder, tokenizer, unet, scheduler, clip_skip]
  diffusers_sd3_pipeline:
    proves: [two_clip_encoders, t5_encoder, transformer, flow_scheduler]
```

원문 스냅샷은
`.codex-tmp/stable-diffusion-baseline-sources-2026-07-30/`에
보관했다. 글의 의도는 모델 계보를 외우게 하는 것이 아니라,
모듈 경계와 tensor owner를 잡아 처음 보는 workflow도 디버깅하게
하는 것이다.

### 기존 Viz에서 실제로 측정한 문제

기존 두 StepViz는 테스트상 보이기는 했지만 학습 증거가 약했다.

```yaml
before:
  runtime:
    mobile_height_px: 891
    desktop_height_px: 740
    defect: "prompt→decode 직선만 있고 denoiser↔solver 반복이 없음"
  architecture:
    mobile_height_px: 780
    desktop_height_px: 757
    defect: "U-Net만 보여 MMDiT 전환을 같은 프레임에서 비교할 수 없음"
  desktop_effective_svg_label_px: 10.7
  other:
    - "영문 module name이 1차 레이블"
    - "큰 SVG stage 안에 작은 글자와 비어 있는 공간"
    - "모바일에서 장면 설명과 단계 목록이 중복"
```

전 증거:

```text
.codex-tmp/stable-diffusion-mobile-viz-1.png
.codex-tmp/stable-diffusion-desktop-viz-1.png
.codex-tmp/stable-diffusion-mobile-viz-2.png
.codex-tmp/stable-diffusion-desktop-viz-2.png
```

### 런타임 Viz를 어떻게 다시 추론했는가

생성 pipeline은 직선이 아니다. 조건은 반복 바깥에서 만들어지고,
현재 latent를 denoiser가 읽고 solver가 갱신한 뒤 그 결과가 다시
denoiser 입력으로 돌아간다. 이를 고정 실행 계약으로 만들었다.

```yaml
runtime_contract:
  fixed_nodes:
    - text_condition
    - current_latent
    - denoiser_prediction
    - scheduler_solver_update
    - vae_decode
  explicit_loop: "z_t-1 -> next denoiser input"
  per_phase_evidence:
    - current_owner
    - observed_tensor
    - changed_variable
    - held_constant
```

단계를 눌렀을 때 색만 바뀌지 않는다. `data-phase`, 현재 책임,
관찰 tensor, 바뀌는 것과 고정 비교값이 함께 바뀐다. 반대로
node geometry와 전체 높이는 유지된다.

### 아키텍처 Viz를 어떻게 다시 추론했는가

U-Net 그림과 MMDiT 그림을 따로 두면 학습자는 차이를 기억으로
맞춰야 한다. 그래서 두 구조를 동일한 다섯 슬롯에 넣었다.

```yaml
architecture_slots:
  - 공간 표현
  - 지역 정보
  - 먼 위치 관계
  - 문장 조건
  - 세부·적응 경로
unet_sdxl:
  backbone: "다중 해상도 feature map + down/middle/up"
  condition: "cross-attention"
  detail_return: "skip connection"
mmdit_sd3:
  backbone: "latent patch token + residual stream"
  condition: "joint attention with modality-specific weights"
  adaptation: "projection, attention and MLP target 재선정"
```

한국어가 1차 레이블이고 영문은 논문·코드 검색을 위한 2차
표현으로 내렸다. 모바일은 2열, 데스크톱은 5열이며 마지막 슬롯만
모바일에서 2열을 차지한다. SVG diagram은 제거하고 Lucide icon만
남겼다.

최종 locator 증거:

```text
.codex-tmp/stable-diffusion-after-mobile-runtime.png
.codex-tmp/stable-diffusion-after-desktop-runtime.png
.codex-tmp/stable-diffusion-after-mobile-architecture.png
.codex-tmp/stable-diffusion-after-desktop-architecture.png
```

최종 선택 상태 높이는 runtime이 mobile 1295.9px, desktop 656px,
architecture가 mobile 1129.9px, desktop 533px다. 모바일 runtime은
반복 node와 네 evidence field를 축소하지 않고 세로로 읽게 해
기존보다 길어졌지만 내부·가로 scrollbar는 없다. architecture는
정보를 키우면서도 기존 mobile 대비 약 350px, desktop 대비 약
224px 줄었다. 두 Viz 모두 모든 상태에서 높이 변화가 2px 이하다.

### 내부 transfer 문제

본문에 시험 문제를 나열하지 않고 다음 문제를 풀 수 있는지로
깊이를 검사했다.

```yaml
hidden_transfer_checks:
  - "Denoiser output과 scheduler output을 같은 tensor로 오해하지 않고 한 step을 재구성할 수 있는가?"
  - "Prompt condition은 반복 loop의 어디에서 만들어지고 각 denoising step에서 어떻게 재사용되는가?"
  - "해상도 512→1024에서 latent position, convolution, cross-attention, dense self-attention 비용 증가를 각각 구분하는가?"
  - "SDXL LoRA target과 strength를 SD3 MMDiT에 그대로 복사하면 안 되는 구조적 이유를 설명하는가?"
  - "ControlNet, IP-Adapter, inpaint가 input, residual, attention 중 어느 경로에 개입하는지 찾는가?"
  - "현재 Image 경로에서는 이 글을 건너뛰되 Illustrious 경로에서는 왜 선행으로 여는지 판단하는가?"
```

### Claude 감사와 strict 영수증

Context Manager worker 두 개를 병렬 실행했다. 1차 감사의 지적은
정확히 구현 계약으로 옮겼다.

```yaml
pre_content:
  verdict: REVISE
  findings:
    - "더 아래 기반 링크가 무한 역사 하강으로 읽힘"
    - "runtime에서 denoiser-solver 반복이 보이지 않음"
  receipt: ".codex-tmp/claude-stable-diffusion-baseline-audit-2026-07-30/results/baseline-content-source-ia.attempt-1.raw.json"
pre_viz:
  verdict: REVISE
  findings:
    - "effective label 12px 미만"
    - "MMDiT 비교 부재"
    - "runtime loop 부재"
    - "영문 primary label"
  receipt: ".codex-tmp/claude-stable-diffusion-baseline-audit-2026-07-30/results/baseline-viz-learning.attempt-1.raw.json"
post_content:
  verdict: ACCEPT
  strict_valid: true
  source_hash_stable: true
  receipt: ".codex-tmp/claude-stable-diffusion-baseline-audit-2026-07-30/results/baseline-content-source-ia-post.attempt-1.raw.json"
post_viz:
  verdict: ACCEPT
  strict_valid: true
  source_hash_stable: true
  receipt: ".codex-tmp/claude-stable-diffusion-baseline-audit-2026-07-30/results/baseline-viz-learning-post.attempt-1.raw.json"
```

두 post 결과 모두 HTTP 200, exact worker
`claude-code:sonnet`, inner attempt 성공, 120자 초과, 첫 비어 있지
않은 줄의 단일 `ACCEPT`, source hash 안정 조건을 통과했다.

### 4B·9B 축소 재현 packet

4B 모델은 긴 글 전체를 한 번에 평가하지 않고 한 경계만 판정한다.

```yaml
stable_diffusion_4b_packets:
  - input: [article_role, parent_route, dependent_route]
    output: [mandatory, optional, prerequisite, stop_rule]
  - input: [module_state]
    output: [owner, input_tensor, output_tensor, changed, invariant]
  - input: [architecture_slot, unet_claim, mmdit_claim]
    output: [same_question, structural_difference, transfer_risk]
  - input: [claim, primary_source_excerpt]
    output: [supported, qualified, unsupported]
  - input: [formula, korean_note]
    output: [rendered, symbols_complete, intuition_complete, overflow]
  - input: [viewport, lab_state]
    output: [height, height_delta, min_font, min_control, horizontal_overflow]
```

9B integrator는 packet을 합치되 다음 조건이면 거부한다.

```yaml
stable_diffusion_9b_integrator:
  reject_if:
    - "optional implementation floor is promoted into the mandatory current route"
    - "historical descent below LDM 2021 is mandatory"
    - "runtime is a one-way arrow with no denoiser-solver return loop"
    - "architecture visual shows U-Net but omits MMDiT in the same slots"
    - "English is the primary label or effective label is under 12px"
    - "state changes only a highlight and not owner/tensor/change/invariant evidence"
    - "comparison geometry moves by more than 2px"
    - "formula is raw, lacks Korean semantics, or visibly overflows"
    - "claim has no primary-source boundary"
```

### 검증과 공개 배포

```yaml
local:
  stable_baseline_contract_390_768_1440: "3/3 pass"
  stable_learning_flow_390_768_1440: "3/3 pass"
  stable_formula_continuity: "2/2 pass"
  frontier_media_cases: "16/16 pass"
  authored_open_media_route: "1/1 pass"
  representative_viz: "6/6 pass"
  build_tsc_vite: pass
public:
  stable_baseline_contract_390_768_1440: "3/3 pass"
  stable_learning_flow_390_768_1440: "3/3 pass"
  stable_formula_continuity: "2/2 pass"
  authored_open_media_route: "1/1 pass"
deploy:
  service: "cm-blog.service active"
  article: "https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/stable-diffusion-open-models"
```

이 배치의 핵심은 오래된 논문을 더 많이 보이게 한 것이 아니다.
현재 경로에서는 건너뛸 수 있는 유한한 기준선을 만들고, 직접
내려왔을 때에는 한 step의 tensor 책임과 U-Net→MMDiT 전환을
같은 비교 문법으로 읽을 수 있게 만든 것이다.

## 2026-07-30 LTX-2.3 2D 애니메이션 최소 적응 실험

### 왜 이 글을 다음 대상으로 골랐는가

`ltx-animation-project`는 open media 경로에서 모델 설명을 실제
적응 실험으로 넘기는 첫 사례다. 이전 본문은 모델 이름과 권장
clip 수를 나열했지만, 현재 checkpoint·manifest·precompute·LoRA
target·검증·license 중 어느 것도 실행 계약으로 닫지 못했다.
따라서 더 많은 모델을 추가하기 전에 다음 질문을 소유하게 했다.

> 작은 2D 애니메이션 failure 하나를 현재 LTX-2.3 weight에
> 적응시킬 때, 무엇을 고정하고 무엇을 바꾸며 어떤 증거가
> release를 막는가?

이 글은 shot contract를 다시 설명하지 않는다.
`animation-production-workflow`가 제작 경계를 소유하고, 이 글은
그 경계가 정해진 뒤의 trainer 실행과 paired evidence만 소유한다.

### 소스 경계

2026-07-08에 확인한 공식 저장소 revision을 고정했다.

```yaml
source_revision: 9377758131b1ffde4b7f766804590a6617bf2ab9
snapshots:
  - .codex-tmp/ltx-animation-project-sources-2026-07-30/main-commit.json
  - .codex-tmp/ltx-animation-project-sources-2026-07-30/quick-start.md
  - .codex-tmp/ltx-animation-project-sources-2026-07-30/dataset-preparation.md
  - .codex-tmp/ltx-animation-project-sources-2026-07-30/configuration-reference.md
  - .codex-tmp/ltx-animation-project-sources-2026-07-30/t2v_lora.yaml
  - .codex-tmp/ltx-animation-project-sources-2026-07-30/t2v_lora_low_vram.yaml
  - .codex-tmp/ltx-animation-project-sources-2026-07-30/LICENSE
current_artifact: ltx-2.3-22b-dev.safetensors
text_encoder: gemma-3-12b-it-qat-q4_0-unquantized
```

공식 trainer 사실과 이 글이 추가한 production 규칙을 섞지 않았다.
`video`, `audio`, `caption`, `reference_video`,
`reference_audio`는 trainer column이고, `source_group`,
`shot_id`, `rights_record`, `split`은 leakage와 권리를 막기 위해
article이 추가한 manifest contract다. 576×576×49는 “32GB에서
항상 된다”가 아니라 low-VRAM wiring smoke test의 공식 출발점으로
한정했다.

License는 adapter도 derivative가 될 수 있음, 연 매출 1,000만
달러 이상 commercial entity의 paid license 조건, competing model
학습·개선 제한을 release gate에 포함했다.

### 본문을 어떻게 재구성했는가

모델 목록과 추상 workflow를 다음 다섯 milestone으로 교체했다.

```yaml
milestones:
  - "failure 하나와 실험 경계를 먼저 고정"
  - "manifest → precompute와 sequence 비용 계산"
  - "LoRA target module과 effective batch 해석"
  - "같은 prompt·seed·runtime의 paired validation"
  - "adapter·evidence·rights·runtime receipt로 release 닫기"
```

네 display formula는 모두 한국어 `underbrace`와 바로 아래
`FormulaNote`를 가진다.

```yaml
formula_roles:
  sequence_length: "공간 latent × 시간 latent"
  lora_update: "고정 base weight + 학습하는 저랭크 변화"
  effective_batch: "GPU당 sample × accumulation × GPU 수"
  paired_delta: "같은 fixture에서 LoRA - Base"
```

### 내부 transfer 문제

문제를 본문에 시험처럼 노출하지 않고, 완성된 글만 읽은 사람이
다음을 풀 수 있는지로 깊이를 검사했다.

```yaml
hidden_transfer_checks:
  - "576×576×49와 ×89가 각각 2,268·3,888 sequence가 되는 이유를 계산하되 runtime을 단정하지 않는가?"
  - "목표 선화 점수는 올랐지만 unseen identity gate가 실패하면 release를 막는가?"
  - "인접 shot이 train/validation에 갈라졌을 때 source-group leakage를 찾아내는가?"
  - "공식 low-VRAM 예제를 모든 32GB 장비의 보장으로 오해하지 않는가?"
  - "연매출 1,200만 달러 회사의 adapter 배포 전에 license 검토를 요구하는가?"
  - "LoRA가 실패했다는 이유만으로 full tuning에 바로 올라가지 않고 가장 작은 correction을 선택하는가?"
```

### Viz를 어떻게 다시 추론했는가

기존 720×330 SVG와 reveal-only stepper를 제거하고 두 개의
고정 geometry HTML lab으로 분리했다.

```yaml
training_run_lab:
  manipulated_variables:
    - "49 frame 절약형 ↔ 89 frame 표준 예제"
    - "version → manifest → precompute → train → validate → release"
  changed_evidence:
    - "sequence token·latent shape·rank·alpha·memory"
    - "owner·input·artifact·invariant·evidence"
  invariant:
    - "여섯 상태의 외곽 높이 delta <= 2px"
paired_evaluation_lab:
  manipulated_variable:
    - "선화 개선 ↔ 외운 듯한 결과 ↔ 오디오 회귀"
  changed_evidence:
    - "목표·identity·motion·audio의 Base/LoRA delta와 gate"
    - "release verdict와 다음 최소 수정"
  invariant:
    - "prompt·seed·bucket·sampler 고정"
```

모바일은 stage를 3열로 유지해 한 번에 전체 순서를 보되, 각
버튼을 44px 이상으로 만들었다. 모든 핵심 label은 12px 이상이고
Lucide 이외 SVG는 없다. 최종 locator 증거:

```text
.codex-tmp/ltx-run-after-mobile.png
.codex-tmp/ltx-run-after-desktop.png
.codex-tmp/ltx-eval-after-mobile.png
.codex-tmp/ltx-eval-after-desktop.png
```

### Claude 감사와 strict 영수증

첫 감사의 지적을 그대로 구현 계약으로 옮겼다.

```yaml
pre_content:
  verdict: REVISE
  findings:
    - "현재 실행 계약과 정확한 checkpoint 부재"
    - "근거 없는 clip·rank 숫자"
    - "license 경계 부재"
pre_viz:
  verdict: REVISE
  findings:
    - "tiny SVG와 영문 primary label"
    - "상태가 원인·증거를 바꾸지 않는 reveal-only 구성"
post_content:
  verdict: ACCEPT
  strict_valid: true
  source_hash_stable: true
  receipt: ".codex-tmp/claude-ltx-animation-project-audit-2026-07-30/results/ltx-content-source-boundary-post.attempt-1.raw.json"
post_viz_attempt_1:
  verdict: REVISE
  finding: "11px label 11곳"
post_viz_attempt_2:
  verdict: ACCEPT
  accepted: false
  reason: "감사 중 after screenshot이 갱신돼 source hash가 바뀜"
post_viz_attempt_3:
  verdict: ACCEPT
  strict_valid: true
  source_hash_stable: true
  receipt: ".codex-tmp/claude-ltx-animation-project-audit-2026-07-30/results/ltx-viz-learning-contract-post.attempt-3.raw.json"
```

`attempt_2`는 내용상 ACCEPT였지만 영수증 규칙상 폐기했다. 최종
content와 Viz 결과는 HTTP 200, exact worker
`claude-code:sonnet`, inner attempt 성공, 120자 초과, 단일
`ACCEPT`, 고정 source hash를 모두 만족한다.

### Context Manager 실패 복구

이전 raw 실패를 현재 소스와 대조해, 이미 후속 strict receipt로
대체됐거나 소스가 폐기된 항목을 제외하고 현재 살아 있는 다섯
경계를 최대 두 worker씩 재투입했다.

```yaml
recovery_queue: .codex-tmp/claude-missed-revalidation-current-2026-07-30
strict_accept:
  - frontier-video-model-lineage-current
  - permissions-source-wiring-current
  - file-ops-source-wiring-current
  - bash-source-wiring-current
reopened:
  - edit-viz-learning-current
```

앞의 네 결과는 모두 source hash가 고정된 strict ACCEPT다.
`edit-viz-learning-current`는 첫 재시도가 빈 응답이어서 폐기했고,
두 번째 정상 응답이 고정된 변경 영역, reference 수 표현,
44px range target, 현재 screenshot 부재를 찾아 REVISE했다. 이
결과는 “재호출 성공”만 세지 않고 실제 발견을 다시 구현으로
되돌리는 사례로 남긴다.

후속 감사도 발견이 없어질 때까지 계속했다.

```yaml
edit_viz_recovery:
  attempt_1:
    verdict: invalid
    reason: "HTTP 200이지만 result가 비어 있음"
  attempt_2:
    verdict: REVISE
    fixes:
      - "모드별 전체 frame/mask/semantic/reference 변경 범위"
      - "reference 1개와 3개의 실제 도형 차이"
      - "range 입력 44px"
      - "모든 학습 label 12px 이상"
      - "현재 mobile screenshot"
  attempt_3:
    verdict: REVISE
    fixes:
      - "변형 위험을 안전색으로 보이던 상태색"
      - "mask 범위 label 최소 읽기 폭"
      - "mobile reference 3개 clipping"
  attempt_4:
    verdict: REVISE
    fixes:
      - "identity/background 정성 판정을 정량 gate와 동일하게 계산"
      - "바깥 폭은 공간 범위, 안쪽 fill은 strength 변화량으로 분리"
      - "mobile multi-reference와 desktop mask 현재 screenshot"
  attempt_5:
    verdict: ACCEPT
    strict_valid: true
    source_hash_stable: true
    receipt: ".codex-tmp/claude-missed-revalidation-current-2026-07-30/results/edit-viz-learning-current.attempt-5.raw.json"
```

최종 복구 큐 다섯 항목은 모두 exact worker
`claude-code:sonnet`, 단일 ACCEPT, inner attempt 성공, 120자 초과,
고정 source hash 조건을 만족했다. Edit Viz에는 다음 재발 방지
계약도 추가했다.

```yaml
edit_viz_tests:
  - "네 mode의 외곽 높이 delta <= 2px"
  - "latent 전체 frame과 mask 안쪽을 텍스트로 구분"
  - "multi-reference 원 3개가 frame 안에 존재"
  - "strength 증가 시 inner change fill 증가"
  - "identity >= 82와 정성 통과/주의가 같은 판정"
  - "min font >= 12px, slider >= 44px, horizontal overflow <= 1px"
  - "390/768/1440 responsive route"
```

### 4B·9B 축소 재현 packet

4B 모델은 글 전체를 생성하지 않고 한 판단 단위만 처리한다.

```yaml
ltx_4b_packets:
  - input: [failure_fixture, shot_contract]
    output: [single_target, preserved_axes, hard_gates]
  - input: [official_column, article_added_field]
    output: [owner, required, leakage_or_rights_reason]
  - input: [height, width, frames]
    output: [latent_shape, sequence_length, no_runtime_claim]
  - input: [config_pair]
    output: [rank, alpha, optimizer, precision, validation_delta]
  - input: [target_module_pattern]
    output: [matched_branch, intended_change, regression_risk]
  - input: [paired_scores]
    output: [target_delta, retention_delta, release_or_block, next_correction]
  - input: [license_excerpt, company_context]
    output: [derivative, commercial_review, competing_model_constraint]
  - input: [viewport, state]
    output: [height_delta, min_font, min_control, overflow]
```

9B integrator는 packet을 다섯 milestone으로 합치되 다음 조건이면
거부한다.

```yaml
ltx_9b_integrator:
  reject_if:
    - "model gallery or generic workflow replaces an executable contract"
    - "article-added production policy is attributed to the trainer"
    - "49-frame low-VRAM example is promoted into a universal 32GB guarantee"
    - "target improvement hides identity, motion, audio, runtime or rights failure"
    - "failed LoRA automatically escalates to full tuning"
    - "fixture scores are presented as an LTX-2.3 benchmark"
    - "English is the primary label or any learning label is below 12px"
    - "state changes only color and not owner/input/artifact/evidence"
    - "source revision or license boundary is missing"
```

### 로컬 검증

```yaml
ltx_contract_390_768_1440: "3/3 pass"
ltx_production_handoff: "1/1 pass"
frontier_media_regression: pass
build_tsc_vite: pass
broad_batch:
  passed: 95
  unrelated_existing_failures:
    - "llm-data-engine mobile-360 formula width"
    - "rag-pipeline mobile-360 formula width"
    - "rag-pipeline mobile-390 formula width"
public:
  ltx_contract_390_768_1440: "3/3 pass"
  comfyui_edit_causal_mobile: "1/1 pass"
deploy:
  service: "cm-blog.service active"
  ltx_article: "https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/ltx-animation-project"
  edit_article: "https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/comfyui-edit-models-flux-qwen"
```

이 배치의 핵심은 “LTX로 애니메이션을 만든다”가 아니다. 현재
artifact에서 하나의 failure를 재현하고, 가장 작은 변경을 넣고,
같은 조건의 반증 fixture와 권리·runtime gate까지 통과해야만
release한다는 판단 순서를 학습 경로에 넣은 것이다.

## 2026-07-30 모바일 수식 overflow 후속 폐쇄

위 `broad_batch`에서 남긴 세 실패는 식을 무작정 축소하지 않고
실제 계산 순서로 분해해 닫았다.

```yaml
closed_failures:
  - "llm-data-engine mobile-360 formula width"
  - "rag-pipeline mobile-360 formula width"
  - "rag-pipeline mobile-390 formula width"
method:
  data_distribution:
    before: "정규화까지 한 줄에 담은 긴 학습 분포 식"
    after:
      - "정규화 전 비중 p_tilde(d)"
      - "전체 합 Z"
      - "실제 학습 분포 p_train(d)=p_tilde(d)/Z"
  bm25:
    before: "길이 보정·빈도 포화·희귀도 가중을 한 줄에 담은 식"
    after:
      - "문서 길이 보정 n_d"
      - "포화된 용어 기여 g(t,d)"
      - "BM25=sum IDF(t)g(t,d)"
  language:
    - "선택 점수"
    - "영역별 비중"
    - "포화된 용어 기여"
    - "희귀 용어 중요도"
```

분해 뒤에도 원래 식과 동치인지 별도 검증했다. 두 Claude 작업은
동시에 실행했고, HTTP 200, `claude-code:sonnet`, inner attempt
성공, 단일 verdict, 120자 초과, 고정 source hash 조건을 모두
만족한 strict ACCEPT다.

```yaml
claude_formula_receipts:
  data_engine:
    verdict: ACCEPT
    receipt: ".codex-tmp/claude-formula-overflow-repair-2026-07-30/results/data-engine-train-distribution-formula.attempt-1.raw.json"
  rag_bm25:
    verdict: ACCEPT
    receipt: ".codex-tmp/claude-formula-overflow-repair-2026-07-30/results/rag-bm25-factorized-formula.attempt-1.raw.json"
local_viewports:
  routes: [llm-data-engine, rag-pipeline]
  widths: [360, 390, 768, 1440]
  result: "8/8 pass"
public_viewports:
  base: "https://heru.ragdoll-bigeye.ts.net"
  routes: [llm-data-engine, rag-pipeline]
  widths: [360, 390, 768, 1440]
  result: "8/8 pass"
screenshots:
  - ".codex-tmp/llm-data-engine-formula-mobile360.png"
  - ".codex-tmp/rag-bm25-formula-mobile360.png"
```

4B 모델은 `긴 식을 줄여라`가 아니라 다음 한 가지 판정만 맡는다.

```yaml
formula_4b_packet:
  input: [original_formula, semantic_terms, container_width]
  output:
    - "계산 순서대로 나눈 중간 변수"
    - "각 항의 한국어 역할"
    - "원래 식에 다시 대입했을 때의 동치성"
    - "rendered KaTeX width와 minimum font size"
```

9B 통합기는 식이 짧아졌다는 사실만으로 통과시키지 않는다.
중간 변수를 원래 식에 대입했을 때 동치여야 하고, 한글 역할
주석이 남아 있어야 하며, 360/390/768/1440에서 실제 KaTeX 폭이
컨테이너를 넘지 않아야 한다.

## 2026-07-30 하위 아티클 내비게이션 의미 재구성

### 발견한 문제

이전 CategoryPage는 `children`이 있으면 모두 같은 UI로 렌더했다.
그래서 다음 세 종류가 “각 행은 독립된 목표”라는 한 문장 아래
섞였다.

```yaml
mixed_semantics:
  choice:
    example: "Agent의 Runtime·도구·coordination·안전 중 현재 책임 하나"
  sequence:
    example: "Robot perception → planning → runtime → actuator → qualification"
  catalog:
    example: "Open media 공통 경로·선택 기준선·현재 모델 사례"
```

또한 모든 자식 목록이 current-first research route보다 먼저 나와
Robot·OCR·Open Media에서도 최신 목표와 최소 원문을 보기 전에
긴 목록을 먼저 해석해야 했다. 초기 Claude 두 감사가 이 문제를
strict REVISE로 확인했다.

```yaml
pre_audit:
  queue: ".codex-tmp/claude-category-child-semantics-2026-07-30"
  findings:
    - "Robot의 순차 실행 계층을 독립 선택지로 오표현"
    - "Open Media의 공통 경로·선택 기준선·모델 사례를 평탄화"
    - "Agents를 제외한 route-before-list 역전"
    - "연구 읽기 번호와 실행 계층 번호의 의미 구분 부족"
```

### 구현 판단

URL과 아티클 소유권은 유지하고 `Subcategory.childNavigation`에
내비게이션 의미만 추가했다.

```yaml
child_navigation_contract:
  choice:
    placement: before-track
    route_usage: shared-reference
    instruction: "현재 실패 책임 하나를 먼저 선택"
  sequence:
    placement: after-track
    route_usage: primary-path
    instruction: "현재 연구 경로를 읽은 뒤 실행 책임을 순서대로 진행"
  catalog:
    placement: after-track
    route_usage: primary-path
    instruction: "공통 경로·선택 기반·문제별 사례를 역할별로 탐색"
```

Open Media catalog는 다음 네 그룹으로 나눴다.

```yaml
open_media_groups:
  common:
    visible: true
    items: [목표에서 제작까지, Workflow 실행·재현]
  optional:
    visible: true
    items: [Stable Diffusion 기준 Runtime]
  image_cases:
    collapsed: true
    items: [Krea, Z-Image, Ideogram, Illustrious]
  video_production_cases:
    collapsed: true
    items: [LTX, Wan, 2D Animation]
```

순차 목록은 research route의 `01–05`와 혼동하지 않도록 원래
`NN · 제목`에서 번호를 분리해 `실행 단계 NN` eyebrow와 번호가
제거된 제목으로 렌더한다. Claw Code의 다섯 이름만 구분자가
달라 번호가 중복된다는 Claude P1을 받아 모든 이름을 같은
`NN · 제목` 형식으로 정규화했다.

### 검증과 수정 반복

```yaml
post_audit:
  queue: ".codex-tmp/claude-category-child-semantics-post-2026-07-30"
  open_media:
    attempt_1: ACCEPT
    receipt: "results/open-media-progressive-disclosure-post.attempt-1.raw.json"
  global_semantics:
    attempt_1:
      verdict: REVISE
      fixes:
        - "Claw Code 번호 구분자 정규화"
        - "OCR·LLM Data·Speech DOM 순서 계약"
    attempt_2:
      verdict: REVISE
      fix: "LLM 순차 허브 전체와 Vision·RL catalog 순서 계약"
    attempt_3: ACCEPT
    receipt: "results/child-semantics-route-order-post.attempt-3.raw.json"
  strict_conditions:
    - "HTTP 200"
    - "claude-code:sonnet"
    - "inner attempt success"
    - "single ACCEPT/REVISE"
    - "120자 초과"
    - "ACCEPT와 P0/P1/P2 모순 없음"
    - "source hash stable"
```

Playwright는 390·1440에서 다음을 직접 고정한다.

```yaml
navigation_tests:
  choice:
    hubs: [Agents, Speech]
    assertion: "navigation before route, shared-reference"
  sequence:
    hubs:
      - Robot
      - OCR
      - LLM Data
      - LLM Architecture
      - LLM Post-training
      - LLM Interpretability
      - On-device Efficiency
      - LLM Serving
    assertion: "route before navigation, primary-path"
  catalog:
    hubs: [Open Media, Vision, Reinforcement Learning]
    assertion: "route before navigation, role groups and initial collapse"
  regression:
    - "Claw Code 카드 제목에 숫자 prefix 중복 없음"
    - "모든 대상의 element/document horizontal overflow <= 1px"
```

스크린샷은 다음 파일에 고정했다.

```yaml
screenshots:
  - ".codex-tmp/category-semantics-robot-mobile390.png"
  - ".codex-tmp/category-semantics-agents-mobile390.png"
  - ".codex-tmp/category-semantics-open-media-mobile390.png"
  - ".codex-tmp/category-semantics-open-media-desktop1440.png"
```

### 4B 작업 packet

작은 모델에는 전체 사이드바를 재설계시키지 않고 한 하위 목록의
의미 판정만 맡긴다.

```yaml
child_navigation_4b_packet:
  input:
    - "parent goal"
    - "child title and one-line responsibility"
    - "current-first research route presence"
  output:
    semantic_mode: "choice | sequence | catalog"
    placement: "before-track | after-track"
    groups:
      - "common | optional | case"
    collapse:
      - "true only for conditional case collections"
    evidence:
      - "왜 하나를 고르는가, 왜 순서대로 읽는가, 왜 필요할 때만 여는가"
```

### 9B 통합 규칙

```yaml
child_navigation_9b_integrator:
  reject_if:
    - "모든 children을 독립 분기로 표현"
    - "순차 실행 계층이 current-first route보다 먼저 등장"
    - "case catalog가 기본으로 모두 펼쳐짐"
    - "공통 경로와 optional historical floor가 같은 중요도로 보임"
    - "연구 읽기 번호와 실행 계층 번호가 같은 label과 style을 사용"
    - "URL 또는 기존 article ownership을 불필요하게 변경"
    - "390/1440에서 DOM 순서, route usage, overflow test가 없음"
```

이 변경의 핵심은 목록을 예쁘게 바꾼 것이 아니라, 학습자가
지금 해야 할 행동을 `하나 선택`, `순서대로 진행`, `필요한 사례만
탐색` 중 하나로 오해 없이 결정하게 만든 것이다.

```yaml
final_verification:
  build_tsc_vite: pass
  local_semantic_contracts: "14/14 pass"
  public_semantic_contracts: "14/14 pass"
  public_http:
    blog_root: 200
    robot_ai: 200
    open_media: 200
    agents: 200
  service: "cm-blog.service active"
  public_screenshot: ".codex-tmp/category-semantics-open-media-public-mobile390.png"
  deployment: "https://heru.ragdoll-bigeye.ts.net/lab/blog/"
```

## 2026-07-30 · 아티클 내부 학습 연결 전수 감사

### 문제 정의

사이드바와 category route가 정리되어도 아티클 본문 끝에서 다음 질문이
열리지 않으면 학습자는 다시 목록으로 돌아가 제목만 비교하게 된다.
이번 감사는 각 글을 다음 세 출력으로 판정했다.

```yaml
article_learning_contract:
  output: "이 글을 읽고 손에 남는 계산·artifact·판정"
  unresolved_question: "그 출력만으로 아직 답하지 못하는 바로 다음 질문"
  minimum_floor: "그 질문에서 막힐 때만 내려갈 최소 개념"
  reject:
    - "자동 이전·다음 article 순서 복제"
    - "일반적인 관련 글 목록"
    - "모든 분야를 하나의 선형 연대기로 강제"
    - "최신 목표와 무관한 과거 논문 무한 추적"
```

### 감사기 수정과 결과

`scripts/audit-learning-flow.mjs`가 이미 쓰고 있는
`Router`, `Ledger` suffix를 visual component로 인식하지 못해
`open-image-video-models`, `sulphur-2`를 false positive로 잡던 부분을
수정했다. `LearningHandoff`도 본문 outgoing connection으로 인식하게
했다.

```yaml
audit_progress:
  registered_articles: 304
  initial_enrichment_backlog: 30
  after_false_positive_and_prerequisite_fix: 24
  after_robot_connections: 17
  after_rl_connections: 11
  final:
    release_blockers: 0
    review_needed: 0
    enrichment_backlog: 0
    formula_gaps: 0
    table_first: 0
    missing_prerequisites: 0
    local_connection_backlog: 0
    global_continuity_coverage: 304
```

추가 prerequisite는 다음 네 글에만 최소한으로 고정했다.

```yaml
prerequisite_repairs:
  - image-classification-pipeline
  - multiview-fusion
  - deepfake-detection
  - video-understanding
```

### 본문 연결 구현

`ArticleLearning.tsx`에 `LearningHandoff`를 추가했다. 링크 label은
`막히면`, `이어 읽기`, `적용하기`, `원문으로` 네 역할만 허용하고,
각 행은 목적지보다 먼저 이동 이유를 설명한다.

```yaml
connected_domains:
  robot:
    articles: 7
    causal_chain:
      - "camera metric observation → scene construction"
      - "SLAM frame·revision → scene rebase·runtime"
      - "kinematics → collision-free planning"
      - "path → trajectory → feedback control"
      - "control timing → ROS 2 → embedded real-time → qualification"
  reinforcement_learning:
    articles: 6
    causal_chain:
      - "Bellman expectation → sampled TD/Q target"
      - "Markov 반례 → belief 또는 learned state"
      - "fixed dataset support → OPE·ESS"
      - "learned dynamics exploitation → constraint budget·runtime shield·physical safety case"
  knowledge_and_math:
    articles: 5
    causal_chain:
      - "source locator → claim graph → version diff·promotion"
      - "singular direction·conditioning → curvature → robot·backprop·safe-RL 적용"
  generative_compression_vision:
    articles: 6
    causal_chain:
      - "생성 공통 질문 → VAE | GAN | Diffusion 선택 분기"
      - "compression algorithm → packed artifact → runtime operator → kernel → device measurement"
      - "deformable attention 기반 | detection 계약 | mask·tracking 확장"
```

### Context Manager · Claude 복구 검증

첫 RL 전체 pre-audit는 HTTP 200이었지만 worker가 timeout되어
`result=""`, `.ok=false`였고 유효 판정으로 세지 않았다. 다음
data/model/safety pre-audit는 Claude가 첫 줄 verdict 규약을 어겨
`strict_valid=false`였으므로 역시 세지 않았다. 범위를 나눠 수정·사후
검증한 뒤, 마지막에 원래 무효 범위 전체를 다시 통합 감사했다.

```yaml
claude_queue: ".codex-tmp/claude-learning-connections-2026-07-30"
invalid_results:
  rl_connection_map_pre:
    reason: "worker timeout, empty result"
    accepted_as_evidence: false
  rl_data_model_safety_pre:
    reason: "first line verdict protocol violation"
    accepted_as_evidence: false
valid_post_results:
  robot_connection_map: ACCEPT
  rl_foundation_state_map: ACCEPT
  rl_data_model_safety_map:
    attempt_1: REVISE
    correction: "world-model exploitation과 runtime·physical safety 경계를 직접 연결"
    attempt_2: ACCEPT
  knowledge_math_connection_map: ACCEPT
  generative_compression_vision_connection_map: ACCEPT
  rl_invalid_audit_recovery: ACCEPT
strict_gate:
  - "HTTP 200"
  - "worker claude-code:sonnet"
  - "inner attempt ok"
  - "첫 비어 있지 않은 줄 ACCEPT 또는 REVISE"
  - "독립 verdict 한 줄만 존재"
  - "120자 초과 근거"
  - "ACCEPT와 P0/P1/P2 heading 모순 없음"
  - "감사 전후 source hash 불변"
```

### 4B 작업 packet

작은 모델에는 전체 curriculum을 맡기지 않고 한 글의 handoff 후보만
추출하게 한다.

```yaml
learning_handoff_4b_packet:
  input:
    - "article learning question"
    - "본문의 마지막 capability check"
    - "이 글이 실제로 만든 식·artifact·판정"
    - "등록된 candidate slug와 한 줄 responsibility"
  output:
    article_output: "한 문장"
    unresolved_question: "한 문장"
    minimum_floor:
      slug: "0 또는 1개"
      reason: "현재 막힘과 직접 연결"
    next_or_apply:
      - "최대 2개"
    reject_reason:
      - "등록 순서 복제 여부"
      - "일반 관련성만 있는지"
```

### 9B 통합 규칙

```yaml
learning_handoff_9b_integrator:
  verify:
    - "destination article ownership과 reason이 일치"
    - "막히면은 실제 prerequisite, 이어 읽기는 unresolved question"
    - "적용하기는 현재 산출물을 소비하는 downstream"
    - "선택형 분야를 강제 선형 sequence로 만들지 않음"
    - "current-first finite stop 유지"
    - "source·formula·runtime 경계를 과장하지 않음"
    - "390/1440에서 link count·핵심 이유·overflow 검증"
  reject_if:
    - "제목만 다른 관련 글 모음"
    - "양방향 링크만 있고 각 방향의 이유가 같음"
    - "본문에 없는 인과를 링크가 새로 주장"
    - "존재하지 않거나 숨겨진 최소 기반 아래로 무한 하강"
```

### 검증 영수증

```yaml
verification:
  audit:
    command: "LEARNING_FLOW_CATEGORY=ai npm run audit:learning-flow"
    result: "304/304 continuity, all backlog and blockers zero"
  typescript:
    command: "npx tsc --noEmit --pretty false"
    result: pass
  playwright:
    file: "tests/learning-handoff-continuity.spec.ts"
    viewports: [390x844, 1440x900]
    pages:
      robot_rl_samples: 5
      remaining_connections: 11
    result: "4/4 pass"
  screenshots:
    - ".codex-tmp/learning-handoff-knowledge-mobile390.png"
    - ".codex-tmp/learning-handoff-knowledge-detail-mobile390.png"
    - ".codex-tmp/learning-handoff-quantization-desktop1440.png"
    - ".codex-tmp/learning-handoff-quantization-detail-desktop1440.png"
  build:
    command: "npm run build:tsc"
    result: pass
    note: "기존 large chunk warning만 남음"
  deployment:
    service: "cm-blog.service active"
    url: "https://heru.ragdoll-bigeye.ts.net/lab/blog/"
    public_http:
      knowledge_source_ingestion: 200
      quantization: 200
    public_playwright:
      result: "4/4 pass"
```

## 2026-07-30 · 다음 감사: Open Media 실행 계약과 전역 Viz 폭

### 감사 순서

이번 묶음은 글 수를 먼저 늘리지 않고 세 가지 전역 감사를 병렬로
수행했다.

```yaml
next_batch_discovery:
  narrative:
    routes: 304
    checks: 608
    errors: 0
    warnings: 0
  mastery_coverage:
    tracks: 19
    article_references: 196
    weak_references: 0
    audit_repairs:
      - "Rebuilt re-export를 실제 본문까지 추적"
      - "공용 FormulaPair·nlp-shared helper를 article source에서 제외"
  viz_pre_audit:
    routes: 304
    checks: 608
    errors: 6
    transient_missing_h1: 4
    reproducible_mobile_overflow: 2
```

`h1` 네 건은 집중 재검사에서 사라진 navigation timing false positive였다.
실제로 남은 것은 `robot-dynamics-feedback-control`의 24px,
`transformer-architecture`의 15px document overflow였다.

### Claude 병렬 검증과 수정

```yaml
claude_queue: ".codex-tmp/claude-next-content-audit-2026-07-30"
post_training_learning_depth:
  verdict: ACCEPT
  decision: "현재 finite floor를 유지하고 불필요한 확장을 하지 않음"
open_media_production_depth:
  pre: REVISE
  findings:
    - "image·video runtime과 workflow 글의 clickable handoff 부족"
    - "hash integrity와 checkpoint harmlessness 혼동 가능성"
    - "pickle deserialization·safetensors·weights_only 한계 누락"
    - "24GB acceptance gate를 계산할 peak image VRAM 식 누락"
  corrections:
    - "네 글에 막히면·이어 읽기·적용하기 handoff 추가"
    - "safetensors 우선, untrusted pickle 직접 load 금지"
    - "hash는 byte integrity만 증명하며 harmlessness를 보장하지 않음을 명시"
    - "weights_only=True도 DoS·memory safety의 완전한 sandbox가 아님을 명시"
    - "image peak VRAM 식과 exact measurement manifest 추가"
  post: ACCEPT
  strict_valid: true
  source_hash_stable: true
```

Image runtime의 수용 기준은 파일 크기 하나가 아니라 다음 항을 같은
manifest에서 측정하도록 고정했다.

```yaml
image_runtime_acceptance:
  estimate: "M_peak,image ≈ M_weights(q) + M_act(B,H',W',L) + M_cond + M_solver + M_decode - M_offloaded"
  manifest:
    - "exact checkpoint·VAE revision"
    - "width·height·batch·steps"
    - "dtype·quantization·attention backend"
    - "VAE tiling·offload·host RAM"
    - "cold/warm latency"
    - "peak allocated·reserved VRAM"
```

### Overflow 원인과 수정

색이나 전체 `overflow-x:hidden`으로 가리지 않고
`scripts/diagnose-document-overflow.mjs`로 실제 HTML ancestor의
`scrollWidth`, `clientWidth`, bounding rect와 computed style을 추적했다.

```yaml
root_cause:
  css:
    selector: ".foundation-article ... .not-prose:not([data-viz-needs-pan])"
    problem: "명시적 data-math-fit overflow-hidden과 table overflow-x-auto까지 visible로 덮음"
  layout:
    problem: "수식 grid child의 min-width:auto가 min-content width를 강제"
fix:
  - "data-math-fit, overflow-hidden, overflow-x-auto의 명시적 계약은 전역 visible 규칙에서 제외"
  - "Robot LQR와 Transformer block 수식 card에 min-w-0 추가"
focused_result:
  routes: 2
  viewports: [360, 1440]
  checks: 4
  errors: 0
  warnings: 0
```

### 작은 모델용 packet

```yaml
open_media_4b_packet:
  input:
    - "target hardware budget"
    - "checkpoint format·source·hash"
    - "exact runtime parameters"
    - "current article output and unresolved question"
  output:
    memory_terms:
      - weights
      - activations
      - conditioning
      - solver
      - decode
      - offloaded
    artifact_trust:
      serialization: "safetensors | pickle-family | unknown"
      integrity_verified: "yes | no"
      trusted_source: "yes | no"
      direct_load_allowed: "yes | no"
    handoff:
      blocker: "최대 1개"
      next: "최대 1개"
      apply: "최대 1개"
```

```yaml
open_media_9b_integrator:
  verify:
    - "image 식에 video 시간축 T'를 잘못 넣지 않음"
    - "estimate와 measured peak를 구분"
    - "hash integrity를 code safety로 승격하지 않음"
    - "weights_only를 sandbox라고 과장하지 않음"
    - "handoff 이유가 destination responsibility와 일치"
    - "360/390/1440에서 document·formula·Viz overflow 확인"
  reject_if:
    - "checkpoint file size만으로 24GB 실행 가능 판정"
    - "community node와 weight artifact의 trust boundary 혼합"
    - "관련 글 제목만 나열하고 다음 질문이 없음"
```

## 2026-07-30 · Agents와 Document AI 전이 문제 감사

Open Media 보강 뒤 audit가 실제 `LearningHandoff`를 연결로 세지 않는
오류를 고쳤다. `<InternalLink>`와 `<LearningHandoff>`를 모두 세도록
수정한 결과 Open Media track은 92에서 97로 바뀌었다. 수치상 낮은
Post-training은 Claude가 이미 `ACCEPT`했으므로 점수만 높이기 위한
장식 링크를 추가하지 않았다.

다음 두 상대적 약점은 하나의 거대 Context Manager 작업으로 합치지
않고 독립 transfer problem 두 개로 병렬 검증했다.

```yaml
claude_queue: ".codex-tmp/claude-next-track-audit-2026-07-30"
agent_runtime_depth:
  verdict: ACCEPT
  transfer_problem: "악성 웹 instruction을 만난 computer-use agent를 최소 권한·evidence trace·recovery 가능하게 설계"
  verified_chain:
    - "model proposal → harness → executor → reducer"
    - "context packet ownership"
    - "observe → ground → propose → gate → act → verify"
    - "approval hash에 instruction·action·view version·commit scope 결합"
    - "prompt injection source/sink/authority와 quarantine"
    - "timeout 뒤 receipt 우선 확인"
    - "incident fixture → eval regression"
  decision: "새 framework나 과거 논문을 추가하지 않음"
document_ai_depth:
  pre: REVISE
  finding: "table block bbox는 있으나 origin cell을 실제 page pixel 영역으로 되돌리는 cell-level provenance가 없음"
  correction:
    - "origin cell IR에 origin_cell_id·page·source_bbox·crop_ref·parser revision 추가"
    - "model bbox에서 source bbox로 가는 render-to-source transform 명시"
    - "병합 slot은 text·bbox를 복제하지 않고 origin_cell_id만 저장"
    - "Document Assembly retrieval node가 header/value origin cell source reference를 소비"
    - "OCR table gate failure receipt가 문제 cell의 원본 crop까지 전달"
    - "Viz에서 valid/missing/collision/overflow별 origin·page·bbox·crop ledger 표시"
  post: ACCEPT
```

좌표 계약은 다음 식으로 제한했다. Model input이 crop·resize·rotation된
경우의 기록된 역변환이지, bbox가 본질적으로 원문과 같다는 선언이
아니다.

```yaml
cell_provenance_contract:
  mapping: "b_source = T_render_to_source(b_model)"
  origin_cell:
    - origin_cell_id
    - text
    - row
    - column
    - rowspan
    - colspan
    - page
    - source_bbox
    - crop_ref
    - parser_revision
  occupied_slot:
    - row
    - column
    - origin_cell_id
  forbidden:
    - "병합 slot마다 text·bbox 복제"
    - "source에 없는 cell 값 생성"
    - "subtotal을 맞추기 위한 backfill"
```

```yaml
document_ai_4b_packet:
  input:
    - "table HTML 또는 cell token"
    - "model-input bbox와 render manifest"
    - "fixed or candidate column schema"
  output:
    origin_cells: "logical span + source evidence"
    occupancy_slots: "origin pointer only"
    invariant_failures:
      - rule_id
      - origin_cell_id
      - observed
      - expected
      - source_bbox
      - crop_ref
    abstain_if:
      - "bbox transform 없음"
      - "slot overlap"
      - "missing cell과 wrong colspan을 구분할 근거 없음"
```

```yaml
document_ai_9b_integrator:
  verify:
    - "block provenance와 cell provenance를 구분"
    - "row/column은 논리 좌표, source_bbox는 원본 좌표"
    - "render transform의 단위·crop offset·scale·rotation 기록"
    - "cross-page header와 value cell이 각각 자기 source reference 보존"
    - "release failure가 특정 cell crop까지 역추적"
    - "390/1440에서 ledger·KaTeX·document overflow 검증"
  reject_if:
    - "표 전체 bbox를 모든 cell bbox처럼 사용"
    - "parser confidence로 provenance 누락을 덮음"
    - "구조 repair가 원문 값을 생성"
```

```yaml
focused_verification:
  typescript: pass
  foundation_overflow:
    file: "tests/foundation-overflow-contract.spec.ts"
    result: "2/2 pass"
  open_media:
    file: "tests/open-media-runtime-continuity.spec.ts"
    result: "2/2 pass"
  document_cell_provenance:
    file: "tests/document-cell-provenance-contract.spec.ts"
    result: "2/2 pass"
  focused_viz:
    routes: 5
    checks: 10
    errors: 0
    warnings: 0
  screenshots:
    - ".codex-tmp/robot-dynamics-mobile-post.png"
    - ".codex-tmp/transformer-architecture-mobile-post.png"
    - ".codex-tmp/document-cell-evidence-mobile390.png"
```

### 2026-07-30 배포 체크포인트와 다음 두 경로

304개 AI route를 desktop 1440과 mobile 360에서 다시 순회한
source-stable audit는 layout·KaTeX·Viz 관련 오류가 0건이었다.
남은 세 건은 긴 순회 중 route 교체 순간을 읽은 `missing-h1`이었다.
세 route를 독립 재실행하면 모두 통과했으며, audit runner가 520ms
settle 뒤에도 현재 pathname과 비어 있지 않은 H1을 함께 재확인하도록
readiness contract를 강화했다.

```yaml
deployment_checkpoint:
  build: "npm run build:tsc — pass"
  service: "cm-blog.service — active"
  public_http: "200"
  public_contract_tests:
    files:
      - "tests/foundation-overflow-contract.spec.ts"
      - "tests/open-media-runtime-continuity.spec.ts"
      - "tests/document-cell-provenance-contract.spec.ts"
      - "tests/learning-handoff-continuity.spec.ts"
    result: "10/10 pass"
  public_focused_viz:
    report: ".codex-tmp/ai-viz-audit-2026-07-30-public-checkpoint.json"
    routes: 6
    checks: 12
    errors: 0
    warnings: 0
```

동시에 Context Manager의 Claude에 LLM architecture와 data engine을
서로 독립된 transfer problem으로 검증시켰다.

```yaml
next_track_claude:
  queue: ".codex-tmp/claude-next-track-audit-2026-07-30"
  llm_architecture:
    verdict: ACCEPT
    reason:
      - "dense → KV/long-context → sparse MoE → hybrid/linear의 유한한 바닥"
      - "active parameter·routing·KV bytes·fixed state·training/decode topology를 모델명 암기 없이 비교 가능"
      - "FLOPs≠latency, nominal context≠retrieval quality 같은 경계를 각 장에서 반복 확인"
    decision: "추가 역사나 모델 목록을 만들지 않음"
  llm_data_engine:
    verdict: REVISE
    gaps:
      - "실패 원인 진단 뒤 rollback·shard quarantine·LR/optimizer 복구 규칙이 없음"
      - "CJK near-dedup의 character/byte n-gram 단위가 없음"
      - "고정 tokenizer에 새 언어를 넣을 때 fertility와 embedding 호환성의 결정을 다루지 않음"
    next_action: "세 결손만 본문·contract test·post-audit로 보강"
```

세 수정 뒤 동일 transfer problem을 다시 검증한
`llm-data-engine-depth-post`는 strict·source-stable `ACCEPT`였다.
무작정 optimizer를 초기화하거나 BPE-dropout을 vocabulary 확장으로
부르는 잘못된 단축은 채택하지 않았다.

```yaml
llm_data_engine_correction:
  failed_run:
    start: "최초 이상 step 전의 마지막 검증 checkpoint"
    classify:
      - data_correlated
      - numerical_or_optimizer
      - infrastructure
      - unknown
    replay: "한 원인·한 변경만 적용한 작은 incident window"
    identity_rule: "optimizer reset·LR rewind는 resume가 아니라 새 run branch"
  multilingual_dedup:
    units:
      whitespace_stable: "word n-gram 후보"
      cjk_or_unsegmented: "Unicode-normalized character/byte 또는 언어별 segmenter"
    calibration: "언어 slice별 사람이 판정한 duplicate pair"
    invariant: "단위가 다른 Jaccard threshold를 같은 의미로 비교하지 않음"
  tokenizer_upgrade:
    decisions:
      - keep_existing_ids
      - append_tokens_while_preserving_existing_ids_and_merges
      - replace_as_new_model_version
    measure:
      - fertility
      - round_trip
      - decode_latency
      - embedding_and_lm_head_cost
    forbidden:
      - "독립 tokenizer의 ID를 기존 embedding row에 그대로 연결"
      - "BPE-dropout을 vocabulary expansion으로 부름"
      - "구버전 token ID·KV cache와 확장 버전을 혼용"
```

```yaml
llm_data_4b_packet:
  input:
    - "new-language held-out corpus"
    - "existing tokenizer/model hash"
    - "candidate data manifest"
    - "incident trace window"
  output:
    - "language-sliced dedup unit and threshold"
    - "tokenizer keep/expand/replace decision"
    - "last verified checkpoint and recovery branch"
    - "small replay receipt"
  abstain_if:
    - "duplicate labels가 없어 threshold를 보정할 수 없음"
    - "old token ID와 embedding row 대응을 알 수 없음"
    - "incident가 checkpoint보다 먼저 시작됐는지 알 수 없음"
```

```yaml
llm_data_9b_integrator:
  verify:
    - "token budget과 unique data budget을 구분"
    - "CJK dedup 단위·normalization·threshold version을 manifest에 고정"
    - "tokenizer 확장 parameter와 latency 절감의 양쪽 비용 비교"
    - "optimizer·scheduler·sampler·RNG가 함께 복구"
    - "data 격리는 새 manifest, numerical 변경은 새 config branch"
    - "clean multilingual slice와 원래 언어 slice의 회귀를 함께 검사"
  reject_if:
    - "원인 분리 없이 full run 재시작"
    - "새 tokenizer만 기존 weight에 교체"
    - "전체 평균이 소수 언어 회귀를 가림"
```

```yaml
llm_data_verification:
  claude_post: ACCEPT
  typescript: pass
  learning_flow: "304/304, all blockers 0"
  contract_test:
    file: "tests/llm-data-recovery-contract.spec.ts"
    result: "2/2 pass"
  focused_viz:
    report: ".codex-tmp/ai-viz-audit-2026-07-30-llm-data-post.json"
    routes: 3
    checks: 6
    errors: 0
    warnings: 0
```

### 2026-07-30 World Model과 GPU/HPC·분산 Serving 감사

Context Manager의 Claude에 physical transfer와 serving failure를 서로
독립된 hardest transfer problem으로 넘겼다.

```yaml
world_model_physical_ai:
  verdict: ACCEPT
  verified_transfer: "고정 camera·gripper data → 새 camera·gripper, 5시간 interaction → safe closed-loop deployment"
  verified_chain:
    - "video generation과 predictive latent를 구분"
    - "camera extrinsic·timestamp와 action frame·unit"
    - "representation probe → one-step dynamics → own-prediction rollout"
    - "data support 밖 action 제한"
    - "CEM/MPC와 receding horizon"
    - "planner exploitation·residual monitor"
    - "collision/dynamics constraint"
    - "SIL → HIL → subsystem → full robot → qualification"
  decision: "새 generative video/model-based RL 역사 글을 추가하지 않음"
```

GPU/HPC·분산 Serving 사전 감사는 `REVISE`였다. SLO·KV byte·RDMA
대역폭·scheduler·failover 사슬은 닫혀 있었지만, 전송된 KV byte가
decode runtime의 PagedAttention ownership으로 편입되는 단계와 HPC
본문에서 KV handoff로 돌아가는 forward link가 빠져 있었다.

```yaml
distributed_serving_hpc:
  pre: REVISE
  correction:
    kv_registration:
      - "decode BlockPool 목적 physical block 예약"
      - "request logical block table 연결"
      - "model·dtype·block size·KV layout·transfer completion 검증"
      - "검증 후 computed state·refcount·prefix identity 공개"
    hpc_forward_link:
      - "GPU → NIC → fabric → NIC → GPU"
      - "RoCE·InfiniBand 실제 transport 확인"
      - "TCP fallback과 TTFT를 같은 request trace에서 확인"
  post: ACCEPT
```

```yaml
serving_hpc_4b_packet:
  input:
    - "request id and prompt length"
    - "model·dtype·KV layout hash"
    - "prefill block metadata"
    - "decode free-pool headroom"
    - "transport trace"
  output:
    - "destination block reservation"
    - "logical-to-physical mapping"
    - "transfer completion receipt"
    - "publish or abort decision"
  abstain_if:
    - "producer/decode layout mismatch"
    - "partial transfer"
    - "destination ownership collision"
    - "transport가 TCP fallback인지 판정 불가"
```

```yaml
serving_hpc_9b_integrator:
  verify:
    - "TTFT와 TPOT를 분리"
    - "KV bytes/token·request·handoff를 같은 단위로 계산"
    - "prefill/decode capacity와 network capacity를 함께 admission"
    - "received byte를 computed KV로 조기 공개하지 않음"
    - "node/NIC failure 뒤 request commit·retry ownership 확인"
    - "aggregated baseline과 같은 workload로 비교"
  reject_if:
    - "100GbE line rate를 application payload로 간주"
    - "producer block id를 decode physical address로 사용"
    - "refcount·prefix identity를 transfer 전에 공개"
    - "failover가 중복 token 또는 잘못된 KV를 낼 수 있음"
```

```yaml
serving_hpc_verification:
  claude_post: ACCEPT
  typescript: pass
  contract_test:
    file: "tests/disaggregated-serving-handoff-contract.spec.ts"
    result: "2/2 pass"
  focused_viz:
    report: ".codex-tmp/ai-viz-audit-2026-07-30-serving-hpc-post.json"
    routes: 3
    checks: 6
    errors: 0
    warnings: 0
```

### 2026-07-30 Context Manager 500 복구와 현재 소스 재검증

Context Manager의 과거 `500`, `http:0`, timeout, `running` 잔류를 단순 재호출
목록으로 세지 않았다. 모든 과거 `progress*.jsonl`에서 마지막 상태를 다시 읽고,
실제 transport gap만 정규화했다.

```yaml
transport_gap_normalization:
  actual_gap_records: 57
  unique_gap_ids: 57
  rule:
    - "ok=false"
    - "http=0"
    - "last status in running|retry-running|prepared|failed"
  excluded:
    - "본문은 있으나 예전 형식이라 strict_valid=false였던 호출"
    - "원 실패를 나중의 ACCEPT로 소급해 덮는 처리"
```

57개 ID를 15개 의미 그룹에 정확히 한 번씩 귀속했다. 각 그룹은 과거 실패
파일이 아니라 현재 소스를 읽은 replacement receipt를 가진다. 장부 validator는
다음 조건을 모두 만족해야 `strictValid=true`로 계산한다.

```yaml
replacement_receipt_contract:
  http_envelope_ok: true
  worker: "claude-code:sonnet"
  inner_attempt_ok: true
  source_hash_stable: true
  first_non_empty_line: "ACCEPT | REVISE"
  standalone_verdict_lines: 1
  minimum_result_characters: 121
  ownership:
    uncovered: 0
    multiply_owned: 0
```

초기 validator가 `source_hash_stable`을 실제 strict 조건에 포함하지 않은 결함을
발견했다. 모든 receipt와 해당 queue의 terminal progress를 다시 연결해 검사하도록
`validate-ledger.mjs`를 고쳤다. 이 강화 뒤 source hash가 증명되지 않은 receipt는
Interpretability의 구형 네 건뿐이었다. 구형 성공을 그대로 인정하지 않고 route와
frontier, circuit article과 Viz를 현재 소스로 나눠 Claude 두 개에 병렬 재검증했다.

```yaml
interpretability_current_source:
  route_and_frontier:
    attempt_1: REVISE
    gap: "본문의 이어 읽기 경로가 causal literacy를 readout·SAE보다 앞에 두지 않음"
    correction: "statistics-generalization을 01로 추가하고 기존 경로를 02~05로 재번호"
    attempt_2: ACCEPT
  circuit_and_viz:
    attempt_1: REVISE
    gaps:
      - "Circuit 전용 interaction contract 부재"
      - "restoration·shown/omitted mass·fidelity의 안정적인 QA hook 부재"
      - "nonlinear attribution ranking 실패와 replacement fidelity 실패를 분리하는 진단 규칙 부재"
    correction:
      - "layer·position 클릭 뒤 restoration이 81→18로 변하는 계약"
      - "threshold 20→25에서 shown/omitted mass가 55/45→31/69로 변하고 fidelity 84는 불변인 계약"
      - "omitted/error/fidelity와 exact restoration을 교차해 두 실패 원인을 분리하는 본문"
    attempt_2: ACCEPT
```

Knowledge Systems도 첫 판정을 성공으로 덮지 않았다. Claude가 같은 current-source
transfer problem을 재실행할 때마다 이전 결손을 닫았는지 확인했다.

```yaml
knowledge_systems_current_source:
  attempt_1:
    verdict: REVISE
    gaps:
      - "RAG에서 Knowledge IR·Research Watcher로 가는 LearningHandoff 부재"
      - "Watcher Work·WorkVersion·SourceEvent가 Source·DocumentVersion·ingestion trigger와 연결되지 않음"
      - "Watcher I(e)와 IR I(ΔS)가 같은 provenance closure임을 설명하지 않음"
  attempt_2:
    verdict: REVISE
    gaps:
      - "Knowledge IR의 이어 읽기가 RAG를 건너뜀"
      - "logical table-cell block ID와 page·bbox·charspan locator의 명시적 연결 부재"
  attempt_3:
    verdict: INVALID_EMPTY_RESULT
    rule: "HTTP 200이어도 빈 result는 receipt로 채택하지 않음"
  attempt_4:
    verdict: ACCEPT
```

수정된 Knowledge 흐름은 `Source/DocumentVersion → locator가 있는 block/cell →
Claim·Scope·Evidence → RAG query trace → Research Watcher invalidation`을 한 identity
chain으로 사용한다. RAG는 답 문자열이 아니라 source version, context package와
claim support를 가진 재생 가능한 query trace를 산출하고, Watcher는 새 revision이
들어왔을 때 같은 reachability closure로 stale context와 article을 찾는다.

```yaml
claude_parallel_recovery:
  robot_transfer_current: ACCEPT
  representative_responsive_viz_current: ACCEPT
  promptable_vision_current: ACCEPT
  knowledge_systems_current: "REVISE → REVISE → INVALID_EMPTY_RESULT → ACCEPT"
  interpretability_route_current: "REVISE → ACCEPT"
  interpretability_circuit_current: "REVISE → ACCEPT"
  ledger_ownership_audit: ACCEPT
  fixed_snapshot_final_audit: ACCEPT
```

넓은 장부 감사 한 번은 240초 timeout으로 끝났고, 동시에 실행한 receipt 감사 한 번은
자기 자신의 `running` 행을 unresolved replacement로 오인해 `REVISE`했다. 두 판정은
삭제하거나 성공으로 바꾸지 않았다. 소유권과 receipt를 분리해 감사하고, 마지막에는
실행 중인 원장이 아니라 validator가 고정한 `ledger.json + coverage.json`만 읽게 해
self-reference를 제거했다.

```yaml
final_ledger_receipt:
  queue: ".codex-tmp/claude-legacy-validation-recovery-2026-07-30"
  validator: "validate-ledger.mjs"
  coverage: "coverage.json"
  final_claude: "results/legacy-ledger-fixed-snapshot-closure.attempt-1.raw.json"
  transport_gap_records: 57
  covered: 57
  uncovered: 0
  multiply_owned: 0
  pending_groups: 0
  invalid_receipt_groups: 0
  receipts_without_stable_source_hash: 0
```

이번 단계에서 실제 제품 소스는 다음과 같이 바뀌었다.

```yaml
knowledge_files:
  - "src/pages/articles/ai/rag-pipeline.tsx"
  - "src/pages/articles/ai/knowledge-ir-evidence-lineage.tsx"
  - "src/pages/articles/ai/research-watcher-curriculum.tsx"
interpretability_files:
  - "src/pages/articles/ai/llm-interpretability-frontier.tsx"
  - "src/pages/articles/ai/llm-circuit-analysis.tsx"
  - "src/pages/articles/ai/llm-circuit-analysis/viz/CircuitExplorers.tsx"
contract_files:
  - "tests/knowledge-narrative-closure.spec.ts"
  - "tests/learning-handoff-continuity.spec.ts"
  - "tests/llm-interpretability-jspace-contract.spec.ts"
  - "tests/llm-circuit-analysis-contract.spec.ts"
```

작은 모델은 장부 전체를 한 번에 판단하지 않는다. 4B worker는 한 failure group과
receipt contract만 검사하고, 9B integrator가 전역 소유권과 최종 상태를 닫는다.

```yaml
recovery_4b_packet:
  input:
    - "one legacy failure id and its last progress event"
    - "one replacement group"
    - "referenced receipt envelope"
    - "receipt task source-hash terminal event"
  output:
    - "owned exactly once: yes|no"
    - "transport success: yes|no"
    - "strict verdict shape: yes|no"
    - "source hash stable: yes|no"
    - "accept|revise|invalid with exact reason"
  abstain_if:
    - "progress terminal event를 찾지 못함"
    - "receipt id와 attempt를 연결할 수 없음"
    - "source hash 증거가 없음"
```

```yaml
recovery_9b_integrator:
  verify:
    - "모든 실제 gap id가 정확히 한 group에 소유됨"
    - "REVISE·timeout·empty result를 ACCEPT로 소급하지 않음"
    - "각 group에 적어도 하나의 strict current-source receipt가 있음"
    - "수정 전 REVISE와 수정 후 ACCEPT가 모두 보존됨"
    - "pending·invalid replacement와 source-hash gap이 0"
  reject_if:
    - "호출 횟수만으로 coverage를 주장"
    - "HTTP 200 빈 result를 성공으로 셈"
    - "메타 감사 자신의 running 상태를 replacement 상태와 혼동"
    - "구형 hash 없는 receipt를 현재 source 검증으로 간주"
```

```yaml
public_deployment_receipt:
  build: "npm run build:tsc — pass"
  service: "cm-blog.service — active"
  public_http: 200
  knowledge_contracts: "4/4 pass"
  interpretability_contracts: "7/7 pass"
  viewports:
    - 360
    - 390
    - 768
    - 1440
```

## 2026-07-31 Speech · Audio current-first 운영 경계 감사

### 왜 이 경로를 다음 대상으로 골랐는가

앞선 strict current-source 감사에서 Knowledge Systems, Robot AI, LLM architecture·data,
Open Media, post-training, interpretability, Vision, Document AI, World Model, Agents와
Serving/HPC는 다뤘다. 반면 Speech · Audio, On-device, Time Series, RL, Pre-training은
같은 수준의 transfer audit가 없었다.

Speech · Audio를 먼저 고른 이유는 2026년 7월 current top이 단순 ASR·TTS가 아니라
continuous interaction, background delegation, 업무 권한과 human escalation을 포함한
production voice agent로 바뀌었기 때문이다. 기존 글은 Presence와 GPT-Live를 현재
claim으로 정확히 제한했지만, 공식 WebRTC 운영 글을 source로 달아 놓고도 실제
소유권 경계를 본문에서 복원하지 않았다.

```yaml
official_current_sources:
  presence:
    url: "https://openai.com/index/introducing-openai-presence/"
    published: "2026-07-22"
    owns:
      - "job-specific knowledge and system access"
      - "policy, approval and escalation"
      - "simulation and graders before deployment"
      - "production sessions and handoffs as improvement evidence"
  gpt_live:
    url: "https://openai.com/index/introducing-gpt-live/"
    published: "2026-07-08"
    owns:
      - "continuous speak/listen/pause/interrupt/tool decisions"
      - "fast foreground interaction separated from deeper delegated work"
    does_not_publish:
      - "acoustic token architecture"
      - "training objective"
      - "proprietary scheduler"
  low_latency_voice:
    url: "https://openai.com/index/delivering-low-latency-voice-ai-at-scale/"
    published: "2026-05-04"
    owns:
      - "geo-steered entry and signaling"
      - "Global Relay first-packet and ufrag routing"
      - "transceiver ownership of ICE, DTLS, SRTP and session lifecycle"
```

### 내부 transfer 문제

본문에 문제 문항을 그대로 싣지 않았다. 대신 다음 상황을 비공개 검증 문제로 사용했다.

```yaml
speech_transfer_case:
  event:
    - "사용자가 system 발화 중 끼어든다"
    - "background tool은 아직 실행 중이다"
    - "ICE route가 바뀐다"
    - "이전 response epoch의 tool result가 늦게 도착한다"
  learner_must_localize:
    entry: "새 relay region을 고른 evidence"
    relay: "first packet ufrag가 새 transceiver owner로 간 evidence"
    transceiver: "ICE/DTLS/SRTP/session state가 다시 열린 evidence"
    model_tool: "현재 response epoch와 늦은 result epoch 비교"
    playback: "stale audio drain과 audible stop timestamp"
    human: "trigger, freeze, verified-state packet, acknowledgement와 timeout fallback"
  reject_if:
    - "모든 실패를 model latency 또는 network latency로 부름"
    - "session ID만 맞으면 낡은 tool result를 받음"
    - "사람 연결을 URL 또는 버튼 하나로만 설명"
    - "OpenAI 공개 배치를 모든 vendor 또는 GPT-Live 내부 architecture로 일반화"
```

### Claude 사전 감사와 분할 재시도

Queue는 `.codex-tmp/claude-speech-audio-audit-2026-07-31`이다. 넓은 Moshi-to-foundation
호출은 240초 timeout으로 종료됐으며 성공으로 세지 않았다. 같은 질문을 Moshi 원문과
세 concept branch로 분할해 다시 병렬 실행했다.

```yaml
claude_pre_audits:
  speech_current_production_pre:
    verdict: REVISE
    strict_valid: true
    findings:
      - "geo steering, Global Relay, ufrag와 transceiver ICE/DTLS/SRTP ownership 부재"
      - "Presence human escalation이 소개 문장뿐이고 cadence/evidence/failure 절차 부재"
  speech_moshi_foundations_pre:
    verdict: INVALID_TIMEOUT
    strict_valid: false
  speech_moshi_source_pre:
    verdict: REVISE
    strict_valid: true
    findings:
      - "200 ms practical label이 KaTeX 변수 곱으로 렌더링"
      - "Table 6을 delay-pattern 비교라고 잘못 설명"
      - "DelayLab zero-delay가 Table 6을 가리키는 provenance 오기"
  speech_concepts_transfer_pre:
    verdict: ACCEPT
    strict_valid: true
    checked:
      - "12.5 × 8 × 11 = 1,100 bit/s"
      - "generation, recognition, representation의 독립 ownership"
      - "Signals and systems에서 멈추는 유한 하향"
```

### 구현 판단

`realtime-duplex-voice-systems`에는 네 종류의 보강을 넣었다.

1. 공개 production path를 entry/signaling, Global Relay, transceiver, model/tools,
   buffer/device의 owner ledger로 분리했다.
2. First-audio budget에 route가 바뀔 때만 활성화되는
   `1_route · T_reconnect` 항을 추가하고 모든 항을 한글 underbrace와 FormulaNote로
   설명했다.
3. Human handoff를 Trigger → Freeze → Package → Accept 상태 전이로 쓰고,
   reason code, cancel acknowledgement, verified-state packet, human acknowledgement와
   timeout fallback을 receipt로 만들었다.
4. Moshi, generation, recognition, representation, on-device 중 현재 failure owner
   하나만 여는 `LearningHandoff`와 finite stop rule을 추가했다.

새 Viz는 처음부터 색 카드 그리드로 만들지 않았다. 첫 draft의 얇은 색상 상단선도
현재 frontend profile이 금지하는 generated-looking colored card rail에 가깝다고
판단해 제거했다. 최종 형태는 중립 표면의 연속 ledger이고 색은 owner icon과
semantic status에만 쓴다.

```yaml
media_ownership_viz:
  states:
    - steady
    - reroute
    - stale
  stable_hooks:
    - "data-media-ownership"
    - "data-media-scenario"
    - "data-transceiver-state"
    - "data-response-epoch"
    - "data-tool-result"
  controlled_changes:
    steady:
      transport: connected
      epoch: 42
      tool_result: accepted
    reroute:
      transport: "checking → connected"
      tool_result: accepted
    stale:
      transport: "checking → connected"
      current_epoch: 43
      result_epoch: 42
      tool_result: discarded
  responsive_layout:
    mobile: "step/icon + owner를 같은 행, evidence/failure는 아래"
    tablet_desktop: "owner, state, responsibility/evidence, failure 열"
    metrics: "mobile 2열, desktop 4열"
```

Moshi는 content를 늘리지 않고 provenance와 rendering만 바로잡았다.

```yaml
moshi_corrections:
  formula_label: "200 ms practical → practical 200 ms"
  table_6: "same delay pattern and matched setting에서 Inner Monologue on/off 비교"
  zero_delay_source: "Table 6 → Table 5"
  regression_assertions:
    - "data-formula-label에 practical 200 ms"
    - "DelayLab zero-delay는 Table 5"
    - "source prose의 Table 6 matched-setting 의미"
```

### 시각·계약·공개 배포 검증

실제 screenshot은 390, 768, 1440에서 확인했다. Desktop은 owner·evidence·failure가
각 열에서 읽혔고, 390에서는 잘림 없이 순서가 유지됐다. 모바일의 불필요한 길이는
번호와 owner를 같은 행에 놓고 metric을 2열로 바꿔 줄였다. Playwright의 긴 element
screenshot에 고정 nav가 중간에 나타나는 것은 stitching artifact이며 document
overflow와 실제 viewport interaction은 별도 테스트에서 0으로 확인했다.

```yaml
speech_verification:
  production_build:
    command: "npm run build:tsc"
    result: pass
  local:
    speech_production_ownership: "3/3 pass"
    moshi_source_closure: "4/4 pass"
    related_current_flow_regression: "11/11 pass"
  public:
    url: "https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/realtime-duplex-voice-systems"
    service: "cm-blog.service active"
    http: 200
    bundle: "index-BvyvrxH9.js"
    speech_production_ownership: "3/3 pass"
    moshi_source_closure: "4/4 pass"
  viewports:
    - 390
    - 768
    - 1440
```

### Claude 사후 감사 blocker와 보존된 재시도

사후 감사 두 병렬 호출과 한 순차 재시도는 모두 Context Manager HTTP 200을 받았지만
Claude harness가 약 2초 안에 code 1로 종료했다. 직접 최소 진단에서
`You've hit your monthly spend limit`가 확인됐다. 이들을 `ACCEPT`로 계산하지 않는다.

```yaml
claude_post_status:
  blocker: "Claude Code monthly spend limit"
  invalid_receipts:
    - "speech-current-production-post.attempt-1"
    - "speech-current-production-post.attempt-2"
    - "speech-moshi-source-post.attempt-1"
  not_started:
    - "speech-concepts-transfer-post"
  retry_queue: ".codex-tmp/claude-speech-audio-audit-2026-07-31/manifest.json"
  retry_runner: ".codex-tmp/claude-open-media-spine-audit-2026-07-30/run-one.sh"
  acceptance_rule: "strict_valid=true and source_hash_stable=true; code 1/timeout/empty result는 무효"
```

### 4B·9B 축소 재현 packet

```yaml
speech_4b_worker_packet:
  input:
    - "한 current claim owner의 공식 source excerpt"
    - "한 article section"
    - "그 section과 직접 연결된 Viz state"
    - "한 hard transfer event"
  extract:
    - owner
    - input
    - output
    - cadence
    - evidence
    - failure
    - forbidden inference
  output:
    - "covered | missing | contradicted"
    - "exact file/line"
    - "smallest prose/Viz/test correction"
  abstain_if:
    - "현재 claim을 1차 source에서 확인하지 못함"
    - "공개 product contract와 비공개 architecture를 구분할 수 없음"
    - "한 worker에게 여러 sibling branch를 동시에 통합하라고 요구받음"
```

```yaml
speech_9b_integrator_packet:
  verify:
    - "현재 product goal → 공개 canonical source → 독립 concept branch → 최소 foundation → implementation"
    - "generation, recognition, representation sibling이 강제 직렬 경로가 아님"
    - "hard transfer event의 각 실패가 정확히 한 primary owner와 receipt를 가짐"
    - "display math의 한글 underbrace, FormulaNote와 mobile scale"
    - "Viz control이 state와 evidence를 실제로 바꾸며 장식에 그치지 않음"
    - "390/768/1440 overflow와 text fit"
    - "Claude verdict envelope와 source hash가 strict contract를 만족"
  reject_if:
    - "WebRTC를 network 한 단어로 축약"
    - "예쁜 voice demo를 task, interruption, safety release evidence로 간주"
    - "paper theoretical latency를 production p95로 사용"
    - "역사 논문을 끝없이 필수 선행으로 추가"
    - "CLI code 1, timeout 또는 빈 result를 사후 ACCEPT로 처리"
```

### 2026-07-31 Context Manager 실패 장부 재대조

과거 보고서의 `HTTP 500`, `All providers failed`, timeout, empty result를 다시 검색했다.
실패 문구의 단순 출현 횟수는 검증 공백 수가 아니다. 제품 timeout 설명과 이미 좁은
재시도로 닫힌 이력도 섞여 있기 때문이다. 따라서 현재 고정 장부의 transport gap ID를
기준으로 다시 계산했다.

```yaml
legacy_claude_recovery:
  ledger: ".codex-tmp/claude-legacy-validation-recovery-2026-07-30"
  transport_gap_records: 57
  unique_transport_gap_ids: 57
  uncovered_gaps: 0
  multiply_owned_gaps: 0
  pending_groups: 0
  invalid_replacement_groups: 0
  final_fixed_snapshot_verdict: ACCEPT
```

On-device는 7월 23일 첫 Context Manager 500 뒤 그대로 방치된 경로가 아니었다.
`claude-review-backfill-serving-on-device`에서
`on-device-llm-runtime`과 `efficient-inference-on-device`가 모두 실제
`claude-code:sonnet` header를 가진 article-level review로 회수됐다. 같은 범위를
새 글처럼 중복 확장하지 않는다.

현재 미검증은 과거 공백이 아니라 Speech 수정 뒤의 세 사후 감사뿐이다.

```yaml
speech_post_queue:
  current_production:
    attempts: [1, 2]
    result: INVALID_EMPTY_RESULT
  moshi_source:
    attempts: [1]
    result: INVALID_EMPTY_RESULT
  concepts_transfer:
    attempts: [1]
    result: INVALID_EMPTY_RESULT
  context_manager:
    http: 200
    worker: "claude-code:sonnet"
    inner_result: "harness exit code 1"
  direct_diagnostic:
    api_error_status: 429
    cause: "Claude Code monthly spend limit"
```

재개 도구는 먼저 최소 `OK` preflight를 호출한다. 429가 남아 있으면 exit 75로
멈추고 새 invalid receipt를 만들지 않는다. 한도가 해제되면 세 bounded packet을
동시성 3으로 실행하고 각 latest attempt의 `strict_valid`와
`source_hash_stable`을 검사한다.

```bash
cd /home/heru/code/blog
.codex-tmp/claude-speech-audio-audit-2026-07-31/resume-post-audits.sh
```

같은 스크립트는 transient user timer
`cm-blog-claude-speech-post-retry.timer`에 연결했다. 최초 실행에서 429를 확인하고
TEMPFAIL 75로 멈췄으며, 기존 completed attempt 수는 production 2, Moshi 1,
concept transfer 1에서 늘어나지 않았다. Timer는 30분 뒤 다시 preflight한다.
한 bounded packet이라도 strict-valid 결과를 받으면 그 packet은 다음 주기에서
건너뛰고, 세 packet이 모두 도착하면 더 호출하지 않고 결과 검토 대기 상태가 된다.

2026-07-31 전역 deterministic audit도 다시 생성했다.

```yaml
learning_flow_audit_2026_07_31:
  registered: 304
  release_blockers: 0
  review_needed: 0
  enrichment_backlog: 0
  formula_gaps: 0
  table_first: 0
  missing_prerequisites: 0
  local_connection_backlog: 0
  global_continuity_coverage: 304
```

## 2026-07-31 Current-source 영수증 감사로 검증 정의 교정

위의 `release_blockers: 0`은 registry와 문서 형식의 결정론적 조건이 닫혔다는
뜻이다. 현재 source hash에 대해 Claude가 본문·수식·Viz·학습 전이를 읽고
`ACCEPT`했다는 뜻은 아니다. 따라서 “현재 미검증은 Speech 세 건뿐”이라는 앞선
결론은 이 더 강한 정의에서 폐기한다.

`scripts/audit-topdown-source-receipts.mjs`는 다음 순서로 검증 상태를 다시 계산한다.

1. `topDownResearchTracks.ts`의 19개 트랙과 197개 role assignment를 읽는다.
2. 각 article entry에서 local import를 재귀 추적해 본문·Viz source 집합을 만든다.
3. 모든 `.codex-tmp/**/progress.jsonl`을 읽되
   `completed + strict_valid + source_hash_stable + ACCEPT|REVISE`만 receipt로 인정한다.
4. Receipt의 `.after` SHA-256을 현재 source SHA-256과 대조한다.
5. 현재 hash의 명시적 `ACCEPT`만 closure 증거로 쓴다. 여러 파일을 함께 읽은
   `REVISE`는 어느 파일의 결함인지 확정하지 않고 `REVIEW_REQUIRED`로 둔다.

```yaml
topdown_source_receipt_audit:
  tracks: 19
  role_assignments: 197
  unique_articles: 136
  main:
    ACCEPT: 74
    REVIEW_REQUIRED: 17
    DRIFT: 2
    UNVERIFIED: 43
  closure:
    ACCEPT: 11
    REVIEW_REQUIRED: 21
    PARTIAL: 59
    DRIFT: 2
    UNVERIFIED: 43
  priority_gaps: 181
  outputs:
    - "knowledge/authoring/runs/2026-07-31-topdown-source-receipt-audit.json"
    - "knowledge/authoring/runs/2026-07-31-topdown-source-receipt-audit-report.md"
```

이 결과는 얕은 형식 blocker가 0이어도 전체 목표가 끝나지 않았음을 보여 준다.
다음 수정 우선순위는 페이지 수가 아니라 current/canonical/concept/foundation/
implementation closure 공백과 learner transfer 위험으로 정한다.

## Multimodal Foundation current를 첫 보강 대상으로 고른 이유

`multimodal-foundation-models`는 13개 role을 가지지만 main `ACCEPT`가 2개,
closure `ACCEPT`가 0개였고 current article 자체가 `UNVERIFIED`였다. 또한 최신
model 이름을 나열하는 것만으로는 다음 비공개 transfer 문제를 풀 수 없었다.

> 256K context model에 image 220장을 넣는다. Image당 280 token일 때와
> 1,120 token일 때 같은 요청이 통과하는가? Product preview만 공개된 image
> generator를 자체 architecture로 재현해도 된다고 결론 내릴 수 있는가?

기존 글은 input/output/representation/objective/evidence를 잘 분리했지만,
visual token·output reserve·context margin을 끝까지 계산하지 않았고, source
evidence가 부족할 때 release를 닫는 절차도 없었다. 이 문제를 풀 수 있도록
`지원 → 예산 → 근거 → 판정` 순서를 추가했다.

```yaml
multimodal_transfer_contract:
  formula_1:
    purpose: "text + every modality token + output reserve를 한 shared context 장부에 합산"
    operation_reason: "같은 sequence window를 함께 쓰므로 합산; unknown은 0이 아님"
  formula_2:
    purpose: "context margin과 release candidate gate"
    operation_reason: "예산·입출력·근거 중 하나라도 실패하면 닫기 위해 logical AND"
  runtime_boundary:
    token_budget: "불가능한 요청을 먼저 제거하는 상한 검사"
    latency_memory_quality: "통과 뒤 실제 runtime trace로 측정"
```

공식 1차 근거는 다음 ownership으로 분리했다.

```yaml
multimodal_primary_sources:
  gemma_4:
    technical_report: "https://arxiv.org/abs/2607.02770"
    model_card: "https://ai.google.dev/gemma/docs/core/model_card_4"
    used_for:
      - "12B 256K context"
      - "280/1,120 visual token budget"
      - "multimodal input, text output boundary"
  llama_4:
    source: "https://ai.meta.com/blog/llama-4-multimodal-intelligence/"
    used_for: "MetaCLIP vision encoder + early fusion; encoder-free로 확대 금지"
  qwen_3_vl:
    source: "https://github.com/QwenLM/Qwen3-VL"
    used_for: "DeepStack, Interleaved-MRoPE, long-context implementation boundary"
  emu_3:
    source: "https://www.nature.com/articles/s41586-025-10041-x"
    used_for: "512×512 image → 4,096 discrete visual token"
  qwen_vlo:
    source: "https://qwenlm.github.io/blog/qwen-vlo/"
    used_for: "image generation/edit capability only; architecture/token/weight는 미확정"
```

`MultimodalBudgetEvidenceLab`은 비교표를 색칠한 Viz가 아니다. 같은 선택 상태에서
request total, margin, token composition, evidence ladder와 release verdict를
함께 바꾼다.

```yaml
multimodal_budget_evidence_lab:
  gemma_compact:
    text: 18000
    images: "220 × 280"
    output_reserve: 6000
    total: 85600
    margin: 170400
    verdict: "예산 통과 · 실측 필요"
  gemma_detail:
    text: 18000
    images: "220 × 1120"
    output_reserve: 6000
    total: 270400
    margin: -14400
    verdict: "예산 초과 · 요청 분할"
  emu3:
    visual_output: 4096
    branch_requirement: "Emu3-Gen artifact를 지정"
    verdict: "예산 통과 뒤 runtime trace 필요"
  qwen_vlo:
    known: "공식 product capability"
    unknown:
      - visual representation
      - token budget
      - open weight
      - reproduction code
    total: "계산 보류"
    verdict: "구조 재현 보류"
```

Visual style은 중립 ledger, 1px divider, tabular number와 semantic status만 사용했다.
세로·가로 connector를 장식적으로 늘리지 않았고, 390px에서는 요청·예산·근거를
순서대로 쌓는다. 두 번째 release 식은 AND gate를 의미 단위 두 줄로 나눠 모바일
축소를 줄였다.

## Context Manager 전용 전체 Claude closure 대기열

`prepare-topdown-claude-audit-queue.mjs`는 closure가 `ACCEPT`가 아닌 125개
unique article을 한 article당 한 bounded packet으로 만든다. 거대한 track-wide
prompt 대신 article source, recursive local Viz import, metadata와 존재하는
content spec만 제공해 Claude가 실제로 전부 읽을 수 있는 크기를 유지한다.

```yaml
claude_topdown_queue:
  path: ".codex-tmp/claude-topdown-closure-audit-2026-07-31"
  articles: 125
  previous_status:
    PARTIAL: 59
    UNVERIFIED: 43
    REVIEW_REQUIRED: 21
    DRIFT: 2
  concurrency_after_preflight: 6
  route: "Context Manager /api/orchestration/delegate only"
  worker: "claude-code:sonnet"
  preflight:
    current_http: 200
    current_result: "ok:false · harness exited with code=1 signal=-"
    behavior: "실패 시 exit 75, article receipt를 만들지 않음"
  retry_timer: "cm-blog-claude-topdown-closure-retry.timer · 30분"
  receipt_refresh_timer: "cm-blog-topdown-receipt-refresh.timer · 5분"
```

Speech queue도 direct Claude CLI preflight를 제거하고 Context Manager delegate
preflight로 교체했다. Preflight request, response와 HTTP는 각 queue의
`preflight/`에 보존한다. Article result는 도착 순서대로 `progress.jsonl`에
append되고, 5분 refresh가 current-hash report를 다시 만든다. Source가 이후
바뀌면 과거 strict receipt가 있어도 `receipt_is_current`가 거짓이므로 다시
pending이 된다.

## 4B·9B용 Multimodal 축소 packet

```yaml
multimodal_4b_packet:
  input:
    - "한 model의 공식 capability 문장"
    - "한 token/context 수치 owner"
    - "한 article section과 직접 연결된 Viz state"
  extract:
    - input_modality
    - output_modality
    - representation
    - token_unit
    - verified_limit
    - missing_value
    - forbidden_inference
  compute:
    - "N_total"
    - "N_margin"
  output:
    - "known | unknown | contradicted"
    - "budget pass | overflow | calculation deferred"
    - "exact source/file anchor"
  abstain_if:
    - "visual token 수를 공식 source에서 찾지 못함"
    - "product preview를 architecture evidence와 분리하지 못함"
```

```yaml
multimodal_9b_integrator_packet:
  verify:
    - "current capability → canonical conflict → concept branch → minimal foundation → implementation"
    - "support와 request fit을 분리"
    - "unknown token count를 0으로 바꾸지 않음"
    - "context pass 뒤 runtime trace가 별도 gate"
    - "FormulaNote가 기호뿐 아니라 sum, subtraction, AND 선택 이유를 설명"
    - "Viz control이 total, margin, evidence와 verdict를 동시에 변경"
    - "390/768/1440 text fit, 44px control, raw LaTeX 없음"
  reject_if:
    - "Unified/native/omni 이름으로 output modality를 추정"
    - "model context 길이를 API upload count나 latency 보장으로 사용"
    - "preview capability 부재와 architecture 미공개를 같은 주장으로 취급"
    - "오래된 전체 계보를 필수 선행으로 다시 노출"
```

### Multimodal 보강 배포 영수증

```yaml
multimodal_deployment:
  built_at: "2026-07-31"
  build:
    command: "npm run build"
    result: pass
  typecheck:
    command: "npx tsc --noEmit"
    result: pass
  local_playwright:
    command: "QA_BASE_URL=http://127.0.0.1:4181 npx playwright test tests/multimodal-current-first.spec.ts --workers=1"
    result: "5/5 pass"
  service:
    name: "cm-blog.service"
    state: active
  production:
    url: "https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/multimodal-foundation-models-current"
    http: 200
    playwright: "5/5 pass"
  verified_viewports:
    - "390×844"
    - "768×1024"
    - "1440×900"
  verified_contracts:
    - "current article formula pair 2개와 FormulaNote 2개"
    - "current article interactive Viz surface 3개"
    - "document/Viz/formula overflow 0"
    - "raw LaTeX 없음"
    - "visible label 12px 이상"
    - "interactive control 44px 이상"
    - "Gemma 4 compact 85,600 / +170,400 / 실측 필요"
    - "Gemma 4 detail 270,400 / -14,400 / 요청 분할"
    - "Qwen VLo unknown visual span / 계산 보류 / 구조 재현 보류"
```

## 2026-07-31 Knowledge Systems · CoDaR 제품 전이와 Claude 대기열

### Context Manager 장애를 어떻게 분리했는가

125개 current-source 감사 대기열이 진행되지 않는 원인을 곧바로
Context Manager의 500으로 단정하지 않았다. 먼저 systemd service가 실행하는
환경과 대화형 shell을 비교했다. 재시도 script는 `bws`를 사용하지만 systemd
PATH에는 `/home/heru/.cargo/bin`이 없어 Context Manager에 요청하기 전에
실패했다. 다음 세 script에 같은 PATH 계약을 추가했다.

```text
scripts/resume-topdown-claude-audits.sh
scripts/run-strict-claude-audit.sh
.codex-tmp/claude-speech-audio-audit-2026-07-31/resume-post-audits.sh
```

수정 뒤 Context Manager `/api/orchestration/delegate`는 HTTP 200을 반환했다.
그러나 response의 `ok`는 `false`였고 harness는 code 1로 끝났다. Claude
project log의 실제 원인은 `You've hit your monthly spend limit`와
`rate_limit` HTTP 429였다. 따라서 다음 세 상태를 분리해 기록한다.

```yaml
claude_route_diagnosis:
  systemd_pre_request_failure:
    cause: "PATH에 ~/.cargo/bin이 없어 bws 실행 불가"
    status: fixed
  context_manager_transport:
    http: 200
    status: working
  claude_provider:
    error: "monthly spend limit · rate_limit 429"
    status: blocked
  article_receipt:
    created_on_preflight_failure: false
  queue:
    total: 125
    concurrency_after_preflight: 6
    retry: "30분 timer"
    current_progress_lines: 0
```

“Claude에서 Context Manager를 거쳐 Codex를 부를 수 있다”는 사실은 반대
방향인 Context Manager → Claude의 계정 quota가 열려 있다는 증거가 아니다.
두 방향과 provider quota를 합치지 않는 것이 이번 장애 진단의 핵심이다.

### 왜 CoDaR를 그대로 요약하지 않고 제품 경계를 추가했는가

원문의 DCDS는 문서 안에서 앞 문맥이 필요한 chunk pair의 평균 빈도다. 공식
ACL 원문에서 512-word chunk, 앞의 세 chunk 비교, 20개 validation sample로
dataset별 threshold를 고르는 설정을 다시 확인했다. 또한 600개 pair의 사람
annotation과 비교한 evaluator 정확도 84.6%, Cohen's kappa 0.64, 영어
dataset만 평가했다는 한계와 attention mechanism 수준 원인 분석이 없다는
한계를 source claim으로 고정했다.

그대로 제품 release 기준으로 옮기면 평균이 낮은 문서에서 단 하나의 중요한
관계를 놓칠 수 있다. 내부 hard-transfer fixture는 100개의 독립 chunk 사이에
다음 두 span만 멀리 떨어진 안전 문서다.

```text
값: 연속 허용 토크 42 N·m
적용 범위: 주위 온도 80°C 이하
```

평균 dependency가 낮아도 이 관계를 자르면 답이 달라진다. 그래서 원문
CoDaR claim과 이 글의 보수적 제품 전이를 명시적으로 분리하고 다음 두
판정을 추가했다.

```text
1. DCDS가 높거나 critical relation이 하나라도 있으면 관계 보존 guard를 연다.
2. 전체 적재가 가능하면 Full-Context, 불가능하면 structure-preserving
   grouping, guard가 꺼질 때만 decomposition 후보로 보낸다.
```

이 guard는 새로운 CoDaR 결과라고 쓰지 않는다. Knowledge System 제품에서
안전 수식 qualifier, cross-page table, caption scope를 보존하기 위한 별도
실행 계약이다.

### Viz를 어떻게 다시 추론했는가

기존 Viz는 `pair 1…6` 상자의 색만 바뀌어 독자가 어떤 관계를 세는지 알 수
없었다. 새 `ContextDependencyRoutingLab`은 같은 N=6, k=3 계산을 실제 문서
조각으로 보여 준다.

```yaml
codar_viz_contract:
  scenarios:
    - "연속 안전 문서: DCDS 8/9 = 0.89"
    - "독립 사양 묶음: DCDS 1/9 = 0.11"
  current_chunks: [c4, c5, c6]
  dependency_kinds: [정보, 지시어, 논리, 독립]
  visible_reason: true
  controls:
    - scenario
    - current_chunk
    - threshold
  simultaneous_outputs:
    - pair judgement
    - chunk score
    - document DCDS
    - route
```

단순 색 변화가 아니라 선택한 chunk와 앞의 세 chunk 사이에 왜 정보·지시어·
논리 의존이 있는지를 문장으로 읽을 수 있어야 한다. 모든 visible text를
12px 이상으로 올리고, 390px에서 우측 잘림 없이 상태 변화가 보이도록 grid를
재배치했다.

### 수식 가독성을 어떻게 닫았는가

첫 제품 route 식은 모바일에서 최소 scale 0.8에 도달하고도 넘쳤다. 수식을
더 작게 만드는 대신 관계 보존 guard와 세 갈래 route를 두 식으로 분리했다.
그 뒤 piecewise 식도 screenshot에서 작게 보였으므로 `G`, `N`, `L`, `r`의
짧은 별칭을 쓰고 세 조건을 줄별 implication으로 바꿨다. 별칭의 원래
의미는 바로 아래 한국어 FormulaNote에 보존했다.

Research Watcher의 다섯 영문 contract도 한 줄에 나열하지 않고
`A={a1,…,a5}`로 줄였다. compute·data·objective·runtime·verification의
구체적인 질문은 FormulaNote에서 각각 설명한다. 이는 수학 내용을 줄인 것이
아니라 “큰 관계를 먼저 보고 기호를 바로 해설한다”는 모바일 읽기 순서다.

### 소유권 연결

CoDaR가 맞아도 전체 Knowledge System이 맞는 것은 아니다. 본문에서 실패
증상을 다음 owner로 직접 넘겼다.

```yaml
owner_handoff:
  relation_routing: "CoDaR → RAG Pipeline"
  reading_order_and_cross_page_grid: "Source Ingestion"
  value_scope_separation: "Knowledge IR"
  corrected_version_and_stale_claim: "Research Watcher + Knowledge IR"
```

이 연결이 있어야 독자가 CoDaR 한 편을 모든 문서 문제의 해결책으로 오해하지
않고, 증상에서 정확한 다음 글로 이동할 수 있다.

### 4B·9B 축소 재현 packet

```yaml
codar_4b_packet:
  input:
    - "현재 chunk 하나"
    - "앞의 k개 chunk"
    - "정보·지시어·논리 dependency 정의"
    - "정확한 source span"
  output:
    - pair: "0 | 1 | unknown"
    - kind: "정보 | 지시어 | 논리 | 독립"
    - reason: "원문 문장 한 개"
    - critical_relation: "0 | 1 | needs_human"
  forbidden:
    - "문서 평균만으로 release 승인"
    - "evaluator 출력을 truth로 표기"
    - "영어 실험 threshold를 한국어 문서에 복사"
```

```yaml
codar_9b_integrator_packet:
  input:
    - "4B pair record"
    - "N, k, threshold와 context limit"
    - "critical relation 목록"
    - "Source Ingestion·IR·Watcher owner map"
  compute:
    - "chunk score"
    - "document DCDS"
    - "relation preservation guard"
    - "full | structure-preserving | split candidate"
  verify:
    - "원문 claim과 제품 transfer를 구분"
    - "각 display formula 뒤에 한국어 FormulaNote"
    - "Viz 선택이 pair, score, DCDS, route를 함께 변경"
    - "390/768/1440 overflow 0, visible text 12px 이상"
    - "실패 증상을 정확한 owner article로 연결"
```

### 로컬 검증 영수증

```yaml
knowledge_systems_verification:
  source:
    primary: "ACL Anthology · Lost in Decomposition / CoDaR"
  responsive_audit:
    articles: 7
    viewports: [390, 768, 1440]
    combinations: 21
    document_overflow: 0
    viz_overflow: 0
    formula_overflow: 0
    min_math_scale: 0.8
    raw_latex: 0
    undersized_viz_text: 0
  typecheck: pass
  diff_check: pass
  playwright:
    codar_hard_transfer: "1/1 pass"
    path_and_sidebar_batch: "76/79 pass, 3 stale-count/label contracts found"
    repaired_contracts: "3/3 pass"
    final_path_and_sidebar_batch: "79/79 pass"
  build:
    command: "npm run build"
    result: pass
  strict_receipt_refresh:
    command: "npm run audit:topdown-receipts"
    knowledge_current: "UNVERIFIED"
    knowledge_watcher: "DRIFT · 과거 ACCEPT hash와 현재 source hash 불일치"
    false_accept_prevented: true
  deployment:
    service: "cm-blog.service · active"
    production_http:
      codar: 200
      knowledge_route: 200
    production_playwright:
      scope: "CoDaR hard transfer · Knowledge Systems mobile/desktop route · Research Watcher"
      result: "4/4 pass"
  claude_retry:
    latest_attempt: "2026-07-31 01:30 KST"
    context_manager_http: 200
    result: "ok:false · harness code 1 · provider monthly limit"
    next_attempt: "2026-07-31 02:00 KST"
  visual_receipts:
    - ".codex-tmp/knowledge-codar-after-final/mobile-transfer-v2.png"
    - ".codex-tmp/knowledge-codar-after-final/mobile-watcher-contract-v2.png"
  claude_receipt:
    status: pending
    reason: "provider monthly spend limit"
    integrity: "preflight 실패를 ACCEPT로 기록하지 않음"
```

## 2026-07-31 상위 경로 전체 Viz 감사와 Claude 병렬 closure queue

Knowledge Systems 수정만 통과시키고 끝내면 다른 경로의 오래된 Scene·Viz가
남을 수 있다. 그래서 top-down track에 배정된 고유 아티클을 다시 모아 실제
브라우저에서 모바일과 데스크톱을 전수 검사했다.

```yaml
topdown_viz_audit:
  command: "VIZ_AUDIT_VIEWPORTS=mobile,desktop npm run audit:articles"
  report: ".codex-tmp/topdown-viz-audit-2026-07-31.json"
  routes: 135
  viewport_checks: 270
  viz_surfaces: 890
  svg_surfaces: 115
  errors: 0
  warnings: 0
  inspected_contracts:
    - "document horizontal overflow"
    - "article-viz-surface overflow"
    - "SVG text overlap"
    - "foreignObject clipping"
    - "default internal horizontal scroll"
    - "raw SVG/text LaTeX"
    - "KaTeX render error"
    - "runtime/navigation error"
```

이 결과는 “모든 Viz가 미적으로 완성됐다”는 판정이 아니다. 현재 source
hash 기준으로 잘림·겹침·작은 SVG 글자·raw 수식처럼 자동으로 판정할 수 있는
회귀가 없다는 구조적 기준선이다. 다음 디자인 수정은 이 기준선을 깨지 않은
상태에서 hard-transfer를 얼마나 잘 보여 주는지 screenshot과 article별
Claude audit으로 판단한다.

### Claude closure를 왜 125개로 만들었는가

top-down track에는 19개 경로, 197개 역할 배정, 136개 고유 아티클이 있다.
같은 아티클이 여러 경로에서 foundation으로 재사용되므로 역할 배정마다
Claude를 다시 부르면 결과가 중복된다. 현재 source closure 전체가 이미
strict ACCEPT인 11개를 제외하고, PARTIAL·UNVERIFIED·REVIEW_REQUIRED·DRIFT
상태의 고유 아티클 125개만 큐에 넣었다.

```yaml
claude_topdown_closure_queue:
  queue: ".codex-tmp/claude-topdown-closure-audit-2026-07-31"
  jobs: 125
  previous_status:
    partial: 59
    unverified: 43
    review_required: 21
    drift: 2
  preflight:
    prompt: "Reply exactly OK."
    worker: "claude-code:sonnet"
    required_before_fanout: true
  fanout:
    implementation: "xargs -P 6"
    parallel_workers: 6
  retry:
    timer: "cm-blog-claude-topdown-closure-retry.timer"
    interval: "30분"
  current_state:
    progress_lines: 0
    context_manager_http: 200
    provider: "monthly spend limit · rate_limit 429"
```

사전 호출이 실패하면 article worker를 하나도 시작하지 않는다. quota가 열린
뒤 사전 호출이 성공할 때만 6개씩 병렬 실행한다. 각 응답은 다음 조건을 모두
통과해야 현재 source의 검증 영수증이 된다.

```yaml
strict_receipt_contract:
  first_nonempty_line: "ACCEPT | REVISE"
  verdict_line_count: 1
  contradictory_verdict: false
  minimum_response_characters: 120
  required_worker: "claude-code:sonnet"
  context_manager_http: 200
  orchestration_ok: true
  source_hash_before_equals_after: true
```

따라서 Context Manager 전송 성공, Claude provider 성공, 엄격한 응답 형식,
소스 해시 불변을 서로 다른 단계로 취급한다. 이 중 하나라도 실패하면 기존
PARTIAL·UNVERIFIED 상태를 ACCEPT로 올리지 않는다. 결과가 도착하면
`progress.jsonl`을 receipt auditor가 다시 읽어 main과 local Viz/import
closure를 각각 갱신한다.

## 2026-07-31 수식 가독성 closure와 전체 회귀 검사

이전 Viz 감사는 raw LaTeX, KaTeX error와 document overflow를 찾았지만,
다음 세 가지를 충분히 잡지 못했다.

1. KaTeX 내부 폭만 부모보다 넓은 경우
2. 박스에는 들어오지만 읽을 수 없을 정도로 축소된 경우
3. 수식은 렌더됐지만 바로 뒤에 한국어 의미 설명이 없는 경우

따라서 `scripts/audit-all-article-viz.mjs`에 display formula 전용 계약을
추가했다.

```yaml
formula_render_contract:
  parent_overflow_px: 0
  minimum_visible_font_px: 12
  note_pair:
    accepted:
      - "같은 data-formula-pair 안의 FormulaNote"
      - "수식 wrapper 바로 뒤의 FormulaNote"
    korean_required: true
  katex_error: 0
  raw_latex: 0
```

### 긴 식을 고친 판단 순서

긴 식을 `scale(0.5)`로 줄이지 않았다. 독자가 계산 순서를 따라갈 수 있는
중간량을 먼저 만들었다.

```yaml
semantic_formula_rewrite:
  before:
    - "한 줄에 정의·연산·해석 annotation을 모두 배치"
    - "긴 underbrace가 실제 수학보다 폭을 더 차지"
  after:
    - "입력 또는 기준량 정의"
    - "중간 계수·잔차·확률 정의"
    - "마지막 줄에서 목적식 조립"
    - "각 중간량의 역할을 짧은 한국어 subscript/text로 표시"
  examples:
    ray_plane:
      - "광선 위 점 p(λ)"
      - "평면값 a=nᵀo+d"
      - "교차각 b=nᵀr"
      - "거리 λ*=-a/b"
    ctc:
      - "frame label 확률 q_t"
      - "alignment 경로 확률"
      - "정답으로 collapse되는 경로 집합"
      - "전체 transcript 확률"
    markov:
      - "전체 history H"
      - "다음 결과 Y"
      - "history 조건 예측"
      - "현재 state 조건 예측"
      - "두 분포의 동등 조건"
```

공통 `MathFormula`는 실제 `.katex` 폭을 측정해 16px 안전 여유를 두고
축소한다. 하지만 렌더 글자가 12px 아래로 내려가는 축소는 허용하지 않는다.
그 폭으로도 들어오지 않는 top-level 관계식은 괄호·중괄호 depth를 보존한 채
관계 연산자에서 여러 행으로 바꾼다. `\to`가 `\top`의 prefix로 잘못
인식되던 command boundary도 별도로 막았다.

### 최종 브라우저 영수증

```yaml
topdown_formula_viz_final:
  report: ".codex-tmp/topdown-formula-viz-audit-final-2026-07-31.json"
  routes: 136
  viewport_checks: 272
  viewports:
    - "360x800 mobile"
    - "1440x900 desktop"
  viz_surfaces: 894
  svg_surfaces: 121
  formulas: 1418
  errors: 0
  warnings: 0
  verified:
    - "formula overflow"
    - "visible formula font size"
    - "한국어 FormulaNote pairing"
    - "KaTeX parse error"
    - "raw LaTeX"
    - "Viz/SVG clipping과 overlap"
```

390px 모바일, 768px tablet과 1440px desktop은 별도 screenshot으로도
확인했다.

```yaml
visual_receipts:
  - ".codex-tmp/final-visual-qa/llm-harness-evidence-mobile.png"
  - ".codex-tmp/final-visual-qa/diffusion-posterior-mobile.png"
  - ".codex-tmp/final-visual-qa/mdp-markov-mobile.png"
  - ".codex-tmp/final-visual-qa/neural-network-mobile.png"
  - ".codex-tmp/final-visual-qa/ai-path-desktop.png"
  - ".codex-tmp/final-visual-qa/ai-path-tablet.png"
  - ".codex-tmp/final-visual-qa/backprop-tablet.png"
```

정보 구조 QA에서는 실제 제품 경로가 아니라 테스트 선택자의 순서 의존성이
발견됐다. Robot AI 연구 경로 안에서 `?track=robot-ai`가 붙은 첫 링크를
누르면 최신 연구 해설로 갈 수 있으므로, 테스트가 의도한
`robot-ai-top-down`을 보장하지 못했다. 정확한 href를 선택하도록 고친 뒤
desktop/mobile 계약은 실패 0건으로 통과했다.

```yaml
release_checks:
  information_architecture:
    report: ".codex-tmp/ai-information-architecture-qa-final.json"
    viewports: 2
    failures: 0
  typecheck_and_build:
    command: "npm run build:tsc"
    result: pass
    residual: "900kB보다 큰 일부 기존 chunk warning"
  learning_flow_static_audit:
    registered: 615
    release_blockers: 29
    blocker_scope: "전부 blockchain category의 기존 FormulaNote backlog"
    ai_release_blockers: 0
```

### 4B·9B로 좁혀 재실행하는 packet

4B 모델은 긴 식을 직접 고치지 않고 한 수식의 렌더·의미 결함만 분류한다.
9B 모델은 그 분류와 주변 두 문단을 받아 의미 단위로 다시 쓴다.

```yaml
formula_4b_auditor:
  input:
    - "display formula 하나"
    - "바로 앞 문단"
    - "FormulaNote"
    - "360px에서 측정한 width, font-size, overflow"
  output:
    issue: "none | too-wide | too-small | missing-ko-role | missing-note | parse"
    longest_semantic_unit: "폭을 만드는 항"
    required_intermediates: ["분리해야 할 중간량 이름"]
  forbidden:
    - "수학적 동등성 검증 없이 식 수정"
    - "font-size 축소만 제안"

formula_9b_rewriter:
  input:
    - "4B audit record"
    - "원 식"
    - "주변 설명과 symbol table"
  output:
    - "동등한 단계형 KaTeX"
    - "각 단계의 짧은 한국어 역할명"
    - "갱신된 symbol table"
    - "변환 전후 동등성 설명"
  verifier:
    - "TypeScript compile"
    - "KaTeX parse"
    - "360/768/1440 render"
    - "visible font >= 12px"
    - "overflow = 0"
    - "FormulaNote adjacency와 한국어 의미"
```

Claude closure queue는 이 로컬 검증과 별개다. 2026-07-31 02:30 KST 재시도도
Context Manager HTTP 200 뒤 provider monthly limit로 중단됐고 article
worker는 시작하지 않았다. 유효 receipt가 오기 전까지 125개 job의 기존
상태를 ACCEPT로 올리지 않는다.

## 2026-07-31 공개 배포 직전 레거시 경로 폐쇄

136개 top-down registry 경로 감사에서 오류가 0건이어도 사용자가 직접
지목한 오래된 URL까지 자동으로 포함된다는 뜻은 아니었다. 공개 서버에서
핵심 URL을 별도 표본 검사하자 `backprop-optimization`,
`neural-network`, `perceptron`에서 수식과 한국어 해설의 구조적 연결이
빠져 있었다. 수식 폭이나 KaTeX 렌더 실패가 아니라 감사 범위의 문제였다.

```yaml
scope_failure:
  cause: "registry-derived top-down route set가 일부 legacy article URL을 포함하지 않음"
  false_assumption: "등록된 학습 경로 감사가 모든 공개 article URL 감사를 대신함"
  user-visible_risk:
    - "수식은 보이지만 어느 한국어 설명이 그 식을 해설하는지 기계적으로 확인할 수 없음"
    - "동적 Viz 안의 식과 현재 단계 설명이 별개 DOM으로 남음"
  corrected_route_source:
    union:
      - "top-down registry routes"
      - "전체 공개 article registry"
      - "사용자가 직접 지목한 production URLs"
      - "최근 변경 파일에서 역추적한 routes"
```

수식 안의 `\underbrace{...}_{\text{한글 역할}}`는 항의 역할을 빠르게 읽는
표시이고, 식 밖의 `FormulaNote`는 왜 이 식을 쓰는지와 기호가 무엇인지
설명하는 독해 장치다. 둘 중 하나가 있다고 다른 하나를 생략한 것으로
간주하지 않는다. 여러 식이 하나의 논리 단위를 이룰 때는
`data-formula-pair`로 묶고, 동적 Viz의 현재 상태 설명은
`data-formula-note`로 명시한다.

```yaml
legacy_formula_closure:
  local_backprop_neural:
    report: ".codex-tmp/legacy-foundations-formula-note-after.json"
    routes: 2
    checks: 4
    formulas: 54
    errors: 0
    warnings: 0
  local_perceptron:
    report: ".codex-tmp/perceptron-formula-note-after.json"
    routes: 1
    checks: 2
    viz_surfaces: 8
    svg_surfaces: 8
    formulas: 18
    errors: 0
    warnings: 0
```

최종 프로덕션 빌드는 8,575 modules를 변환했고 타입 검사와 Vite 빌드가
성공했다. 배포 뒤 로컬 `dist/index.html`과 공개 `index.html`의 SHA-256을
직접 비교해 동일한 번들 진입점임을 확인했다.

```yaml
production_release:
  deployed_at: "2026-07-31 03:03 KST"
  service: "cm-blog.service"
  status: "active"
  index_sha256: "1069e350ca1da73c0ca4c459f224a44073a0190f68b4e1ba34d408c71c045304"
  javascript: "/lab/assets/index-BPSzWN3p.js"
  stylesheet: "/lab/assets/index-CIATnB9F.css"
  focused_formula_viz_audit:
    report: ".codex-tmp/production-formula-viz-final-zero.json"
    routes:
      - "/lab/blog/ai/backprop-optimization"
      - "/lab/blog/ai/neural-network"
      - "/lab/blog/ai/perceptron"
      - "/lab/blog/ai/diffusion-models"
      - "/lab/blog/ai/llm-architecture-gallery"
    viewport_checks: 10
    viz_surfaces: 62
    svg_surfaces: 8
    formulas: 132
    errors: 0
    warnings: 0
  information_architecture:
    report: ".codex-tmp/ai-information-architecture-qa-production-final.json"
    viewports: 2
    failures: 0
```

### 작은 모델에 추가할 범위 감사 단계

4B 분류기나 9B 작성기가 글 자체를 잘 고쳐도 입력 route가 누락되면 결과는
완전하지 않다. 따라서 article worker보다 먼저 deterministic scope worker를
실행한다.

```yaml
route_scope_worker:
  model: "불필요, 정적 스크립트 우선"
  inputs:
    - "article registry"
    - "top-down curriculum registry"
    - "sidebar href"
    - "user-mentioned URL log"
    - "changed TSX files"
  output:
    - "canonical URL 합집합"
    - "각 URL의 포함 근거"
    - "중복 및 redirect"
    - "어느 감사에서 검사됐는지"
  gate:
    - "포함 근거 없는 공개 article URL = release blocker"
    - "사용자 지목 URL 미검사 = release blocker"
```

03:00 KST Context Manager 재시도도 전송 계층은 HTTP 200이었지만 Claude
provider harness가 code 1로 끝났다. 새 request/result/http 영수증은
`preflight/20260731T030025+0900.*`에 남았고, 완료 progress는 여전히
0/125다. 이는 로컬 및 프로덕션 검증 통과와 합치지 않는다. timer가 큐를
보존하고 있으며 유효 Claude 결과가 생기기 전까지 상태 승격을 금지한다.

## 2026-07-31 전체 AI 학습 그래프 소유권 폐쇄

공개 글의 분량이나 개별 완성도와 별개로, 독자가 사이드바에서 들어왔을 때
“왜 이 글을 지금 읽는가”를 설명하는 경로가 없는 핵심 글이 있었다. 이를
눈으로 목록을 훑지 않고 article registry, learning path, research track,
sidebar stage의 합집합으로 검사했다.

초기 감사에서 304개 AI 글 가운데 다음 네 핵심 글이 어떤 learning path나
research track에도 속하지 않았다.

```yaml
initial_unowned_core:
  systems-foundation-map:
    problem: "전체 지도가 아닌 공통 분해 관점인데 독립 경로가 없었음"
  moe-ssd-streaming:
    problem: "MoE와 storage I/O를 잇는 현재 사례가 LLM 아키텍처 경로에서 고립됨"
  fft:
    problem: "신호·시스템 기반과 spectral 계산 사이의 연결이 끊김"
  qwen-korean-consistency:
    problem: "출력 실패 사례에서 tokenizer·확률·post-training으로 내려가는 경로가 없음"
```

글을 억지로 하나의 긴 커리큘럼에 붙이지 않았다. 각 글이 답하는 현재 문제를
경로 제목으로 만들고, 필요한 최소 기반만 뒤에 배치했다.

```yaml
added_paths:
  ai-systems-reading-frame:
    order:
      - "systems-foundation-map"
    intent: "전체 지도가 아니라 낯선 AI 시스템을 분해하는 공통 읽기 프레임"
  ai-llm-moe-ssd-streaming:
    order:
      - "moe-ssd-streaming"
      - "llm-architecture-sparse-moe"
      - "hw-bandwidth-deep-dive (GPU category)"
    intent: "744B 실행 주장 → sparse activation → 실제 bandwidth 바닥"
  ai-signal-spectral-branch:
    order:
      - "signals-systems-convolution"
      - "fft"
    intent: "시간축 신호와 convolution → 주파수축 계산"
  ai-llm-korean-consistency:
    order:
      - "qwen-korean-consistency"
      - "tokenizer"
      - "probability-information-theory"
      - "post-training-rlvr"
    intent: "출력 언어 실패 → token 경계 → logit 확률 → 학습 신호"
  ai-document-runtime-current-first:
    inserted:
      - "olmocr-2"
    position: "OCR·Document AI 공통 지도 다음, PaddleOCR-VL 이전"
```

과거 원문 재구성 6개는 의도적으로 필수 경로에 넣지 않았다. Perceptron,
Backprop, Adam, AdamW, Autoencoder, FFT 원문까지 전부 필수로 노출하면
사용자가 지적한 “기반의 기반을 끝없이 내려가는 문제”가 다시 생긴다. 이들은
필요할 때만 여는 선택 원문이며, 최소 기준선 아래로 감춘 상태가 정상이다.

```yaml
graph_receipt:
  report: ".codex-tmp/ai-learning-graph-predeploy.json"
  totals:
    top_level_subcategories: 21
    all_subcategories: 103
    ai_articles: 304
    learning_paths: 125
    research_tracks: 19
    sidebar_stages: 4
  release_findings:
    unowned_core_articles: 0
    declared_path_missing: 0
    declared_elsewhere: 0
    unresolved_learning_steps: 0
    unresolved_track_references: 0
    duplicate_path_ownership: 0
  intentionally_optional_sources: 6
```

감사 스크립트도 multi-path 재사용을 오류로 세던 부분을 고쳤다. 한 글이
선언된 주 경로에 실제로 들어 있고 다른 목표 경로에서도 기반으로 재사용되면
정상이다. 이제 `articlesInPathButDeclaredElsewhere`는 선언된 주 경로 자체가
소유하지 않을 때만 오류를 낸다. 추가 경로 재사용은 정보성 목록으로 분리한다.

### 새 경로 수식과 카드 UI 검산

새로 연결한 FFT와 Qwen 글에는 이미 수식 해설 문장이 있었지만 DOM에서 어느
수식의 설명인지 연결되지 않은 그룹이 있었다. DFT 입력·출력, alias,
주파수 해상도, STFT와 Qwen Smoothie·reward 식을 `data-formula-pair`와
`data-formula-note`로 묶었다.

```yaml
focused_local_receipt:
  report: ".codex-tmp/unowned-core-viz-after-routing.json"
  routes: 5
  viewport_checks: 10
  viz_surfaces: 30
  svg_surfaces: 10
  formulas: 52
  errors: 0
  warnings: 0
```

태블릿 경로 카드에서는 LLM thumbnail의 SVG `viewBox=120x80`이
`max-width/max-height`만 있는 wrapper 안에서 실제로 축소되지 않았다.
부모의 40px 영역이 SVG 아래쪽 `y=54..68` 내용을 잘라 빈 상자처럼 보였다.
wrapper를 40x40으로 고정하고 자식 SVG를 100% 크기로 맞춰 좌표계를
정상적으로 축소했다.

### 학습 그래프를 작은 모델로 관리하는 packet

이 단계는 prose 생성보다 먼저 결정론적으로 실행해야 한다. 4B 모델은
경로를 창작하지 않고 정적 감사 결과를 한 문제 단위로 분류한다. 9B 모델은
현재 글과 후보 기반의 이유를 비교해 최소 경로 제안을 만든다.

```yaml
graph_4b_classifier:
  input:
    - "article slug, title, summary, prerequisites"
    - "declared learningPath와 learningPaths"
    - "실제 path membership"
    - "research track membership"
    - "curriculumRole"
  output:
    state: "owned | unowned-core | optional-source | broken-reference | legitimate-shared"
    current_question: "이 글이 직접 해결하는 한 문장 문제"
    evidence: "registry field와 membership ID"
  forbidden:
    - "제목 유사도만으로 경로 배치"
    - "source 글을 자동으로 필수 경로에 승격"

graph_9b_path_designer:
  input:
    - "4B classification"
    - "현재 글의 sections와 prerequisites"
    - "기존 path 후보와 step question"
    - "사용자가 원하는 현재→최소 기반 규칙"
  output:
    path_title: "현재 문제를 드러내는 제목"
    order:
      - "현재 실패·목표 글"
      - "직접 메커니즘"
      - "계산에 필요한 최소 기반"
    stop_rule: "이 아래의 역사 원문은 선택 자료로 감추는 이유"
    rejection_notes: "붙이지 않은 인접 경로와 이유"
  verifier:
    - "unowned core = 0"
    - "unresolved steps = 0"
    - "각 step의 question이 이전 step의 막힘을 해소"
    - "동일 글 재사용은 명시적 learningPaths 또는 비충돌 공유"
    - "모바일·태블릿·데스크톱에서 path 제목·순서·카드가 overflow 없음"
```

### 03:15 KST 증분 배포 영수증

```yaml
incremental_release:
  deployed_at: "2026-07-31 03:15 KST"
  service: "cm-blog.service"
  status: "active"
  index_sha256: "3656ac1ca8c79d5cc9c16192dd888fab3b989d18d8e5a3041970a67a57704925"
  javascript: "/lab/assets/index-8-j5C1RO.js"
  stylesheet: "/lab/assets/index-B4CfN8Vd.css"
  transport:
    lab_blog_html: 200
    referenced_assets: 200
    legacy_blog_redirect: 308
  information_architecture:
    report: ".codex-tmp/ai-information-architecture-qa-production.json"
    viewports: 2
    failures: 0
  focused_formula_viz:
    report: ".codex-tmp/learning-routing-production-viz.json"
    routes: 5
    viewport_checks: 15
    viewports:
      - "360x800 mobile"
      - "768x1024 tablet"
      - "1440x900 desktop"
    viz_surfaces: 45
    svg_surfaces: 15
    formulas: 78
    errors: 0
    warnings: 0
  narrative:
    report: ".codex-tmp/learning-routing-production-narrative.json"
    step_viz: 15
    visual_surfaces: 45
    errors: 0
    warnings: 0
```

Claude closure queue 125개는 이 배포의 승인 근거가 아니다. 03:00 KST
preflight 기준 Context Manager endpoint는 HTTP 200이지만
`claude-code:sonnet` harness가 code 1로 실패했고 progress는 0/125다.
30분 timer와 source-hash validation을 유지해 provider가 복구되면 병렬
검증을 재개하되, 유효 JSON과 현재 source hash가 모두 맞는 결과만
반영한다.

## 2026-07-31 Claude 검증 범위를 304개 AI 글로 확장

125개 큐를 다시 대조하니 19개 research track에 포함된 current·canonical·
concept·foundation·implementation 글만 들어 있었다. Learning path에만
속한 `systems-foundation-map`, `moe-ssd-streaming`, `fft`,
`qwen-korean-consistency`는 빠져 있었다. 따라서 이 큐는 모든 AI 글을
검증한다는 요구의 영수증이 될 수 없었다.

전체 registry 영수증을 계산하는 과정에서 감사기 자체의 세 결함도 고쳤다.

```yaml
receipt_auditor_repairs:
  progress_discovery:
    before: "정확히 progress.jsonl인 파일만 읽음"
    after: "모든 *.jsonl에서 strict completed receipt를 찾음"
  worker_gate:
    before: "문서에는 Claude-only라고 썼지만 코드가 worker를 검사하지 않음"
    after: "worker == claude-code:sonnet만 인정"
  article_registry:
    before: "정규식과 category 없는 slug key"
    failures:
      - "객체 field 순서가 다르면 인접 article을 가로질러 매칭 가능"
      - "AI fft가 Blockchain fft에 덮어써짐"
      - "비공개 vllm-test-units가 들어가 총수 304만 우연히 유지"
    after:
      - "TypeScript AST로 같은 object의 slug/title/subcategory/component import를 읽음"
      - "runtime AI learning-graph slug 집합으로 공개 registry를 제한"
      - "metadata source는 src/content/ai에서만 소유"
  cross_category_track:
    before: "GPU foundation을 AI registry 누락으로 오판"
    after: "track dependency 중 category가 ai인 항목만 AI source closure에 포함"
```

현재 hash를 다시 계산한 결과는 다음과 같다.

```yaml
all_ai_claude_receipt_scope:
  registered_articles: 304
  current_strict_closure_accept: 17
  queued_for_revalidation: 287
  queue_breakdown:
    drift: 30
    unverified: 182
    partial: 50
    review_required: 25
  optional_historical_sources_queued: 6
  empty_source_jobs: 0
  unique_source_files: 790
  queue:
    manifest: ".codex-tmp/claude-ai-learning-closure-audit-2026-07-31/manifest.json"
    summary: ".codex-tmp/claude-ai-learning-closure-audit-2026-07-31/queue-summary.json"
    progress: ".codex-tmp/claude-ai-learning-closure-audit-2026-07-31/progress.jsonl"
```

각 job은 article local import closure, metadata file, 존재할 경우 content spec을
읽는다. Learning path 이름과 현재 step 위치, research track role을 scope에
함께 넣는다. 숨긴 과거 원문은 “필수 경로로 승격하지 말고 bounded accuracy만
검증”한다고 명시해 검증과 노출을 분리했다.

기존 125개 부분 큐 timer는 중지했다. 새 통합 timer만 남겨 중복 호출을
막았다.

```yaml
claude_retry_runtime:
  unit: "cm-blog-claude-ai-learning-closure-retry.timer"
  status: "active"
  parallel_workers: 6
  retry_interval: "30 minutes"
  next_trigger_at_creation: "2026-07-31 03:55:43 KST"
  preflight_receipt: ".codex-tmp/claude-ai-learning-closure-audit-2026-07-31/preflight/20260731T032535+0900.result.json"
  context_manager_http: 200
  progress: "0/287"
  blocker: "Claude Code account monthly spend limit"
```

Context Manager 경로와 별도로 같은 harness argument를 Claude CLI에 직접
넣어 진단했을 때 `You've hit your monthly spend limit`가 출력되고 exit 1로
끝났다. 따라서 현재 0/287은 API 500, queue manifest, 병렬 xargs 또는
workdir 결함이 아니라 provider account limit 때문이다. Timer는 preflight가
정확히 `OK`를 반환하기 전에는 article worker를 하나도 시작하지 않으므로
287개 실패 로그를 만들지 않는다. 한도가 복구되면 6개씩 실행하고, strict
verdict와 before/after source hash가 모두 유효한 결과만 progress에
승격한다.

## 2026-07-31 304개 정적 숙달 감사 보정과 최저점 2개 글 재작성

### 감사기의 거짓 음성부터 제거

초기 `audit-ai-mastery-coverage.mjs` 결과는 304개 중 44개를 약한 글로
분류했다. 그러나 표본을 직접 읽어 보니 글 자체가 아니라 감사기의 탐지
범위 때문에 낮게 평가된 항목이 섞여 있었다. 작은 모델이 이 작업을
재현할 때에도 "점수가 낮다 = 글이 나쁘다"로 바로 결론 내리지 않고,
먼저 탐지 규칙과 실제 DOM·AST를 대조해야 한다.

```yaml
mastery_auditor_repairs:
  source_role:
    problem: "paper/research/reference 계열 slug의 원문 역할을 누락"
    correction: "명시 metadata가 없을 때 source-role fallback 적용"
  learning_handoff:
    problem: "React Router Link와 articlePath() 연결을 일반 텍스트로 오판"
    correction: "실제 내부 학습 링크를 handoff로 계산"
  controlled_viz:
    problem: "공유 StepViz/AnimatedArticleViz를 article-local Viz가 아니라고 누락"
    correction: "공유 controlled Viz 사용을 별도 계수"
```

보정 후 실제로 깊이가 부족한 글은 다음 두 개만 남았다.

```yaml
lowest_real_gaps:
  - slug: "systems-foundation-map"
    score_before: 64
    reason: "시스템을 읽는 질문은 있었지만 진단 절차·예시·출처·다음 경로가 얕음"
  - slug: "sulphur-2"
    score_before: 66
    reason: "최신 모델 카드의 주장 경계와 공정한 비교 절차가 충분히 분리되지 않음"
```

재작성 후 정적 선택 감사 결과는 다음과 같다.

```yaml
all_ai_mastery_static_receipt:
  report: ".codex-tmp/ai-mastery-all-304-final-local.json"
  registered_articles: 304
  weak_articles: 0
  score_buckets:
    under_50: 0
    50_to_74: 0
    75_to_89: 74
    90_or_more: 230
  track_references: 196
  weak_track_references: 0
  caveat: "선택 휴리스틱 통과이지 304개 전부의 Claude 의미 검증 완료를 뜻하지 않음"
```

### `systems-foundation-map`: 전체 지도가 아니라 30분 진단 프레임

이 글은 모든 분야를 한 화면에 나열하는 "전체 지도"로 만들지 않았다.
시스템 글을 처음 만난 독자가 30분 안에 입력, 상태, 계산 소유자, 경계
계약, 검증 지점을 찾게 하는 저자 설계 진단 프레임으로 역할을 고정했다.

```yaml
systems_foundation_rewrite:
  content_spec: "src/pages/articles/ai/systems-foundation-map/content-spec.md"
  article: "src/pages/articles/ai/systems-foundation-map.tsx"
  viz: "src/pages/articles/ai/systems-foundation-map/SystemsReadingViz.tsx"
  teaching_order:
    - "택배 비유로 입력·상태·계산·경계·검증을 먼저 설명"
    - "다섯 질문을 읽는 순서로 시각화"
    - "응답 시간을 원인별로 분해한 한글 주석 수식"
    - "첫 고장과 연쇄 증상을 분리하는 진단 실험"
    - "GPU HPC, Knowledge, Robot AI, RLVR, MoE SSD에 같은 틀 적용"
    - "다음 글을 선택하는 유한 stop rule"
  annotated_equation:
    form: "T_response = T_repr + T_compute + T_transfer + T_wait + T_verify"
    intent: "각 시간 항의 역할과 합산이 과대평가되는 overlap/critical-path 예외를 함께 설명"
  source_intent:
    - "NASA Systems Engineering Handbook: 시스템 경계와 생명주기 관점"
    - "Google Hidden Technical Debt in ML Systems: 모델 밖 결합과 운영 부채"
    - "Google ML Test Score: 검증을 독립 구성요소로 보는 근거"
    - "ROS 2 QoS: 경계 계약이 실제 런타임 의미를 바꾸는 예"
  authorship_boundary: "다섯 질문 자체는 위 자료의 직접 인용 표준이 아니라 저자 합성"
  score_after: 100
```

Viz는 축소된 전체 구조를 모바일에 억지로 집어넣지 않았다. 모바일에서는
현재 단계만 상세히 열고 다섯 단계 이름은 항상 남겼다. 데스크톱은 가로
흐름, 모바일은 세로 흐름으로 바꾸고 내부 스크롤은 만들지 않았다.
진단 실험의 마지막 홀수 카드도 작은 화면에서 빈 회색 셀이 남지 않도록
span 규칙을 따로 적용했다.

### `sulphur-2`: 최신 소식과 검증된 사실의 경계를 시각화

2026-07-31 현재 공식 Hugging Face 모델 카드에는 여전히
`official inference for the model is coming soon`이라고 적혀 있다. 플랫폼이
자동 생성한 "Use this model" 코드와 `qwen35`, `9B params` 표시는 확인할 수
있지만, 이것을 모델 소유자가 공개한 완전한 비디오 추론 계약이나 정확한
prompt-enhancer 체크포인트라고 단정하지 않았다.

```yaml
sulphur_rewrite:
  content_spec: "src/pages/articles/ai/sulphur-2/content-spec.md"
  article: "src/pages/articles/ai/sulphur-2/Article.tsx"
  viz: "src/pages/articles/ai/sulphur-2/viz/SulphurEvidenceRouteViz.tsx"
  evidence_route:
    - "owner-authored model card"
    - "upstream LTX contract"
    - "artifact manifest"
    - "same-condition paired local run"
    - "claim ceiling"
  paired_equation:
    form: "Delta_m(c) = m(y_Sulphur;c) - m(y_LTX-2.3;c)"
    intent: "동일 manifest c에서 차이를 빼야 로컬 효과를 비교할 수 있음을 설명"
  forbidden_overclaim:
    - "자동 생성 integration snippet을 owner inference contract로 부르기"
    - "단일 프롬프트의 개선을 보편적 품질 우위로 일반화"
    - "full checkpoint와 training method를 같은 의미로 취급"
  score_after: 100
```

### 10:29 KST 증분 배포와 운영 브라우저 영수증

```yaml
incremental_release:
  deployed_at: "2026-07-31 10:29 KST"
  service: "cm-blog.service"
  status: "active"
  index_sha256: "58339e33b53dbc7eab0405e93ae55c1e5d8b1eea55bf3587974e6013173f0f38"
  javascript: "/lab/assets/index-DjN4j7yQ.js"
  stylesheet: "/lab/assets/index-C6D-DHQi.css"
  transport:
    lab_blog_html: 200
    referenced_assets: 200
    legacy_blog_redirect: 308
  production_viz:
    report: ".codex-tmp/two-priority-production-viz.json"
    routes: 2
    viewport_checks: 6
    visual_surfaces: 15
    formulas: 6
    svg_surfaces: 0
    errors: 0
    warnings: 0
  production_narrative:
    report: ".codex-tmp/two-priority-production-narrative.json"
    step_viz: 6
    visual_surfaces: 15
    errors: 0
    warnings: 0
  production_information_architecture:
    report: ".codex-tmp/ai-information-architecture-qa.json"
    viewports: 2
    failures: 0
```

이 배포에서도 Claude 287개 대기열은 승인 근거로 사용하지 않았다. 정적
감사, 빌드, 운영 브라우저 QA와 Claude 의미 검증은 서로 다른 영수증으로
유지한다. Claude 결과가 도착하면 source hash가 현재와 일치하는
`claude-code:sonnet` strict receipt만 반영하고, `REVISE`는 해당 글을 다시
수정한 뒤 동일한 로컬·운영 검증을 반복한다.

### Claude 사용량 재개 시각 고정

사용자 확인에 따라 2026-08-01 18:00 KST 전에는 Claude 사용량이 없다.
따라서 30분마다 실패하는 preflight를 보내지 않고, 기존 persistent
systemd timer의 다음 실행을 정확히 그 시각으로 옮겼다.

```yaml
claude_deferred_resume:
  reason: "2026-08-01 18:00 KST까지 Claude 사용량 없음"
  queue_size: 287
  parallel_workers: 6
  timer: "cm-blog-claude-ai-learning-closure-retry.timer"
  next_trigger: "2026-08-01 18:00:00 KST"
  timer_status: "active (waiting)"
  queue_progress_at_deferral: "0/287"
  preserved_gate: "Context Manager preflight가 정확히 OK일 때만 article worker 시작"
```

이 시각 전에는 정적·브라우저·원문 기반 감사를 계속한다. Claude 결과가
없는 글을 Claude가 검증했다고 표시하지 않는다.

## 2026-07-31 Speech · Audio 질문 허브 심화

### 왜 이 글을 다음 순서로 골랐는가

정적 선택 감사의 75–89점 구간 74개를 점수, curriculum role, current-first
경로 위치와 실제 누락 항목으로 정렬했다. `speech-audio-models`는 76점으로
가장 낮았고, 현재 음성 제품 진단 경로의 첫 core 글이면서 `sources`와
`depth`가 동시에 빠져 있었다.

기존 네 분기 구조는 옳았다. Interaction, generation, recognition,
representation을 한 직렬 코스로 다시 합치지 않았다. 부족한 부분은 증상에서
분기를 선택하는 중간 추론이었다. “말을 계속한다”는 표면 증상만으로는
ASR, turn policy, generation, transport와 speaker buffer 중 첫 원인을
고를 수 없었다.

```yaml
speech_hub_priority:
  slug: "speech-audio-models"
  role: "current-first core question router"
  score_before: 76
  missing_checks:
    - "sources"
    - "depth"
  preserved:
    - "독립적인 네 branch"
    - "필요할 때만 signals foundation을 여는 stop rule"
  added:
    - "current product contract와 public mechanism 분리"
    - "boundary event clock과 인접 시각 차이"
    - "첫 비정상 구간 기반 branch 선택"
    - "source intent와 claim ceiling"
    - "hard transfer를 푸는 controlled StepViz"
```

### 본문과 수식의 핵심 추론

현재 상단에는 OpenAI Presence가 공개한 업무·정책·권한·evaluation·human
escalation contract를 두었다. GPT-Live의 continuous full-duplex와
background delegation은 interaction mechanism으로 한 층 아래에 두었다.
두 공개 글을 proprietary token architecture의 근거로 확대하지 않았다.
Moshi는 공개 canonical mechanism, RFC 8834는 packet-loss·jitter 관측의
protocol evidence로만 사용했다.

Hidden transfer는 사용자가 agent 발화 중 “아니요”라고 정정하는 8 kHz
상담 trace다. Stable partial은 80 ms, cancel decision은 120 ms, 실제
speaker silence는 560 ms다. 본문은 다음 계산을 직접 수행할 수 있게
작성했다.

```yaml
speech_boundary_trace:
  events:
    t_i: "사용자 정정 입력, 0 ms"
    t_h: "stable partial, 80 ms"
    t_d: "cancel decision, 120 ms"
    t_s: "speaker silence, 560 ms"
  deltas:
    recognition_detection: "t_h - t_i = 80 ms"
    interaction_decision: "t_d - t_h = 40 ms"
    cancel_and_buffer_drain: "t_s - t_d = 440 ms"
  first_abnormal_interval: "cancel 이후 output runtime"
  next_branch: "realtime-duplex-voice-systems"
  deferred:
    - "CTC 변경"
    - "codec 변경"
  release_gate:
    - "interruption stop p95"
    - "cancel 뒤 stale playback 없음"
```

수식은 세 절대 timestamp를 단순 나열하지 않고 인접 시각을 뺀다. 뺄셈이
각 책임자의 구간 시간을 분리한다는 이유를 FormulaNote에 적었다. 합은 같은
critical path와 clock domain일 때만 전체 stop 시간과 같고, streaming
overlap이 있으면 다시 critical path를 찾아야 한다는 한계도 함께 두었다.

### Viz 판단과 직접 시각 검수

`SpeechFailureRoutingViz`는 SVG로 한 장 전체 구조를 축소하지 않았다.
Desktop에서는 네 event를 가로로, mobile에서는 세로로 배치한다. Step이
바뀌면 다음 내용이 실제로 바뀐다.

1. 표면 증상
2. 같은 trace의 네 event clock
3. 80/40/440 ms delta와 첫 비정상 구간
4. Interaction runtime branch 선택
5. Release evidence와 stop rule

첫 캡처에서 비활성 event와 delta 설명의 회색 대비가 약했다. 자동 overflow
감사에는 잡히지 않았으므로 opacity 의존을 제거하고 본문 대비를 높였으며,
페이지 안의 10 px 보조 문자를 11 px로 올렸다. 최종 캡처는 다음에 남겼다.

```yaml
speech_visual_receipts:
  screenshots:
    - ".codex-tmp/screenshots/speech-audio-models/desktop-trace-step3-contrast.png"
    - ".codex-tmp/screenshots/speech-audio-models/mobile-trace-step3-final.png"
    - ".codex-tmp/screenshots/speech-audio-models/mobile-full.png"
  interaction_assertions:
    branch_evidence_changes: true
    step_four_route_visible: true
    mobile_document_overflow: 0
```

### 점수, 빌드와 배포 영수증

```yaml
speech_hub_result:
  content_spec: "src/pages/articles/ai/speech-audio-models/content-spec.md"
  article: "src/pages/articles/ai/speech-audio-models.tsx"
  viz: "src/pages/articles/ai/speech-audio-models/SpeechFailureRoutingViz.tsx"
  metadata: "src/content/ai/articlesCurrentFlows.ts"
  score_after: 100
  prose_depth: 2623
  all_checks:
    question: true
    capability: true
    sources: true
    formula_notes: true
    viz: true
    causal_viz: true
    internal_links: true
    depth: true
  mastery_report: ".codex-tmp/ai-mastery-after-speech-2026-07-31.json"
  score_bucket_change:
    75_to_89: "74 -> 73"
    90_or_more: "230 -> 231"
  focused_eslint: "pass"
  full_typescript_vite_build: "pass"
  learning_flow_article_blockers: 0
  learning_flow_article_issues: 0
```

```yaml
speech_incremental_release:
  deployed_at: "2026-07-31 10:48 KST"
  service: "cm-blog.service"
  status: "active"
  index_sha256: "f7bd160eaf60ca99e2a62bc4157a0835ab69eba970633e19e3899b85d8d6f34e"
  javascript: "/lab/assets/index-rxG14pYM.js"
  stylesheet: "/lab/assets/index-CZSKBAHZ.css"
  transport:
    lab_blog_html: 200
    javascript: 200
    stylesheet: 200
    legacy_blog_redirect: 308
  production_viz:
    report: ".codex-tmp/speech-audio-models-production-viz.json"
    viewport_checks: 3
    visual_surfaces: 6
    formulas: 3
    errors: 0
    warnings: 0
  production_narrative:
    report: ".codex-tmp/speech-audio-models-production-narrative.json"
    step_viz: 3
    visual_surfaces: 6
    errors: 0
    warnings: 0
```

### 4B · 9B 재현 packet

4B worker는 한 증상에서 `event_name`, `timestamp`, `boundary_owner`,
`observable_evidence`, `claimed_success_metric`만 추출한다. 9B reviewer는
인접 시각 차이를 계산하고 `first_abnormal_interval`, `next_branch`,
`deferred_branches`, `claim_ceiling`, `stop_rule`을 판정한다. Orchestrator만
source freshness, learning path ID, FormulaNote 1:1 대응, 반응형 screenshot,
build와 production hash를 닫는다.

낮은 final WER나 자연스러운 audio sample처럼 관련 있어 보이는 metric도
현재 first abnormal interval을 반증하지 못하면 branch 선택 근거로 쓰지
않는다. 이 규칙이 작은 모델의 키워드 매칭을 causal diagnosis로 끌어올리는
최소 guardrail이다.

## 2026-07-31 Document AI page parser → release gate 재구성

### 왜 두 글을 한 batch로 골랐는가

`speech-audio-models` 배포 뒤 75–89점 core 글을 다시 정렬했다.
`paddleocr-vl`은 78점, `ocr-runtime-evaluation`은 82점이었다. 두 글 모두
본문, 질문, 출처와 학습 경로는 이미 유효했지만 `viz`와 `causalViz`가
없었다. 실제로는 article 파일 안에 작은 버튼 격자가 있었으나, 한 장의
상태표에 가깝고 각 단계의 입력·출력·정보 손실을 증명하지 못했다.

두 글을 별도 질문으로 유지했다.

- `paddleocr-vl`: page 안에서 정보가 어느 단계에 들어오고 사라지는가?
- `ocr-runtime-evaluation`: page 결과를 언제 production 검색에 공개해도
  되는가?

현재 학습 경로
`OCR 지도 → olmOCR 2 → PaddleOCR-VL → Donut → document assembly →
table reconstruction → runtime release`도 바꾸지 않았다. Page parser
architecture와 production release invariant가 서로 다른 책임이므로
통합하면 오히려 질문이 흐려진다.

```yaml
document_runtime_priority:
  path: "ai-document-runtime-current-first"
  preserved_step_count: 7
  paddleocr_vl:
    score_before: 78
    missing:
      - "viz"
      - "causalViz"
  ocr_runtime_evaluation:
    score_before: 82
    missing:
      - "viz"
      - "causalViz"
  decision:
    - "기존 깊은 본문과 source boundary 유지"
    - "인과관계 없는 작은 stage grid 제거"
    - "서로 다른 두 질문과 article route 유지"
    - "각 글에 별도 content spec과 StepViz 추가"
```

### 원문과 저자 synthesis의 경계

PaddleOCR-VL-1.6의 0.9B 크기, region-aware optimization,
progressive post-training과 공개 benchmark 주장은 공식 문서와 1.6
논문에만 귀속했다. 원 0.9B 보고서는 NaViT-style visual encoder,
ERNIE-4.5-0.3B와 element parsing 구조의 근거로 사용했다.
PP-DocLayoutV2 문서는 bbox·class·reading order의 page-level 책임까지만
근거로 삼았다. 이 자료들로 한국어 사내 corpus 성능이나 cross-page
correctness를 보장한다고 쓰지 않았다.

OCR runtime 글은 Ai2의 olmOCR 2 연구를 verifiable unit-test 방향의
근거로, PubTabNet/TEDS를 HTML table tree 평가의 근거로,
PP-StructureV3와 MinerU-Popo를 page parsing 및 document assembly
경계의 근거로 사용했다. Production의 네 release gate와 fail-closed
routing은 이 공개 결과를 업무 시스템에 연결한 저자 synthesis다.

```yaml
claim_ceilings:
  paddle_1_6:
    evidence: "official documentation + arXiv 2606.03264"
    allowed: "공개 architecture, training, vendor benchmark claim"
    forbidden: "내 문서에서 같은 정확도 보장"
  paddle_0_9b:
    evidence: "arXiv 2510.14528"
    allowed: "public page/element parsing mechanism"
    forbidden: "다른 vendor의 비공개 parser와 동일하다고 추정"
  olmocr_2:
    evidence: "Ai2 official article + technical report"
    allowed: "verifiable unit-test reward와 공개 평가 방향"
    forbidden: "모든 production business rule 대체"
  release_gate:
    evidence: "source-informed author synthesis"
    allowed: "운영 invariant와 review routing contract"
    forbidden: "논문 원문에 동일한 네 gate가 있다고 주장"
```

### 숨은 transfer에서 본문으로 역산한 내용

Paddle 글의 숨은 문제는 “원본 표에는 마지막 열이 있는데 VLM crop에는
없다”이다. 이 경우 첫 정보 손실은 recognition 뒤가 아니라 layout bbox
또는 crop boundary다. 본문과 Viz는 render DPI, detector bbox, crop image를
같은 trace에서 비교한 뒤에만 recognizer를 의심하도록 구성했다.

Runtime 글은 두 문서를 비교한다. A는 글자와 합계가 맞지만 page·bbox가
없고, B는 source trace가 있지만 subtotal 42와 total 47이 다르다.
A는 원문·citation path가 끊겨 `blocked`, B는 사람이 원문을 볼 수 있으나
table rule이 실패해 `review`다. 평균 confidence가 높아도 둘 다 자동
`release`하지 않는다.

본문의 식은 이 판단을 다음처럼 고정한다.

```text
release(d)
  = G_source(d)
  AND G_relation(d)
  AND G_table(d)
  AND G_citation(d)
```

실제 KaTeX에는 네 항 아래에 각각 `원문으로 돌아감`, `문서 관계 검증`,
`표 규칙 통과`, `검색 인용 연결`이라는 한글 underbrace가 있다.
FormulaNote는 각 기호와 AND의 이유를 설명한다. 하나라도 실패하면 다른
점수가 덮지 못하게 하는 것이 AND를 쓰는 목적이다.

### Viz를 색 변경이 아닌 실행 증거로 바꾼 방식

`PaddlePageParserViz`는 다음 여섯 장면으로 page artifact의 변화를
보여 준다.

1. Source hash, page, render DPI와 trace identity
2. Text·table·formula bbox와 reading order
3. Page identity를 보존한 element crop queue
4. Crop → NaViT encoder → ERNIE side → element output
5. 사람용 Markdown과 검증용 typed block
6. Verified page packet과 document assembler의 책임 경계

`OCRReleaseGateViz`는 다음 다섯 장면을 같은 scenario selector와
연결한다.

1. Typed page block과 provenance
2. `contains`, `continues`, `describes` document relation
3. Table occupancy와 subtotal/total 업무 규칙
4. RAG node에서 source crop까지의 citation path
5. 네 gate와 공개·검토·차단 receipt

처음에는 scenario selector를 StepViz 바깥에 두었다. 최종 gate에서 다른
상태와 비교하려면 위로 올라가야 하는 문제가 직접 캡처에서 보였다.
Selector를 모든 scene의 stage 안으로 옮겨 artifact를 보면서 즉시 상태를
바꿀 수 있게 수정했다.

중간 scene의 첫 캡처는 AnimatePresence가 끝나기 전에 찍혀 node 일부가
투명했다. 제품 결함과 검사 결함을 구분해, QA가 scene transition과 내부
stagger animation을 모두 기다린 뒤 안정 상태를 검사하도록 변경했다.
안정 상태에서는 네 node가 mobile에서 세로, desktop에서 가로로 모두
나타났다.

```yaml
document_runtime_visual_receipts:
  local_report: ".codex-tmp/document-runtime-viz-local.json"
  narrative_report: ".codex-tmp/document-runtime-narrative-local.json"
  viewport_route_checks: 6
  step_state_checks: 33
  document_overflow: 0
  viz_overflow: 0
  text_under_11px: 0
  runtime_errors: 0
  narrative_errors: 0
  narrative_warnings: 0
  scenario_content_changes: true
  screenshots:
    - ".codex-tmp/screenshots/document-runtime/paddleocr-vl-desktop-final.png"
    - ".codex-tmp/screenshots/document-runtime/paddleocr-vl-mobile-final.png"
    - ".codex-tmp/screenshots/document-runtime/paddleocr-vl-mobile-middle.png"
    - ".codex-tmp/screenshots/document-runtime/ocr-runtime-evaluation-desktop-final.png"
    - ".codex-tmp/screenshots/document-runtime/ocr-runtime-evaluation-mobile-final.png"
    - ".codex-tmp/screenshots/document-runtime/ocr-runtime-evaluation-mobile-middle.png"
```

### 정적 결과와 배포 영수증

```yaml
document_runtime_result:
  paddleocr_vl:
    content_spec: "src/pages/articles/ai/paddleocr-vl/content-spec.md"
    article: "src/pages/articles/ai/paddleocr-vl.tsx"
    viz: "src/pages/articles/ai/paddleocr-vl/PaddlePageParserViz.tsx"
    score_after: 100
    prose_depth: 2815
  ocr_runtime_evaluation:
    content_spec: "src/pages/articles/ai/ocr-runtime-evaluation/content-spec.md"
    article: "src/pages/articles/ai/ocr-runtime-evaluation.tsx"
    viz: "src/pages/articles/ai/ocr-runtime-evaluation/OCRReleaseGateViz.tsx"
    score_after: 100
    prose_depth: 2648
  mastery_report: ".codex-tmp/ai-mastery-after-document-runtime-2026-07-31.json"
  all_checks:
    question: true
    capability: true
    sources: true
    formula_notes: true
    viz: true
    causal_viz: true
    internal_links: true
    depth: true
  score_bucket_change:
    75_to_89: "73 -> 71"
    90_or_more: "231 -> 233"
  focused_eslint: "pass"
  full_typescript_vite_build: "pass"
```

```yaml
document_runtime_release:
  deployed_at: "2026-07-31 11:07 KST"
  service: "cm-blog.service"
  status: "active"
  index_sha256: "709e8b507974b83181e0c465f5f3608f4580797a01dab1db5d1700528311e136"
  javascript: "/lab/assets/index-lBygFTAw.js"
  stylesheet: "/lab/assets/index-CF8G0fCp.css"
  production_hash_matches_local: true
  transport:
    lab_html: 200
    javascript: 200
    stylesheet: 200
    lab_blog: 200
  production_viz:
    report: ".codex-tmp/document-runtime-viz-production.json"
    viewport_route_checks: 6
    step_state_checks: 33
    failures: 0
  production_narrative:
    report: ".codex-tmp/document-runtime-narrative-production.json"
    checks: 6
    errors: 0
    warnings: 0
```

### 4B · 9B 재현 packet

4B worker는 source page와 각 intermediate artifact에서 다음 필드만
추출한다.

```yaml
artifact_trace:
  artifact_id: ""
  parent_artifact_id: ""
  owner_stage: ""
  page: null
  bbox: null
  crop_ref: null
  parser_revision: ""
  observed_value: ""
  failed_invariant: null
```

9B reviewer는 인접 artifact를 비교해 `first_information_loss`,
`responsible_stage`, `do_not_change_yet`, `next_article`을 판정한다.
Release 단계에서는 네 gate를 독립 boolean으로 계산하고
`release`, `review`, `blocked`를 고른다. Source trace가 없으면
`blocked`, source는 있으나 업무 규칙이 실패하면 `review`, 네 gate가
모두 참일 때만 `release`다.

Orchestrator만 source freshness와 claim ceiling, learning-path ownership,
FormulaNote 대응, desktop/tablet/mobile screenshot, production asset hash를
닫는다. 작은 모델이 “OCR 점수 높음 → 성공”으로 바로 점프하지 못하도록
모든 판정은 intermediate artifact의 identity와 실패 invariant를 함께
제출해야 한다.

## 2026-07-31 Stable Diffusion · 모델 이름표에서 실행 경계로

대상은 `stable-diffusion-open-models`다. 이 글은 최신 이미지 모델 목록과
합치지 않았다. 질문이 “지금 무엇이 제일 좋은가”가 아니라 “공개된 latent
diffusion 계열을 어떤 실행 경계와 교체 가능한 부품으로 읽는가”이기
때문이다. 이 경계를 지키지 않으면 SD 1.x, SDXL, SD3/3.5를 한 표에 넣고
크기만 비교하게 되고, 다른 family로 옮길 때 무엇을 그대로 가져가면
안 되는지 설명할 수 없다.

### 작성 의도와 claim ceiling

글의 뼈대는 다음 두 층으로 분리했다.

1. LDM에서 이어지는 공통 실행 계약:
   text condition, noisy latent, denoiser prediction, solver step, VAE decode
2. family마다 다시 확인해야 하는 구현 선택:
   text encoder, denoiser topology, prediction target, scheduler semantics,
   adapter target

저자 종합 판단은 “Stable Diffusion은 하나의 고정 모델이 아니라 교체
가능한 실행 계약을 학습하기 좋은 공개 기준선”이라는 문장이다. 반대로
현재 최고 품질, 특정 상용 제품의 내부 구조, 비공개 학습 데이터에
관해서는 주장하지 않는다.

근거는 발표 블로그의 마케팅 문장보다 1차 문서에 우선순위를 두었다.

- Latent Diffusion Models: `arXiv:2112.10752`
- SDXL: `arXiv:2307.01952`, OpenReview
- SD3의 rectified flow와 MMDiT: `arXiv:2403.03206`
- SD3.5 공개 범위: Stability AI 공식 release
- 2026-05-20 현재 core model catalog: Stability AI 공식 catalog

따라서 SD 1.x에서 익힌 U-Net LoRA target이나 epsilon prediction 설정을
SD3.5에 그대로 적용해도 된다는 식의 확장은 금지했다.

### 본문만으로 풀어야 하는 숨은 전이 문제

작성 전에 다음 문제를 답안이 아니라 coverage probe로 사용했다.

1. 같은 seed와 scheduler인데 prompt token 하나가 잘렸다면 최초 변화는
   VAE가 아니라 어느 artifact에서 나타나는가?
2. denoising 마지막 latent가 동일한데 RGB만 다르면 어느 component를
   먼저 조사해야 하는가?
3. model weight는 같은데 scheduler만 바꾼 두 이미지를 “모델 성능 차이”로
   불러도 되는가?
4. SDXL adapter를 SD3.5로 옮길 때 무엇을 상속하고 무엇을 다시 골라야
   하는가?

본문과 Viz는 각각 condition artifact, latent artifact, denoiser output,
solver transition, decoded RGB를 이름과 shape로 남긴다. 독자는 첫 변화
경계를 찾은 뒤 owner를 정할 수 있어야 한다. 정답을 외우는 대신
“인접 artifact 비교 → 최초 변화 → 책임 component → 아직 바꾸지 않을
component” 순서로 문제를 좁히도록 설계했다.

### 표를 계보와 실행 장면으로 바꾼 이유

기존 version table은 모델 이름과 특징을 한 화면에서 비교할 수 있었지만,
다음 글로 전이되는 이해를 만들지 못했다. 이를 `FamilyMilestones` 네
단계로 바꿨다.

1. SD 1.x: latent diffusion 공개 기준선
2. SD 2.x: text encoder와 prediction 설정 변화
3. SDXL: larger U-Net과 dual text conditioning
4. SD3/3.5: MMDiT와 rectified-flow 계열의 새 선택

각 milestone은 `질문`, `상속`, `변경`, `그대로 복사하면 안 되는 것`을
동시에 보여 준다. 즉 계보는 연도 목록이 아니라 이전 family에서 생긴
한계를 다음 family가 어디에서 다시 선택했는지 읽는 경로다.

`StableDiffusionRuntimeViz`는 다섯 scene으로 실행 artifact를 추적한다.

1. prompt → tokens → text encoder → condition `c`
2. seed → latent `[1,4,64,64]`
3. `z_t, t, c` → denoiser → predicted noise/velocity
4. solver가 `z_t → z_{t-1}`를 반복
5. final latent → VAE decoder → RGB

각 scene에는 owner, output, 고정된 변수를 적은 artifact receipt가 있다.
`StableDiffusionArchitectureViz`는 다음 다섯 경계를 비교한다.

1. 외부에서 본 공통 denoiser contract
2. U-Net의 multi-resolution path
3. skip connection과 cross-attention의 서로 다른 정보 경로
4. MMDiT의 modality stream과 joint attention
5. family migration에서 상속할 계약과 다시 선택할 부품

### 반응형 시각 설계 판단

초기 mobile 구현은 desktop의 수평 파이프라인을 그대로 세로로 쌓아
condition scene이 961px, solver scene이 1065px까지 길어졌다. 잘리지는
않았지만 한 장면의 원인과 결과를 같은 화면에서 비교하기 어려웠다.
mobile/tablet에서는 두 장면을 번호가 있는 `2 x 2` sequence로 재구성하고,
desktop에서는 얇은 곡선 context path와 수평 causal path를 유지했다.

```yaml
stable_diffusion_stage_heights:
  runtime:
    desktop: [380, 546, 383, 453, 394]
    tablet: [483, 780, 697, 557, 707]
    mobile: [638, 757, 832, 700, 842]
  architecture:
    desktop: [360, 360, 360, 360, 462]
    tablet: [693, 756, 542, 734, 462]
    mobile: [709, 780, 695, 730, 690]
```

색은 component owner를 구분하는 제한된 semantic accent로만 쓰고, 선의
두께·node padding·11px 최소 글자·식별 가능한 arrow end를 우선했다.
mobile에서 긴 수식과 shape는 줄바꿈 가능한 별도 receipt 영역에 두었다.
장식 카드나 큰 빈 공간으로 scene 높이를 채우지 않았다.

### 정적 결과와 배포 영수증

```yaml
stable_diffusion_result:
  article: "src/pages/articles/ai/stable-diffusion-open-models.tsx"
  content_spec: "src/pages/articles/ai/stable-diffusion-open-models/content-spec.md"
  runtime_viz: "src/pages/articles/ai/stable-diffusion-open-models/StableDiffusionRuntimeViz.tsx"
  architecture_viz: "src/pages/articles/ai/stable-diffusion-open-models/StableDiffusionArchitectureViz.tsx"
  mastery_report: ".codex-tmp/ai-mastery-after-stable-diffusion-2026-07-31.json"
  score: "78 -> 100"
  prose_depth: 4876
  all_checks:
    question: true
    capability: true
    sources: true
    formula_notes: true
    viz: true
    causal_viz: true
    internal_links: true
    depth: true
  score_bucket_change:
    75_to_89: "71 -> 70"
    90_or_more: "233 -> 234"
  focused_eslint: "pass"
  full_typescript_vite_build: "pass"
```

```yaml
stable_diffusion_release:
  deployed_at: "2026-07-31 11:30 KST"
  service: "cm-blog.service"
  status: "active"
  index_sha256: "9ff971c149f9f420e93e8be19189c8bf713face71d8d9de23fe5d5fdbbe13236"
  javascript: "/lab/assets/index-DgjiknvN.js"
  stylesheet: "/lab/assets/index-CM9ffSZr.css"
  article_chunk: "/lab/assets/stable-diffusion-open-models-BLAaIiVF.js"
  production_hash_matches_local: true
  transport:
    article_html: 200
    legacy_blog_redirect: 308
    javascript: 200
    stylesheet: 200
    article_chunk: 200
  production_viz:
    report: ".codex-tmp/stable-diffusion-viz-production.json"
    viewport_route_checks: 6
    step_state_checks: 30
    failures: 0
  production_narrative:
    report: ".codex-tmp/stable-diffusion-narrative-production.json"
    viewport_checks: 3
    errors: 0
    warnings: 0
```

### 4B · 9B 재현 packet

4B extractor는 설명을 쓰지 않고 각 경계의 관찰값만 고정 schema로
추출한다.

```yaml
runtime_boundary:
  stage: condition|latent|denoiser|solver|decode
  input_artifact: ""
  output_artifact: ""
  shape: ""
  revision: ""
  fixed_controls: []
  first_changed_value: null
```

9B reviewer는 인접 artifact를 비교해 `first_changed_boundary`,
`responsible_owner`, `do_not_change_yet`을 판정한다. Family migration에는
`inherited_contract`, `reselected_modules`, `reselected_objective`,
`reselected_solver`를 별도로 낸다.

판정 규칙은 다음처럼 좁힌다.

- ignored prompt token이면 VAE 전에 truncation, token, encoder, CFG를 본다.
- final latent는 같고 RGB만 다르면 VAE decoder를 먼저 본다.
- scheduler만 달라졌다면 model weight의 성능 차이라고 부르지 않는다.
- SDXL에서 SD3.5로 옮기면 LoRA target, text encoder, prediction objective,
  scheduler semantics를 다시 선택한다.

Orchestrator만 source freshness, claim ceiling, learning-path ownership,
FormulaNote, 반응형 screenshot, production asset hash를 닫는다. 이 분업은
작은 모델이 model family 이름을 보고 구현 설정까지 성급하게 복사하는
오류를 막기 위한 것이다.

## 2026-07-31 Prompt Injection · 탐지 문구에서 forbidden commit까지

대상은 `prompt-injection-defense`다. 이 글은 Agent Systems 핵심 경로의
8/9 Safety 단계에 그대로 둔다. MCP의 tool schema, Harness의 durable
loop, Eval의 반복 trial과 겹치지 않고 “untrusted source가 privileged
sink를 움직이지 못하게 어느 실행 경계에서 강제하는가”라는 독립 질문을
갖고 있기 때문이다.

### 작성 의도와 source 경계

글의 중심은 “악성 문장을 모두 맞히는 detector”가 아니다. 모델이 공격을
놓치고 잘못된 action을 제안해도 deterministic policy와 commit gate가
현실의 side effect를 0으로 만들 수 있어야 한다.

1차·공식 출처를 2026-07-31에 다시 대조했다.

- OpenAI 2026 source-sink framing은 현재 제품 보안 연구다. 모든 agent의
  완전한 방어 보장으로 일반화하지 않는다.
- Anthropic 2025 browser-use 평가는 당시 내부 adaptive attacker와 제품
  구성의 결과다. 낮지만 0이 아닌 ASR은 여전히 의미 있는 위험이라는
  경계만 사용한다.
- OWASP LLM01/LLM06은 prompt injection과 excessive agency의
  vendor-neutral 기준이다.
- OWASP Top 10 for Agentic Applications 2026은 goal hijack, tool misuse,
  identity·privilege abuse, memory·context poisoning을 별도 운영 위험으로
  나눈다. Top 10 목록 자체를 security proof로 쓰지 않는다.
- MCP authorization과 security best practices는 token audience,
  resource server와 token passthrough 경계다. MCP가 business
  authorization을 자동 강제한다고 쓰지 않는다.
- Microsoft의 2026 defense-in-depth pattern은 prompt shield, spotlighting,
  plan drift, tool-chain analysis와 IFC를 함께 제시한다. 확률적 sensor가
  deterministic gate를 대체한다는 뜻으로 사용하지 않는다.

### 본문만으로 풀어야 하는 숨은 전이 문제

공통 fixture는 다음과 같다.

- 사용자 목표: 최근 vendor email 요약과 답장 초안
- Global registry: 6 tools
- Task grant: `read_inbox`, `draft_reply`
- 공격 email: customer 417 조회, 외부 송신, admin fact 영구 저장 지시
- Model proposal: 5 actions
- Release invariant: 2 allow + 3 deny, external/durable side effect 0

본문과 Viz만 읽고 다음 변형도 판정할 수 있어야 한다.

1. Encoded injection을 classifier가 놓쳐도 왜 피해가 commit되지 않는가?
2. MCP tool description과 peer-agent의 “부모가 승인했다”는 문장이 왜
   authority가 아닌가?
3. Quarantine fact가 다음 session에서 retrieval되면 어떤 lineage를
   유지해야 하는가?
4. 따로 허용된 draft와 renderer fetch를 합쳐 confidential egress가 되면
   어느 gate가 책임지는가?
5. Prepare 뒤 redirect, resource, policy 또는 grant가 바뀌면 왜 이전
   approval을 재사용할 수 없는가?
6. 공격을 막으면서 정상 요약·초안도 계속 성공한다는 것을 어떤 paired
   regression으로 증명하는가?

이 문제는 답안으로 본문에 나열하지 않았다. Source ID, action history,
task grant, decision reason과 commit evidence를 추적하면 독자가 스스로
첫 위험 경계와 responsible owner를 찾을 수 있게 본문을 구성했다.

### 세 정적 도표를 한 실행 trace로 합친 이유

기존 글은 source-sink, task capability, evidence replay를 세 개의 정적
panel로 따로 보여 줬다. 각 패널은 읽을 수 있었지만 같은 email과
proposal이 다음 단계로 이동하는 느낌이 약했고, 모바일에서 긴 도표를
세 번 지나야 했다.

`PromptInjectionContainmentViz` 하나로 다음 다섯 scene을 통합했다.

1. Authority와 external content를 source metadata로 분리
2. Model output을 미실행 `ActionProposal[5]`로 고정
3. Intent·Capability·Flow·Approval gate로 2 allow·3 deny 판정
4. Draft artifact와 prepare/commit 재검사를 분리
5. Source → proposal → decision → commit → replay evidence 연결

모든 장면은 `현재 책임`, `남긴 출력`, `다음 단계의 불변식` receipt를
남긴다. 따라서 색이나 화살표만 보고 넘어가지 않고, 어느 component가
무엇을 소유하는지 확인할 수 있다.

첫 mobile 구현의 stage 높이는 `[1088, 985, 978, 978, 908]`px였다. 잘림은
없었지만 한 장면 안의 원인과 결과가 멀었다. 글자를 11px 아래로 줄이지
않고 source metadata와 receipt를 3열로, four gate를 `목표·권한·흐름·승인`
네 칸으로, commit recheck를 번호 있는 3열로 재배치했다.

```yaml
prompt_injection_stage_heights:
  desktop: [500, 498, 641, 441, 540]
  tablet: [672, 711, 641, 585, 540]
  mobile: [807, 887, 793, 680, 829]
  mobile_before: [1088, 985, 978, 978, 908]
```

영어 `Capability`와 `Approval`이 좁은 칸에서 어색하게 갈라진 첫 캡처도
그대로 두지 않았다. Mobile label은 `권한`, `승인`으로 바꾸고 desktop에는
영어 owner 용어를 유지했다. Motion stagger가 끝나기 전 캡처되어 마지막
allow row가 흐려지는 검사 문제는 안정 대기를 850ms로 늘려 제품 상태와
검사 상태를 일치시켰다.

### 정적 결과와 배포 영수증

```yaml
prompt_injection_result:
  article: "src/pages/articles/ai/prompt-injection-defense.tsx"
  content_spec: "src/pages/articles/ai/content-specs/agent-prompt-injection-containment.md"
  viz: "src/pages/articles/ai/prompt-injection-defense/viz/PromptInjectionContainmentViz.tsx"
  mastery_report: ".codex-tmp/ai-mastery-after-prompt-injection-2026-07-31.json"
  score: "78 -> 100"
  prose_depth: 3781
  all_checks:
    question: true
    capability: true
    sources: true
    formula_notes: true
    viz: true
    causal_viz: true
    internal_links: true
    depth: true
  score_bucket_change:
    75_to_89: "70 -> 69"
    90_or_more: "234 -> 235"
  focused_eslint: "pass"
  full_typescript_vite_build: "pass"
```

```yaml
prompt_injection_release:
  deployed_at: "2026-07-31 11:51 KST"
  service: "cm-blog.service"
  status: "active"
  index_sha256: "71f42056e309e556744b5a6b1622a55c03e8a5eda9f265834ee7aa8588f49690"
  javascript: "/lab/assets/index-Dt1RKQFW.js"
  stylesheet: "/lab/assets/index-D6BHw4iY.css"
  article_chunk: "/lab/assets/prompt-injection-defense-BNCh3tUK.js"
  production_hash_matches_local: true
  transport:
    article_html: 200
    legacy_redirect: 308
    javascript: 200
    stylesheet: 200
    article_chunk: 200
  local_viz:
    report: ".codex-tmp/prompt-injection-viz-local.json"
    viewport_checks: 3
    step_state_checks: 15
    failures: 0
  local_narrative:
    report: ".codex-tmp/prompt-injection-narrative-local.json"
    checks: 3
    errors: 0
    warnings: 0
  production_viz:
    report: ".codex-tmp/prompt-injection-viz-production.json"
    viewport_checks: 3
    step_state_checks: 15
    failures: 0
  production_narrative:
    report: ".codex-tmp/prompt-injection-narrative-production.json"
    checks: 3
    errors: 0
    warnings: 0
```

### 4B · 9B 재현 packet

4B worker는 security 설명을 생성하지 않고 관찰 가능한 경계만 추출한다.

```yaml
action_trace:
  user_intent: ""
  authority_sources: []
  untrusted_sources: []
  sensitive_labels: []
  candidate_sink: ""
  task_capability: []
  action_history: []
  data_flow_rule: ""
  approval_rule: ""
  prepare_hash: ""
  commit_hash: ""
  commit_evidence: ""
  forbidden_inference: null
```

9B reviewer는 다음 판정을 낸다.

```yaml
security_review:
  source_vs_instruction: ""
  proposal_vs_authorization: ""
  tool_metadata_authority: false
  peer_agent_grant_valid: false
  tool_visibility_vs_permission: ""
  classifier_vs_gate: ""
  draft_vs_commit: ""
  commit_toctou: ""
  memory_lineage: ""
  cross_action_composition: ""
  normal_task_regression: ""
  responsible_boundary: ""
  do_not_change_yet: []
```

작은 모델의 핵심 규칙은 단순하다. Model proposal은 권한이 아니고, session
ID는 identity proof가 아니며, classifier allow는 commit allow가 아니다.
Action은 현재 한 건만 보지 않고 history와 data flow를 합쳐 판정한다.
Prepare hash와 commit 직전 resolved hash가 다르면 실행하지 않는다.

Orchestrator만 최신 공식 source의 claim ceiling, learning-path ownership,
KaTeX와 FormulaNote 대응, desktop/tablet/mobile browser oracle, full build,
production asset hash를 닫는다. Claude closure는 2026-08-01 18:00 KST
이후 source hash가 일치할 때만 별도 의미 검증으로 추가한다.

## 2026-07-31 NLP 원 논문 · Word2Vec에서 BERT까지 계산 경계 연결

대상은 `ai-nlp-paper-spine`의 7개 글 가운데 이미 100점인 Transformer를
제외한 여섯 원 논문이다.

1. Word2Vec 2013
2. Learning Long-Term Dependencies 1994
3. LSTM 1997
4. Seq2Seq 2014
5. Bahdanau Attention 2015
6. BERT 2018

경로 순서는 단순 연대기가 아니다. 각 논문이 바로 앞 단계의 어떤 계산
경계를 바꾸었는지 이어 읽는 최소 spine이다.

```text
문맥 pair로 static vector 학습
→ 반복 Jacobian의 장기 credit 문제
→ additive cell state와 gate
→ fixed-state encoder–decoder
→ 위치별 dynamic source read
→ attention-only Transformer
→ bidirectional pretrain–fine-tune encoder
```

### 원문 대조와 claim ceiling

2026-07-31에 다음 1차 출처를 다시 대조했다.

- Word2Vec: `https://arxiv.org/abs/1301.3781`
- Long-term dependencies: `https://doi.org/10.1109/72.279181`
- LSTM: `https://direct.mit.edu/neco/article/9/8/1735/6109/Long-Short-Term-Memory`
- Seq2Seq: Google Research publication과 `https://arxiv.org/abs/1409.3215`
- Bahdanau Attention: `https://arxiv.org/abs/1409.0473`
- BERT: `https://arxiv.org/abs/1810.04805`

출처를 많이 붙이는 것보다 후대의 성공을 앞 논문에 소급하지 않는 것이
중요했다.

- Word2Vec 1301.3781의 CBOW·Skip-gram과 후속 negative sampling을
  분리한다.
- 1994 분석은 모든 현대 RNN의 불가능 증명이 아니다.
- 1997 LSTM의 CEC·input/output gate와 후대 forget gate를 분리한다.
- Seq2Seq model probability와 beam-search decoding gain을 분리한다.
- Bahdanau alignment weight를 완전한 causal explanation으로 부르지 않는다.
- BERT의 transfer 성공과 NSP의 보편적 필수성을 분리한다.

### 본문만으로 풀어야 하는 숨은 전이 문제

작성 전 답을 노출하지 않는 다음 문제를 만들었다. 본문과 Viz만 읽은
사람이 첫 변화 경계, responsible owner와 증거 한계를 찾을 수 있어야
통과다.

1. Corpus는 같고 window만 바뀌면 어떤 학습 artifact가 제일 먼저
   바뀌는가?
2. Recurrent Jacobian norm이 1이어도 task-relevant 방향이 사라질 수
   있는 이유는 무엇인가?
3. 1997 LSTM 재현 코드에 `f_t c_{t-1}`가 있으면 왜 원 논문 재현이라고
   부를 수 없는가?
4. BLEU가 beam width 때문에 올랐을 때 model parameter 개선과 어떻게
   분리하는가?
5. Attention heatmap이 정렬처럼 보여도 번역 결정의 완전한 원인이라고
   단정할 수 없는 이유는 무엇인가?
6. BERT collator에서 15% selection과 80/10/10 replacement를 같은 mask로
   구현하면 어떤 label contract가 깨지는가?
7. Transformer를 이미 읽은 사람이 BERT에서 새로 추적해야 할 첫
   artifact는 encoder block인가, corruption/objective packet인가?

이 문제의 답을 별도 문제 본문으로 쓰지 않았다. 각 scene의 input,
output, owner, invariant와 원문 evidence를 따라가면 독자가 답을 구성하게
했다.

### 공유 renderer를 쓰되 같은 그림을 복제하지 않은 이유

여섯 글은 같은 `FoundationalPaperStudy` 템플릿을 사용하므로 interaction과
receipt 문법은 공유할 수 있다. 그러나 논문별 핵심 artifact는 다르다.

`NlpPaperMechanismViz`는 공통 StepViz shell 안에서 서로 다른 visual
grammar를 사용한다.

- Word2Vec: token window, CBOW/Skip-gram 방향, lookup row, parameter update
- Long-term dependencies: unrolled recurrence, Jacobian product, decay bar,
  spectral regime
- LSTM: candidate, input gate, additive CEC, output gate, historical boundary
- Seq2Seq: source reversal, fixed vector, autoregressive decoder, teacher forcing,
  model/search boundary
- Bahdanau: source annotation array, additive score, source softmax, alignment
  matrix, evidence boundary
- BERT: corruption packet, bidirectional attention matrix, MLM/NSP, task head,
  transfer boundary

각 장면은 `현재 책임`, `남긴 출력`, `다음 불변식` receipt를 남긴다. 화살표
또는 색만 보고 넘어가지 않고 실제 구현 경계를 복원할 수 있게 하기
위해서다.

### 첫 visual QA에서 발견하고 고친 것

첫 구현도 가로 overflow는 0이었지만 충분히 좋은 결과가 아니었다.

- Flow가 mobile에서 한 열로 쌓여 원인과 결과가 1,100px 이상 떨어졌다.
- Alignment matrix cell에 `aspect-square`을 써 desktop에서도 행렬이
  불필요하게 세로로 늘어났다.
- Word2Vec 비교 카드의 `context → center` metric이 좁은 header에서 한
  글자씩 세로로 갈라졌다.
- 긴 한국어 underbrace가 mobile에서 KaTeX 주석을 작게 만들었다.
- Bar row가 mobile에서 label, bar, value 세 줄로 풀려 한 장면이 길어졌다.

수정은 글자 축소가 아니라 구조 변경으로 했다.

- Mobile flow는 번호가 있는 2×2 sequence로, desktop은 horizontal
  causality로 표시한다.
- Matrix cell은 내용에 맞는 40px 행 높이를 사용한다.
- Metric을 label 오른쪽이 아니라 아래 독립 행으로 옮긴다.
- KaTeX underbrace는 `먼 과거 영향`, `보존`, `허용된 write`,
  `source 위치 softmax`처럼 짧은 한국어 operation label로 줄이고,
  바로 아래 FormulaNote에서 설계 이유를 설명한다.
- Bar row는 mobile에서도 label–bar–value 3열을 유지한다.
- 일반 text는 11px 미만으로 내리지 않고 긴 token에는
  `overflow-wrap:anywhere`를 적용한다.

```yaml
mobile_stage_heights_before_after:
  word2vec:
    before: [844, 659, 924, 809, 1028]
    after:  [844, 625, 675, 755, 931]
  long_term:
    before: [904, 1170, 788, 777, 968]
    after:  [675, 889, 618, 743, 851]
  lstm:
    before: [789, 619, 1091, 904, 988]
    after:  [696, 564, 893, 615, 851]
  seq2seq:
    before: [679, 789, 924, 974, 1008]
    after:  [645, 675, 695, 988, 831]
  bahdanau:
    before: [733, 1145, 1145, 937, 1008]
    after:  [733, 965, 884, 895, 851]
  bert:
    before: [729, 778, 846, 924, 1070]
    after:  [729, 726, 838, 675, 973]
```

`seq2seq` teacher-forcing과 BERT evidence scene은 내용 자체가 많아 900px를
조금 넘지만 내부 scroll, clipping과 horizontal overflow는 없다. 한 화면에
억지로 넣기 위해 글자를 줄이는 대신 두 열과 명확한 section boundary를
유지했다.

### 정적 결과와 배포 영수증

```yaml
nlp_paper_spine_result:
  shared_viz: "src/pages/articles/ai/paper-spine/viz/NlpPaperMechanismViz.tsx"
  specs:
    - "src/pages/articles/ai/paper-spine/specs.ts"
    - "src/pages/articles/ai/paper-spine/foundationSpecs.ts"
  article_scores:
    paper_word2vec_2013: "84 -> 100"
    paper_long_term_dependencies_1994: "84 -> 100"
    paper_lstm_1997: "84 -> 100"
    paper_seq2seq_2014: "84 -> 100"
    paper_bahdanau_attention_2015: "84 -> 100"
    paper_bert_2018: "84 -> 100"
  score_bucket_change:
    75_to_89: "63 -> 57"
    90_or_more: "241 -> 247"
  mastery_report: ".codex-tmp/ai-mastery-after-nlp-paper-viz-2026-07-31.json"
  focused_eslint: "pass"
  full_typescript_vite_build: "pass"
```

```yaml
nlp_paper_spine_release:
  deployed_at: "2026-07-31 12:17:49 KST"
  service: "cm-blog.service"
  status: "active"
  index_sha256: "5c98e083b66e4c82e156eb41fe66f9951ae41461d5e1b8d5ca63dedddd9e2bec"
  javascript: "/lab/assets/index-DEtaiQFp.js"
  stylesheet: "/lab/assets/index-Dp_JzqzU.css"
  shared_viz_chunk: "/lab/assets/NlpPaperMechanismViz-DEsEAqJX.js"
  production_hash_matches_local: true
  route_http_200: 6
  article_chunk_http_200: 6
  local_viz:
    report: ".codex-tmp/nlp-paper-viz-local.json"
    viewport_route_checks: 18
    step_state_checks: 90
    failures: 0
  production_viz:
    report: ".codex-tmp/nlp-paper-viz-production.json"
    viewport_route_checks: 18
    step_state_checks: 90
    failures: 0
  production_narrative:
    report: ".codex-tmp/nlp-paper-narrative-production.json"
    viewport_route_checks: 18
    errors: 0
    warnings: 0
```

### 4B · 9B 재현 packet

4B extractor는 논문 설명을 쓰지 않고 현재 scene의 관찰 artifact만 고정
schema로 추출한다.

```yaml
paper_runtime_boundary:
  paper: word2vec|long_term|lstm|seq2seq|bahdanau|bert
  scene: 1
  input_artifact: ""
  output_artifact: ""
  shape_or_time_span: ""
  first_changed_value: ""
  responsible_owner: ""
  fixed_controls: []
  evidence_ref: ""
  historical_revision: ""
```

9B reviewer는 인접 artifact와 원문을 대조해 다음만 판정한다.

```yaml
paper_review:
  first_changed_boundary: ""
  responsible_mechanism: ""
  paper_claim_supported: []
  paper_claim_not_supported: []
  historical_vs_modern_boundary: ""
  model_vs_search_boundary: ""
  visualization_vs_causal_evidence: ""
  downstream_transfer_ceiling: ""
  do_not_change_yet: []
```

작은 모델 판정 규칙은 다음과 같다.

- Word2Vec 1301.3781과 후속 negative sampling을 합치지 않는다.
- 1997 LSTM을 modern forget-gate 식으로 바꾸지 않는다.
- Seq2Seq probability와 beam search improvement를 합치지 않는다.
- Attention heatmap을 전체 causal explanation으로 승격하지 않는다.
- BERT pretraining objective를 downstream task 보장으로 쓰지 않는다.
- Transformer는 별도 100점 글이므로 이 batch에서 중복 재작성하지 않는다.

Orchestrator만 primary-source claim ceiling, learning-path 위치, KaTeX
operation annotation, desktop/tablet/mobile screenshot oracle, full build와
production hash를 닫는다. Claude closure 287개는 계속 대기 상태이며
2026-08-01 18:00 KST 전에 검증 완료로 표시하지 않는다.

## 2026-07-31 · Model-based RL 원 논문 경로 closure

이번 묶음은 `Dyna 1990 -> World Models 2018 -> MuZero 2020 ->
DreamerV3 2023/2025`다. 네 논문을 모두 "world model을 쓴다"로 요약하면
계획 주체와 학습 신호가 사라진다. 따라서 다음 1차 출처의 claim ceiling을
먼저 다시 고정했다.

- Dyna 1990:
  `https://doi.org/10.1016/B978-1-55860-141-3.50030-4`
  및 1991 후속 설명 `https://doi.org/10.1145/122344.122377`
- World Models:
  `https://arxiv.org/abs/1803.10122` 및 저자 interactive article
  `https://worldmodels.github.io/`
- MuZero:
  `https://www.nature.com/articles/s41586-020-03051-4` 및
  `https://arxiv.org/abs/1911.08265`
- DreamerV3:
  `https://www.nature.com/articles/s41586-025-08744-2` 및
  `https://arxiv.org/abs/2301.04104`

### 본문과 Viz만으로 풀어야 하는 숨은 전이 문제

1. Dyna의 direct update와 planning update가 같은 함수를 써도 서로 다른
   증거라고 부르는 이유는 무엇인가?
2. Planning update 수 `n`을 늘렸을 때 real sample efficiency와 model
   bias가 동시에 커지는 경로는 무엇인가?
3. World Models의 V, M, C 중 reward를 직접 보고 task policy를 바꾸는
   주체는 누구이며 optimizer는 무엇인가?
4. Dream return은 높은데 real return이 낮을 때 VAE reconstruction,
   multi-step dynamics, controller 중 어디부터 검사해야 하는가?
5. MuZero의 raw policy prior `p`와 MCTS visit policy `pi`는 같은 policy
   tensor인가?
6. MuZero가 observation decoder 없이도 planning할 수 있는 이유와 그
   때문에 사라질 수 있는 정보는 무엇인가?
7. DreamerV3 training에서 posterior `q`가 실제 observation을 보지만
   imagination의 prior `p`가 보면 안 되는 값은 무엇인가?
8. Lambda-return에서 continue prediction이 빠지면 terminal 뒤에 어떤
   가짜 credit path가 생기는가?
9. Search simulation이나 imagination horizon을 늘리는 것이 언제 model
   error를 완화하지 않고 증폭하는가?

문제를 별도 quiz 본문으로 쓰지 않았다. 각 scene에서 input, output,
owner, invariant, real/imagined provenance를 읽으면 답을 재구성할 수 있게
했다.

### 논문별로 달리 만든 causal grammar

공통 shell은 `StepViz`지만 핵심 artifact는 서로 다르다.

- Dyna: real tuple, direct Q backup, model fit, simulated backup, compute-bias
  boundary
- World Models: VAE V, MDN-RNN M, compact controller C, CMA-ES dream rollout,
  real transfer
- MuZero: root representation h, learned tree dynamics g, prediction f와
  MCTS visit policy, replay K-step target ledger, search scaling
- DreamerV3: posterior state inference, prior/posterior world-model loss,
  prior-only imagination, lambda-return actor-critic, cross-domain boundary

각 장면은 `현재 책임`, `남긴 출력`, `다음 불변식`을 남긴다. 특히
`real`, `model-generated`, `dream-generated` artifact를 이름과 색만으로
구분하지 않고 receipt에 문자열로 남겼다.

수식 안에는 짧은 한글 operation label을 넣었다.

- `현재 값`, `실제 전이의 오차`, `model이 만든 오차`
- `다음 latent 분포`, `경로 확률`
- `탐색 안내`, `visit 정책`, `보상`, `가치`, `탐색 정책`
- `행동 history`, `실제 관측으로 교정`, `prior 학습`,
  `posterior 학습`, `상상 보상`, `계속 여부`

긴 설명은 underbrace 안에 넣지 않고 바로 아래 FormulaNote로 내렸다.

### 첫 QA 실패와 구조 수정

첫 local QA는 60개 state 중 5개 실패를 냈다.

- Mobile timeline이 네 항목을 세로로 쌓아 Dyna 1,127px, MuZero 1,165px,
  DreamerV3 1,123px까지 늘어났다.
- MuZero replay loss가 mobile에서 23.7px 넘쳤다.
- Dreamer posterior 식이 5.6px 넘쳤다.
- World Models mixture 식의 outer text box가 3px 잘린 것으로 측정됐다.
- MuZero tree의 `ACTION A1` label이 세 개의 좁은 branch에서
  `ACTI / ON`처럼 끊겼다.

글자를 줄이지 않고 다음처럼 고쳤다.

- Timeline을 mobile 2x2, desktop 1x4 numbered causality grid로 바꿨다.
- 긴 식은 `aligned`에서 실제 의미 단위별 두 행으로 나눴다.
- MuZero branch label을 `Branch a1`, `Branch a2`, `Branch a3`로 줄였다.
- 일반 text 11px 하한, formula 0.75 scale 하한과 clipping oracle은
  그대로 유지했다.

```yaml
model_based_rl_mobile_stage_heights_after:
  dyna: [695, 917, 958, 1007, 824]
  world_models: [960, 996, 897, 762, 866]
  muzero: [943, 949, 978, 1075, 888]
  dreamerv3: [979, 1045, 1003, 1080, 926]
  formula_min_scale: 0.82
  max_formula_overflow_px: 0
```

MuZero replay와 Dreamer actor-critic은 1,000px를 조금 넘지만 2x2
artifact ledger, operation-annotated formula, failure boundary, ownership
receipt를 모두 포함한다. 이 두 장면은 내부 scroll, horizontal overflow,
clipping이 없고 11px 미만 text도 없다. 이를 억지로 한 viewport 높이에
맞추기 위해 font를 줄이거나 owner를 삭제하지 않았다.

### 감사 도구의 false completion을 고친 이유

첫 mastery run은 실제로 Viz를 받은 네 글 외에 같은
`rlAdvancedSpecs.ts`의 DAgger, CQL, Decision Transformer도 84에서 100으로
오인했다. 감사기가 route wrapper의 import graph 전체를 합쳐 계산했기
때문이다.

숫자를 그대로 기록하지 않고 Viz ownership을 공용 spec에서 네 route
wrapper로 옮겼다.

- DAgger, CQL, Decision Transformer: 84 유지, `viz=false`
- Dyna, World Models, MuZero, DreamerV3: 100, `causalViz=true`

이 조정은 public prose를 바꾸지 않지만 metric이 실제 route ownership과
일치하게 한다.

### 정적 결과와 production 영수증

```yaml
model_based_rl_result:
  shared_viz: "src/pages/articles/ai/paper-spine/viz/ModelBasedRlPaperViz.tsx"
  routes:
    - "src/pages/articles/ai/paper-dyna-1990.tsx"
    - "src/pages/articles/ai/paper-world-models-2018.tsx"
    - "src/pages/articles/ai/paper-muzero-2020.tsx"
    - "src/pages/articles/ai/paper-dreamerv3-2023.tsx"
  article_scores:
    paper_dyna_1990: "84 -> 100"
    paper_world_models_2018: "84 -> 100"
    paper_muzero_2020: "84 -> 100"
    paper_dreamerv3_2023: "84 -> 100"
  score_bucket_change:
    75_to_89: "57 -> 53"
    90_or_more: "247 -> 251"
  mastery_report: ".codex-tmp/ai-mastery-after-model-based-rl-2026-07-31.json"
  focused_eslint: "pass"
  full_typescript_vite_build: "pass"
```

```yaml
model_based_rl_release:
  deployed_at: "2026-07-31 12:41:28 KST"
  service: "cm-blog.service"
  status: "active"
  index_sha256: "169baca49e84b1b00b9f1af6d5e6deea49abdf91d688db6ae7190a62f9ac9b5e"
  javascript: "/lab/assets/index-C-iA9cCi.js"
  stylesheet: "/lab/assets/index-BfW-oKwo.css"
  shared_viz_chunk: "/lab/assets/ModelBasedRlPaperViz-DvyoJNW9.js"
  shared_viz_chunk_bytes: 37699
  production_hash_matches_local: true
  route_http_200: 4
  article_chunk_http_200: 4
  local_viz:
    report: ".codex-tmp/model-based-rl-paper-viz-local.json"
    viewport_route_checks: 12
    step_state_checks: 60
    failures: 0
  production_viz:
    report: ".codex-tmp/model-based-rl-paper-viz-production.json"
    viewport_route_checks: 12
    step_state_checks: 60
    failures: 0
  production_narrative:
    report: ".codex-tmp/model-based-rl-paper-narrative-production.json"
    viewport_route_checks: 12
    errors: 0
    warnings: 0
```

### 4B · 9B 재현 packet

4B extractor는 설명문을 쓰지 않고 현재 update ledger만 채운다.

```yaml
model_based_rl_boundary:
  paper: dyna|world_models|muzero|dreamerv3
  scene: 1
  real_or_imagined_source: ""
  input_artifact: ""
  output_artifact: ""
  learned_owner: ""
  update_target: ""
  rollout_or_search_depth: ""
  fixed_controls: []
  evidence_ref: ""
```

9B reviewer는 인접 scene과 원문을 대조한다.

```yaml
model_based_rl_review:
  first_changed_boundary: ""
  model_target: ""
  planner_or_actor_owner: ""
  real_vs_imagined_gap: ""
  reconstruction_required: null
  search_or_policy_improvement: ""
  model_bias_amplification_path: ""
  paper_claim_supported: []
  paper_claim_not_supported: []
  historical_vs_modern_boundary: ""
  do_not_change_yet: []
```

작은 모델 판정 규칙은 다음과 같다.

- Dyna planning은 simulated transition을 같은 value updater에 통과시키는
  일이지 별도 symbolic solver가 아니다.
- World Models의 V, M, C는 target과 optimizer가 다르다.
- Dream return을 real return으로 쓰지 않는다.
- MuZero latent에는 observation reconstruction objective가 없다.
- MuZero의 raw prior `p`와 MCTS visit target `pi`를 합치지 않는다.
- Dreamer posterior는 real `x`를 볼 수 있지만 imagination은 seed 뒤에
  prior만 사용한다.
- Planning/search/rollout compute를 늘리면 model bias도 증폭될 수 있다.

Orchestrator만 source closure, learning path, KaTeX, browser oracle, build,
production SHA와 route ownership을 닫는다. Claude 검증은 사용량 제한으로
완료 표시하지 않았고 `cm-blog-claude-ai-learning-closure-retry.timer`가
2026-08-01 18:00 KST에 재개하도록 기록되어 있다.

## 2026-07-31 · Distribution shift RL 논문 경로 closure

이번 묶음은 `DAgger 2011 -> CQL 2020 -> Decision Transformer 2021`이다.
세 논문은 모두 training data와 deployment behavior의 관계를 바꾸지만,
바꾸는 boundary는 서로 다르다.

- DAgger: learner가 만든 state에서 expert label을 다시 받아 dataset을
  반복 집계한다.
- CQL: 추가 interaction이 없는 static dataset에서 candidate action의
  낙관적인 Q를 dataset action보다 상대적으로 누른다.
- Decision Transformer: offline trajectory를 return, state, action의
  causal sequence로 바꾸고 desired return에 조건화해 action을 예측한다.

Claim ceiling은 다음 1차 출처로 고정했다.

- DAgger:
  `https://proceedings.mlr.press/v15/ross11a.html`
- CQL:
  `https://arxiv.org/abs/2006.04779` 및 NeurIPS 2020 공식 proceedings
- Decision Transformer:
  `https://arxiv.org/abs/2106.01345` 및 NeurIPS 2021 공식 proceedings

### 본문과 Viz만으로 풀어야 하는 숨은 전이 문제

1. Behavioral cloning validation loss가 낮아도 rollout failure가 커질 수
   있는 causal path는 무엇인가?
2. DAgger에서 실제로 실행한 action과 expert가 뒤늦게 준 label을 같은
   column에 저장하면 어떤 provenance가 사라지는가?
3. `beta_i`가 label mixture가 아니라 state distribution을 정하는
   control이라는 사실을 어떻게 확인하는가?
4. CQL의 첫 번째 항만 사용하면 왜 useful in-dataset Q까지 전부 낮아질 수
   있으며 두 번째 항은 무엇을 상대적으로 보존하는가?
5. Static dataset에서 OOD Q error가 policy choice와 Bellman bootstrap을
   거쳐 스스로 커지는 loop는 무엇인가?
6. Conservative Q가 모든 `(s,a)`에서 pointwise lower bound라는 주장과
   policy expected value를 덜 과대평가한다는 주장을 왜 구분해야 하는가?
7. Decision Transformer의 training return-to-go와 deployment desired
   return은 출처가 어떻게 다른가?
8. Current action을 causal input에 넣으면 왜 단순 sequence modeling이
   아니라 label leakage가 되는가?
9. 매 step 실제 reward를 return target에서 빼지 않으면 training과
   deployment token의 의미가 어떻게 달라지는가?
10. Desired return을 dataset 최대값보다 높게 올리는 일이 자동 policy
    improvement가 아닌 이유는 무엇인가?

문제를 별도 quiz로 노출하지 않았다. 각 scene의 state source, action
owner, label owner, support, causal mask, deployment update receipt를
따라가면 답을 복원할 수 있게 했다.

### 공통 shell과 논문별 causal grammar

`ModelBasedRlPaperViz.tsx`에서 renderer를 `PaperSceneViz`로 분리해 typography,
timeline, compare, flow, boundary, FormulaNote, owner/output/invariant receipt를
재사용했다. 논문별 content와 marker는 새
`paper-spine/viz/OfflineRlPaperViz.tsx`가 소유한다. 따라서 visual language는
통일하지만 서로 다른 메커니즘을 같은 도식으로 가장하지 않는다.

- DAgger: BC distribution gap, mixed rollout, learner-state expert relabel,
  aggregated dataset retraining, guarantee/evidence boundary
- CQL: static-data contract, OOD optimism loop, candidate-vs-data conservative
  gap, Bellman+CQL joint update, calibration boundary
- Decision Transformer: reverse return-to-go, interleaved causal sequence,
  supervised action prediction, closed-loop target update, dataset-support
  boundary

각 route wrapper가 자신의 `mechanismViz`를 직접 import한다. 공용
`rlAdvancedSpecs.ts`에 Viz를 넣지 않아 audit import graph가 이웃 글까지
허위로 완료 처리하지 않게 했다.

### 수식과 모바일 QA에서 실제로 고친 것

첫 local run은 45개 state 중 DAgger mobile 마지막 scene 하나에서 두
종류의 실패를 냈다.

- BC bound와 DAgger bound를 한 행에 둬 text box가 71px 잘렸다.
- KaTeX inner width가 container보다 66.56px 넓었다.

글자를 더 작게 만들지 않고 `aligned` 두 행으로 의미 단위를 분리했다.
각 행의 underbrace는 각각 `expert 분포에서 학습`, `learner 분포에서
학습`으로 유지했다. 수정 뒤 일반 text 11px 하한과 formula scale 0.75
하한을 모두 통과했다.

```yaml
offline_rl_mobile_stage_heights_after:
  dagger: [979, 891, 1004, 1006, 1192]
  cql: [703, 979, 998, 1003, 928]
  decision_transformer: [1031, 1034, 1099, 1039, 848]
  formula_min_scale:
    dagger: 0.85
    cql: 0.86
    decision_transformer: 0.91
  max_formula_overflow_px: 0
```

DAgger 마지막 장면은 1,192px이지만 내부 scroll이나 horizontal overflow,
clipping이 없고 네 가지 evidence boundary와 두 bound의 가정을 함께
읽을 수 있다. 한 화면 높이에 억지로 맞추기 위해 근거 카드를 삭제하거나
글자를 줄이지 않았다.

### 감사 결과와 production 영수증

이전 mastery report와 slug별 score를 직접 diff했다. 바뀐 글은 정확히
세 개뿐이다.

```yaml
offline_rl_mastery:
  paper_dagger_2011: "84 -> 100"
  paper_cql_2020: "84 -> 100"
  paper_decision_transformer_2021: "84 -> 100"
  changed_unrelated_articles: 0
  score_bucket_change:
    75_to_89: "53 -> 50"
    90_or_more: "251 -> 254"
  report: ".codex-tmp/ai-mastery-after-offline-rl-2026-07-31.json"
  focused_eslint: "pass"
  full_typescript_vite_build: "pass"
```

```yaml
offline_rl_release:
  deployed_at: "2026-07-31 12:57:48 KST"
  service: "cm-blog.service"
  status: "active"
  index_sha256: "399bba81fc15214b961fb839ccb946134b71749e1ef42b9a6c30bb210d34d203"
  production_hash_matches_local: true
  javascript: "/lab/assets/index-DyIn566B.js"
  stylesheet: "/lab/assets/index-BfW-oKwo.css"
  renderer_chunk: "/lab/assets/ModelBasedRlPaperViz-jaAHX9zC.js"
  renderer_chunk_bytes: 83046
  paper_viz_chunk: "/lab/assets/OfflineRlPaperViz-DkIYiAHa.js"
  paper_viz_chunk_bytes: 22793
  route_http_200: 3
  article_chunk_http_200: 3
  local_viz:
    report: ".codex-tmp/offline-rl-paper-viz-local.json"
    viewport_route_checks: 9
    step_state_checks: 45
    failures: 0
  local_narrative:
    report: ".codex-tmp/offline-rl-paper-narrative-local.json"
    viewport_route_checks: 9
    errors: 0
    warnings: 0
  production_viz:
    report: ".codex-tmp/offline-rl-paper-viz-production.json"
    viewport_route_checks: 9
    step_state_checks: 45
    failures: 0
  production_narrative:
    report: ".codex-tmp/offline-rl-paper-narrative-production.json"
    viewport_route_checks: 9
    errors: 0
    warnings: 0
```

### 4B · 9B 재현 packet

4B extractor는 설명문을 만들지 않고 provenance ledger만 채운다.

```yaml
distribution_shift_rl_boundary:
  paper: dagger|cql|decision_transformer
  scene: 1
  state_source: ""
  action_executed_by: ""
  action_labeled_by: ""
  dataset_support: ""
  target_or_condition: ""
  current_update_owner: ""
  input_artifact: ""
  output_artifact: ""
  deployment_feedback_available: null
  evidence_ref: ""
```

9B reviewer는 인접 장면과 원문을 대조한다.

```yaml
distribution_shift_rl_review:
  first_changed_distribution: ""
  feedback_or_query_boundary: ""
  behavior_vs_learned_policy: ""
  in_distribution_vs_ood_action: ""
  hindsight_vs_runtime_condition: ""
  causal_mask_boundary: ""
  optimism_or_compounding_error_path: ""
  paper_claim_supported: []
  paper_claim_not_supported: []
  required_deployment_measurements: []
  do_not_change_yet: []
```

작은 모델 판정 규칙은 다음과 같다.

- DAgger의 expert query는 learner가 방문한 state에 붙는다.
- Executed action과 counterfactual expert label의 owner를 합치지 않는다.
- CQL의 log-sum-exp 항만 보고 "모든 Q를 작게 한다"고 쓰지 않는다.
- Static dataset 바깥 action의 실제 return을 관측했다고 가장하지 않는다.
- Decision Transformer의 return-to-go는 value estimate가 아니다.
- Current action은 model input이 아니라 supervised target이다.
- Deployment에서는 실제 reward만큼 target return을 갱신한다.
- High desired return이 dataset support 밖이면 extrapolation risk를 남긴다.

Orchestrator만 primary-source claim ceiling, learning-path position, Korean
KaTeX operation labels, browser pixel oracle, route ownership, full build,
production hash와 chunk receipt를 닫는다. Claude 검증은 사용량이 없으므로
완료로 표시하지 않는다. `cm-blog-claude-ai-learning-closure-retry.timer`가
`2026-08-01 18:00 KST`에 남은 287개 closure job을 재개하도록 대기 중이다.

## 2026-07-31 · Value learning 논문 경로 closure

이번 묶음은 `Q-learning 1992 -> DQN 2015`이다. CQL, MuZero, value
target, bootstrap, replay, target network를 읽기 전에 필요한 최소 공통
기반이다. 두 논문이 같은 target 모양을 쓰더라도 보장의 범위는 같지 않다.

- Q-learning은 finite discrete MDP의 lookup table에서 behavior action과
  greedy target action을 분리하고, 충분한 방문과 step-size 조건 아래
  almost-sure convergence를 보인다.
- DQN은 이 target을 high-dimensional visual input과 shared neural network로
  옮기면서 생기는 instability를 replay memory와 delayed target network로
  완화한다. Q-learning의 table convergence theorem을 그대로 물려받지는
  않는다.

Claim ceiling은 다음 1차 출처로 고정했다.

- Q-learning:
  `https://link.springer.com/article/10.1007/BF00992698`
- Q-learning author page:
  `https://www.gatsby.ucl.ac.uk/~dayan/papers/wd92.html`
- Q-learning author-hosted paper:
  `https://www.gatsby.ucl.ac.uk/~dayan/papers/cjch.pdf`
- DQN Nature article:
  `https://www.nature.com/articles/nature14236`
- DQN DeepMind-hosted paper:
  `https://deepmind-media.storage.googleapis.com/dqn/DQNNaturePaper.pdf`

### 본문과 Viz만으로 풀어야 하는 숨은 전이 문제

1. Environment에서 실제로 실행한 behavior action과 bootstrap target에서
   `max`가 선택한 action은 왜 서로 달라도 되는가?
2. Target 안에서 reward와 next-state value 중 무엇이 관측이고 무엇이
   추정인가?
3. Q-learning의 `max`가 왜 아직 관측하지 않은 optimistic error를 target
   안으로 다시 넣을 수 있는가?
4. Lookup table의 한 cell update와 DQN의 shared parameter update는 다른
   state-action 값에 어떤 영향을 주는가?
5. `sum alpha_t = infinity`와 `sum alpha_t^2 < infinity`는 각각 새 evidence를
   계속 반영하는 조건과 noise를 가라앉히는 조건을 어떻게 나누는가?
6. Replay가 temporal correlation을 낮추는 것과 samples를 정확한 IID로
   만드는 것은 왜 다른 주장인가?
7. Replay의 오래된 transition을 현재 network로 학습할 수 있는 off-policy
   근거와 distribution mismatch 위험은 무엇인가?
8. DQN target network는 독립된 critic이나 ground truth가 아니라 어떤
   시점의 online network를 복사한 것인가?
9. Terminal transition에서 bootstrap을 제거하지 않으면 존재하지 않는
   미래 reward를 어떻게 더하게 되는가?
10. Atari human-normalized score가 sample efficiency, cross-game transfer,
    general intelligence를 직접 입증하지 않는 이유는 무엇인가?

문제를 별도 quiz로 노출하지 않았다. 각 scene의 executed action, target
action, observed evidence, estimated future, prediction owner, target owner,
update scope, theorem/evidence boundary를 읽으면 답을 복원할 수 있게 했다.

### 논문별 causal grammar

공통 visual shell은 `ModelBasedRlPaperViz.tsx`의 `PaperSceneViz`를
재사용하고, 논문별 content와 marker는
`paper-spine/viz/ValueLearningPaperViz.tsx`가 소유한다. 각 route wrapper가
자신의 Viz를 직접 import하므로 audit가 이웃 글을 허위 완료 처리하지 않는다.

- Q-learning: real transition과 두 action owner, greedy one-step bootstrap,
  asynchronous one-cell update, almost-sure convergence contract,
  theorem/evidence/deep-transfer boundary
- DQN: Atari observation construction, epsilon-greedy collection과 replay
  capture, uniform replay와 distribution effect, online prediction과 frozen
  target의 두 timescale, benchmark evidence와 claim limit

Q-learning 수식은 `observed reward + estimated future`, `TD error`,
`one-cell write`를 서로 다른 행으로 분리했다. DQN은 `frozen next value`,
`target`, `loss`, `hard sync every C`를 다른 행에 두었다. Underbrace와
FormulaNote는 모두 한국어로 operation의 이유를 설명한다.

### QA에서 실제로 발견하고 고친 실패

첫 local browser run은 30개 state 중 두 mobile scene에서 실패했다.

- Q-learning step 3: 한 행 update 식이 container보다 33.98px 넓고 text가
  38px 잘렸다.
- DQN step 4: online/frozen target 관계를 한 행에 몰아 formula가 56.83px
  넘치고 text가 61px 잘렸다.

글자를 줄이지 않고 계산의 provenance 단위로 식을 여러 행에 분리했다.
Q-learning tree의 영문 `ACTION` label도 좁은 mobile column에서 기계적으로
줄바꿈되어, `다음 state`, `왼쪽 후보`, `정지 후보`, `오른쪽 후보`로
바꾸었다. 수정 뒤 직접 screenshot 검사와 자동 pixel oracle을 다시
통과했다.

```yaml
value_learning_mobile_stage_heights_after:
  q_learning: [963, 959, 1030, 1053, 884]
  dqn: [1067, 1118, 1044, 1194, 1165]
  formula_min_scale:
    q_learning: 0.82
    dqn: 0.85
  max_formula_overflow_px: 0
  internal_scroll: 0
  clipped_text: 0
```

브라우저 QA가 통과한 뒤 TypeScript build는 `PaperSceneViz`에 존재하지 않는
`title` prop을 발견했다. 공유 renderer 계약에 맞게 `ariaLabel`로 수정했다.
이는 pixel 검사가 static component contract를 대신할 수 없으며 둘을 모두
닫아야 한다는 재현 사례다.

### 감사 결과와 production 영수증

이전 mastery report와 slug별 score를 직접 diff했다. 바뀐 글은 정확히
두 개뿐이다.

```yaml
value_learning_mastery:
  paper_q_learning_1992: "84 -> 100"
  paper_dqn_2015: "84 -> 100"
  changed_unrelated_articles: 0
  score_bucket_after:
    75_to_89: 48
    90_or_more: 256
  report: ".codex-tmp/ai-mastery-after-value-learning-2026-07-31.json"
  focused_eslint: "pass"
  typescript_project_build: "pass"
  vite_artifact_created: "pass"
```

```yaml
value_learning_release:
  deployed_at: "2026-07-31 13:16:22 KST"
  service: "cm-blog.service"
  status: "active"
  index_sha256: "da908d6eff07906962453585948be13b4ca3579e4e6a808b4de3ba892fb1313a"
  production_hash_matches_local: true
  javascript: "/lab/assets/index-CqHQTgAq.js"
  stylesheet: "/lab/assets/index-BfW-oKwo.css"
  renderer_chunk: "/lab/assets/ModelBasedRlPaperViz-DnQr1Rwi.js"
  renderer_chunk_bytes: 37663
  paper_viz_chunk: "/lab/assets/ValueLearningPaperViz-UFo6spH-.js"
  paper_viz_chunk_bytes: 17793
  route_http_200: 2
  article_chunk_http_200: 2
  local_viz:
    report: ".codex-tmp/value-learning-paper-viz-local.json"
    viewport_route_checks: 6
    step_state_checks: 30
    failures: 0
  local_narrative:
    report: ".codex-tmp/value-learning-paper-narrative-local.json"
    viewport_route_checks: 6
    errors: 0
    warnings: 0
  production_viz:
    report: ".codex-tmp/value-learning-paper-viz-production.json"
    viewport_route_checks: 6
    step_state_checks: 30
    failures: 0
  production_narrative:
    report: ".codex-tmp/value-learning-paper-narrative-production.json"
    viewport_route_checks: 6
    errors: 0
    warnings: 0
```

### 4B · 9B 재현 packet

4B extractor는 prose를 만들지 않고 source/evidence ownership ledger만
채운다.

```yaml
value_learning_boundary:
  paper: q_learning|dqn
  scene: 1
  state_representation: ""
  action_executed_by: ""
  target_action_selected_by: ""
  observed_evidence: ""
  bootstrapped_value: ""
  prediction_owner: ""
  target_owner: ""
  update_scope: ""
  replay_age_or_visit_count: ""
  theorem_assumptions: []
  evidence_ref: ""
```

9B reviewer는 인접 장면과 1차 출처를 대조한다.

```yaml
value_learning_review:
  behavior_vs_target_policy: ""
  observed_vs_estimated_target: ""
  max_bias_path: ""
  table_vs_shared_parameter_update: ""
  coverage_and_step_size_contract: ""
  replay_distribution_effect: ""
  target_timescale_effect: ""
  terminal_mask_boundary: ""
  paper_claim_supported: []
  paper_claim_not_supported: []
  benchmark_transfer_ceiling: ""
  do_not_change_yet: []
```

작은 모델 판정 규칙은 다음과 같다.

- `max`가 고른 target action을 environment에서 실행한 action으로 쓰지 않는다.
- Immediate reward는 observed evidence이고 next-state value는 estimate다.
- Q-learning convergence theorem은 finite discrete lookup table의 조건부
  결과다.
- DQN은 target form을 이어받지만 table theorem을 상속하지 않는다.
- Uniform replay는 correlation을 낮추지만 exact IID를 보장하지 않는다.
- Target network는 delayed copy이며 independent critic이나 truth가 아니다.
- Terminal transition에는 bootstrap mask가 필요하다.
- Atari human-normalized score를 sample efficiency, transfer, general
  intelligence의 증거로 확장하지 않는다.

Orchestrator만 primary-source claim ceiling, theorem/evidence 경계, learning
path position, Korean KaTeX operation label, screenshot 직접 검사, browser
pixel oracle, TypeScript contract, production hash와 chunk receipt를 닫는다.
Claude 검증은 2026-08-01 18:00 KST 전까지 사용량이 없으므로 완료로
표시하지 않는다. 예약된 Context Manager timer가 그 시각 이후 남은
287개 closure job을 병렬 재개하도록 대기 중이다.

## 2026-07-31 · Policy-gradient 최소 기반 논문 경로 closure

이번 묶음은 `REINFORCE 1992 -> GAE 2015 -> PPO 2017` 경로의 앞 두
논문이다. REINFORCE는 stochastic policy의 black-box outcome gradient를,
GAE는 그 gradient에 넣을 action credit의 시간 범위를 다룬다. PPO가
정책 이동과 rollout 재사용을 다루는 다음 층이라는 경계를 유지했다.

Claim ceiling은 다음 1차 출처로 고정했다.

- REINFORCE Springer article:
  `https://link.springer.com/article/10.1007/BF00992696`
- REINFORCE Springer paper:
  `https://link.springer.com/content/pdf/10.1007/BF00992696.pdf`
- Ronald J. Williams publication page:
  `https://ccs.neu.edu/home/rjw/pubs.html`
- GAE paper:
  `https://arxiv.org/abs/1506.02438`
- GAE PDF:
  `https://arxiv.org/pdf/1506.02438`

원문 대조로 잠근 주요 경계는 다음과 같다.

- Williams의 Theorem 1은 associative immediate-reinforcement task에서
  expected update와 expected reinforcement gradient의 정렬을 보이고,
  공통 positive rate factor에서는 unbiased gradient sample 관계를 준다.
- 원 논문의 delayed-reinforcement 범위는 제한적이다. 현대 trajectory
  return-to-go 식은 score-function 원리의 transfer bridge이지, 임의의 긴
  MDP를 원문이 모두 증명했다는 뜻이 아니다.
- Baseline은 current sampled action과 조건부로 독립이어야 expected score
  항이 상쇄된다. Mean reinforcement가 항상 variance-minimizing baseline인
  것도 아니다.
- GAE 논문은 undiscounted objective에서 `gamma < 1` 자체가 먼 response를
  버리는 bias를 만들 수 있음을 구분한다. `lambda`는 approximate value를
  사용할 때 residual horizon의 bias-variance trade-off를 조절한다.
- `GAE(gamma, 1)`은 infinite/올바른 episodic boundary에서 empirical
  return minus value로 telescope한다. Finite truncation tail을 잘못 0으로
  만들면 이 관계도 깨진다.
- GAE 실험은 policy TRPO와 value-function trust region을 함께 사용했다.
  Locomotion 결과를 GAE 단독 인과 효과로 쓰지 않는다.

### 본문과 Viz만으로 풀어야 하는 숨은 전이 문제

1. Policy가 낸 action probability vector와 environment에 실제로 실행한
   action sample은 왜 다른 artifact인가?
2. 실행하지 않은 action의 counterfactual reward를 관측했다고 쓸 수 없는
   이유는 무엇인가?
3. Environment derivative 없이도 `grad log pi`로 expected reward
   gradient를 얻는 log-derivative path는 무엇인가?
4. Reward는 gradient path인가, sampled gradient를 곱하는 scalar weight인가?
5. Positive reward인데도 baseline보다 낮으면 action probability를 낮출 수
   있는 이유는 무엇인가?
6. State-dependent baseline은 허용되지만 uncorrected action-dependent
   baseline은 expected update를 바꿀 수 있는 이유는 무엇인가?
7. Unbiased expected direction과 low finite-batch variance, global
   convergence는 왜 서로 다른 주장인가?
8. GAE residual에서 reward, current value, next value는 각각 관측과 추정의
   어느 owner에 속하는가?
9. Actual terminal과 time-limit truncation을 하나의 done bit로 합치면
   bootstrap target이 어떻게 틀어지는가?
10. `gamma`와 `lambda`가 둘 다 weight에 나타나도 왜 같은 knob가 아닌가?
11. Reverse recurrence의 `A_T=0`이 `V(s_T)=0`을 뜻하지 않는 이유는 무엇인가?
12. GAE가 advantage target을 만든다는 사실과 TRPO/PPO가 policy 이동을
   제한한다는 사실을 왜 별도 층으로 기록해야 하는가?

별도 quiz를 노출하지 않았다. Reader bridge와 각 scene의 owner, output,
invariant, observed/estimated source, boundary mask를 따라가면 위 답을
복원할 수 있게 했다.

### 본문과 causal Viz 변경

두 spec에 `readerBridge`를 추가했다.

- REINFORCE: stochastic policy, sampled action, score function, baseline
- GAE: critic, advantage, TD residual, bootstrap boundary

본문의 핵심 식과 Viz 식은 operation을 한국어 underbrace로 분해했다.
`paper-spine/viz/PolicyGradientPaperViz.tsx`가 논문별 content와 marker를
소유하고, 공통 typography와 layout은 `PaperSceneViz`를 재사용한다.

- REINFORCE: stochastic action owner, black-box environment evidence,
  characteristic eligibility, baseline cancellation, theorem/transfer boundary
- GAE: frozen rollout provenance, one-step residual, horizon mixture,
  reverse recurrence와 두 knob, evidence/optimizer boundary

각 route wrapper가 자신의 Viz를 직접 import한다. 공용 `rlSpecs.ts`에 Viz를
넣지 않아 audit가 이웃 DQN, PPO, DDPG 글을 허위 완료 처리하지 않는다.

### QA에서 실제로 발견하고 고친 실패

첫 local browser run은 scene 30개 중 mobile 두 글에서 각각
`text-clipped`, `math-unreadable-or-clipped`를 냈다.

- REINFORCE: action probability vector 8.11px, baseline cancellation
  18.31px, trajectory gradient 80.95px overflow
- GAE: 한 행에 mask, reward, next value, current value를 넣은 TD residual이
  3.09px overflow

글자를 축소하거나 설명을 삭제하지 않고 다음 계산 순서로 행을 분리했다.

- Probability definition -> sampled action
- Baseline expected term -> probability sum -> zero
- Per-step contribution `g_t` -> trajectory expectation
- Bootstrap mask -> allowed future value -> target -> residual

두 번째 run은 scene 내부 30개 상태를 통과했다. 그러나 QA가 scene marker
안의 KaTeX만 보던 허점을 수정해 페이지 전체 `[data-math-fit]`도 검사하자,
REINFORCE 본문 trajectory 식이 mobile에서 35.89px 넘치는 것을 다시
발견했다. 본문도 동일한 `g_t` 분해로 수정한 뒤 전체 수식이 통과했다.

직접 screenshot 검사에서는 첫 scene의 3-column label `action`이
`ACTI / ON`으로 기계적으로 끊기는 문제도 발견했다. `왼쪽 후보`, `정지
후보`, `오른쪽 후보`로 바꿔 의미와 mobile typography를 함께 고쳤다.

초기 narrative audit의 `ERR_CONNECTION_REFUSED :4177`은 제품 실패가 아니라
audit harness 기본 포트와 실제 dev server `:4181` 불일치였다. Base URL을
명시해 재실행했고 오류·경고 0을 확인했다. Product failure와 harness
configuration failure를 같은 bucket으로 기록하지 않는다.

```yaml
policy_gradient_mobile_after:
  reinforce_stage_heights: [1097, 1018, 1055, 1181, 1193]
  gae_stage_heights: [1024, 1132, 1013, 1144, 1227]
  minimum_scene_formula_scale:
    reinforce: 0.83
    gae: 0.82
  minimum_full_page_formula_scale:
    reinforce: 0.87
    gae: 0.91
  max_formula_overflow_px: 0
  internal_scroll: 0
  clipped_text: 0
```

### 감사 결과와 production 영수증

이전 mastery report와 slug별 score를 직접 diff했다. 바뀐 글은 정확히
두 개뿐이다.

```yaml
policy_gradient_mastery:
  paper_reinforce_1992: "84 -> 100"
  paper_gae_2015: "84 -> 100"
  changed_unrelated_articles: 0
  score_bucket_after:
    75_to_89: 46
    90_or_more: 258
  report: ".codex-tmp/ai-mastery-after-policy-gradient-2026-07-31.json"
  focused_eslint: "pass"
  full_typescript_vite_build: "pass"
```

```yaml
policy_gradient_release:
  deployed_at: "2026-07-31 13:32:00 KST"
  service: "cm-blog.service"
  status: "active"
  index_sha256: "1618185529e87279547ee47afdaff114fc6545bcca77dcc0abaa1d892fe1dce5"
  production_hash_matches_local: true
  javascript: "/lab/assets/index-DqfvMK-Z.js"
  stylesheet: "/lab/assets/index-BfW-oKwo.css"
  renderer_chunk: "/lab/assets/ModelBasedRlPaperViz-CSwaKKw4.js"
  renderer_chunk_bytes: 37663
  paper_viz_chunk: "/lab/assets/PolicyGradientPaperViz-CDwSyeGV.js"
  paper_viz_chunk_bytes: 19456
  route_http_200: 2
  article_chunk_http_200: 2
  local_viz:
    report: ".codex-tmp/policy-gradient-paper-viz-local.json"
    viewport_route_checks: 6
    step_state_checks: 30
    failures: 0
  local_narrative:
    report: ".codex-tmp/policy-gradient-paper-narrative-local.json"
    viewport_route_checks: 6
    errors: 0
    warnings: 0
  production_viz:
    report: ".codex-tmp/policy-gradient-paper-viz-production.json"
    viewport_route_checks: 6
    step_state_checks: 30
    failures: 0
  production_narrative:
    report: ".codex-tmp/policy-gradient-paper-narrative-production.json"
    viewport_route_checks: 6
    errors: 0
    warnings: 0
```

### 4B · 9B 재현 packet

4B extractor는 prose를 만들지 않고 action/evidence/target provenance만
채운다.

```yaml
policy_gradient_boundary:
  paper: reinforce|gae
  scene: 1
  rollout_policy_version: ""
  sampled_action: ""
  unexecuted_actions: []
  observed_reward: ""
  policy_log_probability: ""
  baseline_or_value_version: ""
  current_value: ""
  next_value: ""
  terminal_kind: actual|truncation|none
  bootstrap_mask: null
  estimator_output: ""
  optimizer_owner: ""
  evidence_ref: ""
```

9B reviewer는 인접 장면과 원문을 대조한다.

```yaml
policy_gradient_review:
  probability_vector_vs_sample: ""
  observed_vs_counterfactual_reward: ""
  differentiated_path_vs_scalar_weight: ""
  baseline_independence_condition: ""
  expected_direction_vs_finite_sample: ""
  reward_vs_value_provenance: ""
  gamma_role: ""
  lambda_role: ""
  terminal_vs_truncation: ""
  estimator_vs_optimizer_boundary: ""
  paper_claim_supported: []
  paper_claim_not_supported: []
  experiment_coupling: []
  do_not_change_yet: []
```

작은 모델 판정 규칙은 다음과 같다.

- Policy probability vector와 sampled action을 같은 artifact로 쓰지 않는다.
- 실행하지 않은 action의 reward를 관측했다고 쓰지 않는다.
- Reward는 `theta`로 미분하는 path가 아니라 score sample의 scalar weight다.
- Baseline은 current sampled action에 의존하지 않아야 zero-mean score
  cancellation을 그대로 쓸 수 있다.
- Unbiased expected update를 low variance, fast convergence, global optimum
  보장으로 확장하지 않는다.
- GAE의 reward는 environment observation이고 두 value는 critic estimate다.
- `gamma`는 objective의 미래 시간척도, `lambda`는 residual mixture의
  시간척도다.
- Actual terminal과 time-limit truncation의 bootstrap mask를 합치지 않는다.
- `A_T=0` recurrence boundary를 `V(s_T)=0`으로 해석하지 않는다.
- GAE는 advantage estimator이고 TRPO/PPO는 policy optimizer 계약이다.
- 3D locomotion 결과를 GAE 단독 ablation으로 쓰지 않는다.

Orchestrator만 primary-source claim ceiling, score-function/trajectory transfer
경계, Reader bridge, Korean KaTeX operation label, full-page formula oracle,
직접 screenshot 검사, TypeScript/Vite build, production hash와 chunk receipt를
닫는다. Claude 검증은 2026-08-01 18:00 KST 전까지 사용량이 없으므로
완료로 표시하지 않는다. 예약된 Context Manager timer가 그 시각 이후
남은 287개 closure job을 병렬 재개하도록 대기 중이다.

## 2026-07-31 · Continuous-control paper spine closure

### 선택 이유와 읽기 경계

Policy-gradient estimator 다음에는 연속 action을 실제로 최적화하는 세
논문을 하나의 causal chain으로 닫았다.

1. DDPG는 continuous argmax를 deterministic actor로 amortize한다.
2. TD3는 actor가 critic의 approximation error를 exploit하는 feedback
   loop를 세 경로로 분해한다.
3. SAC는 외부 behavior noise 대신 policy entropy를 objective 안에 넣고,
   stochastic actor를 off-policy로 학습한다.

일반적인 알고리즘 요약이 아니라 다음 transfer 문제를 새 본문만으로
판정할 수 있는지를 숨은 acceptance test로 삼았다.

- DDPG actor가 exact global argmax가 아닌 이유
- Behavior action, current actor action, target actor action의 provenance
- Replay에 저장할 action과 actor update에서 다시 sample할 action의 차이
- Target actor와 target critic이 함께 만드는 label error
- Actor gradient가 critic input까지만 통과하고 environment를 미분하지
  않는 경계
- Actor step에서 critic input gradient는 쓰되 critic weight는 갱신하지
  않는 optimizer ownership
- Target network가 truth oracle가 아니라 delayed copy라는 한계
- TD3 min target이 calibrated uncertainty나 unbiased estimate가 아닌 이유
- 같은 data와 target을 본 twin critics의 error correlation
- Behavior exploration noise와 target policy smoothing noise의 목적 차이
- TD3 원 Algorithm 1에서 actor가 `Q1`을 사용하는 사실
- Policy delay와 Polyak coefficient가 각각 frequency와 step size라는 차이
- SAC entropy가 safety constraint나 단순 action noise가 아닌 objective인
  이유
- Temperature alpha와 reward scale의 단위 관계
- Replay state와 current stochastic actor sample의 provenance
- Tanh transform 뒤 log-density Jacobian correction
- Maximum entropy가 offline OOD action 문제를 해결하지 않는 경계
- Original SAC와 modern SAC의 network·target·temperature contract

### Primary-source reconstruction

```yaml
continuous_control_primary_sources:
  ddpg:
    title: "Continuous control with deep reinforcement learning"
    url: "https://arxiv.org/abs/1509.02971"
    pdf: "https://arxiv.org/pdf/1509.02971"
    checked:
      - "7-DoF, three actions per joint gives 2187 discrete combinations"
      - "deterministic policy gradient through critic action input"
      - "off-policy replay, target actor, target critic, Polyak update"
      - "behavior exploration noise is external to deterministic actor"
      - "more than twenty simulated physics tasks and some pixel input"
      - "no general nonlinear convergence guarantee"
  td3:
    title: "Addressing Function Approximation Error in Actor-Critic Methods"
    url: "https://proceedings.mlr.press/v80/fujimoto18a.html"
    pdf: "https://proceedings.mlr.press/v80/fujimoto18a/fujimoto18a.pdf"
    checked:
      - "clipped double-Q target"
      - "delayed actor and target updates"
      - "target policy smoothing distinct from behavior exploration"
      - "actor update uses Q1 in Algorithm 1"
      - "CDQ, DP, TPS ablation over ten trials"
      - "component importance varies by task"
      - "reported defaults d=2, sigma=0.2, clip=0.5"
  sac:
    title: "Soft Actor-Critic: Off-Policy Maximum Entropy Deep Reinforcement Learning with a Stochastic Actor"
    url: "https://proceedings.mlr.press/v80/haarnoja18b.html"
    pdf: "https://proceedings.mlr.press/v80/haarnoja18b/haarnoja18b.pdf"
    checked:
      - "reward plus entropy objective"
      - "reparameterized stochastic actor"
      - "original ICML 2018 already uses two Q functions and their minimum"
      - "original network contract includes explicit V and target V"
      - "reward scale acts as inverse-temperature control in experiments"
      - "five-seed continuous-control comparisons"
      - "later no-V and automatic-alpha recipe is a separate version"
```

원문 대조 중 기존 SAC spec의 실제 내용 오류를 수정했다. 기존 문구는 twin
Q를 후속 modern recipe의 특징처럼 읽히게 했다. ICML 2018 원 논문도 이미
두 Q를 독립 학습하고 minimum을 value target과 policy gradient에
사용한다. 정확한 경계는 다음과 같다.

```yaml
sac_version_contract:
  original_icml_2018:
    networks: [policy, Q1, Q2, V, target_V]
    conservative_value: "min(Q1, Q2)"
    temperature_control: "reward scale / fixed relative temperature effect"
  common_later_recipe:
    networks: [policy, Q1, Q2, target_Q1, target_Q2]
    removed: [explicit_V, target_V]
    retained: [twin_Q, minimum]
    added: [automatic_alpha, target_entropy]
```

### 본문과 causal Viz 구현

새 파일 `paper-spine/viz/ContinuousControlPaperViz.tsx`에 논문별 5개
scene, 총 15개 scene을 만들었다. 각 route wrapper가 자기 Viz를 직접
import해 이웃 글의 mastery score를 허위로 올리지 않는다.

```yaml
ddpg_scenes:
  - "continuous argmax -> learned actor proposal"
  - "current actor / behavior noise / executed action / target action"
  - "replay -> target actor -> target critic -> current critic"
  - "critic action slope -> actor Jacobian, environment outside gradient"
  - "Polyak targets, evidence ceiling, TD3 handoff"
td3_scenes:
  - "positive critic error feedback loop"
  - "two target critics -> minimum, actor still uses Q1"
  - "target smoothing noise vs behavior exploration"
  - "frequent critic steps vs delayed actor and target steps"
  - "CDQ + TPS + DP evidence and residual risks"
sac_scenes:
  - "reward-only vs entropy-regularized objective"
  - "Gaussian reparameterization -> tanh -> corrected density"
  - "original twin-Q + V + target-V network contract"
  - "replay state -> current policy sample -> soft actor objective"
  - "original evidence ceiling and modern version boundary"
```

세 spec에 네 개씩 reader bridge를 추가하고 본문 핵심 식도 한국어
underbrace로 다시 썼다. 수식 label은 변수 이름을 번역하는 것이 아니라
연산의 이유를 설명한다. 예를 들면 `g_a`는 “critic이 제안한 action 방향”,
`c_H`는 “policy 폭의 비용”, target action noise는 “target 전용 noise”로
표시한다. 각 식 아래 FormulaNote는 data provenance, optimizer owner,
terminal/truncation boundary를 다시 설명한다.

### QA가 발견한 실패와 구조 수정

첫 local browser run은 9개 route-viewport 조합, 45개 scene 상태 중 mobile
세 글에서 8개 failure category를 냈다.

```yaml
continuous_control_first_mobile_failures:
  ddpg:
    scene_3_formula_overflow_px: 2.52
    body_actor_gradient_overflow_px: 33.22
  td3:
    error_feedback_chain_overflow_px: 98.44
    target_smoothing_overflow_px: 16.47
    delayed_update_overflow_px: 14.34
  sac:
    soft_objective_overflow_px: 94.48
    squashed_gaussian_overflow_px: 102.27
    original_network_contract_overflow_px: 63.06
    actor_objective_overflow_px: 68.52
    version_boundary_overflow_px: 112.88
    body_soft_objective_overflow_px: 72.80
    body_actor_objective_overflow_px: 33.95
```

Font를 더 작게 만들지 않고 계산 순서를 중간 artifact로 분해했다.

- DDPG target: `target action -> future value -> Bellman target`
- DDPG actor: `action slope -> per-state actor direction -> batch expectation`
- TD3 feedback: `positive error -> selected action -> raised target -> new error`
- TD3 smoothing: `Gaussian sample -> clipped noise -> perturbed action -> bounded
  target action`
- TD3 delay: `critic every step -> actor gate -> target gate`
- SAC objective: `entropy value -> soft reward -> trajectory objective`
- SAC density: `base noise -> pre-squash sample -> action -> base log-density ->
  transformed log-density`
- Original SAC: `Q minimum -> one-action soft value -> expectation -> Q target`
- SAC actor: `current sample -> entropy cost -> conservative Q -> actor cost`
- SAC versions: network sets와 alpha policy를 서로 다른 행으로 분리

두 번째 run에서 original SAC value regression 한 행만 22.48px 남았다.
`ell_soft = q_min - alpha log pi`라는 sample-level artifact를 먼저 정의한 뒤
`V target = E[ell_soft]`로 바꿔 마지막 overflow를 없앴다.

직접 screenshot 검사에서는 자동 검사를 통과한 SAC 마지막 footer가 좁은
세 열에서 `original/modern implementation split`을 지나치게 잘게
줄바꿈하는 것을 발견했다. `증거 범위 · 원본/후속 구분`처럼 짧은 한국어
contract로 바꿨다.

```yaml
continuous_control_mobile_after:
  ddpg_stage_heights: [1114, 1095, 1117, 1119, 1185]
  td3_stage_heights: [1111, 1126, 1178, 1086, 1066]
  sac_stage_heights: [1155, 1194, 1095, 1237, 1260]
  minimum_scene_formula_scale:
    ddpg: 0.82
    td3: 0.82
    sac: 0.83
  minimum_full_page_formula_scale:
    ddpg: 0.95
    td3: 0.86
    sac: 1.00
  max_formula_overflow_px: 0
  document_horizontal_overflow_px: 0
  internal_scroll: 0
  clipped_text: 0
```

### 감사 결과와 production 영수증

이전 mastery report와 slug별 score를 직접 diff했다. 바뀐 글은 정확히 세
개뿐이다.

```yaml
continuous_control_mastery:
  paper_ddpg_2015: "84 -> 100"
  paper_td3_2018: "84 -> 100"
  paper_sac_2018: "84 -> 100"
  changed_unrelated_articles: 0
  score_bucket_after:
    75_to_89: 43
    90_or_more: 261
  report: ".codex-tmp/ai-mastery-after-continuous-control-2026-07-31.json"
  focused_eslint: "pass"
  full_typescript_vite_build: "pass"
```

```yaml
continuous_control_release:
  deployed_at: "2026-07-31 13:53:40 KST"
  service: "cm-blog.service"
  status: "active"
  index_sha256: "9f85d37cf08329dde56dec2c2761ada475f0197bab5cae1c999f7ddda58e41f5"
  production_hash_matches_local: true
  stylesheet: "/lab/assets/index-BfW-oKwo.css"
  renderer_chunk: "/lab/assets/ModelBasedRlPaperViz-DCjs9RfC.js"
  renderer_chunk_bytes: 37663
  paper_viz_chunk: "/lab/assets/ContinuousControlPaperViz-fscKzUKx.js"
  paper_viz_chunk_bytes: 29734
  route_chunks:
    paper_ddpg_2015: "/lab/assets/paper-ddpg-2015-CcuxOAZ4.js"
    paper_td3_2018: "/lab/assets/paper-td3-2018-Dq_0Hg5O.js"
    paper_sac_2018: "/lab/assets/paper-sac-2018-DRk_KqDh.js"
  route_http_200: 3
  article_chunk_http_200: 3
  local_viz:
    report: ".codex-tmp/continuous-control-paper-viz-local.json"
    viewport_route_checks: 9
    step_state_checks: 45
    failures: 0
  local_narrative:
    report: ".codex-tmp/continuous-control-paper-narrative-local.json"
    viewport_route_checks: 9
    errors: 0
    warnings: 0
  production_viz:
    report: ".codex-tmp/continuous-control-paper-viz-production.json"
    viewport_route_checks: 9
    step_state_checks: 45
    failures: 0
  production_narrative:
    report: ".codex-tmp/continuous-control-paper-narrative-production.json"
    viewport_route_checks: 9
    errors: 0
    warnings: 0
```

### 4B · 9B 재현 packet

4B extractor는 prose를 쓰지 않고 각 transition과 gradient의 owner를
채운다.

```yaml
continuous_control_boundary:
  paper: ddpg|td3|sac
  scene: 1
  replay_state: ""
  stored_behavior_action: ""
  current_policy_action: ""
  target_policy_action: ""
  behavior_noise: ""
  target_smoothing_noise: ""
  current_critics: []
  target_critics: []
  explicit_value_network: ""
  target_value_network: ""
  reward: ""
  terminal_kind: actual|truncation|none
  bootstrap_target: ""
  differentiated_path: []
  frozen_parameters: []
  optimizer_owner: ""
  evidence_ref: ""
  version: original|later|not_applicable
```

9B reviewer는 인접 논문과 원문을 대조한다.

```yaml
continuous_control_review:
  exact_argmax_vs_actor_proposal: ""
  action_provenance: {}
  environment_inside_gradient: false
  critic_frozen_during_actor_step: null
  target_pair_is_delayed_copy: null
  critic_error_feedback_path: []
  twin_error_correlation: ""
  min_estimate_claim_ceiling: ""
  actor_critic_used_by_policy_step: ""
  behavior_noise_vs_target_noise: ""
  policy_delay_vs_polyak_rate: ""
  entropy_objective_vs_safety: ""
  alpha_vs_reward_scale: ""
  reparameterized_sample_path: []
  tanh_density_correction: ""
  original_sac_networks: []
  later_sac_networks: []
  paper_claim_supported: []
  paper_claim_not_supported: []
  do_not_change_yet: []
```

작은 모델 판정 규칙은 다음과 같다.

- Continuous actor output을 exact global argmax로 쓰지 않는다.
- Stored behavior action을 current actor output으로 덮어쓰지 않는다.
- Actor gradient path에 environment transition derivative를 넣지 않는다.
- Actor step에서 critic input gradient 사용과 critic parameter update를
  구분한다.
- Target actor와 critic을 독립 truth source로 부르지 않는다.
- Twin min을 calibrated uncertainty 또는 unbiased estimate로 확장하지
  않는다.
- TD3 actor는 원 Algorithm 1에서 `Q1`을 사용한다.
- Target smoothing noise와 behavior exploration noise를 같은 artifact로
  기록하지 않는다.
- Update frequency `d`와 Polyak step size `tau`를 같은 knob로 합치지 않는다.
- Entropy objective를 safety, constraint satisfaction, offline OOD 해법으로
  부르지 않는다.
- Tanh action과 pre-tanh Gaussian의 density를 동일하게 쓰지 않는다.
- Original SAC에서 twin Q를 제거하지 않는다.
- Later no-V, twin target-Q, automatic-alpha recipe를 ICML 2018 기여로
  소급하지 않는다.

Orchestrator만 primary-source claim ceiling, SAC version correction, reader
bridge, Korean operation underbrace, route-owned Viz, mobile formula
decomposition, full-page math oracle, direct screenshot review, mastery
score-diff, production build/hash/chunk receipt를 닫는다. Claude 검증은
2026-08-01 18:00 KST 전까지 사용량이 없으므로 완료로 표시하지 않는다.
예약된 Context Manager timer와 287개 closure queue는 그대로 유지한다.

## POMDP -> Kalman -> DRQN: 숨은 state를 다루는 세 계약

### 이 배치를 선택한 이유

부분 관측 경로에는 POMDP, Kalman filter, DRQN 글이 이미 있었지만 독자가
세 글을 순서대로 읽었을 때 모두 막연한 "기억" 또는 "state" 방법으로
합쳐질 위험이 있었다. 최신 recurrent agent와 world model을 읽으려면
다음 세 보증을 먼저 분리해야 한다.

1. POMDP belief는 알려진 transition/observation model 아래 history가
   latent state에 주는 exact posterior다.
2. Kalman estimate는 linear dynamics와 second-order statistics라는
   가정 아래 mean/covariance로 계산하는 model-based estimator다.
3. DRQN hidden state는 TD objective에 유용하도록 학습된 recurrent
   representation이며 exact belief라는 보증이 없다.

따라서 새 글을 더 늘리기보다 기존 세 article의 독립 질문을 보존하고,
동일한 시각 문법으로 보증 수준이 낮아지는 경계를 비교 가능하게 만드는
것을 우선했다.

```yaml
partial_observability_learning_path:
  destination: "관측 하나만으로 행동을 고를 수 없는 환경에서 무엇을 기억해야 하는가"
  papers:
    - pomdp_1998: "history -> exact posterior belief -> belief policy"
    - kalman_1960: "linear model -> predicted/corrected mean and covariance"
    - drqn_2015: "pixels -> learned recurrent hidden -> action values"
  non_equivalence:
    belief: "probability distribution with an explicit probabilistic contract"
    kalman_state: "model-based estimate with a linear/second-order claim ceiling"
    recurrent_hidden: "learned task representation without posterior guarantee"
```

### 원문 근거와 주장 상한

POMDP:

- Kaelbling, Littman, Cassandra, *Planning and Acting in Partially Observable
  Stochastic Domains*:
  `https://people.csail.mit.edu/lpk/papers/aij98-pomdp.pdf`
- DOI: `https://doi.org/10.1016/S0004-3702(98)00023-X`
- 원문이 지지하는 핵심은 observation과 state의 분리, belief sufficient
  statistic, state estimator와 policy의 분리, Bayesian predict/correct,
  information-gathering action, alpha-vector upper surface다.
- Finite-horizon value는 piecewise-linear convex지만 infinite horizon은
  무한히 많은 facet이 필요할 수 있다. Witness backup/pruning이 exact
  computation을 개선해도 modest problem조차 어렵다는 complexity
  boundary는 사라지지 않는다.
- 모든 POMDP에 작은 finite-state controller가 존재한다고 일반화하지
  않는다.

Kalman:

- Kalman, *A New Approach to Linear Filtering and Prediction Problems*:
  `https://people.math.harvard.edu/archive/116_fall_03/handouts/Kalman1960.pdf`
- DOI: `https://doi.org/10.1115/1.3662552`
- state-transition formulation, first/second-order statistics, nonlinear
  covariance difference equation, covariance에서 얻는 filter coefficient,
  stationary/nonstationary problem과 growing memory를 근거로 삼았다.
- "모든 noise에서 exact Bayesian posterior"라고 쓰지 않는다. Gaussian
  linear model에서는 mean/covariance가 posterior를 완전히 나타내지만,
  원 논문의 일반 claim ceiling은 optimal linear estimator와 second-order
  statistics다.
- Nonlinear, multimodal, unknown-model problem을 Kalman update가 자동으로
  해결한다고 확장하지 않는다.

DRQN:

- Hausknecht and Stone, *Deep Recurrent Q-Learning for Partially Observable
  MDPs*: `https://arxiv.org/abs/1507.06527`
- PDF: `https://arxiv.org/pdf/1507.06527`
- 첫 post-convolutional fully connected layer를 512-unit LSTM으로
  교체하고, single 84x84 frame, three convolution layers, recurrent
  hidden state, linear Q head를 쓰는 원 구조를 보존했다.
- Sequential update와 random update를 분리했다. 원 논문의 random replay
  update는 임의 subsequence 시작에서 recurrent state를 zero로 두고
  10-step BPTT를 수행한다. 이후 연구의 burn-in을 원 논문 알고리즘으로
  소급하지 않는다.
- Flickering Pong은 frame을 probability 0.5로 blank 처리한다.
- 기존 글의 "10개 standard Atari game"을 Table 1에 맞춰 `9개`로
  수정했다. Standard setting에서 DRQN이 DQN을 일관되게 이긴다는 주장은
  하지 않으며, degraded observability에서 더 graceful하다는 증거만
  분리한다.
- LSTM hidden state를 exact POMDP belief 또는 calibrated uncertainty로
  부르지 않는다.

### Route-owned Viz와 독자 브리지

`PartialObservabilityPaperViz.tsx`에 article별 다섯 scene, 총 15개를
구현했다.

```yaml
pomdp_scenes:
  - "same observation, different latent state"
  - "history -> belief sufficient statistic -> belief policy"
  - "predict -> likelihood weighting -> normalization"
  - "Tiger problem and information action"
  - "alpha vectors -> upper envelope -> witness/pruning -> complexity ceiling"
kalman_scenes:
  - "hidden position/velocity state vs noisy measurement"
  - "mean and covariance prediction"
  - "innovation and innovation covariance"
  - "Kalman gain -> mean correction -> covariance correction"
  - "linear/second-order claim ceiling and residual diagnostics"
drqn_scenes:
  - "fixed frame stack vs learned memory"
  - "CNN -> LSTM -> Q head"
  - "sequential replay vs random zero-init replay; later burn-in boundary"
  - "online/target recurrent TD target and terminal mask"
  - "standard vs flickering evidence and observability claim ceiling"
```

각 scene은 question, explanation, owner, output, invariant, takeaway를
가진다. Route marker는 다음과 같다.

```yaml
route_markers:
  pomdp: 'data-partial-observability-paper-viz="pomdp"'
  kalman: 'data-partial-observability-paper-viz="kalman"'
  drqn: 'data-partial-observability-paper-viz="drqn"'
```

본문에는 글마다 네 개의 reader bridge를 추가했다.

```yaml
reader_bridges:
  pomdp: [latent_state, observation, history, belief]
  kalman: [state_estimate, covariance, innovation, process_and_measurement_noise]
  drqn: [fixed_frame_stack, recurrent_hidden, sequence_replay, bptt_boundary]
```

본문과 scene의 핵심 식은 모두 한국어 operation underbrace와
FormulaNote를 갖는다. Label은 기호 이름을 번역하는 대신 그 항이 왜
필요한지 설명한다. 예를 들어 POMDP의 `Z`는 "전체 evidence mass",
Kalman의 innovation은 "측정이 예측에서 벗어난 양", DRQN의 target value는
"target network의 next value"로 기록한다.

### QA가 발견한 실패와 구조 수정

첫 local run에서 다음 mobile overflow를 발견했다.

```yaml
partial_observability_first_mobile_failures:
  pomdp:
    witness_pruning_label_clipped_px: 8.00
  kalman:
    predicted_covariance_overflow_px: 41.84
    body_covariance_overflow_px: 4.50
    body_innovation_covariance_overflow_px: 28.50
    body_gain_overflow_px: 21.47
  drqn:
    recurrent_td_target_overflow_px: 36.66
```

Font를 줄이지 않고 intermediate artifact를 먼저 보여 주도록 계산을
분해했다.

- POMDP의 좁은 label `Witness·pruning`은 동작이 바로 드러나는
  `유용 vector 찾기`로 바꿨다.
- Kalman covariance는 `P_dyn = FPF^T`, `P^- = P_dyn + Q`로 분리했다.
- Innovation covariance는 `S_model = HP^-H^T`, `S = S_model + R`로
  분리했다.
- Gain은 `C_xz = P^-H^T`, `K = C_xz S^-1`로 분리했다.
- DRQN target은 `v^- = max Q^-`, `y = r + gamma(1-d)v^-`로 분리했다.

직접 screenshot review에서는 자동 검사를 통과했지만 Kalman 마지막
scene의 영어 `nonstationary`, `whiteness`가 좁은 카드에서 잘게
줄바꿈되는 것을 발견했다. "정상·비정상 통계", "알려진 1·2차 통계",
"Innovation의 편향·크기·시간 상관", "미지의 비선형 model"처럼 짧은
한국어 판정 문장으로 바꿨다.

```yaml
partial_observability_mobile_after:
  pomdp_stage_heights: [1102, 1163, 1217, 1143, 1162]
  kalman_stage_heights: [1140, 1134, 1196, 1219, 1235]
  drqn_stage_heights: [1087, 1164, 1214, 1293, 1245]
  minimum_scene_formula_scale:
    pomdp: 0.92
    kalman: 0.82
    drqn: 0.84
  minimum_full_page_formula_scale:
    pomdp: 1.00
    kalman: 0.99
    drqn: 0.84
  max_formula_overflow_px: 0
  document_horizontal_overflow_px: 0
  internal_scroll: 0
  clipped_text: 0
```

### 감사 결과와 production 영수증

```yaml
partial_observability_mastery:
  paper_pomdp_1998: "84 -> 100"
  paper_kalman_filter_1960: "84 -> 100"
  paper_drqn_2015: "84 -> 100"
  changed_unrelated_articles: 0
  score_bucket_after:
    75_to_89: 40
    90_or_more: 264
  report: ".codex-tmp/ai-mastery-after-partial-observability-2026-07-31.json"
  focused_eslint: "pass"
  git_diff_check: "pass"
  full_typescript_vite_build: "pass"
```

```yaml
partial_observability_release:
  deployed_at: "2026-07-31 14:12:28 KST"
  service: "cm-blog.service"
  status: "active"
  index_sha256: "be0ce698e005c2dd9fc13aa7fb21e8d4efc9525aff51c056e618690d3d7f37c7"
  production_hash_matches_local: true
  stylesheet: "/lab/assets/index-BfW-oKwo.css"
  renderer_chunk: "/lab/assets/ModelBasedRlPaperViz-D7RDVmtD.js"
  renderer_chunk_bytes: 37663
  paper_viz_chunk: "/lab/assets/PartialObservabilityPaperViz-BLyPzFyY.js"
  paper_viz_chunk_bytes: 61054
  route_chunks:
    paper_pomdp_1998: "/lab/assets/paper-pomdp-1998-D88zLjc3.js"
    paper_kalman_filter_1960: "/lab/assets/paper-kalman-filter-1960-DIYfNpdw.js"
    paper_drqn_2015: "/lab/assets/paper-drqn-2015-BEenlaJO.js"
  route_http_200: 3
  article_chunk_http_200: 3
  shared_chunk_http_200: 2
  local_viz:
    report: ".codex-tmp/partial-observability-paper-viz-local.json"
    viewport_route_checks: 9
    step_state_checks: 45
    failures: 0
  local_narrative:
    report: ".codex-tmp/partial-observability-paper-narrative-local.json"
    viewport_route_checks: 9
    errors: 0
    warnings: 0
  production_viz:
    report: ".codex-tmp/partial-observability-paper-viz-production.json"
    viewport_route_checks: 9
    step_state_checks: 45
    failures: 0
  production_narrative:
    report: ".codex-tmp/partial-observability-paper-narrative-production.json"
    viewport_route_checks: 9
    errors: 0
    warnings: 0
```

### 4B · 9B 재현 packet

4B extractor는 세 글의 "state"라는 단어를 합치지 않고 estimator
contract를 채운다.

```yaml
partial_observability_boundary:
  paper: pomdp|kalman|drqn
  latent_state: ""
  observation: ""
  history_available: []
  model_known:
    transition: null
    observation: null
    dynamics: null
    measurement: null
  estimate_representation: belief_distribution|mean_covariance|learned_hidden
  predict_input: []
  correction_evidence: ""
  normalization_or_covariance_rule: ""
  policy_input: ""
  replay_initialization: none|carried|zeroed|burn_in
  bptt_window: null
  exactness_claim: ""
  assumptions: []
  failure_signal: []
  evidence_ref: ""
```

9B reviewer는 원문과 인접 글을 대조해 아래 경계를 닫는다.

```yaml
partial_observability_review:
  observation_equals_state: false
  belief_is_map_state: false
  predict_before_correct: null
  information_action_changes_world: null
  finite_horizon_pwlc_scope: ""
  infinite_horizon_facet_ceiling: ""
  kalman_estimator_class: ""
  gaussian_posterior_completeness_scope: ""
  covariance_owner: ""
  innovation_diagnostics: []
  drqn_architecture_replacement: ""
  replay_mode_original: []
  zero_init_vs_burn_in: ""
  original_bptt_steps: null
  standard_atari_game_count: null
  standard_result_ceiling: ""
  flickering_result_ceiling: ""
  recurrent_hidden_is_exact_belief: false
  paper_claim_supported: []
  paper_claim_not_supported: []
  do_not_change_yet: []
```

작은 모델 판정 규칙은 다음과 같다.

- Observation을 latent state와 동일시하지 않는다.
- Belief를 MAP state 하나로 줄이지 않는다.
- Bayesian update에서 observation correction을 transition prediction보다
  먼저 적용하지 않는다.
- Sensing action을 immediate world reward만으로 평가하지 않는다.
- Finite-horizon alpha-vector 결과를 infinite horizon의 finite-facet
  보장으로 확장하지 않는다.
- Kalman filter를 arbitrary nonlinear/multimodal posterior의 exact solver로
  부르지 않는다.
- Gaussian assumption 아래의 posterior completeness와 원 논문의
  optimal-linear/second-order claim을 구분한다.
- Process noise covariance와 measurement noise covariance의 owner를
  바꾸지 않는다.
- DRQN random replay zero initialization과 후속 burn-in recipe를 합치지
  않는다.
- 원 논문의 10-step BPTT를 임의 길이 recurrent training으로 바꾸지
  않는다.
- Standard Atari 비교 수를 9가 아닌 10으로 쓰지 않는다.
- Standard setting에서 systematic superiority를 주장하지 않는다.
- Flickering observation robustness를 general POMDP solution으로 확장하지
  않는다.
- Recurrent hidden state를 normalized posterior belief로 부르지 않는다.

Orchestrator만 primary-source claim ceiling, `9 games` correction,
belief/Kalman/hidden-state non-equivalence, Korean operation underbrace,
reader bridge, route-owned Viz, mobile equation decomposition, direct
screenshot review, mastery score-diff, production build/hash/chunk receipt를
닫는다. Claude 검증은 사용량 제약 때문에 `2026-08-01 18:00 KST` 이후
예약된 Context Manager queue에서 수행하며, 그 전에는 완료로 표시하지
않는다.

## 22. CPO -> Lyapunov Safe RL -> Recovery RL 검증과 배포

이 배치의 목표는 안전 강화학습 방법을 이름 순으로 요약하는 것이 아니었다.
세 글이 각각 어떤 안전 계약을 소유하고, 그 계약이 어디서 깨지는지를
구분한 뒤 다음 글로 넘기는 것이었다.

```yaml
safe_policy_handoff:
  cpo_2017:
    decision: constrained_policy_update
    contract: expected_discounted_cost_with_a_bound_residual
    does_not_mean: chance_constraint_or_sample_path_safety
  lyapunov_2018:
    decision: local_policy_distribution_inside_a_bellman_half_space
    contract: exact_tabular_policy_iterate_feasibility
    does_not_mean: live_remaining_budget_or_neural_certificate
  recovery_rl_2021:
    decision: reject_a_task_action_and_execute_a_recovery_policy
    contract: learned_runtime_intervention_under_estimation_assumptions
    does_not_mean: certified_recovery_action_or_formal_hardware_safety
```

### 왜 이 세 편을 한 묶음으로 읽는가

CPO는 정책 전체의 기대 비용을 trust region 안에서 제한한다. Lyapunov
Safe RL은 전역 예산을 상태별 한 단계 Bellman 부등식으로 바꾼다. Recovery
RL은 이미 학습된 task policy가 제안한 행동을 실행 직전에 걸러낸다. 따라서
세 글을 읽으면 같은 "safe RL"이라는 이름 아래에서도 다음 질문이 다르다는
것을 볼 수 있다.

1. 정책 업데이트 자체를 어떻게 제한하는가.
2. 전역 기대 비용을 어떤 지역 조건으로 바꾸는가.
3. 실행 시점에 위험 행동을 어떻게 가로채는가.
4. 기대 비용, 사건 확률, 물리적인 무사고 중 실제로 무엇을 보장하는가.

이 질문을 닫지 못하면 독자는 낮은 평균 비용을 낮은 사고 확률로, local
surrogate 통과를 실제 시스템 인증으로, recovery gate 작동을 안전한 복귀
보장으로 오해하게 된다.

### 원문 근거와 독립 감사

```yaml
safe_policy_primary_sources:
  cpo:
    proceedings: "https://proceedings.mlr.press/v70/achiam17a.html"
    paper: "https://proceedings.mlr.press/v70/achiam17a/achiam17a.pdf"
    supplement: "https://proceedings.mlr.press/v70/achiam17a/achiam17a-supp.pdf"
  lyapunov:
    abstract: "https://papers.nips.cc/paper_files/paper/2018/hash/4fe5149039b52765bde64beb9f674940-Abstract.html"
    paper: "https://papers.nips.cc/paper_files/paper/2018/file/4fe5149039b52765bde64beb9f674940-Paper.pdf"
  recovery_rl:
    abstract: "https://arxiv.org/abs/2010.15920"
    paper: "https://arxiv.org/pdf/2010.15920"
    project: "https://sites.google.com/berkeley.edu/recovery-rl/home"
```

세 Codex 독립 감사자는 같은 파일을 고치지 않고 각각 CPO, Lyapunov,
Recovery RL의 원문·부록·공식 구현을 읽었다. 각 감사는 exact data flow,
guarantee ceiling, evidence ceiling, common misconception, 다섯 scene,
reader bridge, hard transfer test를 별도 memo로 제출했다. Claude는
사용하지 않았다.

```yaml
safe_policy_independent_audit:
  cpo: "/root/audit_cpo"
  lyapunov: "/root/audit_lyapunov"
  recovery_rl: "/root/audit_recovery_rl"
  workspace_edits_by_auditors: 0
  claude_used: false
  claude_deferred_until: "2026-08-01 18:00 KST"
```

### 원문 대조로 고친 경계

**CPO**

- Proposition 2의 residual은 exact update (10)에 대한 경계다. sampled
  neural QCQP의 유한 표본 보장으로 확장하지 않았다.
- 정식 반복 논증에는 feasible initial policy가 필요하다. practical
  recovery direction은 이를 대체하거나 theorem을 복구하지 않는다.
- 실험은 Point/Ant/Humanoid Circle과 Point/Ant Gather, 총 다섯 조합이다.
  존재하지 않는 Humanoid-Gather를 포함하지 않았다.
- reward critic과 cost critic, reward GAE와 cost GAE를 별도 ledger로
  보여 주고, cost gradient의 trajectory-length rescaling을 구현 경계로
  남겼다.
- expected discounted cost는 chance constraint나 per-state hard safety가
  아니다.

**Lyapunov Safe RL**

- exact feasibility는 tabular SPI/SVI의 exact evaluation과 local solve에
  해당한다. SDPI/SDQN은 critic과 distillation 오차가 작을 때의 근사
  구현이며 논문은 neural error bound를 주지 않는다.
- 존재 lemma의 auxiliary epsilon은 signed일 수 있지만, 계산 가능한 LP의
  `tilde epsilon`은 nonnegative다.
- `L(s)`는 정책 반복 사이에 다시 구성하는 baseline-dependent value
  certificate다. 실행 중 감소시키는 remaining-budget counter가 아니다.
- obstacle visit count의 기대값과 any-collision probability는 같지 않다.
  `P(N >= 1) <= E[N]`은 성립하지만 budget이 1 이상이면 chance-safety
  bound로 쓸모없을 수 있다.
- 여기의 `L`은 expected constraint cost의 Bellman super-solution이며
  자동으로 고전 제어의 stability Lyapunov function이 되지 않는다.

**Recovery RL**

- `gamma_risk=1`이고 violation이 terminal일 때만 `Q_risk`를 raw event
  probability로 읽을 수 있다. `gamma_risk<1`이면 discounted event
  signal이다.
- gate는 task proposal을 거부할 뿐 recovery action 자체를 인증하지
  않는다.
- 대부분의 task에서는 recovery가 활성인 상태에서 failure가 났지만 image
  obstacle avoidance에서는 주로 비활성 상태에서 failure가 났다. 따라서
  failure attribution은 환경별로 적었다.
- 논문은 formal guarantee를 주지 않으며 이를 future work로 명시한다.
- simulation evidence는 6개 domain, 10 seeds이고 논문에 실린 physical
  experiment는 3 runs다.
- metadata의 과도한 "Learned Safety Shield"를 논문 표현인 "Learned
  Recovery Zones"로 고쳤다.
- TTC와 braking 식은 deployment diagnostic이며 논문 theorem이 아님을
  수식 옆에 표시했다.
- 논문의 safety Bellman target은 composite policy의 next action을 쓰지만
  공식 repository HEAD는 revert 뒤 task policy를 sample한다. 두 구현이
  추정하는 quantity를 합치지 않고 paper/code divergence로 노출했다.

### 본문이 통과해야 하는 hard transfer test

```yaml
safe_policy_transfer_tests:
  cpo:
    - "g,b,H,c,delta가 주어졌을 때 trust interval과 safety half-space의 교집합 및 최적 step을 계산한다."
    - "Proposition 2 residual을 수치로 계산하고 budget 이하 인증과 구분한다."
    - "reward, average KL, sampled cost 중 하나가 실패할 때 normal/recovery proposal의 수락 여부를 판정한다."
    - "한 constraint analytic dual을 여러 constraint에 그대로 재사용할 수 없는 이유를 설명한다."
  lyapunov:
    - "두 action backup과 L(s)로 위험 action의 최대 혼합 확률을 구한다."
    - "baseline slack에서 constant tilde-epsilon을 계산하고 online counter가 아님을 설명한다."
    - "replay-buffer state에서만 부등식을 검사하면 contraction proof의 어느 단계가 깨지는지 지목한다."
    - "JSD distillation error가 작아도 boundary에서 feasibility를 잃을 수 있는 이유를 설명한다."
  recovery_rl:
    - "3 step 뒤 확실한 violation과 gamma=0.5에서 Q_risk를 계산하고 12.5% 확률로 읽지 않는다."
    - "task proposal과 recovery proposal이 모두 threshold를 넘을 때 무엇이 실행되고 무엇이 미보장인지 말한다."
    - "a_task와 a_exec가 다를 때 task replay와 recovery replay의 action owner를 구분한다."
    - "offline support 밖의 새 hazard가 낮게 예측될 때 threshold 조절로 고칠 수 없는 이유를 설명한다."
    - "paper의 composite-policy target과 repository HEAD의 task-policy target을 구분한다."
```

이 문제들은 본문에 문제집처럼 노출하지 않는다. 대신 본문만 읽은 독자가
각 문제를 풀 때 필요한 중간 산출물과 판정 경계를 모두 얻는지를 authoring
검사로 사용한다.

### 구현한 15개 단계형 Viz

`SafePolicyPaperViz.tsx`가 세 route를 소유하며 각 route는 다섯 단계로
진행한다.

```yaml
safe_policy_route_markers:
  cpo: 'data-safe-policy-paper-viz="cpo"'
  lyapunov: 'data-safe-policy-paper-viz="lyapunov"'
  recovery: 'data-safe-policy-paper-viz="recovery"'
```

1. CPO: reward/cost CMDP, current-policy surrogate, QCQP geometry,
   CG·dual·line search·recovery direction, theorem/practice/evidence boundary.
2. Lyapunov: global budget의 local-action 문제, baseline에서 certificate
   구성, action-mixture half-space, SPI와 approximate deep fork,
   local-to-global Bellman closure.
3. Recovery RL: offline violation data, terminal-gated Bellman target,
   runtime task proposal gate, modified dynamics와 dual replay, failure
   attribution과 deployment timing.

각 글에는 네 개의 reader bridge가 있다. 핵심 수식은 기호의 번역이 아니라
그 연산을 하는 이유를 한국어 underbrace로 표시하고, 바로 아래 FormulaNote가
식의 입력·중간 산출물·출력을 설명한다.

### QA가 찾은 mobile 실패와 수정

첫 검사에서는 총 9개 viewport-route check에서 다음 overflow를 찾았다.

```yaml
safe_policy_first_mobile_failures:
  cpo:
    qcqp_scene_px: 93.86
    main_formula_px: [64.56, 29.50]
  lyapunov:
    scene_px: [85.91, 92.20, 44.28, 12.67]
    main_formula_px: [55.77, 12.67]
  recovery:
    scene_px: [216.11, 1.84, 12.41, 70.69]
    main_formula_px: [57.78, 70.69]
```

Font를 줄이거나 가로 스크롤을 넣지 않았다. 긴 식을 계산 순서대로 중간
산출물로 분해했다.

- CPO는 `r_C`, `q_KL`, `u*`를 먼저 만든 뒤 acceptance predicate 두 개를
  분리했다. Residual도 `k_gamma`, `e_C`, `r_delta`,
  `J_new-d <= r_delta` 순으로 나눴다.
- Lyapunov는 `T*`, trajectory count `N_d`, expectation을 분리하고,
  `B`, shaped cost, `L`, 이어서 `m_L`, `Q_L`, `B_L`, slack, `g_L`,
  implication 순으로 전개했다.
- Recovery는 `T_v`, event probability, gamma boundary, Bellman prediction과
  loss, `z_task`, `z_rec`, logic time, physical time, total delay, safety
  margin을 각각 독립 행으로 만들었다.

모바일 screenshot은 CPO 3·4단계, Lyapunov 2·3단계, Recovery 1·4·5단계를
직접 열어 자동 검사가 놓칠 수 있는 글자 밀도와 카드 간격까지 확인했다.

```yaml
safe_policy_mobile_after:
  cpo_stage_heights: [1148, 1218, 1220, 1221, 1269]
  lyapunov_stage_heights: [1243, 1163, 1235, 1153, 1393]
  recovery_stage_heights: [1231, 1219, 1148, 1250, 1314]
  minimum_scene_formula_scale:
    cpo: 0.88
    lyapunov: 0.82
    recovery: 0.82
  minimum_full_page_formula_scale:
    cpo: 0.99
    lyapunov: 0.98
    recovery: 0.96
  max_formula_overflow_px: 0
  document_horizontal_overflow_px: 0
  internal_scroll: 0
  clipped_text: 0
```

### Mastery와 production 영수증

```yaml
safe_policy_mastery:
  paper_cpo_2017: "84 -> 100"
  paper_lyapunov_safe_rl_2018: "84 -> 100"
  paper_recovery_rl_2021: "84 -> 100"
  changed_unrelated_articles: 0
  score_bucket_after:
    75_to_89: 37
    90_or_more: 267
  report: ".codex-tmp/ai-mastery-after-safe-policy-2026-07-31.json"
  focused_eslint: "pass"
  git_diff_check: "pass"
  full_typescript_vite_build: "pass"
```

```yaml
safe_policy_release:
  deployed_at: "2026-07-31 14:35:56 KST"
  service: "cm-blog.service"
  status: "active"
  index_sha256: "8836428b51e29c0a3659d1a949e117d11dac975f4af0437b3923d5f67ab77d32"
  production_hash_matches_local: true
  stylesheet: "/lab/assets/index-BfW-oKwo.css"
  renderer_chunk: "/lab/assets/ModelBasedRlPaperViz-B1zFzcgy.js"
  renderer_chunk_bytes: 37663
  paper_viz_chunk: "/lab/assets/SafePolicyPaperViz-BOtu6SUD.js"
  paper_viz_chunk_bytes: 61004
  route_chunks:
    paper_cpo_2017: "/lab/assets/paper-cpo-2017-DvQhx9EH.js"
    paper_lyapunov_safe_rl_2018: "/lab/assets/paper-lyapunov-safe-rl-2018-DgtLAcIt.js"
    paper_recovery_rl_2021: "/lab/assets/paper-recovery-rl-2021-DhkYrpg1.js"
  route_http_200: 3
  article_chunk_http_200: 3
  shared_chunk_http_200: 2
  local_viz:
    report: ".codex-tmp/safe-policy-paper-viz-local.json"
    viewport_route_checks: 9
    step_state_checks: 45
    failures: 0
  local_narrative:
    report: ".codex-tmp/safe-policy-paper-narrative-local.json"
    viewport_route_checks: 9
    errors: 0
    warnings: 0
  production_viz:
    report: ".codex-tmp/safe-policy-paper-viz-production.json"
    viewport_route_checks: 9
    step_state_checks: 45
    failures: 0
  production_narrative:
    report: ".codex-tmp/safe-policy-paper-narrative-production.json"
    viewport_route_checks: 9
    step_viz_checks: 9
    visual_surfaces: 18
    errors: 0
    warnings: 0
```

### 4B · 9B 재현 packet

4B extractor는 세 글의 "constraint"를 하나의 안전 의미로 합치지 않고
다음 계약을 채운다.

```yaml
safe_policy_boundary:
  paper: cpo|lyapunov|recovery_rl
  policy_stage: update|iteration|runtime
  objective_quantity: ""
  constrained_quantity: ""
  expectation_or_event: ""
  state_or_state_action: ""
  policy_distribution_or_action: ""
  local_surrogate: ""
  global_contract: ""
  exact_algorithm: ""
  practical_approximation: []
  required_initial_condition: ""
  certificate_or_critic_owner: ""
  replay_action_owner:
    task: null
    recovery: null
  guarantee_scope: ""
  evidence_scope: ""
  implementation_divergence: ""
  transfer_diagnostics_not_in_paper: []
  source_refs: []
```

9B reviewer는 아래 판정을 닫는다.

```yaml
safe_policy_review:
  expected_cost_equals_event_probability: false
  average_kl_equals_per_state_kl: false
  sampled_qcqp_equals_exact_update: false
  recovery_direction_restores_cpo_theorem: false
  lyapunov_L_is_live_budget_counter: false
  local_policy_mixture_means_each_action_safe: false
  deep_distillation_preserves_exact_certificate: false
  recovery_gate_certifies_recovery_action: false
  sigmoid_output_is_calibrated_probability: false
  discounted_risk_is_raw_probability: null
  cpo_feasible_start_present: null
  lyapunov_exact_vs_approximate: ""
  recovery_task_vs_executed_action: ""
  paper_code_target_divergence: ""
  paper_claim_supported: []
  paper_claim_not_supported: []
  deployment_requirements_not_tested: []
  do_not_change_yet: []
```

작은 모델의 최소 판정 규칙은 다음과 같다.

- 기대 discounted cost를 사고 발생 확률이나 무사고 보장으로 바꾸지 않는다.
- average KL trust region을 모든 state의 policy shift bound로 바꾸지 않는다.
- exact CPO update와 sampled neural QCQP를 같은 theorem 대상으로 쓰지 않는다.
- CPO recovery direction이 feasible initialization이나 formal guarantee를
  복구한다고 쓰지 않는다.
- Lyapunov certificate를 실행 중 남은 예산 counter로 쓰지 않는다.
- feasible action distribution 안의 모든 개별 action이 안전하다고 쓰지
  않는다.
- SDQN/SDPI의 critic·replay·distillation approximation을 tabular
  feasibility theorem에 포함하지 않는다.
- Recovery RL gate가 task action을 막았다는 사실을 recovery action 인증으로
  바꾸지 않는다.
- `gamma_risk<1`의 값을 raw event probability로 쓰지 않는다.
- Proposal action과 executed action이 다를 때 두 replay buffer의 action
  owner를 뒤집지 않는다.
- 논문의 composite-policy target과 공개 code HEAD의 task-policy target을
  하나로 합치지 않는다.
- TTC, braking margin, calibration, interlock을 논문 실험 결과나 theorem으로
  쓰지 않는다.

Orchestrator만 primary-source ceiling, theorem/practical/evidence의 세 층,
paper/code divergence, reader bridge, Korean operation underbrace,
route-owned 15-state Viz, mobile equation decomposition, screenshot review,
mastery score diff, production build/hash/chunk receipt를 닫는다.

Claude 독립 검증은 사용량이 없는 기간에는 호출하지 않는다.
`cm-blog-claude-ai-learning-closure-retry.timer`가
`2026-08-01 18:00:00 Asia/Seoul`에 Context Manager queue를 재개하며,
그 전에는 Claude 검증을 완료로 기록하지 않는다.

## 23. Robot kinematics에서 fixed-path retiming까지 닫기

이번 묶음은 논문 연도를 순서대로 나열한 것이 아니라 아래 독자 질문을
끊김 없이 닫기 위해 선택했다.

```text
관절과 link의 공간 관계를 어떻게 같은 언어로 쓰는가?
  -> 손끝에서 원하는 움직임을 각 관절 속도로 어떻게 바꾸는가?
  -> 경로를 고정한 뒤 actuator 한계 안에서 가장 빠른 시계를 어떻게 붙이는가?
```

따라서 `D-H 1955 -> Whitney 1972 -> Shin-McKay 1985`를 한 개의
transfer chain으로 감사했다. 세 글 아래에는 별도의 robot kinematics
기초 글을 연결하고, 그보다 오래된 모든 역사 자료를 prerequisite로
노출하지 않았다.

### Primary-source 감사와 교정

Claude는 사용량이 없는 기간이라 호출하지 않았다. Codex 독립 감사 세 개와
parent source audit를 합쳐 원문 claim, 후대 표기, modern solver를 분리했다.

```yaml
robot_kinematics_retiming_sources:
  denavit_hartenberg_1955:
    doi: "https://doi.org/10.1115/1.4011045"
    primary_claim: "lower-pair spatial mechanism의 local coordinate change와 closed-loop closure"
    evidence_ceiling: "두 spatial worked examples; calibration robustness 실험 없음"
    corrected:
      - "homogeneous coordinate의 첫 성분이 1인 original 배열"
      - "original alpha 도해·matrix의 implicit left-handed 부호"
      - "R/P뿐 아니라 screw와 cylindrical·spheric·planar lower pair 범위"
      - "main output은 open-chain benchmark가 아니라 product closure"
    later_sources:
      1964_right_handed_restatement: "https://hdl.handle.net/1813/58640"
      notation_history: "https://doi.org/10.1115/DETC2005-85460"
      proximal_warning: "https://people.csail.mit.edu/bkph/articles/New_Notation.pdf"
  whitney_1972:
    doi: "https://doi.org/10.1115/1.3426611"
    primary_claim: "hand-coordinate differential motion을 joint·motor rates로 coordinated resolve"
    exact_command_order: [sweep, reach, lift, tilt, twist, turn]
    corrected:
      - "S=[V^T,Omega^T]^T와 revolute/prismatic Jacobian column owner"
      - "square exact inverse, reduced command, weighted full-row-rank inverse를 분리"
      - "motor map과 current-pose correction loop를 inverse와 분리"
      - "DLS는 1972 원문이 아니라 later remedy로 표시"
    not_in_paper: [SVD, Moore-Penrose 표기, damped least squares]
  shin_mckay_1985:
    doi: "https://doi.org/10.1109/TAC.1985.1104009"
    pdf: "https://rtcl.eecs.umich.edu/rtclweb/assets/publications/1985/shin1985minimumtimecontrol.pdf"
    primary_claim: "specified path의 minimum-time control을 phase-plane constraint problem으로 축소"
    corrected:
      - "q=f(lambda), p=lambda-dot의 original variable contract"
      - "viscous friction을 포함한 M p-dot + Q p^2 + R p + S의 네 항"
      - "M의 양·음·0 branch와 GLB/LUB intersection"
      - "허용 속도 집합이 disconnected intervals가 될 수 있음"
      - "ACOTNI의 단순 경계와 general ACOT graph·backtracking을 분리"
    evidence_ceiling:
      - "가상 2-DoF polar arm RK4 numerical example"
      - "analytical Cartesian island sketch"
      - "physical robot validation 없음"
```

### Hard transfer tests

본문을 읽은 뒤 아래 문제를 풀 수 있는지를 깊이 기준으로 사용했다. 문제
자체를 본문에 붙이는 것이 아니라, 빠진 원인·조건·실패 경계를 찾는 내부
감사 도구로 썼다.

1. 같은 네 숫자를 1955, 1964, modified D-H row에 그대로 복사하면 왜
   regression test가 깨지는가?
2. nearly parallel axes에서 endpoint residual이 작은데도 D-H table
   identification이 불안정할 수 있는 이유는 무엇인가?
3. revolute와 prismatic joint 하나의 unit rate가 hand-frame Jacobian의
   한 열을 각각 어떻게 만드는가?
4. `J^-1 S`와 motor map `M2`를 한 matrix로 합치면 어떤 failure owner를
   잃는가?
5. Whitney의 weighted redundant inverse와 later DLS가 각각 해결하는
   문제가 왜 다른가?
6. `M_i<0`일 때 torque inequality를 path acceleration bound로 나누면
   부등호가 왜 뒤집히는가?
7. `M_i=0`인 점을 작은 epsilon으로 나누지 않고 speed feasibility로
   검사해야 하는 이유는 무엇인가?
8. 한 번의 maximum-acceleration arc와 한 번의 maximum-deceleration
   arc만 이으면 island·tangency가 있는 경우 왜 실패하는가?
9. nominal minimum time이 physical robot의 torque-safe execution을
   보장하지 않는 이유와 release에 더 필요한 telemetry는 무엇인가?

세 글은 이 질문을 각각 geometry convention, differential resolve,
phase-plane feasibility와 evidence boundary까지 추적할 수 있게
재작성했다.

### 15-state Viz와 수식 설계

`RobotKinematicsRetimingPaperViz.tsx`가 route마다 다섯 장면을 소유한다.

```yaml
robot_kinematics_retiming_markers:
  dh: 'data-robot-kinematics-retiming-paper-viz="dh"'
  whitney: 'data-robot-kinematics-retiming-paper-viz="whitney"'
  shin_mckay: 'data-robot-kinematics-retiming-paper-viz="shin-mckay"'
```

- D-H: contracted symbol의 geometry gap, axis/common-normal construction,
  1955·1964·later convention fork, open endpoint와 loop closure,
  near-parallel evidence ceiling.
- Whitney: hand command frame, unit-joint columns, kinematic resolve와 motor
  map, current-target pose correction loop, exact·reduced·redundant와 later
  DLS 경계.
- Shin-McKay: chain-rule 2D reduction, signed torque interval과 `M=0`,
  disconnected admissible speed islands, ACOTNI와 general ACOT graph,
  nominal optimum과 deployment reference 경계.

모든 장면은 실제 SVG·CSS domain diagram을 사용한다. 수식은 한국어
underbrace와 FormulaNote를 함께 두며, 1024px 미만에서는 별도의
`formulaCompact`를 사용한다. 이는 같은 식을 작게 축소한 것이 아니라
원인과 중간 산출물 순서로 다시 쓴 다단식이다.

### QA가 찾은 실패와 수정

첫 시각 검사에서는 9개 route-viewport check, 45개 state check 중
18개 failure label이 있었다.

```yaml
robot_kinematics_retiming_first_failures:
  dh:
    tablet_scene_formula_px: 98.86
    mobile_scene_formula_px: 405.86
    mobile_page_formula_px: [2.14, 44.45]
  whitney:
    tablet_canvas_px: 11
    mobile_scene_formula_px: [17, 39.11, 52.48, 253.70, 71.44]
    mobile_page_formula_px: [27.88, 40.31, 117.25, 110.53, 181.17, 71.44]
  shin_mckay:
    tablet_scene_formula_px: 4.53
    mobile_scene_formula_px: [25.50, 77.16, 36.66, 90.02, 60.36]
    mobile_page_formula_px: [61.84, 60.36]
```

수식을 더 작게 만들거나 내부 가로 스크롤을 넣지 않았다.

- D-H convention 식은 original matrix, 1964 restatement, later modified
  branch를 서로 다른 행으로 분해했다.
- Whitney는 hand command, Jacobian column, joint-to-motor map, pose
  correction, weighted inverse와 DLS를 각각 좁은 화면용 계산 단계로
  재작성했다.
- Shin-McKay는 chain rule, torque sign branch, admissible interval union,
  graph backtracking, model-vs-actual torque를 독립 행으로 나눴다.
- Whitney 태블릿 pose loop는 이른 2-column breakpoint 때문에 각 단계가
  한 글자 폭으로 찌그러졌다. 1024px 전에는 pose와 flow를 위아래로
  쌓도록 바꿨다.
- ACOT chart의 오른쪽 경계 label은 실제 screenshot에서 잘림을 찾아
  가운데 정렬한 한국어 label로 교체했다.
- 초기 `text-clipped` 검사는 KaTeX·SVG가 직계 parent보다 넓으면 실제
  clipping 여부와 관계없이 실패했다. nearest overflow ancestor와
  비교하도록 검사기를 고친 뒤 screenshot과 대조했다.

대표 mobile·tablet screenshot은 D-H 2·3·5, Whitney 2·4·5,
Shin-McKay 1·4·5단계를 직접 열어 확인했다.

```yaml
robot_kinematics_retiming_visual_after:
  local_report: ".codex-tmp/robot-kinematics-retiming-paper-viz-local-final.json"
  viewport_route_checks: 9
  step_state_checks: 45
  failures: 0
  document_horizontal_overflow_px: 0
  max_formula_overflow_px: 0
  internal_scroll: 0
  clipped_text: 0
  minimum_scene_formula_scale:
    dh: 0.83
    whitney: 0.99
    shin_mckay: 0.91
  minimum_full_page_formula_scale:
    dh: 0.95
    whitney: 0.93
    shin_mckay: 0.80
  narrative_report: ".codex-tmp/robot-kinematics-retiming-paper-narrative-local.json"
  narrative_checks: 9
  errors: 0
  warnings: 0
```

### Mastery와 production 영수증

```yaml
robot_kinematics_retiming_mastery:
  paper_denavit_hartenberg_1955: "84 -> 100"
  paper_whitney_coordinated_control_1972: "84 -> 100"
  paper_shin_mckay_time_optimal_1985: "84 -> 100"
  changed_unrelated_articles: 0
  score_bucket_after:
    75_to_89: 34
    90_or_more: 270
  report: ".codex-tmp/ai-mastery-after-robot-kinematics-retiming-2026-07-31.json"
  focused_eslint: "pass"
  typescript: "pass"
  git_diff_check: "pass"
  full_typescript_vite_build: "pass"
```

```yaml
robot_kinematics_retiming_release:
  deployed_at: "2026-07-31 15:31:40 KST"
  service: "cm-blog.service"
  status: "active"
  main_pid: 801625
  index_sha256: "ef27e7c1577373251a34517025d09817cda9af880f8d804e74a28dabb2912308"
  production_hash_matches_local: true
  paper_viz_chunk: "/lab/assets/RobotKinematicsRetimingPaperViz-DXJQH4Tn.js"
  paper_viz_chunk_bytes: 78365
  route_chunks:
    dh: "/lab/assets/paper-denavit-hartenberg-1955-DsDIeugn.js"
    whitney: "/lab/assets/paper-whitney-coordinated-control-1972-BXxUXyD6.js"
    shin_mckay: "/lab/assets/paper-shin-mckay-time-optimal-1985-CbUgSccl.js"
  route_http_200: 3
  paper_viz_chunk_http_200: true
  production_viz:
    report: ".codex-tmp/robot-kinematics-retiming-paper-viz-production.json"
    viewport_route_checks: 9
    step_state_checks: 45
    failures: 0
```

### 4B · 9B 재현 packet

4B extractor는 수식을 요약하지 않고 owner와 convention을 구조화한다.

```yaml
robot_kinematics_retiming_extract:
  paper: dh_1955|whitney_1972|shin_mckay_1985
  reader_question: ""
  input_space: ""
  output_space: ""
  coordinate_owner: ""
  frame_assignment: ""
  handedness: ""
  matrix_layout: ""
  variable_owner: {}
  operation_order: []
  equality_or_inequality: ""
  sign_branches: []
  rank_or_regular_conditions: []
  failure_boundaries: []
  original_claim: []
  later_restatement: []
  modern_extension: []
  evidence_scope: []
  deployment_requirements_not_tested: []
  source_refs: []
```

9B reviewer는 아래 판정을 닫는다.

```yaml
robot_kinematics_retiming_review:
  dh_1955_is_modern_modified_dh: false
  dh_1955_main_output_is_open_chain_fk: false
  same_row_crosses_dh_conventions: false
  small_pose_residual_implies_stable_parameters: false
  whitney_command_order_verified: true
  jacobian_columns_share_command_frame: true
  motor_map_is_part_of_jacobian_inverse: false
  whitney_1972_contains_dls: false
  weighted_inverse_requires_full_row_rank: true
  shin_original_dynamics_has_viscous_term: true
  negative_M_keeps_inequality_direction: false
  zero_M_is_divided_by_epsilon: false
  admissible_speed_is_always_one_interval: false
  acotni_equals_general_acot: false
  nominal_optimum_certifies_physical_tracking: false
  missing_primary_evidence: []
  unsupported_claims: []
  do_not_change_yet: []
```

작은 모델의 최소 규칙은 다음과 같다.

- 역사적 matrix layout, handedness, factor order, frame/index owner가
  다르면 같은 D-H row를 재사용하지 않는다.
- endpoint pose equation과 closed-loop identity constraint를 같은
  산출물로 부르지 않는다.
- Jacobian column과 task command는 반드시 같은 frame으로 표현한다.
- kinematic inverse와 gear·linkage motor map의 failure owner를 합치지
  않는다.
- square exact, reduced square, weighted redundant, damped solve를 rank
  조건 없이 하나의 inverse로 합치지 않는다.
- signed coefficient로 inequality를 나눌 때 양·음·0을 모두 판정한다.
- `M=0`을 numerical epsilon division으로 숨기지 않는다.
- feasible set을 단일 ceiling으로 가정하기 전에 disconnected interval을
  검사한다.
- ACOTNI의 boundary zero search와 general ACOT graph·backtracking을
  같은 두-arc routine으로 축약하지 않는다.
- nominal theorem, paper evidence, physical deployment certificate를
  서로 다른 층으로 기록한다.

Orchestrator만 primary-source ceiling, historical/later/modern 세 층,
hard transfer tests, reader bridge, Korean operation underbrace,
route-owned 15-state Viz, narrow formula variant, visual QA, mastery diff,
production hash·chunk receipt를 닫는다.

Claude 독립 검증은 아직 수행하지 않았다. Context Manager queue는 287건이며
`cm-blog-claude-ai-learning-closure-retry.timer`가
`2026-08-01 18:00:00 Asia/Seoul`에 재개한다. 그 전에는 Claude 검증을
완료로 기록하지 않는다.

## 24. State estimation·constrained control / C-space·sampling planning closure (2026-07-31)

### 왜 이 네 글을 한 배치로 묶었는가

직전 D-H → Whitney → Shin-McKay 배치는 자세 표현, differential
kinematics, 정해진 path의 time scaling까지 닫았다. 그 다음 최소 기반은
두 갈래다.

```text
센서·모델 아래 state를 무엇으로 보고
어떤 조건에서 feedback guarantee를 말할 것인가
Kalman 1960 optimal control → Mayne et al. 2000 MPC

충돌하는 extended body를 무엇으로 search하고
고차원 free-space connectivity를 어떻게 유한하게 관찰할 것인가
Lozano-Perez 1983 C-space → Kavraki et al. 1996 PRM
```

이 선택은 오래된 논문을 연대순으로 더 수집하려는 것이 아니다. Modern
robotics, world model, planning agent, constrained learned controller를 읽을
때 반복해서 등장하지만 서로 섞이면 안 되는 네 owner를 최소 논문에서
끊기 위한 것이다.

1. exact full state가 주어진 deterministic optimal regulator
2. finite-horizon optimizer를 closed-loop controller로 만드는 충분조건
3. workspace collision을 configuration point membership으로 바꾸는 표현
4. explicit free space 전체 대신 samples와 local paths로 connectivity를
   관찰하는 planner

### 원문 감사와 교정

```yaml
state_planning_primary_sources:
  kalman_optimal_control_1960:
    pdf: "https://www.boletin.math.org.mx/pdf/2/5/BSMM%282%29.5.102-119.pdf"
    exact_sections:
      - "§§2-3: output history -> state approximation Problem A / exact state -> control Problem B"
      - "Proposition 5.2, Corollary 5.5: controllability Gramian와 constant rank"
      - "Definition 5.23: observability와 time-reversed dual"
      - "Assumption A1, Theorem 6.4: Hx running cost, terminal boundary와 backward Riccati"
      - "Theorems 6.7, 6.10: infinite-horizon limit와 stability 조건을 분리"
    corrected:
      - "1960 optimal-control paper를 같은 해 filtering paper와 분리"
      - "Kalman control gain K와 estimator gain L의 data owner를 분리"
      - "finite optimum, Riccati limit existence, stability를 한 결론으로 합치지 않음"
      - "modern LQR/ARE, stabilizability/detectability, LQG를 후대 층으로 표시"
  mayne_mpc_2000:
    doi: "https://doi.org/10.1016/S0005-1098(99)00214-9"
    primary_claim:
      - "nominal constrained state-feedback MPC의 stability·optimality literature survey"
      - "A1-A3가 shifted candidate admissibility를 만들고 A4가 tail cost decrease를 닫음"
      - "positive stage cost 또는 detectability와 continuity가 stability 결론에 추가로 필요"
    corrected:
      - "finite-horizon solve 반복만으로 recursive feasibility·stability가 나오지 않음"
      - "terminal equality와 terminal set+cost+local controller를 서로 다른 sufficient construction으로 분리"
      - "linear convex QP와 nonlinear nonconvex NLP의 solver evidence를 분리"
      - "RTI-SQP, explicit MPC, tube/chance constraints, codegen은 후대 관행"
  lozano_perez_cspace_1983:
    pdf: "https://lis.csail.mit.edu/pubs/tlp/spatial-planning.pdf"
    primary_claim:
      - "all degrees of freedom을 configuration point로 묶음"
      - "collision truth를 C-obstacle membership으로 보존"
      - "Findspace와 Findpath를 point·continuous curve search로 분리"
    corrected:
      - "fixed-orientation translation의 Minkowski sum을 general rotation 식으로 확장하지 않음"
      - "C-space metric을 workspace clearance·dynamics·timing과 동일시하지 않음"
      - "explicit polygon construction과 modern implicit validity callback을 evidence 층으로 분리"
  kavraki_prm_1996:
    pdf: "https://www.kavrakilab.org/publications/kavraki-svestka1996probabilistic-roadmaps-for.pdf"
    later_analysis: "https://www.kavrakilab.org/publications/kavraki-kolountzakis1998analysis-of-probabilistic.html"
    primary_claim:
      - "collision-free milestones와 validated local paths의 reusable roadmap"
      - "offline learning / online start·goal connector와 graph query 분리"
      - "static holonomic articulated-robot experiments"
    corrected:
      - "stored edge -> local path valid는 implication이며 biconditional이 아님"
      - "1996 experiments와 1998 formal failure-probability analysis를 분리"
      - "probabilistic completeness를 finite deadline certainty·path optimality로 확장하지 않음"
      - "LazyPRM과 PRM*는 후대 층"
```

각 글은 정확히 네 개 reader bridge를 먼저 둔다. 전문 용어를 낮은 수준의
정의로 나열하는 대신, 뒤 수식을 읽을 때 필요한 구분을 먼저 잡는다.

- Kalman: state, control/output channel, structural test, cost-to-go.
- MPC: finite-horizon problem, feasible domain, terminal ingredients,
  receding feedback.
- C-space: configuration, collision preimage, free-space path,
  representation boundary.
- PRM: milestone sample, local planner, learning/query split,
  probabilistic completeness.

### Hard transfer tests

본문 깊이는 아래 반례·전이 문제를 본문만으로 추적할 수 있는지를 기준으로
결정했다. 문제를 독자에게 그대로 던지는 것이 아니라 누락된 전제, operation
order, evidence ceiling을 찾는 저작 감사로 사용했다.

1. Unstable eigenvector에 `G`가 닿지 않는 2-state plant에서 `Q,R`을 크게
   바꿔도 왜 그 mode가 stabilizable해지지 않는가?
2. Nonsingular state-coordinate change 전후 Gramian entry는 달라도
   controllability verdict가 같아야 하는 이유는 무엇인가?
3. `H`가 한 state direction을 숨길 때 exact `x` feedback와 output
   history만 받은 physical controller 사이에 어떤 단계가 비는가?
4. Terminal boundary `P(t_1)=A`를 initial value로 오해해 forward
   integration하면 왜 다른 문제를 푸는가?
5. Control Riccati와 filter covariance Riccati가 같은 matrix shape라도
   왜 공유할 수 없는가?
6. LQ law 뒤에 saturation이나 one-sample delay를 붙이면 optimality와
   stability claim 중 무엇을 다시 검사해야 하는가?
7. Feasible MPC plan의 첫 input을 실행한 뒤 다음 solve의 feasible
   witness를 정확히 어떻게 구성하는가?
8. A2와 A3가 shifted candidate의 input constraint와 terminal-state
   constraint를 각각 어떻게 닫는가?
9. A4와 next-solve optimality가 value decrease를 만드는 순서는 무엇인가?
10. Stable MPC가 원래 infinite-horizon cost의 exact optimizer라는 결론은
    언제만 가능한가?
11. Reference point를 바꾸면 C-obstacle 좌표는 변하지만 collision truth가
    변하면 안 되는 이유는 무엇인가?
12. Safe start와 safe goal만 검사하면 왜 safe path를 보장하지 못하는가?
13. Revolute angle의 `0`과 `2π`를 Euclidean endpoints로 멀게 두면
    connectivity와 neighbor selection이 어떻게 깨지는가?
14. Geometric free path가 actuator bound·velocity·torque를 만족하는 timed
    trajectory가 아닌 이유는 무엇인가?
15. `d(q_i,q_j) <= r`인 두 free sample이 PRM edge가 되기 위해 무엇을 더
    검사해야 하는가?
16. Sampler가 narrow-passage neighborhood에 zero mass를 주면 sample 수를
    늘려도 왜 completeness intuition이 닫히지 않는가?
17. Roadmap 내부 path가 있어도 start 또는 goal connector가 없으면 왜
    query가 실패하는가?
18. Scene이나 attached body가 바뀐 뒤 stored edge를 그대로 재사용하면
    어떤 evidence가 stale해지는가?

### 20-state Viz와 responsive 수식

`RobotPlanningControlPaperViz.tsx`는 각 논문에 다섯 개의 domain scene을
제공한다.

```yaml
robot_planning_control_markers:
  kalman: 'data-robot-planning-control-paper-viz="kalman"'
  mpc: 'data-robot-planning-control-paper-viz="mpc"'
  cspace: 'data-robot-planning-control-paper-viz="cspace"'
  prm: 'data-robot-planning-control-paper-viz="prm"'
```

- Kalman: reachable state directions, quadratic cost contours, backward
  Riccati timeline, state-feedback loop, control/filter/LQG provenance.
- MPC: constrained horizon, shift-and-append witness, invariant terminal
  tail, optimal·feasible·infeasible·timeout runtime contract, theorem scope.
- C-space: extended body to one point, reflected-body Minkowski construction,
  endpoint-vs-curve validity, orientation slices·topology, explicit-to-implicit
  validity contract.
- PRM: sampled roadmap, neighbor-vs-edge validity, narrow-region expansion,
  start·roadmap·goal query, asymptotic-vs-finite evidence ledger.

각 장면은 실제 state plane, cost contour, time horizon, set geometry,
roadmap graph를 그린다. 색만 바꾼 table이나 generic node diagram은 쓰지
않았다. 모든 핵심 식은 한국어 operation underbrace와 FormulaNote symbol
ledger를 함께 가진다.

`PaperMechanismScene.formulaCompact`와
`PaperStudySpec.equations[].latexCompact`는 좁은 화면에서 같은 긴 식을
더 작게 만드는 장치가 아니다. Intermediate map, set membership, implication,
significant branch를 독립 행으로 다시 써서 12px readability를 유지한다.

### QA가 찾은 실패와 수정

첫 full visual pass는 12 route-viewport checks, 60 state checks에서 11개
failure label을 찾았다.

```yaml
state_planning_first_visual_failures:
  kalman_mobile:
    scene: ["Wc scene formula +28.45px", "Riccati timeline text overlap"]
    page:
      - "controllability Gramian +162.94px"
      - "observability Gramian +139.22px"
      - "quadratic cost +73.94px"
      - "feedback +83.88px"
      - "infinite horizon +69.84px"
      - "stability conditions +133.69px"
  mpc_mobile:
    scene:
      - "shifted candidate +10.09px"
      - "runtime cases +110.33px"
    page: ["A4 +18.03px"]
  cspace_mobile:
    scene: ["Minkowski construction +56.81px"]
  prm_mobile:
    scene:
      - "neighbor versus edge +33.14px"
      - "narrow passage probability +13.53px"
      - "asymptotic boundary +9.66px"
    page: ["later completeness conditions +160.41px"]
```

수정은 다음 순서로 했다.

1. Kalman Gramian은 `B_c=Phi G`, `B_o=H Phi` intermediate map을 먼저 만들고
   적분을 별도 행으로 분해했다.
2. Riccati 도식은 고정 높이에 위·아래 문장을 absolute positioning하던
   구조를 없애고 label, timeline, explanatory line을 독립 flow로 놓았다.
3. MPC shifted tail과 runtime cases는 긴 tuple/cases를 premise와 action
   행으로 분해했다.
4. C-space reflection, forbidden set, application scope를 독립 행으로
   분리했다.
5. PRM은 neighbor candidate, stored-edge implication, full local-path
   validity를 별도 행으로 두었다. Narrow-passage probability와 asymptotic
   limit도 premise와 conclusion을 분리했다.
6. `FoundationalPaperStudy`에 optional `latexCompact` rendering을 추가해
   본문과 scene이 같은 responsive 원칙을 사용하게 했다.
7. QA runner에 `QA_VIEWPORTS`를 추가해 mobile-only 20-state correction
   pass 뒤 full 60-state regression을 실행했다.

```yaml
state_planning_visual_progress:
  pass_1_full:
    report: ".codex-tmp/robot-planning-control-paper-viz-local.json"
    checks: 12
    state_checks: 60
    failure_labels: 11
  pass_2_mobile:
    report: ".codex-tmp/robot-planning-control-paper-viz-mobile-pass2.json"
    checks: 4
    state_checks: 20
    failure_labels: 3
  pass_3_mobile:
    report: ".codex-tmp/robot-planning-control-paper-viz-mobile-pass3.json"
    checks: 4
    state_checks: 20
    failures: 0
  final_local:
    report: ".codex-tmp/robot-planning-control-paper-viz-local-final.json"
    checks: 12
    state_checks: 60
    failures: 0
    document_horizontal_overflow_px: 0
    max_formula_overflow_px: 0
    min_formula_scale: 0.82
    internal_scroll: 0
    clipped_text: 0
  narrative:
    report: ".codex-tmp/robot-planning-control-paper-narrative-local.json"
    checks: 12
    errors: 0
    warnings: 0
```

### Mastery와 production 영수증

```yaml
state_planning_mastery:
  paper_kalman_optimal_control_1960: "84 -> 100"
  paper_mayne_mpc_2000: "84 -> 100"
  paper_lozano_perez_cspace_1983: "84 -> 100"
  paper_kavraki_prm_1996: "84 -> 100"
  changed_unrelated_articles: 0
  score_bucket_before:
    75_to_89: 34
    90_or_more: 270
  score_bucket_after:
    75_to_89: 30
    90_or_more: 274
  report: ".codex-tmp/ai-mastery-after-state-estimation-planning-2026-07-31.json"
  focused_eslint: "pass"
  katex_actual_render:
    kalman_full: 8
    kalman_compact: 3
    failures: 0
  typescript: "pass"
  full_typescript_vite_build: "pass"
```

```yaml
state_planning_release:
  deployed_at: "2026-07-31 16:03:39 KST"
  service: "cm-blog.service"
  status: "active"
  main_pid: 837276
  index_sha256: "3b2412aa3a1e73b61db14490f8879ab920faf36d0937e2444a101ae4512799b2"
  paper_viz_chunk: "/lab/assets/RobotPlanningControlPaperViz-CTRw7Ln3.js"
  paper_viz_chunk_bytes: 72542
  route_http_200: 4
  paper_viz_chunk_http_200: true
  production_viz:
    report: ".codex-tmp/robot-planning-control-paper-viz-production.json"
    checks: 12
    state_checks: 60
    failures: 0
    max_formula_overflow_px: 0
    document_horizontal_overflow_px: 0
    min_formula_scale: 0.82
  production_narrative:
    report: ".codex-tmp/robot-planning-control-paper-narrative-production.json"
    checks: 12
    errors: 0
    warnings: 0
```

### 4B · 9B 재현 packet

4B extractor는 논문 문장을 바로 쓰지 않는다. 아래 contract를 채워
historical claim, operation order, conditions, evidence를 분리한다.

```yaml
state_planning_extract:
  paper: kalman_1960|mayne_mpc_2000|lozano_perez_1983|kavraki_prm_1996
  reader_question: ""
  exact_input: ""
  exact_output: ""
  state_or_configuration_owner: ""
  model_contract: []
  cost_or_feasibility_contract: []
  operation_order: []
  intermediate_maps: []
  set_membership: []
  implication_direction: []
  terminal_or_boundary_conditions: []
  topology_conditions: []
  sampling_support_conditions: []
  local_validation_conditions: []
  theorem_premises: []
  theorem_conclusions: []
  original_evidence: []
  later_analysis: []
  modern_extensions: []
  deployment_requirements_not_tested: []
  source_refs: []
```

9B reviewer는 다음 판정을 닫는다.

```yaml
state_planning_review:
  kalman_control_paper_contains_filter_update: false
  observability_automatically_builds_estimator: false
  finite_lq_optimum_automatically_stable: false
  riccati_terminal_boundary_direction_verified: true
  control_P_equals_filter_covariance_P: false
  mpc_repeated_optimization_alone_implies_stability: false
  shifted_candidate_written_explicitly: true
  A2_A3_A4_roles_separated: true
  stable_mpc_always_original_infinite_horizon_optimum: false
  cspace_preserves_collision_truth: true
  cspace_preserves_workspace_metric_and_dynamics: false
  endpoints_free_implies_path_free: false
  fixed_orientation_minkowski_is_general_rotation_formula: false
  prm_nearby_pair_automatically_edge: false
  every_feasible_pair_must_be_stored: false
  original_1996_experiments_equal_1998_completeness_analysis: false
  probabilistic_completeness_implies_deadline_success: false
  basic_prm_implies_path_optimality: false
  roadmap_survives_scene_revision_without_revalidation: false
  missing_primary_evidence: []
  unsupported_claims: []
  do_not_change_yet: []
```

작은 모델의 최소 규칙은 다음과 같다.

- “state”가 exact, estimated, predicted 중 무엇인지 먼저 고정한다.
- Control channel `G`와 information channel `H`를 합치지 않는다.
- Optimality, limit existence, stability, robustness, deployment를 서로
  다른 conclusion으로 기록한다.
- Boundary-value problem은 terminal/initial 방향을 반드시 기록한다.
- MPC는 current solution뿐 아니라 successor feasible witness를 쓴다.
- Terminal set, local control, terminal cost의 각 역할을 분리한다.
- Configuration point가 body pose를 결정하는 map과 collision preimage를
  함께 기록한다.
- Safe endpoints를 safe curve로 바꾸지 않는다.
- Neighbor selection과 continuous edge validation을 같은 predicate로
  합치지 않는다.
- Stored edge implication을 biconditional로 바꾸지 않는다.
- Asymptotic probability statement를 finite deadline과 path quality로
  확장하지 않는다.
- Original experiment, later theorem, modern implementation을 각기 다른
  provenance field에 둔다.

Orchestrator만 primary-source section audit, reader bridge, hard transfer
tests, route-owned 20-state causal Viz, Korean operation underbrace,
responsive equivalent formula, mobile correction loop, full visual+narrative
regression, mastery diff와 production hash·chunk receipt를 닫는다.

Claude 독립 검증은 이번 배치에도 수행하지 않았다. Context Manager queue는
287건이며 `cm-blog-claude-ai-learning-closure-retry.timer`가
`2026-08-01 18:00:00 Asia/Seoul`에 실행된다. 그 전에는 Claude 검증 완료로
표시하지 않는다.

## 25. 2026-07-31 · 수학 분해와 sequence memory 최소 기반 closure

### 왜 이 네 글을 한 묶음으로 닫았는가

현재 목표에서 아래로 내려갈 때 반복해서 막히는 공통 기반을 먼저 골랐다.

```yaml
math_sequence_batch:
  articles:
    - linear-algebra-decompositions
    - optimization-geometry
    - rnn
    - lstm-timeseries
  current_targets:
    linear_algebra:
      - LoRA low-rank update
      - spectral normalization
      - least-squares inverse problem
      - robot Jacobian singularity
    optimization:
      - neural training
      - MPC
      - trajectory optimization
      - constrained deployment decisions
    sequence_memory:
      - autoregressive language modeling
      - long-context credit assignment
      - time-series forecasting
      - Transformer 이전 memory bottleneck
  stop_rule:
    math: "basis, rank, projection, curvature와 feasible set을 계산할 수 있으면 더 과거로 내려가지 않는다."
    sequence: "RNN의 ordered Jacobian product와 LSTM cell path를 비교할 수 있으면 최소 역사선을 닫는다."
```

이 stop rule 때문에 선형대수사를 고대 기하까지, recurrent model을 초기
cybernetics까지 무한정 확장하지 않았다. 현재 식에서 막힐 때만
`linear-algebra-tensors`, `calculus-computational-graphs`와 확률 기반으로
한 단계 내려가도록 handoff를 남겼다.

### 병렬 감사와 작성 범위

Claude가 아니라 Codex parallel reviewer 세 명이 bounded article packet을
각각 맡았다.

```yaml
parallel_reviews:
  audit_cpo:
    scope: "linear-algebra-decompositions"
    result:
      - "rank-deficient 4x3 matrix에서 span, rank, null과 projection을 같은 숫자로 연결"
      - "모든 least-squares minimizer와 minimum-norm pseudoinverse 분리"
      - "Penrose 네 조건, QR/SVD solve, normal-equation condition squaring 추가"
      - "non-normal transient amplification과 low-rank task boundary 추가"
  audit_lyapunov:
    scope: "optimization-geometry"
    result:
      - "variable, objective, constraint와 feasible set을 문제 정의부터 분리"
      - "Hessian spectral stability, condition number와 Newton premise 추가"
      - "KKT, weak/strong duality, Slater와 residual certificate 분리"
      - "MPC, shooting, transcription, ML을 theorem/solver/deployment evidence로 분리"
  audit_recovery_rl:
    scope: "rnn -> lstm-timeseries"
    result:
      - "teacher forcing과 free-running serving 차이 추가"
      - "ordered BPTT product, reset/carry/detach state ownership 추가"
      - "window/target causality, fold-local transform와 rolling-origin validation 추가"
      - "1994 gradient problem, 1997 LSTM, 2000 forget gate provenance 분리"
```

작성 spec도 같은 배치에서 갱신했다.

```yaml
content_specs:
  linear_algebra: "src/pages/articles/ai/content-specs/linear-algebra-decompositions.md"
  optimization: "src/pages/articles/ai/content-specs/optimization-geometry.md"
  rnn: "src/pages/articles/ai/content-specs/rnn.md"
  lstm_timeseries: "src/pages/articles/ai/content-specs/lstm-timeseries.md"
```

### 출처를 고른 의도

출처는 한 목록으로 섞지 않고 theorem, numerical method, historical model,
modern use를 나눴다.

```yaml
source_intent:
  linear_algebra:
    foundation: "MIT 18.06"
    generalized_inverse: "Penrose 1955"
    numerical_svd: "Golub & Kahan 1965"
    rank_approximation: "Eckart-Young 1936; Mirsky 1960"
    modern_use: "LoRA 2022; Spectral Normalization 2018"
    implementation: "torch.linalg.lstsq current documentation"
  optimization:
    convex_theorems: "Boyd & Vandenberghe"
    numerical_solver: "Nocedal & Wright"
    control: "Rawlings, Mayne & Diehl MPC"
    trajectory: "MIT Underactuated trajectory optimization"
    deep_learning: "Deep Learning chapter 8"
  sequence:
    gradient_limit: "Bengio et al. 1994; Pascanu et al. 2013"
    lstm_origin: "Hochreiter & Schmidhuber 1997"
    forget_gate: "Gers et al. 2000"
    forecasting_boundary:
      - "Hewamalage et al. 2021"
      - "PatchTST 2023"
      - "TimesNet 2023"
```

원 논문이 실제로 보인 결과와 뒤에 생긴 관행을 합치지 않았다. 특히 1997
LSTM 원형에 later forget gate를 소급하지 않고, matrix approximation error를
semantic task accuracy로 올리지 않으며, KKT residual을 deployed closed-loop
성능으로 확장하지 않았다.

### 본문만으로 풀어야 하는 hard transfer

문제를 본문 대신 쓰지 않고, 저자가 빠뜨린 전제와 논리 방향을 찾는
private curriculum oracle로 사용했다.

```yaml
hard_transfer_suite:
  linear_algebra:
    count: 6
    gates:
      - "같은 Ax를 만드는 null-shifted inputs와 minimum-norm selection"
      - "normal equation이 condition number를 제곱하는 이유"
      - "eigenvalue 0.9인데 one-step singular amplification이 가능한 non-normal map"
      - "truncated SVD error와 downstream rare direction loss 분리"
      - "numerical rank cutoff가 inverse claim을 바꾸는 지점"
      - "LoRA rank와 spectral normalization의 서로 다른 보장"
  optimization:
    transfer_blocks: 3
    gates:
      - "diag(1,20)의 stable step, zig-zag와 Newton one-step premise"
      - "active/inactive constraint, finite penalty와 KKT qualification"
      - "MPC/trajectory/ML의 theorem, transcription, solver, deployment evidence"
  rnn:
    count: 5
    gates:
      - "teacher-forced NLL과 free-running rollout failure"
      - "ordered Jacobian product와 shared-weight gradient sum"
      - "0.8^40과 1.1^40, clipping이 막는 실패 방향"
      - "padding mask, state reset와 graph detach의 ownership"
  lstm_timeseries:
    count: 5
    gates:
      - "independent window와 continuous stream의 reset/carry/detach"
      - "RNN Jacobian product와 LSTM forget-gate product"
      - "split, scaler, centered feature와 future covariate leakage"
      - "teacher forcing과 recursive H-step error propagation"
      - "direct versus recursive forecast를 같은 rolling origins에서 비교"
```

### Viz를 인과 장치로 바꾼 판단

새 Viz는 색을 바꾸는 장식이 아니라 reader가 premise를 조작하고 consequence를
확인하게 했다.

```yaml
causal_viz_contract:
  linear_map_geometry:
    control: "row-space signal, null-space shift"
    visible_consequence: "x1 != x2지만 Ax1 = Ax2"
    decision: "pseudoinverse가 null component 0인 minimum-norm 해를 고름"
  rank_explorer:
    control: "retained singular rank"
    visible_consequence: "energy, Frobenius residual, factor count와 reconstruction 변화"
    boundary: "matrix energy만으로 label/safety accuracy를 주장하지 않음"
  landscape:
    control: "condition number와 learning rate"
    visible_consequence: "eigen-axis multiplier, zig-zag와 instability"
  constrained_optimum:
    control: "x+y budget"
    visible_consequence: "feasible region, active boundary, x-star와 dual price"
    visual_revision: "겹치던 arrow labels를 plot 밖 legend로 분리"
  rnn:
    controls: "recurrent weight, timestep, temperature, Jacobian, dependency span, TBPTT chunk"
    consequences: "state, token distribution, gradient multiplier와 detach boundary"
  lstm:
    controls: "forget/input gate, memory distance, window position"
    consequences: "cell contribution, gradient retention과 causal input/target ownership"
```

선형 사상의 1D output plot은 모바일에서 불필요한 세로 여백을 줄였고, KKT
plot은 `x*`, objective gradient, constraint normal과 active boundary를 먼저
읽게 한 뒤 범례에서 용어를 붙였다. Segmented control은 공용 44 px touch
height로 올렸고 TBPTT boundary marker는 셀 밖 장식을 없애 clipping을
제거했다.

### 실패를 숨기지 않은 correction loop

첫 formula pass와 state pass는 실패했다.

```yaml
math_sequence_corrections:
  optimization_formula_pass_1:
    mobile_overflow: 8
    max_px: 103
    fix: "font 축소가 아니라 convexity, Newton, KKT, duality, MPC, shooting와 slack 식을 의미 행으로 분해"
  lstm_formula_pass_1:
    mobile_overflow: 4
    fix: "window/target, reset/detach, train/serve와 rolling-origin 식을 독립 행으로 분해"
  stateful_viz_pass_1:
    checks: 144
    errors: 27
    causes:
      - "RNN 학습/생성 button 32 px"
      - "TBPTT t4 boundary marker가 cell 아래로 5 px 돌출"
    fix:
      - "shared SegmentedControl min-height 44 px"
      - "boundary marker를 cell 내부 우하단으로 이동"
  manual_visual_review:
    changes:
      - "linear-map output viewBox의 과한 모바일 세로 공간 제거"
      - "KKT inline label cluster를 외부 legend로 이동"
```

최종 결과는 다음과 같다.

```yaml
math_sequence_local_qa:
  focused_eslint: "pass"
  full_typescript: "pass"
  katex_strict:
    formulas: 43
    display_formulas: 41
    korean_underbrace: 41
    failures: 0
    report: ".codex-tmp/math-sequence-foundations-katex.json"
  stateful_visual:
    routes: 4
    labs: 11
    state_checks: 144
    screenshots: 44
    errors: 0
    report: ".codex-tmp/math-sequence-foundations-viz-qa.json"
  full_visual:
    route_viewport_checks: 12
    visual_surfaces: 60
    svg: 15
    rendered_formulas: 132
    errors: 0
    warnings: 0
    report: ".codex-tmp/math-sequence-foundations-viz-local-final.json"
  narrative:
    route_viewport_checks: 12
    errors: 0
    warnings: 0
    report: ".codex-tmp/math-sequence-foundations-narrative-local-final.json"
```

### Mastery와 production 영수증

Heuristic mastery는 콘텐츠 품질의 최종 판정이 아니므로 전후 차이와
한계를 함께 기록한다.

```yaml
math_sequence_mastery:
  linear_algebra_decompositions: "88 -> 100"
  optimization_geometry: "88 -> 100"
  rnn: "100 -> 100; state ownership와 rollout transfer가 추가됐지만 heuristic ceiling 유지"
  lstm_timeseries: "100 -> 100; causal validation과 serving gap이 추가됐지만 heuristic ceiling 유지"
  reports:
    before: ".codex-tmp/ai-mastery-before-math-sequence-foundations-2026-07-31.json"
    after: ".codex-tmp/ai-mastery-after-math-sequence-foundations-2026-07-31.json"
```

```yaml
math_sequence_release:
  deployed_at: "2026-07-31 16:43:00 KST"
  service: "cm-blog.service"
  status: "active"
  main_pid: 883340
  index_sha256: "dad555d8a5d3acea37639d51cd48c826d70a9bca750d5b6c9938603fbed8c4b5"
  route_http_200: 4
  chunks:
    linear_algebra: "linear-algebra-decompositions-xP4kiLk3.js · 37993 bytes"
    optimization: "optimization-geometry-0aqdPaSk.js · 37735 bytes"
    rnn: "rnn-D3JAzdRa.js · 21974 bytes"
    lstm: "lstm-timeseries-BROEGLDv.js · 42963 bytes"
    math_geometry: "MathGeometryLabs-Cm3Saxgp.js · 12579 bytes"
  production_stateful:
    state_checks: 144
    errors: 0
    report: ".codex-tmp/math-sequence-foundations-viz-production.json"
  production_visual:
    route_viewport_checks: 12
    visual_surfaces: 60
    formulas: 132
    errors: 0
    warnings: 0
    report: ".codex-tmp/math-sequence-foundations-viz-production-final.json"
  production_narrative:
    route_viewport_checks: 12
    errors: 0
    warnings: 0
    report: ".codex-tmp/math-sequence-foundations-narrative-production-final.json"
```

### 4B · 9B 재현 packet

작은 모델에 네 글과 전체 codebase를 한 번에 넣지 않는다. 한 article closure와
한 종류의 critic만 준다.

```yaml
small_model_author_packet:
  target_article: "one slug"
  inputs:
    - "article source closure"
    - "content spec"
    - "bounded primary source excerpts with section/page anchors"
    - "exact numerical fixture"
    - "one current-target question"
  required_ir:
    reader_question: ""
    current_target: ""
    minimum_floor: ""
    stop_rule: ""
    entities_and_shapes: []
    operation_order: []
    theorem_premises: []
    theorem_conclusions: []
    numerical_evidence: []
    deployment_evidence: []
    provenance_boundaries: []
    hard_transfer_gates: []
    viz_control_to_consequence: []
    formula_korean_annotations: []
    handoff_if_blocked: []
```

```yaml
small_model_critic_packets:
  content_critic:
    inputs:
      - "one rendered article"
      - "source claim ledger"
      - "hard transfer suite"
    reject_if:
      - "reader cannot solve transfer gate from article premises"
      - "historical paper claim is mixed with later extension"
      - "matrix/solver metric is promoted to task/deployment guarantee"
  formula_critic:
    inputs:
      - "display formulas only"
      - "adjacent FormulaNote"
    reject_if:
      - "KaTeX strict render fails"
      - "operation underbrace is absent or English-only"
      - "mobile equivalent requires horizontal scroll"
  visual_critic:
    inputs:
      - "one Viz"
      - "all declared control states"
      - "desktop/tablet/mobile screenshots"
    reject_if:
      - "control changes color but not an explanatory consequence"
      - "label, plot or formula clips"
      - "button is below 44 px"
      - "the visual cannot state its decision boundary"
```

4B는 extraction과 claim ledger, 9B는 hard-transfer contradiction과
rendered-state critique를 맡긴다. Orchestrator만 cross-article dependency,
source arbitration, full build, production deployment와 release receipt를
닫는다.

### Claude 검증 상태

Claude quota가 없으므로 이 배치를 Claude 검증 완료로 표시하지 않았다.

```yaml
claude_validation:
  available_after: "2026-08-01 18:00:00 Asia/Seoul"
  queue:
    queued: 287
    accepted: 17
    total: 304
  timer: "cm-blog-claude-ai-learning-closure-retry.timer"
  next_trigger: "Sat 2026-08-01 18:00:00 KST"
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
```

예약 이후 Claude 응답이 오면 기존 결과를 덮어쓰지 않고 source,
content-depth, hard-transfer와 visual-review verdict를 별도 evidence로
병합한다.

## 26. 2026-07-31 · ResNet에서 Janus-Pro까지 vision·multimodal 사슬 closure

### 왜 이 네 글을 한 묶음으로 골랐는가

현재 멀티모달 모델을 바로 설명하면 초보자는 `visual token`, `projector`,
`shared transformer`, `generation head`를 이름으로만 외운다. 반대로 CNN
역사 전체로 내려가면 사용자가 지적한 무한 과거 문제가 다시 생긴다. 이번
묶음은 다음 네 번의 표현 계약 변화에서 멈춘다.

```yaml
dependency_chain:
  - "ResNet: spatial hierarchy 안에서 무엇을 보존하며 깊이를 늘리는가"
  - "ViT: image를 patch sequence로 바꾸면 shape·position·readout이 어떻게 달라지는가"
  - "Multimodal fusion: visual feature를 LLM width와 memory topology에 어떻게 연결하는가"
  - "Janus-Pro: 공유 transformer 앞뒤에서 이해·생성·학습 module ownership이 어떻게 갈리는가"
stop_rule:
  lower: "convolution과 tensor shape은 기존 글로 handoff; CNN 이전 역사로 더 내려가지 않음"
  upper: "특정 제품 성능 순위가 아니라 새 VLM의 projector·token budget·runtime code를 읽는 능력에서 닫음"
```

독립 Codex 감사 세 개를 병렬로 사용했다. 이것은 Claude 검증이 아니다.

```yaml
independent_audits:
  resnet:
    reviewer: "audit_cpo"
    decisive_findings:
      - "기존 글이 ResNet v1 post-activation과 clean/pre-activation 식을 섞음"
      - "projection shortcut의 backward 직접 항은 I가 아니라 W_s"
      - "bottleneck의 목적을 실제 MAC 장부로 보여주지 않음"
  vit:
    reviewer: "audit_lyapunov"
    decisive_findings:
      - "B축·patch projection shape·QKV head reshape·readout contract 누락"
      - "N^2D만으로 attention 비용을 설명해 projection과 MLP 비용을 숨김"
      - "window attention과 hierarchy를 상호 배타적으로 만든 Viz 오류"
  multimodal_janus:
    reviewer: "audit_recovery_rl"
    decisive_findings:
      - "early fusion의 context 합산식을 모든 fusion 방식으로 일반화"
      - "target image VQ encode는 생성 학습 전용이며 text-to-image 추론에는 없음"
      - "shared transformer를 shared encoder/head/decoder로 읽을 위험"
```

### Source·의도 ledger

논문 주장과 현재 구현 주장을 한 문단에서 섞지 않았다.

```yaml
source_ledger:
  resnet_original:
    source: "Deep Residual Learning for Image Recognition, CVPR 2016"
    url: "https://openaccess.thecvf.com/content_cvpr_2016/html/He_Deep_Residual_Learning_CVPR_2016_paper.html"
    supports: "degradation problem, residual formulation, stage/projection options, basic/bottleneck architecture"
  resnet_identity_mapping:
    source: "Identity Mappings in Deep Residual Networks"
    url: "https://arxiv.org/abs/1603.05027"
    supports: "clean identity path와 pre-activation 분석"
  vit:
    source: "An Image is Worth 16x16 Words"
    url: "https://arxiv.org/abs/2010.11929"
    supports: "patch projection, class token, position embedding, data regime, interpolation"
  llava:
    source: "Visual Instruction Tuning"
    url: "https://arxiv.org/abs/2304.08485"
    supports: "vision feature를 language embedding space로 연결하는 projector 경계"
  janus:
    source: "Janus: Decoupling Visual Encoding for Unified Multimodal Understanding and Generation"
    url: "https://arxiv.org/abs/2410.13848"
    supports: "decoupled visual encoding과 shared autoregressive transformer 설계"
  janus_pro:
    source: "Janus-Pro"
    url: "https://arxiv.org/abs/2501.17811"
    supports: "후속 data/model scaling과 training-stage 주장"
  janus_runtime:
    commit: "1daa72fa409002d40931bd7b36a9280362469ead"
    files:
      - "README generation loop"
      - "janus/models/processing_vlm.py"
      - "janus/models/modeling_vlm.py"
    supports: "실제 object 이름, understanding embedding 교체, generation code loop, decode boundary"
evidence_boundary:
  - "논문 architecture 주장은 paper evidence"
  - "Python object와 호출 순서는 pinned repository evidence"
  - "FlashAttention·TorchVision v1.5 같은 후대 구현은 원 논문의 공로로 소급하지 않음"
```

### 본문과 Viz에서 바꾼 인과

```yaml
resnet:
  content:
    - "overfitting과 degradation을 train error 숫자로 먼저 분리"
    - "clean residual backward, v1 ReLU gate, projection backward를 별도 식으로 분리"
    - "Option A pad와 Option B projection의 shape·parameter·gradient 차이"
    - "basic / bottleneck / wide 3x3의 MAC를 같은 H,W,d에서 비교"
  viz:
    - "J_F slider로 identity 항과 residual Jacobian 상쇄를 직접 재현"
    - "post-add ReLU toggle로 v1 gate가 local gradient를 0으로 만드는 조건 확인"
    - "stage와 shortcut 선택이 output shape·MAC·backward 항을 함께 변경"
vit:
  content:
    - "[B,3,H,W] -> [B,N,D]와 E in R^(P^2 C x D)를 명시"
    - "나누어떨어지지 않는 해상도의 crop/pad/partial 정책을 숨기지 않음"
    - "CLS를 제외한 2D position interpolation과 CLS/mean/dense readout 분리"
    - "block compute를 4SD^2 + 2S^2D + 8SD^2로 읽고 score memory를 별도 기록"
    - "ImageNet 1.3M, ImageNet-21k 14M, JFT 303M의 원 논문 조건을 보편 법칙으로 과장하지 않음"
  viz:
    - "resolution과 readout을 독립 조작해 input/patch/encoder/output shape 변경"
    - "attention scope와 hierarchy를 독립 조작하도록 잘못된 상호 배타 관계 제거"
multimodal_fusion:
  content:
    - "[B,N_v,D_v] -> projector -> optional resampler의 shape contract"
    - "early interleave, cross-attention, fixed-query prefix의 memory 장부 분리"
    - "visual token이 text context에서 사라져도 encoder·K/V·cross-attention 비용은 남음을 명시"
  viz:
    - "같은 [B,576,1024] 입력에서 text self-attention 길이와 별도 visual K/V 길이가 실제로 변함"
janus_pro:
  content:
    - "text LM head와 generation head/vocabulary를 분리"
    - "same autoregressive format이 same head를 뜻하지 않음을 명시"
    - "gen_vision_model.encode는 target image supervision을 만드는 학습 전용 경로"
    - "생성 추론은 visual code를 예측한 뒤 마지막에 decode_code만 호출"
  viz:
    - "이해 추론 / 생성 추론 / 생성 학습 phase별 실제 module ownership 표시"
```

### 비공개 transfer gate

문제를 본문에 싣지 않고, 본문만 읽은 독자가 다음 판단을 할 수 있는지로
깊이를 검증했다.

```yaml
hard_transfer_suite:
  resnet:
    - "J_F=-1인 identity block에서 direct path가 있어도 local gradient가 상쇄되는 이유"
    - "56x56x64 -> 28x28x128 stage에서 addition 전 shortcut shape와 backward 직접 항"
    - "bottleneck과 wide 3x3의 MAC를 직접 복원"
  vit:
    - "384x384, P=16, B=2에서 patch/sequence/readout shape 계산"
    - "CLS를 보존한 채 14x14 position grid를 24x24로 보간하는 경계"
    - "S,D,h,b에서 block FLOP와 score-byte 병목을 구분"
  multimodal:
    - "N_v=576, text=128을 early/cross/64-query에 넣어 두 memory 장부를 각각 계산"
    - "cross-attention을 골라도 visual compute가 0이 되지 않는 이유"
  janus:
    - "target image가 없는 text-to-image inference에서 encode가 호출되지 않는 이유"
    - "shared transformer와 separate head/embedding/codec을 모순 없이 설명"
```

### QA가 실패한 순서와 수정

최종 0건만 기록하면 작은 모델이 같은 실수를 반복하므로 중간 실패도 남긴다.

```yaml
failed_passes:
  typescript:
    - "JSX text의 D_{\\mathrm{lm}}를 expression으로 오인; 문자열 경계를 고침"
    - "Viz 계산 변경 뒤 남은 unused variable 제거"
  katex:
    - "strict parser가 Unicode multiplication/division glyph를 거부; LaTeX operator로 교체"
  stateful_viz_first:
    findings: 57
    causes:
      - "role=tab과 일반 button을 같은 selector로 읽은 QA false positive 36건"
      - "장식 line-height 4px를 text로 간주한 false positive 21건"
  stateful_viz_second:
    findings: 12
    causes:
      - "상태 label selector 불일치"
      - "실제 code label 10.5px가 reading floor 아래"
  route_first:
    findings: 10
    cause: "공통 Citation/Edit control이 44px touch floor보다 작음"
    fix: "lucide icon과 min-height 44px 적용"
  manual_visual_after_zero:
    finding: "자동 overflow 0이었지만 확대 버튼이 fusion figcaption 첫 줄을 가림"
    fix: "data-viz-integrated-toolbar figcaption 첫 자식에 공통 3.75rem 오른쪽 여백 예약"
```

### 최종 검증·배포 영수증

```yaml
vision_multimodal_validation:
  focused_eslint: "pass"
  full_typescript: "pass"
  build: "bun run build:tsc pass; 8593 modules"
  local:
    stateful: "4 routes · 13 labs · 138 states · 0 findings"
    route_formula: "12 route-viewports · 66 rendered display formulas · 0 findings"
    katex_source: "22 display formulas · 22 Korean underbrace · 0 failures"
  production:
    http: "4/4 routes 200"
    stateful: "4 routes · 13 labs · 138 states · 0 findings"
    route_formula: "12 route-viewports · 66 formulas · 0 findings"
  reports:
    state_local: ".codex-tmp/vision-multimodal-chain-viz-qa.json"
    formula_local: ".codex-tmp/vision-multimodal-chain-route-qa.json"
    katex: ".codex-tmp/vision-multimodal-chain-katex.json"
    state_production: ".codex-tmp/vision-multimodal-chain-viz-production.json"
    formula_production: ".codex-tmp/vision-multimodal-chain-route-production.json"
  mastery:
    resnet: "88 -> 100"
    vision_transformer: "88 -> 100"
    multimodal_fusion: "88 -> 100"
    janus_runtime: "88 -> 100"
    multimodal_track: "97 -> 100"
    caveat: "heuristic coverage score이며 source truth나 독자 이해의 최종 판정이 아님"
  release:
    deployed_at: "2026-07-31 17:31:49 KST"
    service: "cm-blog.service"
    status: "active/running"
    main_pid: 959461
    index_sha256: "9f02d3376c24130edd89b527c3a8110d0d74df4f9e3f016d4b7139e7241027f8"
    chunks:
      resnet: "resnet-D2VzIP9W.js · 17183 bytes"
      vision_transformer: "vision-transformer-BSdNHfLP.js · 19649 bytes"
      multimodal_fusion: "multimodal-fusion-interleaved-context-DFfvrj8i.js · 33633 bytes"
      janus_runtime: "janus-pro-multimodal-runtime-BQycOgvR.js · 29322 bytes"
      foundation_labs: "FoundationLabs-Dqcyeptl.js · 21872 bytes"
```

### 4B·9B 재현 packet

```yaml
vision_multimodal_small_model_packet:
  author_4b:
    receives:
      - "one article source closure"
      - "one primary-source claim ledger"
      - "one numerical fixture"
      - "one predecessor contract and one successor handoff"
    emits:
      - "shape ledger"
      - "operation order"
      - "evidence type per claim: paper/code/inference"
      - "Korean operation annotations for every display formula"
      - "control -> numeric consequence table for one Viz"
  critic_9b:
    receives:
      - "rendered article"
      - "private transfer gates"
      - "all Viz state screenshots at 360/768/1440"
    rejects_if:
      - "v1 ResNet and pre-activation equation are mixed"
      - "N^2 attention score and full block compute are conflated"
      - "early-fusion context arithmetic is applied to cross-attention"
      - "Janus training encode appears in generation inference"
      - "automated overflow is zero but toolbar or sticky UI visually covers copy"
  orchestrator_only:
    - "cross-article dependency arbitration"
    - "paper vs pinned-code provenance arbitration"
    - "full TypeScript/build/deploy"
    - "production browser receipt"
```

### Claude 검증 상태

이 배치는 Claude quota 만료 구간에 작성했으므로 Claude 승인으로 표시하지 않는다.

```yaml
claude_validation:
  available_after: "2026-08-01 18:00:00 Asia/Seoul"
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer"
  next_trigger: "Sat 2026-08-01 18:00:00 KST"
  queue: "287 queued · 17 accepted · 304 total"
```

## 27. LLM Serving 제어면: release에서 attempt와 GPU topology까지

### 왜 이 네 글을 한 묶음으로 골랐는가

초기 사용자 질문은 GPU 서버를 묶는 HPC에서 시작했다. 그러나 production에서
사용자가 만나는 실패는 GPU 개수만으로 닫히지 않는다. 같은 model release가
호환되는 artifact인지, 실제로 묶을 수 있는 GPU group이 몇 개인지, gateway가
logical request 하나를 몇 번 upstream에 보냈는지, 복구 행동이 중복 실행되지
않았는지를 하나의 identity chain으로 읽어야 한다.

```yaml
dependency_chain:
  - "Ops hub: 사용자 요청·SLO와 evidence owner를 고정"
  - "Deployment: 호환되는 release와 rollback transaction"
  - "GPU fleet: advertised device에서 warm execution group까지"
  - "Gateway: logical request에서 모든 attempt·stream commit까지"
  - "Observability: 같은 identity의 bounded recovery 검증으로 handoff"
minimum_floor:
  - "Kubernetes controller·probe"
  - "device plugin 또는 DRA allocation lane"
  - "full GPU·MIG·time-slice identity"
  - "gateway auth·admission·retry·fallback"
stop_rule:
  - "RoCE QoS와 NCCL collective tuning은 GPU HPC 글로 넘김"
  - "provider별 API 사용법보다 request→attempt evidence를 복원하면 멈춤"
```

### 독립 감사가 뒤집은 초기 가정

세 병렬 감사는 Codex 감사이며 Claude 검증이 아니다.

```yaml
audit_release_ops:
  reviewer: "audit_cpo"
  rejected:
    - "manifest 항목을 적으면 호환성이 증명된다는 가정"
    - "Running·health 200·warm·Ready·canary approved를 두 단계로 줄인 설명"
    - "metric 이름만 있으면 canary promote/rollback을 정할 수 있다는 가정"
    - "시간·범위·undo만 있으면 recovery가 안전하다는 가정"
  required:
    - "model·tokenizer·adapter·quantization·runtime compatibility verifier"
    - "startup/liveness/readiness/EndpointSlice/canary의 상태별 실패 효과"
    - "N_min·window·guardband·hard gate·missing telemetry의 hold 상태"
    - "idempotency key, generation CAS와 절대 desired state"
audit_gpu_fleet:
  reviewer: "audit_lyapunov"
  rejected:
    - "compatible allocatable이라는 단일 숫자"
    - "device plugin과 DRA를 ResourceClaim 한 경로로 합친 설명"
    - "Node Ready나 Topology Manager가 NVLink·RDMA를 증명한다는 추론"
    - "drain이 device repair라는 추론"
  required:
    - "advertised → scheduler-feasible free → allocated identity → current health → warm"
    - "extended-resource lane과 DRA lane 분리"
    - "NUMA·NVLink domain·node 간 RDMA fabric 분리"
    - "cordon→drain→repair→re-advertise→warmup→uncordon"
audit_gateway:
  reviewer: "audit_recovery_rl"
  rejected:
    - "E[C]=(1-p)Cp+pCf를 post-failure fallback 일반식으로 사용"
    - "route decision에서 causal chain을 끝냄"
    - "same alias가 semantic capability를 보장"
    - "logical success 하나로 retry 효과를 보고"
  required:
    - "C(logical request)=sum(actual attempt cost)"
    - "attempt id, parent, provider id, release, error, TTFT, token, cost, commit offset"
    - "first-attempt·logical·attempt success 분리"
    - "pre-token 실패와 mid-stream 부분 출력 실패 분리"
```

가장 중요한 수정은 fallback 비용이었다. 10%를 capability 검사에서 primary
호출 없이 직접 fallback하면 `$0.0026`이 맞다. 그러나 primary 실패 뒤 fallback
했다면 실패 attempt도 장부에 남는다. Primary가 전액 과금됐다는 설명용
fixture에서는 `$0.0028`이다. 이를 일반식과 두 특수식으로 분리했다.

### Source·설계 추론 경계

```yaml
primary_sources:
  kubernetes:
    - "Deployment rolling update와 maxSurge/maxUnavailable"
    - "startup/readiness/liveness probe semantics"
    - "device plugin extended resource와 GPU request/limit 규칙"
    - "DRA DeviceClass·ResourceClaim·ResourceSlice"
    - "Topology Manager의 node-local NUMA 범위"
    - "safe node drain"
  nvidia:
    - "GPU Operator component lifecycle"
    - "MIG reconfiguration state와 workload interruption"
    - "time slicing의 memory/fault isolation 부재"
    - "GPUDirect RDMA의 별도 network/resource 요구"
  litellm:
    - "router, retry, cooldown, fallback"
    - "virtual key access·budget·rate limit"
    - "exception taxonomy와 OpenTelemetry integration"
  standards:
    - "RFC 9110 non-idempotent retry boundary"
    - "OpenTelemetry HTTP client span per wire request"
design_inference_only:
  - "fleet snapshot을 LiteLLM deployment registry에 연결하는 adapter"
  - "alias별 capability registry와 freshness TTL"
  - "mid-stream partial output 뒤 자동 restart가 duplicate를 만든다는 recovery 판단"
  - "recovery action ledger에 AWS-style idempotency를 적용"
forbidden_claims:
  - "LiteLLM이 Kubernetes device claim과 queue를 자동 이해한다"
  - "allocated DRA claim이 current GPU health와 warm endpoint를 증명한다"
  - "Node Ready 또는 NUMA alignment가 NVLink·RDMA fabric을 증명한다"
  - "calculated cost가 provider invoice와 항상 일치한다"
```

### 본문과 Viz의 새 인과 계약

```yaml
ops_evidence_lab:
  control: "release-only error / TTFT+queue / backend attempt 증가"
  changes:
    - "첫 owner"
    - "correlation key"
    - "다음 evidence query"
    - "bounded action과 종료 조건"
release_decision_lab:
  control: "pass / tokenizer mismatch / warmup timeout / TTFT regression"
  changes:
    - "첫 blocking gate"
    - "뒤 gate의 NOT ELIGIBLE 상태"
    - "promote / hold 성격 / rollback"
gpu_topology_lab:
  inventory: "2 nodes × H100 8"
  control: "independent replica / TP8 / TP16 TCP / TP16 RDMA"
  oracle: "compatible execution groups = 16 / 2 / 0 / 1"
  lesson: "GPU 합계보다 group topology와 fabric evidence가 먼저"
gateway_attempt_lab:
  control: "pre-token timeout / mid-stream failure / capability fallback / retry storm"
  changes:
    - "backend attempts 800·880·1280"
    - "attempt amplification"
    - "output commit boundary"
    - "retry·fallback·terminal decision"
```

### 비공개 hard-transfer suite

문제를 본문에 노출하지 않고, 수정된 본문만 읽은 독자가 아래 반례를 풀 수
있는지로 깊이를 검증했다.

```yaml
release:
  - "model과 tokenizer commit 문자열은 다르지만 vocab·special id·template 검증은 통과: 허용"
  - "Pod Running, health 200, golden tool call 실패: traffic-safe 아님"
  - "canary n=120 < N_min: promote가 아니라 hold"
  - "kubectl undo 뒤 gateway weight와 tokenizer가 신버전: rollback incomplete"
  - "같은 alert 세 번: absolute desired state와 idempotency key로 한 번만 효과"
gpu:
  - "물리 GPU 4, time-slice replicas 4, allocatable 16: 물리 GPU 16 아님"
  - "label 일치하지만 NoSchedule toleration 없음: Pending"
  - "Node Ready, Topology Manager none: NVLink·RDMA 미증명"
  - "MIG config pending: success·재광고·warmup 전 capacity 제외"
  - "두 node의 GPU Pod Ready: RDMA resource·network·driver·transfer test 없으면 HPC fabric 미증명"
gateway:
  - "잘못된 key·budget exhausted: upstream attempt 0"
  - "429 Retry-After: bounded retry와 누적 latency·cost"
  - "첫 token 전 실패와 세 token 뒤 단절: 서로 다른 recovery"
  - "900 first success + 80 retry recovery / 1000 logical: 90%, 98%, 89.1%"
  - "price map stale: confirmed cost가 아니라 estimated/unknown"
```

### 중간 실패와 수정

```yaml
baseline:
  route_viewports: 12
  display_formulas: 12
  findings: 0
  interpretation: "기존 글은 overflow가 없었지만 causal depth와 Viz specificity가 부족"
first_content_audit:
  blocking_errors:
    - "post-failure fallback cost undercount"
    - "compatible allocatable state conflation"
    - "release compatibility/canary decision 없음"
first_browser_pass:
  stateful: "4 routes · 4 labs · 15 states · 45 viewport-state checks · 0 findings"
  route_findings:
    - "mobile GPU capacity formula 70px overflow"
    - "mobile gateway cost formula scale 0.78"
  fix:
    - "min 식을 독립 상한 여섯 행으로 분해"
    - "direct/post-failure cost 항을 의미 단위별 행으로 분해"
second_browser_pass:
  route_viewports: 12
  rendered_formulas: 18
  findings: 0
katex:
  display_formulas: 6
  korean_underbrace: 6
  formula_notes: 6
  failures: 0
```

### 4B·9B 재현 packet

```yaml
author_4b:
  receives:
    - "article ownership: release | fleet | gateway | recovery"
    - "one immutable numeric fixture"
    - "source claim / design inference split"
    - "forbidden state conflations"
  emits:
    - "input state → owner → output evidence ledger"
    - "one numerical oracle"
    - "one failure position or first blocking gate"
    - "all display equations with Korean underbrace and FormulaNote"
    - "one next-article handoff with freshness/identity fields"
critic_9b:
  rejects_if:
    - "manifest list is called compatibility proof"
    - "Running, Ready, warm and canary-approved are merged"
    - "allocatable, policy-feasible, healthy and warm are merged"
    - "device plugin and DRA are drawn as one lane"
    - "GPU sum is used without topology group count"
    - "fallback cost omits a real primary attempt"
    - "logical success hides first-attempt and attempt success"
    - "mid-stream retry is shown as transparent green success"
    - "same alert can apply relative traffic changes repeatedly"
orchestrator:
  owns:
    - "primary-source freshness and version boundary"
    - "cross-article identity field consistency"
    - "stateful browser matrix and manual screenshots"
    - "full build, deployment and production receipt"
```

### 현재 검증 상태

```yaml
llm_serving_control_local:
  focused_eslint: "pass"
  full_typescript: "pass"
  build: "pass"
  mastery:
    llm_serving_ops: "88 -> 100"
    serving_deployment: "88 -> 100"
    k8s_gpu_fleet: "88 -> 100"
    litellm_gateway: "88 -> 100"
  stateful_viz: "4 routes · 4 labs · 15 states · 45 checks · 0 findings"
  route_formula: "12 route-viewports · 18 rendered formulas · 0 findings"
  katex_source: "6 formulas · 6 Korean underbrace · 6 FormulaNote · 0 failures"
  information_architecture: "2 viewports · 0 failures"
  reports:
    - ".codex-tmp/llm-serving-control-viz-qa.json"
    - ".codex-tmp/llm-serving-control-route-qa.json"
    - ".codex-tmp/llm-serving-control-katex.json"
    - ".codex-tmp/ai-mastery-after-llm-serving-control-2026-07-31.json"
claude_validation:
  available_after: "2026-08-01 18:00:00 Asia/Seoul"
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer"
  queue: "287 queued · 17 accepted · 304 total"
```

### 배포 영수증

```yaml
llm_serving_control_release:
  deployed_at: "2026-07-31 17:57:53 KST"
  service: "cm-blog.service"
  status: "active/running"
  main_pid: 1002745
  index_sha256:
    local: "966994b55f1aeaa88be8970e08ea109d0f0f19ae8c153c9f065c0e36fc0bca46"
    production: "966994b55f1aeaa88be8970e08ea109d0f0f19ae8c153c9f065c0e36fc0bca46"
  chunks:
    labs: "ServingControlLabs-DLijKEb8.js · 17176 bytes"
    shared_viz: "ServingControlViz-BxWOaFHf.js · 5885 bytes"
    ops: "llm-serving-ops-BxffpGS3.js · 8894 bytes"
    deployment: "serving-deployment-C5tHRGLT.js · 12609 bytes"
    fleet: "k8s-gpu-fleet-CfxRjNEz.js · 15258 bytes"
    gateway: "litellm-gateway-BUQJJOTx.js · 13965 bytes"
  production:
    http: "4/4 routes 200"
    stateful_viz: "4 routes · 4 labs · 15 states · 45 checks · 0 findings"
    route_formula: "12 route-viewports · 18 formulas · 0 findings"
    information_architecture: "2 viewports · 0 failures"
  reports:
    - ".codex-tmp/llm-serving-control-viz-production.json"
    - ".codex-tmp/llm-serving-control-route-production.json"
    - ".codex-tmp/ai-information-architecture-qa-production-llm-serving-control.json"
```

## 28. Observability에서 검증된 복구까지 닫기

### 왜 기존 글을 다시 열었는가

앞선 네 글은 release, fleet, gateway 상태를 서로 다른 장부로 분해했지만 마지막
`observability-aiops`는 다시 `TTFT`, `queue`, `Pending`, `compatible
allocatable`을 큰 이름으로 뭉쳤다. 이 상태에서는 dashboard 용어는 읽어도 아래
반례를 풀 수 없다.

- Prometheus TTFT 1.4초, response TTFT 0.2초가 동시에 참일 수 있는가?
- 평균 TPOT가 안정적이어도 ITL p99가 2초이면 decode를 제외해도 되는가?
- Node Ready인데 이미 할당된 GPU에서 XID가 나면 어느 장부가 거짓인가?
- TTFT가 회복됐지만 retry attempt와 비용이 늘었다면 복구인가?

따라서 글의 종료점을 “metric을 보고 원인 후보를 고른다”에서 “측정 계약을
고정하고, 반증으로 owner를 좁힌 뒤, 한 번만 적용되는 action을 실행하고,
사용자 SLI와 숨은 부작용까지 다시 검증한다”로 올렸다.

### 독립 Codex 감사와 반영

Claude 사용 가능 시각 전이므로 아래 평가는 Claude 결과가 아니다. 세 독립 Codex
감사자가 기존 글을 서로 다른 관점에서 읽었고 root가 공식 문서와 구현을 대조해
반영했다.

```yaml
metric_slo_audit:
  reviewer: "audit_cpo"
  required:
    - "frontend TTFT와 scheduled→first-token response timing 분리"
    - "ITL sample distribution과 request-level TPOT 평균 분리"
    - "eligible/good/bad 분모와 first-token 전 timeout 포함"
    - "histogram bucket 집계, instance p95 평균 금지"
    - "bounded release cohort와 per-request missing policy"
gpu_kubernetes_audit:
  reviewer: "audit_lyapunov"
  required:
    - "direct trace join / entity join / temporal correlation 분리"
    - "Node Ready / advertised / scheduler-feasible / allocated / health / warm 분리"
    - "Pending phase를 condition·Event·claim·startup state로 해석"
    - "disaggregated P/D의 KV handoff·NIXL·RDMA 분기"
recovery_audit:
  reviewer: "audit_recovery_rl"
  required:
    - "idempotency key, resourceVersion CAS, controller lease"
    - "absolute desired state와 typed action/undo"
    - "Ready·warm·traffic attachment 뒤 observation 시작"
    - "minimum sample, control, traffic normalization, inconclusive"
    - "first-attempt success, attempt/request, fallback, cost를 close gate에 포함"
```

### Source와 설계 추론의 경계

```yaml
primary_sources:
  vllm:
    - "frontend arrival, queued, scheduled, first/new-token event 경계"
    - "aggregate histogram과 per-request timing의 서로 다른 surface"
    - "n>1·multiple prompt·streaming final usage의 missing 경계"
  google_sre:
    - "eligible/good event 기반 SLI"
    - "error budget과 multi-window burn"
    - "low-traffic alert의 표본 문제"
  prometheus:
    - "precomputed percentile 평균 금지와 bucket aggregation"
    - "고카디널리티 identity label 금지"
  kubernetes_nvidia:
    - "Pending phase와 Pod condition/Event"
    - "device plugin unhealthy가 새 allocatable과 기존 assignment에 미치는 차이"
    - "DCGM XID/health와 Pod·DRA identity"
    - "GPUDirect RDMA 경로"
design_inference_only:
  - "incident action ledger의 CAS·lease·idempotency 조합"
  - "target/control 비교를 causal recovery 후보 gate로 사용"
  - "route, Deployment rollback, scaling을 typed action으로 분리"
forbidden_inference:
  - "같은 TTFT 이름이면 같은 시작 시계다"
  - "TPOT 평균 안정이면 ITL tail도 안정이다"
  - "Pending Pod 수가 곧 GPU 부족이다"
  - "Node Ready면 할당 GPU도 healthy다"
  - "같은 시각의 request와 XID는 같은 device에서 발생했다"
  - "action 뒤 latency가 낮아지면 action이 원인이다"
  - "alert가 사라지거나 timing이 missing이면 recovered다"
```

### 새 시각화 계약

```yaml
latency_clock_lab:
  controls:
    - "queue 1.2초"
    - "평균 TPOT는 안정적이지만 ITL tail 2초"
    - "per-request timing missing"
  outputs:
    - "frontend TTFT"
    - "scheduled response TTFT"
    - "queue duration 또는 waiting snapshot"
    - "ITL tail / missing 판정"
causal_recovery_lab:
  controls:
    - "Ready capacity 부족"
    - "gateway retry storm"
    - "decode release 회귀"
    - "할당 GPU health 상실"
  outputs:
    - "5m·1h burn"
    - "가르는 증거와 반증"
    - "첫 owner와 correlation identity"
    - "CAS·lease precondition"
    - "absolute action과 idempotency key"
    - "expected direction, undo와 다음 가설"
  state_rail:
    - "Detected"
    - "Reserved"
    - "Applied"
    - "Observing"
    - "Closed / undo verified"
```

### 비공개 hard-transfer suite

```yaml
metric_surface:
  - "Prom TTFT 1.4s, response TTFT 0.2s, queue 1.2s: 모순이 아니라 clock 차이"
  - "TPOT mean stable, ITL p99 2s: decode 가설 제거 금지"
  - "waiting gauge 100 한 번, queue-duration p95 stable: 순간 backlog로 분리"
  - "n=2 또는 final usage 없음: missing, 0/good 금지"
slo:
  - "1M eligible, first-token timeout 900, TTFT miss 200, SLO 99.9%: bad 1100, budget 1000, 110% consumed"
  - "5m burn 5, request 10: page가 아니라 low-volume hold 가능"
  - "stable/canary 동일 model alias, release cohort 없음: 비교 불가"
fleet:
  - "Node Ready, GPU XID: assigned UUID와 device health 확인"
  - "Pending+insufficient GPU / taint / image pull: 서로 다른 owner"
  - "waiting=transfer deferred, NIXL error: GPU scale보다 KV handoff/fabric 먼저"
recovery:
  - "같은 action event 두 번: mutation 한 번"
  - "stale resourceVersion 또는 lease 충돌: 변경 없이 triage"
  - "TTFT 개선, ingress 40% 감소: causal recovery가 아니라 inconclusive"
  - "TTFT 개선, attempt/fallback/cost 증가: close 금지"
  - "rollback API success, old route/device state 미복원: rollback incomplete"
```

### 4B·9B 재현 packet

```yaml
author_4b:
  receives:
    - "one user SLI and exact eligible/good/bad rule"
    - "metric surface with unit and start/end events"
    - "one immutable incident fixture"
    - "bounded metric labels and trace/entity identities"
    - "one forbidden causal inference"
  emits:
    - "symptom → counterevidence → owner → action → expected direction → undo"
    - "short/long burn with denominator and sample count"
    - "absolute desired state, idempotency key, CAS/lease precondition"
    - "missing/inconclusive/escalated paths, not only success"
critic_9b:
  rejects_if:
    - "TTFT surfaces or TPOT/ITL are merged"
    - "first-token timeout disappears from latency SLI"
    - "instance percentiles are averaged"
    - "request/device identity becomes an unbounded metric label"
    - "Pending or Node Ready is treated as a GPU diagnosis"
    - "after < before is called causal recovery without control/load normalization"
    - "logical success hides retry, fallback, stream partial output or cost"
orchestrator:
  owns:
    - "primary-source version boundary"
    - "cross-layer join strength"
    - "stateful mobile/desktop browser matrix"
    - "production build, hash and route receipt"
```

### 로컬 검증 상태

```yaml
observability_local:
  focused_eslint: "pass"
  full_typescript_build: "pass"
  mastery: "observability-aiops 88 -> 100"
  stateful_viz: "6 routes · 6 labs · 22 states · 66 viewport-state checks · 0 findings"
  route_formula: "3 route-viewports · 9 rendered formulas · 0 findings"
  katex_source: "9 formulas · 9 Korean underbrace · 9 FormulaNote · 0 failures"
  information_architecture: "2 viewports · 0 failures"
  reports:
    - ".codex-tmp/llm-serving-control-viz-qa-observability.json"
    - ".codex-tmp/llm-serving-control-observability-route-qa.json"
    - ".codex-tmp/llm-serving-control-katex.json"
    - ".codex-tmp/ai-mastery-after-observability-2026-07-31.json"
    - ".codex-tmp/ai-information-architecture-qa-observability.json"
claude_validation:
  available_after: "2026-08-01 18:00:00 Asia/Seoul"
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer"
  rule: "사용 가능 시각 전에는 Claude 검증 완료로 표시하지 않는다"
```

### 배포 영수증

```yaml
observability_release:
  deployed_at: "2026-07-31 18:15:53 KST"
  service: "cm-blog.service"
  status: "active/running"
  main_pid: 1289465
  index_sha256:
    local: "2bcaaca20bbc3982033a60f65f61d30b886fa7c0b860b3e720938c939dd8df19"
    production: "2bcaaca20bbc3982033a60f65f61d30b886fa7c0b860b3e720938c939dd8df19"
  chunks:
    labs: "ServingControlLabs-BLa4aLEM.js · 29216 bytes"
    shared_viz: "ServingControlViz-CWqf-c9Z.js · 1917 bytes"
    observability: "observability-aiops-PwuTfL8z.js · 24186 bytes"
  production:
    http: "5/5 control-plane routes 200"
    stateful_viz: "6 routes · 6 labs · 22 states · 66 checks · 0 findings"
    route_formula: "15 route-viewports · 27 rendered formulas · 0 findings"
    information_architecture: "2 viewports · 0 failures"
  reports:
    - ".codex-tmp/llm-serving-control-viz-production-observability.json"
    - ".codex-tmp/llm-serving-control-route-production-observability.json"
    - ".codex-tmp/ai-information-architecture-qa-production-observability.json"
claude_retry_receipt:
  next: "2026-08-01 18:00:00 KST"
  queue: "287 queued · 17 accepted · 304 total"
  status: "pending, not counted as validation"
```

## 29. Claw Agent Runtime을 실제 실행 계약으로 다시 닫기

### 왜 다시 작성했는가

기존 Claw 글은 crate·기능 이름은 많았지만 학습자가 아래 반례를 풀기 어려웠다.

- model request에서 tool을 숨겨도 강제 ToolUse가 들어오면 어느 gate가 막는가?
- permission denial인데 executor 호출은 0회인 ToolResult가 가능한가?
- config current file이 깨졌는데 helper는 값을 못 찾은 것으로 처리하고 full runtime은 실패할 수 있는가?
- unknown model 하나가 설치 환경에 따라 OpenAI·Anthropic·xAI로 달라질 수 있는가?
- worker의 새 Session이 부모 filesystem까지 격리하는가?
- policy action과 recovery result가 실제 merge·복구·알림 effect를 증명하는가?

따라서 Overview, Session, Tool, Config, API, CLI, Subagent, Policy,
Telemetry, Recovery 열 글을 “기능 소개”가 아니라 input → decision →
effect → observation → receipt의 소유권 경계로 다시 구성했다.

### 독립 Codex 감사

Claude 사용량이 없는 기간이므로 아래 결과는 Claude가 아니다. 세 독립 Codex
감사자가 고정 source revision
`ab44985916cb0d53d2f7a55ea90e0d7be97d4626`을 읽고 root가 원문과 다시
대조했다.

```yaml
core_audit:
  reviewer: "audit_cpo"
  corrected:
    - "실제 CLI registry → API → ToolUse → permission → executor → ToolResult spine"
    - "ToolResult는 executor return뿐 아니라 permission/hook failure도 정규화"
    - "definition, permission, executor allowlist, observation을 네 계약으로 분리"
    - "Prompt mode와 ask rule·hook Ask의 prompter 호출 차이"
    - "256 KiB rotation은 append마다가 아니라 다음 snapshot save에서 검사"
infra_audit:
  reviewer: "audit_lyapunov"
  corrected:
    - "일반 config key에는 per-key provenance가 없고 MCP만 scope를 보존"
    - "raw JSON env merge와 process environment/credential을 분리"
    - "direct loader, helper .ok()?, full runtime의 실패 정책을 분리"
    - "unknown/custom model의 environment sniff priority"
    - ".env key fallback과 process-env-only base URL의 비대칭"
    - "provider block index와 CLI single pending_tool adapter의 정보 손실"
    - "fresh init의 dontAsk → DangerFullAccess 및 non-transactional partial write"
operations_audit:
  reviewer: "audit_recovery_rl"
  corrected:
    - "fresh Session은 transcript isolation이지 process/filesystem/network sandbox가 아님"
    - "unknown agent type의 broad fail-open allowlist"
    - "terminal manifest write는 crash-durable receipt가 아님"
    - "policy·telemetry·recovery·subagent 사이 production wiring 부재"
    - "telemetry의 operation/correlation ID와 storage acknowledgement 결손"
    - "recovery counter는 scenario-keyed in-memory state이며 lane/incident/durable budget이 아님"
```

### 글별 인과 모델

```yaml
overview:
  stop_rule: "production path, Python simulator, manifest extractor, mock E2E의 증거 수준을 구분"
session:
  hard_case: "effect 성공 후 ToolResult append 전 crash"
  conclusion: "대화 복원과 external-effect reconciliation은 다른 소유권"
tool:
  gates: ["definition visible", "authorized/ask", "executor allowlist/dispatch", "observed"]
  forced_counterexample: "숨긴 이름을 강제 주입해 projection과 enforcement를 분리"
config:
  order: "5 files → validate → deep merge → typed projection → caller-specific error → per-turn rebuild"
api:
  order: "alias → provider kind → client construction → wire → common stream → CLI adapter"
  loss_boundary: "interleaved tool block index, start metadata, stop reason"
cli:
  order: "launch parser → per-turn runtime rebuild → REPL command → render → init artifacts"
subagent:
  states: ["running", "terminal proposal", "parent accepted"]
policy:
  states: ["evidence packet", "all-match action intents", "conflict/CAS gate", "effect receipt"]
telemetry:
  states: ["record attempted", "sink call", "storage confirmed or UNKNOWN"]
recovery:
  states: ["scenario gate", "simulation result", "durable action reservation", "observation", "escalation delivery/ack"]
```

### 비공개 hard-transfer suite

```yaml
tool_session:
  - "deny된 call: executor spy 0회, Session error ToolResult 1개"
  - "숨긴 tool 강제 주입: definition filter와 executor allowlist를 각각 판정"
  - "effect 성공 후 append crash: 재시도 전 operation id로 외부 상태 조회"
config_api_cli:
  - "malformed current: direct loader/helper/full runtime 결과를 따로 계산"
  - "raw env에만 key: provider credential로 사용되지 않음"
  - "competing provider env: documented sniff priority로 unknown model routing"
  - "두 tool index interleave: provider 보존과 CLI overwrite 가능성을 분리"
  - "empty stream: synthetic stop과 두 번째 non-streaming request를 구분"
  - "init 중 .gitignore 실패: 앞선 artifact가 남는 partial success"
operations:
  - "unknown agent type: broad tool fallback을 안전하다고 판정하면 실패"
  - "parent timeout 뒤 late terminal: lease/revision 없이는 accept 금지"
  - "same-name tool 두 호출: tool_call_id 없이는 start/finish pair 불가"
  - "merge와 recover 동시 match: priority만으로 실행하지 않고 conflict hold"
  - "lane A/B 동일 scenario: 한 context budget 공유, restart 뒤 reset"
  - "Escalated event만 존재: delivery와 acknowledgement 없음"
```

### 4B 작성자와 9B 비평가 packet

```yaml
author_4b:
  receives:
    - "한 source revision과 읽을 symbol 목록"
    - "한 실행 spine과 단계별 owner"
    - "현재 구현 fact / production design inference / forbidden claim"
    - "정상 1개, denial 1개, crash-window 1개 fixture"
  emits:
    - "먼저 답할 질문과 초보자 용어 4개"
    - "input → decision → effect → observation 표"
    - "state를 실제로 바꾸는 responsive lab"
    - "hard-transfer problem과 finite stop rule"
critic_9b:
  rejects_if:
    - "definition visible을 executable/authorized로 합침"
    - "ToolResult를 executor 실행 receipt로 단정"
    - "raw config env를 process env로 표현"
    - "provider parser의 index 보존을 CLI까지 확대"
    - "fresh Session을 sandbox로 표현"
    - "policy action, terminal manifest, telemetry event, recovery result를 effect proof로 표현"
    - "attempted write를 durable storage로 집계"
orchestrator:
  owns:
    - "source hash와 revision"
    - "cross-file wiring 확인"
    - "반례를 보호하는 browser contract"
    - "모바일·태블릿·데스크톱 overflow와 실제 state transition"
```

### 검증과 배포 영수증

```yaml
claw_runtime_release:
  deployed_at: "2026-07-31 18:50:31 KST"
  service: "cm-blog.service"
  status: "active/running"
  main_pid: 1429014
  index_sha256:
    local: "736570dc83a8d9901d934504ce08a3ce92ff22bda3190b5e770c080a87c62f89"
    production: "736570dc83a8d9901d934504ce08a3ce92ff22bda3190b5e770c080a87c62f89"
  mastery:
    target_articles: 10
    result: "10/10 score 100"
    report: ".codex-tmp/ai-mastery-claw-after-2026-07-31.json"
  build:
    typescript_vite: "pass"
    diff_check: "pass"
    note: "900 kB 초과 chunk warning만 존재"
  browser_contracts:
    local: "39/39 pass"
    production: "39/39 pass"
  visual_qa:
    matrix: "6 labs × mobile 390 × tablet 768 × desktop 1440 = 18"
    result: "18/18 HTTP 200 · lab present · document/lab overflow 0 · offender 0"
    reports:
      - ".codex-tmp/claw-visual-qa-2026-07-31/report.json"
      - ".codex-tmp/claw-visual-qa-2026-07-31/production-report.json"
```

### Claude 재검증 보류 기록

```yaml
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  queue: "292 queued · 12 accepted · 304 total"
  parallelism_after_resume: 6
  timer: "cm-blog-claude-ai-learning-closure-retry.timer"
  next_trigger: "2026-08-01 18:00:00 KST"
  source_hash_rule: "strict ACCEPT receipt도 source hash가 바뀌면 자동으로 pending"
  revise_rule: "REVISE receipt는 source hash가 같아도 completed로 건너뛰지 않음"
  claim_rule: "사용 가능 시각 전에는 Claude 검증 완료로 표시하지 않는다"
```

## 30. 최소 기반 source를 계산 가능한 글로 닫기

### 왜 이 여덟 글을 한 배치로 묶었나

전체 AI article mastery report에서 90점 아래에 남은 글은 다음 여덟 개였다.
공통 결손은 길이 자체가 아니라 `source fact -> 계산 -> 낯선 상황의 판정 ->
상위 구현으로 복귀`가 한 번에 닫히지 않았다는 점이었다.

```yaml
batch:
  scheduling:
    - paper-liu-layland-realtime-scheduling-1973
  drive_and_actuator:
    - reference-abb-electrical-braking-2018
    - reference-ti-tida-01599-sto-2022
    - reference-harmonic-drive-mechatronics-2026
    - paper-williamson-series-elastic-actuators-1995
  composite:
    - paper-tsai-strength-characteristics-composites-1965
    - reference-nasa-composite-fracture-control-handbook-2024
  current_video_model:
    - wan22
selection_rule:
  - "최소 기반 논문 또는 제조사/기관의 직접 reference다"
  - "상위 robot/video article에서 내려오는 learning-path handoff가 있다"
  - "독자가 식을 읽어도 새로운 입력을 판정하는 계산 bridge가 부족했다"
  - "source claim과 글의 reconstruction 또는 가상 sandbox가 섞여 있었다"
```

### 먼저 만든 비공개 hard-transfer 문제

본문을 늘리기 전에 각 source의 핵심을 외운 설명으로 통과할 수 없는 문제를
만들었다. 이 문제를 현재 글만 읽고 풀 수 없으면 본문이나 Viz가 부족하다고
판정했다.

```yaml
liu_layland:
  problem: "(5,1), (8,2), (20,7)의 U=0.8은 RM bound를 넘는다. 실제 RM 실패인가?"
  required_insight:
    - "충분조건 실패와 schedulability 실패를 구분"
    - "critical instant에서 response-time fixed point를 계산"
    - "C는 7 -> 11 -> 14 -> 14 ms로 20 ms deadline 통과"
    - "40 ms finite trace와 무한 schedulability proof를 구분"
abb:
  problem: "48 V robot이 100 J를 4 mF DC link에 돌려보낼 때 capacitor만으로 닫히는가?"
  required_insight:
    - "52 -> 60 V headroom은 1.792 J뿐"
    - "1.2 kW 회생이면 약 1.49 ms"
    - "battery sink와 common DC가 unavailable이면 chopper/resistor 검토"
    - "pulse, duty, SOA, thermal, fault evidence는 별도"
ti_sto:
  problem: "STO1이 stuck-on일 때 STO2 demand만으로 무엇이 닫히고 무엇은 남는가?"
  required_insight:
    - "1oo2와 HFT1의 기능 경계"
    - "independence와 common-cause를 별도 검사"
    - "STO는 torque-producing gate power 제거이지 zero motion이 아님"
    - "vertical axis의 brake/coast/DC-link는 별도 machine function"
harmonic_drive:
  problem: "같은 40 N·m peak라도 1 s work+9 s idle과 1 s work+1 s idle은 같은 selection인가?"
  required_insight:
    - "RMS가 약 12.6 N·m와 28.3 N·m로 달라짐"
    - "idle도 average speed의 전체 cycle denominator에 포함"
    - "wave-generator와 output-bearing life 식을 분리"
williamson:
  problem: "K=46 N·m/rad, quoted J=0.02 kg·m²이면 48 rad/s인데 왜 측정은 38.4인가?"
  required_insight:
    - "assembled plant의 effective J는 약 0.031 kg·m²"
    - "원문 replay와 arbitrary parameter sandbox를 분리"
    - "clamped transfer를 moving/soft contact로 전이하지 않음"
tsai:
  problem: "X=150, Y=4, S=6 ksi인 lamina의 28도 off-axis strength는 얼마인가?"
  required_insight:
    - "Eq.10을 직접 계산하면 Fx/X 약 0.075, Fx 약 11.30 ksi"
    - "기존 임의 proxy 0.758은 source와 약 10배 달랐음"
    - "재료축 변환과 first-ply failure 경계를 보존"
nasa_handbook:
  problem: "tool drop near bond edge와 NDE blind strip이 함께 있으면 release 가능한가?"
  required_insight:
    - "DTA -> IDMP -> RTD -> BBA -> NDE -> authority ledger"
    - "숫자 confidence를 release 권한처럼 사용하지 않음"
    - "F_G=2 energy factor를 다시 제곱하지 않음"
wan22:
  problem: "121 frames와 24 GB라는 문장을 A14B 전체 family에 옮겨도 되는가?"
  required_insight:
    - "Tz=floor((T-1)/4)+1=31"
    - "A14B expert routing과 dense TI2V-5B를 분리"
    - "checkpoint memory와 latent/attention/runtime memory를 합산"
    - "24 GB는 exact offload/dtype/T5 command 계약"
```

### 독립 Codex source audit가 찾은 오류

세 개의 read-only audit를 병렬로 수행했다. 이 결과는 Claude 검증이 아니며
현재 배치의 Claude 상태를 완료로 올리지 않는다.

```yaml
audit_cpo:
  source: "Liu & Layland official DOI + accessible PDF"
  findings:
    - "DOI와 PDF mirror의 권위 표시가 뒤집혀 있었음"
    - "RM bound 위에서 exact response 판정 bridge가 없었음"
    - "EDF 필요충분조건과 RM 충분조건이 같은 PASS label에 섞였음"
    - "finite horizon의 pending job이 숨겨졌음"
audit_lyapunov:
  sources:
    - "ABB Technical Guide No. 8 Rev C"
    - "TI TIDUDS9B + TUV TF97657T"
    - "Harmonic Drive Mechatronics 1053524 05/2026"
    - "Williamson SEA thesis"
  findings:
    - "Harmonic WG life와 output-bearing life 식이 섞였음"
    - "test-based value를 모두 average라고 과도하게 번역했음"
    - "Williamson Viz의 arbitrary inertia/score가 원문 측정처럼 보였음"
    - "TI conceptual set 식과 source 식의 provenance가 없었음"
audit_recovery_rl:
  sources:
    - "NASA CR-224"
    - "NASA-HDBK-5010 Volume 2"
    - "Wan2.2 pinned repository revision"
  findings:
    - "Tsai 28도 proxy가 source Eq.10과 약 10배 불일치"
    - "NASA VCCT margin이 energy factor를 다시 제곱"
    - "NASA Viz가 임의 confidence를 release 판정처럼 사용"
    - "Wan temporal latent를 T/4로 써 121 frames를 31로 계산하지 못함"
```

### 구현에서 사용한 source/reconstruction 경계

```yaml
equation_provenance:
  direct:
    - "Tsai Eq.10"
    - "NASA-HDBK-5010 mixed-mode example와 energy-factor margin"
    - "Harmonic Drive p.159 WG life와 p.163 output-bearing workflow"
    - "Williamson thesis equation/measurement replay"
  modern_bridge:
    - "Liu-Layland critical-time-zone를 fixed-point response-time recurrence로 표기"
  article_ir:
    - "TI HFT1 failure set와 final-claim intersection"
    - "NASA RTD threat set, BBA evidence state, lifecycle traceability set"
    - "Wan runtime memory accounting identity"
rendering_rule:
  - "모든 수식 위에 source 또는 reconstruction provenance를 표시"
  - "원문 직접식, 현대 표기, 글 수준 IR을 같은 권위로 보이지 않게 함"
  - "FormulaNote의 계산 이유와 기호를 한국어로 설명"
  - "모바일 compact 식도 데스크톱 식과 같은 의미를 유지"
```

### 내용과 Viz를 바꾼 이유

1. `FoundationalPaperStudy`를 논문 전용 문구에서 source document 공통
   renderer로 바꿨다. `Abstract`, `tensor`, `ablation`, `mirror` 고정
   표현을 document kind와 source metadata에 맞게 낮췄다.
2. `workedTransfer`는 문제를 본문에 시험처럼 넣기 위한 장치가 아니다.
   source 개념을 낯선 숫자에 옮기는 계산 순서와 판정 경계를 본문 안에서
   독자가 추적하게 하는 장치다.
3. Liu Viz는 `RM universal certificate`, `exact response`, `finite trace`,
   `EDF theorem`을 서로 다른 상태로 표시한다. 모바일 timeline은 0-20,
   20-40 ms로 나누고 horizon 끝의 open job을 표시한다.
4. Harmonic Drive는 peak 하나가 아니라 torque/speed, RMS/cycle,
   stiffness/mode, WG/output-bearing, brake/feedback의 selection flow를
   세로 검증 절차로 배치했다. 5열 강제로 생기던 단어 중간 절단과 큰 빈
   공간을 없애고 각 gate에서 계산할 이유를 한국어로 붙였다.
5. Williamson은 `1995 source replay`와 `what-if sandbox`를 별도 mode로
   만들었다. 측정 38.4 rad/s와 이론 48 rad/s를 먼저 보여 주고 임의
   parameter는 논문 evidence가 아니라고 표시한다.
6. Tsai는 임의 proxy 곡선을 버리고 Eq.10을 매 angle에서 다시 계산한다.
   그래프 caption은 축소되는 SVG text 대신 responsive DOM text로 옮겼다.
7. NASA는 임의 confidence/release score를 삭제하고 `DEFINED INPUT`,
   `PARTIAL CORRELATION`, `BLIND REGION OPEN`, `AUTHORITY REQUIRED` 같은
   증거 상태만 출력한다.
8. Wan은 family table을 선택/계산 lab으로 바꾸고 exact temporal latent,
   component residency, work memory와 peak observation을 분리한다.

### 모바일 수식 감사에서 발견하고 닫은 문제

첫 browser audit는 다음 두 종류의 오류를 냈다.

```yaml
first_pass:
  routes: 8
  viewports: [360, 768, 1440]
  checks: 24
  visual_surfaces: 48
  formulas: 150
  errors:
    formula_note_not_korean: 42
    formula_overflow: 7
fix:
  korean_notes:
    - "Liu-Layland RM/EDF 수식 설명"
    - "Tsai lamina/axis/ABD/thermal/ply recovery 설명"
    - "NASA RTD/BBA/VCCT/traceability 설명"
  compact_equations:
    - "Liu utilization bound와 EDF theorem"
    - "Williamson output impedance"
    - "Harmonic average speed와 WG life"
    - "TI pulse classification"
    - "Wan runtime memory ledger"
final:
  errors: 0
  warnings: 0
```

### 4B 작성자와 9B 비평가가 같은 작업을 재현하는 packet

작은 모델에는 “이 글을 깊게 써라”를 주지 않는다. 한 source와 한
hard-transfer 문제로 scope를 좁혀야 한다.

```yaml
orchestrator_input:
  identity:
    - "slug, 상위 목표 article, 학습 경로에서의 위치"
    - "document kind, exact revision, official URL, accessible mirror"
  source_slice:
    - "읽을 section/page/code line"
    - "직접 수식과 symbol glossary"
    - "원문이 주장하지 않은 forbidden claims"
  transfer:
    - "숫자가 있는 낯선 문제 1개"
    - "정답만으로 통과할 수 없는 boundary question 2개"
  ui:
    - "변경 가능한 state"
    - "source replay와 hypothetical sandbox 구분"
    - "360/768/1440에서 지켜야 할 size와 no-scroll 계약"
author_4b_output:
  - "초보자 bridge 4-6개"
  - "source 질문 -> mechanism -> 수식 -> 증거 -> transfer -> 상위 글 복귀"
  - "각 수식의 한국어 underbrace 또는 바로 아래 기호 설명"
  - "source fact / modern bridge / article IR provenance"
  - "상태를 실제로 바꾸는 Viz 한 개"
critic_9b_tasks:
  - "hard-transfer 문제를 글만 읽고 풀이"
  - "source direct claim과 reconstruction을 문장별 분류"
  - "필요조건/충분조건, measurement/prediction, finite trace/proof 혼동 탐지"
  - "단위, boundary, revision, denominator, off-by-one 검산"
  - "360px에서 식과 label이 12px 아래로 내려가거나 넘치면 reject"
deterministic_gates:
  - "typescript/vite build"
  - "mastery coverage"
  - "raw LaTeX와 KaTeX error"
  - "formula overflow와 한국어 FormulaNote"
  - "Viz internal scroll, clipped foreignObject, blank surface, text overlap"
  - "source receipt hash가 바뀌면 이전 ACCEPT 무효화"
```

9B 비평가는 작성 문체를 고치는 역할보다 반례를 푸는 역할을 우선한다.
아래 중 하나라도 일어나면 작성자에게 되돌린다.

```yaml
reject_if:
  - "RM bound 초과를 deadline miss로 단정"
  - "STO를 zero speed 또는 machine safety 전체로 번역"
  - "WG와 output-bearing life 식을 합침"
  - "source replay에 arbitrary parameter나 score를 넣음"
  - "Tsai angle curve를 Eq.10 없이 proxy로 그림"
  - "NASA authority decision을 confidence threshold로 자동화"
  - "T/4로 121 frames를 30.25 latent positions라 계산"
  - "24 GB claim을 A14B 전체 family로 확대"
  - "모바일에서 식을 작게 축소해 12px 미만으로 숨김"
```

### 학습 그래프와 source closure 상태

```yaml
learning_graph:
  articles: 304
  learning_paths: 125
  research_tracks: 19
  sidebar_stages: 4
  missing_subcategory: 0
  empty_leaf_subcategory: 0
  source_only_leaf_subcategory: 0
  unowned_core_article: 0
  unresolved_learning_step: 0
  unresolved_track_reference: 0
  duplicate_track_dependency: 0
  duplicate_track_subcategory_ownership: 0
source_receipts:
  all_ai_articles: 304
  closure_accept: 12
  queued_for_claude: 292
  queued_state:
    DRIFT: 46
    UNVERIFIED: 178
    PARTIAL: 49
    REVIEW_REQUIRED: 19
```

### 검증과 프로덕션 배포 영수증

```yaml
mastery:
  report: ".codex-tmp/ai-mastery-next-eight-release-2026-07-31.json"
  result: "527/527 score 100"
build:
  command: "bun run build:tsc"
  result: "pass"
  note: "900 kB 초과 chunk warning만 존재"
browser_qa_local:
  report: ".codex-tmp/ai-next-eight-viz-audit-final-2026-07-31.json"
  matrix: "8 routes × mobile 360 × tablet 768 × desktop 1440"
  result: "24 checks · 48 surfaces · 150 formulas · errors 0 · warnings 0"
browser_qa_production:
  report: ".codex-tmp/ai-next-eight-production-viz-audit-2026-07-31.json"
  matrix: "8 routes × mobile 360 × tablet 768 × desktop 1440"
  result: "24 checks · 48 surfaces · 150 formulas · errors 0 · warnings 0"
harmonic_final_production_qa:
  report: ".codex-tmp/harmonic-final-production-viz-audit-2026-07-31.json"
  matrix: "1 route × mobile 360 × tablet 768 × desktop 1440"
  result: "3 checks · 9 surfaces · 24 formulas · errors 0 · warnings 0"
  visual_review:
    - "desktop에서 selection flow와 source boundary ledger가 한 화면에서 비교된다"
    - "mobile에서 5개 gate와 4개 evidence state가 세로로 이어지고 가로 스크롤이 없다"
deployment:
  deployed_at: "2026-07-31 19:37:25 KST"
  service: "cm-blog.service"
  status: "active/running"
  main_pid: 1624301
  production_http: 200
  index_sha256:
    local: "ca4180c0a55190708898c8e77a4357bd9980faab574be9fbdff761ed014c6185"
    production: "ca4180c0a55190708898c8e77a4357bd9980faab574be9fbdff761ed014c6185"
```

### Claude 교차 검증 보류

```yaml
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  queue: "292 queued · 12 accepted · 304 total"
  by_previous_status:
    DRIFT: 46
    UNVERIFIED: 178
    PARTIAL: 49
    REVIEW_REQUIRED: 19
  parallelism_after_resume: 6
  timer: "cm-blog-claude-ai-learning-closure-retry.timer"
  timer_status: "active/waiting"
  next_trigger: "Sat 2026-08-01 18:00:00 KST"
  claim_rule: "이 시각 전에는 현재 배치를 Claude 검증 완료로 표시하지 않는다"
```

## 31. Current-first AI 경로의 claim boundary와 실행 계약 재검산

### 이번 배치의 출발 질문

현재 글이 많은지를 다시 세지 않았다. 각 current-first 입구에서 다음 질문을 답한 뒤 기반 글로 내려갈 수 있는지를 검산했다.

```yaml
generation:
  question: "Diffusion·Flow·few-step system을 이름이 아니라 state, solver, budget, evaluator로 분해할 수 있는가?"
multimodal:
  question: "input modality, internal token, output artifact와 context budget을 서로 바꾸어 말하지 않는가?"
reasoning:
  question: "rollout reward, token update, entropy, test-time search와 monitorability를 별도 축으로 측정하는가?"
agent:
  question: "model proposal, harness state, workspace effect, tool protocol과 remote-agent protocol의 소유권이 분리되는가?"
llm:
  question: "architecture, training compute, serving SLO, KV byte와 on-device transfer cost가 같은 숫자로 뭉개지지 않는가?"
```

### 독립 감사 구조

Claude 사용량이 없는 시간에는 Claude를 호출했다고 표시하지 않았다. 세 범위를 독립 Codex 감사로 나누고, 공통 실패 형식으로 합쳤다.

```yaml
audits:
  - id: "audit_lyapunov"
    scope: "generation · multimodal · open media"
  - id: "audit_recovery_rl"
    scope: "reasoning · agent · protocol"
  - id: "audit_cpo"
    scope: "LLM architecture · pre-training · serving · on-device"
shared_failure_schema:
  - "claim이 source 범위를 넘어섰는가"
  - "저자 재구성 fixture를 source 결과처럼 보이는가"
  - "식의 분모·단위·aggregation level이 맞는가"
  - "현재 protocol과 legacy protocol이 섞였는가"
  - "Viz control이 실제 state를 바꾸는가"
  - "모바일에서 읽기 크기를 줄여 overflow를 숨겼는가"
```

### 수정 판단과 이유

```yaml
generation_multimodal:
  - "Flow Viz를 marginal field의 보편 설명에서 conditional path의 교육용 재구성으로 좁혔다."
  - "Emu3 framework와 Chat/Gen artifact를 분리하고, 생성 visual code를 input ledger가 아니라 output reserve로 옮겼다."
  - "best-of-k는 숨겨진 실패가 아니라 선언해야 하는 system contract로 표시했다."
reasoning_agent:
  - "GRPO를 completion-level ratio가 아니라 token-level ratio와 completion-length 평균으로 고쳤다."
  - "entropy bonus를 canonical GRPO 정의가 아닌 별도 실험 개입으로 분리했다."
  - "MCP current 기준을 2026-07-28 요청 단위 협상·stateless core·server discovery로 갱신했다."
  - "MCP 2025 initialize session은 legacy delta로만 남기고 A2A는 1.0 binding·version·signed Agent Card·SendMessage로 갱신했다."
llm:
  - "pre-training lifetime compute에서 shared prompt와 k개 output을 분리했다."
  - "TPOT request 평균과 ITL token interval을 분리하고 p99 TTFT·TPOT·ITL을 별도 release gate로 만들었다."
  - "MHA·GQA KV 식의 적용 범위를 명시하고 MLA는 실제 compressed cache layout 합산으로 돌렸다."
  - "GPT-2/Llama block에 두 norm과 두 residual add를 복원하고, DeepSeek active ledger에 attention·shared·dense 부분을 포함했다."
  - "on-device는 discrete VRAM 표현을 피하고 unified/shared memory와 transfer trace fixture를 실제 Viz 값에 맞췄다."
mobile_formula_fix:
  - "128 KiB/token 식을 symbolic 식과 numeric 대입으로 분리했다."
  - "GRPO ratio/clip과 surrogate objective를 분리하고 objective를 실행 순서대로 세 줄로 배치했다."
  - "12px 아래로 축소하지 않고 360px overflow를 0으로 만들었다."
```

### 작은 모델 재현 규칙

4B 작성자는 문장을 늘리는 대신 아래 IR을 먼저 채운다. 9B 비평가는 이름이나 문체가 아니라 각 칸의 경계와 반례를 검산한다.

```yaml
article_ir:
  current_question: "이 글을 읽은 뒤 내릴 수 있어야 하는 결정 한 개"
  state: "입력·중간 상태·출력 artifact"
  owner: "model · runtime · protocol · network · evaluator 중 책임자"
  equation:
    numerator: "무엇을 더하거나 비교하는가"
    denominator: "어떤 단위로 정규화하는가"
    aggregation: "token · request · batch · lifetime 중 어느 수준인가"
  source_boundary:
    direct: "source가 직접 보고한 것"
    reconstruction: "교육용 fixture 또는 저자 계산"
    optional: "현재 글을 막을 때만 여는 기반"
  hard_transfer:
    task: "본문만으로 풀어야 할 가장 어려운 새 조건"
    failure_owner: "틀렸을 때 어느 layer를 고칠지"
  viz:
    changed_state: "control이 바꾸는 변수"
    invariant: "바뀌어도 지켜져야 할 조건"
    mobile_layout: "360px에서 축소 대신 분리할 의미 단위"
```

### 검증과 배포 영수증

```yaml
learning_graph:
  report: ".codex-tmp/ai-learning-graph-current-batch-2026-07-31.json"
  all_ai_articles: 304
  unresolved_learning_steps: 0
  unresolved_track_references: 0
  empty_or_source_only_leaf: 0
mastery:
  report: ".codex-tmp/ai-mastery-current-batch-2026-07-31.json"
  result: "304/304 at least 90 · weak 0"
build:
  command: "bun run build:tsc"
  result: "pass"
  note: "900 kB 초과 chunk warning만 존재"
browser_qa_local:
  viz_report: ".codex-tmp/ai-current-batch-local-viz-final-2026-07-31.json"
  narrative_report: ".codex-tmp/ai-current-batch-local-narrative-audit-2026-07-31.json"
  matrix: "11 routes × mobile 360 × tablet 768 × desktop 1440"
  result: "33 checks · 120 surfaces · 156 formulas · errors 0 · warnings 0"
browser_qa_production:
  viz_report: ".codex-tmp/ai-current-batch-production-viz-final-2026-07-31.json"
  narrative_report: ".codex-tmp/ai-current-batch-production-narrative-final-2026-07-31.json"
  matrix: "11 routes × mobile 360 × tablet 768 × desktop 1440"
  result: "33 checks · 120 surfaces · 156 formulas · errors 0 · warnings 0"
deployment:
  deployed_at: "2026-07-31 20:15:21 KST"
  service: "cm-blog.service"
  status: "active/running"
  main_pid: 1670784
  production_http: 200
  index_sha256:
    local: "bbf15bbec7610e2a38a877dda47da82e038ae4fcc0fd39cf2cd67cb6de76890d"
    production: "bbf15bbec7610e2a38a877dda47da82e038ae4fcc0fd39cf2cd67cb6de76890d"
mcp_title_followup:
  report: ".codex-tmp/mcp-current-title-production-viz-audit-2026-07-31.json"
  result: "3 viewports · errors 0 · warnings 0"
  h1: "MCP: 요청 협상에서 Tool Result까지의 실행 계약"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  queued: 292
  accepted_before_retry: 12
  timer: "cm-blog-claude-ai-learning-closure-retry.timer"
  next_trigger: "Sat 2026-08-01 18:00:00 KST"
```

## 32. 최소 기반 수학에서 Speech·Document·World Model까지의 top-down 재구성

### 사용자가 내린 운영 제약

```yaml
claude_cross_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  recorded_state: "Codex/static/browser QA complete; Claude cross-validation pending"
  rule: "Claude 결과가 실제 queue receipt로 돌아오기 전에는 검증 완료라고 쓰지 않는다"
  retry_timer: "cm-blog-claude-ai-learning-closure-retry.timer"
  timer_state: "active/waiting"
independent_codex_audits:
  - id: "audit_cpo"
    scope: "Document AI"
  - id: "audit_lyapunov"
    scope: "Speech / Audio"
  - id: "audit_recovery_rl"
    scope: "World Model"
  note: "세 감사는 Claude 검증이 아니라 병렬 Codex 비평이다."
```

### 전체 추론 순서

글 수를 먼저 늘리지 않고 다음 순서로 판단했다.

1. 독자가 현재 시스템에서 내려야 할 결정을 한 문장으로 고정했다.
2. 그 결정을 막는 최소 개념만 required path로 내렸다.
3. 논문 재구성은 required 흐름을 끊지 않는 optional source sidecar로 분리했다.
4. 원문이 직접 말한 수치와 이 글이 만든 교육용 fixture를 분리했다.
5. 본문을 읽은 뒤 처음 보는 조건에서도 실패 원인을 찾을 수 있는 내부 hard-transfer 문제를 만들었다.
6. 그 문제를 풀 근거가 본문·수식·Viz·source receipt에 모두 있는지 확인했다.
7. 미측정 상태가 자동 통과하지 않는 fail-closed release gate로 구현했다.
8. 360·768·1440px에서 글자 축소가 아니라 의미 단위 분할로 overflow를 제거했다.

### 수학·과학 기반을 나눈 이유

기존의 넓은 `ai-math-foundations` 한 줄은 독자가 왜 특정 수학을 읽는지 설명하지 못했다. 이를 질문의 종류에 따라 네 개의 최소 경로로 나눴다.

```yaml
paths:
  ai-math-shape-foundations:
    question: "벡터·행렬의 모양과 좌표 변화가 모델 표현을 어떻게 바꾸는가?"
  ai-math-change-foundations:
    question: "미분·적분·미분방정식이 변화율, 누적량과 trajectory를 어떻게 연결하는가?"
  ai-math-evidence-foundations:
    question: "확률·통계가 불확실성과 일반화 주장을 어떤 증거로 바꾸는가?"
  ai-math-signal-foundations:
    question: "sampling·convolution·frequency가 audio와 sensor 표현의 한계를 어떻게 결정하는가?"
design_decision:
  - "적분을 변화 경로에 포함하고 보존량·누적량·경로 적분으로 이어지게 했다."
  - "논문 이름을 외우기 전에 현재 문제에서 필요한 수학 질문을 선택하게 했다."
  - "모바일 수식은 12px 아래로 줄이지 않고 symbolic 식과 대입·해석을 분리했다."
```

### Speech / Audio 재구성

```yaml
top_question: "좋은 음성 sample이 아니라 끊김·개입·route change가 있는 실시간 대화를 release할 수 있는가?"
required_chain:
  - "Speech & Audio current hub"
  - "Realtime duplex ownership"
  - "Native speech generation"
  - "Recognition objective"
  - "Neural codec representation"
  - "Signal foundation"
claim_boundaries:
  - "Moshi의 zero-delay 수치는 source Table 6 기준으로 바로잡았다."
  - "완료 시각에서 endpoint 결정까지 겹치는 구간은 T_turn으로 한 번만 센다."
  - "Local PII redaction은 OpenAI 내부 구현 주장이 아니라 이 글의 transfer design으로 표시했다."
  - "Codec·router fixture 수치는 serial explanatory fixture이며 production benchmark가 아니다."
hard_transfer:
  prompt: "route 변경과 packet burst loss가 동시에 발생하고 사용자가 system 발화 중 숫자를 정정했을 때, 잘못된 tool commit과 낡은 audio 재생의 책임 owner를 각각 찾는다."
  evidence_needed: "session clock, endpoint, ufrag·ICE/DTLS/SRTP state, output epoch, partial transcript commit, loss/FEC/PLC 구간"
formula_decision:
  - "숨은 state의 marginal은 단일 density product가 아니라 q_theta에 대한 expectation으로 썼다."
  - "모바일에서는 의미 상태 추출·음성 생성·marginal 응답 분포를 세 줄로 분리했다."
  - "첫 소리 지연도 turn·queue·model·downlink·jitter·decode·conditional reconnect로 세로 분해했다."
```

### Document AI 재구성

```yaml
top_question: "OCR 점수가 아니라 원문 구조와 계산 가능한 provenance를 보존한 document runtime을 release할 수 있는가?"
required_path:
  - "Document AI map"
  - "PaddleOCR-VL current system"
  - "Document structure assembly"
  - "HTML table reconstruction"
  - "OCR runtime evaluation"
optional_paths:
  verifiable_parser: "olmOCR source branch"
  source_paper_spine: "Donut → current system"
claim_boundaries:
  - "Donut decoder의 m은 padding을 제외한 실제 target 길이로 고쳤다."
  - "Malformed sequence fixture는 END token 하나만 제거하고 affected field를 명시한다."
  - "Assembly relation score와 overlap 식은 source result가 아닌 교육용 재구성으로 표시했다."
  - "빈 cell은 이웃 값을 복사하지 않고 ∅ unresolved provenance로 남긴다."
hard_transfer:
  prompt: "rowspan·colspan이 깨진 세금계산서에서 subtotal 42, tax 5, OCR total 48이 충돌할 때 어떤 값을 출력하고 어느 crop·cell·revision을 재검증할지 결정한다."
  correct_insight: "42+5=47이므로 48을 release하지 않고 cell lineage와 crop evidence를 따라 fail closed한다."
runtime_contract:
  provenance: "document/page/block/line/cell id, reading order, bbox, crop, verification state, parser/model/prompt version"
  job_key: "source digest + parser/model/prompt version"
  fallback: "실패 이유별로 route를 나누며 같은 parser를 무한 재시도하지 않는다."
```

### World Model 재구성

```yaml
top_question: "좋은 video prediction을 실제 robot action release 근거로 바꾸려면 무엇을 더 측정해야 하는가?"
required_path:
  - "World Model & Physical AI current hub"
  - "Predictive representation"
  - "Action-conditioned dynamics"
  - "Closed-loop planning"
optional_source_path:
  - "V-JEPA 2 paper reconstruction"
primary_source_receipts:
  VJEPA2: "arXiv:2506.09985"
  DreamZero: "arXiv:2602.15922 · 14B · real robot 7 Hz · 공개 범위의 direct-policy comparator"
  WorldActionPlanner: "arXiv:2607.27599 · 2026-07-30 제출 · VLM proposal + action-conditioned rollout/search"
  CEM: "doi:10.1016/S0377-2217(96)00385-2"
  MPC: "doi:10.1016/S0005-1098(99)00214-9"
promotion_decision:
  accepted_as_current_top: "V-JEPA 2 source spine과 DreamZero direct-policy comparator"
  held: "World Action Planner는 최신 discovery로 기록하되 공개 증거가 simulation 중심이라 real closed-loop 대표 경로 승격을 보류"
rejected_inferences:
  - "masked latent prediction을 보편적 causal future density로 부르지 않았다."
  - "DreamZero의 direct policy를 explicit search planner 증거로 쓰지 않았다."
  - "가상 1.2 ms/rollout 계산을 release latency라고 부르지 않았다."
hard_transfer:
  prompt: "새 camera가 25 cm·12도 이동하고 gripper convention도 바뀐 환경에서 96/120 성공, p95 460 ms가 나왔을 때 바로 release할 수 있는가?"
  correct_insight: "성공률만으로 부족하다. camera pose·gripper mapping, collision clearance, profiler p95, real closed-loop receipt가 모두 있어야 하며 finite sample은 Wilson 95% lower bound로 판정한다."
planner_oracle:
  formula: "T_wall ≈ (N R H / B_eff) t_roll + t_over"
  fixture: "H=8, N=800, R=10, B=50 → 1560 ms → 설계 수정"
  drift: "one-step error × 실제 open-loop action 수이며 planning horizon과 중복 곱하지 않는다"
release_oracle:
  initial: "4 receipts unmeasured → hold"
  success_only: "96%만 입력 → hold"
  measured: "n=120 + 4 receipts + Wilson lower 90.8% → release"
  receipt_removed: "latency receipt 제거 → hold"
```

### Viz와 상호작용 판단

색만 바꾸는 것을 개선으로 세지 않았다.

```yaml
visual_oracles:
  - "control은 최소 44px이며 state를 실제로 바꾼다."
  - "SVG 내부의 작은 겹침 label은 삭제하고 화면 폭을 쓰는 별도 범례로 옮긴다."
  - "모바일 control은 2열, release card는 2열, 넓은 화면은 3열로 배치한다."
  - "5개 gate를 억지로 한 줄에 넣어 단어가 세로로 붕괴하지 않게 한다."
  - "gradient 대신 단색 면·선·stroke hierarchy로 goal과 risk를 구분한다."
  - "V-JEPA 세 tablist는 ArrowLeft·ArrowRight·Home·End와 roving focus를 지원한다."
  - "KaTeX는 raw command가 남지 않고 각 식 아래에 한글 의미·기호 설명이 있다."
```

### 4B 작성자 + 9B 검토자용 재현 절차

```yaml
stage_1_writer_4b:
  input:
    - "current target 한 개"
    - "primary source packet"
    - "기존 article/path registry"
  output_ir:
    decision: "독자가 마지막에 내려야 할 결정"
    required_nodes: "결정을 막는 최소 기반만"
    optional_sources: "본문 흐름을 막지 않는 원문 sidecar"
    direct_claims: "source가 직접 말한 범위"
    editorial_reconstruction: "저자 fixture·설계·계산"
    hard_transfer: "본문 문장을 복사해서는 풀 수 없는 새 조건"
    formula_units: "변수·단위·분모·aggregation level"
    viz_state: "control, changed state, invariant, fail state"
stage_2_reviewer_9b:
  checks:
    - "최신이라는 이유만으로 evidence가 약한 글을 승격했는가"
    - "직접 policy, representation, dynamics, planner를 서로 대신 증명했는가"
    - "미측정이 pass로 계산되는가"
    - "source result와 교육용 fixture의 문체·label이 구분되는가"
    - "본문만으로 hard-transfer의 failure owner를 찾을 수 있는가"
    - "360px에서 overflow를 font shrink로 숨겼는가"
stage_3_static_browser_oracle:
  checks:
    - "route ownership과 unresolved step"
    - "raw LaTeX, KaTeX error, formula overflow, Korean note"
    - "document overflow, internal Viz scroll, clipped foreignObject"
    - "runtime console/page errors"
    - "control state transition과 keyboard focus"
stage_4_human_or_stronger_model:
  purpose: "source nuance, 서사, 시각 위계, 어려운 전이 문제의 충분성을 재검토"
  current_state: "Claude 사용량이 돌아오는 2026-08-01 18:00 KST 이후 queue 재검증"
```

### 검증과 production 배포 영수증

```yaml
regression_suite:
  command: "QA_BASE_URL=http://127.0.0.1:4181 bunx playwright test tests/ai-current-flow-gaps.spec.ts tests/ai-authored-topic-paths.spec.ts tests/p3-foundational-source-closure.spec.ts"
  result: "122 pass + stale path expectation 3개 발견"
  repair: "speech recognition link가 ?path=ai-speech-audio-recognition 문맥을 보존하도록 test contract 갱신"
  rerun: "3/3 pass"
local_full_scope:
  discovery_report: ".codex-tmp/foundation-speech-document-world-viz-local-2026-07-31.json · mobile formula overflow 2건 발견"
  viz_report: ".codex-tmp/foundation-speech-document-world-viz-final-local-2026-07-31.json"
  narrative_report: ".codex-tmp/foundation-speech-document-world-narrative-local-2026-07-31.json"
  matrix: "27 routes × desktop 1440 × tablet 768 × mobile 360"
  result: "81 checks · 315 surfaces · 82 SVG · 678 formulas · errors 0 · warnings 0"
world_interaction:
  report: ".codex-tmp/world-model-browser-qa-2026-07-31.json"
  viewports: "mobile 360 · desktop 1440"
  result: "planner/release/receipt rollback/3 keyboard tablists/layout overflow · errors 0"
final_local:
  report: ".codex-tmp/speech-world-viz-final-local-2026-07-31.json"
  result: "7 routes · 21 checks · 39 surfaces · 87 formulas · errors 0 · warnings 0"
build:
  command: "bun run build:tsc"
  result: "pass"
  note: "900 kB 초과 chunk warning만 존재"
deployment:
  deployed_at: "2026-07-31 20:55:42 KST"
  service: "cm-blog.service"
  status: "active/running"
  main_pid: 1727610
  html_status: 200
  asset: "/lab/assets/index-fVSvQnFO.js"
  asset_status: 200
  legacy_redirect: "/blog/ → 308 /lab/blog/"
  index_sha256:
    local: "5bbc7572f334d93864294301a439efc0062afc5afd860fd2e83c5c541eefd920"
    production: "5bbc7572f334d93864294301a439efc0062afc5afd860fd2e83c5c541eefd920"
production_browser_qa:
  viz_report: ".codex-tmp/speech-world-viz-final-production-2026-07-31.json"
  narrative_report: ".codex-tmp/speech-world-narrative-final-production-2026-07-31.json"
  matrix: "7 routes × desktop 1440 × tablet 768 × mobile 360"
  result: "21 checks · 39 surfaces · 87 formulas · errors 0 · warnings 0"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  queue: "292 queued · 12 accepted · 304 total"
  prior_status: "DRIFT 46 · UNVERIFIED 178 · PARTIAL 49 · REVIEW_REQUIRED 19"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer · active/waiting"
```

## 33. RL · Vision · Time-series · Interpretability current-first closure (2026-07-31)

### 이번 배치의 출발점

이 배치는 아티클 수를 늘리는 작업이 아니라, 독자가 현재 제품 문제에서 출발해 필요한 최소 기반과 원문까지 내려갔다가 다시 구현 판단으로 돌아오게 만드는 작업이다. 기존 문제는 다음과 같았다.

1. Time-series가 forecasting과 anomaly detection을 한 줄 경로로 섞었다.
2. Computer Vision이 CLIP, ViT, ResNet, CNN을 하나의 선형 역사처럼 보이게 했다.
3. Interpretability가 readout과 causal intervention의 증거 강도를 충분히 분리하지 않았다.
4. RL release 판단이 성공률 point estimate만 보여 finite-sample uncertainty를 숨길 수 있었다.
5. 긴 KaTeX 식을 글자 크기로 줄여 모바일 폭에 맞추는 곳이 남아 있었다.

### 재구성 판단과 의도

```yaml
time_series:
  parent: "예측과 이상 사건을 먼저 고르는 choice hub"
  forecast_path: "forecast origin → rolling backtest → DeepAR/ARIMA/LSTM"
  anomaly_path: "alert contract → event matching → residual detector/ECOD"
  reason: "미래 값을 맞히는 단위와 운영 incident를 검출하는 단위는 metric·split·release gate가 다르다."
vision:
  parent: "제품이 요구하는 output schema에서 task branch를 선택"
  promptable: "SAM 3.1 → prompt·mask·video identity contract"
  detection: "fixed vocabulary → open vocabulary → Deformable DETR mechanism floor"
  representation: "global retrieval·multilingual alignment·dense localization·self-supervised transfer 중 출력 선택"
  independent_foundations: "CLIP, ViT, ResNet→CNN은 서로 독립인 optional branch"
  rejected_chain: "CLIP→ViT→ResNet→CNN을 시간순 필수 선수과목처럼 나열하지 않음"
interpretability:
  evidence_order: "행동 → 관찰 → readout → 분해 → 가설 → 개입"
  current_branches: "J-Lens/J-space, Gemma Scope 2, circuit tracing, NLA, train-for-interpretability"
  boundary: "읽을 수 있음, 예측할 수 있음, 원인임을 각각 다른 주장으로 둠"
rl:
  release_gate: "success/n을 Wilson 95% lower bound로 바꾸고 receipt 누락은 fail closed"
  current_cases: "RISE, ContactRL, Gemini Robotics-ER 1.6을 동일한 성공 증거로 합치지 않음"
```

### 원문과 claim boundary

```yaml
direct_source_claims:
  vision: "PE, SigLIP 2, DINOv3, OV-DEIM, WeDetect의 공개 논문·연구 글에서 명시된 objective와 output"
  interpretability: "Transformer Circuits 2021, Tuned Lens, J-Lens/J-space, Gemma Scope 2의 공개 수식과 실험 범위"
  timeseries: "DeepAR의 autoregressive likelihood·sample path aggregation, ARIMA의 진단 범위, ECOD의 empirical CDF score"
  rl: "현재 연구가 공개한 task·evaluation 범위와 finite sample count"
editorial_reconstructions:
  - "Encoder 선택 lab의 네 output contract와 검증 항목"
  - "Anomaly point alert를 event incident로 합치는 k·gap fixture"
  - "RL release receipt와 Wilson threshold fixture"
  - "Deformable bilinear interpolation의 2×2 교육용 수치"
rejected_inferences:
  - "J-Lens의 높은 token ranking을 유일한 내부 개념 또는 causal proof로 부르지 않음"
  - "Tuned Lens의 빠른 예측을 해당 layer가 결과를 생성한 증거로 부르지 않음"
  - "Open-vocabulary detector의 category 확장을 모든 unseen object 검출 보장으로 부르지 않음"
  - "DINOv3 dense feature를 특정 downstream 제품의 release 성능으로 대신 증명하지 않음"
  - "ARIMA residual 진단을 고정된 production horizon H=24의 성능 보장으로 쓰지 않음"
  - "Threshold를 넘은 point 수를 운영 incident 수와 동일시하지 않음"
```

### 수식과 Viz를 수정한 방법

긴 식을 더 작게 만드는 대신 계산 책임별로 나눴다.

- LSTM은 recurrent Jacobian과 cell-state product를 별도 식으로 분리했다.
- DeepAR은 한 sample path의 span 합과 그 합계들의 quantile을 분리했다.
- Anomaly matching은 bipartite graph, maximum matching, unmatched set을 분리했다.
- SigLIP 계열은 pair score와 pairwise loss를 분리했다.
- ViT는 projection, token-pair, MLP, score-memory 비용을 각각 표시했다.
- Deformable attention은 reference point, 네 이웃, bilinear weight와 합계를 모바일 세로 표로 바꿨다.
- Policy Gradient는 score identity, return-weighted gradient, action-independent baseline, critic target과 residual을 의미 단위로 분리하고 모든 식에 한글 FormulaNote를 붙였다.

Viz는 색 변경을 상호작용으로 세지 않았다. 선택한 task·threshold·gap·lens·evidence·feature 위치가 실제 계산, 허용 주장, failure receipt를 바꿀 때만 causal control로 인정했다. 모든 control은 44px 이상이며 keyboard 경로와 `aria-live` 결과를 유지한다. `.article-viz-surface`에는 4.5rem scroll margin을 적용해 고정 헤더가 도입부를 덮지 않게 했다.

### Hard-transfer oracle

작성 전에 다음 문제를 내부적으로 만들고, 본문 문장을 복사하지 않고도 해결 가능한지 확인했다.

```yaml
vision_problem: "다국어 검색 성능은 좋지만 작은 부품 localization이 무너지고 dense layer memory가 초과된다. 어떤 encoder output과 검증 slice를 먼저 바꿀 것인가?"
required_insight: "모델 순위가 아니라 global embedding과 dense intermediate tensor를 분리하고 localization·small-object·stride/memory를 각각 측정한다."
timeseries_problem: "12개 point 중 6개가 threshold를 넘지만 k=2와 1-gap merge 뒤 실제 incident는 몇 개인가?"
required_insight: "point alert를 바로 ticket으로 세지 않고 연속성·최소 지속·merge 후 event matching으로 계산한다."
interpretability_problem: "attention, Logit Lens, Tuned Lens, J-Lens가 같은 token을 가리키지만 activation patch 효과가 layer별로 다르다. 무엇까지 주장할 수 있는가?"
required_insight: "readout은 방향을 읽는 관찰이고, matched intervention만 제한된 causal effect를 말한다. null effect도 feature 부재를 증명하지 않는다."
rl_problem: "96/120 success와 평균 latency만 있을 때 release 가능한가?"
required_insight: "Wilson lower bound와 tail latency, safety·topology·receipt completeness를 함께 보고 미측정은 hold한다."
```

### 4B 작성자와 9B 검토자용 분업

```yaml
writer_4b:
  receives: "한 개 current decision, 제한된 primary-source packet, 기존 path registry, hidden transfer question"
  must_emit:
    - "decision과 output schema"
    - "required foundation과 optional source 분리"
    - "direct claim / editorial fixture / unknown 필드"
    - "수식별 한글 meaning·symbol table"
    - "control이 바꾸는 state·invariant·failure"
  forbidden:
    - "전체 분야 연대기 생성"
    - "표만으로 모델 catalog 만들기"
    - "미측정 값을 pass로 채우기"
reviewer_9b:
  independently_solves: "hidden transfer question"
  checks:
    - "본문만으로 failure owner와 다음 측정을 찾는가"
    - "현재 연구와 최소 기반 사이에 premise gap이 없는가"
    - "source claim과 교육용 fixture가 문체·label로 구분되는가"
    - "모바일에서 12px 미만 축소, raw LaTeX, overflow가 없는가"
    - "Viz control이 실제 계산과 허용 주장을 바꾸는가"
deterministic_oracle:
  - "path ownership·direct-entry preservation"
  - "KaTeX error·raw command·Korean FormulaNote"
  - "360/768/1440 width·overlap·internal scroll"
  - "keyboard·44px·runtime error"
```

### 검증 영수증과 남은 작업

```yaml
targeted_regression:
  result: "90/90 pass + Policy Gradient formula parity 3/3 pass"
  scope: "time-series paths, DeepAR source, vision foundations/system contracts, current Vision·Time-series IA, authored topic paths"
visual_audit:
  report: ".codex-tmp/current-rl-vision-time-interpret-viz-final-2026-07-31.json"
  result: "25 routes × 3 viewports = 75 checks; 273 surfaces; 477 formulas; errors 0; warnings 0"
browser_screenshots:
  directory: ".codex-tmp/final-visual-2026-07-31"
  inspected: "Time-series choice hub, encoder decision lab, Deformable bilinear fixture, interpretability evidence ladder, anomaly incident lab"
information_architecture:
  report: ".codex-tmp/ai-information-architecture-qa-2026-07-31.json"
  result: "desktop/mobile; 20 tracks; duplicates 0; overflow 0; failures 0"
mastery_heuristic:
  scope: "305 AI articles"
  result: "weak article 0; 304 at least 90, 1 at 75-89; heuristic only, not release evidence"
global_backlog:
  learning_flow: "616 registered; formula gaps 29; missing prerequisites 297; enrichment backlog 302"
  source_receipts: "304 AI articles; closure ACCEPT 11; REVIEW_REQUIRED 18; PARTIAL 40; DRIFT 57; UNVERIFIED 178"
  interpretation: "이번 25-route closure가 전체 블로그 완료를 뜻하지 않는다. 다음 배치와 Claude queue가 닫아야 할 명시적 backlog다."
build:
  command: "bun run build:tsc"
  result: "pass; 900 kB chunk warning only"
deployment:
  restarted_at: "2026-07-31 22:02:53 KST"
  service: "cm-blog.service · active/running"
  main_pid: 1839319
  asset: "/lab/assets/index-CGbgARpn.js · 200"
  html: "/lab/blog/ · 200"
  legacy_redirect: "/blog/ → 308 /lab/blog/"
  index_sha256: "local=production=55a3423289f3d70ba95249741ae4d1c350ba0177b600f706365f01812c1dc778"
production_browser_qa:
  viz_report: ".codex-tmp/current-rl-vision-time-interpret-viz-final-production-2026-07-31.json"
  viz_result: "25 routes × 3 viewports; 75 checks; 273 surfaces; 477 formulas; errors 0; warnings 0"
  narrative_report: ".codex-tmp/current-rl-vision-time-interpret-narrative-final-production-2026-07-31.json"
  narrative_result: "25 routes × 3 viewports; 75 checks; 21 StepViz; 273 surfaces; errors 0; warnings 0"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  deferral_record: ".codex-tmp/claude-validation-deferral-2026-07-31.md"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer · active/waiting · next Sat 2026-08-01 18:00 KST"
  prohibition: "실제 queue 결과가 오기 전에는 Claude 검증 완료로 기록하지 않는다."
```

## 34. LLM architecture gallery를 fact sheet에서 판독 훈련으로 전환 (2026-07-31)

### 사용자 문제와 실제 진단

사용자가 지적한 문제는 모델 수가 부족한 것이 아니라, 모델별 사실을 표나 긴 목록으로 읽고도 새 논문의 구조를 스스로 판독할 수 없다는 것이었다. 기존 구현을 모바일에서 측정하니 다섯 milestone이 모두 펼쳐져 약 7,714px 높이를 차지했고, 상단의 다섯 축과 최신 변화는 정적 정의 목록이라 선택에 따른 token 경로·검증 범위가 바뀌지 않았다.

따라서 다음 두 질문으로 구현 단위를 다시 정했다.

1. 최신 모델 이름을 지워도 독자가 무엇이 바뀌었는지 다섯 축으로 찾을 수 있는가?
2. GPT-2에서 Kimi Linear까지 한 모델씩 비교하면서 상속한 계약, 바꾼 계약, token 실행 순서, 얻는 것과 대가를 같은 순서로 설명할 수 있는가?

### 재구성 결과

```yaml
current_compass:
  axes: "입력 경계 · 문맥 혼합 · 용량 배분 · 상태 저장 · 깊이 혼합"
  examples: "DeepSeek-V4 · Attention Residuals · Gemma 4 12B"
  interaction: "모델 선택 → 활성 축 → 기준 계약 → 바뀐 계약 → 4단계 입력 경로 → 결과 → 검증 한계"
  source_behavior: "선택한 변화의 공식 원문 링크만 같은 panel에 노출"
lineage_sequence:
  order: "GPT-2 XL → Llama 3 → Gemma 3 → DeepSeek V3 → Kimi Linear"
  interaction: "한 번에 한 milestone만 펼치고 탭 또는 이전·다음으로 이동"
  repeated_schema: "핵심 질문 → 상속한 것 → 바꾼 것 → token 흐름 → 얻는 것 → 치르는 대가 → native diagram"
  mobile_label: "GPT-2 · Llama · Gemma · DS-V3 · Kimi 축약 라벨을 노출하고 전체 버전은 aria-label과 상세 제목에서 제공"
  height_change: "약 7,714px → 약 1,923px, 약 75% 감소"
```

표를 더 예쁘게 만든 것이 아니라 비교 방식을 바꿨다. 한 화면에 모든 모델을 쌓지 않고, 동일한 질문 순서를 유지한 채 하나씩 교체함으로써 독자가 변경점에 시선을 고정하도록 했다. 색은 선택 상태와 `바뀐 계약`에만 제한적으로 사용하고, 나머지 구분은 선·간격·타이포그래피 위계로 처리했다.

### 원문과 해석 경계

```yaml
primary_sources:
  deepseek_v4: "DeepSeek 공식 기술 보고서 · CSA/HCA/mHC의 공개 구조와 저자 환경 비교"
  attention_residuals: "Moonshot AI 공식 논문·구현 · depth attention, Full/Block 계산 범위"
  gemma_4_12b: "Google DeepMind 공식 발표 · encoder-free multimodal input 경계"
  lineage: "Sebastian Raschka LLM Architecture Gallery의 모델별 구조 그림과 정량 정보"
direct_claims:
  - "공개 문서가 명시한 구조 구성과 저자 측 비교 범위"
editorial_reconstructions:
  - "다섯 판독 축"
  - "모든 모델에 공통으로 적용한 상속·변경·token flow·gain·cost 순서"
  - "새 논문을 읽을 때 어떤 runtime evidence를 추가로 요구할지"
rejected_inferences:
  - "FLOPs 또는 KV 감소율을 동일한 latency 감소율로 부르지 않음"
  - "depth readout의 선택 가중치를 곧 causal 중요도로 부르지 않음"
  - "encoder-free라는 구조 설명을 모든 modality 품질 우위로 확장하지 않음"
  - "parameter 수만으로 실제 token당 계산량·통신·memory 병목을 결론내리지 않음"
```

### Hard-transfer oracle

작성 전에 다음 문제를 만들고, 본문을 그대로 복사하지 않고도 해결할 수 있는지를 기준으로 문장을 보강했다.

```yaml
unknown_spec_problem: "이름을 가린 새 모델 사양에서 context, active parameter, KV/token, residual input, modality adapter만 주어졌다. 다섯 축 중 실제로 바뀐 축과 headline 숫자만으로 결론낼 수 없는 항목을 분리하라."
required_insight: "구조 축을 먼저 분리하고 FLOPs·KV·parameter와 runtime latency·통신·품질을 같은 지표로 취급하지 않는다."
deepseek_problem: "CSA/HCA가 FLOPs와 KV를 줄였는데 실측 latency가 기대만큼 줄지 않았다. 가장 먼저 확인할 evidence는 무엇인가?"
required_insight: "kernel 구현, batch, memory traffic, GPU 간 통신과 저자 비교 환경을 확인해야 한다."
attnres_problem: "token attention을 줄이지 않았는데 Attention Residuals가 무엇을 바꿨으며 Full과 Block의 memory 차이는 어디서 생기는가?"
required_insight: "token 축이 아니라 layer-depth 축을 조회하고, Full은 이전 layer activation을 더 오래 보존하므로 O(Ld) memory 책임이 생긴다."
gemma_problem: "전용 encoder를 줄인 모델에서 integration은 단순해졌지만 특정 audio task가 하락했다. 모순인가?"
required_insight: "입력 변환 부담이 shared backbone으로 이동했으므로 구조 단순화와 task 품질은 독립적으로 측정한다."
lineage_problem: "671B MoE와 48B hybrid 중 어느 모델이 더 빠른가?"
required_insight: "전체 parameter가 아니라 active path, cache/state, router·all-to-all, context 길이와 runtime을 함께 보지 않으면 답할 수 없다."
```

### 4B 작성자와 9B 검토자용 분업

```yaml
writer_4b:
  receives: "한 모델의 공식 원문 발췌, 기준 모델 계약, 다섯 축 schema, 한 개 hidden transfer problem"
  emits:
    - "원문이 직접 말한 변경"
    - "상속한 계약과 바꾼 계약"
    - "한 입력의 3~5단계 실행 경로"
    - "gain과 cost를 한 쌍으로 작성"
    - "독립 측정이 필요한 unknown"
  forbidden:
    - "모델 이름과 parameter 표만 나열"
    - "저자 FLOPs를 production latency로 치환"
    - "미공개 구현을 그럴듯하게 채움"
reviewer_9b:
  independently_solves: "해당 모델의 hidden transfer problem"
  checks:
    - "다섯 축 중 바뀐 축이 근거와 일치하는가"
    - "상속·변경·실행 순서가 서로 모순되지 않는가"
    - "gain만 있고 cost·failure owner가 빠지지 않았는가"
    - "직접 주장과 편집자 재구성이 라벨로 구분되는가"
    - "새 모델 이름을 지워도 같은 판독 절차를 적용할 수 있는가"
deterministic_oracle:
  - "탭 한 개 선택 시 panel·active axis·source가 함께 바뀜"
  - "lineage native diagram은 정확히 한 개만 렌더링"
  - "390/768/1440 overflow 0, 최소 text 12px, control 44px"
  - "고정 header 아래 section top 79~80px"
```

### 검증 영수증과 Claude 보류

```yaml
build:
  command: "bun run build:tsc"
  result: "pass; 기존 900 kB chunk warning only"
focused_regression:
  command: "playwright · llm architecture learning flow + AI visual system contract"
  result: "21 checks pass"
responsive_metrics:
  mobile_390: "document/compass/sequence overflow 0 · min text 12px · min control 44px"
  tablet_768: "overflow 0 · min text 12px · min control 44px"
  desktop_1440: "positive overflow 0 · min text 12px · min control 44px"
scroll_receipt: ".codex-tmp/llm-architecture-redesign-2026-07-31/production-scroll-final.json"
screenshot_receipt: ".codex-tmp/llm-architecture-redesign-2026-07-31/production-mobile-sequence-final2.png"
production_browser_qa:
  result: "21/21 pass · mobile/tablet/desktop learning flow + visual-system contract"
  mobile_receipt: ".codex-tmp/llm-architecture-redesign-2026-07-31/production-mobile-final.json"
  measured: "section top 79.890625px · overflow 0 · KaTeX error 0 · all five tab overflow 0"
deployment:
  restarted_at: "2026-07-31 22:39:31 KST"
  service: "cm-blog.service · active/running"
  main_pid: 1889311
  route: "https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/llm-architecture-gallery · 200"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  deferral_record: ".codex-tmp/claude-validation-deferral-2026-07-31.md"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer · active/waiting"
  prohibition: "Claude queue 결과를 받기 전에는 cross-validation 완료로 승격하지 않는다."
```

## 35. Open image · video 허브를 모델 카탈로그에서 제작 의사결정으로 전환 (2026-07-31)

### 진단과 방향

Ideogram 4, Krea 2, FLUX.2, Qwen-Image 2.0, Z-Image, Illustrious XL, LTX-2.3과 Wan2.2의 현재 원문·상세 글은 이미 존재했다. 빠진 것은 모델 수가 아니라 읽는 방식이었다.

운영 모바일 390px에서 허브는 12,341px였고 이미지 모델 여섯 개가 모두 펼쳐진 긴 catalog였다. 보조 label은 9~11px까지 내려갔다. Goal router는 이미 제작 목표를 잘 나눴지만 그 아래 모델 목록은 다시 이름 중심으로 돌아가, 독자가 `왜 이 모델인가`보다 `무슨 모델이 있나`를 읽게 만들었다.

이를 다음 구조로 바꿨다.

```yaml
goal_router: "폐기 조건 → 필요한 control → 공식 후보 → 검증 경계 → image/video path"
image_sequence:
  tabs: "Ideogram · Krea · FLUX.2 · Qwen 2.0 · Z-Image · Illustrious"
  panel: "작업 질문 → 역할 서사 → 공식 원문 범위 → 독립 검증 → 상세 글·원문"
  visible_panels: 1
video_sequence:
  tabs: "LTX-2.3 · Wan2.2"
  panel: "사용 조건 → mechanism → 현재 공개·runtime·license 경계 → 상세 글·원문"
  visible_panels: 1
optional_floor: "solver·latent·U-Net 상속이 막힐 때만 Stable Diffusion 기준선으로 내려감"
```

### 원문과 편집자 책임

```yaml
direct_sources:
  - "Ideogram 4 공식 release·repository·architecture·safety·license"
  - "Krea 2 technical report·repository·prompting·license"
  - "FLUX.2 official documentation과 variant license"
  - "Qwen-Image official repository와 2.0 공개 시점"
  - "Z-Image repository의 Base·Turbo artifact"
  - "Illustrious XL v1.1 model card"
  - "LTX-2.3 open-source documentation과 community license"
  - "Wan2.2 official repository"
editorial_reconstruction:
  - "네 production goal과 여섯 acceptance gate"
  - "image/video 형제 branch와 runtime에서 다시 합류하는 순서"
  - "모든 모델을 failure·source·verification 순으로 읽는 schema"
rejected_inferences:
  - "open weights를 상업 사용 가능과 동일시하지 않음"
  - "consumer GPU 문구를 24 GiB 통과 영수증으로 사용하지 않음"
  - "image score를 temporal identity·motion·audio sync 증거로 사용하지 않음"
  - "family 이름만으로 API·base·distilled·edit variant를 합치지 않음"
  - "roadmap을 현재 공개 artifact로 쓰지 않음"
```

### Viz와 레이아웃 판단

색만 바꾸지 않았다. 여섯 개 article row를 하나의 tab·panel sequence로 바꾸고, 공식 주장과 채택 전 검증을 같은 위치의 두 band로 고정했다. 영상 두 모델도 병렬 card에서 선택 panel로 바꿨다. 공용 `OpenModelExplorers`는 다음을 함께 수정했다.

- figure에 `scroll-mt-20`을 추가해 sticky header가 도입부를 가리지 않음
- eyebrow, metric label, note, runtime stage, slider label을 모두 12px 이상으로 올림
- letter spacing 장식을 제거하고 선·간격·weight로 위계를 구분
- goal query 변경을 effect 안의 동기 setState가 아니라 route-aware derived selection으로 처리
- command link에는 ArrowRight·ExternalLink icon을 사용하고 44px 높이를 유지

### Hard-transfer oracle

```yaml
problem_1: "한국어 exact text, 제품 identity 편집, 5초 audio sync를 하나의 모델 순위로 고를 수 있는가?"
required: "세 결과는 control surface와 failure unit이 다르므로 typography, edit, video branch로 분리한다."
problem_2: "FLUX.2 4B와 9B가 같은 family라면 license와 peak VRAM도 같다고 볼 수 있는가?"
required: "variant·revision·license·dtype·VAE·offload를 별도 manifest로 측정한다."
problem_3: "Krea Turbo가 8 step에 좋으면 Turbo artifact에서 LoRA training을 시작해도 되는가?"
required: "distilled inference와 RAW trainable artifact의 lifecycle 계약을 분리한다."
problem_4: "Wan2.2 A14B와 TI2V-5B 결과를 같은 architecture evidence로 합칠 수 있는가?"
required: "expert structure, task entry, temporal VAE와 runtime configuration을 구분한다."
problem_5: "20초 지원 문구만으로 내 hardware의 20초 video를 release할 수 있는가?"
required: "resolution·frame·offload·latency·memory·license 조건을 고정하고 직접 재생·sync test한다."
```

### 4B 작성자와 9B 검토자

```yaml
writer_4b:
  receives: "한 production goal, 한 primary-source packet, artifact date, hidden transfer problem"
  emits: "direct claim · runtime/control path · unknown · acceptance fixture · license/runtime evidence"
  forbidden: "모델 순위표 · 홍보문 복사 · 미공개 기능 추정"
reviewer_9b:
  independently_solves: "hidden transfer problem"
  checks:
    - "family와 exact variant가 섞이지 않았는가"
    - "현재 기능과 roadmap이 분리됐는가"
    - "image quality가 temporal evidence를 대신하지 않는가"
    - "본문만으로 다음 runtime·manifest·budget·adaptation 경로를 고를 수 있는가"
deterministic_oracle:
  - "image tab 6 · panel 1"
  - "video tab 2 · panel 1"
  - "선택마다 설명·source·detail link가 함께 변경"
  - "360/390/768/1440 overflow 0"
  - "interactive minimum text 12px · control 44px"
```

### 검증과 배포 영수증

```yaml
content_spec: "src/pages/articles/ai/open-image-video-models/content-spec.md"
before_mobile_height: 12341
after_mobile_height: 9670
focused_regression:
  result: "14/14 local pass · 14/14 production pass"
  scope: "Ideogram·Krea article contract, source routing, open-media branch/runtime/manifest/budget/adaptation, hub readability"
responsive_receipt: ".codex-tmp/open-media-redesign-2026-07-31/production-metrics.json"
visual_receipts:
  - ".codex-tmp/open-media-redesign-2026-07-31/production-mobile-image-qwen.png"
  - ".codex-tmp/open-media-redesign-2026-07-31/production-mobile-video-wan.png"
measured: "360/390/768/1440 · document and three interactive scopes overflow 0 · minimum text 12px · minimum button 44px · KaTeX error 0 · section top 79~80px"
learning_flow_audit: "305 registered · blockers/formula/table/prerequisite/local gaps 0"
deployment:
  restarted_at: "2026-07-31 22:55:29 KST"
  service: "cm-blog.service · active/running"
  main_pid: 1906549
  route: "https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/open-image-video-models · 200"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  deferral_record: ".codex-tmp/claude-validation-deferral-2026-07-31.md"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer · active/waiting"
```

## 36. Agent runtime current-first 직접 진입·가독성 회귀 폐쇄 (2026-07-31)

### 진단과 편집 판단

`agent-runtime-current-first`의 내용은 이미 현재 runtime에서 model, harness, workspace, durable state를 분리하고 action surface, MCP와 A2A, failure-first route로 이어지는 충분한 인과 구조를 갖고 있었다. 새 글을 억지로 추가하는 것보다 실제 결함을 닫는 편이 맞았다.

운영 캡처에서 개별 Viz로 직접 스크롤했을 때 sticky header가 도입 질문과 제목을 가렸다. 또한 공통 회귀를 다시 실행하면서 `llm-harness` reducer 수식이 390px에서 3px 잘리고, Computer Use 단계 이동 icon button이 36px에 그치는 문제를 발견했다.

이를 다음처럼 수정했다.

```yaml
direct_entry:
  affected_labs: 6
  fix: "모든 interactive section root에 scroll-mt-20"
  expected_top: "70~90px · 실제 80px"
formula:
  before: "다음 runtime state · 결정적 전이 규칙 · model·tool·gate event"
  after: "다음 상태 · 결정적 전이 · 현재 상태 · 실행 사건"
  reason: "의미는 FormulaNote에서 보존하고 식 내부 주석은 한눈에 읽히는 역할 이름만 남김"
  result: "13px · scale 1.00 · overflow 0"
touch_target:
  before: "이전·다음 단계 36×36px"
  after: "44×44px"
```

### Hard-transfer oracle

```yaml
problem_1: "같은 모델을 API 응답, shell 수정, GUI 결제에 써도 같은 runtime이면 충분한가?"
required: "Action surface마다 grounding, permission, receipt와 verification 계약이 달라 harness와 workspace를 바꿔야 한다."
problem_2: "MCP server가 tool schema를 제공하면 실행 권한과 안전성도 보장되는가?"
required: "Protocol discovery와 authorization·policy·task success는 서로 다른 증거다."
problem_3: "GUI timeout 뒤 응답이 없으면 같은 click을 바로 재시도해도 되는가?"
required: "Fresh observation과 end-state proof로 effect가 없음을 확인한 뒤 retry class와 budget 안에서만 재시도한다."
problem_4: "모델 transcript만 저장하면 중단된 작업을 재개할 수 있는가?"
required: "Versioned runtime state, event reducer, artifact pointer, effect receipt와 checkpoint가 필요하다."
```

### 검증과 배포 영수증

```yaml
build: "bun run build:tsc · pass"
lint: "AgentCurrentLabs.tsx · llm-harness.tsx · agent-system-core-path.spec.ts · pass"
focused_regression:
  local: "20/20 pass"
  production: "20/20 pass"
  scope: "6개 agent article × mobile/tablet/desktop + causal interaction + MCP keyboard + hub branch"
responsive_receipts:
  local: ".codex-tmp/agent-runtime-redesign-2026-07-31/local-metrics.json"
  production: ".codex-tmp/agent-runtime-redesign-2026-07-31/production-metrics.json"
visual_receipts:
  - ".codex-tmp/agent-runtime-redesign-2026-07-31/production-mobile-route-final.png"
  - ".codex-tmp/agent-runtime-redesign-2026-07-31/production-mobile-computer-loop-final.png"
  - ".codex-tmp/agent-runtime-redesign-2026-07-31/production-mobile-harness-formula-final.png"
measured: "360/390/768/1440 · document/article/lab overflow 0 · direct-entry top 80px · minimum text 12px · minimum control 44px · KaTeX error 0"
deployment:
  restarted_at: "2026-07-31 23:13:06 KST"
  service: "cm-blog.service · active/running"
  main_pid: 1925277
  routes: "agent-runtime-current-first · computer-use-agent-runtime · llm-harness · 200"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  deferral_record: ".codex-tmp/claude-validation-deferral-2026-07-31.md"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer · active/waiting"
  prohibition: "Claude 결과를 받기 전에는 이 batch를 Claude-reviewed로 표시하지 않는다."
```

## 37. Document AI evidence pipeline 가독성·단계 계약 폐쇄 (2026-07-31)

### 재구성 판단

`문서 계약 → page parser → document assembly → deterministic verification → release/RAG`의 정보 구조는 이미 목적에서 실행 책임으로 내려가는 올바른 current-first 경로였다. 새 아티클을 늘리기보다 각 단계의 입력·출력·실패 책임이 한 화면에서 비교되는지, page 단위 결과가 document 관계와 섞이지 않는지, 검증 전 artifact가 release되는 것처럼 보이지 않는지를 닫는 편이 우선이었다.

브라우저 감사에서 발견한 실제 문제는 세 가지였다.

```yaml
stale_contracts:
  - "PaddleOCR test가 과거 text button을 찾았지만 현재 UI는 6단계 progress control을 사용"
  - "HTML table 수식 보강 뒤 test count가 2에 머물렀지만 현재 근거 수식은 3개"
  - "OCR release test가 첫 artifact에서 최종 verdict를 기대했지만 판정은 5번째 장면에만 존재"
readability:
  before: "핵심 Viz label 9~11px · 모바일 실행 단계 5개가 한 열 · page block 6개가 한 열"
  after: "최소 12px · 44px control · 실행 단계 2열/마지막 단계 전폭 · page block 2열"
direct_entry:
  fix: "지도 3개·assembly 5개·공통 StepViz root에 scroll-mt-20"
  expected_top: "70~90px · 실제 80px"
```

### Hard-transfer oracle

```yaml
problem_1: "한 page의 text·table·formula와 reading order가 모두 맞으면 여러 page 문서도 맞는가?"
required: "아니다. table continuation, heading scope, figure-caption 관계는 document assembler가 별도 evidence로 복원해야 한다."
problem_2: "두 cross-page 후보의 의미 유사도가 높으면 더 높은 하나를 자동 연결해도 되는가?"
required: "독립 channel, runner-up margin과 critical identifier 충돌을 함께 보고 모호하면 review로 보낸다."
problem_3: "Markdown이 자연스럽고 OCR benchmark가 높으면 RAG 근거로 release해도 되는가?"
required: "typed IR의 page·bbox·parser revision, deterministic grid/LaTeX 검증, golden 질문과 citation fidelity가 모두 필요하다."
problem_4: "같은 표를 두 장문 chunk가 다른 relation type으로 해석하면 자연스러운 쪽을 고르면 되는가?"
required: "공통 overlap identity로 동기화하고 충돌을 보류한다. 겹침이 없으면 overlap을 늘려 재처리한다."
```

### 검증과 배포 영수증

```yaml
build: "bun run build:tsc · pass"
lint: "StepViz · Document map · Paddle page parser · assembly labs · OCR release · regression spec · pass"
focused_regression:
  local: "13/13 pass"
  production: "13/13 pass"
  scope: "Document assembly 3 viewports, current-first IA, map/Paddle interaction, table reconstruction 3 viewports, release collision/provenance, olmOCR 3 viewports"
responsive_receipts:
  local: ".codex-tmp/document-ai-redesign-2026-07-31/local-metrics.json"
  production: ".codex-tmp/document-ai-redesign-2026-07-31/production-metrics.json"
visual_receipts:
  - ".codex-tmp/document-ai-redesign-2026-07-31/map-execution-viewport-mobile.png"
  - ".codex-tmp/document-ai-redesign-2026-07-31/map-assembly-viewport-mobile.png"
  - ".codex-tmp/document-ai-redesign-2026-07-31/relation-viewport-mobile.png"
  - ".codex-tmp/document-ai-redesign-2026-07-31/paddle-layout-viewport-mobile.png"
measured: "360/390/768/1440 · 16 route/viewport combinations · document/article/surface overflow 0 · minimum text 12px · minimum control 44px · direct-entry top 70~90px"
deployment:
  restarted_at: "2026-07-31 23:33:18 KST"
  service: "cm-blog.service · active/running"
  main_pid: 1947924
  routes: "ocr-document-ai-map · document-structure-assembly · paddleocr-vl · html-table-structure-reconstruction · ocr-runtime-evaluation · 200"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  deferral_record: ".codex-tmp/claude-validation-deferral-2026-07-31.md"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer · active/waiting"
  prohibition: "Claude 결과를 받기 전에는 이 batch를 Claude-reviewed로 표시하지 않는다."
```

## 38. Interpretability·Time Series current-first 루트 통합 검증 (2026-07-31)

### 경로 판단

두 영역 모두 도구 이름을 나열하는 목록이 아니라 먼저 사용자가 내려야 할 판단을 분기점으로 둔다.

```yaml
interpretability:
  route: "행동 → 관찰 → readout → feature 분해 → attribution graph → causal intervention"
  distinction: "내부 신호를 읽을 수 있음과 그 신호가 실제 결과의 원인임을 분리"
  foundations: "J-space · vocabulary readout · SAE · circuit analysis를 필요한 만큼만 하강"
time_series:
  parent_decision: "미래 값을 예측할지, 운영 사건을 검출할지 먼저 선택"
  forecasting: "forecast origin · point-in-time covariate · rolling backtest · probabilistic calibration → DeepAR/LSTM/ARIMA"
  anomaly: "alert contract · replay · residual event · incident grouping → ECOD baseline"
```

### Hard-transfer oracle

```yaml
problem_1: "Attention weight가 큰 token이 model output의 원인이라고 말할 수 있는가?"
required: "아니다. projected value contribution과 downstream computation을 분리하고 activation patching 같은 intervention으로 causal restoration을 측정해야 한다."
problem_2: "Logit/Tuned/J-Lens에서 중간 token 방향이 읽히면 model이 그 token을 실제 출력했다고 말할 수 있는가?"
required: "Readout은 diagnostic distribution이다. final output distribution과 intervention evidence를 별도로 확인한다."
problem_3: "SAE feature가 사람이 붙인 개념과 잘 맞으면 faithful mechanism인가?"
required: "Reconstruction error, sparsity, feature splitting과 ablation/steering effect를 함께 보고 해석 한계를 기록한다."
problem_4: "Forecast model 비교에서 무작위 train/test split을 써도 되는가?"
required: "각 forecast origin 당시 실제로 가용한 covariate만 사용하고 repeated rolling origin으로 leakage 없이 비교한다."
problem_5: "Threshold를 넘은 시점 수가 곧 운영 incident 수인가?"
required: "Point anomaly를 persistence, cooldown, gap tolerance와 alert contract로 묶어 event/incident로 변환해야 한다."
problem_6: "ECOD가 높은 anomaly score를 주면 시간적 이상 원인도 설명한 것인가?"
required: "ECOD는 feature-wise empirical tail baseline이다. 시간축은 causal lag/rolling feature와 point-in-time availability로 별도 검증한다."
```

### 검증과 운영 영수증

```yaml
build_including_shared_changes: "bun run build:tsc · pass"
local_regression:
  interpretability: "25/25 pass"
  time_series_and_ia: "26/26 pass"
production_regression:
  combined: "51/51 pass"
  scope: "경로 보존, readout/patching/SAE interaction, keyboard, DeepAR source, forecasting/anomaly branches, ARIMA/LSTM/ECOD, KaTeX와 360/390/768/1440 responsive contract"
aggregate_production_receipts:
  narrative: ".codex-tmp/current-rl-vision-time-interpret-narrative-final-production-2026-07-31.json"
  visual: ".codex-tmp/current-rl-vision-time-interpret-viz-final-production-2026-07-31.json"
  measured: "25 routes × 3 viewports · 273 visual surfaces · 477 formulas · errors 0 · warnings 0"
visual_receipts:
  - ".codex-tmp/final-visual-2026-07-31/interpretability-frontier-mobile.png"
  - ".codex-tmp/final-visual-2026-07-31/timeseries-hub-mobile.png"
  - ".codex-tmp/final-visual-2026-07-31/timeseries-hub-desktop.png"
deployment:
  restarted_at: "2026-07-31 23:33:18 KST"
  service: "cm-blog.service · active/running"
  main_pid: 1947924
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  deferral_record: ".codex-tmp/claude-validation-deferral-2026-07-31.md"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer · active/waiting"
```

## 39. Claude 이전 Codex/static/browser closure checkpoint (2026-07-31)

```yaml
learning_flow:
  receipt: ".codex-tmp/final-ai-learning-flow-audit-2026-07-31.json"
  registered: 305
  release_blockers: 0
  review_needed: 0
  enrichment_backlog: 0
  formula_gaps: 0
  table_first: 0
  missing_prerequisites: 0
  local_connection_backlog: 0
  global_continuity_coverage: 305
production_ia:
  receipt: ".codex-tmp/final-ai-information-architecture-production-2026-07-31.json"
  viewports: "1440×1000 · 390×844"
  failures: 0
service:
  name: "cm-blog.service"
  active: true
  main_pid: 1947924
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  deferral_record: ".codex-tmp/claude-validation-deferral-2026-07-31.md"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer · active/waiting"
  next_action: "시각 이후 context-manager Claude queue를 병렬 실행하고 current hash 기준 strict verdict를 재집계한다."
```

## 40. GPU HPC 실행 경로·증거 Viz 폐쇄 (2026-08-01)

### 재구성 판단과 의도

기존 글은 GPU, NCCL, RoCEv2, scheduler를 개별적으로 설명했지만, 두 node 학습 job이 어떤 순서로 시작되고 어떤 증거로 성공을 판정하는지가 한 흐름으로 연결되지 않았다. 그러면 독자는 `100GbE가 있다`, `all-reduce 결과가 맞다`를 바로 HPC 성능 성공으로 착각할 수 있다.

이 배치의 핵심은 제품명 목록을 늘리는 것이 아니라 다음 두 계약을 분리하는 것이다.

```yaml
correctness_contract: "모든 rank가 같은 collective에 참여하고 같은 결과를 얻었는가"
performance_contract: "의도한 RDMA transport가 선택되고 기준 bandwidth·latency를 만족했는가"
execution_trace: "gang allocation → rendezvous → rank/GPU binding → NCCL communicator/transport → receipt"
```

출처는 PyTorch `torchrun`의 rank·rendezvous 계약, NVIDIA NCCL의 communicator·collective·logging·network troubleshooting, NVIDIA GPUDirect RDMA의 memory registration과 device DMA 경계로 나뉜다. 각 출처를 쓴 이유와 글 밖으로 미룬 범위는 `gpu-hpc-from-scratch/content-spec.md`에 기록했다.

### Viz 설계와 Hard-transfer oracle

```yaml
visual_system:
  before: "760px 고정 SVG 중심·8.5~11px label·mobile 축소와 오른쪽 clipping 위험"
  after: "HTML/CSS responsive flow·mobile 수직/desktop 수평·12px 이상·44px control·SVG text 0"
  scenarios: "정상 RDMA·Socket fallback·Rank 누락"
  evidence: "장면마다 owner, artifact, invariant, runtime receipt를 함께 표시"
problem_1: "WORLD_SIZE=8에서 rank 7이 없을 때 나머지 GPU와 network가 조용한 이유를 gang scheduling과 rendezvous로 설명한다."
problem_2: "all-reduce 정답이 맞아도 `NET/Socket`이면 RDMA 성능 계약은 실패임을 판단한다."
problem_3: "Ring all-reduce GPU당 통신량 `2(N-1)S/N`과 effective bandwidth로 통신 시간 하한을 계산한다."
problem_4: "MIG를 다중 inference tenant와 대형 collective job 중 어디에 검토할지 isolation과 topology trade-off로 판단한다."
```

### 검증과 배포 영수증

```yaml
build: "bun run build:tsc · pass · 8,596 modules"
focused_regression:
  local: "8/8 pass"
  production: "8/8 pass"
  scope: "bounded route·4 StepViz·3 FormulaNote·scenario causality·360/390/768/1440 responsive contract"
production_metrics: ".codex-tmp/gpu-hpc-redesign-2026-07-31/production-metrics.json"
measured: "document overflow 0 이하·clipped scene 0·minimum text 12px·minimum control 44px·KaTeX error 0·settled stage opacity 1"
visual_receipts:
  - ".codex-tmp/gpu-hpc-redesign-2026-07-31/mobile-scale.png"
  - ".codex-tmp/gpu-hpc-redesign-2026-07-31/desktop-scale.png"
  - ".codex-tmp/gpu-hpc-redesign-2026-07-31/production-mobile-socket-fallback.png"
  - ".codex-tmp/gpu-hpc-redesign-2026-07-31/production-desktop-socket-fallback.png"
deployment:
  restarted_at: "2026-08-01 00:05:18 KST"
  service: "cm-blog.service · active/running"
  main_pid: 1987046
  route: "https://heru.ragdoll-bigeye.ts.net/lab/blog/gpu/gpu-hpc-from-scratch"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  deferral_record: ".codex-tmp/claude-validation-deferral-2026-07-31.md"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer · active/waiting"
```

## 41. 초심자 첫 화면 계약 재작성 (2026-08-01)

### 왜 기존 진입부가 실패했는가

`systems-foundation-map`은 첫 문단에서 GPU HPC, Knowledge Compiler, Robot AI, RLVR, MoE streaming을 한꺼번에 제시한 뒤 같은 계보인지 물었다. `llm-pretraining-scaling`은 Pre-training을 설명하기 전에 4B와 9B 중 무엇을 고를지 물었다. 두 경우 모두 독자가 아직 만들지 못한 개념을 평가 문제의 전제로 사용했다. 질문 자체는 깊었지만 첫 페이지의 역할과 순서가 뒤집혀 있었다.

따라서 진입부의 공통 계약을 다음처럼 고정했다.

```yaml
beginner_entry_contract:
  1_familiar_scene: "택배 흐름이나 빈칸 맞히기처럼 이미 아는 장면에서 시작한다."
  2_plain_definition: "전문 용어를 쓰기 전에 무엇을 하는 단계인지 한 문장으로 말한다."
  3_small_execution_loop: "입력부터 결과까지 3개 안팎의 동작으로 먼저 따라간다."
  4_term_attachment: "이제 필요한 이름과 왜 필요한지를 붙인다."
  5_judgment_question: "독자가 판단 재료를 얻은 뒤에만 비교·설계 질문을 낸다."
prohibited_opening: "정의하지 않은 약어·제품·논문 이름을 나열하고 곧바로 비교를 요구하는 방식"
```

`BeginnerOpening`을 공통 컴포넌트로 만들고 두 글에 적용했다. systems 글은 택배의 들어오는 것, 남는 상태, 일하는 주체, 넘겨줄 때의 약속, 성공 판정을 찾은 뒤 AI 시스템의 다섯 질문으로 이동한다. Pre-training 글은 문장 빈칸 맞히기에서 token 예측, 오차 확인, 내부 숫자 수정으로 이동한 뒤 LLM, token, parameter, training budget을 정의한다. 4B·9B 질문은 그 다음에만 나온다.

### 출처·의도·Hard-transfer oracle

```yaml
systems_source_intent:
  purpose: "특정 기술의 계보를 주장하는 글이 아니라 처음 보는 시스템을 해체하는 관찰 순서를 제공한다."
  boundary: "각 분야의 수학·논문·구현은 공통 관점 뒤의 독립 경로에서 다룬다."
  spec: "src/pages/articles/ai/systems-foundation-map/content-spec.md"
pretraining_source_intent:
  purpose: "다음-token 예측이라는 첫 학습을 deployment-aware model·data budget 판단으로 연결한다."
  anchors: "Kaplan scaling law · Chinchilla compute-optimal training · 2026 test-time scaling/overtraining 질문"
  boundary: "Scaling law는 보편 정답이 아니라 자신의 tokenizer·data·optimizer로 다시 측정할 pilot 좌표다."
  spec: "src/pages/articles/ai/llm-pretraining-scaling/content-spec.md"
problem_1: "처음 보는 document AI runtime에서 어디를 먼저 볼 것인가?"
required_1: "입력, 남는 state, compute owner, boundary contract, verification signal을 찾아 이후에 읽을 논문과 구현 범위를 좁힌다."
problem_2: "같은 학습 예산에서 9B가 4B보다 항상 안전한가?"
required_2: "아니다. N이 커지면 token당 계산·weight memory가 늘어 같은 compute에서 D가 줄며, inference demand와 고유 corpus 반복까지 같은 원장에서 비교해야 한다."
problem_3: "Pre-training이 instruction following과 동일한가?"
required_3: "아니다. Pre-training은 광범위한 다음-token 예측 기반을 만들고, instruction tuning과 RL은 그 뒤에 사용자 요구에 반응하는 방식을 조정한다."
```

### UI 교정과 검증 영수증

초심자 서사만 바꾸고 작은 조작부를 남기지 않았다. 학습 예산 Viz의 6열 배치를 3열로 바꾸고 segmented control에 44px 최소 폭을 부여했다. Range input도 44px 높이의 조작 영역을 확보했다. 카테고리의 10~11px 단계 라벨은 12px로 올리고, 모바일에서 핵심 연결 설명을 숨기던 title·summary clamp를 제거했다.

```yaml
build: "bun run build:tsc · pass · 8,596 modules"
focused_regression:
  local: "12/12 pass"
  production: "12/12 pass"
  scope: "초심자 DOM 순서·4 viewport pre-training budget·run gate·bounded category route·KaTeX fit"
responsive_receipts:
  local: ".codex-tmp/beginner-entry-redesign-2026-08-01/local-metrics.json"
  production: ".codex-tmp/beginner-entry-redesign-2026-08-01/production-metrics.json"
measured: "systems·pretraining·pretraining category × 390/1440 · document overflow 0 · clipped text 0 · minimum text 12px · minimum control 44px · console error 0"
visual_receipts:
  - ".codex-tmp/beginner-entry-redesign-2026-08-01/production-systems-mobile.png"
  - ".codex-tmp/beginner-entry-redesign-2026-08-01/production-systems-desktop.png"
  - ".codex-tmp/beginner-entry-redesign-2026-08-01/production-pretraining-mobile.png"
  - ".codex-tmp/beginner-entry-redesign-2026-08-01/production-pretraining-desktop.png"
  - ".codex-tmp/beginner-entry-redesign-2026-08-01/production-pretraining-category-mobile.png"
deployment:
  restarted_at: "2026-08-01 00:30:08 KST"
  service: "cm-blog.service · active/running"
  main_pid: 2017265
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  deferral_record: ".codex-tmp/claude-validation-deferral-2026-07-31.md"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer · active/waiting"
```

## 42. 전체 초심자 진입부 감사와 Wave A 재작성 (2026-08-01)

### 탐지 결과를 곧바로 결함 수로 쓰지 않은 이유

305개 AI 경로를 실제 브라우저로 열고 첫 `QuestionLead` 앞에 설명이 있는지 검사했다. 216개 글이 같은 section 안에 선행 설명이 없었지만, 이것은 결함 수가 아니다. “입력 하나를 조금 바꾸면 결과는 얼마나 움직일까?”처럼 일상적인 질문은 설명 없이도 좋은 출발점이다. 반면 `744B`, `VLA`, `RL compute`, `DiT`, `Pod·TTFT`를 아는지부터 시험하는 질문은 경로의 첫 글로 부적합하다.

두 감사 snapshot에서 학습 경로의 첫 글로 잡힌 56개를 다음 네 부류로 수동 분류했다.

```yaml
entry_triage:
  keep_question_led: 14
  add_short_plain_bridge: 18
  define_prerequisites_first: 18
  specialist_or_source_route: 6
audit_spec: "knowledge/authoring/2026-08-01-beginner-entry-narrative-audit.md"
audit_receipt: ".codex-tmp/beginner-entry-narrative-audit-2026-08-01.json"
```

Wave A는 독자 영향이 큰 여섯 글로 한정했다. `animation-production-workflow`, `moe-ssd-streaming`, `reasoning-post-training-frontier`, `robot-ai-top-down`, `dit-flow-matching-evaluation`, `knowledge-compiler`가 대상이다. 모든 글에서 기존 논문·수식·Viz의 깊이는 유지하고 첫 화면만 `익숙한 장면 → 최소 용어 → 판단 질문 → 깊은 본문` 순서로 바꿨다.

### 글별 추론과 의도

```yaml
animation:
  familiar_scene: "단체 사진 한 장 고르기와 7초 장면의 연속성 비교"
  terms_before_question: "shot·character continuity·release evidence"
moe_streaming:
  familiar_scene: "도서관 전체 장서와 지금 책상에 올린 책"
  terms_before_question: "parameter·B·RAM·SSD·router"
reasoning:
  familiar_scene: "최종 답만 채점받은 학생의 오류 위치 찾기"
  terms_before_question: "post-training·RL·RL compute·Chain of Thought·search"
robot_ai:
  familiar_scene: "내비게이션 지시와 실제 조향·제동의 차이"
  terms_before_question: "VLA·action candidate·state·plan·control·feedback"
dit_flow:
  familiar_scene: "자동차 구조와 목적지까지의 경로는 다른 선택"
  terms_before_question: "noise correction·DiT backbone·Flow Matching objective"
knowledge_compiler:
  familiar_scene: "회의 자료에서 출처를 다시 찾을 수 있는 보고서 만들기"
  terms_before_question: "source address·structure·claim/evidence·retrieval·maintenance"
```

### 오탐과 UI 결함을 분리한 방법

KaTeX의 분수와 위첨자는 내부 span의 `scrollHeight`가 의도적으로 커서 단순 DOM 검사에서 클리핑으로 보일 수 있다. 따라서 `.katex` 내부는 별도 `katex-error`와 문서 overflow로 검사하고, 일반 텍스트는 실제 `overflow: hidden|clip|auto|scroll`일 때만 클리핑으로 판정했다. DiT Viz의 `3 / 5` 진행 표시는 브라우저·폰트 조합에 따라 잘리지 않도록 44px 최소 높이, baseline 정렬과 정상 행간을 명시했다.

### 검증과 공개 배포 영수증

```yaml
build: "bun run build:tsc · pass · 8,596 modules"
entry_regression:
  local: "9/9 pass"
  production: "9/9 pass"
  checks: "도입부가 첫 질문보다 앞섬·경로별 핵심 정의 노출·horizontal overflow 없음"
responsive_receipts:
  local: ".codex-tmp/beginner-entry-wave-a-2026-08-01/local-metrics.json"
  production: ".codex-tmp/beginner-entry-wave-a-2026-08-01/production-metrics.json"
measured: "6 routes × 390/1440 · document overflow 0 · clipped text 0 · minimum text 12px · minimum control 44px · KaTeX error 0 · console error 0"
deployment:
  restarted_at: "2026-08-01 00:54:29 KST"
  service: "cm-blog.service · active/running"
  main_pid: 2044581
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  deferral_record: ".codex-tmp/claude-validation-deferral-2026-07-31.md"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer · active/waiting"
```

## 43. 초심자 진입부 Wave B1: Agent·Serving·On-device 실행 경로 (2026-08-01)

### 왜 여섯 글을 같은 묶음으로 고쳤는가

이 여섯 글은 모두 모델의 내부 원리보다 “모델 밖에서 작업을 실제로 끝내는 과정”을 다룬다. 기존 첫 질문은 harness, framework ownership, INT4·OOM, prefill·decode, Pod·TTFT, checkpoint·delegate처럼 독자가 아직 배우지 않은 운영 용어를 이미 안다고 가정했다. 글의 깊이는 충분했지만, 첫 화면이 설명이 아니라 면접 문제처럼 작동했다.

따라서 기술 내용을 줄이지 않고 읽는 순서만 다음 계약으로 바꿨다.

```yaml
runtime_entry_contract:
  1_familiar_scene: "직원과 업무 공간, 이삿짐 압축, 식당 주방, 마트 계산대, 설계도와 실제 기계처럼 이미 아는 장면을 제시한다."
  2_minimum_terms: "각 장면에 model·tool·framework·memory·prefill·decode·Pod·checkpoint 같은 이름을 한 개씩 붙인다."
  3_execution_order: "입력, 실행 준비, 실제 처리, 실패·복구 또는 release 판정을 순서대로 보여 준다."
  4_judgment_question: "이제 같은 자원·오류·배포 조건을 주고 무엇을 먼저 의심할지 묻는다."
  5_existing_depth: "ConceptPrimer, interactive Viz, 구현 계약, 원문 출처와 검증 질문은 그대로 이어 간다."
```

### 글별 추론과 의도

```yaml
agent_runtime:
  familiar_scene: "직원이 답안을 쓰는 것과 회사 시스템에서 실제 일을 끝내는 것의 차이"
  terms_before_question: "model·prompt·tool·harness·workspace"
  judgment: "같은 model과 지시에서도 tool 오류가 전체 작업 실패가 되는 원인을 runtime layer에서 찾는다."
agent_frameworks:
  familiar_scene: "배송 틀이 경로를 제공해도 분실·재시도 책임자를 대신 정하지는 못한다."
  terms_before_question: "agent framework·state·retry·approval·ownership"
compression:
  familiar_scene: "이삿짐 부피를 줄였지만 자주 꺼낼 물건이 깊이 묻혀 생활이 느려지는 장면"
  terms_before_question: "model lightweighting·INT4·OOM·runtime memory"
disaggregated_serving:
  familiar_scene: "식당에서 주문 전체를 읽고 준비하는 일과 한 접시씩 계속 내는 일"
  terms_before_question: "prefill·decode·TTFT·TPOT·throughput"
serving_ops:
  familiar_scene: "계산대 수를 정한 것과 실제 직원·전원·준비 상태가 갖춰진 계산대 수의 차이"
  terms_before_question: "Pod·GPU allocation·readiness·TTFT"
on_device:
  familiar_scene: "설계도와 재료만으로 휴대폰에서 움직이는 완제품이 되지는 않는 장면"
  terms_before_question: "checkpoint·4B·INT4·export·delegate·sustained trace"
```

### UI 결함을 함께 닫은 이유

온디바이스 Viz의 backend segmented control은 눈으로는 보였지만 실제 높이가 36px였다. 초심자 진입 서사를 고치면서 첫 interactive control이 모바일에서 작은 목표로 남으면 학습 흐름 자체가 끊긴다. 공용 `Choice`의 최소 높이를 44px로 올리고 같은 화면 측정을 다시 수행했다.

### 검증과 공개 배포 영수증

```yaml
build: "bun run build:tsc · pass · 8,596 modules"
entry_regression:
  local: "15/15 pass"
  production: "15/15 pass"
  checks: "도입부가 첫 질문보다 앞섬·경로별 핵심 정의 노출·horizontal overflow 없음"
audit_delta:
  unsupported_learning_path_entry: "50 → 44"
  broad_unsupported_question: "216 → 210"
responsive_receipts:
  local: ".codex-tmp/beginner-entry-wave-b1-2026-08-01/local-metrics.json"
  production: ".codex-tmp/beginner-entry-wave-b1-2026-08-01/production-metrics.json"
measured: "6 routes × 390/1440 · document overflow 0 · clipped text 0 · minimum text 12px · minimum control 44px · KaTeX error 0 · console error 0"
deployment:
  restarted_at: "2026-08-01 01:09:09 KST"
  service: "cm-blog.service · active/running"
  main_pid: 2059944
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  deferral_record: ".codex-tmp/claude-validation-deferral-2026-07-31.md"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer · active/waiting"
```

## 44. 초심자 진입부 Wave B2: 해석·한국어·RL·Vision 표현 (2026-08-01)

### 공통 문장 틀 대신 각 분야의 핵심 대비를 찾은 방법

Wave B2의 일곱 글은 전문 용어만 서로 다른 것이 아니다. 독자가 처음 붙잡아야 할 대비가 각기 다르므로 같은 비유를 반복하지 않았다. 기존 첫 질문과 첫 수식을 역으로 읽어 “이 글을 끝까지 이해한 사람이 구분할 수 있어야 하는 두 대상”을 찾고, 그 차이가 드러나는 일상 장면을 앞에 놓았다.

```yaml
interpretability:
  core_contrast: "내부에서 읽힌 흔적 vs 원 모델이 실제 답에 사용한 원인"
  familiar_scene: "학생 풀이 메모에서 단어를 찾는 것과 그 계산을 지웠을 때 답이 바뀌는 것"
korean_consistency:
  core_contrast: "최종 답의 언어 혼합 vs 전체 언어 전환 vs 노출된 중간 풀이 언어"
  familiar_scene: "고객 안내문과 내부 업무 메모의 언어 문제가 서로 다른 경우"
rl_decision_and_mdp:
  core_contrast: "고정 입력의 정답 맞히기 vs 지금 행동이 다음 관찰·선택지·수집 data를 바꾸는 폐루프"
  familiar_scene: "문을 열면 다음 방과 열쇠가 달라지는 미로"
pomdp:
  core_contrast: "sensor가 보여 준 observation vs 직접 보이지 않는 world state"
  familiar_scene: "모양이 같은 두 복도에서 지나온 길에 따라 반대 방향으로 돌아야 하는 상황"
ppo:
  core_contrast: "좋은 경험을 배우기 vs 그 경험이 무효가 될 만큼 policy를 크게 바꾸기"
  familiar_scene: "한 번 장애물을 피한 큰 조향을 모든 비슷한 장면에 과도하게 반복하는 운전"
vision_encoder:
  core_contrast: "사진 전체 의미를 담은 한 vector vs 각 위치가 남은 feature grid"
  familiar_scene: "바닷가 사진 검색과 작은 사람 모두에게 상자를 그리는 작업"
```

### 수식 검증에서 오탐을 제거한 이유

KaTeX는 화면에 보이는 HTML과 접근성용 MathML을 함께 만든다. `role="math"` 래퍼의 숨겨진 MathML은 의도적으로 overflow가 생길 수 있어 일반 텍스트 클리핑으로 세면 수식이 정상이어도 실패한다. 화면 캡처로 POMDP와 PPO 식을 확인한 뒤 검증기에서 `.katex`와 `role="math"`를 별도 영역으로 분리했다. 수식 실패는 `katex-error`, 문서 overflow와 실제 캡처로 계속 판정한다. 반면 실제로 10px였던 interpretability 영문 라벨과 공통 citation 번호는 12px로 올렸다.

### 검증과 공개 배포 영수증

```yaml
build: "bun run build:tsc · pass · 8,596 modules"
entry_regression:
  local: "22/22 pass"
  production: "22/22 pass"
audit_delta:
  unsupported_learning_path_entry: "44 → 37"
  broad_unsupported_question: "210 → 201"
responsive_receipts:
  local: ".codex-tmp/beginner-entry-wave-b2-2026-08-01/local-metrics.json"
  production: ".codex-tmp/beginner-entry-wave-b2-2026-08-01/production-metrics.json"
measured: "7 routes × 360/390/768/1440 · document overflow 0 · clipped text 0 · minimum text 12px · minimum control 44px · KaTeX error 0 · console error 0"
deployment:
  restarted_at: "2026-08-01 01:23:52 KST"
  service: "cm-blog.service · active/running"
  main_pid: 2075946
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  deferral_record: ".codex-tmp/claude-validation-deferral-2026-07-31.md"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer · active/waiting"
```

## 45. 초심자 진입부 Wave C: 좋은 질문 앞의 최소 브리지 (2026-08-01)

### 질문을 없애지 않고 한 장면만 앞에 둔 이유

Wave C의 글은 첫 질문이 잘못된 것이 아니라 질문에 들어 있는 단위나 제품 책임을 독자가 아직 모른다는 문제가 있었다. 질문을 쉬운 설명으로 대체하면 글의 핵심 판별력이 사라진다. 따라서 기존 질문은 유지하고, 독자가 그 질문을 읽는 데 필요한 가장 작은 장면과 명사만 `BeginnerBridge`로 앞에 두었다.

```yaml
unit_bridges:
  audio: "sample rate와 audio frame은 1초를 몇 조각으로 읽는가"
  time_series: "겹치는 window는 서로 독립된 새 기록이 아니다"
pipeline_bridges:
  stable_diffusion: "checkpoint가 아니라 text encoder·latent·denoiser·scheduler·VAE의 실행선"
  training: "weight 외 optimizer·schedule·data order·RNG·progress가 있어야 resume 가능"
product_contract_bridges:
  detection: "고정 vocabulary와 실행 중 문장으로 찾는 open vocabulary"
  document_ai: "글자 전사와 구조·근거 보존은 다른 성공 조건"
  speech: "인식·대화 판단·음성 생성·실시간 제어의 실패 책임 분리"
  generation: "모델 이름보다 생성·편집·video·deployment 목표와 실패 기준"
representation_bridges:
  tokenizer: "문자열 조각을 ID로 바꿀 때 vocabulary 크기와 sequence 길이의 절충"
  world_model: "그럴듯한 다음 화면과 action 이후 물리 결과 예측의 차이"
```

### 시각 감사가 본문 수정으로 이어진 지점

첫 브리지만 확인하지 않고 같은 첫 섹션의 Viz까지 렌더링했다. 이 과정에서 `llm-architecture-gallery`의 수식 단계 번호가 11px, `object-detection-systems`의 흐름과 evidence 라벨이 9–10px인 것을 찾았다. 해당 컴포넌트의 반응형 예외를 제거하고 모두 12px 이상으로 올린 뒤 68개 화면을 다시 캡처했다. 즉 Wave C는 문장 순서뿐 아니라 그 문장 다음에 실제로 읽게 되는 시각 설명의 가독성까지 같은 완료 조건으로 다뤘다.

### 검증과 공개 배포 영수증

```yaml
build: "bun run build:tsc · pass · 8,596 modules"
entry_regression:
  local: "39/39 pass"
  production: "39/39 pass"
audit_delta:
  unsupported_learning_path_entry: "37 → 19"
  broad_unsupported_question: "201 → 184"
  loaded_routes: "305/305"
responsive_receipts:
  local: ".codex-tmp/beginner-entry-wave-c-2026-08-01/local-metrics.json"
  production: ".codex-tmp/beginner-entry-wave-c-2026-08-01/production-metrics.json"
measured: "17 routes × 360/390/768/1440 · local 68/68 zero-failure · production 68/68 zero-failure"
checks: "document overflow · clipped text · minimum text 12px · minimum control 44px · KaTeX error · console error"
deployment:
  restarted_at: "2026-08-01 01:45:28 KST"
  service: "cm-blog.service · active/running"
  main_pid: 2101022
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  deferral_record: ".codex-tmp/claude-validation-deferral-2026-07-31.md"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer · active/waiting"
```

## 46. 전문·원문 경로 Wave D: 초보 설명 대신 선행 소유권을 드러내기 (2026-08-01)

### 왜 같은 초보 브리지를 반복하지 않았나

Claw의 설정·권한·worker·task 글과 Word2Vec 원문 재구성은 각각 독립된 조사 질문을 가진 전문 글이다. 여기서 Agent나 embedding을 다시 처음부터 설명하면 글마다 같은 기초 문단이 복제되고, 어느 글이 개념의 기준 설명인지도 흐려진다. 대신 첫 질문 전에 세 가지를 고정하는 `SpecialistEntry` 계약을 만들었다.

```yaml
specialist_entry_contract:
  scope: "이 글이 새로 검산하는 코드·논문 범위"
  assumptions: "본문이 이미 안다고 가정하는 최소 개념"
  ownership_links: "각 가정을 실제로 설명하는 선행 아티클과 읽어야 하는 이유"
  order: "범위 → 가정 → 선행 링크 → 진단 질문 → 원문·코드 증거"
```

다섯 Claw 글은 Agent runtime, session, tool schema, executor, worker lifecycle 가운데 자기 질문에 필요한 선행만 연결했다. Word2Vec 논문 글은 분포 가설·공기와 embedding lookup·cosine을 선행으로 연결했다. 따라서 독자는 모르는 말을 만났을 때 전체 계보를 다시 내려갈 필요 없이 정확한 소유 글 하나로 이동할 수 있고, 이미 아는 독자는 곧바로 원문 질문으로 진행할 수 있다.

### 구조 검출기와 실제 완료 판정을 분리한 이유

브라우저 감사기의 `unsupportedQuestion`은 같은 section 안에 평문이 있는지만 보는 넓은 후보 검출기다. 전문 진입 계약처럼 section 밖의 명시적 선행 블록이나 custom shell은 오탐이 될 수 있다. 그래서 수치 감소는 범위 축소 지표로만 사용하고, 완료는 각 route에서 `SpecialistEntry`가 첫 `QuestionLead`보다 앞에 있는지, 선행 링크가 실제로 보이는지, 모바일에서 잘리지 않는지를 Playwright로 판정했다.

### 검증과 공개 배포 영수증

```yaml
build: "bun run build:tsc · pass · 8,596 modules"
specialist_entry_regression:
  local: "6/6 pass"
  production: "6/6 pass"
  checks: "전문 범위·가정·선행 링크 노출 · 첫 질문보다 앞섬 · 390px horizontal overflow 없음"
audit_delta:
  unsupported_learning_path_entry: "19 → 14"
  broad_unsupported_question: "184 → 177"
  loaded_routes: "305/305"
responsive_receipts:
  local: ".codex-tmp/specialist-entry-wave-d-2026-08-01/local-metrics.json"
  production: ".codex-tmp/specialist-entry-wave-d-2026-08-01/production-metrics.json"
measured: "6 routes × 360/390/768/1440 · local 24/24 zero-failure · production 24/24 zero-failure"
checks: "document overflow · clipped text · minimum text 12px · console error"
source_page_polish: "Task control-plane label·step·code excerpt의 9–11px 표기를 12px로 상향"
deployment:
  restarted_at: "2026-08-01 02:00:19 KST"
  service: "cm-blog.service · active/running"
  main_pid: 2119261
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  deferral_record: ".codex-tmp/claude-validation-deferral-2026-07-31.md"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer · active/waiting"
```

## 47. 전체 AI 수식·반응형 Wave E: 의미를 보존한 모바일 식과 운영 전수 검사 (2026-08-01)

### 왜 AI 경로만 분리해 다시 감사했나

전체 블로그 감사에는 아직 이번 작업 범위가 아닌 crypto·blockchain의 오래된 페이지가 함께 잡혀 원인을 흐렸다. 이번 완료 조건은 AI 학습 경로의 실제 품질이므로 `/lab/blog/ai/` 아래 305개 route를 별도 모집단으로 고정했다. 앞선 레이아웃 수정 뒤 남은 37건은 모두 390px 화면의 `formula-overflow`였고, 일반 문서 overflow·잘린 text·작은 label·control 크기 문제는 0건이었다.

### 수식을 작게 축소하지 않고 다시 조판한 기준

긴 식을 CSS로 축소하면 식은 상자 안에 들어가도 첨자와 한국어 주석을 읽을 수 없다. 따라서 desktop의 완전한 식은 보존하고 mobile에는 같은 논리를 의미 단위의 여러 행으로 나눈 compact 식을 제공했다.

```yaml
formula_contract:
  desktop: "논문의 완전한 식과 underbrace annotation을 보존"
  mobile: "계산 순서·조건·결론을 의미 단위 행으로 분리"
  minimum_visible_text: "12px"
  forbidden_fix: "transform scale이나 극단적 font-size로 억지 축소"
  shared_api: "latexCompact 또는 formulaCompact"
  global_case: "공통 한국어 annotation registry가 원인이면 개별 글이 아니라 registry에서 수정"
```

Perceptron·Backprop·FFT·Seq2Seq·BERT와 로봇의 planning·localization·control·trajectory·runtime·motor drive·camera calibration·power electronics 식에 compact 표현을 추가했다. Stable Diffusion MMDiT, animation evaluation, training snapshot, Illustrious XL, DeZero dropout처럼 article 안에서 직접 조판한 식도 같은 원칙으로 나눴다. 이때 수식의 항을 삭제하지 않고 desktop과 mobile이 같은 주장과 계산 순서를 갖는지 먼저 대조했다.

### 검증과 공개 배포 영수증

```yaml
baseline:
  scope: "AI 305 routes × desktop/mobile = 610 checks"
  surfaces: 1984
  svgs: 358
  formulas: 3348
  errors: 37
  warnings: 0
  remaining_error_type: "mobile formula-overflow only"
targeted_regression:
  scope: "24 affected routes × desktop/mobile"
  progression: "37 → 1 → 0 errors"
local_full_audit:
  report: ".codex-tmp/all-ai-viz-wave-e-final-2026-08-01.json"
  result: "305 routes · 610 checks · 1,984 surfaces · 358 SVGs · 3,348 formulas · 0 errors · 0 warnings"
build:
  command: "bun run build:tsc"
  result: "pass · 8,596 modules"
  diff_check: "git diff --check · pass"
deployment:
  restarted_at: "2026-08-01 12:56:02 KST"
  service: "cm-blog.service · active/running"
  response: "https://heru.ragdoll-bigeye.ts.net/lab/blog/ · HTTP 200"
production_full_audit:
  report: ".codex-tmp/all-ai-viz-wave-e-production-2026-08-01.json"
  result: "305 routes · 610 checks · 1,984 surfaces · 358 SVGs · 3,348 formulas · 0 errors · 0 warnings"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  deferral_record: ".codex-tmp/claude-validation-deferral-2026-07-31.md"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer"
```

이 단계의 `0 errors`는 내용이 충분히 깊다는 판정이 아니다. 화면에서 읽을 수 있고 수식이 잘리지 않는다는 기계적 기반을 닫은 것이다. 다음 단계에서는 각 글의 첫 1~2개 section을 독자가 실제로 읽는 순서대로 감사해, 정의되지 않은 명사·성급한 진단 질문·설명 없이 등장하는 수식·앞 글과의 연결 단절을 별도로 고친다.

## 48. 초심자 서사 Wave F–G: 질문을 지우지 않고 질문에 도달할 길 만들기 (2026-08-01)

### 문제를 어떻게 판정했나

구조상 `QuestionLead`가 있다는 사실만으로는 친절한 글이 되지 않는다. 첫 질문에 아직 설명하지 않은 제품명·약어·수학 단위가 들어가면 독자는 질문의 답을 고민하기 전에 “이 단어가 무엇인가”에서 멈춘다. 반대로 쉬운 질문까지 모두 긴 입문 카드로 덮으면 글마다 같은 설명이 반복된다. 그래서 첫 질문 앞의 필요한 지원을 세 종류로 나눴다.

```yaml
entry_decision:
  beginner_opening:
    use_when: "학습 경로의 첫 글이거나 분야의 첫 개념을 정의하는 글"
    content: "생활 장면 → 최소 명사 → 이 글에서 따라갈 3단계"
  beginner_bridge:
    use_when: "질문 자체는 쉬우나 질문의 목적을 보여 줄 한 장면이 필요한 글"
    content: "익숙한 장면 하나 → 기술 질문과 연결하는 한 문단"
  specialist_entry:
    use_when: "논문·코드·runtime·고급 architecture를 검산하는 글"
    content: "이 글의 범위 → 이미 안다고 가정하는 것 → 실제 선행 글과 읽는 이유"
  forbidden:
    - "모든 글에 같은 초보 문구 복사"
    - "전문 질문을 쉬운 질문으로 바꿔 검산 깊이 제거"
    - "자동 탐지 점수만 보고 본문 의미를 읽지 않은 일괄 수정"
```

### 적용 범위와 학습 경로 기준선

10개 분야 진입 글에는 `BeginnerOpening`, 9개 일반 개념·운영 글에는 `BeginnerBridge`, 18개 논문·runtime·고급 구조 글에는 `SpecialistEntry`를 두었다. `systems-foundation-map`과 `llm-pretraining-scaling`에서 먼저 적용한 원칙을 AI foundation, multimodal, OCR, RAG, Robot AI, LLM architecture·serving과 agent 경로까지 확장했다.

```yaml
implemented:
  beginner_opening_routes: 10
  beginner_bridge_routes: 9
  specialist_entry_routes: 18
  total_routes: 37
learning_path_entry_audit:
  first_reliable_baseline: "8 unsupported entries"
  intermediate: "2 unsupported entries"
  closure: "0 unsupported entries · 305/305 routes loaded · concurrency 1"
specialist_p0_audit:
  closure_run: "vllm-spec-decode 1건만 남음"
  final_targeted_check: "SpecialistEntry와 QuestionLead 모두 존재 · entry가 question보다 앞섬 · 390px overflow 0"
broad_candidate_note: "일반 QuestionLead 후보 119건은 자동 수정하지 않는다. 질문 전 문맥이 실제로 부족한지는 다음 본문 재구성에서 의미 단위로 판정한다."
```

전수 진입 감사기는 `.codex-tmp/audit-beginner-entry-narrative.mjs`로 남겼다. 동시 lazy route 로딩이 결과를 흔들지 않도록 기본 concurrency를 2로 낮추고, 종료 감사는 1로 실행했다. 또한 첫 질문보다 앞선 `data-specialist-entry`를 정상적인 선행 설명으로 인식하도록 했다. 이 감사는 후보를 좁히는 장치이지 글의 교육 품질을 최종 판정하는 evaluator가 아니다.

### 작은 모델이 재현할 때의 결정 순서

```yaml
small_model_recipe:
  1_collect: "route의 첫 QuestionLead, 앞선 문단·Viz·BeginnerOpening·SpecialistEntry와 학습 rail 위치를 추출"
  2_classify: "route entry / general concept / specialist source 중 하나만 선택"
  3_write: "일상 장면 또는 선행 소유권을 해당 분야 명사로 구체화"
  4_preserve: "기존 진단 질문, 원문 claim, 수식과 구현 trace는 삭제하지 않음"
  5_validate_order: "지원 블록이 첫 질문보다 실제 DOM 순서상 앞인지 확인"
  6_validate_layout: "360px와 1440px에서 overflow, clipped text, 12px 미만 text, KaTeX와 console error 확인"
  7_stop: "학습 경로 첫 글 0건 + 고급 P0 0건이면 광범위 P1을 기계적으로 계속 고치지 않음"
```

### 검증과 공개 배포 영수증

```yaml
build:
  command: "bun run build:tsc"
  result: "pass · 8,596 modules"
  diff_check: "git diff --check · pass"
local_entry_audit:
  report: ".codex-tmp/beginner-entry-narrative-wave-g-closure-2026-08-01.json"
  result: "305/305 routes loaded · unsupported learning-path entry 0 · load failure 0"
local_targeted_visual:
  reports:
    - ".codex-tmp/beginner-entry-wave-g-targeted-viz-2026-08-01.json"
    - ".codex-tmp/vllm-spec-decode-entry-viz-2026-08-01.json"
  aggregate: "37 routes · 74 checks · 206 surfaces · 12 SVGs · 336 formulas · 0 errors · 0 warnings"
local_targeted_narrative:
  reports:
    - ".codex-tmp/beginner-entry-wave-g-targeted-narrative-2026-08-01.json"
    - ".codex-tmp/vllm-spec-decode-entry-narrative-2026-08-01.json"
  aggregate: "37 routes · 74 checks · 14 StepViz · 206 visual surfaces · 0 errors · 0 warnings"
deployment:
  restarted_at: "2026-08-01 13:46:18 KST"
  service: "cm-blog.service · active/running"
  main_pid: 432860
  response: "https://heru.ragdoll-bigeye.ts.net/lab/blog/ · HTTP 200"
production_targeted_visual:
  report: ".codex-tmp/beginner-entry-wave-g-production-viz-2026-08-01.json"
  result: "37 routes · 74 checks · 206 surfaces · 12 SVGs · 336 formulas · 0 errors · 0 warnings"
production_targeted_narrative:
  report: ".codex-tmp/beginner-entry-wave-g-production-narrative-2026-08-01.json"
  result: "37 routes · 74 checks · 14 StepViz · 206 visual surfaces · 0 errors · 0 warnings"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
  deferral_record: ".codex-tmp/claude-validation-deferral-2026-07-31.md"
  timer: "cm-blog-claude-ai-learning-closure-retry.timer"
```

이번 Wave의 종료는 전체 아티클 재구성이 끝났다는 뜻이 아니다. 화면과 첫 진입 순서의 공통 결함을 먼저 닫은 것이다. 이후 재구성은 최신 목표에서 출발해 각 글의 본문을 읽고, 정의 → 직관 → 수식 → 원문 증거 → 구현 → 실패 경계가 실제로 이어지는지 판단하는 의미 기반 작업으로 진행한다.

## 49. 목표 우선 IA 정리와 Foundation 첫 문단 보강 (2026-08-01)

### 왜 정보 구조를 다시 바꿨나

`systems-foundation-map`은 낯선 시스템을 읽는 유용한 도구지만, 독자가 AI를 배우기 전에 반드시 통과해야 하는 첫 과목은 아니다. 이를 `00 공통 읽기 프레임`으로 맨 앞에 두면 GPU HPC·Knowledge Compiler·Robot AI·RLVR 같은 아직 정의하지 않은 단어가 첫 화면에 쏟아진다. 따라서 학습 순서는 **목표 분야 → 필요한 공통 기반 → 구현 허브**로 단순화하고, 읽기 프레임은 막혔을 때 여는 선택 도구로 분리했다.

```yaml
information_architecture:
  primary_sequence:
    - "01 목표 분야"
    - "02 공통 보강 자료"
    - "03 공통 구현 허브"
  optional_guide:
    label: "필요할 때만 여는 읽기 도구"
    article: "systems-foundation-map"
    reason: "학습의 출발점이 아니라, 처음 보는 기술에서 입력·상태·계산·경계·검증을 찾는 보조 도구"
  current_first_map:
    before: "Agent와 LLM 두 경로를 임의로 '여기서 시작'에 고정"
    after: "20개 최신 목표 경로를 언어·지식 / 멀티모달 / 인지·생성 / 행동·예측 묶음 안에 모두 배치"
```

`ocr-document-ai-map`은 실제 운영 경로 소유권을 유지하고, Donut 논문만 source-paper spine으로 바로잡았다. 변경 뒤 305개 글의 core article 소유권, 연결 참조, 선언된 learning path를 다시 비교해 미소유 글·깨진 참조·경로 불일치를 모두 0으로 닫았다.

### 질문 앞에 무엇을 더했나

Foundation 글의 질문을 없애지 않았다. 대신 독자가 질문의 목적부터 이해하도록, 각 개념과 직접 대응하는 생활 장면 한 개만 앞에 놓았다.

```yaml
foundation_bridges:
  perceptron: "여러 근거에 점수를 주고 예·아니오를 결정"
  activation_functions: "값과 학습 신호를 통과시키거나 막는 문지기"
  cross_entropy: "정답은 같아도 90%와 51% 확신의 품질은 다름"
  backpropagation: "최종 조립 오차에서 어느 나사를 조절할지 역추적"
  optimizers: "내리막 방향과 별개로 보폭·관성을 선택"
  training_step: "한 영수증 번호로 forward부터 update까지 같은 값을 추적"
  autoencoder: "긴 메모를 압축한 뒤 원래 뜻을 복원"
```

이 문단들은 범용적인 “쉽게 알아봅시다” 문구가 아니다. 바로 다음 `QuestionLead`에서 쓰는 판단 구조를 일상 장면으로 먼저 실행하게 한다. 이후의 수식·Viz·검증 질문은 그대로 유지했다.

### Pre-training 진입 글을 다시 판정한 근거

사용자가 지적한 `llm-pretraining-scaling`은 현재 버전에서 이미 다음 토큰 맞히기로 pre-training을 먼저 정의하고, 그 뒤에 4B/9B 선택 문제를 제시한다. 그래서 질문만 더 쉽게 바꾸지 않고 본문의 2024–2026 claim을 원문으로 재검증했다.

```yaml
source_checks:
  chinchilla: "고정 training compute에서 parameter와 token을 함께 배분하는 기준"
  beyond_chinchilla_2024: "반복 inference demand가 크면 더 작은 모델을 더 오래 학습하는 선택이 가능"
  data_constrained_2023: "고유 데이터가 제한된 반복 학습과 9B 실험의 공개 기준"
  test_time_scaling_2026: "N·D와 test-time sample을 함께 최적화하는 최신 preprint"
  data_constrained_2026: "반복 데이터에서 model·data interaction과 regularization을 다루는 최신 preprint"
  epistemic_rule: "2026 preprint는 현재 연구로 표시하고 production 보편 법칙으로 승격하지 않음"
```

### 검증 영수증

```yaml
static_graph:
  report: ".codex-tmp/ai-learning-graph-after-ia-restructure-2026-08-01.json"
  result: "305 articles · unresolved reference 0 · unowned core 0 · declared path mismatch 0"
local_ia_browser:
  reports:
    - ".codex-tmp/ai-information-architecture-after-goal-first-2026-08-01.json"
    - ".codex-tmp/ai-goal-first-browser-2026-08-01.json"
  result: "mobile/desktop · 목표/기반/구현 순서 · optional guide 분리 · 20/20 current-first tracks · overflow 0 · runtime error 0"
foundation_targeted_browser:
  scope: "7 routes × 390/1440 = 14 checks"
  result: "BeginnerBridge before QuestionLead 14/14 · body/article overflow 0 · runtime error 0"
  screenshots:
    - ".codex-tmp/perceptron-beginner-bridge-mobile-2026-08-01.png"
    - ".codex-tmp/backprop-optimization-beginner-bridge-mobile-2026-08-01.png"
build:
  command: "bun run build:tsc"
  result: "pass"
  diff_check: "git diff --check · pass"
deployment:
  restarted_at: "2026-08-01 14:04:10 KST"
  service: "cm-blog.service · active/running"
  main_pid: 456528
  response: "https://heru.ragdoll-bigeye.ts.net/lab/blog/ · HTTP 200"
production_targeted_browser:
  scope: "AI root + current-first map + 7 foundation routes · 390/1440"
  result: "target/foundation/build 3 stages · optional guide 1 · current-first tracks 20/20 · bridge order 14/14 · overflow 0 · runtime error 0"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
```

## 59. Robot 물리 기반 7편의 책식 진입부와 반응형 폐쇄 (2026-08-01)

### 왜 이 일곱 편을 한 묶음으로 고쳤나

전력 회로, 제동, 관절 기계, 구조, 균열, 복합재, 마찰은 서로 다른 전공처럼 보이지만 실제 로봇에서는 한 방향으로 연결된다. 명령을 받은 모터가 전류와 토크를 만들고, 감속기와 관절이 그 힘을 전달하며, 링크와 접촉면이 하중을 받고, 반복 운전 뒤 피로·균열·마모가 남는다. 따라서 각 글의 독립 질문은 유지하되 직접 진입 독자는 같은 독서 문법으로 다음 단계에 올라갈 수 있어야 한다.

기존 구조 감사는 파일 안에 `BeginnerOpening`이 있는지만 확인해 실제 DOM 순서를 놓쳤다. 일곱 글 모두 렌더 결과에서는 `QuestionLead`가 먼저 나왔고, 질문을 해석하려면 이미 DC link, regeneration, transmission, anisotropy, fracture, tribology 같은 말을 알아야 했다. 이번 배치는 component 존재 여부가 아니라 브라우저의 실제 순서를 기준으로 재구성했다.

```yaml
reading_order:
  1_familiar_scene: "전등 스위치, 내리막 자전거, 자전거 저단 기어, 책상 밖으로 내민 자, 종이의 작은 흠집, 여러 장의 종이, 마른 손과 기름 묻은 손"
  2_causal_steps: "관찰할 일을 세 단계 이하로 나누고 아직 전문어를 요구하지 않는다"
  3_decision_question: "장면에서 생긴 의문을 실제 설계 판단으로 바꾼다"
  4_formalization: "그 뒤에만 전압·전류·토크·응력·균열 구동력·적층·윤활막 같은 이름과 식을 붙인다"
  5_evidence: "기존 interactive Lab, 원문 근거, 수식, 실패 조건은 삭제하지 않는다"
```

### 제목과 경로 문구도 함께 낮춘 이유

본문만 쉽게 바꾸고 목록 제목이 전문 용어 묶음이면 독자는 글을 열기 전에 이탈한다. article metadata와 learning path의 표시명을 함께 바꿔 `Power Electronics`, `Drive Energy`, `Actuator Mechanics`를 각각 `모터 힘을 만드는 전력 회로`, `움직이던 로봇을 안전하게 멈추는 법`, `작은 모터를 로봇 관절로 바꾸는 법`처럼 먼저 읽히게 했다. 영어 전문명은 검색과 원문 연결에 필요하므로 본문에서 역할을 이해한 뒤 다시 만난다.

### 작은 모델이 재현할 hard-transfer oracle

```yaml
input_packet:
  - "article title, summary, prerequisites"
  - "실제 렌더 순서가 보존된 첫 1~2개 section"
  - "연결된 learning-path step 앞뒤 항목"
  - "360·390px DOM geometry와 대표 screenshot"
classification_questions:
  - "분야 지식이 전혀 없는 독자가 첫 질문 속 명사를 설명할 수 있는가"
  - "첫 장면을 몸의 경험이나 일상 사물로 즉시 그릴 수 있는가"
  - "장면에서 technical question으로 넘어가는 원인과 결과가 세 단계 안에 보이는가"
  - "기존 수식·Viz·source를 지우지 않고 진입 순서만 바꿀 수 있는가"
rewrite_invariants:
  - "익숙한 장면이 QuestionLead보다 DOM에서 앞선다"
  - "BeginnerOpening은 정의 사전이 아니라 읽을 방향을 만드는 짧은 서사다"
  - "전문 질문은 삭제하지 않고 장면 뒤로 이동한다"
  - "제목·summary·경로 label도 같은 독자 수준으로 맞춘다"
  - "공식의 의미·단위·한계와 interactive evidence는 보존한다"
failure_signals:
  - "전문어를 한글 음역으로 바꾸고 쉬워졌다고 판단"
  - "색만 바꾸거나 카드를 추가하고 서사 순서는 그대로 둠"
  - "숨겨진 responsive 수식 variant를 실제 overflow로 오판"
  - "페이지 전체 scrollWidth만 보고 SVG text·KaTeX 경계를 검사하지 않음"
```

### 구현·검증 영수증

```yaml
changed_articles:
  - "robot-power-electronics-motor-driver"
  - "robot-drive-energy-braking-safety"
  - "robot-actuator-mechanics-transmission-holding-brake"
  - "robot-structural-mechanics-materials-fatigue-thermal"
  - "robot-fracture-mechanics-damage-tolerance"
  - "robot-composite-structures-joints-damage"
  - "robot-contact-tribology-lubrication-wear"
content_specs: "7편 모두 Beginner-entry contract 추가"
metadata_and_paths: "article title·summary·prerequisite와 연결 경로 label을 같은 독자 수준으로 정렬"
viz_fix: "tribology SVG의 긴 label을 정렬·두 줄화해 360~1440px clipping 제거"
local_browser:
  report: ".codex-tmp/robot-physical-foundation-browser-local-2026-08-01.json"
  scope: "7 routes × 360/390/768/1440 = 28 checks"
  result: "failures 0 · opening-before-question 28/28 · figure overflow 0 · SVG clipping 0 · visible formula overflow 0 · raw LaTeX 0 · controls >=44px · text >=12px"
production_browser:
  report: ".codex-tmp/robot-physical-foundation-browser-production-2026-08-01.json"
  scope: "7 routes × 360/390/768/1440 = 28 checks"
  result: "failures 0"
visual_review:
  directory: ".codex-tmp/screenshots/robot-foundation-2026-08-01"
  scope: "390px opening·technical Lab·full-page screenshots for power, composite, tribology"
  result: "잘림 없이 인과 단계와 interactive evidence가 분리되어 읽힘"
build:
  command: "bun run build:tsc"
  result: "pass · 8,596 modules transformed · Vite 18.82s"
deployment:
  restarted_at: "2026-08-01 18:16:29 KST"
  service: "cm-blog.service · active/running"
  main_pid: 773315
claude_validation:
  status: "context-manager 6-worker full audit running since 2026-08-01 18:00 KST"
  manifest_items: 292
  rule: "현재 source hash와 일치하는 strict receipt만 최종 수용; 빈 응답·stale hash·REVISE는 후속 queue로 남김"
  completion_claimed: false
```

## 58. 첫 안내서와 Pre-training 첫 장의 실제 렌더 순서 수정 (2026-08-01)

`systems-foundation-map`과 `llm-pretraining-scaling`은 문장 자체는 이미 초심자용으로 재작성됐지만 `BeginnerOpening`이 첫 `<section>` 안에 있었다. 따라서 목차용 `h2`가 출발 장면보다 먼저 렌더링되는 구조가 남아 있었다. 두 opening을 문서 최상단으로 옮겨 실제 순서를 다음처럼 고정했다.

```yaml
systems_foundation:
  order: "택배 장면 -> 다섯 역할의 일상어 -> 첫 장 제목 -> AI 용어 -> 적용"
  deferred_question: "서로 다른 기술을 같은 분야로 묶어도 되는가"
pretraining:
  order: "빈칸 맞히기 -> token·parameter·budget 정의 -> 첫 장 제목 -> 4B·9B trade-off -> scaling law"
  deferred_question: "같은 예산에서 9B가 항상 안전한가"
verification:
  local: "2 routes × 360/390/768/1440 = 8/8 · failures 0"
  production: "8/8 · failures 0"
  report: ".codex-tmp/beginner-entry-browser-production-2026-08-01.json"
  build: "bun run build:tsc · 8,596 modules"
  deployed_at: "2026-08-01 17:55:16 KST"
  main_pid: 727910
```

재현 규칙은 `BeginnerOpening`의 존재 여부가 아니라 첫 `section[id] h2`보다 앞에 실제로 렌더링되는지를 확인하는 것이다. 목차는 장면 앞에 있어도 되지만, 독자에게 판단을 요구하는 질문과 기술 섹션 제목은 장면·정의 뒤로 보낸다.

## 57. Robot sensor-to-actuator 직접 진입과 경로 헤더 재구성 (2026-08-01)

### 왜 다섯 글을 한 묶음으로 읽었나

Camera geometry, localization, ROS 2 runtime, embedded control, motor FOC는 서로 다른 전공처럼 보이지만 실제 로봇에서는 `관측을 공간에 놓기 -> 현재 상태를 추정하기 -> 명령을 전달하기 -> 정확한 주기에 출력하기 -> 전류와 힘으로 만들기`라는 한 실행 사슬이다. 각 글의 수식과 근거는 이미 깊었지만, 직접 주소로 들어온 독자에게는 전문용어가 먼저 보였다. 내용을 줄이지 않고 일상 장면에서 물리적 입력과 출력을 먼저 붙인 뒤 정식 용어를 도입했다.

```yaml
entry_reconstruction:
  camera:
    scene: "사진의 한 점은 방향은 알려 주지만 거리는 알려 주지 않는다"
    role_order: "화면 방향 -> 거리 -> 촬영 순간 카메라 자세 -> 로봇 기준 3D 점"
  localization:
    scene: "눈을 감고 걸음 수만 더하면 작은 오차가 계속 쌓인다"
    role_order: "짧은 이동 누적 -> 주변 단서 -> 과거 경로와 지도 동시 교정"
  ros2:
    scene: "주소가 맞는 냉장 택배도 늦거나 오래됐으면 쓸 수 없다"
    role_order: "상대 발견 -> 최신 자료 대기·처리 -> 센서에서 모터까지 시간 확인"
  embedded:
    scene: "화면의 켜짐 표시와 실제 전등의 전류는 다른 사건이다"
    role_order: "명령 신원 -> 측정·계산 주기 -> PWM 반영 -> 실제 전류 확인"
  motor:
    scene: "가속 페달의 비율을 세 모터 전선에 그대로 쓰지 않는다"
    role_order: "원하는 회전력 -> 전류 -> 전압 -> 스위치 시간 -> 측정한 힘"
```

처음에는 네 글의 `BeginnerOpening`이 첫 `NlpSection` 안에 있었다. 구조 감사는 첫 `QuestionLead`보다 앞선다는 이유로 통과했지만 실제 DOM에서는 기술 섹션의 질문과 제목이 먼저 렌더링됐다. 따라서 출발 장면과 쉬운 확인 질문을 섹션 바깥 최상단으로 옮겼다. 이후 감사는 컴포넌트 존재뿐 아니라 `opening -> question -> technical section`의 실제 순서를 확인해야 한다.

### 공통 헤더와 메타데이터 판단

모바일 경로 칩 4~10개가 여러 줄을 차지하던 UI는 `현재 단계 / 전체 단계 · 현재 글 · 다음`의 44px 한 줄로 줄였다. 데스크톱의 전체 단계 칩은 유지했다. 다섯 글의 title, summary, prerequisites와 기본 학습 경로 설명도 쉬운 한국어 목적을 먼저 쓰고 ROS 2, SLAM, FOC 같은 검색 가능한 정식 용어를 뒤에 남겼다.

### 작은 모델이 재현할 hard-transfer oracle

```yaml
required_checks:
  - "컴포넌트가 있는가가 아니라 실제 DOM에서 생활 장면이 기술 section heading보다 먼저인가"
  - "첫 화면의 title과 summary만 읽어도 물리적 입력·출력을 말할 수 있는가"
  - "요청값, 전달값, 적용값, 관측값을 같은 숫자로 합치지 않는가"
  - "pixel 방향과 depth, odometry와 localization, message arrival와 deadline, command와 PWM, torque와 current를 구분하는가"
failure_signals:
  - "영어 용어를 한국어로 음역만 하고 익숙한 장면을 만들지 않음"
  - "BeginnerOpening을 기술 section 안에 두고 순서 검증 없이 통과 처리"
  - "여러 연속 수식을 하나의 FormulaNote가 설명하는 합법적 그룹을 단순 개수 비교로 실패 처리"
```

### 구현·검증 영수증

```yaml
changed_articles:
  - "robot-camera-geometry-calibration"
  - "robot-localization-slam"
  - "robot-ros2-runtime-communication"
  - "robot-embedded-realtime-control"
  - "robot-motor-drive-foc"
shared_layout:
  mobile_path_header: "여러 줄 chip rail -> 44px compact current/next row"
  first_path_prerequisites: "필요할 때 펼치는 details"
content_specs: "다섯 spec 모두 direct-entry scene, definition order, first-question restriction 기록"
structural_audit:
  total_entries: 138
  result: "BeginnerOpening 73 · BeginnerBridge 31 · SpecialistEntry 15 · QuestionLead 19 · none 0"
local_browser:
  report: ".codex-tmp/robot-foundation-browser-local-2026-08-01.json"
  scope: "5 routes × 360/390/768/1440 = 20 checks"
  result: "failures 0 · figure/SVG/formula overflow 0 · raw LaTeX 0 · min text 12px · controls 44px · runtime error 0"
  entry_report: ".codex-tmp/beginner-entry-browser-local-2026-08-01.json · 20/20 failures 0"
visual_fix: "Operating-envelope SVG의 오른쪽 legend를 end anchor로 바꿔 4개 viewport clipping 제거"
build:
  command: "bun run build:tsc"
  result: "pass · 8,596 modules transformed"
deployment:
  restarted_at: "2026-08-01 17:49:00 KST"
  service: "cm-blog.service · active/running"
  main_pid: 720723
production_browser:
  report: ".codex-tmp/robot-foundation-browser-production-2026-08-01.json"
  result: "20/20 · failures 0"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
```

## 56. RL 직접 진입 세 글의 생활 장면과 운영 헤더 재구성 (2026-08-01)

### 왜 세 글을 함께 고쳤나

모방 학습, world model과 safe RL은 서로 다른 알고리즘 묶음이지만 직접 진입에서 같은 오류가 있었다. 첫 질문이 `demonstration/state/action`, `environment model/validation loss`, `reward/policy`를 정의 전에 요구했다. 깊은 수식과 source boundary는 이미 갖춰져 있었으므로 내용을 줄이지 않고, 각 글의 첫 인지 단계를 생활 장면으로 다시 만들었다.

```yaml
entry_reconstruction:
  imitation:
    scene: "차선 중앙 기록만 본 운전 학생이 오른쪽으로 밀린 장면"
    role_order: "상황 → 행동 → 시간순 기록 → 따라 학습 → 자기 실수로 생긴 새 상황"
    first_question: "기록을 그대로 외우면 새 상황에서도 끝까지 움직일 수 있는가"
  world_model:
    scene: "교차로마다 위치를 조금씩 틀리게 표시하는 지도"
    role_order: "한 단계 예측 → 여러 번 이어 보기 → 현실 결과로 재검산"
    first_question: "다음 한 장면을 잘 맞히면 긴 계획도 믿을 수 있는가"
  safe_rl:
    scene: "빠른 배달 +1000점, 충돌 -100점이라 사고 뒤에도 900점이 남는 규칙"
    role_order: "성과와 위험 분리 → 허용선의 종류 결정 → 실행·물리 차단"
    first_question: "큰 충돌 벌점만으로 무충돌을 보장할 수 있는가"
```

경로 제목·summary·선수 지식도 같은 순서로 낮췄다. 다만 `Offline RL`, `World Model`, `Safe & Constrained RL`은 원문 검색과 논문 계보를 위해 쉬운 한국어 제목 뒤에 남겼다.

### 공통 헤더를 왜 다시 압축했나

첫 수정 뒤 본문 순서는 옳았지만, 360·390px에서 긴 선수 지식과 수학 보강 링크가 모두 펼쳐져 첫 h2가 화면 밖으로 밀렸다. 모바일·태블릿에서는 `먼저 알면 좋은 것`과 `수학 보강`을 각각 44px 이상의 접힌 summary로 바꾸고, “이 경로는 여기서 시작합니다”라는 중복 설명은 desktop에서만 보이게 했다. Desktop은 전체 선수 목록과 math bridge를 그대로 유지한다. 직접 진입 header의 하단 여백도 mobile에서 20px 줄였다.

### 작은 모델이 재현할 hard-transfer oracle

```yaml
imitation:
  unknown_case: "expert가 방문하지 않은 recovery state"
  required_insight: "frame accuracy와 closed-loop success를 분리하고 query 가능성에 따라 DAgger와 static offline을 가른다"
world_model:
  unknown_case: "one-step error는 작지만 planner가 그 오차가 큰 경로를 선택"
  required_insight: "one-step, H-step, predicted-to-real return gap을 서로 다른 evidence로 측정"
safe_rl:
  unknown_case: "평균 cost budget은 통과하지만 한 trajectory의 사고 확률과 제동 시간이 실패"
  required_insight: "training constraint, runtime gate, hardware interlock의 보장 경계를 분리"
failure_signals:
  - "용어를 한글 음역으로만 바꾸고 장면을 만들지 않음"
  - "벌점이 충분히 크면 안전이 보장된다고 주장"
  - "validation loss 하나로 긴 계획과 현실 return을 대체"
```

### 구현·검증 영수증

```yaml
changed_articles:
  - "rl-imitation-offline-learning"
  - "rl-model-based-world-models"
  - "rl-safe-constrained-learning"
content_specs:
  - "두 기존 spec에 direct-entry contract 추가"
  - "safe RL spec 신규 작성: source boundary·hidden transfer·formula/viz contract"
structural_audit:
  before: "BeginnerOpening 64 · QuestionLead 28"
  after: "BeginnerOpening 67 · QuestionLead 25 · none 0"
local_browser:
  direct_entry: "8 routes × 360/390/768/1440 = 32/32, failures 0"
  rl_full_document: "3 routes × 360/390/768/1440 = 12/12, failures 0"
  formula_contract: "12+10+10 display formulas와 같은 수의 FormulaNote"
  visual_contract: "figure overflow 0 · raw LaTeX 0 · minimum text 12px · controls 44px"
  interaction_oracle: "imitation T=150 → 95.2% · world H=20 → 8.00m · safety T=200 → 2.00"
build:
  command: "bun run build:tsc"
  result: "pass · 8,596 modules transformed"
deployment:
  restarted_at: "2026-08-01 17:22:25 KST"
  service: "cm-blog.service · active/running"
  main_pid: 691119
  response: "세 운영 route HTTP 200"
production_browser:
  direct_entry: "32/32, failures 0"
  rl_full_document: "12/12, failures 0"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
```

## 55. 경로 첫 글 구조 감사의 오탐 제거와 의미 검토 큐 (2026-08-01)

`QuestionLead`가 먼저 보인다는 이유만으로 글을 실패로 판정하지 않는다. 영수증의 OCR 오류, 길이당 질량, 환불 완료 문장처럼 독자가 이미 그릴 수 있는 장면은 질문으로 시작해도 된다. 반면 `state/action`, `SLAM`, `PWM`, `FOC`, `u_k`처럼 아직 정의하지 않은 기호와 약어가 질문을 이해하기 위한 전제라면 진입부를 다시 써야 한다.

```yaml
audit_scope: "선언된 AI learning path 138개의 첫 article"
entry_devices:
  BeginnerOpening: 64
  BeginnerBridge: 31
  SpecialistEntry: 15
  QuestionLead: 28
  none: 0
decision_rules:
  - "질문을 읽는 데 선수 용어가 필요 없으면 유지"
  - "용어가 필요하면 익숙한 장면 → 역할 → 이름 → 질문 순서로 재작성"
  - "source/code specialist 글은 필요한 선행 글과 돌아갈 위치를 먼저 표시"
  - "component 이름이 아니라 실제 렌더링 순서와 문장의 의미로 판정"
```

기존 감사기는 평평한 article 파일의 default import만 따라가서 `prompt-engineering`과 `claw-task-team`의 `export { default } from ...`를 설명 없는 글로 오판했다. 재수출을 재귀적으로 해석하도록 수정한 뒤 두 글이 각각 `BeginnerBridge`, `SpecialistEntry`로 시작함을 확인했다. 특히 `claw-task-team`은 이미 코드베이스 원문 글임을 밝히고 Tool·Worker 선행 경로를 제공하므로, 초심자 글처럼 덮어쓰지 않는다.

다음 의미 검토 큐는 세 묶음이다. 첫째, RL current-first 글의 `demonstration/state/action/environment model`을 일상 장면 뒤로 내린다. 둘째, Robot source spine의 약어·기호 선행 여부와 기초 복귀 링크를 함께 고친다. 셋째, 유지 판정을 받은 익숙한 질문도 360·390 초기 viewport에서 정의와 첫 그림이 보이는지 브라우저로 검증한다.

```yaml
artifacts:
  audit_script: ".codex-tmp/audit-learning-path-entry-narrative.mjs"
  report: ".codex-tmp/learning-path-entry-narrative-audit-2026-08-01.json"
status: "구조 누락 0 · 28개 QuestionLead 의미 검토 진행"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex structural triage complete; semantic and Claude cross-validation pending"
```

## 54. Image·Video Runtime의 직접 진입과 공통 Viz 재구성 (2026-08-01)

### 왜 용어 목록보다 제작 장면을 먼저 두었나

기존 두 글의 첫 질문은 평이했지만 답변 첫 문장에서 `condition tensor`, `latent`, `denoiser`, `solver`, `VAE`를 한꺼번에 나열했다. 독자는 질문을 이해하고도 답을 읽는 순간 다시 멈췄다. Image 글은 한국어 패키지 주문, Video 글은 종이 넘기기 애니메이션을 출발점으로 삼아 역할을 먼저 보여 주고 이름을 나중에 붙였다.

```yaml
image_story:
  scene: "빨간 컵, 흰 배경, 한글 제목을 가진 패키지 시안 주문"
  roles: "지시를 숫자로 변환 → 작은 작업 공간에서 반복 수정 → RGB pixel로 복원"
  terms_after_roles: "condition → latent → denoiser/solver → VAE"
video_story:
  scene: "각 종이의 컵 손잡이와 로고가 달라져 넘길 때 떨려 보이는 애니메이션"
  inherited_roles: "image runtime의 세 단계"
  added_roles: "시간 기억 → motion·identity → audio timing → temporal defect"
direct_entry_rule: "앞 글을 읽지 않아도 서두에서 최소 뼈대를 다시 세우되, 깊은 구현은 별도 글로 중복하지 않는다"
```

### 출처와 교육용 추론의 경계

```yaml
source_intent:
  latent_diffusion: "pixel 대신 autoencoder latent에서 diffusion하고 cross-attention으로 조건을 주입하는 역사 기준점"
  krea_2_report: "2026 공개 image foundation model의 DiT·attention·VAE 결합 사례"
  wan_2_2_repo: "variant별 noise-regime expert와 VAE 압축의 공식 사실"
  ltx_2_3_docs: "synchronized audio-video와 지원 입력 범위의 공식 사실"
inference_boundary:
  five_stage_runtime: "여러 모델을 비교하기 위한 교육용 실행 분해"
  joint_loss_equation: "검증 축을 설명하는 개념식이며 비공개 exact recipe가 아님"
```

### 작은 모델이 재현할 hard-transfer oracle

```yaml
image_case:
  observation: "한글 제목은 틀리고 컵 모양은 맞으며 VAE 교체 뒤 색만 탁해짐"
  expected: "condition 경로, denoiser shape, decoder color contract를 분리해 한 축씩 검사"
video_case:
  observation: "frame은 선명하지만 logo가 흔들리고 audio가 0.3초 늦으며 interpolation 뒤 flicker 증가"
  expected: "temporal identity, audio alignment·mux timestamp, postprocess artifact를 서로 다른 owner로 분리"
failure_signals:
  - "prompt 수정으로 모든 오류를 해결하려 함"
  - "frame 수나 denoising step이 많을수록 항상 좋다고 주장"
  - "model output과 postprocess output을 한 결과로만 저장"
```

### 공통 UI를 어떻게 줄였나

경로 중간 글의 세 칸 연결 설명은 모바일·태블릿에서 이전/다음 링크와 현재 번호만 남겼다. 난이도와 시간은 두 열을 함께 사용하고 선행 정보는 다음 행에 간결하게 배치했다. Runtime Viz는 모바일의 세로 다섯 칸을 고정 높이 가로 pipeline으로 바꾸고, 한국어 역할명을 앞에 두며 영어 module 이름은 넓은 화면의 보조 표기로 내렸다. 진단 결과는 모바일에서 `항목 | 값` 행, 태블릿 이상에서 설명이 붙는 세 열로 전환한다.

```yaml
entry_browser:
  local_report: ".codex-tmp/beginner-entry-browser-local-2026-08-01.json"
  production_report: ".codex-tmp/beginner-entry-browser-production-2026-08-01.json"
  scope: "2 routes × 360/390/768/1440 = 8 checks"
  result: "첫 h2 initial viewport 8/8 · opening-before-question 8/8 · raw LaTeX 0 · overflow 0 · runtime error 0"
runtime_browser:
  script: ".codex-tmp/audit-media-runtime-browser.mjs"
  local_report: ".codex-tmp/media-runtime-browser-local-2026-08-01.json"
  production_report: ".codex-tmp/media-runtime-browser-production-2026-08-01.json"
  scope: "2 routes × 360/390/768/1440 = 8 checks"
  result: "figure overflow 0 · inner overflow 0 · min text 12px · min control 44px · mode/stage height shift 0 · interaction 8/8"
content_specs:
  - "src/pages/articles/ai/content-specs/image-model-runtime.md"
  - "src/pages/articles/ai/content-specs/video-model-runtime.md"
build:
  command: "bun run build:tsc"
  result: "pass · 8,596 modules transformed"
  diff_check: "pass"
deployment:
  restarted_at: "2026-08-01 16:57:58 KST"
  service: "cm-blog.service · active/running"
  main_pid: 653509
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
```

## 53. 신호와 시스템 공통 기반의 첫 진입 재구성 (2026-08-01)

### 왜 이 글을 먼저 고쳤나

`signals-systems-convolution`은 신호 수학 경로의 첫 글이면서 robot sensor, audio, time series, SSM, feedback 경로가 반복해서 공유하는 기반이다. 기존 첫 화면은 `함수와 수열`, `벡터의 내적`, `복소수의 기초`를 먼저 요구하고 `JUST-IN-TIME MATH`까지 펼쳤다. 그러나 이 글의 역할은 그런 표기보다 먼저 시간에 따라 들어오는 값을 기록하고 섞고 기억하는 감각을 만드는 것이다. 따라서 본문을 쉽게 쓰더라도 공통 header가 독자를 막는 구조였다.

```yaml
authoring_intent:
  familiar_scene: "방 온도를 1초마다 20, 21, 21로 기록한다"
  first_distinction: "숫자 배열만으로는 측정값인지 섞는 규칙인지 알 수 없다"
  terms_after_scene: "sample → signal → system → interval → memory → causality"
  later_depth: "LTI, convolution, Fourier, sampling, state-space는 본문 안에서 단계적으로 도입"
prerequisite_rule:
  before: "함수·수열, 내적, 복소수를 읽기 전에 요구"
  after: "별도 선행 글 없이 시작; 복소수와 basis는 실제 주파수 절에서 설명"
  reason: "기초 글이 자신이 만들어 줄 이해를 입장 조건으로 다시 요구하면 순환 의존이 된다"
reuse_rule:
  beginner_entry: "시간 기록과 최근 값 평균이라는 일상 장면에서 시작"
  specialist_route: "sampling, latency, resonance 같은 전문 질문은 상위 경로의 step metadata에서만 제시"
```

### 작은 모델이 재현할 hard-transfer oracle

```yaml
scenario: "같은 [1, 2, 1]을 두 문맥에서 본다"
expected_reasoning:
  - "1초마다 잰 온도라면 세 sample로 이루어진 signal이다"
  - "현재 값과 양옆 값을 섞는 계수라면 filter rule이다"
  - "축, 간격, 역할을 먼저 고정하지 않고 계산하면 안 된다"
failure_signals:
  - "audio kernel, token sequence, complex basis부터 설명"
  - "숫자 모양이 같으므로 의미도 같다고 답함"
  - "Fourier를 이해해야 signal을 시작할 수 있다고 요구"
```

### 구현·검증 영수증

```yaml
changed_surface:
  article: "온도 기록 BeginnerOpening과 평이한 첫 판단 질문 추가"
  metadata: "제목·summary·학습 경로 질문을 일상어로 재작성"
  prerequisites: "순환 선행 조건과 header의 사전 선형대수 bridge 제거"
local_browser:
  report: ".codex-tmp/beginner-entry-browser-local-2026-08-01.json"
  scope: "signals-systems-convolution × 360/390/768/1440 = 4 checks"
  result: "첫 h2 initial viewport 4/4 · opening-before-question 4/4 · raw LaTeX 0 · overflow 0 · runtime error 0"
  screenshot: ".codex-tmp/signals-systems-convolution-beginner-entry-local-390-2026-08-01.png"
build:
  command: "bun run build:tsc"
  result: "pass · 8,596 modules transformed"
  diff_check: "pass"
deployment:
  restarted_at: "2026-08-01 16:38:35 KST"
  service: "cm-blog.service · active/running"
  main_pid: 630658
  response: "signals-systems-convolution · HTTP 200"
production_browser:
  report: ".codex-tmp/beginner-entry-browser-production-2026-08-01.json"
  scope: "signals-systems-convolution × 360/390/768/1440 = 4 checks"
  result: "첫 h2 initial viewport 4/4 · opening-before-question 4/4 · raw LaTeX 0 · overflow 0 · runtime error 0"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
```

## 51. LLM 구조 경로와 전역 KaTeX 가독성 재구성 (2026-08-01)

### 왜 구조 갤러리부터 다시 읽었나

기존 `llm-architecture-gallery`는 모델 이름과 분류표를 먼저 보여 줘, 처음 읽는 사람이 token·hidden vector·layer·attention·FFN을 모른 채 Dense·MoE·KV·Hybrid를 비교해야 했다. 최신 모델을 이해하는 목표는 유지하되, 다음 token을 만드는 공통 흐름을 먼저 세우고 부품이 바뀌는 순서로 경로를 다시 정의했다.

```yaml
route_contract:
  1_start: "LLM 구조 · token → hidden vector → layer → next-token probability"
  2_dense: "모든 token이 같은 FFN을 통과하는 기준 구조"
  3_kv: "과거 K·V를 왜 저장하고 문맥 길이가 어떤 byte 비용을 만드는가"
  4_sparse_moe: "전체 용량과 token당 활성 계산량을 분리하는 이유"
  5_optional_hybrid: "과거 token 목록 대신 고정 state를 이어 가는 선택 분기"
  6_integrated_report: "DeepSeek V3.2 보고서에서 선택·학습·runtime claim을 함께 검산"
sidebar_labels:
  - "출발점 · LLM 구조"
  - "기준 부품 · Dense"
  - "기억 비용 · KV와 문맥"
  - "용량과 계산 · Sparse MoE"
  - "선택 분기 · State memory"
  - "실전 검산 · 통합 보고서"
```

갤러리 첫 화면에는 `Token`, `Hidden vector`, `Layer`, `Attention`, `FFN`의 5개 정의를 넣었다. Dense 글은 비교 기준, Hybrid 글은 필수가 아닌 선택 분기임을 명시했다. 표로 모델 이름을 압축하는 대신, 각 글이 직전 글에서 넘겨받은 질문과 다음 글에 넘길 판단을 본문 안에서 닫도록 했다.

### 최신 출처를 어떤 의도로 썼나

```yaml
source_intent:
  deepseek_v4_2026: "CSA/HCA, mHC, Muon, 1M context를 현재 공개 연구 구조로 확인"
  moonshot_attention_residuals: "직전 layer 하나가 아니라 앞 layer 표현을 선택하는 depth 방향 attention의 공식 근거"
  google_gemma_4_12b: "encoder-free multimodal input과 MTP drafter의 공식 모델 설명"
  qwen_3_6_and_flashqla: "Transformer·GDN hybrid cadence와 hardware-aligned linear-attention kernel의 공식 구현 근거"
  deepseek_v3_2_report: "indexer distillation, top-k core attention, mixed GRPO와 agent context 관리의 통합 검산 대상"
epistemic_rule: "논문·공식 repository가 말한 구조와 교육용 중간 변수·해설을 문장 안에서 구분"
```

### 수식 문제를 어떻게 좁혔나

처음에는 underbrace 한글을 `normalsize`로 키우자 현재 경로의 주석은 읽혔지만 모바일 오른쪽이 잘렸다. 단순 축소는 12px 기준을 깨고, 긴 라벨을 자동 `substack`으로 나누는 시도는 글자가 다시 작아지고 행간이 겹쳐 폐기했다. 최종 규칙은 다음 순서다.

```yaml
formula_fit_pipeline:
  1_render: "KaTeX 원식을 렌더하고 실제 .katex 경계를 측정"
  2_semantic_rows: "폭이 부족할 때만 aligned 각 행을 분리하고 =, +, 논리 연산 경계에서 계산 단계를 나눔"
  3_readability_floor: "수식 안의 설명 텍스트는 CSS max(12px, 0.82em)로 최소 12px 보장"
  4_remeasure: "고정 12px 텍스트 때문에 비선형적으로 남은 폭을 적용 직후 다시 측정"
  5_compact_legend: "그래도 넘치는 underbrace만 ①·② 표식으로 바꾸고 같은 수식 박스 아래 14px 범례 제공"
  6_author_rewrite: "한 식에 서로 다른 판단을 넣은 경우 중간 변수를 도입해 본문 수식 자체를 재작성"
rejected:
  - "가로 스크롤 · 독자가 식의 양쪽을 동시에 볼 수 없음"
  - "12px 아래 일괄 축소 · 보이지만 읽을 수 없는 실패"
  - "자동 substack 라벨 · 작은 글자와 수직 겹침 재발"
  - "모든 식의 무조건 줄바꿈 · 데스크톱 수식의 자연스러운 구조까지 훼손"
```

직접 재작성한 대표식은 multimodal projector, KV byte 장부, state matrix 장부, SSM 전개, delta read, KDA transition, chunk state, DeepSeek indexer KL loss와 verification 집합이다. 예를 들어 KL loss는 `score → q 분포 → query별 divergence d → 전체 loss`로, 검증 집합은 `방법 적합 V_m → 근거 유효 V_e → 판정 완료 V_req`로 나눴다.

### 작은 모델용 hard-transfer oracle

```yaml
input:
  - "360px에서 annotated KaTeX가 잘린 화면"
  - "원본 LaTeX와 바로 아래 FormulaNote"
required_reasoning:
  - "scrollWidth가 아니라 container와 실제 .katex 좌우 경계를 비교"
  - "글자 크기와 식의 의미 단위를 동시에 보존"
  - "먼저 계산 단계 분리, 그다음 12px 하한, 마지막에만 번호 범례"
  - "^-의 minus를 뺄셈으로 오인하지 않도록 brace·unary context 구분"
  - "긴 페이지는 content-visibility를 깨우도록 실제로 구간별 scroll 후 측정"
acceptance:
  - "rightGap과 leftGap이 -1px 미만으로 내려가지 않음"
  - "보이는 한글 수식 텍스트가 12px 이상"
  - "raw LaTeX·KaTeX error·document overflow가 0"
  - "직접 주석 또는 같은 박스의 번호 범례로 연산 이유가 보임"
failure_signals:
  - "라벨 색이나 font-size만 바꾸고 재측정하지 않음"
  - "hidden·offscreen 수식을 초기 scale 1.00 상태에서 실패로 판정"
  - "subscript의 unary minus를 top-level subtraction으로 분리"
```

### 구현·검증 영수증

```yaml
local_current_route:
  report: ".codex-tmp/llm-current-formula-audit.json"
  scope: "6 routes × 360/390/768/1440 = 24 checks"
  result: "formula clip 0 · Korean label <12px 0 · document/Viz overflow 0 · raw LaTeX 0 · image failure 0 · runtime error 0"
local_global_formula_regression:
  report: ".codex-tmp/all-ai-formula-regression-2026-08-01.json"
  scope: "243 formula-bearing AI routes · 1,049 formulas · 360/1440 = 486 checks"
  result: "failed checks 0"
visual_evidence:
  - ".codex-tmp/gallery-multimodal-formula-360.png"
  - ".codex-tmp/hybrid-delta-read-formula-360.png"
  - ".codex-tmp/deepseek-indexer-loss-formula-360.png"
  - ".codex-tmp/agent-runtime-compact-formula-360.png"
build:
  command: "bun run build:tsc"
  result: "pass · 8,596 modules transformed"
  typecheck: "bunx tsc -b --pretty false · pass"
  diff_check: "git diff --check · pass"
deployment:
  restarted_at: "2026-08-01 16:04:26 KST"
  service: "cm-blog.service · active/running"
  main_pid: 591085
  response: "https://heru.ragdoll-bigeye.ts.net/lab/blog/ · HTTP 200"
production_current_route:
  report: ".codex-tmp/llm-current-formula-production-2026-08-01.json"
  scope: "6 routes × 360/390/768/1440 = 24 checks"
  result: "failures 0"
production_representative:
  report: ".codex-tmp/formula-production-representative-2026-08-01.json"
  scope: "direct annotation·compact legend·unary minus·verification rewrite 5 routes × 360/390/1440 = 15 checks"
  result: "failed checks 0"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
```

다음 의미 기반 재구성에서는 자동 점수 순으로 문구를 붙이지 않는다. 각 최신 목표 경로를 하나씩 열고, 첫 글부터 `정의 → 직관 → 수식 → 원문 증거 → 구현 → 실패 경계`가 이어지는지 읽은 뒤 필요한 글만 보강·통합·추가한다.

## 52. 경로 첫 글의 책식 진입 구조 재구성 (2026-08-01)

### 왜 본문을 고쳤는데도 첫 문장이 어렵게 보였나

`systems-foundation-map`과 `llm-pretraining-scaling` 본문에는 이미 익숙한 장면과 용어 정의가 들어가 있었다. 그러나 실제 브라우저에서는 공통 `ArticleLayout`이 본문보다 먼저 `앞에서 가져올 것 / 이번 글에서 도달할 것 / 이후에 확장할 것`을 렌더링했고, 그 가운데 학습 경로의 압축 질문이 아직 배우지 않은 `상태·경계 계약·검증 신호` 또는 `model·token·compute`를 먼저 보여 줬다.

따라서 실패는 본문 한 파일만의 문제가 아니라 다음 세 층이 서로 다른 독자 수준을 가정한 결과였다.

```yaml
root_cause:
  route_metadata: "경로를 설계한 사람에게는 정확하지만 초심자에게는 압축된 질문"
  shared_header: "첫 글에서도 목표 질문과 다음 글을 3단 카드로 먼저 노출"
  article_body: "친숙한 장면을 넣어도 화면 아래로 밀려 실제 첫 경험이 되지 못함"
```

### 적용한 공통 규칙

1. 경로의 첫 글은 공통 헤더에서 목표 질문을 반복하지 않는다.
2. 첫 글 헤더에는 `이 경로는 여기서 시작합니다`와 선행 글 필요 여부만 짧게 표시한다.
3. 실제 첫 장의 제목이 360·390px 초기 viewport 안에 보이게 한다.
4. 경로의 두 번째 글부터만 `앞 글에서 이어지는 것 / 이 글에서 알게 될 것 / 다음에 이어질 내용`을 보여 준다.
5. `QuestionLead`를 금지하지 않는다. 동전, 환불, 택배처럼 사전지식 없이 장면을 그릴 수 있는 질문은 유지한다.
6. 정의되지 않은 약어·수식·제품명이 질문이나 답을 이해하는 데 필요하면 `BeginnerOpening` 또는 평이한 정의를 먼저 둔다.
7. 원문·전문 글은 기술 질문을 먼저 둘 수 있지만, 요구 선행 지식과 돌아갈 기초 글을 화면에서 명시한다.

Pre-training 글은 `다음 조각 맞히기 → token → parameter → 학습 예산 → 4B·9B 판단` 순서를 유지했다. `N·D·C`, `compute-optimal`, `test-time scaling`, `full run`을 절 제목에서 바로 시험하지 않고 각각 `크기·연습량·계산량`, `같은 계산량의 좋은 조합`, `학습 뒤 반복 사용`, `큰 학습 전 작은 실험`으로 먼저 설명한 뒤 영어 이름을 붙였다.

### 구조 감사와 의미 감사를 왜 분리했나

첫 경로 글 138개를 구조적으로 분류한 결과는 다음과 같다.

```yaml
entry_device_audit:
  report: ".codex-tmp/learning-path-entry-narrative-audit-2026-08-01.json"
  reusable_script: ".codex-tmp/audit-learning-path-entry-narrative.mjs"
  total_first_articles: 138
  BeginnerOpening: 47
  BeginnerBridge: 29
  SpecialistEntry: 5
  QuestionLead_first_detected: 42
  none_detected: 15
warning: "QuestionLead 42개가 곧 오류 42개라는 뜻이 아니다. 질문의 어휘와 앞선 설명을 사람이 다시 읽어야 한다."
```

예를 들어 `agent-evaluation-trace`의 환불 장면과 `probability-information-theory`의 동전·점수 장면은 초심자도 상상할 수 있어 질문형 진입이 유효하다. 반면 여러 전문어를 한 문장에 나열하고 관계를 묻는 질문은 독자가 질문 자체를 해석하지 못하므로 먼저 정의해야 한다. 자동 감사는 수정 명령이 아니라 의미 검토 queue만 만든다.

### 4B·9B 모델이 재현할 hard-transfer oracle

```yaml
input_packet:
  - "경로 metadata: title, summary, first-step question, prerequisites"
  - "아티클 첫 section의 JSX 또는 추출된 text order"
  - "390px 초기 viewport screenshot과 DOM y-coordinate"
required_classification:
  reader_state: "해당 분야 용어를 하나도 모른다고 가정"
  familiar_scene: "질문을 읽고 일상 장면을 바로 그릴 수 있는가"
  undefined_dependency: "질문과 첫 답을 이해하는 데 필요한 말이 앞에서 정의됐는가"
  specialist_contract: "전문 글이라면 prerequisites와 기초 복귀 링크가 있는가"
rewrite_order:
  - "title과 summary를 일상어로 낮춘다"
  - "경로 첫 글의 중복 목표 질문을 공통 header에서 제거한다"
  - "익숙한 장면을 먼저 둔다"
  - "장면에서 이미 본 역할에 용어를 붙인다"
  - "그 뒤에만 비교·판단 질문을 둔다"
acceptance:
  - "첫 h2가 360·390 초기 viewport 안에 보임"
  - "BeginnerOpening이 QuestionLead보다 DOM에서 앞섬"
  - "entry header에 도달 질문이 반복되지 않음"
  - "raw LaTeX, document overflow, runtime error 0"
failure_signals:
  - "QuestionLead라는 component 이름만 보고 전부 삭제"
  - "본문만 고치고 공통 header와 route metadata를 확인하지 않음"
  - "전문어를 한글로 음역만 바꾸고 정의했다고 판단"
```

### 구현·검증 영수증

```yaml
changed_surface:
  shared_layout: "경로 첫 글 compact entry, 모바일의 중복 next link 제거, 이후 글의 연결 문구를 책식 표현으로 변경"
  reusable_component: "QuestionLead에 문맥별 label prop 추가"
  systems_entry: "택배 흐름 summary와 다섯 역할 정의 뒤 판단 질문"
  pretraining_entry: "다음 조각 맞히기 summary, 평이한 4B·9B 답, 네 기술 절 제목과 전환 문단 재작성"
local_browser:
  report: ".codex-tmp/beginner-entry-browser-local-2026-08-01.json"
  scope: "2 routes × 360/390/768/1440 = 8 checks"
  result: "첫 장 initial viewport 8/8 · opening-before-question 8/8 · repeated route question 0 · raw LaTeX 0 · overflow 0 · runtime error 0"
production_browser:
  report: ".codex-tmp/beginner-entry-browser-production-2026-08-01.json"
  scope: "2 routes × 360/390/768/1440 = 8 checks"
  result: "failures 0"
shared_header_regression:
  scope: "기초·신호·image runtime·agent eval·paper entry 5개와 non-entry 1개 × 390/1440 = 12 checks"
  result: "entry/non-entry 분기 12/12 · overflow 0 · runtime error 0"
build:
  command: "bun run build:tsc"
  result: "pass · 8,596 modules transformed"
  diff_check: "pass"
deployment:
  restarted_at: "2026-08-01 16:30:02 KST"
  service: "cm-blog.service · active/running"
  main_pid: 622602
  response: "두 운영 route HTTP 200"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
```

다음 배치는 구조 감사에서 `QuestionLead`가 먼저 검출된 글을 자동 수정하지 않는다. 여러 학습 경로가 공유하는 `signals-systems-convolution`, image/video runtime과 실제 경로의 첫 글을 차례로 읽고, 익숙한 장면인지와 정의 순서를 의미 기준으로 판정한 뒤 필요한 글만 재작성한다. 원문 spine은 같은 queue에서 분리해 `SpecialistEntry`와 prerequisites가 충분한지 별도로 본다.

## 50. Pre-training 최신 목표 경로 의미 재구성 (2026-08-01)

### 왜 네 글을 한 묶음으로 읽었나

`Pre-training과 학습 예산 → Chinchilla 원문 → 데이터 신호 → 학습 실행`은 각각 별도 질문을 가진 글이지만, 실제 의사결정에서는 순서가 끊기면 안 된다. 먼저 다음 token을 맞히는 pre-training을 정의하고, model 크기와 token 예산을 고른 뒤, 그 token을 어떤 문서로 채울지 결정하고, 마지막으로 그 recipe가 여러 GPU에서 같은 run으로 재현되는지 확인한다.

```yaml
route_contract:
  1_budget: "N·D·compute와 serving 수요를 함께 보고 후보를 정한다"
  2_source_paper: "Chinchilla가 실제로 주장한 compute-optimal 기준과 적용 한계를 복원한다"
  3_data_signal: "수집량이 아니라 sampling distribution과 검증 가능한 data ablation을 설계한다"
  4_execution: "token budget을 batch·step·state ownership·checkpoint로 보존한다"
```

`llm-data-engine`과 `llm-pretraining-run`은 기존에 첫 문장부터 corpus, dedup, train.py 같은 말을 사용했다. 두 글에 각각 주방의 재료 선택과 공장의 작업지시서 비유를 추가해 용어를 먼저 정의하고, 직전 글에서 무엇을 넘겨받는지도 내부 링크로 명시했다. Chinchilla 글의 종료 지점도 다음 데이터 글을 가리키도록 닫았다.

### 무엇을 사실과 판단으로 분리했나

```yaml
source_intent:
  dclm: "고정된 model·training recipe에서 data selection을 비교하는 통제 실험의 근거"
  fineweb: "추출·filter·dedup을 각각 ablation한 공개 data pipeline 사례"
  textbooks_are_all_you_need_ii: "작은 model의 synthetic textbook 접근 사례; 보편 법칙으로 확대하지 않음"
  nemotron_3_2025_2026: "web·code·specialized synthetic data product가 별도 version으로 공개되는 최신 운영 사례"
  megatron_core: "distributed optimizer가 BF16/FP32 기준으로 6+12/d byte를 소유하는 공식 장부"
  pytorch_fsdp2: "parameter·gradient·optimizer state를 모두 shard하는 full-shard 실행 계약"
```

가장 큰 내용 수정은 `optimizer state 분할`과 `full shard`를 같은 모드로 표시하던 오류를 분리한 것이다. 교육용 정상 상태 장부는 DDP `18N`, Megatron distributed optimizer `N(6+12/d)`, FSDP full shard `18N/d`의 세 모드로 바꿨다. Activation, all-gather buffer, fragmentation과 kernel workspace는 이 장부 밖의 peak memory라고 본문에서 명시했다.

### 작은 모델이 재현할 hard-transfer oracle

```yaml
scenario:
  model: "4B"
  data_parallel_ranks: 8
  expected_rank_state:
    ddp_replicated: "72.0 GB"
    optimizer_shard: "30.0 GB"
    fsdp_full_shard: "9.0 GB"
required_explanation:
  - "왜 세 값이 다른지 state ownership으로 설명"
  - "정상 상태 장부와 실제 peak memory를 구분"
  - "model/token 예산을 바꾸면 data와 run recipe도 다시 고정해야 함을 설명"
failure_signals:
  - "optimizer shard와 full shard를 같은 것으로 취급"
  - "GPU 수만 늘리고 step을 유지하면 같은 학습이라고 주장"
  - "synthetic data가 많을수록 항상 좋다고 일반화"
```

### 구현·검증 영수증

```yaml
changed_articles:
  - "llm-pretraining-scaling · 기존 정의와 최신 source 경계 재검증"
  - "paper-chinchilla-2022 · 다음 data decision으로 handoff"
  - "llm-data-engine · direct-entry 정의, current source, content spec"
  - "llm-pretraining-run · direct-entry 정의, 3-way memory ownership lab, content spec"
responsive_browser:
  scope: "4 routes × 360/390/768/1440 = 16 checks"
  result: "경로 순서 16/16 · body/formula overflow 0 · raw LaTeX 0 · runtime error 0 · 일반 visible text <12px 0"
formula_annotation:
  method: "KaTeX underbrace label에 \\normalsize를 넣어 geometry와 글자 크기를 함께 재계산"
  mobile_min_size: "16.94px"
  screenshot: ".codex-tmp/llm-pretraining-memory-360-normalsize.png"
interaction_oracle:
  ranks_8: "DDP 72.0 GB · optimizer shard 30.0 GB · full shard 9.0 GB"
  ranks_32: "optimizer shard 25.5 GB · full shard 2.3 GB"
build:
  command: "bun run build:tsc"
  result: "pass · 8596 modules transformed"
  diff_check: "pass"
deployment:
  restarted_at: "2026-08-01 14:28:04 KST"
  service: "cm-blog.service · active/running"
  main_pid: 487843
  response: "https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/llm-pretraining-run · HTTP 200"
production_browser:
  scope: "4 routes × 390/1440 = 8 checks"
  result: "경로 순서 8/8 · body/formula overflow 0 · raw LaTeX 0 · runtime error 0"
  interaction: "390px · DDP 72.0 GB · optimizer shard 30.0 GB · full shard 9.0 GB"
claude_validation:
  unavailable_until: "2026-08-01 18:00:00 Asia/Seoul"
  required_follow_up: true
  current_label: "Codex/static/browser QA complete; Claude cross-validation pending"
```

## 60. Robot 인지·좌표·제어 3편의 센서에서 행동까지 진입부 폐쇄 (2026-08-01)

### 깊이를 늘리지 않고 순서를 고친 이유

세 글은 이미 각각 관측·추적·점유 장면, 좌표 변환·IK·Jacobian, 상태공간·PID·LQR·MPC까지 충분히 깊었다. 부족한 것은 내용량이 아니라 첫 독자의 mental model이었다. `QuestionLead`가 묻는 detector confidence, RGB-D, frame, steering command, plant를 이해하기 전에 질문부터 만났기 때문이다.

```yaml
narrative_chain:
  perception: "사진의 얼굴 네모 -> 무엇이 보였나 -> 로봇 기준 어디인가 -> 같은 물체와 빈 공간을 시간에 따라 누적 -> planning scene"
  kinematics: "서로 다른 기준의 오른쪽 2m -> 원점·축·시각·단위 -> 같은 점의 좌표 변환 -> 관절 각도·속도 -> reachability와 singularity"
  control: "샤워 물을 만져 다시 조절 -> 목표 -> 실제 결과 -> 다음 명령 수정 -> state-space·PID·LQR·MPC"
preserved_depth:
  - "기존 전문 QuestionLead와 ConceptPrimer"
  - "모든 FormulaNote와 한국어 수식 의미"
  - "관측 계약·frame transform·closed-loop response를 포함한 interactive Viz"
  - "source boundary, capability check, learning handoff"
```

### 작은 모델이 재현할 hard-transfer oracle

```yaml
input:
  - "첫 전문 질문과 답"
  - "질문에서 정의 없이 사용한 명사 목록"
  - "현재 첫 section의 실제 DOM order"
  - "연결된 이전·다음 learning-path step"
required_output:
  scene: "독자가 몸이나 일상 사물로 이미 겪은 한 장면"
  causal_steps: "전문 질문에 필요한 역할을 세 단계 이하로 먼저 설명"
  terminology_gate: "역할을 이해한 뒤에만 technical name을 붙임"
  preservation_ledger: "기존 수식·Viz·원문·실패 조건 중 무엇을 그대로 유지했는지 명시"
acceptance_questions:
  - "얼굴 네모만으로 거리·동일성·빈 공간을 알 수 없음을 설명할 수 있는가"
  - "같은 좌표 숫자라도 원점과 축이 다르면 다른 표현임을 설명할 수 있는가"
  - "한 번의 명령과 결과를 다시 재는 폐루프의 차이를 설명할 수 있는가"
failure_signals:
  - "본문 기술 내용을 삭제해 쉬워 보이게 함"
  - "전문 질문을 일상 비유로 대체하고 다시 연결하지 않음"
  - "영어 label만 한국어로 바꾸고 원인·결과 순서는 그대로 둠"
```

### 구현·검증 영수증

```yaml
changed_articles:
  - "robot-perception-scene-construction"
  - "robot-kinematics-coordinate-frames"
  - "robot-dynamics-feedback-control"
metadata_and_paths: "article title·summary와 세 learning path title·description·핵심 step label을 초심자 서사에 맞춤"
content_specs: "세 글에 Beginner-entry contract 추가"
responsive_formula_fix: "A-BK 설명형 수식을 768px에서 14px로 조정; 최소 12px 규칙 유지"
local_browser:
  report: ".codex-tmp/robot-sense-motion-control-browser-local-2026-08-01.json"
  scope: "3 routes × 360/390/768/1440 = 12 checks"
  result: "failures 0 · opening-before-question 12/12 · figure/SVG/formula overflow 0 · raw LaTeX 0 · controls >=44px · text >=12px"
production_browser:
  report: ".codex-tmp/robot-sense-motion-control-browser-production-2026-08-01.json"
  scope: "3 routes × 360/390/768/1440 = 12 checks"
  result: "failures 0"
visual_review:
  directory: ".codex-tmp/screenshots/robot-sense-motion-control-2026-08-01"
  result: "390px에서 세 도입부와 observation/frame-transform/closed-loop Lab의 잘림·겹침 없음"
build:
  command: "bun run build:tsc"
  result: "pass · 8,596 modules transformed · Vite 18.63s"
deployment:
  service: "cm-blog.service · active/running"
claude_validation:
  status: "context-manager 6-worker full audit continues"
  source_hash_rule: "이번 수정 뒤 hash와 일치하는 strict receipt만 수용"
  completion_claimed: false
```

## 61. 전체 Claude 감사 조정과 내용 우선순위 판정 (2026-08-01)

### 감사 결과를 수정 명령으로 취급하지 않은 이유

292개 article packet을 Context Manager의 Claude Sonnet worker 6개로 다시 읽혔다.
그러나 `REVISE`는 곧바로 고칠 명령이 아니다. 감사 prompt의 일반 규칙과 이
프로젝트의 편집 의도가 충돌할 수 있기 때문이다. 특히 hard-transfer 문제는
본문에 공개하는 quiz가 아니라, 본문 깊이를 검사하는 비공개 authoring fixture다.

```yaml
reconciliation_policy:
  accept_as_bug:
    - "틀린 수식·수치·원문 attribution"
    - "처음 등장한 용어에 정의가 없어 다음 계산을 못 따라감"
    - "존재하지 않는 article을 다음 단계라고 약속함"
    - "content spec이 약속한 핵심 주제와 실제 본문이 어긋남"
    - "source version과 현재 동작을 같은 시제로 서술함"
  reject_as_instruction:
    - "비공개 hard-transfer fixture를 공개 문제·정답 reveal로 바꾸라는 요구"
    - "본문의 다른 장치로 이미 충족한 연습 형식을 하나 더 추가하라는 요구"
  defer_by_user_order:
    - "내용 경로가 닫히기 전에 모든 정적 Viz를 인터랙션으로 교체하라는 요구"
```

### 이번 조정에서 수용한 대표 결함

```yaml
accepted_findings:
  camera_calibration:
    problem: "Zhang 글이 존재하지 않는 Tsai-Lenz 후속 article을 약속"
    fix: "DLT를 첫 등장에 정의하고 실제 robot-localization-slam route로 연결"
  perceptron_private_oracle:
    problem: "비공개 문제의 숫자가 공개 예시와 겹쳐 전이를 검사하지 못함"
    fix: "x=[2,-1], y=0인 새 fixture와 한 번 update 뒤 score 재검산으로 교체"
  dpo_formula:
    problem: "sigmoid와 negative log를 왜 쓰는지 연산 이유가 빠짐"
    fix: "margin을 pairwise probability로 바꾸고 오분류를 크게 벌하는 이유를 FormulaNote에 추가"
  bernoulli_mle:
    problem: "미분을 이미 아는 독자만 k/n 도출을 따라갈 수 있음"
    fix: "순간 변화율, 내부 최대점의 기울기 0, 두 log 미분 규칙과 count 균형을 설명"
  pruning:
    problem: "calibration data와 GQA/KV-head가 정의 없이 핵심 판단에 사용됨"
    fix: "대표 입력 묶음과 shared KV 구조를 ConceptPrimer 및 structural pruning 문맥에 추가"
  rag_pipeline:
    problem: "provenance, RAGAS, GraphRAG, Corrective RAG가 spec에만 있고 본문에 없음"
    fix: "claim-to-source 최소 record와 질문 유형별 route로 본문·원문 source를 보강"
  nasa_bolt_viz:
    problem: "본문 Eq.46은 compressed/(relieving+compressed)인데 Viz가 반대 분자를 사용하고, Kc를 Ka처럼 재사용"
    fix: "Eq.45·46 identity로 Ka를 도출하고 같은 Ka를 phi와 thermal load에 공유"
    numeric_check: "세 경계 fixture에서 n45=n46, identity error 0, 0<n<1"
```

### 내용과 Viz의 순서를 분리한 방법

현재 `claw-file-ops`, `claw-plugin`, `claw-worker-boot`의 정적 Viz는 후속 전수
개편 대상이다. 사실·코드 경계가 틀린 것은 아니므로 지금 임시 animation을
붙이지 않는다. 먼저 전체 article의 beginner entry, prerequisite, source와
handoff를 닫고, 이후 같은 design system으로 state·control·derived outcome을
한 번에 맞춘다. RAG provenance도 지금은 실제 record와 판정 순서를 본문으로
닫고, 3-scene interactive Viz는 그 후속 배치에 남겼다.

### 작은 모델용 감사 판정기

4B·9B verifier에는 `REVISE를 고쳐라`라고 지시하지 않는다. 아래 고정 schema로
반례를 분류하게 한 뒤 orchestrator가 편집 순서를 결정한다.

```yaml
finding_triage:
  fields:
    article: "slug"
    claim: "문제가 있다고 주장한 한 문장"
    evidence_location: "file:line 또는 source span"
    class: "FACT | FORMULA | DEFINITION | PATH | SPEC_DRIFT | VIZ | EXERCISE_PREFERENCE"
    learner_blocked: "true | false"
    source_boundary_broken: "true | false"
    minimum_fix: "한 파일 안에서 가능한 최소 수정"
    defer_stage: "CONTENT | VIZ | RELEASE"
  decision:
    immediate: "FACT, FORMULA, DEFINITION, PATH, SPEC_DRIFT 중 실제 근거가 있는 것"
    deferred: "사실이 맞고 내용 경로가 닫힌 static VIZ"
    rejected: "EXERCISE_PREFERENCE만 있고 비공개 transfer oracle과 충돌하는 것"
```

수식이 렌더됐다는 사실은 Viz가 그 수식을 계산한다는 증거가 아니다. FormulaNote의
각 기호와 component state를 대응시켜 분자, 분모, 공유 의존성과 단위를 별도로
검사한다.

```yaml
formula_to_viz_audit:
  - "수식의 모든 독립 기호가 state·고정 상수·derived state 중 하나를 소유하는가"
  - "분자와 분모가 UI label의 물리량과 같은가"
  - "본문이 공유한다고 한 stiffness·probability·mask가 Viz에서도 같은 derived value를 쓰는가"
  - "slider 경계값에서 dimensionless ratio의 허용 범위를 벗어나지 않는가"
  - "교육용 상수와 원문 측정값을 화면에서 구분하는가"
```

감사 큐는 실행 중 source가 바뀐 packet을 `DRIFT`로 분류한다. 이전 `ACCEPT`나
`REVISE`를 현재 판정으로 재사용하지 않고 새 hash로 다시 요청한다. 따라서 이
시점의 상태는 build와 diff check 통과이지 전체 Claude closure 완료가 아니다.

```yaml
audit_snapshot:
  time: "2026-08-01 19:48 KST"
  total: 292
  current_hash_accept: 36
  current_hash_revise: 4
  pending: 78
  running: 6
  invalid_transport_or_format: 18
  source_drift: 150
  accepted_p0: 0
  build: "npx tsc -b --pretty false · pass"
  diff_check: "pass"
  completion_claimed: false
```

### 재감사 중 추가로 닫은 경계

```yaml
post_snapshot_triage:
  agent_runtime:
    claude_claim: "Mcp-Method와 Mcp-Name이 비공식일 수 있으므로 제거하거나 완화해야 한다"
    independent_check: "MCP 2026-07-28 Streamable HTTP의 Standard Request Headers가 두 header와 적용 method를 직접 규정"
    decision: "CLAUDE_FINDING_REJECTED_AS_FALSE"
    content_fix:
      - "JSON-RPC body의 일부 field를 HTTP header로 mirror하는 transport 이유를 명시"
      - "공식 specification의 정확한 section anchor로 SourceNote를 변경"
      - "Grant와 idempotency key를 첫 사용 전에 정의"
  action_conditioned_world_dynamics:
    accepted_gap: "L1과 squared L2를 쓰는 연산 이유가 FormulaNote에 없음"
    content_fix:
      - "L1은 한 latent 성분의 극단값이 전체 loss를 지배하는 정도가 L2보다 작음을 설명"
      - "weighted sum이 두 gradient 경로를 하나의 scalar objective로 합치는 이유를 설명"
      - "squared L2 disagreement가 ensemble variance와 같은 형태가 되는 이유를 설명"
    legibility_fix: "8px state label을 9px로 올림"
  animation_lora_training:
    accepted_gap: "temporal/audio block 미정의, LTX-Video와 LTX-2 source generation 혼동, indicator 곱셈 이유 누락"
    content_fix:
      - "frame 관계를 처리하는 temporal block과 audio-video 결합을 처리하는 audio block 정의"
      - "LTX-Video trainer config와 LTX-2 IC-LoRA dataset guide를 서로 다른 generation으로 표시"
      - "두 indicator의 곱이 두 release 조건을 동시에 요구하는 AND임을 설명"
  public_transfer_problem:
    decision: "REJECTED_AS_EXERCISE_PREFERENCE"
    reason: "hard-transfer 문제는 독자에게 공개하는 quiz가 아니라 저자·감사기가 본문 깊이를 확인하는 비공개 oracle"
  static_viz_findings:
    decision: "DEFERRED_TO_GLOBAL_VIZ_PASS"
    reason: "사용자가 내용·경로 완료 뒤 animation과 production visual system을 일괄 적용하도록 순서를 지정"
```

이 배치에서도 수정 뒤 `npx tsc -b --pretty false`와 `git diff --check`를 통과했다.
재감사 도중 수정된 packet은 이전 verdict를 폐기하고 `DRIFT`로 돌려 새 source hash
receipt를 기다린다. 따라서 위 기록은 편집 근거이지 Claude closure 영수증을 대신하지
않는다.

### 순서·정의·예제 표현 감사에서 추가한 규칙

```yaml
curriculum_order_fixes:
  eda_workflow:
    defect: "OOF를 정의하기 전에 사용했고 다음 경로를 세 intervention으로만 닫음"
    fix:
      - "OOF를 각 행을 보지 않은 fold model의 예측으로 첫 사용 전에 정의"
      - "feature, augmentation, rare-event 외에 static-table baseline과 temporal feature 분기를 연결"
      - "다섯 글을 모두 읽는 선형 목록이 아니라 data-generating process로 고르는 분기라고 명시"
  evaluation_metrics:
    defect: "cross-validation이 선행 조건으로 metric contract를 요구하지만 metadata 배열에서는 뒤에 배치"
    fix: "evaluation-metrics article object를 cross-validation 앞으로 이동"
  efficient_inference_on_device:
    defect: "MTP 약어가 정의보다 먼저 나오고 60 GB/s 상수를 보편 사양처럼 읽을 수 있음"
    fix:
      - "첫 제목에서 Multi-token prediction(MTP)로 확장"
      - "60 GB/s를 named educational assumption으로 만들고 실제 기기 실측값으로 교체하도록 화면에 표시"
```

예제의 중간 표현도 본문이 가르친 입력 형식과 섞이면 안 된다. HTML table 충돌 사례는
원본 HTML이 아니라 parser가 AST를 펼친 뒤 좌표를 부여한 origin-cell 목록이었으므로,
패널 라벨과 설명에 그 변환 경계를 명시했다. TEDS에서 처음 등장한 normalized
Levenshtein distance는 삽입·삭제·치환의 최소 횟수를 더 긴 문자열 길이로 나눈 거리라고
수식 기호 설명에 추가했다.

```yaml
small_model_checks:
  - "본문 배열 순서는 각 article prerequisites와 위상 정렬되어 있는가"
  - "약어는 제목을 포함한 첫 등장 위치에서 확장됐는가"
  - "교육용 상수는 이름, 단위, 가정, production 대체값을 함께 표시하는가"
  - "Viz 입력이 raw input인지 parser 이후 IR인지 패널이 직접 말하는가"
  - "거리·손실·정규화 연산은 무엇을 세고 무엇으로 나누는지 한국어로 설명하는가"
```

### 논문 날짜·기호 방향·오디오 용어 감사

감사 모델이 DOI 문자열의 연도를 발행 연도로 추론한 Emu3 finding은 1차 출처와
충돌했다. Nature 원문은 `s41586-025-10041-x`이지만 실제 발행일을 2026-01-28,
권·페이지를 Nature 650 (2026)으로 명시한다. DOI 조각이나 arXiv 식별자를
날짜의 대리값으로 바로 쓰지 않고 원문의 `Published` 또는 submission history를
확인한다. 반면 Transfusion은 arXiv submission history가 2024-08-20이므로 Viz의
2024-09 표기를 2024-08로 고쳤다.

```yaml
provenance_date_check:
  - "DOI·arXiv ID에서 날짜를 추론하지 말고 primary page의 explicit date를 읽는다"
  - "preprint 최초 공개와 peer-reviewed publication을 별도 field로 보존한다"
  - "감사 모델의 수정안도 primary source와 대조한 뒤에만 적용한다"
```

인접한 수식이 관습이 다른 표기를 쓰는 경우도 별도 실패 유형이다. Diffusion 식의
`x_0`은 clean data였지만 rectified-flow 예시의 `z_0`은 noise였으므로, flow 설명
첫 문장에 `t=0 noise, t=1 data`와 바로 앞 식과 방향이 반대라는 경고를 넣었다.
문자 모양이 비슷하다는 이유로 같은 의미라고 학습하지 않게 하기 위함이다.

Native speech 글에서는 다음 네 경계를 닫았다.

```yaml
native_speech_closure:
  representation:
    - "quantization을 연속 소리를 정수 code 조합으로 근사하는 변환으로 정의"
    - "codebook을 선택 가능한 정수 code의 목록으로 정의"
    - "residual quantization을 앞 code를 뒤 code가 차례로 보정하는 방식으로 정의"
  notation: "z_{<=t}가 첫 수식의 전체 response state z에서 t까지 쓸 수 있는 prefix임을 연결"
  latency_example: "80 + 40 + 25 + 15 + 20 = 180 ms를 대입해 부분 최적화와 end-to-end latency를 분리"
  listening_metrics:
    - "MOS = Mean Opinion Score, 여러 청취자의 평균 품질 점수"
    - "MUSHRA = hidden reference와 anchor를 포함해 여러 결과를 함께 비교하는 청취 평가"
```

이 배치 뒤에도 `npx tsc -b --pretty false`와 `git diff --check`를 통과했다.
