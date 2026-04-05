import AdamViz from './viz/AdamViz';

export default function Adam() {
  return (
    <section id="adam" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Adam (적응적 학습률)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        1차 모멘트(방향) + 2차 모멘트(크기)로 파라미터별 학습률 자동 조절.<br />
        θ = θ - η·m̂/(√v̂ + ε) — 희소 파라미터는 큰 스텝, 빈번한 파라미터는 작은 스텝.
      </p>
      <AdamViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Adam 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Adam (Kingma & Ba, ICLR 2015):
// Adaptive Moment Estimation

// Update rules:
// m_t = β1·m_(t-1) + (1-β1)·∇L    # 1st moment (mean)
// v_t = β2·v_(t-1) + (1-β2)·∇L²    # 2nd moment (variance)
//
// m̂_t = m_t / (1 - β1^t)           # bias correction
// v̂_t = v_t / (1 - β2^t)
//
// θ_(t+1) = θ_t - η · m̂_t / (√v̂_t + ε)

// Defaults:
// η (learning rate): 0.001
// β1: 0.9
// β2: 0.999
// ε: 1e-8

// Intuition:
// - m_t: momentum (direction)
// - v_t: magnitude (for scaling)
// - per-parameter adaptive LR
// - divides by sqrt(variance)

// Effect:
// - parameters with small gradients: larger step
// - parameters with large gradients: smaller step
// - self-normalizing
// - robust to scale

// Bias correction:
// - m, v initialized to 0
// - biased toward 0 early on
// - correction: / (1 - β^t)
// - important for early iterations

// Comparison with SGD+Momentum:
// - Momentum: only first moment
// - Adam: first + second moment
// - Adam: adaptive per parameter
// - Adam: faster convergence usually

// RMSProp connection:
// - RMSProp uses 2nd moment only
// - Adam = Momentum + RMSProp
// - combines best of both

// When Adam shines:
// ✓ sparse features (NLP, embeddings)
// ✓ non-stationary objectives
// ✓ high-dim parameter spaces
// ✓ default choice for most tasks

// Adam limitations:
// - may converge to bad local minima
// - "marginal value" debate (2017)
// - weight decay issue → AdamW
// - can overshoot

// Variants:
// - Adamax: ∞-norm instead of L2
// - Nadam: Adam + NAG
// - AdamW: decoupled weight decay
// - RAdam: rectified Adam
// - Lion: efficient Adam-like (2023)

// Memory cost:
// - SGD: θ (parameters)
// - Momentum: θ + v
// - Adam: θ + m + v (2x more)
// - important for large models

// Usage in practice:
// - default for most deep learning
// - standard for Transformers (with AdamW)
// - quick prototyping
// - stable across hyperparameters

// Hyperparameter sensitivity:
// - LR matters most (try 1e-3 to 1e-5)
// - β1, β2 rarely tuned
// - ε rarely tuned
// - warmup + cosine schedule common`}
        </pre>
        <p className="leading-7">
          Adam: <strong>1st + 2nd moment, per-parameter adaptive LR</strong>.<br />
          bias correction for early iterations.<br />
          default choice for most deep learning (2015+).
        </p>
      </div>
    </section>
  );
}
