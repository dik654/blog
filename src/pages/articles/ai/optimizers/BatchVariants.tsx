import BatchVariantsViz from './viz/BatchVariantsViz';
import BatchDetailViz from './viz/BatchDetailViz';

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
        <BatchDetailViz />
        <p className="leading-7">
          Batch: <strong>Full (all data) vs SGD (1) vs Mini-batch (N=32-256)</strong>.<br />
          LR ∝ batch_size 또는 sqrt(batch_size).<br />
          gradient accumulation으로 large effective batch 가능.
        </p>
      </div>
    </section>
  );
}
