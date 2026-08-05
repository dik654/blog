# Top-down internal source spine ledger

감사일: 2026-07-27

## 목적

이 문서는 `src/content/ai/topdownResearchTracks.ts`에 선언된 current/canonical source가 블로그 내부의 재구성 아티클로 이어지는지 기록한다. 공식 원문 링크만 있어도 URL은 열리지만, 초심자는 쉬운 설명·수식 해설·figure 재구성·증거 경계 없이 원문으로 이탈한다. 따라서 `articleSlug`가 없는 source는 학습 경로가 완성된 것으로 보지 않는다.

## 이번 결정

먼저 전역 UI 순서를 `현재 목표 → 핵심 개념 → 최소 기반 → 원문 근거 → 구현`으로 고정했다. Current source의 URL·날짜를 1단계에서 먼저 보여 주면 전문 용어와 논문으로 너무 빨리 이탈하므로, source metadata와 link는 4단계 Evidence spine 안으로 옮겼다. 핵심 개념과 최소 기반도 좌우 동급 컬럼에서 순차 band로 바꿨다.

첫 source reconstruction batch는 `knowledge-systems`를 선택했고, 두 번째 batch는
`robot-ai`를 닫았다.

- 이유 1: 사이드바 최상단 목표 경로이며 current와 canonical 내부 글이 모두 없었다.
- 이유 2: 사용자가 요구한 논문·영상·웹·코드 Knowledge Compiler와 자동 연구 추적의 직접 기반이다.
- 이유 3: CoDaR 2026은 “무조건 decomposition/RAG”라는 현재 경로의 잘못된 기본값을 바꾼다.
- 결과: `research-codar-2026`, `paper-rag-2020`을 추가하고 두 evidence link를 연결했다.
- Robot current는 공식 sitemap과 publication page를 다시 대조해 π0.5가 아니라
  2026-04-16의 π0.7로 교체했다.
- 결과: `research-pi07-2026`, `paper-openvla-2024`를 추가했다. π0.5·π*0.6·MEM·BAGEL은
  π0.7의 lineage로 본문에서 읽고 필수 source article로 늘리지 않았다.

## P1 canonical source closure

첫 P1 세 경로는 2026-07-27에 닫았다. 무조건 새 글을 만드는 대신 기존 글이 원문 질문을 실제로
소유하는지 먼저 읽고, 독립된 source identity가 필요한 경우만 분리했다.

- `llm-post-training` → InstructGPT (2022)
  - 기존 `rlhf`가 SFT → preference ranking → reward model → PPO-ptx를 이미 하나의 독립 질문으로
    소유하므로 canonical pointer를 재사용했다.
  - 원문 대조에서 critic/value를 RM에서 초기화했다는 사실과 no-discount `γ=1` 계약을 보강했다.
- `generative-models` → DDPM (2020)
  - 기존 `diffusion-models` 안에 exact posterior, VLB와 `L_simple`, Algorithm 2, Table 1–2와
    2020 recipe를 깊게 편입했다.
  - 현대 diffusion으로 넘어가는 기존 서사를 유지하되 DDPM의 variance 선택과 evidence boundary를
    별도 formula·lab·receipt로 분리했다.
- `ai-agents` → ReAct (2022)
  - 현재 agent runtime 글과 연구 질문이 달라 `paper-react-2022` 원문 재구성 글을 새로 만들었다.
  - language/environment action, Wikipedia API, QA·decision evidence, finetuning과 production
    handoff를 한 source identity 안에서 닫았다.

### P1 bounded Claude closure

- InstructGPT data/RM: `[claude-code:sonnet · L1 · $0.0000 · 64132ms]` — PASS.
- InstructGPT PPO/eval: `[claude-code:sonnet · L1 · $0.0000 · 137452ms]` — source-corrected;
  `γ` 정의, no discount, RM-initialized critic을 반영했다.
