import M from "@/components/ui/math";
import ExplainedFormula from "@/components/ui/explained-formula";
import SoftmaxViz from "./viz/SoftmaxViz";
import TemperatureViz from "./viz/TemperatureViz";

export default function Softmax() {
  return (
    <section id="softmax" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Softmax: class logits을 공동 확률로 정규화하기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          softmax는 각 logit의 지수를 전체 합으로 나눠 합이 1인 categorical
          distribution을 만든다. 입력 순서는 보존하지만 scale에는 불변이 아니며, logits의
          차이가 커질수록 한 class에 더 날카롭게 모인다.
        </p>
      </div>
      <ExplainedFormula
        question="서로 배타적인 class score 여러 개를 합이 1인 공동 확률로 바꾸려면?"
        idea={<>각 logit을 양수 weight로 바꾸고 모든 class의 weight 합으로 나눕니다. Class 하나의 확률은 다른 모든 class logit에도 의존합니다.</>}
        formula={String.raw`p_i=\frac{e^{z_i}}{\sum_j e^{z_j}}=\frac{e^{z_i-m}}{\sum_j e^{z_j-m}},\qquad m=\max_j z_j`}
        terms={[
          { symbol: "z_i", name: "class logit", description: "확률로 정규화하기 전의 범위 제한이 없는 class score입니다." },
          { symbol: String.raw`\sum_j e^{z_j}`, name: "shared normalizer", description: "모든 class의 probability 합이 1이 되게 만듭니다." },
          { symbol: "m", name: "maximum-logit shift", description: "모든 logit에서 같은 값을 빼도 확률은 같다는 성질로 overflow를 줄입니다." },
        ]}
        assumptions={["Class들이 서로 배타적인 categorical output 계약입니다.", "Multi-label처럼 class가 독립이면 class별 sigmoid가 맞습니다."]}
        interpretation="Logit에 같은 상수를 더하거나 빼도 probability는 변하지 않지만, logit 차이를 scale하면 분포의 날카로움은 달라집니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          수치적으로는 가장 큰 logit을 먼저 빼도 결과가 같다는 translation invariance를
          사용한다. training에서는 log-softmax와 negative log-likelihood를 fused한
          cross-entropy 구현에 raw logits를 전달하는 편이 안전하다.
        </p>
      </div>
      <SoftmaxViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3>Temperature는 분포의 상대적 날카로움을 바꾼다</h3>
        <p>
          <M>{"\\operatorname{softmax}(z/T)"}</M>에서 작은 <M>{"T"}</M>는 차이를
          키우고 큰 <M>{"T"}</M>는 분포를 평평하게 만든다. calibration과 distillation,
          sampling에서 쓰이지만 같은 temperature라도 logit scale이 다르면 효과가 다르다.
        </p>
      </div>
      <TemperatureViz />
    </section>
  );
}
