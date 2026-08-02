# Agent framework runtime ownership reconstruction

Date: 2026-07-28 KST

## Objective

`agent-frameworks`를 제품별 기능표에서 실행 책임을 고르는 학습 글로 재구성한다.
독자는 현재 framework 이름을 외우는 대신 다음 질문에 답할 수 있어야 한다.

1. Model, runtime, application과 external system 중 누가 어떤 state와 실패를 소유하는가?
2. Process restart, stale approval와 ambiguous effect가 함께 생겨도 중복 실행 없이 복구할 수 있는가?
3. 직접 API, Agent SDK, durable workflow, data workflow와 crew coordination 중 최소한 무엇이 필요한가?
4. Framework를 교체해도 어떤 application contract와 evidence가 보존되어야 하는가?

이 글은 `agentic-patterns`와 `llm-harness`의 공통 계약을 framework family 선택으로
이어 주고, 다음 단계에서 Claude Code, OpenClaw와 Claw Code 구현을 검산하게 한다.

## Hard question

내부 검증 문제는 다음 한 건으로 고정했다.

> 환불 요청을 provider에 보낸 직후 응답을 받기 전에 process가 죽었다. 두 시간 뒤
> 사용자의 승인이 도착했다. 저장 state, 승인 revision·expiry, idempotency,
> external effect evidence, 재개 위치와 최소 runtime family를 구분하라.

본문은 이 문제의 답을 별도 문제 풀이로 나열하지 않는다. 대신 독자가 다음 인과를
스스로 재구성할 수 있게 한다.

```text
proposal
  -> typed pending action
  -> checkpoint + approval request
  -> revision/expiry validation
  -> idempotent commit
  -> restart-safe reconciliation
  -> trace/replay verdict
```

## Sources and source boundaries

현재 claim은 다음 공식 문서에만 귀속했다.

- OpenAI Agents SDK: 직접 Responses API와 SDK의 loop/tool/state ownership 차이
- LangGraph overview/persistence: LangChain·LangGraph·Deep Agents·LangSmith 층,
  checkpointer/store와 in-memory restart 경계
- LlamaIndex Workflows: event-driven step, branch/loop와 durable workflow
- CrewAI Concepts/Crews and Flows: collaborative agent/task group, process,
  structured state, `@persist`, resume/fork
- Microsoft Agent Framework: AutoGen·Semantic Kernel의 direct successor와 migration

제품 문서가 제공하는 persistence를 업무 DB state나 external effect 증명으로 확대
해석하지 않았다. Crew는 공식 원문의 `collaborative group of agents`와 process
설명까지만 사용하고, 검증되지 않은 “자율적 역할 협업” 표현은 제거했다.

## Design decisions

### Six ownership boundaries

전체 선택 계약을 다음 여섯 경계로 고정했다.

| Boundary | Runtime candidate | Application obligation | Evidence |
| --- | --- | --- | --- |
| Turn | proposal/tool observation loop | admission, stop, budget | turn ID, terminal reason |
| Dispatch/policy | parse, lookup, hook | real authorization | argument hash, rule/grant |
| Checkpoint/resume | step snapshot, interrupt | stable identity, migration | revision, checkpoint ID |
| Approval/commit | wait and resume | exact action, expiry | actor, scope, revision, expiry |
| Effect | result event | idempotency, reconciliation | request key, receipt, state |
| Replay | runtime spans | fixture, grader, release gate | lineage, snapshot, verdict |

처음 수식은 경계마다 단일 `owner(b)`만 세어 runtime 쪽이 채워지면 application
쪽 빈칸을 숨길 수 있었다. 수정 수식은 경계와 책임 주체를 이중 합산한다.

```latex
G = \sum_{b \in B}\sum_{o \in O}
    \mathbf{1}[\operatorname{owner}(b,o)=\varnothing],
\quad O=\{R,A\}
```

본문 KaTeX에는 각 합과 indicator의 목적을 한글 underbrace로 붙이고, 바로 아래
`FormulaNote`가 `B`, `O`, `owner`, empty set, indicator와 두 번의 합을 각각
설명한다.

### Six boundaries to five execution phases

여섯 경계는 설계 점검표이고, worked path의 다섯 단계는 시간 순서다. 본문에 이
차이를 명시하고 checkpoint/resume, approval/commit, effect verification을
Prepare, Interrupt, Approve, Commit, Reconcile로 펼쳤다.

`PendingAction`은 다음을 분리해 저장한다.

- `stateRevision`: 무엇을 승인했는가
- `expiresAt`: 언제까지 유효한 승인인가
- `idempotencyKey`: 같은 효과를 어떤 한 건으로 묶는가
- optional `transportResult`: process death로 결과 자체가 없을 수 있음
- `expectedEffect`와 `reconciliation`: 실제 외부 상태에서 무엇을 확인하는가

