import ExplainedFormula from "@/components/ui/explained-formula";
import ExpectationBalanceViz from "./viz/ExpectationBalanceViz";

export default function Expectation() {
  return (
    <section id="expectation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Expectation: 많은 반복에서 중심이 되는 probability-weighted average</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>
            Expectation은 가능한 값을 probability만큼 가중해 더한 장기 평균의 기준입니다. 다음 한 번에 반드시 나올 값을 예언하지는 않습니다. 그래서 정수만 나오는
            실험의 expectation이 1.5처럼 실제 outcome이 아닌 값일 수도 있습니다.
          </p></div>
      <ExpectationBalanceViz />
      <ExplainedFormula
        question="앞면 개수 X의 expectation은 얼마이고 어떤 의미일까요?"
        idea={<>각 가능한 값에 그 값이 나타날 probability를 곱한 뒤 더합니다. Probability mass가 놓인 수직선의 무게중심으로 볼 수 있습니다.</>}
        formula={String.raw`\mathbb E[X]=\sum_x xP(X=x)=0\cdot\frac14+1\cdot\frac12+2\cdot\frac14=1`}
        terms={[{symbol:"\\mathbb E[X]",name:"expectation",description:"Distribution 전체의 probability-weighted average입니다."},{symbol:"x",name:"possible value",description:"Random variable이 가질 수 있는 숫자입니다."},{symbol:"P(X=x)",name:"weight",description:"그 숫자가 평균에 기여하는 비율입니다."}]}
        assumptions={["표시된 합이 유한하거나 절대 수렴해 expectation이 정의되어야 합니다.","Expectation의 선형성은 변수들이 독립이 아니어도 성립합니다."]}
        interpretation="두 번 던져 나오는 앞면 수는 매번 1이 아니지만, 많은 실험의 평균은 1에 가까워집니다."
      />
      <ExplainedFormula
        question="Outcome에서 새로 계산한 값 g(X)의 expectation은 어떻게 구할까요?"
        idea={<>먼저 expectation을 낸 뒤 함수를 적용하지 않고, X의 각 가능한 값에 g를 적용한 값을 원래 probability로 가중합니다. 이를 LOTUS, 즉 random variable의 함수에 대한 expectation 계산법이라고 부릅니다.</>}
        formula={String.raw`\mathbb E[g(X)]=\sum_x g(x)P(X=x),\qquad \mathbb E[X^2]=0^2\!\cdot\frac14+1^2\!\cdot\frac12+2^2\!\cdot\frac14=\frac32`}
        terms={[
          { symbol: "g", name: "transformation", description: "Random variable 값에서 제곱·비용·보상처럼 새로 계산할 양을 만드는 함수입니다." },
          { symbol: "g(X)", name: "transformed random variable", description: "같은 outcome을 g(X(ω))라는 새 숫자로 보내는 random variable입니다." },
          { symbol: "P(X=x)", name: "original weight", description: "X가 x가 되는 outcome들의 probability이며 transformation 뒤에도 가중치로 사용합니다." },
        ]}
        assumptions={["합이 유한하거나 expectation이 정의될 만큼 수렴해야 합니다.", "g가 비선형이면 일반적으로 E[g(X)]와 g(E[X])는 같지 않습니다."]}
        interpretation="이 예에서 E[X²]=3/2이지만 (E[X])²=1입니다. 평균을 먼저 낸 뒤 제곱하면 흩어짐 정보가 사라지므로, variance 계산에서도 두 값을 구분해야 합니다."
      />
    </section>
  );
}
