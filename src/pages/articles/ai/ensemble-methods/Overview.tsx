import WhyEnsembleViz from './viz/WhyEnsembleViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">앙상블이 왜 효과적인가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          단일 모델 하나 — 특정 패턴에 강하지만 다른 패턴에서 오차가 발생<br />
          <strong>편향-분산 트레이드오프</strong>(Bias-Variance Tradeoff): 하나의 모델로 편향과 분산을 동시에 줄이기 어려움<br />
          앙상블(Ensemble) — 여러 모델의 예측을 결합하여 개별 오차를 상쇄
        </p>
        <p>
          핵심 원리: 서로 다른 모델의 오차는 서로 다른 방향으로 발생<br />
          N개 독립 모델의 예측을 평균 → 분산이 1/N로 감소 (Var[avg] = sigma^2/N)<br />
          <strong>"지혜의 군중"</strong>(Wisdom of Crowds) — 다수의 독립적 판단이 개인보다 정확한 현상<br />
          조건: (1) 모델 간 다양성(diversity) (2) 개별 정확도가 랜덤 이상
        </p>
        <p>
          Kaggle 통계: 상위 솔루션의 95% 이상이 앙상블 사용<br />
          단일 모델 상위 20% → 앙상블 적용 시 상위 5~10% 도달 가능<br />
          "같은 모델 복사본 100개는 무의미" — 서로 다른 모델이어야 오차 상쇄 발생
        </p>
      </div>
      <div className="not-prose my-8">
        <WhyEnsembleViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">앙상블 3대 전략</p>
          <p>
            <strong>Averaging</strong> — 모델 예측의 산술·가중·기하 평균. 가장 단순하고 안정적.<br />
            <strong>Stacking</strong> — Level-0 예측을 메타 모델이 학습. 비선형 조합 가능.<br />
            <strong>Blending</strong> — Stacking의 간소화. holdout 기반으로 누출 위험 최소화.
          </p>
        </div>
      </div>
    </section>
  );
}
