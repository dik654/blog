import AdamWViz from './viz/AdamWViz';

export default function AdamW() {
  return (
    <section id="adamw" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AdamW (Decoupled Weight Decay)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        L2 + Adam → 적응 스케일링이 decay를 약화시키는 문제.<br />
        AdamW — weight decay를 Adam 밖으로 분리. 현대 Transformer 학습의 표준.
      </p>
      <AdamWViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">AdamW 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// AdamW (Loshchilov & Hutter, 2017):
// Decoupled Weight Decay Regularization

// Problem with Adam + L2:
// L2 adds to loss: L' = L + λ/2·||θ||²
// gradient: ∇L' = ∇L + λ·θ
// Adam scales: (∇L + λ·θ) / √v
// → weight decay effect reduced by large v
// → inconsistent regularization

// AdamW fix:
// - separate weight decay from gradient
// - apply after Adam update

// Update rule:
// m_t = β1·m_(t-1) + (1-β1)·∇L
// v_t = β2·v_(t-1) + (1-β2)·∇L²
// m̂_t = m_t / (1 - β1^t)
// v̂_t = v_t / (1 - β2^t)
// θ_(t+1) = θ_t - η · (m̂_t / (√v̂_t + ε) + λ · θ_t)
//           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^   ^^^^^^^^^
//           Adam update                     weight decay

// Differences from Adam:
// - Adam: L2 regularization inside loss
// - AdamW: weight decay outside

// Benefits:
// - cleaner theoretical formulation
// - better generalization
// - more consistent regularization
// - improved final accuracy

// Weight decay:
// - λ typically 0.01-0.1
// - larger than L2 equivalent
// - similar to SGD + momentum + L2
// - tune per task

// When to use AdamW:
// ✓ Transformers (BERT, GPT)
// ✓ modern vision models
// ✓ fine-tuning
// ✓ most modern deep learning

// Impact (2017+):
// - became default for Transformers
// - standard in HuggingFace
// - 1-5% accuracy improvement
// - better generalization

// Hyperparameters:
// - lr: 1e-3 (training), 1e-5 (fine-tuning)
// - β1=0.9, β2=0.999 (default)
// - weight_decay=0.01-0.1
// - warmup + cosine schedule

// LLM training:
// - AdamW near-universal
// - with warmup (1-5% of steps)
// - cosine decay to 10% of max
// - weight_decay: 0.1 common
// - large batch sizes

// Alternatives (2023+):
// - Lion: 2-3x memory efficient
// - 8-bit Adam: lower precision
// - distributed variants
// - shampoo: higher-order

// Standard practice:
// - use AdamW by default
// - try Adam if AdamW behaves badly
// - SGD for computer vision final tuning
// - experiment for specific tasks`}
        </pre>
        <p className="leading-7">
          AdamW: <strong>decoupled weight decay (outside Adam update)</strong>.<br />
          Transformers/BERT/GPT의 표준 옵티마이저.<br />
          lr=1e-3, weight_decay=0.01-0.1, warmup+cosine.
        </p>
      </div>
    </section>
  );
}
