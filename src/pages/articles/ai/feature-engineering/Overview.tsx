import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 피처 엔지니어링인가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>피처 엔지니어링(Feature Engineering)</strong> — 원본 데이터에서 모델이 학습하기 좋은 형태의 새로운 변수를 만드는 과정.
          Kaggle 상위권 솔루션 대부분이 "모델을 바꿔서"가 아니라 "피처를 잘 만들어서" 순위를 올렸다는 공통점을 가진다.
        </p>
        <p>
          동일한 XGBoost를 사용해도 원본 피처만 넣으면 AUC 0.72, 파생 피처 42개를 추가하면 AUC 0.91이 나오는 일이 흔하다.
          모델 선택보다 <strong>피처 설계가 성능 천장을 결정</strong>한다.
        </p>

        <h3>80/20 법칙</h3>
        <p>
          실전 ML 프로젝트에서 전체 시간의 80%를 데이터 이해와 피처 설계에 투자한다.
          모델 튜닝·앙상블은 나머지 20%. Grand Master급 실무자들이 공유하는 일관된 전략이다.
        </p>
      </div>

      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>원본 피처 vs 파생 피처</h3>
        <p>
          <strong>원본 피처</strong> — 데이터셋에 그대로 존재하는 열(age, income, city 등).
          모델이 비선형 관계를 자체적으로 찾아야 하므로 학습 부담이 크다.
        </p>
        <p>
          <strong>파생 피처</strong> — 원본을 변환·조합해서 만든 새 열(income_per_age, city_mean_target 등).
          도메인 지식을 "피처 형태로 주입"하는 것이므로 모델의 학습 부담을 줄여 성능이 올라간다.
        </p>

        <h3>이 글에서 다루는 범위</h3>
        <p>
          수치형 변환(스케일링·로그·구간화) → 범주형 인코딩(타겟·빈도·임베딩) → 인터랙션(교차·비율·차이) → 집계 피처(GroupBy) → 피처 선택(SHAP·Boruta·RFE).
          각 기법의 "왜 쓰는가" → "어떻게 적용하는가" → "언제 쓰면 안 되는가"를 순서대로 다룬다.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 피처 엔지니어링의 출발점</p>
        <p className="text-sm">
          EDA에서 발견한 "타겟과의 상관관계"가 피처 설계의 출발점이다.
          상관이 높은 피처를 중심으로 교차·비율·집계를 시도하면 효율적.
          무작정 모든 조합을 만드는 것은 과적합의 지름길이다.
        </p>
      </div>
    </section>
  );
}
