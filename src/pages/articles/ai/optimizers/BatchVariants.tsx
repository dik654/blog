import BatchVariantsViz from './viz/BatchVariantsViz';

export default function BatchVariants() {
  return (
    <section id="batch-variants" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Batch / Stochastic / Mini-batch</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        같은 데이터를 어떤 순서·묶음으로 학습하느냐에 따라 결과가 달라진다.<br />
        Mini-batch(32~128)가 안정성과 속도의 최적 균형 — 실무 표준.
      </p>
      <BatchVariantsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Batch Variants 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Batch Size Variants:

// 1. Full Batch (Batch GD):
// - use all training data per step
// - one gradient per epoch
// - deterministic
// - expensive for large datasets
//
// Pros: stable, smooth gradients
// Cons: slow, memory-heavy
// Use: small datasets (<10K)

// 2. Stochastic (SGD):
// - one sample per step
// - noisy gradients
// - fast per step
//
// Pros: escapes local minima, simple
// Cons: high variance, slow convergence
// Use: online learning, rare

// 3. Mini-batch (standard):
// - batch of N samples per step
// - typical N: 32-256
// - balance speed + stability
//
// Pros: GPU efficient, good convergence
// Cons: hyperparameter to tune
// Use: 99% of modern training

// Batch size effects:

// Small batch (8-32):
// - noisy gradients
// - explores loss landscape
// - better generalization (sometimes)
// - slow per epoch

// Medium batch (64-256):
// - balanced noise
// - good GPU utilization
// - standard for most tasks

// Large batch (512-8192+):
// - stable gradients
// - fast per epoch
// - worse generalization (often)
// - needs LR scaling

// Very large batch (32K+):
// - requires LR warmup
// - distributed training
// - LAMB, LARS optimizers help
// - large model training

// Learning rate scaling:
// Linear rule: LR ∝ batch_size
// sqrt rule: LR ∝ sqrt(batch_size)

// Memory calculation:
// - activations: batch × seq × features
// - gradients: parameters
// - optimizer state: 2x params (Adam)
// - total: choose batch to fit GPU memory

// GPU efficiency:
// - too small: GPU underutilized
// - too large: OOM
// - sweet spot: ~50-80% VRAM usage

// Practical considerations:
// - transformers: batch 32-128
// - CNNs: batch 128-512
// - LLMs: batch 1-4 (with grad accumulation)
// - gradient accumulation: simulate larger

// Gradient Accumulation:
// - accumulate gradients over N small batches
// - effective batch = N × batch_size
// - memory-efficient
// - slightly slower

// def train_step():
//     for i in range(accumulation_steps):
//         batch = get_batch()
//         loss = model(batch) / accumulation_steps
//         loss.backward()
//     optimizer.step()
//     optimizer.zero_grad()

// Generalization gap:
// - small batch → better generalization
// - large batch → may overfit
// - research area: why?
// - LR and warmup matter

// Recommendation:
// 1. Start with batch=32 or 64
// 2. Scale LR proportionally
// 3. Use gradient accumulation if OOM
// 4. Experiment for your task
// 5. Monitor val/train loss gap`}
        </pre>
        <p className="leading-7">
          Batch: <strong>Full (all data) vs SGD (1) vs Mini-batch (N=32-256)</strong>.<br />
          LR ∝ batch_size 또는 sqrt(batch_size).<br />
          gradient accumulation으로 large effective batch 가능.
        </p>
      </div>
    </section>
  );
}
