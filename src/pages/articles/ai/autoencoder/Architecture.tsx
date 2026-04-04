import AutoFlowViz from './viz/AutoFlowViz';

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">구조 상세</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        인코더(n→k)로 차원 축소, 디코더(k→n)로 복원.<br />
        잠재 공간 크기가 핵심 — 너무 작으면 정보 손실, 너무 크면 단순 복사.
      </p>
      <AutoFlowViz />
    </section>
  );
}
