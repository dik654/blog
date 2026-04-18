import LossViz from './viz/LossViz';
import LossComparisonViz from './viz/LossComparisonViz';
import LossTaskMapViz from './viz/LossTaskMapViz';
import CeIntuitionViz from './viz/CeIntuitionViz';

export default function LossFunction() {
  return (
    <section id="loss-function" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">손실 함수 비교</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        손실 함수 — 모델 예측과 정답 사이의 거리를 수치화.<br />
        분류는 Cross-Entropy, 회귀는 MSE, 분포 비교는 KL Divergence.
      </p>
      <LossViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">회귀 Loss 3종 비교 — 곡선 형태</h3>
        <p>
          MSE(제곱, 이상치 민감) vs MAE(절대값, robust) vs Huber(하이브리드)<br />
          곡선 형태가 gradient 동작을 결정 — MSE는 error 크면 폭증, MAE는 선형, Huber는 전환점 있음
        </p>
      </div>
      <LossComparisonViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">Loss Function 카탈로그</h3>
        <p>
          MSE / MAE / Huber (회귀), CE / BCE (분류), KL (분포) — 각 task에 매칭되는 표준 조합
        </p>
      </div>
      <LossTaskMapViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Cross-Entropy 직관적 이해</h3>
        <p>
          정보이론 해석, 구체 계산 예시, gradient의 self-regulating 특성.
        </p>
      </div>
      <CeIntuitionViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">


        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Loss 선택이 학습 dynamics를 결정</p>
          <p>
            <strong>Gradient magnitude</strong>:<br />
            - MSE: gradient ∝ error (linear in error)<br />
            - CE: gradient ∝ 1/probability (aggressive near 0)<br />
            - MAE: gradient = ±1 (constant magnitude)
          </p>
          <p className="mt-2">
            <strong>Training behavior</strong>:<br />
            - MSE + 분류: 처음 빠르다가 느려짐<br />
            - CE + 분류: 일관된 학습 속도<br />
            - MAE + 회귀: 느리지만 안정적
          </p>
          <p className="mt-2">
            <strong>Production 고려사항</strong>:<br />
            - Class imbalance → weighted loss 또는 focal<br />
            - Outlier 많음 → MAE 또는 Huber<br />
            - Label noise → label smoothing<br />
            - Multi-task → loss weighting (uncertainty-based)
          </p>
        </div>

      </div>
    </section>
  );
}