Pending commit이 남은 채 재개되면 timeout event 유무와 상관없이 provider state를
먼저 읽는다. Provider가 idempotency key를 지원하지 않으면 application operation
ledger와 lock이 중복 효과를 막아야 한다.

### Runtime ownership lab

초기 Viz는 `parallel`이 선택되면 항상 crew 하나를 반환해 approval, replay 또는
data 보장을 화면에서 지웠다. 수정 Lab은 필요한 실행 성격을 독립적으로 계산한다.

```text
durability/safety -> graph
data lineage      -> data workflow
parallel workers  -> crew coordination
```

둘 이상이면 primary family와 companion family를 함께 표시한다. 선택한 scenario와
guarantee를 추천 근거로 렌더링하고, 모든 family의 runtime 후보와 application 잔여
책임을 합쳐 보여 준다. 숨겨진 checkbox에는 visible `peer-focus-visible` indicator를
연결했다.

## Information architecture corrections

Claude route 검토에서 top-down agent track이 운영 증거 사슬을 중간에서 끊는 것을
발견했다. 다음 노드를 추가했다.

```text
evaluation
  -> decision log
  -> policy/telemetry implementation
  -> bounded recovery
```

`agent-runtime-current-first`에도 평가에서 실패를 찾은 뒤 decision log,
telemetry와 recovery evidence로 닫는 분기 문장을 추가했다.

## Context Manager recovery protocol

과거 Context Manager 500/timeout 검증 공백과 이번 글을 한 queue로 간주하지 않았다.
검증 범위를 IA, owner, source, Viz와 post-edit delta로 나눴다.

Receipt는 다음 조건을 모두 만족할 때만 채택했다.

```yaml
http: 200
ok: true
worker: claude-code:sonnet
attempt_ok: true
result: substantive
```

Broad request의 code 143은 결론으로 해석하지 않았다. ReAct, A2A, action authority,
framework Viz를 더 작은 packet으로 분해해 모두 valid replacement를 만들었다.

최종 post-edit closure까지의 누계:

- Context Manager 저장 호출 56건
- strict-valid Sonnet receipt 52건
- code 143 invalid 4건
- invalid를 대체하지 못한 범위 0건
- 새 HTTP 500 0건
- strict-valid verdict: ACCEPT 23건, REVISE 29건

마지막 구현 정합성 batch는 orchestration, recovery, telemetry, session을 각각
`ACCEPT`했다. XML은 첫 검증에서 무출처 depth, regex fallback, 고정 token overhead와
중복 Detail Viz 때문에 `REVISE`였고, 이를 제거한 전체 디렉터리 재검증은
`ACCEPT`했다. 모든 audit packet의 검증 전후 source hash는 동일했다.

원장:

- `.codex-tmp/claude-recovery-all-pending-2026-07-28/ledger.md`
- `.codex-tmp/claude-recovery-all-pending-2026-07-28/machine-summary.json`
- `.codex-tmp/claude-recovery-all-pending-2026-07-28/historical-invalid.md`

## Applied review findings

이번 batch에서 즉시 반영한 항목:

1. Approval expiry를 type, prose, evidence와 test path에 추가
2. Commit 중 process death도 restart 시 무조건 reconcile
3. Provider 미지원 idempotency의 local ledger/lock 책임 추가
4. Idempotency와 invariant를 첫 사용 전에 정의
5. 여섯 ownership boundary와 다섯 execution phase의 bridge 추가
6. Owner 수식을 runtime/application 이중 합으로 교정
7. 복합 guarantee Viz에서 primary/companion과 통합 책임 보존
8. Recommendation reason과 keyboard focus visibility 추가
9. CrewAI 문구를 공식 source 범위로 축소
10. Agent top-down route에 decision log, policy와 recovery 연결
11. Permission→shell 거부 시 실행 함수에 진입하지 않는 negative path 명시
12. MCP Streamable HTTP 문장을 공식 상세 규격이 직접 증명하는 범위로 수정
13. Agent selection의 점수·cutoff를 제거하고 실제 alias normalization과 fixed tool
    branch만 남김
14. Delegation의 deadline·lease·late merge를 구현 사실에서 제거하고 unsupported
    contract로 명시
15. Recovery를 scenario별 단일 counter와 현재 `max_attempts=1`에 맞게 다시 구현
16. Telemetry를 동기 `record`, unbounded memory `Vec`, event별 JSONL
    `writeln + flush`에 맞게 다시 구현
17. Session을 실제 필드와 `Text | ToolUse | ToolResult`, snapshot+append,
    256 KiB rotation, workspace mismatch 검사로 다시 작성
18. XML을 권한·보안 경계가 아니라 의미 구조 경계로 한정하고 중복 Overview Viz 제거
19. hooks·permissions provenance를 한 commit처럼 보이게 하지 않고 파일별 byte-identical
    commit bundle로 교정
