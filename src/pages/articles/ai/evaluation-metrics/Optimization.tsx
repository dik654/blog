import OptimizationStrategyViz from './viz/OptimizationStrategyViz';

export default function Optimization() {
  return (
    <section id="optimization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">지표별 최적화 전략</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          지표를 안다는 것 = 해당 지표를 낮추는 방법을 안다는 것<br />
          손실 함수, threshold 튜닝, post-processing 3단계로 지표를 직접 공략한다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">지표별 손실 매핑</h3>
        <ul>
          <li><strong>RMSE</strong> → MSE loss 직접 사용 (동치)</li>
          <li><strong>MAE</strong> → L1 loss 또는 Huber loss</li>
          <li><strong>RMSLE</strong> → log1p 변환 후 MSE, 예측 시 expm1</li>
          <li><strong>F1</strong> → BCE 학습 후 threshold를 F1 최대화로 튜닝</li>
          <li><strong>AUC</strong> → pairwise ranking loss (RankNet), 또는 BCE + 충분한 에포크</li>
          <li><strong>NDCG</strong> → LambdaRank, ListMLE 같은 listwise loss</li>
        </ul>
      </div>

      <div className="not-prose my-8">
        <OptimizationStrategyViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">후처리(Post-processing)로 마지막 0.001</h3>
        <p>
          동일 모델 출력에서도 후처리만 바꿔 지표가 개선되는 경우:
        </p>
        <ul>
          <li><strong>Clipping</strong> — RMSE/RMSLE에서 예측을 타겟 범위로 제한</li>
          <li><strong>Threshold 튜닝</strong> — F1/MCC에서 최적 임계값 탐색 (OOF 기반)</li>
          <li><strong>Rank averaging</strong> — 앙상블에서 스케일 무관 병합</li>
          <li><strong>Calibration</strong> — Platt scaling, Isotonic으로 확률 보정 → LogLoss 개선</li>
        </ul>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: OOF 예측으로 튜닝</p>
        <p className="text-sm">
          threshold나 clipping 범위는 train 데이터가 아니라 OOF(Out-of-Fold) 예측값에서 찾아야 한다<br />
          train에서 최적화하면 과적합 — OOF는 모델이 보지 않은 예측이라 일반화 성능 추정에 적합
        </p>
      </div>
    </section>
  );
}
