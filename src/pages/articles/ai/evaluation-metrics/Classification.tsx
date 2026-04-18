import ClassificationMetricsViz from './viz/ClassificationMetricsViz';

export default function Classification() {
  return (
    <section id="classification" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">분류: AUC, F1, LogLoss, MCC</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          분류 지표는 <strong>Accuracy 하나로 해결되지 않는다</strong> — 불균형, 임계값, 확률 보정에 따라 다른 지표가 필요
        </p>
        <ul>
          <li><strong>AUC-ROC</strong> — 모든 threshold에서의 평균 랭킹 능력. 임계값에 무관</li>
          <li><strong>F1-Score</strong> — Precision과 Recall의 조화평균. 불균형 데이터에서 자주 사용</li>
          <li><strong>LogLoss</strong> — 확률 예측의 품질. 과신(overconfidence) 페널티</li>
          <li><strong>MCC</strong> — Matthews Correlation. 불균형에서도 공정한 단일 스칼라 지표</li>
        </ul>
      </div>

      <div className="not-prose my-8">
        <ClassificationMetricsViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Confusion Matrix 기반 4대 값</h3>
        <p>
          TP(True Positive), TN(True Negative), FP(False Positive), FN(False Negative)<br />
          Precision = TP / (TP+FP), Recall = TP / (TP+FN), F1 = 2·P·R / (P+R)
        </p>
        <p>
          딥페이크 탐지에서는 FN(가짜를 진짜로 판단)이 치명적 → <strong>Recall 우선</strong><br />
          스팸 필터는 FP(정상 메일을 스팸 처리)가 싫음 → <strong>Precision 우선</strong>
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: AUC는 분포에 무관</p>
        <p className="text-sm">
          양성 90% 데이터에서 Accuracy 95%는 의미 없지만(전부 양성 예측이면 90%) — AUC는 비율 무관하게 "정답을 상위에 두는 능력"을 측정<br />
          불균형 데이터 최우선 검토 지표는 AUC와 MCC
        </p>
      </div>
    </section>
  );
}
