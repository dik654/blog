import MomentumViz from './viz/MomentumViz';

export default function Momentum() {
  return (
    <section id="momentum" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Momentum (관성 기반 최적화)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        v_t = β·v_(t-1) + ∇L — 이전 이동 방향을 기억하여 일관된 방향으로 가속.<br />
        β=0.9이면 약 10스텝의 EMA. 진동은 상쇄, 주 방향은 누적.
      </p>
      <MomentumViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Momentum 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Momentum (Polyak 1964):

// Update rule:
// v_t = β · v_(t-1) + ∇L(θ_t)
// θ_(t+1) = θ_t - η · v_t
//
// where:
// v: velocity (accumulated gradient)
// β: momentum coefficient (0.9 typical)

// Physical analogy:
// - ball rolling down hill
// - gains velocity
// - doesn't stop at every flat region
// - smooths out oscillations

// Effect of β:
// - β=0: pure SGD
// - β=0.9: EMA of ~10 steps
// - β=0.99: EMA of ~100 steps
// - β>1: unstable

// Benefits:
// 1. Reduces oscillation:
// - opposing gradients cancel
// - consistent direction amplifies
// - smoother trajectory

// 2. Accelerates in right direction:
// - gradient alignment → speed up
// - crosses flat regions faster
// - escapes plateaus

// 3. Handles ill-conditioning:
// - averages over multiple steps
// - reduces sensitivity to step direction

// Nesterov Accelerated Gradient (NAG):
// - "look-ahead" variant
// - compute gradient at future position
// v_t = β · v_(t-1) + ∇L(θ_t - β · v_(t-1))
// - slightly better convergence
// - theoretical advantages

// Comparison:
// SGD: zigzag in ravines
// SGD + Momentum: smooth acceleration
// NAG: anticipatory correction

// Heavy Ball method:
// - alternative Momentum formulation
// - similar effect
// - Polyak's original

// Hyperparameters:
// - β: 0.9 standard
// - β: 0.99 for stable loss landscapes
// - β: 0.5 for noisy gradients
// - tune per problem

// When to use:
// - deep networks
// - CNNs (image tasks)
// - when SGD alone too slow
// - with learning rate decay

// Limitations:
// - still single LR for all params
// - doesn't adapt per parameter
// - can overshoot in complex landscapes

// Historical importance:
// - foundational optimization
// - led to Adam (adaptive momentum)
// - still used today
// - often paired with SGD`}
        </pre>
        <p className="leading-7">
          Momentum: <strong>v_t = β·v_(t-1) + ∇L, "ball rolling" analogy</strong>.<br />
          β=0.9 typical (EMA ~10 steps).<br />
          NAG (Nesterov) = look-ahead variant.
        </p>
      </div>
    </section>
  );
}
