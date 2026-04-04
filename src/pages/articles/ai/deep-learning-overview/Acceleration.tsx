import GPUParallelViz from './viz/GPUParallelViz';

export default function Acceleration() {
  return (
    <section id="acceleration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">딥러닝 고속화</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        핵심 연산 = 행렬 곱셈 → GPU(코어 수천~수만)가 최적 하드웨어.<br />
        2012 AlexNet 이후 GPU 학습 시대 개막. 현재 H100 + 혼합 정밀도 + 분산 학습.
      </p>
      <GPUParallelViz />
    </section>
  );
}
