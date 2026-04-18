import AccuracyParadoxViz from './viz/AccuracyParadoxViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">불균형이 왜 문제인가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          현실 데이터는 대부분 <strong>불균형</strong>(Imbalanced) — 정상 거래 99%, 사기 1%<br />
          의료 영상에서 종양은 전체의 0.1%, 구조물 균열은 촬영 이미지의 2~5%<br />
          이 비대칭이 머신러닝 모델의 학습과 평가를 근본적으로 왜곡한다
        </p>
        <p>
          <strong>Accuracy Paradox</strong>(정확도 역설) — 전부 다수 클래스로 예측해도 높은 정확도<br />
          정상이 95%인 데이터에서 "전부 정상"으로 예측하면 Accuracy 95%<br />
          이 모델은 이상 탐지 능력이 0%이지만, 정확도 수치만 보면 우수해 보인다
        </p>
      </div>
      <AccuracyParadoxViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">불균형 대응 4가지 축</h3>
        <p>
          <strong>리샘플링</strong> — 데이터 수준에서 균형 맞추기 (SMOTE, 언더샘플링)<br />
          <strong>손실 함수</strong> — 학습 시 소수 클래스에 더 큰 가중치 (Focal Loss, Class Weight)<br />
          <strong>임계값 조정</strong> — 예측 시 threshold를 최적화 (PR Curve 기반)<br />
          <strong>평가 지표</strong> — Accuracy 대신 PR-AUC, MCC, F1으로 측정
        </p>
        <p>
          이 4가지 축은 독립적으로 적용할 수 있고, <strong>조합할수록 효과가 크다</strong><br />
          불균형 비율에 따라 전략이 달라진다: 1:5(경미)에서 1:1000+(극심)까지<br />
          극심한 불균형에서는 분류(Classification) 대신 이상 탐지(Anomaly Detection)로 전환이 필요하다
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">핵심 인사이트</p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          불균형 데이터에서 Accuracy는 무의미한 지표 — "전부 정상" 모델이 95%를 달성한다.
          실전에서는 <strong>소수 클래스의 Recall</strong>이 가장 중요하며,
          이를 높이기 위해 리샘플링 + 손실 함수 + 임계값 조정을 동시에 적용한다.
        </p>
      </div>
    </section>
  );
}