- DDPM mechanism: `[claude-code:sonnet · L1 · $0.0000 · 93074ms]` — PASS.
- DDPM evidence/Algorithm 2: `[claude-code:sonnet · L1 · $0.0000 · 71292ms]` — PASS.
- ReAct mechanism 첫 post-fix: `[claude-code:sonnet · L1 · $0.0000 · 138217ms]` — MUST FIX.
  step-cap 비율의 뜻과 source에 없는 Wikipedia trace를 수정했다.
- ReAct exact cap/trace recheck: `[claude-code:sonnet · L1 · $0.0000 · 35986ms]` — PASS.
- ReAct Table 1–2 evidence: `[claude-code:sonnet · L1 · $0.0000 · 120518ms]` — P1.
  Table 2가 HotpotQA-only 수작업 분석임을 본문·Viz·misconception에 명시했다.
- ReAct finetuning/decision/limits: `[claude-code:sonnet · L1 · $0.0000 · 97877ms]` — PASS.
- ReAct HotpotQA scope post-fix: `[claude-code:sonnet · L1 · $0.0000 · 46476ms]` — PASS.
- DDPM variance-choice post-fix: `[claude-code:sonnet · L1 · $0.0000 · 51068ms]` — PASS.
- Track/ledger/run-record identity: `[claude-code:sonnet · L1 · $0.0000 · 29156ms]` — PASS.

Broad ReAct evidence/limits call은 180413ms code 143 timeout이라 closure로 세지 않았다. 같은 범위를
cap/trace, Table 1–2, finetuning/decision/limits 세 packet으로 나눠 병렬 재검증했다.

## P2 domain canonical source closure

2026-07-27 첫 세 경로를 닫았다. 기존 글과 source question이 겹치는지 먼저 읽고
`separate_source_article`과 `reuse_and_deepen`을 나눴다.

- `llm-interpretability` → Mathematical Framework for Transformer Circuits (2021)
  - 현재 readout·SAE·causal intervention 글과 달리 weight-level virtual weight, QK/OV와
    induction composition 자체가 독립 질문이므로 `paper-transformer-circuits-2021`로 분리했다.
  - 2022 correction을 포함해 잘못 계산된 composition diagram과 유지된 K-composition 경계를
    본문에 기록했다.
- `open-image-video` → Latent Diffusion (2021)
  - 기존 `diffusion-models`가 DDPM에서 latent runtime으로 올라가는 질문을 이미 소유하므로
    같은 글 안에 perceptual/semantic compression, latent objective, condition interface와
    source-scoped 2.7×/1.6× receipt를 편입했다.
- `computer-vision` → DETR (2020)
  - 기존 `deformable-detr`의 sparse correction을 이해하려면 바로 앞의 set prediction 병목을
    같은 서사에서 읽는 편이 자연스러워 matching cost, Hungarian training loss, query execution,
    AP/schedule/ablation을 원문 section으로 재구성했다.

### 남은 P2 공백

- `document-ai` → Donut (2021): 별도 OCR-free source article
- `time-series` → DeepAR (2017): 별도 global probabilistic forecasting source article
- `speech-audio` → Moshi (2024): 별도 full-duplex speech source article

남은 글도 현재 개념 article과 설명을 반복하지 않는다. 원문의 연구 질문, 수식·algorithm,
figure/data flow, ablation, appendix, 재현 영수증과 claim boundary만 소유한다.

### P2 bounded Claude closure

- LDM source/evidence: `[claude-code:sonnet · L2]` — PASS. `f`, latent·conditional objective,
  2.7×/1.6× inpainting scope와 limitation을 대조했다.
- DETR broad retry: `[claude-code:sonnet · L2]` — 두 finding.
  - ∅ target끼리 다른 matching cost를 보이던 fixture를 prediction-independent constant로 고쳤다.
  - Auxiliary loss의 “빨리 배운다”를 원문 표현인 class별 객체 수 출력 도움으로 낮췄다.
