# P1 canonical source closure

Date: 2026-07-27 KST

## Objective

`llm-post-training`, `generative-models`, `ai-agents`의 최신 목표에서 내려가는 첫 canonical
source를 내부 글로 닫는다. 독자는 오래된 논문 목록을 모두 읽지 않고도 InstructGPT, DDPM,
ReAct의 최소 mechanism·evidence·failure boundary를 이해하고 현재 구현 글로 다시 올라갈 수
있어야 한다.

## Observed

- 세 track의 canonical source는 URL만 있고 내부 `articleSlug`가 없었다.
- `rlhf`는 이미 InstructGPT의 SFT, K-way preference, reward model, PPO-ptx를 독립 질문으로
  소유했지만 critic 초기화와 no-discount 계약이 빠져 있었다.
- `diffusion-models`는 직관과 현대 lineage는 있었지만 exact posterior, `L_simple`의 의도적
  reweighting, Algorithm 2와 2020 evidence receipt가 얕았다.
- 현재 agent runtime 글은 ReAct 원문의 QA environment와 action-space 연구 질문을 대신
  소유할 수 없었다.
- Broad context-manager 검증은 긴 packet에서 code 143 timeout이 났다. 응답 없음은 pass가 아니다.
- ReAct의 첫 post-fix 검증은 상한 비율을 “넘은 비율”로 잘못 읽은 문장과 source에 없는
  Wikipedia trace를 발견했다.
- 후속 evidence 검증은 Table 2의 수작업 failure taxonomy가 HotpotQA-only임을 발견했다.

## Inference

1. 동일한 source identity와 질문을 기존 글이 이미 소유하면 새 글보다 해당 글을 깊게 만드는 편이
   독자의 아티클 수와 중복을 줄인다.
2. 현재 runtime contract와 원 논문의 실험 environment가 다르면 source article을 분리해야
   claim boundary와 시대 차이를 보존할 수 있다.
3. 수식만 정확해도 충분하지 않다. 독자는 posterior 계수, objective weight, sampler branch를
   값을 바꿔 보며 서로 다른 역할로 구분해야 한다.
4. 평균 점수만 나열하면 ReAct의 핵심인 failure-mode 교환과 hybrid fallback을 놓친다.
5. Context-manager timeout은 작은 source range와 단일 책임 prompt로 분할해야 검증 가능한
   artifact가 된다.

## Decision

- InstructGPT canonical은 기존 `rlhf`를 재사용하고 critic initialization, `γ=1`, old/reference
  policy 차이를 보강한다.
- DDPM canonical은 기존 `diffusion-models`를 재구성한다.
  - exact posterior와 한국어 operation note
  - `σ²=β` VLB 예시와 `L_simple` 비교
  - `σ²=β̃` Algorithm 2 one-step executor
  - CIFAR-10/Table 2 evidence와 reproduction boundary
- ReAct는 `paper-react-2022`로 분리한다.
  - thought/action/finish state transition
  - exact `search → lookup → finish` Milhouse trace
  - HotpotQA/FEVER evidence와 hybrid direction
  - HotpotQA-only manual failure analysis
  - ALFWorld/WebShop와 production handoff
- 모든 새 display formula 아래 한국어 `FormulaNote`를 둔다.
- 모든 lab은 prose 뒤에 놓고 12px 이상 text, 390/768/1440 width contract를 적용한다.

## Claude source packets

- InstructGPT data/RM: `[claude-code:sonnet · L1 · $0.0000 · 64132ms]` — PASS.
- InstructGPT PPO/eval: `[claude-code:sonnet · L1 · $0.0000 · 137452ms]` — source correction.
- DDPM mechanism: `[claude-code:sonnet · L1 · $0.0000 · 93074ms]` — PASS.
- DDPM evidence/Algorithm 2: `[claude-code:sonnet · L1 · $0.0000 · 71292ms]` — PASS.
- ReAct mechanism: `[claude-code:sonnet · L1 · $0.0000 · 138217ms]` — MUST FIX.
- ReAct cap/trace recheck: `[claude-code:sonnet · L1 · $0.0000 · 35986ms]` — PASS.
- ReAct Table 1–2 evidence: `[claude-code:sonnet · L1 · $0.0000 · 120518ms]` — P1 scope.
- ReAct finetuning/decision/limits: `[claude-code:sonnet · L1 · $0.0000 · 97877ms]` — PASS.
- ReAct HotpotQA scope post-fix: `[claude-code:sonnet · L1 · $0.0000 · 46476ms]` — PASS.
- DDPM variance-choice post-fix: `[claude-code:sonnet · L1 · $0.0000 · 51068ms]` — PASS.
- Track/ledger/run-record identity: `[claude-code:sonnet · L1 · $0.0000 · 29156ms]` — PASS.

