import KLDivergenceViz from './viz/KLDivergenceViz';

export default function KLDivergence() {
  return (
    <section id="kl-divergence" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KL Divergence</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        D_KL(P‖Q) = CE(P,Q) - H(P) — 두 분포 간의 순수한 차이.<br />
        비대칭(P‖Q ≠ Q‖P), 대칭 버전은 Jensen-Shannon Divergence.
      </p>
      <KLDivergenceViz />
    </section>
  );
}
