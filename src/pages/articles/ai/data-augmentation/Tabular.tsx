import TabularViz from './viz/TabularViz';

export default function Tabular() {
  return (
    <section id="tabular" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">테이블형 증강: SMOTE, 노이즈 주입</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이미지와 달리 테이블 데이터는 <strong>피처 간 관계와 의미가 복잡</strong>하다<br />
          "키 170cm, 몸무게 70kg"을 회전하거나 뒤집을 수 없다 — 기하학적 증강은 무의미<br />
          테이블 증강의 핵심은 <strong>피처 간 통계적 관계를 보존</strong>하면서 새 샘플을 만드는 것
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">SMOTE</h3>
        <p>
          <strong>SMOTE</strong>(Synthetic Minority Over-sampling Technique) — 불균형 데이터 해결의 기본 도구<br />
          소수 클래스 샘플 x와 k-최근접 이웃(k-NN) x̂ 사이를 선형 보간하여 합성 샘플 생성<br />
          x_new = x + rand(0,1) × (x̂ - x) — 두 점 "사이"에 새 점을 놓는다<br />
          단점: 노이즈 영역에도 합성하여 결정 경계를 흐리게 할 수 있다
        </p>
        <p>
          <strong>Borderline-SMOTE</strong> — 결정 경계 근처의 샘플만 선택적으로 증강<br />
          <strong>ADASYN</strong> — 학습이 어려운(밀도가 낮은) 영역에 더 많은 합성 샘플 배치<br />
          기본 SMOTE로 시작하고, 효과가 부족하면 Borderline → ADASYN 순으로 시도
        </p>
      </div>

      <div className="not-prose my-8">
        <TabularViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">가우시안 노이즈 주입</h3>
        <p>
          연속형 피처에 미세한 가우시안 노이즈를 추가: x_aug = x + ε, ε ~ N(0, σ²)<br />
          σ는 해당 피처 표준편차의 1~5% — 너무 크면 원본 패턴이 파괴된다<br />
          범주형 피처에는 적용 불가 — "남성"에 0.02를 더해도 의미가 없다<br />
          정규화/스케일링 이후에 적용해야 모든 피처의 노이즈 비율이 균일
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Feature-wise Shuffling</h3>
        <p>
          특정 피처 열의 값을 행 단위로 무작위 셔플 — 해당 피처와 타겟의 관계를 끊는다<br />
          모델이 나머지 피처만으로 예측하도록 강제 → Dropout의 테이블 버전<br />
          앙상블에서 서로 다른 피처를 셔플한 모델들을 조합하면 다양성이 극대화
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: SMOTE 적용 시 주의점</p>
        <p className="text-sm">
          SMOTE는 반드시 학습 데이터(Train fold)에만 적용 — 검증/테스트 데이터에 적용하면 정보 누출<br />
          교차 검증 시 각 fold 내부에서 독립적으로 SMOTE를 수행해야 한다<br />
          GBM(XGBoost/LightGBM)은 sample_weight로 클래스 가중치를 줄 수 있어 SMOTE 없이도 효과적
        </p>
      </div>
    </section>
  );
}
