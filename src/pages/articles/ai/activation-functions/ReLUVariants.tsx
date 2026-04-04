import ReLUVariantsViz from './viz/ReLUVariantsViz';

export default function ReLUVariants() {
  return (
    <section id="relu-variants" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ReLU 변형들</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        Dying ReLU 해결 — 음수 영역에 작은 기울기 또는 부드러운 곡선 부여.<br />
        Leaky ReLU, GELU(Transformer), SwiGLU(LLaMA) 등.
      </p>
      <ReLUVariantsViz />
    </section>
  );
}
