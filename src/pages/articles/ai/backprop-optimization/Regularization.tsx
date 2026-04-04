import RegularizationViz from './viz/RegularizationViz';

export default function Regularization() {
  return (
    <section id="regularization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">정규화 기법</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        과적합(overfitting) 방지 — 의도적 방해로 일반화 성능 향상.<br />
        L1/L2, Dropout, Early Stopping 등 다양한 기법이 존재한다.
      </p>
      <RegularizationViz />
    </section>
  );
}
