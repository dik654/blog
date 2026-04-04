import SoftmaxDerivViz from './viz/SoftmaxDerivViz';

export default function SoftmaxCEGradient() {
  return (
    <section id="softmax-ce-gradient" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Softmax + CE 미분</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        Softmax + Cross-Entropy 조합의 역전파 미분 = ŷ_j - y_j.<br />
        예측에서 정답을 빼기만 하면 기울기 완성 — 이것이 표준 조합인 이유.
      </p>
      <SoftmaxDerivViz />
    </section>
  );
}
