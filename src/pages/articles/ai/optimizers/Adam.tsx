import AdamViz from './viz/AdamViz';
import AdamDetailViz from './viz/AdamDetailViz';

export default function Adam() {
  return (
    <section id="adam" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Adam (적응적 학습률)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        1차 모멘트(방향) + 2차 모멘트(크기)로 파라미터별 학습률 자동 조절.<br />
        θ = θ - η·m̂/(√v̂ + ε) — 희소 파라미터는 큰 스텝, 빈번한 파라미터는 작은 스텝.
      </p>
      <AdamViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Adam 상세</h3>
        <AdamDetailViz />
        <p className="leading-7">
          Adam: <strong>1st + 2nd moment, per-parameter adaptive LR</strong>.<br />
          bias correction for early iterations.<br />
          default choice for most deep learning (2015+).
        </p>
      </div>
    </section>
  );
}
