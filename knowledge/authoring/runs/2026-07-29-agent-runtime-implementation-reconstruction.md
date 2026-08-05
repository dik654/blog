# Agent runtime implementation reconstruction

Date: 2026-07-29 KST

## Objective

AI 블로그의 `AI Agents` 경로에서 가장 약한 구현 연결을 현재 소스 기준으로 다시 쓴다.
이번 배치의 핵심 질문은 다음 두 개다.

1. Policy engine이 반환한 action은 실제 lane 상태 변화와 같은가?
2. Tool definition이 model에 보였다는 사실은 permission, executor와 observation까지
   연결됐다는 뜻인가?

같은 배치에서 이전 Claude 검토가 남긴 세 개의 non-blocking follow-up도 닫는다.

- Attention의 all-masked row를 실제 UI에서 재현한다.
- Janus-Pro CFG의 batch layout 표현을 한 가지로 통일한다.
- Robot trajectory convergence를 렌더링이 아니라 실행값으로 검증한다.

## Why this track was selected

`scripts/audit-ai-mastery-coverage.mjs`로 19개 research track과 193개 route reference를
다시 검사했다. 이 스크립트의 점수는 release evidence가 아니라 다음 조사 대상을 좁히는
triage 신호로만 사용했다.

초기 `ai-agents` 점수는 84였다. 약한 참조 다섯 개가 모두 Claw Code 구현 글이었다.
그중 `claw-policy-engine`과 `claw-tool-system`은 문장이 짧은 것보다 더 큰 문제가 있었다.
예전 설계안과 현재 Rust 구현이 섞여 있어 독자가 존재하지 않는 runtime 동작을 사실로
배울 수 있었다.

현재 재작성 뒤 `ai-agents` 점수는 91이다. 휴리스틱상 남은 약한 참조는 다음 세 개다.

- `claw-subagent-orchestration`
- `claw-telemetry`
- `claw-recovery`

`claw-policy-engine`과 `claw-tool-system`의 88점 표시는 본문 문자열 길이 휴리스틱만 남은
것이며, source/Viz/browser 계약은 별도 증거로 검증한다.

최종 triage artifact:

```text
.codex-tmp/ai-mastery-coverage-2026-07-29-final-v4.json
```

## Source-first diagnosis

### Policy engine

먼저 `/home/heru/code/claw-code`의 현재 Rust를 읽었다.

```text
rust/crates/runtime/src/policy_engine.rs
rust/crates/runtime/src/green_contract.rs
rust/crates/runtime/tests/integration_tests.rs
```

현재 소스가 직접 증명하는 범위:

- `PolicyEngine::new`는 priority 오름차순으로 규칙을 정렬한다.
- `evaluate`는 첫 match에서 멈추지 않고 모든 규칙을 검사한다.
- 반환형은 `Vec<PolicyAction>`이다.
- `PolicyAction::Chain`은 재귀적으로 평탄화된다.
- `LaneContext.green_level`은 raw `u8`이다.
- 별도의 `green_contract.rs`에는 typed `GreenLevel`이 있다.
- 현재 integration test도 이 둘의 미연결 경계를 명시한다.

현재 파일이 증명하지 않는 범위:

- lane repository mutation
- event log와 effect receipt
- 30초 polling loop
- YAML/custom script policy loader
- first-match/break semantics
- CI cache와 consecutive-green counter

예전 글은 위 비범위를 현재 구현처럼 서술했다. 따라서 문장을 다듬는 수준이 아니라
구현 귀속을 다시 세워야 했다.

### Tool system

다음 파일을 source boundary로 고정했다.

```text
rust/crates/tools/src/lib.rs
rust/crates/tools/src/permissions.rs
rust/crates/tools/src/permission_enforcer.rs
rust/crates/runtime/src/conversation.rs
```

현재 소스가 직접 증명하는 범위:

