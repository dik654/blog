import ExplainedFormula from "@/components/ui/explained-formula";
import SoftmaxFlowViz from "./viz/SoftmaxFlowViz";

export default function Softmax() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <p className="mb-3 text-sm font-bold text-primary">용어 1 · logit과 공동 확률</p>
      <h2 className="mb-6 text-3xl font-bold">Softmax는 score들을 하나의 확률 예산 안에서 경쟁시킨다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Logit</strong>은 아직 확률이 아닌 제한 없는 class score입니다.
          <strong>Softmax</strong>는 각 score를 양수 weight로 바꾸고, 모두가 공유하는
          합계로 나눠 합이 1인 categorical distribution을 만듭니다. 한 class의
          분모에는 다른 class들도 들어가므로 서로 독립인 switch가 아닙니다.
        </p>
      </div>
      <ExplainedFormula
        question="서로 배타적인 class score 여러 개를 합이 1인 공동 확률로 바꾸려면?"
        idea={<>각 logit을 양수 weight로 바꾸고 모든 class의 weight 합으로 나눕니다. Class 하나의 확률은 다른 모든 class logit에도 의존합니다.</>}
        formula={String.raw`p_i=\frac{e^{z_i}}{\sum_j e^{z_j}}=\frac{e^{z_i-m}}{\sum_j e^{z_j-m}},\qquad m=\max_j z_j`}
        annotatedFormula={String.raw`\begin{aligned}m&=\underbrace{\max_j z_j}_{\substack{\text{overflow 기준}\text{logit 선택}}}\\[7pt]w_i&=\underbrace{e^{z_i-m}}_{\substack{\text{상대 score를}\text{양수 weight로 변환}}}\\[7pt]S&=\underbrace{\sum_j w_j}_{\substack{\text{모든 class의}\text{공동 총량}}}\\[7pt]p_i&=\underbrace{w_i/S}_{\substack{\text{총량 중 class i의}\text{몫을 계산}}}\end{aligned}`}
        operations={[
          { expression: String.raw`\max_jz_j`, annotation: ["공통으로 뺄 가장 큰 score를 골라", "지수 overflow를 피함"] },
          { expression: String.raw`e^{z_i-m}`, annotation: ["score 순서를 보존하면서", "비교 가능한 양수 weight로 변환"] },
          { expression: String.raw`\sum_je^{z_j-m}`, annotation: ["모든 후보가 공유할 총량을 만들어", "각 class의 몫을 계산"] },
        ]}
        terms={[
          { symbol: "z_i", name: "class logit", description: "확률로 정규화하기 전의 범위 제한이 없는 class score입니다." },
          { symbol: String.raw`\sum_j e^{z_j}`, name: "shared normalizer", description: "모든 class의 probability 합이 1이 되게 만듭니다." },
          { symbol: "m", name: "maximum-logit shift", description: "모든 logit에서 같은 값을 빼도 확률은 같다는 성질로 overflow를 줄입니다." },
          { symbol: "w_i", name: "positive class weight", description: "max shift 뒤 exponentiate한 class i의 양수 weight입니다." },
          { symbol: "S", name: "shared weight total", description: "모든 class weight가 공유하는 normalization 분모입니다." },
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
      <SoftmaxFlowViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3 id="temperature" className="scroll-mt-20">용어 2 · temperature</h3>
        <p>
          <strong>Temperature</strong>는 logit 차이를 softmax에 넣기 전에 확대하거나
          축소하는 양수 scale입니다. 작은 값은 차이를 키워 한 class에 몰고, 큰 값은
          차이를 줄여 probability를 평평하게 만듭니다.
        </p>
      </div>
      <ExplainedFormula
        question="같은 class 순서를 유지하면서 분포만 더 날카롭거나 평평하게 만들려면?"
        idea={<>모든 logit을 같은 양수 T로 나눈 뒤 softmax를 적용합니다. T가 작으면 차이가 확대되고, 크면 차이가 축소됩니다.</>}
        formula={String.raw`p_i(T)=\frac{e^{z_i/T}}{\sum_j e^{z_j/T}},\qquad T>0`}
        annotatedFormula={String.raw`\begin{aligned}&\underbrace{T>0}_{\substack{\text{순서를 보존하는}\text{양수 scale}}}\\[7pt]s_i&=\underbrace{z_i/T}_{\substack{\text{logit 차이를}\text{확대 또는 축소}}}\\[7pt]w_i&=\underbrace{e^{s_i}}_{\substack{\text{조절한 score를}\text{양수 weight로 변환}}}\\[7pt]S&=\underbrace{\sum_j w_j}_{\substack{\text{조절된 weight의}\text{공동 총량}}}\\[7pt]p_i(T)&=\underbrace{w_i/S}_{\substack{\text{class i의}\text{확률 몫}}}\end{aligned}`}
        operations={[
          { expression: String.raw`z_i/T`, annotation: ["작은 T는 score 차이를 확대하고", "큰 T는 차이를 축소"] },
          { expression: String.raw`e^{z_i/T}`, annotation: ["조절된 score를", "양수 비교 weight로 변환"] },
          { expression: String.raw`\sum_je^{z_j/T}`, annotation: ["모든 class의 weight 합으로 나눠", "합이 1인 분포를 만듦"] },
        ]}
        terms={[
          { symbol: "T", name: "temperature", description: "0보다 큰 공통 scale입니다." },
          { symbol: "z_i/T", name: "scaled logit", description: "class 간 상대 간격을 조절한 score입니다." },
          { symbol: "s_i", name: "scaled score", description: "temperature로 간격을 조절한 logit입니다." },
          { symbol: "w_i", name: "temperature-adjusted weight", description: "scaled score를 exponentiate한 양수 weight입니다." },
          { symbol: "S", name: "shared total", description: "모든 adjusted weight의 합입니다." },
          { symbol: "p_i(T)", name: "temperature-scaled probability", description: "조절 뒤 class i가 차지하는 공동 probability입니다." },
        ]}
        assumptions={["T는 양수입니다.", "Class들이 서로 배타적인 categorical output입니다."]}
        interpretation="Temperature는 class 순서를 바꾸지 않지만 확률의 확신 정도를 바꿉니다. 원래 logit scale이 다른 모델끼리는 같은 T도 같은 효과를 보장하지 않습니다."
      />
      <div id="output-boundary" className="prose prose-neutral dark:prose-invert max-w-none scroll-mt-20">
        <h3>용어 3 · categorical output 경계</h3>
        <p>정답이 고양이·개·새 중 하나처럼 서로 배타적일 때 softmax를 씁니다. 실내·야간처럼 여러 label이 동시에 참이면 class별 sigmoid가 맞습니다.</p>
        <p id="paper-softmax" className="scroll-mt-20">
          Output unit과 categorical likelihood의 정본 설명은
          <a href="https://www.deeplearningbook.org/contents/mlp.html" target="_blank" rel="noreferrer"> Deep Learning의 MLP 장</a>을
          따릅니다. 이 계약은 모든 classification label이 서로 배타적이라고 주장하지 않습니다.
        </p>
      </div>
    </section>
  );
}
