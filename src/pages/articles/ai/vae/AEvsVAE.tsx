import AEvsVAEViz from './viz/AEvsVAEViz';

export default function AEvsVAE() {
  return (
    <section id="ae-vs-vae" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AE vs VAE: 잠재 공간의 결정적 차이</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        AE: z = f(x) — 결정론적 점 하나. 잠재 공간에 빈 구멍 존재.<br />
        VAE: z ~ N(μ, σ²) — 확률 분포. 잠재 공간이 연속적으로 채워진다.
      </p>
      <AEvsVAEViz />
    </section>
  );
}
