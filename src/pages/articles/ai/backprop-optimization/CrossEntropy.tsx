import CrossEntropyViz from './viz/CrossEntropyViz';
import InfoTheoryViz from './viz/InfoTheoryViz';
import CeStabilityViz from './viz/CeStabilityViz';
import LabelSmoothingViz from './viz/LabelSmoothingViz';

export default function CrossEntropy() {
  return (
    <section id="cross-entropy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">교차 엔트로피 손실</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        L = -log(y_정답) — 정답 확률에 -log를 취해 오차를 수치화.<br />
        확률이 1에 가까우면 손실 ≈ 0, 0에 가까우면 손실 급증.
      </p>
      <CrossEntropyViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">정보이론에서 유도</h3>
        <p>
          Information Content → Entropy → Cross-Entropy → KL Divergence로 계층적 확장<br />
          분류 문제: one-hot 라벨이므로 <code>H(P,Q) = −log Q(정답)</code>로 단순화
        </p>
      </div>
      <InfoTheoryViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">수치 안정성 · Weighted CE · Focal Loss</h3>
        <p>
          overflow/log(0) 문제 해법부터 클래스 불균형 대응까지.
        </p>
      </div>
      <CeStabilityViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Label Smoothing</h3>
        <p>
          정답 라벨을 정확히 1이 아닌 (1−ε)로 완화 — Overconfidence 방지<br />
          PyTorch: <code>nn.CrossEntropyLoss(label_smoothing=0.1)</code>
        </p>
      </div>
      <LabelSmoothingViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Cross-Entropy의 우아함</p>
          <p>
            <strong>수학적 아름다움</strong>:<br />
            - 정보이론(Shannon)에서 유래<br />
            - MLE와 동치 (Maximum Likelihood)<br />
            - Softmax와 결합 시 gradient 단순 (ŷ - y)
          </p>
          <p className="mt-2">
            <strong>실무적 강점</strong>:<br />
            ✓ 확률적 해석 가능 (log-likelihood)<br />
            ✓ 수치 안정 구현 존재 (logsumexp)<br />
            ✓ Gradient가 error에 비례 (self-regulating)<br />
            ✓ Multi-class 자연스럽게 확장
          </p>
          <p className="mt-2">
            <strong>주의사항</strong>:<br />
            ✗ Class imbalance에 민감 (weighted/focal 필요)<br />
            ✗ Label noise에 취약 (label smoothing)<br />
            ✗ 출력 calibration 문제 (ECE로 측정)<br />
            ✗ Boundary가 불명확한 문제엔 부적합
          </p>
        </div>

      </div>
    </section>
  );
}
