import SGDViz from './viz/SGDViz';

export default function SGD() {
  return (
    <section id="sgd" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SGD (확률적 경사 하강법)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        θ = θ - η·∇L(θ) — 가장 기본적인 최적화 알고리즘.<br />
        고정 학습률의 한계: 발산, 느린 수렴, 안장점 정체.
      </p>
      <SGDViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">SGD 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Stochastic Gradient Descent (SGD):

// Update rule:
// θ_(t+1) = θ_t - η · ∇L(θ_t; x_i)
//
// where:
// θ: parameters
// η: learning rate
// ∇L: gradient of loss
// x_i: single sample (stochastic)

// vs Batch GD:
// - BGD: uses all data per step
// - SGD: uses 1 sample per step
// - Mini-batch SGD: uses small batch

// Properties:
// - simple, fast per step
// - noisy updates (stochastic)
// - can escape shallow local minima
// - slower convergence

// Learning rate (η):
// - too large: diverges
// - too small: slow, stuck
// - typical: 0.01-0.0001
// - schedules: decay over time

// Problems:

// 1. Oscillation:
// - ravine-shaped loss
// - large gradient component in steep direction
// - small in shallow direction
// - zigzag trajectory

// 2. Saddle points:
// - gradient ≈ 0 but not minimum
// - SGD gets stuck
// - common in high dimensions

// 3. Local minima:
// - SGD can settle in suboptimal
// - noise helps escape (sometimes)

// 4. Ill-conditioning:
// - different scales per parameter
// - fixed η suboptimal
// - one η for all doesn't work well

// Learning rate schedules:
// - step decay: η *= 0.1 every N epochs
// - exponential: η_t = η_0 · e^(-kt)
// - cosine: η_t = η_0 · cos(πt/T)
// - warmup: low → high → decay
// - cyclical: oscillate

// Common schedules:
// - constant (baseline)
// - linear decay
// - cosine annealing (modern)
// - warmup + cosine (Transformers)

// Pros:
// ✓ simple
// ✓ low memory
// ✓ well-understood
// ✓ theoretical guarantees

// Cons:
// ✗ slow
// ✗ sensitive to LR
// ✗ struggles with pathological loss
// ✗ no adaptive behavior

// When to use SGD:
// - image classification (CNN)
// - large models (GPT sometimes)
// - with momentum + schedule
// - final fine-tuning`}
        </pre>
        <p className="leading-7">
          SGD: <strong>θ_(t+1) = θ_t - η·∇L, single-sample stochastic</strong>.<br />
          문제: oscillation, saddle points, ill-conditioning.<br />
          LR schedules: cosine, warmup 표준.
        </p>
      </div>
    </section>
  );
}