- `GlobalToolRegistry`는 built-in, plugin과 runtime definition을 합쳐 노출할 수 있다.
- model-facing definition과 permission spec은 서로 다른 projection이다.
- allowlist 이름은 normalization되고 모르는 이름은 definition에 나타나지 않는다.
- bash/PowerShell은 command 내용에 따라 동적 permission classification을 한다.
- permission enforcer의 Prompt 결과는 outer interactive flow가 이어 받아야 한다.
- `GlobalToolRegistry::execute`가 직접 dispatch하는 것은 built-in과 plugin 경로다.
- runtime definition은 별도의 상위 runtime executor wiring이 필요하다.

현재 파일만으로 증명할 수 없는 production 보장:

- 모든 runtime definition의 실제 executor 연결
- exactly-once external effect
- timeout 뒤 자동 reconciliation
- durable idempotency ledger

이 비범위는 삭제하지 않고 “현재 구현”과 “production에서 추가로 필요한 계약”으로
분리했다.

## Private transfer problems

공개 본문에 시험 문제를 그대로 넣지 않았다. 대신 작성자가 깊이를 잃지 않도록 비공개
전이 문제를 먼저 만들고, 본문만 읽은 독자가 해결 전략에 도달하는지 역으로 검사했다.

### Policy transfer problem

같은 lane에서 낮은 priority의 cleanup rule, merge rule과 stale recovery rule이 모두
match한다. `Chain` 안에는 notification과 cleanup이 중첩돼 있다.

독자는 다음을 구분해야 한다.

1. 어떤 순서로 모든 rule을 평가하는가?
2. 반환 action 순서는 어떻게 보존되는가?
3. typed Green contract와 raw `u8` 사이에서 무엇을 검증해야 하는가?
4. 어느 시점부터 lane mutation, external effect와 receipt 책임이 시작되는가?

본문은 `context -> all-match evaluation -> recursive flatten -> typed intent ->
executor/effect boundary`를 연결해야 이 문제를 풀 수 있다.

### Tool transfer problem

runtime-origin tool의 schema는 model에게 보이지만 active allowlist에서 빠져 있다. 다른
시나리오에서는 shell command가 Prompt이고, executor가 요청을 보낸 직후 process가 죽는다.

독자는 다음 네 계약을 분리해야 한다.

1. definition exposure
2. permission projection/decision
3. concrete executor dispatch
4. result or ambiguous-effect observation

본문은 “보임=허용=실행=성공”이라는 단일 boolean 모델을 해체하고, runtime definition
executor가 어디에서 연결되어야 하는지와 timeout 뒤 필요한 evidence를 설명해야 한다.

## Article reconstruction

### Policy article

`claw-policy-engine.tsx`를 다음 순서로 다시 썼다.

```text
먼저 답할 질문
  -> PolicyEngine의 좁은 현재 계약
  -> LaneContext와 condition
  -> ascending priority + all-match
  -> recursive Chain flatten
  -> action intent와 side effect 분리
  -> raw u8 / typed GreenLevel integration gap
  -> executor, receipt, reducer handoff
  -> capability check와 source notes
```

전문 용어를 먼저 나열하지 않고 `rule은 상태를 읽고 action 후보를 계산하는 함수`라는
평문에서 시작했다. Toy rule은 실제 운영 policy set이나 benchmark 수치가 아니라 원문 enum을
조합한 학습 예라고 visible caption에 표시했다.

### Tool article

`claw-tool-system.tsx`를 다음 네 경계로 재구성했다.

```text
visible definition
  -> permission decision
  -> executor ownership
  -> observation/evidence
```

각 단계에서 “현재 소스가 제공하는 것”과 “상위 runtime 또는 application이 책임질 것”을
같이 보여 준다. Prompt는 enforcer가 UI를 띄우는 상태가 아니라 outer flow에 결정을
미루는 상태로 설명했다.

## Viz reasoning

두 Viz는 정적 architecture 그림이 아니라 변수를 바꾸면 결론이 달라지는 작은 실행 실험이다.

### `PolicyEvaluationLab`

