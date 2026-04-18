import SmoteViz from './viz/SmoteViz';

export default function Sampling() {
  return (
    <section id="sampling" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">리샘플링: Over/Under/SMOTE</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          불균형을 <strong>데이터 수준</strong>에서 해결하는 가장 직접적인 방법 — 리샘플링(Resampling)<br />
          오버샘플링: 소수 클래스를 늘려서 균형을 맞춤 (데이터 추가)<br />
          언더샘플링: 다수 클래스를 줄여서 균형을 맞춤 (데이터 제거)
        </p>
        <p>
          <strong>랜덤 오버샘플링</strong> — 소수 클래스 샘플을 무작위로 복제<br />
          구현이 가장 단순하지만, 동일한 데이터를 반복 학습하므로 과적합(overfitting) 위험이 높음<br />
          모델이 소수 클래스의 특정 패턴을 "암기"하게 되어 일반화 성능이 떨어진다
        </p>
        <p>
          <strong>SMOTE</strong>(Synthetic Minority Over-sampling Technique, 2002) — 합성 샘플 생성<br />
          소수 클래스 샘플 x_i를 하나 선택 → k-NN(보통 k=5) 중 하나를 x_nn으로 선택<br />
          두 점 사이를 랜덤 비율로 보간: x_new = x_i + t * (x_nn - x_i), t ~ Uniform(0,1)<br />
          복제가 아닌 "보간"이므로 과적합이 줄고, 소수 클래스의 결정 영역이 확장된다
        </p>
        <p>
          <strong>ADASYN</strong>(Adaptive Synthetic Sampling, 2008) — SMOTE의 적응형 변형<br />
          경계(decision boundary) 근처의 "어려운" 샘플에 더 많은 합성 샘플을 생성<br />
          쉬운 영역은 이미 분류가 잘 되므로 적게, 어려운 영역에 집중 생성 → 경계 학습 강화
        </p>
      </div>
      <SmoteViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">언더샘플링과 조합 전략</h3>
        <p>
          <strong>랜덤 언더샘플링</strong> — 다수 클래스를 무작위로 제거, 빠르지만 정보 손실이 큼<br />
          <strong>Tomek Links</strong> — 경계에서 가장 가까운 이종(異種) 쌍을 제거해 경계를 정리<br />
          <strong>NearMiss</strong> — 소수 클래스와 가까운 다수 샘플만 보존, 경계 학습에 집중
        </p>
        <p>
          실전에서 가장 많이 쓰이는 조합: <strong>SMOTE + Tomek Links = SMOTETomek</strong><br />
          SMOTE로 소수 클래스를 확대한 뒤, Tomek Links로 경계의 노이즈를 제거<br />
          imbalanced-learn 라이브러리의 SMOTETomek, SMOTEENN 파이프라인으로 간단히 적용
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">SMOTE 주의사항</p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          SMOTE는 <strong>학습 데이터에만</strong> 적용한다 — 검증/테스트 세트에 적용하면 데이터 누수(data leakage).
          교차 검증 시 각 fold 내부에서만 SMOTE를 수행해야 하며,
          imbalanced-learn의 <code>Pipeline</code>을 사용하면 자동으로 처리된다.
          고차원 데이터에서는 SMOTE의 보간이 의미 없는 영역에 샘플을 생성할 수 있어,
          차원 축소(PCA) 후 적용하거나 SMOTE 변형(Borderline-SMOTE, SVM-SMOTE)을 고려한다.
        </p>
      </div>
    </section>
  );
}
