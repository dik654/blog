import CrossEntropyViz from './viz/CrossEntropyViz';

export default function CrossEntropy() {
  return (
    <section id="cross-entropy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">교차 엔트로피 손실</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        L = -log(y_정답) — 정답 확률에 -log를 취해 오차를 수치화.<br />
        확률이 1에 가까우면 손실 ≈ 0, 0에 가까우면 손실 급증.
      </p>
      <CrossEntropyViz />
    </section>
  );
}
