# P2 canonical source closure

Date: 2026-07-27 KST

## Objective

`llm-interpretability`, `open-image-video`, `computer-vision`의 canonical source를 내부 학습
경로로 닫는다. 독자는 최신 연구에서 내려와 더 오래된 논문 목록을 무한히 읽지 않고도,
Transformer circuit, Latent Diffusion, DETR이 현재 글의 어떤 개념을 처음 고정했는지
수식·실행 순서·증거·한계까지 이해해야 한다.

## Observed

- 세 track의 canonical source는 공식 URL만 있고 내부 `articleSlug`가 없었다.
- `llm-interpretability-readouts`는 activation을 관찰하는 글이고
  `llm-circuit-analysis`는 intervention을 검증하는 글이다. 둘 다 2021 framework의
  weight-level path algebra를 대신 소유하지 않는다.
- `diffusion-models`는 DDPM에서 modern image runtime까지 이미 한 질문으로 이어졌지만
  Latent Diffusion의 first-stage compression, condition interface와 원문 compute receipt가 얕았다.
- `deformable-detr`는 sparse sampling부터 시작해 원 DETR의 matching cost, query execution과
  실제 convergence bottleneck을 독자가 추론해야 했다.
- 390px에서 hidden MathML `semantics`가 viewport 밖으로 측정됐지만 visible `.katex-html`과
  document width는 넘치지 않았다. 접근성 tree와 실제 렌더링 폭을 구분할 필요가 있었다.
- DETR의 첫 educational fixture는 두 ∅ target에 다른 matching cost를 표시해 원문의
  prediction-independent constant 계약과 충돌했다.
- Transformer source에는 publication 뒤 composition score 계산 bug를 설명하는 correction이
  붙어 있었다. 이를 생략하면 그림을 evidence보다 강하게 읽을 위험이 있었다.

## Inference

1. 현재 activation readout과 causal validation 사이에 weight algebra source를 별도 글로 두어야
   관찰·가설·원인 검증의 주장이 섞이지 않는다.
2. DDPM과 LDM은 독립 논문이지만 독자의 실행 질문은 pixel noising에서 latent noising으로
   연속된다. 새 목록 하나를 늘리기보다 기존 diffusion narrative 안에서 source boundary를
   분리하는 편이 낫다.
3. DETR과 Deformable DETR도 “set prediction의 병목 → sparse multi-scale correction”이라는
   하나의 원인-결과 서사다. Source section을 앞에 편입해야 다음 식의 각 항이 왜 생겼는지 보인다.
4. 평균 AP 하나보다 AP_small/AP_large, schedule, loss ablation을 함께 보여 줘야 독자가
   Deformable DETR의 개선 목표를 스스로 고를 수 있다.
5. 수식 host의 `scrollWidth`만 보면 `overflow-hidden`이 실제 잘림을 숨길 수 있다.
   Visible KaTeX child의 bounding box를 host와 직접 비교해야 한다.
6. Broad Claude timeout은 PASS가 아니다. Source range와 책임을 더 작게 나누어 accepted output으로
   대체해야 한다.

## Decision

### Separate · Transformer Circuits

`paper-transformer-circuits-2021`을 새 source identity로 만들었다.

- Residual stream을 공용 통신 channel로 읽는다.
- `W_I^{(2)}W_O^{(1)}` virtual weight로 앞 write와 뒤 read를 합성한다.
- QK의 position 선택과 OV의 residual/logit write를 분리한다.
- Zero→one→two attention layer의 bigram, skip-trigram, composition 계단을 만든다.
- `[A][B] … [A] → [B]`를 previous-token head와 induction head의 K-composition으로 추적한다.
- Random repeated-token evidence, positive-eigenvalue heuristic, V-composition limitation과
  2022 correction을 함께 둔다.

### Reuse and deepen · Latent Diffusion

`diffusion-models`의 DDPM source closure 뒤에 LDM section을 편입했다.

- `f=H/h=W/w`와 position 수 `f²` 감소를 구분한다.
- Autoencoder의 perceptual compression과 diffusion의 semantic compression을 두 stage로 나눈다.
- Pixel objective의 `x_t`가 latent objective의 `z_t`로 이동하는 지점을 계산한다.
- `τ_θ(y)`와 cross-attention을 text 전용 장식이 아니라 condition interface로 설명한다.
- 2.7× throughput와 1.6× FID를 Table 6 inpainting setup에만 제한한다.
- `f=4`를 보편 최적값으로 만들지 않고 reconstruction bottleneck을 함께 기록한다.

### Reuse and deepen · DETR