- green level, branch age와 다섯 boolean evidence를 직접 바꾼다.
- 입력 규칙은 일부러 priority 순서 밖으로 선언하고, 평가 시 p5/p20/p40/p60으로 정렬한다.
- 규칙은 priority 오름차순으로 렌더링한다.
- 모든 rule의 match/skip을 동시에 보여 준다.
- `Chain[MergeToDev, Chain[Notify(review)]]`처럼 실제 재귀 action tree를 보인다.
- match된 action은 재귀 함수로 leaf 순서를 보존한 채 평탄화한다.
- 반환된 typed intent와 아직 일어나지 않은 mutation/effect를 다른 status surface로 나눈다.
- 모바일에서는 단일 열, 넓은 화면에서는 context/evaluation과 guarantees를 안정된 grid로
  배치한다.

이 Viz가 증명하는 것은 current evaluator semantics다. Production rule quality나 효과
성공률을 증명하지 않는다.

### `ToolRuntimeContractLab`

- tool origin, active permission mode, allowlist 포함 여부와 command를 바꾼다.
- hidden, deferred, denied, observed 상태가 실제 계산으로 바뀐다.
- definition, permission, executor와 observation을 한 줄의 네 단계로 보존한다.
- runtime tool은 executor가 자동 연결된 것처럼 표시하지 않는다.
- Prompt는 “outer approval flow 필요”로 끝나며 enforcer-owned dialog를 만들지 않는다.

Desktop은 네 단계 비교를 한눈에 보이고, mobile은 같은 순서를 세로로 유지한다.

## Residual review closure

### Attention all-masked row

모든 score가 `-\infty`인 row에서 naïve max-subtraction softmax는
`-\infty - (-\infty)`를 만들어 NaN으로 흐를 수 있다.

Explorer에 “전체 row 차단” control을 추가했다. Safe guard는 다음 sentinel을 반환한다.

```text
weights = [0, 0, 0]
sum = 0
output = [0, 0]
selected key = none
row status = invalid
```

이 0 vector를 확률분포라고 부르지 않는다. 유효 key가 하나 이상인 normal mode에서는 합이
다시 1이 된다.

### Janus-Pro CFG

본문, Viz와 test의 batch 표현을 모두 다음 하나로 고정했다.

```text
[c0, u0, c1, u1, ...]
```

한 번의 `2B` language-model forward 뒤 conditional row는 `0::2`,
unconditional row는 `1::2`로 읽는다. CFG logit으로 뽑은 token ID는 다음 step에서 두
row에 같은 값으로 복제한다.

### Robot convergence

렌더링된 badge만 확인하지 않고 grid를 직접 바꾸고 계산된 값을 읽는다.

```text
21 -> 41: time error 0.34%, switch error 0.025, NO-GO
201 -> 401: time error 0.01%, switch error 0.003, torque error 0.00, GO
```

Test는 finite value, error 감소, 모든 fine-grid model row pass, NaN/Infinity 부재와
mobile/desktop overflow를 함께 확인한다.

## Small-model reconstruction protocol

4B/9B 모델은 긴 대화 전체를 한 번에 주면 source와 설계안을 섞기 쉽다. 아래처럼 상태를
외부 artifact로 고정하고 한 단계씩 좁힌다.

### 1. Inventory packet

입력:

- article registry
- route/track schema
- 기존 article slug
- 휴리스틱 audit 결과

출력:

- 약한 track 하나
- 중복/누락 article
- 다음 조사 파일 목록

이 단계에서는 본문을 쓰지 않는다.

### 2. Source fact packet

한 packet에 primary source 파일 1-3개만 준다. 각 claim을 다음 중 하나로 태깅한다.

```yaml
claim_status:
  observed: source가 직접 구현/서술
  inferred: 여러 source를 조합한 해석
  proposed: production 보강안
  unsupported: 현재 근거 없음
```

`observed`와 `proposed`를 같은 문장에 넣지 않는다.

### 3. Transfer-problem packet

가장 어려운 failure scenario 한 개를 만든다. 정답을 본문에 넣지 않고 다음을 묻는다.

- 필요한 state는 무엇인가?
- 실행 순서와 invariant는 무엇인가?
- 어느 component가 실패와 side effect를 소유하는가?
- 어떤 evidence가 있어야 주장을 강하게 할 수 있는가?

본문 outline이 이 문제의 풀이 전략을 만들지 못하면 section을 추가한다.

### 4. Article packet

고정 입력:

- source fact matrix
- transfer problem
- 용어 prerequisite
- 최소 stop rule

