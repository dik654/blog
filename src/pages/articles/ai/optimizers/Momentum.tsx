import MomentumViz from './viz/MomentumViz';
import MomentumDetailViz from './viz/MomentumDetailViz';

export default function Momentum() {
  return (
    <section id="momentum" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Momentum (관성 기반 최적화)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        v_t = β·v_(t-1) + ∇L — 이전 이동 방향을 기억하여 일관된 방향으로 가속.<br />
        β=0.9이면 약 10스텝의 EMA. 진동은 상쇄, 주 방향은 누적.
      </p>
      <MomentumViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Momentum 상세</h3>
        <MomentumDetailViz />
        <p className="leading-7">
          Momentum: <strong>v_t = β·v_(t-1) + ∇L, "ball rolling" analogy</strong>.<br />
          β=0.9 typical (EMA ~10 steps).<br />
          NAG (Nesterov) = look-ahead variant.
        </p>
      </div>
    </section>
  );
}
