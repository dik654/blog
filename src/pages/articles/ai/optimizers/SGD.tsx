import SGDViz from './viz/SGDViz';
import SGDDetailViz from './viz/SGDDetailViz';

export default function SGD() {
  return (
    <section id="sgd" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SGD (확률적 경사 하강법)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        θ = θ - η·∇L(θ) — 가장 기본적인 최적화 알고리즘.<br />
        고정 학습률의 한계: 발산, 느린 수렴, 안장점 정체.
      </p>
      <SGDViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">SGD 상세</h3>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          업데이트 규칙, 4가지 핵심 문제, LR 스케줄 전략, 장단점과 사용 시점.
        </p>
      </div>
      <SGDDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          SGD: <strong>θ_(t+1) = θ_t - η·∇L, single-sample stochastic</strong>.<br />
          문제: oscillation, saddle points, ill-conditioning.<br />
          LR schedules: cosine, warmup 표준.
        </p>
      </div>
    </section>
  );
}
