# P3 foundational source closure

Date: 2026-07-27 KST

## Objective

현재 연구 경로에서 반복해서 전제하지만 내부에서 끝까지 복원하지 못한 네 source를 닫는다.

- Attention Is All You Need (2017)
- Proximal Policy Optimization Algorithms (2017)
- Training Compute-Optimal Large Language Models (2022)
- V-JEPA 2 (2025)

독자는 최신 목표에서 내려와 원문을 읽고 다시 현재 구현으로 올라갈 수 있어야 한다. 오래된 논문
목록을 계속 추가하는 것이 아니라, 현재 의사결정을 실제로 바꾸는 최소 source에서 하향 탐색을
멈춘다.

## Observed

- Transformer와 PPO route는 범용 six-section wrapper를 사용해 핵심 수식은 있었지만 exact
  evidence receipt, 실행 순서와 direct-manipulation Viz가 없었다.
- `llm-pretraining-scaling`은 현재 4B·9B 예산을 정하는 synthesis article이었다. Chinchilla의
  세 추정법, fitted constant와 matched-compute full run을 대신 소유할 수 없었다.
- `action-conditioned-world-dynamics`는 Cosmos식 10D contract와 V-JEPA 2의 7D DROID
  instantiation을 한 concept article 안에서 비교했다. Canonical V-JEPA 2 source로 쓰면 source
  attribution과 차원이 섞였다.
- Canonical source article은 기본 source 접힘 규칙 때문에 authored learning path에 명시해도
  핵심 순서에서 빠졌다.
- V-JEPA 2의 긴 단일행 KaTeX는 390px에서 overflow는 막았지만 10.66px까지 축소됐다.
- Transformer decoder mask는 이름만 있고 `Q2 -> K3`가 왜 차단되는지 위치별로 확인할 수 없었다.
- RAG 2020의 728-dimensional appendix 표기, retrieval collapse, 100GB/36GB는 Claude가
  의심했지만 primary PDF Appendix G/H/C 직접 대조 결과 모두 실제 원문 표기였다.

## Decision

### Reconstruct in place

`paper-transformer-2017`과 `paper-ppo-2017`은 기존 source identity를 유지하고 generic wrapper를
bespoke reconstruction으로 교체했다.

### Separate source identity

- `paper-chinchilla-2022`
- `paper-vjepa2-2025`

Practitioner synthesis와 paper reconstruction의 질문이 다르므로 별도 page로 만들었다. 기존
concept article에는 source boundary와 canonical handoff만 추가했다.

### Show only bounded canonical sources

`CategoryPage`는 authored learning path에 직접 명시된 source article만 핵심 순서에 포함한다.
따라서 Pre-training은 다음 네 단계가 된다.

1. 모델·Token 예산
2. 기준 원문 · Chinchilla
3. 데이터 신호
4. 학습 실행

임의의 더 오래된 paper는 여전히 선택 원문 영역에 접혀 있다.

## Reconstruction details

### Transformer

- Encoder self, masked decoder self, cross attention의 Q/K/V 소유자와 `SxS`, `TxT`, `TxS`
  shape를 분리했다.
- N=6, Post-LN, d_model=512, h=8, d_k=d_v=64, FFN 2048 ReLU와 positional encoding을
  원문 구성으로 고정했다.
- Table 1~3, base/big BLEU·FLOPs·parameter, optimizer·warmup·beam recipe를 exact receipt로
  만들었다.
- Decoder causal mask를 query-key grid로 만들어 `Q2,K2=0`, `Q2,K3=-infinity`를 직접
  확인한다.
- Table 3 head sweep은 head 수와 함께 `d_k=d_v=512/h`도 바뀐다는 조건을 표시했다.
- Attention 식의 `+M`은 Equation 1 literal이 아니라 Section 3.2.3 서술을 합친 실행식임을
  명시했다.

### PPO

