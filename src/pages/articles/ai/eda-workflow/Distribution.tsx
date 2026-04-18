import DistributionViz from './viz/DistributionViz';

export default function Distribution() {
  return (
    <section id="distribution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">분포 확인 & 타겟 분석</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          EDA의 첫 번째 실질적 분석 — <strong>타겟 변수의 분포부터 확인</strong><br />
          타겟이 정규분포인지, 치우쳐 있는지, 이상치가 있는지에 따라 손실 함수와 전처리 전략이 완전히 달라진다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">치우침(Skewness)이 문제인 이유</h3>
        <p>
          RMSE 기반 평가 대회에서 타겟이 오른쪽으로 치우쳐 있으면 — 극단값이 RMSE를 지배<br />
          skewness(비대칭도)가 |1.0| 이상이면 변환을 고려:
        </p>
        <ul>
          <li><strong>log1p 변환</strong> — log(1+y), 가장 흔한 선택. 0값도 안전하게 처리</li>
          <li><strong>Box-Cox 변환</strong> — 최적 λ를 자동 탐색. 양수값만 가능</li>
          <li><strong>Yeo-Johnson 변환</strong> — Box-Cox 확장, 음수값도 처리 가능</li>
        </ul>
        <p>
          변환 후 학습 → 예측 시 역변환(expm1) — 이 순서를 실수하면 스코어가 무너진다
        </p>
      </div>

      <div className="not-prose my-8">
        <DistributionViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">이상치 판단 기준</h3>
        <p>
          이상치(outlier)를 무조건 제거하면 안 된다 — 핵심은 "이것이 노이즈인가, 실제 신호인가"<br />
          창고 지연 대회에서 60분+ 지연 — 실제로 발생하는 극단 상황이므로 함부로 제거 불가
        </p>
        <ul>
          <li><strong>IQR 방법</strong> — Q1-1.5×IQR ~ Q3+1.5×IQR 범위 밖 = 이상치 후보</li>
          <li><strong>Z-score</strong> — |z| {'>'} 3이면 이상치 후보 (정규분포 가정)</li>
          <li><strong>도메인 판단</strong> — 물리적으로 불가능한 값(음수 시간 등)만 제거</li>
        </ul>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: GBM은 이상치에 강하다</p>
        <p className="text-sm">
          XGBoost/LightGBM은 트리 기반이라 이상치에 자연스럽게 강건<br />
          이상치 제거는 선형 모델·신경망에서 효과가 크고, GBM에서는 오히려 정보 손실이 될 수 있다
        </p>
      </div>
    </section>
  );
}
