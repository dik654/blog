import ResidualLearningViz from './viz/ResidualLearningViz';

export default function Boosting() {
  return (
    <section id="boosting" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Gradient Boosting 원리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Gradient Boosting의 핵심 아이디어 — <strong>잔차(residual)를 학습</strong>하는 것<br />
          현재 모델이 못 맞추는 부분을 다음 트리가 보완하는 순차적 개선 전략
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">잔차 학습의 원리</h3>
        <p>
          초기 모델 F₀(x) = 타겟 평균 (가장 단순한 예측)<br />
          1라운드: 잔차 r₁ = y − F₀(x) 계산 → h₁(x)가 r₁을 학습 → F₁(x) = F₀(x) + η·h₁(x)<br />
          2라운드: 잔차 r₂ = y − F₁(x) 계산 → h₂(x)가 r₂을 학습 → F₂(x) = F₁(x) + η·h₂(x)<br />
          M라운드 후: F_M(x) = F₀(x) + η·Σ h_m(x) — <strong>약한 학습기의 합</strong>이 강한 모델
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">학습률(η)의 역할 — Shrinkage</h3>
        <p>
          η(learning rate) — 각 트리의 기여를 축소하는 계수 (0.01~0.3이 실전 범위)<br />
          η=1이면 잔차를 완전히 보정 → 과적합 위험 높음<br />
          η=0.1이면 잔차의 10%만 보정 → 느리지만 일반화 우수<br />
          <strong>트레이드오프:</strong> η↓ → n_estimators↑ 필요 → 학습 시간↑ 하지만 성능↑<br />
          실전 경험칙: η=0.05~0.1 + early stopping이 가장 안전한 조합
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">함수 공간의 경사하강법</h3>
        <p>
          "Gradient" Boosting이라 불리는 이유 — 함수 공간에서의 경사하강법(gradient descent)<br />
          일반 경사하강법: 파라미터 θ를 −∇L 방향으로 이동<br />
          Gradient Boosting: 함수 F(x)를 −∇L 방향으로 이동<br />
          잔차 = −∂L/∂F(x) — MSE의 경우 잔차가 정확히 음의 기울기<br />
          이 관점에서 각 트리 h_m(x)는 손실 표면의 "내리막 방향"을 근사
        </p>
      </div>
      <ResidualLearningViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">과적합 제어 3가지 축</h3>
        <p>
          1) <strong>학습률 η</strong> — 작을수록 안전하지만 트리 수 증가 필요<br />
          2) <strong>트리 깊이 (max_depth)</strong> — 얕은 트리(3~8)가 개별 트리의 과적합 방지<br />
          3) <strong>조기 종료 (early stopping)</strong> — 검증 오차가 증가하면 학습 중단<br />
          이 3축의 밸런스가 GBM 튜닝의 핵심 — 대부분의 Kaggle 솔루션이 이 셋에 집중
        </p>
      </div>
      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm">
          <strong>직관:</strong> η=0.1, max_depth=6, early_stopping_rounds=50 — 이 조합이 대부분의 테이블형 대회에서 좋은 출발점.
          여기서 η를 더 줄이고 트리를 늘리면 거의 항상 성능이 오른다.
        </p>
      </div>
    </section>
  );
}