- DETR exact-fix packet: `[claude-code:sonnet · L1]` — PASS.
- Transformer virtual/QK/OV packet: `[claude-code:sonnet · L1]` — PASS.
- Transformer layer/composition/induction packet: `[claude-code:sonnet · L1]` — mechanism PASS.
  Correction 상세가 해당 packet 범위 밖이라는 유보는 별도 correction packet으로 넘겼다.
- Transformer correction packet: `[claude-code:sonnet · L1]` — PASS. Frobenius-norm library bug,
  추가 composition과 유지된 previous-token K-composition을 정정문에서 확인했다.

Transformer와 DETR broad 요청은 각각 180초·240초 code 143로 종료된 적이 있다. 응답 없는 호출은
검증으로 세지 않고 source line range를 단일 책임으로 나눈 bounded packet으로 모두 대체했다.

### P2 first-half deployment evidence

- 공개 경로: `paper-transformer-circuits-2021`, `diffusion-models`, `deformable-detr`와 세 track hub.
- Local combined P1/P2/route-schema suite: 27/27 pass.
- Public P1/P2 source contract: 9/9 pass at 390, 768, 1440.
- Visible KaTeX overflow 0, document horizontal overflow 0, raw LaTeX 0, minimum formula/Viz text 12px.
- Production asset: `index-C2JWriWu.js`, `index-D9OXk6s8.css`.
- Local build/service/public index SHA-256:
  `31fed01306d8fd3a4d68c79a49e48247c66c2736df9e6f55fb9f1f53bbda3b95`.

## 하나의 글이 current와 canonical을 함께 소유하는 경로

`articleSlug`가 같다고 자동으로 잘못된 연결은 아니다. 하나의 독립 질문 안에서 최소 기준점부터 현재 변화까지 이어 읽는 편이 더 자연스러우면 통합 글을 유지한다. 대신 두 source의 근거와 경계가 본문에 실제로 있어야 한다.

- `llm-data-engine`
  - `llm-pretraining-scaling`이 Chinchilla 2022의 training-only compute optimum과 2026 test-time/data-constrained scaling의 변화를 별도 section·source note로 소유한다.
  - 따라서 current/canonical의 동일 slug는 의도된 lineage 통합이다.
- `llm-disaggregated-serving`
  - 같은 글이 Mooncake 2024의 KVCache-centric production 기준과 NVIDIA Dynamo의 현재 orchestration/NIXL 경계를 별도 section·source note로 소유한다.
  - 따라서 동일 slug를 유지하되 어느 한 source가 본문에서 빠지면 다시 분리한다.

재감사에서는 단순히 slug 중복을 오류로 세지 않고, 통합 글 안에 각 source의 연구 질문·증거·한계·출처가 있는지 검사한다.

## 2026-07-27 교차 검증 기록

Context-manager의 Claude worker에는 전체 사이트를 한 번에 주지 않고 UI, track data, RAG, CoDaR packet으로 나눠 병렬 위임했다. 180초를 넘긴 packet은 더 작은 파일·line range로 줄여 다시 검증했다.

- `TopDownResearchRoute`
  - 5단계 DOM 순서, heading 계층, 모바일 overflow와 link 접근성은 이상 없음.
  - dependency React key를 `category:articleSlug` 조합으로 보강했다.
- `topdownResearchTracks`
  - 19개 track의 missing current/canonical 목록이 이 ledger와 일치했다.
  - current와 canonical이 같은 slug인 두 경로는 본문을 직접 열어 각각 Chinchilla→2026 scaling, Mooncake→Dynamo lineage를 실제로 소유하는 통합 글임을 확인했다.
