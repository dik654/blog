# DiT, Flow Matching과 생성 모델 평가 content spec

## Goal
- 독자는 최신 text-to-image 모델의 차이를 `latent 표현`, `backbone`, `확률 경로와 예측 target`, `solver`, `평가·운영 계약`의 다섯 축으로 분해할 수 있어야 한다.
- `DiT`, `MMDiT`, `Flow Matching`, `Rectified Flow`, `few-step distillation`을 하나의 발전 연표로 외우지 않고 서로 독립적으로 바꿀 수 있는 설계 결정으로 이해한다.
- 보기 좋은 몇 장이나 FID 하나가 아니라 fidelity, distribution coverage, prompt composition, human preference, latency·VRAM을 함께 통제해 release 결정을 내릴 수 있어야 한다.

## Article ownership

| Surface | Ownership | Why |
|---|---|---|
| `dit-flow-matching-evaluation` | DiT token cost, MMDiT modality stream, probability path, velocity target, ODE solver error, few-step distillation, generative evaluation and controlled release | 현재 생성 모델 논문과 제품을 같은 다섯 축으로 읽는 고급 연결 글이다. |
| `diffusion-models` | DDPM forward noising, noise prediction, reverse sampling, CFG와 latent diffusion 입문 | 처음 diffusion을 배우는 글이다. DiT·Flow는 짧은 handoff만 남긴다. |
| `image-model-runtime` | 실제 encoder, denoiser, sampler, VAE, precision과 memory 실행 graph | 특정 pipeline을 실행·감사하는 운영 글이다. 학습 path의 수학을 소유하지 않는다. |
| `stable-diffusion-open-models` | Stable Diffusion 계열 checkpoint와 SD3/MMDiT 제품 구조 | 제품 계보와 공개 모델 선택 글이다. 범용 평가 계약을 소유하지 않는다. |
| `vision-transformer` | Patch token과 self-attention backbone | DiT를 읽을 때 필요한 최소 backbone 기반이다. |
| `differential-equations-phase-plane-numerical-integration` | 변화율, Euler/RK 적분, local·global truncation error | ODE solver가 왜 NFE와 오차를 만드는지 내려가서 보강하는 수학 글이다. |

## Source anchors

| Area | Paper / section | Why it matters |
|---|---|---|
| DiT | Peebles & Xie, `Scalable Diffusion Models with Transformers` §3 | Latent patchify, token count, conditioning variants와 compute scaling의 1차 근거다. |
| Flow Matching | Lipman et al., `Flow Matching for Generative Modeling` §3-4 | Conditional probability path와 vector field target으로 simulation-free regression을 구성하는 근거다. |
| Rectified Flow + MMDiT | Esser et al., `Scaling Rectified Flow Transformers...` §3, §4, §5 | Straight data-noise path, velocity target, timestep sampling과 modality-specific weights/shared attention의 근거다. |
| Few-step pressure | Meta, `Autoregressive Distillation of Diffusion Transformers` | Trajectory history를 사용한 four-step distillation과 current inference-cost pressure의 공식 근거다. |
| Distribution evaluation | Sajjadi et al., `Assessing Generative Models via Precision and Recall` | 비슷한 FID가 mode invention과 mode dropping을 구분하지 못하는 근거다. |
| Composition evaluation | `GenEval` §3 | Object co-occurrence, count, color, position, attribute binding을 원자적으로 검사하는 근거다. |
| Prompt alignment | `VQAScore` §3 | `P(Yes | image, question(text))`로 관계·속성을 포함한 alignment를 평가하는 근거다. |
| Current research top | Google Research, `Towards demystifying the creativity of diffusion models` (2026-07-15) | Score smoothing으로 interpolation과 novelty를 설명하는 현재 연구 연결점이다. |

## Reader prerequisites
- `Latent`: VAE가 pixel을 압축해 denoiser가 계산하는 연속 표현.
- `Token`: latent의 작은 patch를 transformer가 읽는 vector 하나로 바꾼 단위.
- `Vector field`: 현재 위치와 시간에서 어느 방향으로 얼마나 움직여야 하는지 주는 함수.
- `ODE solver`: vector field를 여러 번 평가해 noise에서 data까지 경로를 수치적으로 적분하는 알고리즘.
- `Distribution coverage`: 몇 장이 선명한지를 넘어 실제 데이터의 다양한 mode를 빠뜨리지 않았는지 보는 축.
- 선택 보강: ViT patch attention, 미분방정식과 Euler integration, VAE latent.

## Authoring-only transfer problem

The public article must not print this prompt verbatim. It is the depth audit.

