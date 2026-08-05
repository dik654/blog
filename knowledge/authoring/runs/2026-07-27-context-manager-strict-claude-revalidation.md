# Context Manager strict Claude revalidation

Date: 2026-07-27 KST

## Objective

Context Manager 500/timeout 기간에 Claude 검증을 받지 못했거나, 결과 본문이 없는 예전 receipt만
남은 작업을 다시 검증한다. 단순히 호출 횟수를 채우는 것이 아니라 다음 조건을 모두 만족하는
receipt만 external review로 인정한다.

```yaml
accepted_receipt:
  http: 200
  ok: true
  decision.worker: claude-code:sonnet
  attempts[0].ok: true
  result: substantive
rejected:
  - code 143 timeout
  - empty result
  - wrong worker
  - header-only historical summary
```

## Context Manager diagnosis

- `cm-agent-api.service`, gateway, DB는 정상이다.
- 강제 `claude-code:sonnet` probe와 동시 2개 probe가 HTTP 200으로 성공했다.
- 최근 실패의 대부분은 endpoint 500이 아니라 180/240초 harness timeout과 code 143이었다.
- 현재 API는 worker exhaustion도 HTTP 200의 `ok:false` envelope로 반환한다.
- 서버 내부에 Claude queue/semaphore가 없으므로 caller에서 최대 동시 2개로 제한한다.

결론: 광범위한 audit를 같은 문장으로 재시도하지 않는다. source, equation, evidence, Viz, IA를
독립 packet으로 쪼개고 2개씩만 보낸다.

## Historical receipt reconciliation

예전 `knowledge/authoring/runs/*.json`에는 strict raw API envelope가 없었다. P3의
`.codex-tmp/claude-canonical-*` 10개만 strict receipt 조건을 만족했다. 이후 broad failure를
bounded retry로 대체한 범위는 다시 열지 않았다.

다시 검증할 우선 범위:

- `seq2seq`
- `attention-theory`
- `research-deepseek-v3-2-2025`
- `vision-promptable-segmentation-tracking`
- CoDaR 2026, RAG 2020
- current multimodal contract와 fusion/tokenization/objectives
- Janus paper와 Janus-Pro runtime
- pretraining/world-model handoff
- 최종 top-down IA와 Category renderer

## First strict queue

Raw receipts:

- `.codex-tmp/claude-missed-validation-2026-07-27/results/`
- `.codex-tmp/claude-missed-validation-2026-07-27/progress.jsonl`

18개 요청을 `xargs -P 2`로 실행했다. 10개가 strict-valid, 8개가 code 143 timeout이었다.
Timeout은 PASS나 failure finding으로 해석하지 않는다.

### Accepted PASS

- CoDaR: DCDS equation, pair evaluator, threshold routing, controlled shuffle, sign reversal,
  limitations와 routing-signal/truth-score 경계가 1차 출처와 일치했다.
- RAG 2020: RAG-Sequence/Token 순서, NQ/FEVER/index swap, Appendix C 100GB/36GB,
  원문의 728-dimensional 표기와 retrieval collapse가 일치했다.
- World-model handoff: Cosmos식 10D 예와 V-JEPA 2의 7D DROID action을 섞지 않았고,
  synthesis/canonical ownership과 finite stop rule이 일치했다.
- AI agents track: current, canonical, concepts, minimum foundations, implementation과
  `paper-react-2022` stop rule이 유효했다.

### Accepted findings and fixes

#### Seq2Seq

Observed:

- Attention bridge에 `alpha_t=softmax(e_t)`가 렌더링되지 않았다.
- Source reversal explorer가 이유를 설명하는 prose보다 먼저 나왔다.

Fixed:

- Score normalization과 context weighted sum을 함께 렌더링했다.
- Softmax를 쓰는 이유를 음이 아닌 합 1의 읽기 비율, 상대 score 보존, 미분 가능성으로 설명했다.
- “영어를 거꾸로 읽는 것이 자연스럽다”는 오해를 Viz 전에 차단했다.

#### Janus paper

Observed:

- Stage III SFT의 system/user prompt masking을 원문이 명시하지 않았다고 잘못 제한했다.
- Ablation E, SigLIP-only understanding-only MMBench 70.6이 빠져 D 69.4와의 잔여 1.2점
  차이가 보이지 않았다.

Fixed:

- Stage III는 answer token만 감독한다고 명시하되 Stage I/II에 같은 mask를 소급하지 않았다.
- A/B/C/D/E를 모두 복원하고 B-C, D-E가 각각 답하는 질문을 분리했다.