출력 순서:

```text
쉬운 직관
  -> 좁은 현재 계약
  -> 실행 흐름
  -> edge/failure
  -> 구현 책임 경계
  -> source note
  -> 다음 학습 링크
```

### 5. Viz packet

Viz마다 한 개의 invariant만 증명한다.

```yaml
viz_contract:
  control: 사용자가 바꾸는 변수
  calculation: 실제로 다시 계산되는 값
  visible_delta: 화면에서 달라지는 결과
  non_claim: 이 Viz가 증명하지 않는 것
  mobile_layout: 390px에서 순서와 폭
```

숫자와 상태가 바뀌지 않으면 설명 그림이지 검증 Lab이 아니다.

### 6. Browser contract packet

텍스트 존재만 검사하지 않는다.

- control을 조작한다.
- before/after state를 비교한다.
- 잘못된 구현이면 어떤 assertion이 깨지는지 확인한다.
- 390/768/1440에서 document와 Viz overflow를 검사한다.
- KaTeX error, NaN와 Infinity를 거부한다.

### 7. Independent review packet

한 번에 전체 article family를 맡기지 않는다. Source, prose, Viz와 browser evidence를
각각 좁은 packet으로 나눈다.

유효 receipt 조건:

```yaml
http: 200
ok: true
worker: claude-code:sonnet
first_attempt_ok: true
first_line: ACCEPT or REVISE
substantive_result: true
source_hash_before_equals_after: true
footer_hashes_match_current_source: true
```

500, code 143, plan-only response, 잘못된 첫 줄, source drift는 결론으로 세지 않는다.

### 8. Apply and revalidate

`REVISE` finding은 자동 적용하지 않는다.

1. 원문에서 finding을 독립 재현한다.
2. 확인된 finding만 수정한다.
3. focused lint/test/build를 실행한다.
4. 변경된 hash로 post-fix packet을 새로 만든다.
5. production 배포 뒤 같은 URL에서 browser contract를 다시 실행한다.

## Failure log

이번 작업에서 작은 모델/외부 reviewer가 반복할 수 있는 실패:

1. Aspiration을 current implementation으로 귀속
2. 첫 match 설명으로 all-match source를 덮음
3. Tool definition 노출을 실제 dispatch로 오해
4. Prompt permission을 enforcer-owned UI로 오해
5. 정적 Viz의 label을 실행 증거로 취급
6. 동일한 접근성 이름을 가진 내부/외부 링크를 text selector 하나로 선택
7. `Conditional`이 `Unconditional`의 부분 문자열이라 두 control을 함께 선택
8. Context Manager `plan` mode가 감사 대신 계획을 반환
9. 240초 code 143을 PASS/FAIL로 해석
10. 첫 줄과 hash footer가 없는 유용한 prose를 strict receipt로 잘못 채택
11. 화면 문구는 recursive `Chain`이라고 쓰면서 Viz 데이터는 이미 평평한 `string[]`로 만듦

## Verification ledger

Local:

```text
focused ESLint: PASS
git diff --check: PASS
combined Playwright: 17/17 PASS
Vite production build: PASS
```

Visual inspection:

- Policy and Tool labs captured at 390 and 1440.
- Stable-width controls and result surfaces.
- No text clipping inside the target Viz.
- Mobile preserves execution order in one column.
- Desktop uses the available width without oversized empty cards.

Context Manager initial queue:

```text
total: 7
strict-valid ACCEPT: 3
invalid plan/timeout/format/source-drift: 4
```

Accepted initial packets:

- Policy Viz/test
- Attention all-masked row
- Robot convergence evidence

Invalid results are preserved but never counted:

- Policy content/source: plan-only response
- Tool content/source: code 143
- Tool Viz/test: code 143
- Janus CFG: wrong first line and source drift after test correction

Raw ledger:

```text
.codex-tmp/claude-agent-track-strict-2026-07-29/
```

## Context Manager recovery ledger

초기 큐의 유효 영수증 세 건은 Attention, Robot과 당시 Policy Viz였다. 나머지는 plan-only,
timeout, 잘못된 첫 줄 또는 source drift였으므로 결론으로 세지 않았다. `harness_mode:auto`로
바꾸고 범위를 잘게 나눠 다시 요청했다.