20. XML의 중복 Detail Viz 5개, 가짜 포맷 우열 점수, 고정 depth·token overhead와
    regex fallback을 제거
21. XML 출력 검증을 transport, syntax, schema, semantic failure로 분리하고 실제
    parser·validator·bounded retry 책임을 연결

## Implementation-attribution correction

후속 Claude 검증에서 가장 큰 오류는 레이아웃이나 문장 표현이 아니라 구현 귀속이었다.
이해하기 좋은 production 설계안을 만들면서 다음 기능을 현재 Rust가 이미 제공하는
것처럼 연결했다.

- delegation score, cutoff, lease, deadline와 late-result merge
- recovery lane별 독립 counter와 다회 retry
- telemetry bounded queue, drop-oldest, batch와 HTTP exporter
- Session의 권한 로그, tool-call 전용 필드와 durable effect 증명

교정 순서는 다음과 같다.

```text
authoritative source
  -> observable branch/state/type
  -> invariant that the source actually proves
  -> learner-facing prose and Viz
  -> unsupported production requirement
```

현재 구현이 제공하지 않는 기능은 삭제하거나 “production 확장 시 결정할 계약”으로
분리했다. 설계 품질과 구현 정합성을 한 축으로 평가하면 그럴듯한 허구가 생기므로,
앞으로 factual attribution과 production recommendation은 별도 review packet으로
검증한다.

## Verification

- Focused ESLint for this batch: pass
- Repository-wide ESLint: unrelated concurrent/pre-existing files에서 657 errors,
  4 warnings로 실패. 이 batch 파일에는 동일 오류가 없음
- Production Vite build: pass, existing large chunk warnings only
- `tests/agent-ownership-contract.spec.ts`: 13/13 pass
- Narrative audit: 1 route × desktop/tablet/mobile, errors 0, warnings 0
- Viz audit: 1 route × desktop/tablet/mobile, errors 0, warnings 0
- AI learning-flow audit:
  - registered 300
  - release blockers 0
  - formula gaps 0
  - table-first 0
  - enrichment backlog 75
- Browser interaction:
  - `고위험 변경 + 병렬 역할` keeps durable graph and crew coordination together
  - graph effect reconciliation and crew worker isolation both remain visible
  - `짧은 답변 + no guarantee` returns direct API + application loop
- 390/768/1440:
  - document horizontal overflow 0
  - runtime lab overflow 0
  - KaTeX errors 0
  - formula box scroll width equals client width
- Expanded Claw Viz audit:
  - 13 routes × desktop/mobile
  - agent, MCP, recovery, telemetry, session과 XML semantic surface 포함
  - document horizontal overflow 0
  - Viz/control/foreignObject clipping 0
- Production deployment:
  - `cm-blog.service` restart: 2026-07-29 00:44:12 KST, active
  - `dist/index.html` and public `/lab/blog/` SHA-256:
    `58468802e6cf9d065ccce93888049bb0ffd33c51875dd4df1297f658eafdb639`
  - 10 target article routes: HTTP 200
  - public `agent-ownership-contract.spec.ts`: 13/13 pass
  - public 13-route desktop/mobile Viz audit: failures 0

Artifacts:

- `.codex-tmp/agent-frameworks-formula-revised-mobile.png`
- `.codex-tmp/agent-frameworks-lab-combined-mobile.png`
- `.codex-tmp/agent-frameworks-narrative-audit-revised.json`
- `.codex-tmp/agent-frameworks-viz-audit-revised.json`
- `.codex-tmp/ai-learning-flow-agent-frameworks-revised.json`

## Small-model procedure

4B·9B 모델에는 “framework 글을 깊게 써라”라고 요청하지 않는다.

1. One hard failure fixture를 준다.
2. `observed source fact, invariant, runtime owner, application owner, evidence`
   다섯 필드 IR을 채우게 한다.
3. 공식 source claim은 한 제품 또는 한 문서 family씩만 검증한다.
4. Feature name을 허용하지 않고 `state before, event, state after, effect proof`를 요구한다.
5. Viz는 input state, source-backed transition, invalid state, visible invariant,
   unsupported production requirement 다섯 필드로 설계한다.
6. Reviewer는 factual attribution, production recommendation, pedagogy,
   runtime safety와 Viz/math packet을 분리한다.
7. Invalid transport는 verdict가 아니라 retry target으로 기록한다.
8. Post-edit delta만 다시 보내고 통과한 전체 문맥은 반복하지 않는다.
9. Playwright가 390/768/1440에서 overflow, noninitial state와 formula pairing을 검사한다.
10. 현재 코드가 증명하지 않는 좋은 아이디어는 `implemented`로 쓰지 않고
    `design requirement`로 표시한다.
11. 완료 후 remaining finding을 current route blocker와 deferred backlog로 분리한다.

이 절차는 큰 모델의 암묵적 추론을 작은 typed contract, 한 개의 반례와 기계 검증으로
대체한다.