Broad ReAct evidence/limits packet은 180413ms code 143 timeout으로 폐기했다. 같은 source 범위를
세 개의 bounded packet으로 대체했으며, 실패 호출 자체를 accepted review로 세지 않는다.

## 4B extraction packet

```yaml
source: instructgpt | ddpm | react
range: one named section, algorithm, table, or appendix span
extract:
  mechanism_steps: []
  exact_equations: []
  exact_numbers: []
  experimental_scope: []
  explicit_limitations: []
  source_addresses: []
prohibited:
  - cross-paper synthesis
  - curriculum placement
  - unstated causal explanation
  - production recommendation
```

4B extractor는 한 source range의 literal fact와 address만 반환한다. 숫자와 수식에는 section,
equation, algorithm 또는 table address가 반드시 붙고, 찾지 못한 항목은 `NOT FOUND`로 남긴다.

## 9B synthesis packet

```yaml
target_question: one difficult private transfer problem
fact_packets: [bounded_source_packets]
existing_articles: [owned_concepts_and_foundations]
required:
  - why the research question exists
  - execution order and ownership boundaries
  - intuition before mathematics
  - equation plus Korean operation note
  - interactive viz specification
  - evidence versus inference
  - failure and stop rule
  - next internal article
```

9B reviewer는 source가 다른 score와 환경을 합치지 않는다. Existing article이 같은 독립 질문을
소유하는지 먼저 판정하고, `reuse_and_deepen` 또는 `separate_source_article` 중 하나와 근거를
반환한다. Codex/orchestrator가 track edge, final prose, browser QA와 deployment를 소유한다.

## Reasoning trace

- Canonical URL only observed → novice exits before reconstruction inference → internal source edge decision
  → route-link test.
- Existing RLHF pipeline observed → duplicate article risk inference → reuse/deepen decision
  → critic/no-discount exact-line audit.
- Diffusion intuition but missing posterior/sampler observed → implementation transfer gap inference
  → exact equation and three labs decision → formula/interaction test.
- Agent runtime and ReAct environment differ observed → source identity collision inference
  → separate ReAct article decision → current/runtime handoff.
- Broad timeout observed → unverifiable closure inference → three bounded packets decision
  → each accepted output recorded independently.
- HotpotQA-only Table 2 observed → FEVER overgeneralization risk inference → scope label in prose,
  caption and misconception → exact post-fix recheck.

## Local verification

- Focused ESLint: pass.
- Vite production build: pass, 8,877 modules; existing large-chunk advisory only.
- P1 canonical source, route schema and generative formula continuity: 19/19 pass.
- Full current-first research route suite: 16/16 pass at 360, 390, 768 and 1440 widths.
- DDPM/ReAct source contract:
  - document horizontal overflow 0.
  - clipped math 0, raw LaTeX 0.
  - minimum lab text 12px.
  - Formula pairs/notes: DDPM 5/6, ReAct 1/1.
- Mobile visual inspection:
  - ReAct transition tabs are one row and state bands remain inside 390px.
  - DDPM objective tabs, slider, evidence receipt and caption are not clipped.
  - common fullscreen control does not cover labels or interaction targets.

Service restart and public URL QA are appended only after they complete.

## Production closure

- `cm-blog.service`: 2026-07-27 16:10:13 KST 재시작 후 active/running.
- Public P1 Playwright:
  - canonical track links: pass.
  - DDPM/ReAct 390, 768, 1440 responsive contracts: 3/3 pass.
  - InstructGPT critic/no-discount contract: pass.
  - total 5/5 pass.
- Public and local production assets:
  - JavaScript: `index-DAJfYbZj.js`.
  - CSS: `index-CAK-l_u9.css`.
  - `dist/index.html`, service-local response and public HTTPS response SHA-256:
    `bbd7ad9c76276d6a36aa276f92cc9d21b1dbd8305756a6ee221d3eb931521bf0`.
- Public paths:
  - `/lab/blog/ai/rlhf`
  - `/lab/blog/ai/diffusion-models`
  - `/lab/blog/ai/paper-react-2022`
  - `/lab/blog/ai?sub=ai-llm-post-training`
  - `/lab/blog/ai?sub=ai-generative`
  - `/lab/blog/ai?sub=ai-agents`

This closes the first P1 canonical-source batch. The broader curriculum audit remains active; the next
ledger priority is the P2 domain canonical set rather than expanding farther into historical papers.