- Signed clipping을 advantage `+1/-1`과 ratio slider로 직접 계산한다.
- Equation 9의 policy, plain squared value error와 entropy를 한 maximize objective로 복원했다.
- Algorithm 1의 rollout, GAE, K epoch, diagnostic, old-policy snapshot 순서를 분리했다.
- Adaptive-KL beta controller를 clip variant와 별도 알고리즘으로 복원했다.
- Table 1과 Table 2의 exact values, Figure 3의 여섯 baseline family를 표시했다.
- Original paper가 말하는 것은 Gaussian mean과 variable standard deviations까지다.
  State-independent log std, action bound 처리와 PPO2 value clipping을 2017 recipe로
  소급하지 않는다.

### Chinchilla

- Approach 1 training-curve envelope, Approach 2 IsoFLOP, Approach 3 parametric loss fit을
  독립적으로 비교한다.
- `E=1.69`, `A=406.4`, `B=410.7`, `alpha=.34`, `beta=.28`와 세 접근의
  `.50/.50`, `.49/.51`, `.46/.54` exponent를 복원했다.
- Kaplan `.73/.27`과 Chinchilla의 거의 같은 model/data allocation을 분리했다.
- Gopher 280B/300B와 Chinchilla 70B/1.4T를 `5.76e23 FLOPs`에서 matched-compute로 비교했다.
- MMLU 67.6/60.0, BIG-bench 65.1/54.4, 51/57 improvement와 full-run·power-law 한계를
  같은 evidence view에 둔다.

### V-JEPA 2

- 22M videos, 1M+ hours의 action-free JEPA와 DROID <62h의 action-conditioned stage를
  분리했다.
- 4s, 4fps, 16 frames, 15 transitions, 7D state/action, frozen `16x16x1408` feature와
  300M predictor를 실행 순서로 복원했다.
- Teacher forcing `T=15`, rollout `T=2`, Figure 6 설명용 `T=4`를 혼동하지 않는다.
- Image-goal L1 energy, CEM elite refit, first-action-only MPC와 two-lab deployment를
  연결했다.
- Table 2/3의 success, sample count와 latency를 함께 표시한다.
- 긴 수식은 prediction, target, error의 여러 행으로 나눠 모바일 글자 크기를 12px 이상으로
  유지했다.
- Pick-and-place는 두 sub-goal image와 한 final-goal image로 구분했다.
- Table 3 Cosmos baseline은 실제 Agarwal et al. 2025 source로 교정했다.

## Claude collaboration

모든 accepted result는 `ok=true`, `decision.worker=claude-code:sonnet`, substantive result 세
조건을 만족했다. Code 143 timeout과 empty result는 PASS로 세지 않았다.

| Audit | First result | Accepted result | Disposition |
|---|---:|---:|---|
| Transformer post-edit | PASS with P1/P2 | 170,314 ms, substantive | causal grid, `+M` provenance, head-dimension condition fixed |
| V-JEPA 2 post-edit | PASS with P1/P2 | 178,926 ms, substantive | Cosmos source and goal-image wording fixed |
| PPO post-edit | code 143 timeout | 141,660 ms concise retry, substantive PASS | three residual P2 source-boundary items fixed |
| Chinchilla post-edit | code 143 timeout | 145,291 ms concise retry, substantive PASS | accepted |

Claude receipt files:

- `.codex-tmp/claude-canonical-postedit-2026-07-27/`
- `.codex-tmp/claude-canonical-postedit-2026-07-27-retry/`

## Private transfer checks

이 질문은 본문 quiz가 아니라 authoring depth를 검사한다.

1. Decoder position 2가 position 3을 읽지 못한다는 사실을 score matrix와 softmax로
   증명할 수 있는가?
2. PPO에서 `A<0, r=.7`일 때 왜 selected objective가 `-.8`이고, `A<0, r=1.3`은 왜
   clip이 손해를 지우지 않는가?
3. 같은 training FLOPs에서 280B model을 300B token으로 학습하는 대신 70B model을
   1.4T token으로 학습하는 선택을 세 추정법으로 설명할 수 있는가?
4. V-JEPA 2가 action-free video pretraining만으로 robot command를 알 수 없는 이유와,
   62h보다 적은 interaction data가 어느 module만 바꾸는지 설명할 수 있는가?