- `paper-rag-2020`
  - RAG-Sequence/Token 수식, DPR/BART 경계와 원문 scope는 Claude와 직접 원문 대조가 일치했다.
  - arXiv 부록 G의 `728 dimensional vectors` 표기와 공개 Meta checkpoint의 `retrieval_vector_size=768`이 충돌한다. 어느 한쪽을 조용히 지우지 않고 본문에 재현 주의사항과 두 근거를 함께 남겼다.
  - Claude가 web 권한 때문에 유보한 100GB/36GB, retrieval collapse, hot-swap 70/68/12/4 수치는 공식 arXiv HTML의 부록 C·H와 본문 index hot-swapping section에서 직접 확인했다.
- `research-codar-2026`
  - 논문 PDF text의 지정 line range와 Claude worker를 대조했다.
  - DCDS 두 식, 512-word chunk, `k=3`, GPT-4O-MINI-2024-07-18, `DCDS < τ` route, dataset당 validation 20개, Table 1·3 수치, 50%/100% shuffle가 모두 일치했다.
  - 실험 범위에서 이 글이 추론한 경계와 저자가 Limitations에 직접 쓴 항목을 문장으로 분리했다.
- `robot-ai`
  - π0.7 source packet: `[claude-code:sonnet · L2 · $0.0000 · 110118ms]`.
    Observation·context·5B policy와 별도 14B world model, 50-step chunk, RTC, ablation과
    seen/unseen limitation을 지정 line range에서 대조했다.
  - OpenVLA source packet: `[claude-code:sonnet · L2 · $0.0000 · 64485ms]`.
    Fused encoder, 1st–99th quantile action tokens, 970k episode mixture, 230 robot rollout,
    LoRA, non-blocking·blocking quantization evidence를 대조했다.
  - 최소 경로: `[claude-code:sonnet · L2 · $0.0000 · 97705ms]`.
    필수 concept은 Robot 실행 경로와 imitation/offline learning에서 멈추고 POMDP,
    motion planning과 feedback-control 전체 과정은 target source가 요구하지 않아 제외했다.
  - Lineage boundary: `[claude-code:sonnet · L2 · $0.0000 · 63399ms]`.
    π0.5·π*0.6·MEM·BAGEL을 별도 필수 글로 늘리지 않고 π0.7 안의 출처·역할로 보존했다.
  - 공개 `ActionTokenizer`를 추가 대조해 논문의 256-bin 표현 아래 실제 code가
    256 edges, 255 centers, `np.digitize`, final-index clip과 `vocab_size-index`를
    사용한다는 재현 함정을 본문·식·Viz에 반영했다.
  - Post-fix content를 mechanism/equation과 evidence/runtime으로 나눈 네 packet에서
    π0.7의 coaching/subgoal 귀속 P0, mask/KI 혼합 P1, OpenVLA의 variant receipt 혼합 P0를
    발견해 수정했다.
  - 수정 후 π0.7 mechanism `[claude-code:sonnet · L1 · $0.0000 · 48727ms]`,
    π0.7 evidence `[claude-code:sonnet · L1 · $0.0000 · 44504ms]`,
    OpenVLA receipt `[claude-code:sonnet · L1 · $0.0000 · 26146ms]`가 모두 PASS였다.
  - OpenVLA evidence/cadence `[claude-code:sonnet · L1 · $0.0000 · 111137ms]`,
    π0.7 visual `[claude-code:sonnet · L1 · $0.0000 · 110108ms]`,
    OpenVLA visual `[claude-code:sonnet · L1 · $0.0000 · 123909ms]`도 P0/P1 0이었다.
  - `MUST FIX`만 있고 line evidence가 없던 π0.7 mechanism 응답과 180초 broad timeout은
    accepted closure로 세지 않고 exact-line replacement packet으로만 닫았다.

## 과거 Context Manager 실패 closure 재검산

과거 HTTP 500·timeout·headerless 결과는 검증으로 세지 않았다. 기존 identity ledger의
71개 article과 후속 bounded replacement의 내부 일관성을 다시 Claude에 분리 검산했다.

