# Practical model adaptation and agent runtime reconstruction

Date: 2026-07-24 KST

## Scope

`ai-practical-llm` 아래의 두 글을 독립적인 production question으로 재구성했다.

```text
모델 행동을 바꾸는 경로
실패 책임 층
→ LoRA update geometry
→ QLoRA precision and memory ledger
→ SFT template and loss mask
→ ablation
→ adapter or merged release

에이전트 runtime을 움직이는 경로
single-agent baseline
→ split gate
→ typed state and reducer
→ bounded routing and termination
→ checkpoint, retry, approval and idempotency
→ trace evaluation
→ safe action boundary
```

두 글은 같은 collection에 있지만 선수 관계가 없다. 기존 slug는 유지했다.

- `lora-finetuning`
- `multi-agent-implementation`

설계 원장은
`src/pages/articles/ai/content-specs/practical-model-adaptation-agents.md`다.

## Why this structure

기존 LoRA 글은 논문 용어, 고정 GPU 수치, 데이터 포맷과 merge recipe를 나열했지만 다음
연결이 부족했다.

- Fine-tuning으로 고칠 문제와 retrieval·runtime으로 고칠 문제의 구분
- `Delta W=(alpha/r)BA`의 shape, numeric update와 trainable parameter 계산
- Frozen base, NF4 storage, BF16 compute, adapter gradient와 optimizer state의 분리
- Chat template와 실제 labels tensor의 loss boundary
- Architecture-specific target modules와 한 축씩 바꾸는 ablation
- Adapter serving과 merge/re-quantization의 release 선택

기존 multi-agent 글은 역할·framework fact sheet에 가까웠고 다음 production contract가
빠졌다.

- Single-agent와 deterministic workflow 기준선
- State key별 writer, reducer와 conflict
- Success, failure, budget, recursion과 no-progress 종료
- `thread_id`, checkpoint, interrupt node 재실행과 idempotency
- Timeout 뒤 external side effect reconciliation
- Approval과 safety interlock
- 최종 답이 아니라 route·tool·state·synthesis span을 평가하는 trace

따라서 두 글 모두 `질문 → 책임 층 → mechanism → implementation contract → failure
evidence → release` 순서로 닫았다.

## Hard transfer questions

본문을 작성하기 전에 설계 원장에 비공개 문제 12개를 만들었다. 문제를 article에 그대로
복사하지 않고, 본문만 읽은 독자가 새로운 조건에서 같은 판단 축을 재구성할 수 있는지
검사했다.

### LoRA / QLoRA

1. `4096 x 4096`, `r=16` projection 한 개와 네 개의 trainable parameter를 계산할 수 있는가?
2. `(r=8, alpha=16)`과 `(r=32, alpha=64)`에서 scale과 update capacity를 구분할 수 있는가?
3. Train loss는 개선되지만 unseen-source exact format이 회귀할 때 원인을 네 갈래 이상
   분해할 수 있는가?
4. NF4 storage가 NF4 matmul이나 NF4 adapter gradient를 뜻하지 않는 이유를 설명할 수 있는가?
5. QLoRA adapter를 merged artifact로 출시할 때 precision과 re-quantization 검증 순서를
   작성할 수 있는가?
6. Target module과 data template를 함께 바꾼 run에서 mechanism claim을 할 수 없는 이유를
   설명할 수 있는가?

### Multi-agent runtime

1. 두 worker가 같은 `evidence` key를 갱신할 때 reducer 유무에 따른 state를 예측할 수 있는가?
2. PLC write 뒤 `interrupt()`를 호출한 node가 resume될 때 중복 action을 설명하고 고칠 수
   있는가?
3. Search-critique loop의 success, budget, recursion과 no-progress 종료를 정의할 수 있는가?
4. Manager bottleneck을 falsify하는 single-agent와 deterministic fan-out baseline을 설계할
   수 있는가?
5. Ticket 생성 성공 여부를 모르는 timeout에서 run ID, idempotency key, retry class와 receipt를
   묶을 수 있는가?
6. 품질은 오르고 cost와 safety violation도 오른 결과를 평균 하나로 release하면 안 되는 이유를
   설명할 수 있는가?

## Content decisions

### LoRA / QLoRA

