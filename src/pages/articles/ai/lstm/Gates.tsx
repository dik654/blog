import GateViz from './viz/GateViz';

export default function Gates() {
  return (
    <section id="gates" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">게이트 메커니즘</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        LSTM의 3개 게이트 — 각각 시그모이드(σ) 출력 [0,1]로 정보 흐름을 제어.<br />
        0 = 완전 차단, 1 = 완전 통과.
      </p>
      <GateViz />
    </section>
  );
}