#### Multimodal fusion

Observed:

- Context ledger progress가 `total / 12`라는 임의 값이어서 max에서 100%가 아니며 실제 context
  사용률처럼 보였다.

Fixed:

- 이 fixture 전체 1,048 token을 분모로 사용한다.
- 막대가 fixture의 누적 비율임을 visible caption으로 밝히고 max에서 100%가 되게 했다.

#### Visual tokenization

Observed:

- 가장 어려운 straight-through/stop-gradient에 실행 Viz가 없었다.
- Formula는 squared L2인데 Lab은 plain L2 값을 표시했다.
- Codebook perplexity가 LM perplexity와 다른 의미인데 정의되지 않았다.

Fixed:

- Encoder 값을 움직이며 forward 교정, backward gradient 통로, reconstruction/codebook/
  commitment의 parameter ownership을 3단계로 추적하는 Lab을 추가했다.
- Lab 숫자를 squared L2로 바꾸고 같은 이름으로 표시했다.
- Codebook perplexity를 “실제로 고르게 쓰는 code 수”로 읽는 entropy 기반 진단값으로 정의했다.

#### Unified generation objectives

Observed:

- Model tab은 glossary 교체에 가까워 representation이 objective를 강제하는 결정을 시키지 않았다.
- Janus-Pro tab에 Janus-Pro 자체 1차 출처가 없었다.
- Mixed sequence에서 text token mask와 image span loss의 책임 단위가 예제로 풀리지 않았다.

Fixed:

- Discrete/continuous representation과 sequential/joint update를 직접 고르면 맞는 branch를
  찾아가는 decision Lab으로 확장했다.
- Janus-Pro arXiv 2501.17811을 별도 1차 출처로 추가했다.
- Prompt, image region, answer가 섞인 sequence에서 discrete code별 CE와 continuous span의
  diffusion/flow loss를 전환하는 responsibility-mask Lab을 추가했다.

#### Pretraining handoff

Observed:

- Current-to-runtime StopRule이 track owner인 `llm-pretraining-run` 대신 generic
  `training-pipeline`으로 이동했다.

Fixed:

- `current -> paper-chinchilla-2022 -> llm-data-engine -> llm-pretraining-run`과 같은
  runtime owner로 교정했다.

## Bounded retry queue

첫 큐의 8 timeout과 위 수정의 post-fix 검증을 19개 packet으로 다시 분할했다.

- Attention: math와 narrative 분리
- DeepSeek V3.2: mechanism과 evidence 분리
- Promptable vision: prose/source와 Viz 분리
- Janus runtime: code path와 Viz 분리
- Current multimodal: facts와 learning contract 분리
- 19 top-down tracks: 4개의 4~5 track 묶음
- Category renderer: article content를 제외한 rendering contract만
- Confirmed fixes, tokenization, objectives, pretraining: post-fix packet

Raw receipts:

- `.codex-tmp/claude-missed-validation-retry-2026-07-27/results/`
- `.codex-tmp/claude-missed-validation-retry-2026-07-27/progress.jsonl`

19개 중 17개가 strict-valid였고, `tracks-01-05`와 `category-rendering` 2개는 timeout으로
무효 처리했다. 유효한 검토에서 다음을 추가로 교정했다.

- Attention은 `d_k`, causal mask, padding mask, all-masked row의 NaN 경계를 prose와
  explorer보다 먼저 설명했다.
- DeepSeek V3.2의 general-agent/code-agent pipeline을 분리하고, IOI/ICPC filter와
  IMO/CMO refinement의 증거 소유권을 분리했다.
- Promptable vision은 Object identity, Embedding, Attention을 초보자 용어로 먼저 정의하고,
  direct source, misconception 경고, Viz 전 prose 순서를 고정했다.
- Janus-Pro runtime은 단계도와 코드 경로를 맞추고, `8×24×24 latent -> 384×384 RGB` decode
  경계를 명시했다.
- current multimodal contract의 source date와 evidence boundary를 정정했다.
- 19개 top-down route의 registry와 stop rule을 확인했다. 일부 “missing article” 판정은
  registry 선언과 참조 테이블을 혼동한 false positive였으므로 실제 `Article` 선언을 다시
  추적한 뒤 기각했다.

## Final retry and closure

두 번째 큐의 timeout과 수정 후 확인을 더 좁은 packet으로 재호출했다.

Raw receipts:

- `.codex-tmp/claude-missed-validation-final-retry-2026-07-27/results/`
- `.codex-tmp/claude-missed-validation-final-retry-2026-07-27/progress.jsonl`
- `.codex-tmp/claude-missed-validation-closure-2026-07-27/results/`
- `.codex-tmp/claude-missed-validation-closure-2026-07-27/progress.jsonl`

Final retry 9개 중 8개가 strict-valid였고 `track-knowledge-systems` 1개만 timeout이었다.
Closure 6개는 모두 HTTP 200, `ok=true`, `claude-code:sonnet`, first attempt success,
substantive result를 만족했다.

### Final accepted findings and fixes

#### LLM architecture route

Observed:

- Sidebar는 Dense -> KV -> MoE -> Hybrid를 약속하지만 route가 general Transformer에서 곧바로
  KV/MoE delta로 건너뛰었다.

Fixed:

- `llm-architecture-dense-transformers`를 general Transformer 다음, KV/MoE/hybrid 전에
  배치했다.

#### Integrated source checkpoints

Observed:

- On-device와 disaggregated serving에서 current와 canonical evidence가 같은 통합 아티클로
  연결되어 두 행이 중복처럼 보였다.
- Serving stop rule은 Mooncake 뒤의 Orca까지 필수 역사처럼 읽힐 여지가 있었다.

Fixed:

- Current/canonical에 서로 다른 owned section anchor를 부여했다.
  - On-device: `#export-contract`, `#partition-delegate`
  - Serving: `#kv-handoff`, `#routing-state`
- 링크 이름을 `통합 해설의 현재 변화 절`과 `통합 해설의 최소 기준점 절`로 구분했다.
- stage 이름을 `PRIMARY SOURCE CHECKPOINTS`로 바꿨다.
- mandatory history는 Mooncake 2024에서 끊고 Orca/queueing/VM/RDMA는 실제 trace가 요구할 때만
  여는 선택 기반으로 내렸다.

#### Codebook perplexity

Observed:

- “효과적으로 쓰는 code 수”라는 해석만으로는 숫자 1과 4가 왜 나오는지 계산할 수 없었고
  log base도 명시되지 않았다.

Fixed:

- `p_k=n_k/sum_j n_j`, `PPL_code=exp(-sum_k p_k log p_k)`를 렌더링했다.
- `log`가 자연로그임을 기호 설명에 넣었다.
- 한 code만 쓰면 1, 네 code를 25%씩 쓰면 4라는 계산을 prose로 먼저 풀었다.
- 높은 perplexity만으로 품질을 판정하지 않고 histogram, reconstruction, downstream 결과와
  함께 보도록 한계를 명시했다.

#### Mobile navigation and search

Observed:

- 390px에서 400px absolute search panel이 화면 왼쪽으로 잘렸다.
- menu, search, close control의 일부가 44px target보다 작았다.

Fixed:

- 모바일 search panel은 `fixed inset-x-3 top-16`, `sm` 이상에서만 400px absolute panel로
  전환한다.
- menu/search/close target을 모두 최소 `44×44`로 고정했다.
- 검색 결과가 바뀔 때 effect에서 state를 갱신하지 않고 input change와 함께 selected index를
  초기화한다.

### Closure PASS

- Knowledge Systems chain은 CoDaR current -> RAG 2020 canonical -> compiler/source/IR/RAG
  concepts -> probability/statistics -> watcher implementation 순서이며 중복 slug가 없다.
- Knowledge Systems 9개 slug는 모두 정확히 한 `Article` 선언으로 resolve된다. Curriculum
  reference와 `articleSlug` edge는 duplicate article이 아니다.
- Dense baseline의 위치와 registry가 일치한다.
- 네 integrated evidence anchor가 실제 DOM target으로 존재한다.
- `PRIMARY SOURCE CHECKPOINTS` 설명과 current/minimum row semantics가 일치한다.
- Codebook perplexity의 자연로그와 1/4 예시가 일치한다.
- 모바일 source inspection에서 search/menu/close target과 panel containment가 통과했다.
  실제 브라우저 검증은 아래 별도 gate에서 다시 수행했다.

## Private transfer checks

본문에 문제를 그대로 넣는 것이 아니라 author가 다음 문제를 풀 수 있는지로 깊이를 검사한다.

1. Seq2Seq attention에서 alignment score를 왜 raw weighted sum에 바로 쓰지 않고 softmax로
   바꾸는지 수학과 최적화 관점에서 설명할 수 있는가?
