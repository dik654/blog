import ExplainedFormula from "@/components/ui/explained-formula";

export default function KLDivergence() {
  return (
    <section id="kl-divergence" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">KL divergence는 모델 때문에 추가된 비용을 분리한다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Cross-entropy에는 모델이 아무리 좋아도 없앨 수 없는 H(P)가 포함되어 있다.
          그 값을 빼면 P 대신 Q를 사용해서 생긴 순수한 초과 비용만 남는데, 이것이
          KL divergence다. Supervised learning에서 P가 고정되어 있으면 H(P)도
          parameter θ와 무관하므로 cross-entropy 최소화와 forward KL 최소화는 같은
          optimum을 갖는다.
        </p>
      </div>

      <ExplainedFormula
        question="Cross-entropy 중 실제 분포의 불확실성이 아니라 모델 mismatch 때문에 생긴 부분은 얼마인가?"
        idea={<>모델 Q의 평균 code length H(P,Q)에서 P 자체의 최저 비용 H(P)를 뺍니다. Log ratio로 정리하면 사건별로 Q가 P를 얼마나 과소·과대평가했는지 P로 평균낸 식이 됩니다.</>}
        formula={String.raw`\begin{aligned}D_{\mathrm{KL}}(P\Vert Q)&=\sum_xP(x)\log\frac{P(x)}{Q(x)}\\&=H(P,Q)-H(P)\ge 0\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}D_{\mathrm{KL}}(P\Vert Q)&=\underbrace{\sum_xP(x)\log\frac{P(x)}{Q(x)}}_{\text{기준량당 비율}}\\&=\underbrace{H(P,Q)-H(P)\ge 0}_{\text{허용 경계 판정}}\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_xP(x)\log\frac{P(x)}{Q(x)}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","모델 Q의 평균 code length H(P,Q)에서 P","자체의 최저 비용 H(P)를 뺍니다."] },
          { expression: String.raw`H(P,Q)-H(P)\ge 0`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","모델 Q의 평균 code length H(P,Q)에서 P","자체의 최저 비용 H(P)를 뺍니다."] },
        ]}
        terms={[
          { symbol: "P\\Vert Q", name: "방향", description: "P에서 sample을 뽑아 Q로 평가한다는 비대칭을 표시합니다." },
          { symbol: "P(x)/Q(x)", name: "density ratio", description: "사건 x를 Q가 실제보다 얼마나 작거나 크게 평가했는지 나타냅니다." },
          { symbol: "H(P,Q)", name: "model code cost", description: "Q로 실제 데이터를 설명할 때 필요한 평균 정보량입니다." },
          { symbol: "H(P)", name: "irreducible cost", description: "P가 원래 가진 불확실성입니다." },
        ]}
        assumptions={["P(x)>0인 모든 지점에서 Q(x)>0이어야 finite value입니다.", "Gibbs inequality에 의해 값은 0 이상이며 P=Q일 때만 0입니다."]}
        interpretation="KL은 symmetric하지 않고 triangle inequality도 만족하지 않으므로 metric distance가 아닙니다. KL(P‖Q)와 KL(Q‖P)는 support를 놓쳤을 때 서로 다른 행동을 보입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>방향을 생략하면 optimization behavior를 놓친다</h3>
        <p>
          <code>P=(0.5,0.5)</code>, <code>Q=(0.9,0.1)</code>이면
          <code>H(P)=0.693</code>, <code>H(P,Q)≈1.204</code>이므로
          <code>KL(P‖Q)≈0.511 nat</code>다. 이 계산은 cross-entropy가 source의
          불확실성까지 포함하고, KL이 Q의 mismatch 때문에 더 낸 부분만 남긴다는
          등식 <code>H(P,Q)=H(P)+KL(P‖Q)</code>을 수치로 확인한다.
        </p>
        <p>
          Forward KL은 P가 질량을 가진 영역을 Q가 빠뜨리면 큰 penalty를 주므로 여러
          mode를 덮는 방향으로 작동하는 경향이 있다. Reverse KL은 Q가 sample을 둔
          영역에서 P가 낮으면 penalty를 받기 때문에 접근 가능한 한 mode에 집중하는
          경향이 나타날 수 있다. 다만 “mode covering/mode seeking”은 분포 family와
          optimization 조건에 따른 경향이지 모든 문제에 적용되는 절대 법칙은 아니다.
        </p>
        <p>
          Jensen–Shannon divergence는 두 방향의 KL을 mixture를 기준으로 평균내고 Wasserstein distance는 확률 질량을 옮기는 최소 비용을 잰다.
          목적 함수는 이름의 익숙함보다 support overlap, estimator variance, gradient가 실제로 계산 가능한지를 보고 선택한다.
        </p>
      </div>
    </section>
  );
}
