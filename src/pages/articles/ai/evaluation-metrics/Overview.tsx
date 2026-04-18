import MetricMattersViz from './viz/MetricMattersViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">지표가 모델 선택을 결정한다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          대회에서 가장 먼저 확인해야 할 것은 데이터가 아니라 <strong>평가 지표</strong><br />
          RMSE 대회에서 MAE를 최적화하면 — 모델은 좋아져도 순위는 떨어진다
        </p>
        <p>
          지표마다 "좋은 모델"의 정의가 다르다 — 손실 함수, 앙상블 가중치, threshold, 하이퍼파라미터 탐색 전부 지표에 맞춰야 한다
        </p>
      </div>

      <div className="not-prose my-8">
        <MetricMattersViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">지표 이해의 3단계</h3>
        <ul>
          <li><strong>수학적 정의</strong> — 수식과 범위를 정확히 안다</li>
          <li><strong>민감도 특성</strong> — 어떤 오차에 민감한지, 어떤 상황에 약한지</li>
          <li><strong>최적화 전략</strong> — 해당 지표를 직접 낮추는 손실과 후처리 방법</li>
        </ul>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 지표부터 베이스라인</p>
        <p className="text-sm">
          베이스라인은 "가장 단순한 예측"으로 지표 값을 측정하는 것 — 평균값 예측, 최빈 클래스 예측<br />
          모든 모델은 이 베이스라인을 넘어야 의미 있다
        </p>
      </div>
    </section>
  );
}