- `[claude-code:sonnet · L1 · $0.0000 · 18394ms]`:
  `57+4+5+5=71`, accepted execution `71+3=74`, `74+50=124`를 확인하고
  `IDENTITY LEDGER: PASS`.
- `[claude-code:sonnet · L1 · $0.0000 · 25784ms]`:
  실패한 broad call 자체를 PASS로 바꾸지 않고 같은 범위를 덮는 accepted bounded packet으로
  supersede하는 closure 논리를 확인하고 `POST-LEDGER CLOSURE: PASS`.

두 검산은 ledger 산술·closure invariant 검증이며 실제 article 사실성·시각성은 각 source packet과
post-fix audit가 별도로 소유한다.

검증 worker가 원문을 읽지 못했거나 timeout이면 “검증 완료”로 세지 않는다. 원문을 workspace 안의 작은 packet으로 만들고 section·table·line address를 지정한 뒤 다시 통과시킨다.

## 2026-07-27 Robot source 배포 증거

- 공개 경로:
  - `/lab/blog/ai?sub=ai-robotics`
  - `/lab/blog/ai/research-pi07-2026`
  - `/lab/blog/ai/paper-openvla-2024`
- 공개 Robot contract test는 390/768/1440에서 3/3 pass.
- 문서 폭은 390과 1440 viewport에서 각각 client width와 같아 가로 overflow가 없다.
- 배포 script hash `index-LtgxD3PC.js`는 local production build와 일치한다.
- FormulaNote 설명 라벨은 plain Korean UI text, 실제 수학 기호는 KaTeX로 분리해 한글 네모
  glyph 회귀를 제거했다.

## 한 트랙 처리 packet

4B·9B 모델 또는 별도 worker는 전체 사이트를 받지 않는다.

```yaml
track_id: knowledge-systems
stage_contract:
  - current_target
  - key_concepts
  - just_in_time_foundation
  - primary_source
  - implementation
source_to_reconstruct:
  role: current | canonical
  identity:
    title: ""
    stable_url: ""
    version: ""
  packet:
    section_claims: []
    figures: []
    equations: []
    tables_and_ablations: []
    appendix_findings: []
    implementation_receipts: []
    explicit_limitations: []
existing_internal_edges:
  concepts: []
  foundations: []
  implementation: []
private_transfer_checks: []
```

4B extractor는 source section 하나에서 literal claim과 address만 만든다. 9B reviewer는 section packet을 합쳐 `왜 존재하는가 / 무엇을 해결하는가 / 어떻게 동작하는가 / 어떻게 구현하는가 / 가정 / 실패`를 채운다. Renderer는 기존 article edge를 재사용하고, 새 foundation은 기존 바닥으로 핵심 식을 계산할 수 없을 때만 제안한다.

## 완료 증거

한 source reconstruction은 다음이 모두 있어야 완료다.

1. Track의 `articleSlug`가 실제 등록 article을 가리킨다.
2. 원문 전체 section과 appendix를 먼저 읽은 source packet이 있다.
3. 모든 display KaTeX 아래 한국어 `FormulaNote`가 있다.
4. Figure/table은 복제가 아니라 독자가 조작하거나 실행 순서를 추적하는 Viz/evidence receipt로 재구성한다.
5. 원문 주장보다 강한 결론을 막는 limitation과 stop rule이 있다.
6. 390px와 1440px에서 수식·Viz·본문에 내부 가로 스크롤과 잘림이 없다.
7. 가장 어려운 private transfer question을 풀 근거가 본문 각 section에 존재한다.

## 재감사 규칙

Batch가 끝날 때마다 missing `current.articleSlug`와 `canonical.articleSlug`를 다시 추출한다. 공백 수가 줄었다는 사실만으로 완료하지 않고, 등록·본문·수식·Viz·responsive test를 함께 확인한다. Current source가 교체되면 이전 글은 필수 경로에서 내려 source history로 남기고 새 current가 기존 개념으로 설명되지 않을 때만 foundation delta를 연다.