> 한 팀이 1024px text-to-image 시스템 A, B, C를 5,000 prompts에서 비교한다. A는 U-Net epsilon DDPM, 30 NFE이며 FID는 좋지만 count·relation을 자주 틀린다. B는 MMDiT rectified flow, 28 NFE이며 prompt alignment는 좋지만 peak VRAM이 높다. C는 four-step distilled DiT이며 빠르고 aesthetic·VQAScore가 높지만 rare style coverage가 낮고, 제품 demo는 prompt마다 9장을 생성해 reranker가 고른 best-of-nine만 보여 준다. 세 시스템은 VAE, text encoder, resolution, solver, CFG, seed, candidate count와 postprocess도 다르다. 공정한 비교 manifest, 각 실패의 원인 가설, solver·NFE 해석, metric matrix, release/rollback gate를 설계하라.

The finished prose is sufficient only if a reader can derive all of these:
1. Backbone, path/target, solver와 latent가 동시에 바뀐 결과에서 어느 한 원인을 단정할 수 없으므로 controlled ablation이 필요하다.
2. DiT patch size를 절반으로 줄이면 token 수가 4배가 되고 dense attention pair 수는 16배가 된다.
3. Straight conditional interpolation의 target velocity가 단순해도 learned marginal path와 numerical trajectory가 항상 직선·one-step인 것은 아니다.
4. NFE는 network 호출 횟수이며 wall-clock은 token 수, network 크기, CFG batch, VAE와 hardware에 따라 달라진다.
5. Distilled four-step model은 teacher trajectory를 압축한 별도 model artifact이며 solver step만 4로 줄이는 것과 다르다.
6. FID 하나는 fidelity와 coverage를 분리하지 못하고, CLIP-like alignment는 count·relation·attribute binding을 숨길 수 있다.
7. Best-of-nine을 best-of-one과 비교하면 model뿐 아니라 candidate budget과 reranker를 평가하게 되므로 candidate count와 selection policy를 고정해야 한다.
8. Release gate는 quality, coverage, composition, human preference, p95 latency, peak VRAM과 rollback을 모두 포함한다.

## Section 1: 최신 모델을 다섯 계약으로 분해한다
- Question: “DiT가 Flow Matching을 쓴다”는 한 설계인가, 두 설계인가?
- Five contracts:
  1. Representation: pixel or VAE latent, spatial shape and scale.
  2. Backbone: U-Net, DiT, MMDiT; parameter and token compute.
  3. Path/target: epsilon, x0, v, conditional flow velocity; timestep distribution and weighting.
  4. Solver: Euler, Heun/RK, scheduler, NFE and guidance.
  5. Evaluation/runtime: prompt set, seeds, candidate count, metrics and target hardware.
- Viz: model A/B/C selector with five rows. Changed axes light up; “한 번에 바뀐 축” count prevents single-cause claims.
- Design insight: architecture names are coordinates in a design space, not a total ordering.

## Section 2: DiT는 latent grid를 token sequence로 바꾼다
- Formula:
  - `N = (H/(fp))(W/(fp))` with Korean underbraces: image size, VAE factor, patch size, token count.
  - `attention pairs = N^2` with a note that memory/kernel implementation changes constants, not dense pair scaling.
- Execution flow:
  1. VAE image latent `H/f x W/f x C`.
  2. Patchify `p x p` latent regions to N tokens.
  3. Add position and timestep/text condition.
  4. Transformer mixes tokens; linear head unpatchifies velocity/noise prediction.
- MMDiT:
  - Image and text streams have modality-specific projection, norm and MLP weights.
  - Q/K/V enter joint attention so information flows in both directions.
  - “두 transformer를 연결” is a useful intuition, but shared attention is the exact meeting point.
- Viz: resolution, VAE factor, patch size sliders; token grid and N² pair counter; single-stream/dual-stream switch.
- Failure modes: high-resolution token explosion, mixed-precision attention-logit instability, text encoder VRAM.

## Section 3: Flow Matching은 path의 velocity를 회귀한다
- Convention: article uses `t=0 data`, `t=1 noise` for intuitive forward noising; sampling integrates backward from `t=1` to `t=0`. Explicitly note that papers may reverse the convention.
- Formula:
  - `x_t = (1-t)x_0 + t epsilon`
  - `u_t = d x_t/dt = epsilon - x_0`
  - `L_CFM = E ||v_theta(x_t,t,c) - u_t||^2`
- Explanation:
  - Each paired data/noise example has a simple conditional path and target.
  - The network seeing many overlapping pairs learns a conditional expectation/marginal vector field.
  - Simulation-free describes training target construction; generation still solves an ODE.
- Viz: 2D data/noise point pairs, coupling toggle, straight conditional lines, learned field average, path crossing/curvature warning.
- Misconception: straight conditional lines do not guarantee the learned path is exactly one straight segment for every sample.

