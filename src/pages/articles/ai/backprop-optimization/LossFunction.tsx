import LossViz from './viz/LossViz';

export default function LossFunction() {
  return (
    <section id="loss-function" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">손실 함수 비교</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        손실 함수 — 모델 예측과 정답 사이의 거리를 수치화.<br />
        분류는 Cross-Entropy, 회귀는 MSE, 분포 비교는 KL Divergence.
      </p>
      <LossViz />
    </section>
  );
}
