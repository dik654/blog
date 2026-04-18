import CorrelationViz from './viz/CorrelationViz';

export default function Correlation() {
  return (
    <section id="correlation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상관관계 & 피처 관계</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          피처가 90개 — 이 중 어떤 것이 타겟에 유용한가?<br />
          <strong>상관 분석</strong>으로 피처-타겟 관계를 정량화하고, 피처 간 중복(다중공선성)을 식별한다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Pearson vs Spearman</h3>
        <p>
          <strong>Pearson 상관계수(r)</strong> — 두 변수 간 선형 관계의 강도와 방향을 측정.
          -1(완전 역비례) ~ 0(무관) ~ +1(완전 비례)<br />
          <strong>Spearman 순위 상관(ρ)</strong> — 값 대신 순위를 사용, 비선형 단조 관계도 탐지.
          변수가 함께 증가/감소하는 경향만 있으면 높은 값
        </p>
        <p>
          실전 접근: Pearson으로 전체 히트맵을 그린 뒤,
          타겟과 Pearson이 낮지만 Spearman이 높은 피처를 별도 마킹 — 비선형 변환 후보
        </p>
      </div>

      <div className="not-prose my-8">
        <CorrelationViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">다중공선성(Multicollinearity)</h3>
        <p>
          피처 A와 B의 상관이 0.9 이상 — 거의 같은 정보를 담고 있다는 뜻<br />
          선형 회귀에서는 계수가 불안정해지고, 트리 모델에서는 피처 중요도가 분산된다
        </p>
        <p>
          <strong>VIF(분산팽창계수)</strong>로 진단: 각 피처를 나머지 피처로 회귀했을 때 R²가 높으면 VIF가 높음<br />
          VIF {'>'} 10 → 강한 다중공선성 → 하나를 제거하거나 PCA로 차원 축소
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: GBM에서의 다중공선성</p>
        <p className="text-sm">
          XGBoost/LightGBM은 트리 분할 시 하나의 피처만 선택하므로, 다중공선성 자체가 성능을 해치지 않는다<br />
          하지만 피처 중요도 해석이 왜곡됨 — 상관 높은 피처끼리 중요도가 나뉘어 실제보다 낮게 측정된다<br />
          해석이 중요한 대회(설명 가능성 평가)에서는 여전히 제거가 유리
        </p>
      </div>
    </section>
  );
}