- Frozen baseline과 behavior contract를 첫 산출물로 둔다.
- 최신 사실, 전문 vocabulary, 출력 행동과 runtime 병목을 다른 intervention으로 보낸다.
- `Delta W=(alpha/r)BA`와 `r(d_in+d_out)`을 한국어 underbrace와 symbol ledger로 설명한다.
- Rank와 alpha slider에서 실제 shape, parameter count와 한 원소의 scaled update가 함께 바뀐다.
- QLoRA를 frozen NF4 storage, block dequantized BF16 compute와 LoRA-only gradient로 분리한다.
- Double quantization의 `0.37 bit/parameter`, paged optimizer와 65B single-48GB-GPU 결과를
  QLoRA 원문 범위 밖의 보편 수치로 확장하지 않는다.
- Chat template, generation marker, `assistant_only_loss`, `-100` label mask와 split lineage를
  하나의 SFT contract로 묶는다.
- Wq/Wv, q/k/v/o와 `all-linear`를 서로 다른 실험 선택으로 설명한다.
- Quantized training object에 무조건 merge하지 않고, 호환되는 높은 정밀도 base에 합친 뒤
  필요하면 inference quantization을 별도 검증한다.

### Multi-agent runtime

- Single-agent와 deterministic workflow를 필수 기준선으로 둔다.
- 병렬성, context isolation과 측정 이득이 모두 있어야 split 후보가 된다.
- State key별 default overwrite와 explicit reducer를 구분한다.
- Evidence append가 충돌 해결은 아니므로 typed evidence와 reconcile node를 둔다.
- Route는 허용 node ID와 budget charge를 가진 typed decision으로 만든다.
- Business termination과 runtime recursion guardrail을 구분한다.
- Checkpoint가 external system을 rollback하지 않는다는 경계를 명시한다.
- Approval proposal node와 action node를 분리하고 stable idempotency key와 receipt를 남긴다.
- External document는 untrusted evidence이며 tool policy를 변경하지 못하게 한다.
- LangGraph의 reducer, `thread_id`, interrupt resume semantics와 CrewAI hierarchical manager
  requirement를 current official docs 범위로 설명한다.
- Manufacturing example은 sensor evidence를 병렬화하지만 설비 action은 deterministic
  interlock과 operator approval 밖에 둔다.

## Formula and Viz contract

새 Viz는 coordinate-heavy SVG 대신 responsive HTML/CSS, Lucide icon과 작은 state transition을
사용한다. `article svg text`는 0개다. 모든 lab은 `scroll-mt-24`를 가져 sticky navigation이
제목을 덮지 않는다.

새 interactive Viz:

- `AdaptationGateLab`: 관측 실패와 label access를 최소 intervention에 연결한다.
- `LoraGeometryLab`: rank·alpha가 shape, trainable count, scale과 numeric update에 미치는
  영향을 동시에 보여 준다.
- `QloraPrecisionLab`: storage, compute와 gradient 역할을 분리한다.
- `SftLossMaskLab`: full-sequence와 assistant-only labels를 token별로 비교한다.
- `AdapterReleaseLab`: 여러 adapter와 merge, quantized/high-precision base 조건을 비교한다.
- `AgentSplitGateLab`: task topology, context isolation과 measured gain으로 split을 결정한다.
- `ReducerTraceLab`: overwrite와 append reducer의 committed state 차이를 보여 준다.
- `ExecutionSafetyLab`: approval과 idempotency가 external action 안전 표시를 함께 결정한다.
- `AgentTraceEvalLab`: route, tool, state와 synthesis failure를 서로 다른 metric·fix에 연결한다.

390px 최종 수식 auto-fit scale:

- LoRA / QLoRA: `1.00`, `0.88`, `0.97`, `0.95`
- Multi-agent: `0.96`, `>=0.80`

첫 multi-agent termination 식은 `0.68~0.70`까지 작아져 두 줄 `aligned` 식으로 분리했다.
모바일, tablet과 desktop 모두 `>=0.80`을 test gate로 고정했다.

## Primary-source boundary

Article이 인용한 12개 source URL을 확인했고 모두 HTTP 200이었다.

- LoRA and QLoRA original papers
- Current PEFT LoRA, quantization and model-merging documentation
- Current TRL SFTTrainer documentation
- Current LangGraph graph API, persistence and interrupt documentation
- Current CrewAI process and flow documentation
- Anthropic multi-agent research engineering article

