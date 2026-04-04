import ReLUViz from './viz/ReLUViz';

export default function ReLU() {
  return (
    <section id="relu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ReLU (Rectified Linear Unit)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        f(x) = max(0, x) — 양수 기울기 1 고정으로 Vanishing Gradient 해결.<br />
        문제: 음수 입력 → 기울기 0 → 영구 비활성(Dying ReLU).
      </p>
      <ReLUViz />
    </section>
  );
}
