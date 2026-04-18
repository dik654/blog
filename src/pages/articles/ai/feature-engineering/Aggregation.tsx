import AggregationViz from './viz/AggregationViz';

export default function Aggregation() {
  return (
    <section id="aggregation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">집계 피처: GroupBy 전략</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>집계 피처(Aggregation Feature)</strong> — 그룹 단위의 통계량을 개별 행에 붙이는 기법.
          "이 사용자의 평균 구매액은 얼마인가?", "이 카테고리의 주문 수는 몇 건인가?"처럼
          개별 행에 <strong>그룹 수준의 맥락 정보</strong>를 부여한다.
          Kaggle 테이블형 대회에서 순위를 가르는 핵심 전략.
        </p>

        <h3>GroupBy 기본 패턴</h3>
        <p>
          pandas의 <code>groupby().agg()</code>로 그룹별 통계량 계산 → 원본 데이터에 <code>merge</code>.
          핵심은 그룹 키(user_id, category 등)와 집계 대상(amount, count 등)의 조합.
          user별 평균 구매액, 카테고리별 주문 수, 상점별 평점 분산 등.
        </p>

        <h3>다중 집계: mean, std, count, min, max</h3>
        <p>
          하나의 GroupBy에 여러 집계 함수를 동시에 적용.
          <strong>mean</strong> — 그룹 중심(대표값). <strong>std</strong> — 그룹 내 퍼짐(일관성).
          <strong>count</strong> — 그룹 크기(활성도). <strong>min/max</strong> — 극단값(이상 행동).
          이 4~5개 통계량을 조합하면 그룹의 특성을 다면적으로 포착할 수 있다.
        </p>
      </div>

      <div className="not-prose my-8">
        <AggregationViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Window 함수: 시간 순서 집계</h3>
        <p>
          GroupBy는 전체 기간을 한 번에 집계하지만, Window 함수는 <strong>시간 순서를 유지</strong>하면서 집계.
          rolling(7).mean() — 최근 7일 이동평균. expanding().sum() — 누적합.
          shift(1) — 이전 행의 값(lag 피처).
          시계열 맥락을 행 단위 피처로 변환하는 핵심 도구.
        </p>
        <p>
          주의: Window 함수 사용 시 <strong>미래 정보 누수</strong>에 특히 주의.
          rolling은 반드시 과거 방향으로만 계산. 학습/검증 분리 시점을 기준으로 계산 범위를 제한해야 한다.
        </p>

        <h3>다단계 집계</h3>
        <p>
          "사용자 → 카테고리 → 통계"처럼 계층적으로 집계.
          user_category_mean_amount = 사용자별 카테고리별 평균 구매액.
          더 세분화된 행동 패턴을 포착. 그룹 키를 2개 이상 사용하므로
          희소성(sparse group)에 주의 — 관측 수가 적은 조합은 노이즈가 많다.
        </p>

        <h3>집계 피처 네이밍 규칙</h3>
        <p>
          <code>{'{그룹키}_{집계함수}_{대상열}'}</code> 형태가 표준.
          user_mean_amount, cat_std_price, user_cat_count_order.
          명확한 네이밍이 디버깅과 피처 중요도 해석을 쉽게 만든다.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 집계 피처의 정보 누수 방지</p>
        <p className="text-sm">
          교차 검증 시 fold별로 집계를 따로 계산해야 한다.
          전체 데이터로 집계하면 검증 세트의 타겟 정보가 학습 세트로 유입.
          특히 Target Encoding + GroupBy 조합은 이중 누수 위험이 있으므로
          반드시 fold 내부에서만 계산하는 파이프라인을 구축해야 한다.
        </p>
      </div>
    </section>
  );
}