`deformable-detr`의 첫 section을 DETR canonical reconstruction으로 교체했다.

- N개 target을 ∅로 pad하고 Hungarian permutation을 고른다.
- Matching cost의 raw probability와 training loss의 log-probability를 별도 식으로 둔다.
- ∅ matching cost는 모든 prediction에 같은 상수지만, 배정 뒤 ∅ class loss는
  `0.1[-log p(∅)]`로 prediction-dependent라는 경계를 Viz에 남긴다.
- Object query 100개가 autoregressive token이 아니라 병렬 output slot임을 실행 graph로 보인다.
- Auxiliary decoder loss는 원문 범위대로 class별 객체 수 출력을 돕는다고만 쓴다.
- AP 42.0 아래의 small/large 차이, 300→500 epoch, Table 4 loss ablation과 NMS depth effect를
  source receipt로 분리한다.

## Claude collaboration

먼저 여섯 P2 source의 기존 글 소유권을 병렬 판정했다.

- Transformer Circuits: `separate_source_article`
- Latent Diffusion: `reuse_and_deepen(diffusion-models)`
- DETR: `reuse_and_deepen(deformable-detr)`
- Donut: `separate_source_article`
- DeepAR: `separate_source_article`
- Moshi: `separate_source_article`

구현 뒤 source packet을 다시 대조했다.

- LDM broad packet: PASS.
- DETR broad packet: ∅ matching fixture와 unsupported “빨리” 두 건 발견.
- DETR exact post-fix packet: PASS.
- Transformer broad packet은 두 번 code 143 timeout.
- Transformer를 virtual/QK/OV, composition/induction, correction 세 packet으로 나눈 뒤 모두 PASS.

Composition packet이 correction 상세를 자신의 source range 밖이라 유보했지만, 별도 correction
packet은 원문 정정문의 exact range를 읽고 다음을 확인했다.

- Low-rank library가 Frobenius norm에 잘못된 identity를 적용했다.
- Corrected plot에는 추가 head composition이 나타났다.
- Previous-token head와 induction head 사이의 핵심 K-composition 중요성은 유지됐다.

따라서 broad failure를 성공으로 재분류하지 않고 세 accepted bounded result가 동일 범위를
대체한다.

## Private transfer checks

이 문제들은 본문에 노출하는 quiz가 아니라 authoring depth를 검증하는 내부 질문이다.

1. Attention map이 과거 B를 강하게 읽어도 왜 B 예측의 원인이라고 단정할 수 없는가?
   - QK와 OV, 다른 residual path를 분리하고 intervention으로 올라가야 답할 수 있어야 한다.
2. 256×256 image에서 `f=8`이면 latent position은 몇 배 줄며, 왜 전체 speedup이 64×라고
   말할 수 없는가?
   - Channel, U-Net architecture, encoder/decoder와 memory traffic 경계를 함께 써야 한다.
3. 두 query가 같은 고양이를 예측할 때 어떤 식이 책임을 하나로 만들고, 왜 ∅ matching cost와
   ∅ training class loss가 같은 수가 아닌가?
   - Discrete assignment와 gradient objective를 분리해야 한다.
4. DETR과 Faster R-CNN-FPN+가 AP 42.0으로 같을 때 어떤 제품에서 모델 선택이 달라지는가?
   - AP_small/AP_large와 training schedule을 함께 읽어야 한다.

## 4B extraction packet

```yaml
source_range: one named equation, figure, table, correction, or appendix span
extract:
  literal_claims: []
  exact_equations: []
  exact_numbers: []
  experiment_scope: []
  explicit_limitations: []
  correction_or_errata: []
  source_addresses: []
reject:
  - cross-paper synthesis
  - curriculum placement
  - unstated causal explanation
  - source number without table or section address
```

## 9B synthesis packet

```yaml
target_question: one private transfer check
fact_packets: [bounded_source_packets]
existing_owner_article: ""
decision: reuse_and_deepen | separate_source_article
required:
  - why this source question exists
  - execution order and ownership boundaries
  - intuition before mathematics
  - every display equation paired with Korean operation meaning
  - figure rebuilt as an interactive causal or evidence view
  - evidence versus author inference
  - correction, limitation and stop rule
  - next current or implementation handoff
```

The 9B reviewer cannot convert an observed metric difference into a causal claim unless the source
contains the ablation. It must keep fixture values visibly labeled, and it must treat a source correction
as part of the canonical record rather than optional trivia.

## Reasoning trace

- Missing canonical `articleSlug` observed → beginner exits to raw paper inference → internal source edge.
- Existing owner question compared → Transformer differs but LDM/DETR continue existing narrative →
  one separate article plus two deep integrations.
