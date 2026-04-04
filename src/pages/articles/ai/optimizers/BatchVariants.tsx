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
    </section>
  );
}
