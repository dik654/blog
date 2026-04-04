import GradientUpdateViz from './viz/GradientUpdateViz';

export default function GradientUpdate() {
  return (
    <section id="gradient-update" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">경사 하강법 업데이트</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        θ_new = θ_old - η × ∇L — 기울기 반대 방향으로 파라미터 이동.<br />
        학습률 η로 이동 크기를 제어한다.
      </p>
      <GradientUpdateViz />
    </section>
  );
}
