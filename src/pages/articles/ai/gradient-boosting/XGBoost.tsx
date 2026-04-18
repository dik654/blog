import XGBoostSplitViz from './viz/XGBoostSplitViz';

export default function XGBoost() {
  return (
    <section id="xgboost" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">XGBoost: histogram-based split</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>XGBoost</strong>(eXtreme Gradient Boosting, 2014) — 첸 티안치가 개발한 GBM의 산업 표준<br />
          핵심 혁신: 정규화된 목적함수 + 2차 테일러 전개 + 시스템 최적화<br />
          Kaggle에서 "GBM을 쓴다" ≈ "XGBoost를 쓴다"이던 시대를 열었다
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">정규화된 목적함수</h3>
        <p>
          Obj = Σ L(yᵢ, ŷᵢ) + Σ Ω(fₖ) — 학습 오차 + 트리 복잡도 페널티<br />
          Ω(f) = γ·T + ½·λ·‖w‖² — T는 리프 개수, w는 리프 가중치<br />
          γ(gamma) — 리프 추가의 최소 gain 임계값 → 불필요한 분할 방지 (pre-pruning)<br />
          λ(lambda) — 리프 가중치의 L2 정규화 → 극단적 예측 방지<br />
          α(alpha) — 리프 가중치의 L1 정규화 → 피처 선택 효과 (선택적)
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">2차 테일러 전개 — Hessian의 힘</h3>
        <p>
          일반 GBM은 1차 기울기(gradient)만 사용 — 보폭(step size) 결정이 부정확<br />
          XGBoost는 2차 미분(hessian)까지 활용: L ≈ L₀ + g·Δ + ½h·Δ²<br />
          g = ∂L/∂ŷ (1차, 방향), h = ∂²L/∂ŷ² (2차, 곡률)<br />
          최적 리프 가중치 w* = −G/(H+λ) — hessian이 클수록 보수적 업데이트<br />
          이것이 XGBoost가 다양한 손실 함수에서 안정적인 이유 — Newton 방법의 트리 버전
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Histogram-based Split</h3>
        <p>
          기존 exact split: 모든 피처값을 정렬 → O(N·log N) — 대규모 데이터에서 병목<br />
          Histogram split: 연속값을 256개 bin으로 양자화 → O(N) 히스토그램 구축 + O(#bins) 스캔<br />
          각 bin에 (gradient 합, hessian 합, 샘플 수)만 저장 → 메모리 절약<br />
          bin 개수가 충분하면 exact split과 정확도 차이 거의 없음<br />
          XGBoost v0.8+에서 tree_method='hist'로 활성화 — 현재는 기본값
        </p>
      </div>
      <XGBoostSplitViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">시스템 최적화</h3>
        <p>
          <strong>Column Subsampling</strong> — 각 트리/레벨/노드에서 피처 서브셋만 사용<br />
          colsample_bytree(0.6~0.9) — Random Forest 스타일의 다양성 확보<br />
          <strong>Weighted Quantile Sketch</strong> — 분산 환경에서 근사 분위수 계산<br />
          <strong>Cache-aware Access</strong> — 히스토그램을 캐시 라인에 맞춰 정렬<br />
          <strong>Sparsity-aware Split</strong> — 결측값을 자동으로 최적 방향에 배치
        </p>
      </div>
      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm">
          <strong>실전 팁:</strong> XGBoost에서 가장 중요한 파라미터 3개는 max_depth(3~8),
          learning_rate(0.01~0.1), n_estimators(early stopping으로 결정).
          그 다음이 reg_lambda(1~10), subsample(0.7~0.9), colsample_bytree(0.6~0.9).
        </p>
      </div>
    </section>
  );
}
