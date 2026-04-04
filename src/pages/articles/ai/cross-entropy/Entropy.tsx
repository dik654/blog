import EntropyViz from './viz/EntropyViz';

export default function Entropy({ title }: { title?: string }) {
  return (
    <section id="entropy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '엔트로피: 불확실성의 척도'}</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        H(P) = -Σ P(x)·log P(x) — 놀라움의 기대값.<br />
        편향된 분포 → 낮은 엔트로피, 균등 분포 → 높은 엔트로피.
      </p>
      <EntropyViz />
    </section>
  );
}
