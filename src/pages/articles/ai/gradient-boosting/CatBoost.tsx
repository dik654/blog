import OrderedBoostingViz from './viz/OrderedBoostingViz';

export default function CatBoost() {
  return (
    <section id="catboost" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CatBoost: 순서형 부스팅</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>CatBoost</strong>(Categorical Boosting, 2018) — Yandex가 개발<br />
          핵심 문제의식: 기존 GBM의 <strong>target leakage</strong>(타겟 정보 누출)를 근본적으로 해결<br />
          3가지 혁신: Ordered Boosting + Symmetric Tree + Ordered Target Statistics
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Target Leakage 문제</h3>
        <p>
          일반 GBM에서 잔차를 계산할 때 — 모든 훈련 샘플을 사용한 모델로 잔차를 구함<br />
          이는 예측 대상 샘플의 정보가 이미 모델에 포함된 상태에서 잔차를 계산하는 셈<br />
          교차 검증에서도 잡히지 않는 미묘한 과적합 — 특히 데이터가 작을수록 심각<br />
          CatBoost는 이 문제를 <strong>순서(ordering)</strong>로 해결
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Ordered Boosting</h3>
        <p>
          데이터를 랜덤 순열 σ로 정렬<br />
          샘플 σ(i)의 잔차: σ(1)~σ(i-1)까지만으로 학습한 모델의 예측 오차<br />
          각 샘플이 "자기 자신과 미래"를 보지 못함 — leave-one-out의 효율적 근사<br />
          복수 순열을 사용하여 분산 감소 (기본 4개 순열)<br />
          메모리 비용: 순열 수 × 모델 수 → CatBoost의 메모리 사용량이 큰 이유
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Symmetric Tree (Oblivious Decision Tree)</h3>
        <p>
          CatBoost의 기본 트리: 같은 깊이의 모든 노드가 <strong>동일한 분할 조건</strong> 사용<br />
          깊이 d → 분할 조건 d개, 리프 2^d개 — 매우 규칙적인 구조<br />
          일반 트리 대비 표현력은 제한되지만 강력한 정규화 효과<br />
          규칙적 구조 → GPU SIMD 연산 최적화 + 비트 연산으로 O(d) 예측<br />
          grow_policy='Depthwise'(기본), 비대칭 트리가 필요하면 'Lossguide' 선택
        </p>
      </div>
      <OrderedBoostingViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Ordered Target Statistics — 범주형의 정석</h3>
        <p>
          범주형 피처를 수치로 변환할 때도 순서 기반 통계 사용<br />
          {'TS(xᵢ) = (Σ_{j<i}[xⱼ=xᵢ]·yⱼ + a·p) / (Σ_{j<i}[xⱼ=xᵢ] + a)'}<br />
          a = smoothing 계수 (사전 가중치), p = 전체 타겟 평균 (prior)<br />
          "이전 샘플까지만" 참조 → target leakage를 인코딩 단계에서도 차단<br />
          기존 target encoding의 문제(타겟 누출)를 구조적으로 해결한 유일한 방법
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">실전에서의 CatBoost</h3>
        <p>
          <strong>범주형 피처가 많은 데이터</strong>에서 최고 성능 — 클릭 예측, 추천 시스템, 광고<br />
          <strong>기본 하이퍼파라미터가 좋음</strong> — 튜닝 없이도 경쟁력 있는 성능<br />
          <strong>결측값</strong>: 자동으로 최적 방향 결정 (XGBoost와 유사)<br />
          <strong>GPU 학습</strong>: Symmetric Tree의 규칙적 구조 덕분에 효율적<br />
          단점: 메모리 사용량이 높음 (ordered boosting의 순열별 모델 유지) + 순수 수치 데이터에서는 LightGBM 대비 속도 열위
        </p>
      </div>
      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm">
          <strong>실전 팁:</strong> CatBoost의 최대 강점은 cat_features 파라미터에 범주형 컬럼 인덱스를 넘기는 것.
          One-hot이나 target encoding 없이 원본 범주를 직접 입력하면 된다.
          iterations=3000 + early_stopping_rounds=100이 안전한 출발점.
        </p>
      </div>
    </section>
  );
}