Claude sandbox가 `/home/heru/code/claw-code` 원문을 직접 읽지 못한 패킷은 임의 지식으로
대체하지 않았다. 다음 일곱 파일을 audit 디렉터리에 복사하고 SHA-256과 `cmp`로 원본과
byte-identical임을 다시 확인했다.

```text
policy_engine.rs
green_contract.rs
integration_tests.rs
tools-lib.rs
permissions.rs
permission_enforcer.rs
conversation.rs
```

Janus 설명은 공식 DeepSeek Janus 저장소의 pinned revision
`1daa72fa409002d40931bd7b36a9280362469ead` README를 같은 방식으로 고정했다.

유효한 source snapshot 결과:

```text
policy core/source: ACCEPT
policy GreenContract semantics: ACCEPT
policy raw-u8 integration boundary: ACCEPT
tool registry projection: ACCEPT
tool permission enforcer boundary: ACCEPT
tool dispatch/observation boundary: ACCEPT
Janus CFG prose against pinned README: ACCEPT
```

### Finding 1: runtime definition without executor

첫 Tool source 검토는 `REVISE`였다. `ToolRuntimeContractLab`은 runtime definition이
allowlist와 permission을 통과하면 곧바로 observed로 갔다. 그러나 원문
`GlobalToolRegistry::execute`는 runtime definition을 직접 dispatch하지 않는다.

수정:

- `runtimeExecutorWired`를 독립 입력으로 추가
- 기본 runtime 시나리오는 visible/allowed 뒤 `unwired`에서 멈춤
- executor 열에 `executor 미배선` 표시
- 상위 runtime executor를 연결해야만 `observed`로 전이
- Playwright가 `unwired -> observed`를 실제 control 조작으로 확인

Post-fix Tool source/Viz/test 패킷 2/2가 현재 해시로 `ACCEPT`했다.

### Finding 2: recursive Chain이라고 썼지만 평평한 배열

최종 Policy Viz 검토는 `REVISE`였다. 컴포넌트는 `Rule.actions: string[]`와 한 단계
`flatMap`만 사용하면서 화면에는 "Chain 내부 순서를 보존"한다고 썼다. 즉 설명은 맞아
보였지만 실험은 recursive contract를 구현하지 않았다.

수정:

- `PolicyAction = action | chain` 재귀 union 도입
- 실제 nested `Chain[MergeToDev, Chain[Notify(review)]]` 입력 구성
- `flattenAction` 재귀 호출로 leaf order 보존
- 규칙 선언 순서를 60/40/5/20으로 섞고 화면 정렬 5/20/40/60 검증
- Playwright가 source shape와 정확한 flat output
  `MergeToDev -> Notify(review) -> RecoverOnce`를 함께 검증

Post-fix Policy semantics/test 패킷 2/2가 현재 해시로 `ACCEPT`했다.

Transport/format failure는 계속 보존하지만 verdict로 세지 않았다. 원문 스냅샷, 요청,
응답, before/after hash와 machine summary는 다음에 있다.

```text
.codex-tmp/claude-agent-track-strict-2026-07-29/
```

## Final verification and deployment

최종 Policy Chain 수정 뒤 다시 실행한 결과:

```text
focused ESLint: PASS
git diff --check: PASS
Vite production build: PASS
local Playwright: 17/17 PASS
production Playwright: 17/17 PASS
```

Visual QA:

- Tool의 runtime-unwired 상태를 390/768/1440에서 직접 렌더링
- Policy nested Chain source와 flattened output을 390/768/1440에서 직접 렌더링
- 모든 target Viz에서 `scrollWidth == clientWidth`
- 모바일은 실행 순서를 단일 열로 보존하고 데스크톱은 비교 열을 사용

Deployment receipt:

```text
service: cm-blog.service
status: active
public URL: https://heru.ragdoll-bigeye.ts.net/lab/blog/
dist/public index SHA-256: b20b51290250dc6ca6e97a6c7d61f1b6edcaf3fb68246e071c472581d5f50dc3
production browser contracts: 17/17 PASS
```
