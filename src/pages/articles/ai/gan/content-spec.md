# GAN reconstruction content spec

Date: 2026-07-29
Route: `/lab/blog/ai/gan`
Track: `generative-models`

## Article job

GAN의 변형 이름을 외우게 하지 않는다. 독자가 아래 실행 계약을 추적하게 한다.

1. density를 계산하지 못하는 generator가 sample을 만든다.
2. discriminator가 real/fake 비교 함수를 학습한다.
3. D step과 G step이 서로 다른 parameter와 gradient boundary를 가진다.
4. 강한 D, 떨어진 support, mode collapse가 서로 다른 실패임을 진단한다.
5. non-saturating loss와 WGAN-GP가 각각 어느 신호 문제를 고치는지 구분한다.
6. Diffusion이 움직이는 판별자 대신 알려진 noise target을 쓰는 이유와 반복 sampling 비용을 함께 말한다.

이 글의 끝은 “GAN보다 Diffusion이 무조건 낫다”가 아니다. 필요한 학습 신호,
coverage, sampling latency와 운영 복잡도를 보고 다음 글을 고르는 데서 멈춘다.

## Reader start

- binary cross entropy의 직관
- gradient descent와 `detach`
- 확률분포는 여러 종류의 sample이 나오는 규칙이라는 직관

깊은 measure theory, optimal transport 증명, 전체 GAN 계보는 선행지식으로
요구하지 않는다.

## Hidden transfer problem

```yaml
data:
  real_modes: 4
  generated_modes: 1
  support_overlap: low
training:
  discriminator_fake_score: 0.02
  discriminator_loss: near_zero
  generator_samples: sharp_but_repetitive
requirements:
  coverage: high
  training_stability: high
  sampling_latency:
    candidate_a: one_forward
    candidate_b: iterative_allowed
required_decisions:
  - distinguish minimax saturation from mode collapse
  - choose non_saturating only for the first problem
  - require precision_and_recall rather than sample sharpness alone
  - explain what Wasserstein critic changes and what it does not guarantee
  - choose whether fixed denoising targets justify iterative sampling cost
  - name the next article and evidence needed
```

본문에 문제를 그대로 싣지 않는다. 본문과 Viz만 읽은 독자가 이 판단을 할 수
있는지 브라우저 테스트와 read-only review로 확인한다.

## Evidence clocks

| kind | authority | owned claim |
| --- | --- | --- |
| canonical GAN | Goodfellow et al. 2014 | minimax game, non-saturating heuristic, optimal D, JS result |
| repair family | WGAN 2017, WGAN-GP 2017 | support/topology motivation, 1-Lipschitz critic, gradient penalty |
| next contract | DDPM 2020 | fixed forward noising, learned reverse denoising, iterative generation |
| teaching fixture | local interactive values | direction and trade-off only, never benchmark |

Downloaded source text lives under
`.codex-tmp/claude-gan-preaudit-2026-07-29/sources/`.

## Minimum-paper stop rule

Deep coverage:

- Generative Adversarial Nets, 2014
- Wasserstein GAN and WGAN-GP only where they repair the signal geometry

Bridge only:

- DDPM, 2020, to establish the fixed-noise-target and iterative-sampling contract

Deferred:

- every architectural GAN variant
- optimal transport proof
- modern Diffusion, DiT, Flow Matching and sampler details
- production image runtime

Those belong to `diffusion-models`, `dit-flow-matching-evaluation` and
`image-model-runtime`.

## Causal section order

### 1. Implicit distribution and learned comparison

- Goal: explain why likelihood-free sampling still receives a gradient.
- Flow: `z -> G(z) -> D(G(z)) -> input gradient -> G`.
- Boundary: freezing D weights must not detach D input gradient.
- Viz: responsive HTML owner path, not a tiny architecture SVG.

### 2. Two generator objectives and the ideal game

- Goal: separate early optimizer signal from the ideal equilibrium theorem.
- Formula: minimax, non-saturating, optimal discriminator.
- Required explanation: sigmoid-logit gradient near score zero and why JS theory
  assumes an optimal D while actual training does not.
- Viz: score slider changes both loss and logit-gradient magnitude.

### 3. Alternating state updates

- Goal: make trainable parameters, target and detach boundary explicit.
- Flow: D step, then G step, with a counterexample for `no_grad(D)`.
- Evidence: update ratio is a dynamical choice, not a universal constant.

### 4. Failure diagnosis

- Goal: separate fidelity, coverage and optimization signal.
- States: mode collapse, discriminator saturation, oscillation, artifact exploitation.
- Viz: mode coverage changes recall without pretending to be a measured benchmark.

### 5. Repair the signal, then choose the next contract

- Goal: explain the causal transition rather than list model names.
- WGAN: critic score and 1-Lipschitz constraint change the distribution geometry.
- WGAN-GP: penalize input-gradient norm instead of weight clipping.
- Diffusion: known noise target stabilizes per-state supervision; generation pays
  repeated denoising evaluations.
- Viz: support overlap and deployment priority change diagnosis, safe action,
  sampling path and next article.

## Formula contract

Every displayed formula is followed immediately by a Korean `FormulaNote`.

Required explanations:

- why `log` turns confidence into a large penalty;
- why non-saturating changes early gradient without changing the desired fixed point;
- why `D*` is an idealized density-ratio expression;
- why `||grad_x f(x_hat)||_2 - 1` constrains local score slope;
- why squaring the deviation penalizes both too-small and too-large slope;
- why expectations compare distributions rather than one hand-picked sample.

## Prose-to-Viz handoff

The new `SignalContractLab` must expose:

- support overlap control;
- required sampling path: one forward or iterative allowed;
- current signal: learned moving critic versus known corruption target;
- observed symptom;
- diagnosis;
- safe next action;
- cost paid;
- explicit next article.

No model is always selected. Low overlap with one-forward latency keeps the reader
inside GAN repair and evaluation. High coverage/stability with iterative sampling
allowed opens Diffusion. The values are labeled as a teaching fixture.

## Acceptance checks

- direct `/gan`, `/gan#evaluation` and control anchors scroll below sticky header;
- no document horizontal overflow at 390px and 1440px;
- no raw `\frac`, `\nabla`, `\mathbb` text;
- displayed formulas have Korean meaning plus operation reason;
- every control is at least 44px;
- support-overlap and latency changes alter diagnosis, action, cost and next article;
- internal links reach generative theory, probability, diffusion, current DiT/Flow
  and image runtime;
- source links are primary papers;
- Claude facts and transfer reviews are strict-valid and source hashes stay stable.
