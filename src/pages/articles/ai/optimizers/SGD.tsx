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
    </section>
  );
}
