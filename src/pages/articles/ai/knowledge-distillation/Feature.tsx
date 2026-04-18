import FeatureViz from './viz/FeatureViz';

export default function Feature() {
  return (
    <section id="feature" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Feature Distillation: 중간 표현 전달</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Feature Distillation</strong> — Teacher의 중간 레이어(hidden layer) 활성화를 Student에 전달하는 기법.<br />
          Logit distillation이 최종 출력만 전달하는 반면, feature distillation은 <strong>계층적 특징 표현</strong>까지 전달.
        </p>

        <h3>FitNets: Hint Layer Matching</h3>
        <p>
          Romero et al.(2015)이 제안한 최초의 feature distillation 방법.<br />
          Teacher의 특정 중간 레이어(<strong>hint layer</strong>)를 선택하고,
          Student의 대응 레이어(<strong>guided layer</strong>)가 이를 모방하도록 학습.
        </p>
        <p>
          손실 함수: <code>L_hint = ∥ W_r · F_S - F_T ∥²</code><br />
          <strong>W_r</strong>: Teacher와 Student의 feature 차원이 다를 때 맞춰주는 변환 행렬(regressor).<br />
          <strong>F_T</strong>: Teacher의 hint layer 출력, <strong>F_S</strong>: Student의 guided layer 출력.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed">
            <strong>FitNets의 한계</strong>: Teacher-Student 차원이 다르면 W_r을 학습해야 하는데,
            이 변환 행렬 자체가 정보 손실을 유발할 수 있다.
            또한 어떤 레이어를 hint로 선택할지가 하이퍼파라미터로 추가됨.
          </p>
        </div>

        <h3>Attention Transfer</h3>
        <p>
          Zagoruyko & Komodakis(2017): feature map 대신 <strong>attention map</strong>을 전달.<br />
          Attention map은 feature map의 채널 축을 합산(또는 L2 norm)하여 공간적 중요도만 추출한 것.<br />
          <code>A(F) = Σ_c |F_c|² </code> — 채널 c에 대한 절대값 제곱의 합.
        </p>
        <p>
          장점: Teacher와 Student의 채널 수가 달라도 공간 해상도만 맞으면 적용 가능.<br />
          차원 맞춤 행렬(W_r)이 불필요하므로 FitNets보다 단순하고 안정적.
        </p>

        <h3>PKT: Probabilistic Knowledge Transfer</h3>
        <p>
          Passalis & Tefas(2018): feature 공간의 <strong>확률 분포</strong>를 전달.<br />
          Teacher/Student의 feature 벡터들을 확률 분포로 변환한 뒤, KL divergence로 분포 차이를 최소화.<br />
          개별 feature 값이 아닌 <strong>구조적 관계(유사도 패턴)</strong>를 보존하므로 전이 효율이 높다.
        </p>

        <h3>Feature Distillation의 장단점</h3>
        <p>
          <strong>장점</strong>: Logit보다 풍부한 정보 전달 — 초기 레이어의 저수준 특징부터 후기 레이어의 의미 표현까지.<br />
          <strong>단점</strong>: hint layer 선택, 차원 맞춤 등 추가 설계가 필요. 레이어 매핑이 잘못되면 오히려 성능 저하.
        </p>

        <h3>실전 조합 전략</h3>
        <p>
          최적 성능을 위해 Logit + Feature distillation을 동시에 적용하는 것이 일반적.<br />
          <code>L = α·L_hard + β·L_soft + γ·L_feature</code><br />
          α, β, γ의 비율은 Task와 모델에 따라 조정 — grid search 또는 loss balancing 기법 사용.
        </p>
      </div>

      <div className="not-prose mt-8">
        <FeatureViz />
      </div>
    </section>
  );
}