- Hidden MathML overflow observed → accessibility-node false positive inference → visible `.katex-html`
  bounding-box test.
- DETR ∅ fixture differs by query observed by Claude → source invariant violation →
  constant matching cost plus prediction-dependent post-match loss.
- “Auxiliary loss learns faster” observed → source only claims correct class counts →
  remove speed attribution.
- Transformer correction omitted observed → one diagram could be over-trusted →
  explicit erratum and evidence boundary.
- Broad source audit timeout observed → unverifiable closure → bounded parallel packets →
  accepted PASS per responsibility.

## Local verification

- Focused ESLint: pass.
- P2 canonical route and source contract Playwright: 4/4 pass.
- Viewports: 390×844, 768×1024, 1440×900.
- Document horizontal overflow: 0.
- Visible `.katex-html` outside formula host: 0.
- Minimum formula scale: 0.76.
- Minimum visible formula and Viz text: 12px.
- Raw LaTeX and `.katex-error`: 0.
- Transformer, LDM, DETR lab tabs and state changes: pass.
- Mobile and desktop target screenshots visually inspected.

## Production closure

- Vite production build: pass, 8,883 modules; existing large-chunk advisory only.
- Combined P1/P2/route-schema local suite: 27/27 pass.
- `cm-blog.service`: 2026-07-27 16:50:11 KST restart 후 active/running.
- Public P1/P2 Playwright: 9/9 pass.
- Public viewports: 390×844, 768×1024, 1440×900.
- JavaScript: `index-C2JWriWu.js`.
- CSS: `index-D9OXk6s8.css`.
- `dist/index.html`, service-local response와 public HTTPS response SHA-256:
  `31fed01306d8fd3a4d68c79a49e48247c66c2736df9e6f55fb9f1f53bbda3b95`.
- Public paths:
  - `/lab/blog/ai/paper-transformer-circuits-2021`
  - `/lab/blog/ai/diffusion-models`
  - `/lab/blog/ai/deformable-detr`
  - `/lab/blog/ai?sub=ai-llm-interpretability`
  - `/lab/blog/ai?sub=ai-open-models`
  - `/lab/blog/ai?sub=ai-vision`

## Second half · Donut, DeepAR, Moshi

### Donut

`paper-donut-2021`을 Document AI의 내부 canonical source로 추가했다.

- External OCR text·box contract를 제거하는 것과 문자를 읽지 않는다는 주장을 구분했다.
- Swin image embeddings → BART decoder → task token grammar → deterministic JSON parser를 한
  실행 순서로 복원했다.
- Teacher forcing과 autoregressive inference, malformed END token의 `field lost` 경계를 분리했다.
- Classification·IE 우세, DocVQA 전체 열세와 handwritten 강점, tiny-text·resolution·compute
  한계를 같은 source receipt에 두었다.
- Sequence 예시는 source 수치가 아닌 교육용 fixture임을 표시하고, nested START/END token과
  nested JSON을 사용하도록 post-audit finding을 반영했다.

### DeepAR

`paper-deepar-2017`을 Time Series의 내부 canonical source로 추가했다.

- Global parameter와 item-specific history·feature·state를 분리했다.
- Conditioning range의 observed feedback과 prediction range의 sampled feedback을 실행 trace로
  만들었다.
- Gaussian·negative-binomial support, `Var[z]=mu+mu²alpha`, item scale `nu_i`, normalized input,
  output rescaling과 `P(i) proportional to nu_i`를 하나의 scale mechanism으로 연결했다.
- Horizon 합계의 quantile은 시점별 marginal quantile을 더하지 않고 autoregressive sample path를
  먼저 합산한 뒤 계산하도록 설명했다.
- Retail risk, electricity·traffic point metrics, 200 decoder samples, shuffled-path ablation,
  missing-observation proposal와 experiment omission을 서로 다른 source 범위로 유지했다.

Claude mechanism audit는 training Viz가 현재 target `z_t`를 recurrence input `z_{t-1}`로도
보여 주는 P1을 찾았다. `trainingSeed`와 `observed[step - 1]`로 수정해 네 step 모두
`input z_{t-1} → likelihood target z_t`가 되게 했고, 49,289 ms exact recheck가 PASS였다.
Evidence audit는 163,710 ms PASS였다.

### Moshi

`paper-moshi-2024`를 Speech · Audio의 compact canonical source spine으로 추가했다.

- Presence product contract → Moshi source → interaction·generation·recognition·representation
  sibling branch 순서를 고정했다.
