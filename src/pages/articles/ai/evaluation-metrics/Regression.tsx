import RegressionMetricsViz from './viz/RegressionMetricsViz';

export default function Regression() {
  return (
    <section id="regression" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">회귀: RMSE, MAE, RMSLE, R²</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          회귀 대회에서 가장 많이 쓰이는 네 지표 — 각각 서로 다른 "좋음"을 정의한다
        </p>
        <ul>
          <li><strong>RMSE</strong> — 평균 제곱 오차의 제곱근. 큰 오차에 페널티가 제곱으로 커짐 → 이상치 민감</li>
          <li><strong>MAE</strong> — 평균 절대 오차. 모든 오차를 동일하게 취급 → 이상치에 강건</li>
          <li><strong>RMSLE</strong> — 로그 스케일 RMSE. 비율 오차를 평가, 타겟이 치우쳤을 때 적합</li>
          <li><strong>R²</strong> — 설명력. 1에 가까울수록 좋고 음수도 가능</li>
        </ul>
      </div>

      <div className="not-prose my-8">
        <RegressionMetricsViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">언제 무엇을 쓸 것인가</h3>
        <ul>
          <li>타겟에 이상치가 많다 → <strong>MAE</strong> (또는 Huber loss)</li>
          <li>큰 오차를 절대 허용 안 됨 → <strong>RMSE</strong> (손실로 MSE 직접 사용)</li>
          <li>타겟이 log-scale(가격, 판매량) → <strong>RMSLE</strong> (log1p 변환 후 RMSE)</li>
          <li>모델 설명력 보고 → <strong>R²</strong></li>
        </ul>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: MAE 최적화는 중앙값 예측</p>
        <p className="text-sm">
          MSE 손실의 최적해는 평균, MAE 손실의 최적해는 중앙값<br />
          이상치가 있는 데이터에서 평균은 이상치에 끌려가지만 중앙값은 안정적 — MAE가 강건한 이유
        </p>
      </div>
    </section>
  );
}
