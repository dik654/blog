import SoftmaxDerivViz from './viz/SoftmaxDerivViz';
import SoftmaxGradViz from './viz/SoftmaxGradViz';

export default function SoftmaxCEGradient() {
  return (
    <section id="softmax-ce-gradient" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Softmax + CE 미분</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        Softmax + Cross-Entropy 조합의 역전파 미분 = ŷ_j - y_j.<br />
        예측에서 정답을 빼기만 하면 기울기 완성 — 이것이 표준 조합인 이유.
      </p>
      <SoftmaxDerivViz />
      <SoftmaxGradViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 깊은 수학적 이유</p>
          <p>
            <strong>Exponential Family</strong>:<br />
            - p(y|η) = h(y) exp(η^T · T(y) - A(η))<br />
            - Natural parameter: η<br />
            - Sufficient statistic: T(y)<br />
            - Log partition: A(η)
          </p>
          <p className="mt-2">
            <strong>핵심 결과</strong>:<br />
            ∇ log p(y|η) = T(y) - E[T(y)]<br />
            - Softmax: natural param = logits, E = predicted probs<br />
            - Sigmoid: natural param = logit, E = predicted prob<br />
            - 모두 "observed - expected" 형태
          </p>
          <p className="mt-2">
            <strong>실무 의미</strong>:<br />
            ✓ 단순한 gradient → 빠른 구현<br />
            ✓ 수치 안정 (log-space 연산)<br />
            ✓ 이론적 우아함 (MLE와 동치)<br />
            ✓ 일반화 가능 (다양한 loss로 확장)
          </p>
        </div>
      </div>
    </section>
  );
}