- 24 kHz waveform → 12.5 Hz frame → 8 codebook index → 1.1 kbps를 계산했다.
- Two audio streams, system-only text stream, Temporal S축과 Depth K축, 16→17 token cost를
  한 forward pass로 복원했다.
- 80 ms codec frame, delay 1의 160 ms theoretical schedule, abstract의 practical 200 ms와
  undecomposed product p95를 분리했다.
- 원문이 160 ms를 10개 언어 자연 대화의 평균 230 ms 응답 간격과 비교한다는 문맥을 추가하되,
  이를 universal deadline이나 device p95 target으로 쓰지 않았다.
- Table 4·5·6·8에 더해 Table 9 pause·gap·overlap receipt를 추가했다. Table 9는 Fisher
  prompt에서 생성한 continuation 통계이며 real-user barge-in·playback cancellation 증거가 아니다.
- 파생 TTS 4.7% WER와 ASR 5.7% WER는 LibriSpeech test-clean의 framework flexibility
  demonstration이며 SOTA claim이 아니다.

Moshi broad architecture와 evidence 감사는 각각 240,458 ms와 240,566 ms에서 code 143 timeout으로
끝났고 PASS로 세지 않았다. 더 작은 source packet으로 다음 accepted Claude 결과가 이를 대체했다.

| Packet | Actual Claude result | Disposition |
|---|---:|---|
| Mimi exact facts | 153,194 ms · PASS | accepted |
| Temporal·Depth, two-stream, 5-second derivation | 231,227 ms · PASS | accepted |
| Latency boundary | 73,381 ms · P2 | missing 230 ms context fixed |
| Latency exact recheck | 28,556 ms · PASS | closed |
| Table 4·5 | 177,096 ms · P2 | Table 6 metric attribution fixed |
| Table 5·6 wording recheck | 37,265 ms · PASS | closed |
| Table 6·8 combined | 236,919 ms · empty placeholder | rejected despite `ok:true` |
| Table 6 exact | 52,575 ms · PASS | accepted replacement |
| Table 8 exact | 43,298 ms · PASS | accepted replacement |
| Table 9 dialogue evidence | 71,575 ms · PASS | accepted |
| ASR·TTS boundary | 105,315 ms · PASS | accepted |
| Speech route | 101,885 ms · P2 | terminal recognition handoff fixed |
| Terminal route recheck | 24,116 ms · PASS | closed |

Every accepted call reported `decision.worker = claude-code:sonnet`. A transport success with no audit
content was rejected in the same way as HTTP 500, timeout, connector failure or Codex fallback.

## 500 and identity reconciliation

The historical article-level backfill was not blindly rerun. The final identity ledger
`2026-07-23-claude-review-final-identity-audit.json` supersedes the earlier incomplete reconciliation and
records:

- intended unique articles: 71
- accepted unique actual-Claude articles: 71
- missing: 0
- rejected or failed attempts: 50

Thus the old HTTP 500 items already had bounded actual-Claude replacements. The current P2 failures above
were independently retried and recorded rather than merged into that historical count.

## Final local verification

- Focused ESLint: pass.
- `tsc --noEmit`: pass.
- Production build: pass, 8,889 modules; existing large-chunk advisory only.
- Combined P2 canonical source suite: 16/16 pass.
- Viewports: 390×844, 768×1024, 1440×900.
- Document horizontal overflow: 0.
- Visible KaTeX outside formula host: 0.
- Minimum formula scale: at least 0.7.
- Minimum visible formula and Viz text: 12px.
- Raw LaTeX and `.katex-error`: 0.
- Prose-before-Viz and all Donut·DeepAR·Moshi interactions: pass.
- Moshi full-page and per-Viz mobile/desktop screenshots were visually inspected. The delay bars initially
  inherited an almost-gray theme value; explicit amber contrast and a stable minimum height corrected the
  visual hierarchy before the final run.

## Final production closure

- `cm-blog.service`: 2026-07-27 17:42:18 KST restart 후 active/running.
- Public P2 canonical source suite: 16/16 pass at 390×844, 768×1024, 1440×900.
- Public Moshi article and Speech · Audio route: HTTP 200.
- JavaScript: `index-BUP8CKrR.js`, HTTP 200.
- CSS: `index-Ds4NEsGy.css`, HTTP 200.
- `dist/index.html` and public HTTPS response SHA-256:
  `55399837dee94efc41616325563b13cbabe9fbc462b9b22ee9e68d6d6c78f095`.
- Public canonical source:
  `https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/paper-moshi-2024`

This closes P2 canonical source implementation for Transformer Circuits, Latent Diffusion, DETR, Donut,
DeepAR and Moshi. The broader curriculum goal remains active.
