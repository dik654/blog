import SelectionViz from './viz/SelectionViz';

export default function Selection() {
  return (
    <section id="selection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">피처 선택: 중요도, 상관, Boruta</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          피처 엔지니어링으로 수백 개의 파생 변수를 만들었다면, 이제 <strong>불필요한 피처를 제거</strong>해야 한다.
          피처가 많으면 과적합, 학습 시간 증가, 메모리 낭비가 동시에 발생.
          피처 선택(Feature Selection)은 "어떤 피처를 남기고 어떤 것을 버릴 것인가"를 체계적으로 결정하는 과정.
        </p>

        <h3>Permutation Importance</h3>
        <p>
          <strong>Permutation Importance(순열 중요도)</strong> — 학습된 모델에서 피처 하나를 랜덤으로 셔플하고 성능 하락폭을 측정.
          하락이 크면 중요한 피처, 하락이 없으면 불필요한 피처.
          모델에 구애받지 않는 범용적 방법. XGBoost든 신경망이든 동일하게 적용 가능.
          단점은 상관 높은 피처 쌍에서 중요도가 분산된다는 것.
        </p>

        <h3>SHAP Values</h3>
        <p>
          <strong>SHAP(SHapley Additive exPlanations)</strong> — 게임 이론의 Shapley 값을 모델 해석에 적용.
          각 피처가 개별 예측에 얼마나 기여했는지 양/음 방향으로 분해.
          전체 데이터에 대한 평균 |SHAP|이 피처 중요도 역할.
          Permutation보다 정밀하지만 계산 비용이 높다.
          XGBoost의 TreeSHAP은 빠르지만, 범용 KernelSHAP은 느리다.
        </p>
      </div>

      <div className="not-prose my-8">
        <SelectionViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Boruta 알고리즘</h3>
        <p>
          <strong>Boruta</strong> — 랜덤 포레스트 기반의 통계적 피처 선택.
          원본 피처를 셔플한 <strong>그림자 변수(shadow feature)</strong>를 만들고, 랜덤 포레스트를 학습.
          그림자 변수 중 최대 중요도보다 원본 피처의 중요도가 통계적으로 유의하게 높은지 검정.
          "이 피처가 랜덤 노이즈보다 나은가?"를 직접 테스트하는 방법.
        </p>

        <h3>상관 기반 제거</h3>
        <p>
          피처 간 상관계수(Pearson correlation)가 0.95 이상이면 거의 동일한 정보를 담고 있다.
          쌍에서 타겟과의 상관이 낮은 쪽을 제거. 다중공선성(multicollinearity)을 해소하고 학습을 안정화.
          VIF(Variance Inflation Factor) {'>'} 10인 피처도 제거 후보.
        </p>

        <h3>RFE (Recursive Feature Elimination)</h3>
        <p>
          <strong>RFE(재귀적 피처 제거)</strong> — 모델을 반복 학습하며 가장 덜 중요한 피처를 하나씩 제거.
          매 라운드마다 모델을 재학습하므로 계산 비용이 높지만, 피처 간 상호작용을 고려한 최적 부분집합을 찾는다.
          sklearn의 RFECV는 교차 검증으로 최적 피처 수를 자동 결정.
        </p>

        <h3>선택 전략 조합</h3>
        <p>
          실전에서는 단일 방법이 아닌 <strong>다중 방법 합의</strong>를 사용.
          "Permutation + SHAP + Boruta 중 2개 이상에서 중요하다고 판정된 피처만 채택"이 안전한 전략.
          상관 기반 제거를 먼저 적용해 중복을 줄인 뒤, 중요도 기반으로 최종 선택.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 피처 선택 파이프라인</p>
        <p className="text-sm">
          1단계: 상관 {'>'} 0.95 피처 쌍 제거 (빠르고 안전).
          2단계: Permutation Importance 하위 10% 제거.
          3단계: Boruta로 통계적 검정 통과 피처만 최종 채택.
          전체 파이프라인을 교차 검증 내부에서 실행해야 정보 누수를 방지할 수 있다.
        </p>
      </div>
    </section>
  );
}
