import EvaluationViz from './viz/EvaluationViz';

export default function Evaluation() {
  return (
    <section id="evaluation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">평가: PR곡선, F1, Cohen Kappa</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          불균형 데이터에서 <strong>Accuracy</strong>(정확도)는 무의미한 지표<br />
          "전부 정상" 예측이 95% Accuracy를 달성하는 상황에서, 97% Accuracy가 좋은 성능인지 판단 불가<br />
          평가 지표 선택이 곧 모델의 실질적 성능 판단을 결정한다
        </p>
        <p>
          <strong>Confusion Matrix</strong>(혼동 행렬) — 평가의 출발점<br />
          TP(True Positive): 이상을 이상으로 탐지 — 올바른 탐지<br />
          FP(False Positive): 정상을 이상으로 오탐 — 불필요한 경보<br />
          FN(False Negative): 이상을 정상으로 놓침 — 가장 치명적<br />
          TN(True Negative): 정상을 정상으로 판정 — 불균형에서 이것이 Accuracy를 지배
        </p>
        <p>
          <strong>Precision</strong> = TP / (TP + FP): 양성 예측 중 실제 양성 비율 — "경보의 신뢰도"<br />
          <strong>Recall</strong> = TP / (TP + FN): 실제 양성 중 탐지 비율 — "놓치지 않는 능력"<br />
          <strong>F1-Score</strong> = 2 * P * R / (P + R): Precision과 Recall의 조화 평균<br />
          산술 평균이 아닌 <strong>조화 평균</strong>인 이유: 둘 중 하나가 0이면 F1도 0이 되어, 한쪽만 높은 편향 모델을 걸러냄
        </p>
      </div>
      <EvaluationViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">PR-AUC가 ROC-AUC보다 유용한 이유</h3>
        <p>
          <strong>ROC Curve</strong>: FPR(x축) vs TPR(y축) — TN이 많으면 FPR이 항상 낮게 유지<br />
          불균형에서 ROC-AUC가 0.96처럼 높게 나와도, 실제 소수 클래스 성능은 낮을 수 있음<br />
          <strong>PR Curve</strong>: Recall(x축) vs Precision(y축) — TN을 사용하지 않음<br />
          소수 클래스의 탐지 능력(Recall)과 정밀도(Precision)만으로 평가 → 불균형에서 현실적
        </p>
        <p>
          같은 모델이 ROC-AUC 0.96, PR-AUC 0.68을 보일 수 있다<br />
          ROC-AUC는 "다수 클래스를 잘 맞추는 능력"이 점수를 부풀리고<br />
          PR-AUC는 "소수 클래스만의 진짜 성능"을 보여준다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Cohen's Kappa와 MCC</h3>
        <p>
          <strong>Cohen's Kappa</strong> = (p_o - p_e) / (1 - p_e)<br />
          p_o(관측 일치율, 즉 Accuracy)를 p_e(우연 일치율)로 보정<br />
          "우연히 맞출 확률"을 빼서 <strong>실제 학습 효과</strong>만 측정<br />
          0.0=우연 수준, 0.4+=보통, 0.6+=상당, 0.8+=거의 완벽
        </p>
        <p>
          <strong>MCC</strong>(Matthews Correlation Coefficient)<br />
          = (TP*TN - FP*FN) / sqrt((TP+FP)(TP+FN)(TN+FP)(TN+FN))<br />
          범위: -1(완전 반대) ~ 0(랜덤) ~ +1(완벽 예측)<br />
          TP, FP, FN, TN 4가지를 모두 사용하는 <strong>유일한 단일 지표</strong><br />
          "전부 정상" 예측 → MCC = 0 (우연 수준으로 정확히 판단)
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">평가 지표 실전 조합</p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          경미한 불균형(1:5) → <strong>F1-Score</strong>로 충분.
          보통(1:20) → <strong>PR-AUC + F1</strong> 조합.
          심각(1:100+) → <strong>MCC + PR-AUC</strong>가 가장 편향 없는 조합.
          Kaggle 대회에서도 불균형 문제는 F1 또는 PR-AUC로 평가하며,
          Accuracy로 평가하는 대회에서도 불균형이 있으면 반드시 F1과 MCC를 함께 확인해야 한다.
        </p>
      </div>
    </section>
  );
}