Library documentation은 2026-07-24 현재 API example로 취급하고 timeless guarantee로 쓰지
않았다. Anthropic 사례는 parallel research workload의 engineering evidence이며 모든 업무의
multi-agent superiority 근거로 확장하지 않았다.

## Context Manager and Claude evidence

Transport header가 `[claude-code:sonnet`으로 시작하는 응답만 Claude validation으로 채택했다.

### Initial parallel audit

- LoRA factual audit: 180432ms timeout, 미채택
- LoRA pedagogy/Viz audit:
  `[claude-code:sonnet · L3 · $0.0000 · 139372ms]`, FAIL
- Multi-agent current API audit:
  `[claude-code:sonnet · L3 · $0.0000 · 95568ms]`, FAIL
- Curriculum audit:
  `[claude-code:sonnet · L3 · $0.0000 · 110547ms]`, keep two independent paths

반영한 핵심 finding:

- Unscaled `BA`와 scaled `(alpha/r)BA`가 같은 old Viz 안에서 충돌했다.
- Numeric derivation, dtype triad와 adapter-vs-merge 선택이 없었다.
- NF4 quantile mark가 분포 한쪽에만 그려졌고 의미 label은 7px까지 작았다.
- Trainable parameter reduction을 전체 GPU memory reduction으로 잘못 연결했다.
- QLoRA 65B hardware, double-quant percentage와 fixed training-time claim이 틀리거나
  unsupported였다.
- LangGraph state가 자동 accumulate된다는 설명이 틀렸다.
- `thread_id`, interrupt node restart, idempotency, termination, retry와 CrewAI manager
  requirement가 빠졌다.
- Safety-critical action에 approval, ownership와 external receipt가 없었다.

### Split factual retries

- LoRA Overview + LoRA:
  `[claude-code:sonnet · L2 · $0.0000 · 135626ms]`, FAIL findings captured
- QLoRA + Data + Practice:
  `[claude-code:sonnet · L2 · $0.0000 · 113540ms]`, FAIL findings captured

### Post-rewrite parallel audit

- LoRA factual: 180419ms timeout, 미채택
- Multi-agent API·safety:
  `[claude-code:sonnet · L3 · $0.0000 · 139651ms]`, one Viz inconsistency
- Curriculum/UI: 180585ms timeout, 미채택

Multi-agent audit는 approval이 올바른 위치여도 idempotency key가 없을 때 old stage coloring이
external action을 안전하게 보이게 한다는 문제를 찾았다. External action과 commit 모두
`approval before AND stable idempotency`일 때만 안전 표시를 받게 수정했다.

### Final split re-audit

- LoRA eight-claim factual check:
  `[claude-code:sonnet · L2 · $0.0000 · 85248ms]`, PASS
- Path/metadata/test/LabShell/safety check:
  `[claude-code:sonnet · L2 · $0.0000 · 73150ms]`, PASS

Claude worker는 live web permission이 없어 current-doc claims를 자체 knowledge로 확인했다.
따라서 공식 URL의 live fetch와 HTTP status는 Codex가 별도로 확인했다.

## Verification before deployment

- Targeted ESLint: pass
- `git diff --check`: pass
- `tests/practical-model-adaptation-agents.spec.ts`: 7/7 pass
- `ai-practical-llm` authored path regression: 1/1 pass
- Responsive widths: 390, 768 and 1440px
- Horizontal document overflow: `<=1px`
- Display formula scale: all `>=0.80`
- Raw LaTeX outside KaTeX/code: none
- `article svg text`: none
- Nine interactive labs: state-transition assertions pass
- Source URLs: 12/12 HTTP 200
- Repository-local screenshot review: pass
- Claude final factual and UI/path/safety re-audit: pass
- `npm run build`: pass, Vite completed in 18.11s

`npx tsc -b`는 이번 파일 밖의 기존 repository errors 29개 때문에 전체 pass하지 못했다.
이번 변경 파일은 error list에 없었고 targeted ESLint와 Vite transform/build를 통과했다.

## Production evidence

- `systemctl --user restart cm-blog.service`: pass
- Service active from 2026-07-24 20:26:44 KST
- Two article routes and `?sub=ai-practical-llm`: HTTP 200
- Production article/Viz/formula suite: 7/7 pass
- Production authored-path regression: 1/1 pass

이 마일스톤은 source research, private transfer tests, reconstruction rationale, Claude
failure/success evidence, responsive Viz·formula assertions와 production deployment까지 닫혔다.
