import StepFunctionViz from './viz/StepFunctionViz';
import StepHistoryViz from './viz/StepHistoryViz';

export default function StepFunction() {
  return (
    <section id="step-function" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">계단 함수 (Step Function)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          역사적 출발점 — 1943년 McCulloch-Pitts 뉴런 모델<br />
          입력의 가중합이 임계값(threshold)을 넘으면 1, 아니면 0<br />
          이진 분류(binary classification)의 가장 단순한 형태
        </p>
        <div className="rounded-lg border p-3 font-mono text-sm mb-4">
          f(x) = 1 (x &ge; 0), 0 (x &lt; 0)
        </div>
        <p>
          <strong>치명적 문제</strong> — 미분값이 전 구간에서 0<br />
          불연속점(x=0)에서는 미분 자체가 정의되지 않는다<br />
          경사 하강법(gradient descent)은 미분값으로 가중치를 업데이트<br />
          미분 = 0이면 학습 신호가 전달되지 않아 학습 자체가 불가능
        </p>
      </div>
      <div className="not-prose my-8">
        <StepFunctionViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">역사 · 한계 · 미분 불가 해결</h3>
        <p>McCulloch-Pitts(1943) → Perceptron(1958) → XOR 한계 → 미분 불가 문제와 4가지 해결법.</p>
      </div>
      <StepHistoryViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: Step function은 <strong>학습 불가</strong>지만 역사적 출발점.<br />
          요약 2: <strong>Sigmoid가 smooth 버전</strong>으로 대체 — backprop 가능.<br />
          요약 3: 현대에도 <strong>양자화·스파이킹 NN</strong> 등에서 응용.
        </p>
      </div>
    </section>
  );
}
