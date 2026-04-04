import SigmoidViz from './viz/SigmoidViz';

export default function Sigmoid() {
  return (
    <section id="sigmoid" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시그모이드 (Sigmoid)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        σ(x) = 1/(1+e^-x) — 매끄러운 S자 곡선, 출력 0~1.<br />
        문제: Vanishing Gradient(σ' 최대 0.25) + 비영점 중심 출력.
      </p>
      <SigmoidViz />
    </section>
  );
}