2. Janus D가 이해 전용 E에 가까워졌지만 “trade-off를 제거했다”고 단정할 수 없는 이유를
   ablation 숫자로 설명할 수 있는가?
3. VQ straight-through에서 forward 값은 code인데 backward gradient가 encoder로 가는 경로를
   계산 graph로 그릴 수 있는가?
4. 같은 mixed sequence에서 discrete image code는 위치별 CE를 받고 continuous image span은
   span-level diffusion/flow loss를 받는 이유를 representation contract로 설명할 수 있는가?
5. Scaling synthesis, Chinchilla canonical source, data engine, runtime article의 책임을 바꾸지
   않고 최신 연구를 어디에 추가해야 하는가?

## Small-model protocol

### 4B extractor

```yaml
input:
  source_span: one equation | table | figure | algorithm | code function | limitation
output:
  literal_claims: []
  symbols_shapes_units: []
  execution_order: []
  numeric_receipts: []
  explicit_limits: []
  source_addresses: []
reject:
  - cross-paper synthesis
  - unstated causal explanation
  - modern runtime attributed to an older paper
  - metric without dataset, baseline, direction, and scope
```

### 9B synthesizer

```yaml
input:
  current_goal: ""
  private_transfer_question: ""
  accepted_4b_packets: []
  existing_owner_article: ""
decision:
  - deepen_existing
  - create_canonical_source
  - create_missing_foundation
required:
  - why the question exists
  - term primer before jargon
  - intuition before math
  - Korean operation labels inside display equations
  - meaningful direct-manipulation Viz
  - exact evidence and limitations
  - source fact versus author inference
  - finite stop rule and forward handoff
```

### Reviewer gate

```yaml
accept_only_if:
  - private transfer question is answerable from the article
  - every exact fact has an owner and source address
  - no raw LaTeX or unreadably scaled formula remains
  - prose precedes every Viz
  - every interactive Viz changes a meaningful state or decision
  - mobile and desktop preserve the same information without horizontal scroll
  - timeout, empty result, and wrong worker are rejected
```

## Verification so far

- Focused ESLint: pass.
- Vite production build: pass. 기존 large-chunk warning은 유지된다.
- Full `tsc -b`: fail. 이번 변경 파일에는 오류가 없지만, 동시에 진행 중인 다른 worktree 변경의
  30개 기존 오류가 남아 있다. 대표적으로 blockchain difficulty union, legacy Viz prop,
  `PrimerItem`, practical tabular slider typing이다. 이 작업에서 소유하지 않은 파일은 되돌리거나
  임의 수정하지 않았다.
- Context Manager regression Playwright: 5/5 pass.
- Multimodal mobile/tablet/desktop, interaction, zoom Playwright: 5/5 pass.
- Top-down schema contract: 2/2 pass.
- 19개 current-first route를 390px와 1440px에서 순회하고 integrated evidence anchor를 확인한
  Playwright: 3/3 pass.
- Captured screenshots:
  - `.codex-tmp/strict-revalidation-search-mobile.png`
  - `.codex-tmp/strict-revalidation-route-mobile.png`
  - `.codex-tmp/strict-revalidation-route-desktop.png`
- Screenshot browser audit: mobile/desktop document horizontal overflow `0`; mobile search panel
  `x=12`, `right=378`, `width=366` at 390px.

## Deployment and public acceptance

- `cm-blog.service`: 2026-07-27 21:56:05 KST 재시작 후 active/running.
- `dist/index.html`, service-local HTML, public HTTPS HTML SHA-256:
  `df90d2591a25cd6385bf7754a9a6a35994bf6574575d450e36fe42da7de4d5cb`.
- Public HTTP:
  - `/lab/blog/ai?sub=ai-llm-serving`: 200
  - `/lab/blog/ai/multimodal-visual-tokenization`: 200
  - `/lab/blog/ai/llm-disaggregated-serving`: 200
  - HTML이 참조하는 initial JS/CSS assets: 전부 200
  - legacy `/blog/`: `/lab/blog/`로 308
- Public Playwright:
  - Context Manager regressions + multimodal responsive/interaction: 10/10 pass.
  - 19개 route mobile-390/desktop + integrated evidence: 3/3 pass.
- Public screenshot: `.codex-tmp/strict-revalidation-public-search-mobile.png`.
- Public browser audit: document overflow `0`, search panel `x=12`, `right=378`, `width=366`,
  console error `0`, failed request `0`.
