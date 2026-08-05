# Generative Models Core — Content Spec

## Goal

Four articles form one executable mental model rather than four independent model summaries:

1. **Generative Theory** defines the shared problem and comparison axes.
2. **VAE** shows explicit latent-variable learning and amortized inference.
3. **GAN** shows implicit distribution matching through a learned critic signal.
4. **Diffusion** reframes one hard mapping as many noise-conditioned corrections.

The reader should be able to identify the training signal, sampling path, density access, and expected failure mode of each family.

## Narrative Contract

Every major section follows this order:

1. A concrete question or failure that motivates the concept.
2. A small visual or interactive experiment.
3. The minimal equation, split into mobile-safe semantic units.
4. Symbol-by-symbol interpretation.
5. Implementation or evaluation consequences.
6. A misconception or failure condition.

No article begins with an unexplained scene. Visuals appear only after the prose establishes what to inspect.

## Visual Contract

- Prefer one meaningful control over many step buttons.
- Use tabs only for mutually exclusive views and sliders for numeric values.
- Every visualization must fit a 320px content width without horizontal scrolling.
- Diagrams use responsive CSS grids or SVGs with a stable `viewBox` and protected plot margins.
- Color communicates roles consistently: blue for data/signal, emerald for learned transformation, amber for uncertainty/noise, zinc for references or inactive paths.
- Avoid nested cards, decorative gradients, and dense timelines that shrink labels below readable size.

## Math Contract

- Render all notation through KaTeX.
- Split long objectives into definition, term decomposition, and result lines.
- Do not rely on horizontal scrolling for required equations.
- Each equation includes intuition and symbol definitions.
- Interactive numeric values must be computed from the same formula shown in the text.

## Article Scope

### Generative Theory

- Distribution learning versus memorization
- Explicit likelihood and autoregressive factorization
- Latent-variable marginalization and approximate inference
- Implicit adversarial learning
- Iterative denoising and score/flow handoff
- Decision matrix across training signal, sampling, likelihood, and failure

### VAE

- Why deterministic AE codes are not directly sampleable
- `q_phi(z|x)` as mean and log-variance
- Reparameterization as graph surgery
- ELBO derivation from the evidence gap
- Reconstruction/KL trade-off and beta-VAE
- Posterior collapse, blurry likelihood models, generation/evaluation

### GAN

- Density-ratio signal from the discriminator
- Minimax and non-saturating generator objectives
- Alternating updates and detach boundaries
- Saturation, imbalance, mode collapse, oscillation
- WGAN/conditional GAN handoff and evaluation limits

### Diffusion

- Narrative transition from one-shot mapping to iterative correction
- Forward closed form and signal-to-noise interpretation
- Noise prediction objective and timestep conditioning
- Reverse sampler, stochastic versus deterministic paths, step count
- Latent diffusion, text conditioning, CFG
- U-Net versus DiT, score/velocity parameterization, flow matching, evaluation

## Completion Checks

- 360, 768, and 1440px widths
- All tabs and range endpoints
- No document or required internal horizontal scrolling
- No visible raw LaTeX and no `.katex-error`
- No clipped plot labels or values outside figure bounds
- No browser console or page errors