5. V-JEPA 2 planner가 800개 candidate를 평가하고도 open-loop trajectory 전체를 실행하지
   않는 이유를 model error와 feedback 관점에서 설명할 수 있는가?

## Small-model reconstruction protocol

### 4B source extractor

```yaml
input:
  - one equation, algorithm, figure, table, appendix, or limitation span
output:
  literal_claims: []
  exact_symbols_and_shapes: []
  execution_order: []
  numeric_receipts: []
  experiment_scope: []
  explicit_limits: []
  source_addresses: []
reject:
  - cross-paper synthesis
  - unstated causal explanation
  - modern implementation attributed to the old paper
  - metric without dataset, baseline, direction, and scope
```

### 9B article synthesizer

```yaml
input:
  current_goal: ""
  private_transfer_question: ""
  accepted_4b_packets: []
  existing_owner_article: ""
decision:
  - reuse_and_deepen
  - separate_source_article
required_sections:
  - why the research question exists
  - concept primer before terminology
  - module and data ownership
  - intuition before mathematics
  - Korean operation labels inside each display equation
  - direct-manipulation mechanism Viz
  - exact evidence receipts and limits
  - source fact versus author inference
  - stop rule and current implementation handoff
```

### Reviewer gate

```yaml
accept_only_if:
  - every private transfer question is answerable from the article
  - canonical facts trace to exact source spans
  - no formula is raw LaTeX or unreadably scaled
  - every Viz has prose before it and a decision-changing interaction
  - mobile and desktop show the same information without horizontal scroll
  - a timeout, empty result, or wrong worker is rejected
```

## Reasoning trace

- Current synthesis used as canonical source -> paper-specific receipts disappear -> separate Chinchilla and
  V-JEPA 2 identities.
- Source article hidden by prefix rule -> bounded minimum paper missing from route -> authored path source
  exception.
- V-JEPA 2 formula fits by shrinking -> technically no overflow but visually unreadable -> semantic line split.
- Causal mask named but no position proof -> private transfer question cannot be solved -> query-key grid.
- Claude questions RAG appendix facts -> do not soften from memory -> download primary PDF and verify exact
  appendix text.
- Broad Claude retries timeout -> do not count -> reduce file and question scope -> accepted substantive retry.
- Automated contracts pass but screenshot sentence is stale -> visual review remains required -> dynamic
  mode-specific explanation plus regression assertion.

## Local verification

- Focused ESLint: pass.
- TypeScript `--noEmit`: pass.
- Vite production build: pass, 8,895 modules; existing large-chunk advisory only.
- P3 canonical source + pre-training route Playwright: 13/13 pass.
- Viewports: 360, 390, 768 and 1440 widths.
- Document and Viz horizontal overflow: 0.
- Visible KaTeX outside formula host: 0.
- Minimum formula scale: at least 0.70.
- Minimum visible formula and Viz text: 12px.
- Raw LaTeX and `.katex-error`: 0.
- 12 interactive labs and causal-mask position assertions: pass.
- Eight full-page screenshots and focused causal-mask screenshots inspected.

## Production closure

- `cm-blog.service`: 2026-07-27 20:17:27 KST restart 후 active/running.
- Public HTTPS P3 canonical source + pre-training route Playwright: 13/13 pass.
- Public viewports: 360, 390, 768 and 1440 widths.
- JavaScript: `index-BvWqxn2u.js`.
- CSS: `index-1eN0oICZ.css`.
- `dist/index.html`, service-local response와 public HTTPS response SHA-256:
  `4e12413afa3f2d700da1f8d34bc38d622cc643a1882a0af223f09e304cb79193`.
- Public paths:
  - `/lab/blog/ai/paper-transformer-2017`
  - `/lab/blog/ai/paper-ppo-2017`
  - `/lab/blog/ai/paper-chinchilla-2022`
  - `/lab/blog/ai/paper-vjepa2-2025`
  - `/lab/blog/ai?sub=ai-llm-data`
  - `/lab/blog/ai?sub=ai-world-models`