## Section 4: Solver는 field를 finite steps로 적분한다
- Formula:
  - `x_{k-1}=x_k-Delta t v_theta(x_k,t_k,c)` for backward Euler under the article convention.
  - Local error accumulates into a global trajectory error; smaller NFE increases truncation burden.
- Controls: Euler vs Heun, 2/4/8/16 steps, curved field.
- Viz: same field, different step counts; endpoint miss and NFE displayed; wall-clock factors listed separately.
- Distinctions:
  - NFE != wall-clock.
  - Reduced solver steps != distilled model.
  - CFG may require conditional/unconditional prediction paths or batching and changes actual cost.
- Handoff: detailed integration math links to ODE article.

## Section 5: Few-step generation is a model-system contract
- Current pressure: iterative generation quality is strong but latency/cost motivates distillation and path design.
- Teacher trajectory -> student few-step transition -> validation over each step and final distribution.
- ARD is one current example; present its four-step result as paper-specific evidence, not a universal promise.
- Failure modes: student endpoint looks good but rare modes disappear; early-step error compounds; edit identity breaks.
- Product manifest must pin teacher/student, solver, NFE, guidance, VAE, text encoder, candidate count and target hardware.

## Section 6: Generative evaluation mirrors the failure taxonomy
- Quality/coverage:
  - Precision: generated samples that resemble target support.
  - Recall: target modes covered by generated distribution.
  - FID is a useful population distance but a single value can hide which side failed.
- Composition:
  - GenEval slices: object, two object, count, color, position, attribute binding.
  - VQAScore: probability of “Yes” for a prompt-derived question; do not treat evaluator VLM as ground truth.
- Human/product:
  - Pairwise prompt adherence, aesthetics, typography; blinded and randomized.
  - Safety, memorization/provenance and domain slices remain separate gates.
- Runtime:
  - NFE, p50/p95 latency, throughput, peak VRAM, energy and failures on intended hardware.
- Viz: release gate with toggles for reranking budget and metrics; exposes hidden best-of-k advantage and failure slices.

## Section 7: Controlled comparison and release
- Manifest fields: checkpoint hashes, dataset/prompt set, VAE, text encoders, resolution/aspect buckets, solver/NFE, CFG, precision, seed set, samples per prompt, reranker, postprocess and hardware.
- Experiment order:
  1. Freeze runtime and prompt manifest.
  2. Change one of the five contracts.
  3. Record per-slice quality and cost.
  4. Open final holdout once.
  5. Ship only with rollback checkpoint and monitoring.
- Capability check should mirror the private transfer problem without revealing it.

## Cross-section narrative
- A model name is first decomposed into five contracts.
- DiT changes the function approximator and makes token compute visible.
- Flow Matching changes what path/velocity is learned, while the solver determines how the learned field is traversed.
- Few-step work compresses this traversal into a new model-system artifact.
- Evaluation uses the same decomposition so a faster or prettier demo cannot hide coverage and composition failures.
- The article ends with a reproducible comparison manifest, not a model leaderboard.

## Viz implementation constraints
- Every Viz changes a model assumption, numerical path or release decision; no decorative network diagram.
- Mobile width 390 px must have zero document overflow and no inner horizontal scrollbar.
- Use DOM/CSS for controls and panels. A small SVG is allowed only for the 2D path where curves are the data itself; labels remain outside SVG.
- Stable control and plot dimensions. Slider changes must not resize the article flow.
- Neutral surfaces dominate. Blue identifies representation/model, amber denotes numerical uncertainty, emerald means passed contract, rose means hidden failure.
- No gradients, thick rails, nested cards or large empty canvas.
- Animation is short state interpolation and respects reduced motion; static state communicates the same result.

## Coverage recheck

| Scope item | Covered by section | Gap | Fix |
|---|---|---|---|
| Five independent decisions | 1 | none | Same model comparison matrix. |
| DiT and MMDiT internals | 2 | none | Token cost and modality meeting point. |
| Flow Matching intuition/math | 3 | none | Explicit time convention and conditional-to-marginal warning. |
| Solver/NFE/error | 4 | none | Interactive integration and ODE handoff. |
| Few-step current trend | 5 | none | Paper-specific ARD evidence and artifact contract. |
| Fidelity/coverage/composition/human/runtime | 6 | none | Multiple independent release gates. |
| Fair experiment | 7 | none | Versioned manifest and final holdout. |
| Full DDPM derivation | deferred | intentional | Owned by `diffusion-models`. |
| Full ODE numerical analysis | deferred | intentional | Owned by ODE foundation article. |
| Product-specific model cards | deferred | intentional | Owned by open image/video model paths. |
