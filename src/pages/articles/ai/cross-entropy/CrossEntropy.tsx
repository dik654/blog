import ExplainedFormula from "@/components/ui/explained-formula";
import DistributionPenaltyViz from "./viz/DistributionPenaltyViz";

export default function CrossEntropy({ title }: { title?: string }) {
  return (
    <section id="cross-entropy" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title ?? "Cross-entropy는 모델 Q로 실제 데이터 P를 설명하는 비용이다"}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Entropy에서는 실제 확률 P를 log 안에도 넣었다. 하지만 학습할 때 알고 싶은
          것은 모델 Q가 실제 사건에 어느 정도의 확률을 주었는지이므로 log 안의 분포를
          Q로 바꾼다. 평균은 여전히 실제 데이터가 나오는 P로 계산한다. 이 미묘한
          비대칭 때문에 Q가 실제로 자주 나오는 사건을 놓치면 큰 penalty가 생긴다.
        </p>
      </div>

      <ExplainedFormula
        question="실제 데이터는 P에서 나오지만 모델 Q가 만든 확률로 encode하면 평균 비용이 얼마인가?"
        idea={<>실제 사건의 빈도 P(x)는 가중치로 두고, 각 사건에 모델이 부여한 확률 Q(x)를 −log로 변환합니다. One-hot classification에서는 정답 class 하나의 항만 남습니다.</>}
        formula={String.raw`\begin{aligned}H(P,Q)&=\mathbb E_{x\sim P}[-\log Q(x)]\\&=-\sum_xP(x)\log Q(x)\\[3pt]\ell_{\rm CE}(z,y)&=-\log\operatorname{softmax}(z)_y\end{aligned}`}
        terms={[
          { symbol: "P", name: "target distribution", description: "실제 data distribution 또는 sample의 label distribution입니다." },
          { symbol: "Q", name: "model distribution", description: "Parameter θ와 input x가 만드는 예측 분포입니다." },
          { symbol: "z", name: "logits", description: "softmax 정규화 이전의 class별 score입니다." },
          { symbol: "y", name: "target class", description: "one-hot label에서 값이 1인 정답 class index입니다." },
        ]}
        assumptions={["Categorical classification에서 label은 one-hot 또는 probability distribution입니다.", "Q가 P의 support에 양의 확률을 주어야 finite loss를 얻습니다."]}
        interpretation="정답 확률이 0.9이면 loss는 약 0.105 nat이지만 0.01이면 약 4.605 nat이다. 확신에 찬 오답에 훨씬 큰 correction을 보내는 구조입니다."
      />

      <DistributionPenaltyViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Cross-entropy 최소화와 maximum likelihood</h3>
        <p>
          Dataset sample이 조건부 독립이라고 두면 전체 categorical likelihood는
          각 정답 확률의 곱이 된다. Log를 취하면 합으로 바뀌므로 평균
          cross-entropy 최소화는 conditional log-likelihood 최대화와 같은
          parameter를 고른다. 즉 이 loss는 단순한 거리 함수가 아니라 모델이 선언한
          확률 분포의 negative log-likelihood(NLL)다.
        </p>
        <p>
          두 sample의 정답 확률이 <code>0.8</code>과 <code>0.5</code>라면 joint
          likelihood는 <code>0.8·0.5=0.4</code>다. Negative log를 취하면
          <code>−ln 0.4=−ln 0.8−ln 0.5≈0.916</code>이고, sample 평균은
          <code>0.458 nat</code>다. Log는 순서를 보존하고 negative sign만 최대화를
          최소화로 뒤집으므로, model family와 sample factorization이 같다면 두
          objective가 같은 parameter optimum을 고른다.
        </p>
        <p>
          이 동치는 모델 family와 sampling 가정을 전제로 한다. Label noise,
          class imbalance, distribution shift가 있으면 unweighted cross-entropy의
          optimum이 제품 metric의 optimum과 다를 수 있으므로 weighting, calibration,
          threshold selection을 별도의 평가 문제로 다뤄야 한다.
        </p>
      </div>
    </section>
  );
}
