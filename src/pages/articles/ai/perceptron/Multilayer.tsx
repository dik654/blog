import MultilayerViz from './viz/MultilayerViz';

export default function Multilayer() {
  return (
    <section id="multilayer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">다층 퍼셉트론</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        층을 2개 쌓으면 XOR 해결 가능 — 은닉층이 비선형 경계를 학습한다.
      </p>
      <MultilayerViz />
    </section>
  );
}
