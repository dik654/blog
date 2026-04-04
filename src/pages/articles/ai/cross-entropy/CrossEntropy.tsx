import CrossEntropyViz from './viz/CrossEntropyViz';

export default function CrossEntropy({ title }: { title?: string }) {
  return (
    <section id="cross-entropy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '크로스 엔트로피: 두 분포의 괴리'}</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        H(P,Q) = -Σ P(x)·log Q(x) — P의 확률로 Q의 놀라움을 계산.<br />
        P ≠ Q일수록 CE는 엔트로피보다 항상 큼 (Gibbs 부등식).
      </p>
      <CrossEntropyViz />
    </section>
  );
}
