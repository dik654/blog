import AveragingViz from './viz/AveragingViz';

export default function Averaging() {
  return (
    <section id="averaging" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Weighted Average & Rank Average</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          가장 단순한 앙상블: N개 모델 예측의 <strong>산술 평균</strong>(Simple Average)<br />
          pred = (p1 + p2 + ... + pN) / N — 모든 모델에 동일 가중치 1/N<br />
          장점: 구현 1줄, 과적합 위험 최소. 단점: 약한 모델도 동일 비중
        </p>
        <p>
          <strong>Weighted Average</strong> — 모델별 가중치를 최적화<br />
          pred = w1*p1 + w2*p2 + w3*p3, 제약 w1+w2+w3 = 1<br />
          강한 모델에 더 큰 가중치 → scipy.optimize.minimize로 CV 점수 최대화<br />
          주의: 가중치도 과적합 대상 — fold 수가 적으면 단순 평균이 더 안전
        </p>
        <p>
          <strong>Rank Average</strong> — 예측을 순위(rank)로 변환 후 평균<br />
          서로 다른 스케일의 모델 조합에 효과적: 확률 0~1 vs 회귀 100~1000<br />
          순위로 변환하면 모든 모델이 같은 스케일 → AUC 등 순위 기반 지표에 강력
        </p>
        <p>
          <strong>Geometric Mean</strong> — 확률 예측의 곱의 N제곱근<br />
          pred = (p1 * p2 * p3)^(1/3)<br />
          한 모델이라도 낮은 확률이면 결과 급감 → "모든 모델이 동의할 때만" 높은 예측<br />
          LogLoss 최적화에 유리한 보수적 앙상블
        </p>
      </div>
      <div className="not-prose my-8">
        <AveragingViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">Averaging 선택 기준</p>
          <p>
            <strong>지표가 AUC</strong> → Rank Average (순위만 중요)<br />
            <strong>지표가 LogLoss</strong> → Geometric Mean (확률 보정 효과)<br />
            <strong>모델 차이 크지 않음</strong> → Simple Average (과적합 방지)<br />
            <strong>모델 성능 차이 큼</strong> → Weighted Average (강한 모델 비중 ↑)
          </p>
        </div>
      </div>
    </section>
  );
}
