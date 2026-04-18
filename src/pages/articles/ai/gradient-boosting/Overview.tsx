import EnsembleEvolutionViz from './viz/EnsembleEvolutionViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Decision Tree → Ensemble 진화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Decision Tree</strong>(결정 트리) — 피처 공간을 if-else 규칙으로 분할하는 가장 직관적인 모델<br />
          해석은 쉽지만 단일 트리는 과적합에 취약하고 일반화 성능이 낮다<br />
          이 한계를 극복하기 위해 여러 트리를 합치는 <strong>Ensemble</strong>(앙상블) 기법이 등장
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Bagging: 분산을 줄이다</h3>
        <p>
          <strong>Random Forest</strong> — Bootstrap 샘플로 N개 독립 트리를 훈련, 예측을 평균/투표로 합산<br />
          각 트리가 서로 다른 데이터 서브셋을 보므로 개별 트리의 높은 분산이 상쇄<br />
          Var(평균) = σ²/N — 트리 수가 늘수록 분산이 줄어듦<br />
          하지만 편향(bias)은 개선하지 못함 — 각 트리가 동일한 편향을 공유
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Boosting: 편향을 줄이다</h3>
        <p>
          <strong>Gradient Boosting</strong> — 이전 모델이 틀린 부분(잔차)을 다음 모델이 학습<br />
          트리를 순차적으로 쌓으며 잔차를 줄여가는 구조 — 편향 감소가 핵심<br />
          F_m(x) = F_(m-1)(x) + η·h_m(x) — 매 라운드 오차를 보정<br />
          학습률 η로 과적합을 제어하고, 정규화로 복잡도를 관리
        </p>
      </div>
      <EnsembleEvolutionViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 GBM이 테이블형 대회를 지배하는가</h3>
        <p>
          Kaggle 테이블형 대회 상위 솔루션의 70% 이상이 GBM 계열 사용<br />
          1) <strong>피처 엔지니어링에 강건</strong> — 스케일링/정규화 불필요, 결측값 자동 처리<br />
          2) <strong>비선형 관계</strong>를 트리 분할로 자연스럽게 포착<br />
          3) <strong>학습 속도</strong> — GPU 지원 + 히스토그램 기반 분할로 대규모 데이터 처리<br />
          4) <strong>앙상블 호환</strong> — XGBoost + LightGBM + CatBoost 블렌딩이 다양성 확보의 정석
        </p>
        <p>
          딥러닝이 이미지·텍스트·음성에서 지배적이지만, 정형(tabular) 데이터에서는 여전히 GBM이 최강<br />
          TabNet, FT-Transformer 등이 도전하지만 "기본 GBM 대비 압도적 우위"를 보여주지 못하는 상황
        </p>
      </div>
      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm">
          <strong>핵심 구분:</strong> Bagging은 독립 트리의 평균으로 <strong>분산 감소</strong>,
          Boosting은 순차 트리의 잔차 학습으로 <strong>편향 감소</strong>.
          실전에서는 둘 다 사용 — Random Forest로 베이스라인, GBM으로 최적화.
        </p>
      </div>
    </section>
  );
}
