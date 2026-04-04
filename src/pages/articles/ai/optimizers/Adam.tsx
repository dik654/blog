import AdamViz from './viz/AdamViz';

export default function Adam() {
  return (
    <section id="adam" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Adam (적응적 학습률)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        1차 모멘트(방향) + 2차 모멘트(크기)로 파라미터별 학습률 자동 조절.<br />
        θ = θ - η·m̂/(√v̂ + ε) — 희소 파라미터는 큰 스텝, 빈번한 파라미터는 작은 스텝.
      </p>
      <AdamViz />
    </section>
  );
}
