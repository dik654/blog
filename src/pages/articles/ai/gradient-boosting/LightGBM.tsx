import LeafWiseViz from './viz/LeafWiseViz';

export default function LightGBM() {
  return (
    <section id="lightgbm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LightGBM: leaf-wise 성장</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>LightGBM</strong>(Light Gradient Boosting Machine, 2017) — Microsoft Research가 개발<br />
          핵심 목표: XGBoost와 동등한 정확도 + 훨씬 빠른 학습 속도<br />
          3가지 혁신: Leaf-wise 성장 + GOSS + EFB
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Leaf-wise vs Level-wise 성장</h3>
        <p>
          <strong>Level-wise</strong>(XGBoost 기본) — 같은 깊이의 모든 노드를 분할, 균형 트리 생성<br />
          장점: 과적합에 강함 | 단점: Gain이 낮은 노드도 불필요하게 분할<br />
          <strong>Leaf-wise</strong>(LightGBM 기본) — 현재 리프 중 Gain이 가장 큰 하나만 분할<br />
          같은 리프 수에서 더 낮은 오차 달성 — 비대칭 트리 생성<br />
          과적합 위험이 있으므로 max_depth(기본 -1, 무제한) + num_leaves(기본 31)로 제어<br />
          실전 경험칙: num_leaves = 2^(max_depth) - 1보다 작게 설정
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">GOSS: Gradient-based One-Side Sampling</h3>
        <p>
          모든 샘플이 동등하게 중요하지 않다 — |gradient|가 큰 샘플이 정보량 높음<br />
          |gradient|가 크면 아직 모델이 잘 맞추지 못하는 "어려운" 샘플<br />
          상위 a%는 전부 유지 + 나머지 (1-a)%에서 b%만 랜덤 샘플링<br />
          샘플링된 작은 기울기 샘플에 (1-a)/b 가중치 부여 → 편향 없는 gradient 추정<br />
          실전 기본값: top_rate(a)=0.2, other_rate(b)=0.1 → 전체의 30%만 사용해도 정확도 유지
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">EFB: Exclusive Feature Bundling</h3>
        <p>
          대규모 데이터에서 피처가 수천 개이면 히스토그램 구축이 병목<br />
          <strong>희소 피처</strong>(sparse features) — 대부분 0인 피처가 많음 (one-hot 인코딩 결과 등)<br />
          동시에 non-zero가 드문 피처끼리 하나의 "번들"로 묶음<br />
          그래프 컬러링 문제로 변환: 피처 간 충돌(동시 non-zero)을 엣지로, 같은 색 = 같은 번들<br />
          피처 1000개 → 100개 번들로 축소 가능 → 히스토그램 구축 10배 가속
        </p>
      </div>
      <LeafWiseViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">범주형 피처 직접 지원</h3>
        <p>
          XGBoost는 범주형 피처를 one-hot 인코딩해야 함 → 고카디널리티(high-cardinality)에서 비효율<br />
          LightGBM은 범주형 피처를 직접 분할 — Fisher의 최적 분할 근사 알고리즘 사용<br />
          각 범주의 gradient 통계(Σg/Σh)로 정렬 → 연속 피처처럼 최적 분할점 탐색<br />
          O(k·log k) 시간 — k가 카디널리티 | one-hot 대비 메모리와 속도 모두 우위
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Histogram Subtraction Trick</h3>
        <p>
          부모 노드의 히스토그램 = 좌 자식 + 우 자식<br />
          따라서 한쪽 자식만 구축하고, 다른 쪽은 뺄셈으로 계산 → 연산 50% 절약<br />
          작은 자식을 직접 구축(데이터 적음) + 큰 자식은 뺄셈 — 이것이 LightGBM의 속도 비결 중 하나
        </p>
      </div>
      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm">
          <strong>실전 팁:</strong> LightGBM에서 가장 중요한 파라미터는 num_leaves(31→63 사이 탐색),
          min_child_samples(20~100), learning_rate(0.01~0.1).
          데이터가 100만 행 이상이면 GOSS가 자동으로 큰 차이를 만든다.
        </p>
      </div>
    </section>
  );
}
