import XORProblemViz from "./viz/XORProblemViz";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function Limitation() {
  return (
    <section id="limitation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">퍼셉트론의 한계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>XOR</strong>는 두 입력이 서로 다를 때만 1을 출력합니다.
          따라서 <code>(0, 0)</code>과 <code>(1, 1)</code>은 0,{" "}
          <code>(0, 1)</code>과 <code>(1, 0)</code>은 1이어야 합니다. 이 네 점을
          평면에 놓으면 하나의 직선으로 두 집합을 나눌 수 없는데, 이런 문제를
          <strong>linearly inseparable</strong>(선형 분리 불가능)이라고 합니다.
          단층 퍼셉트론이 만들 수 있는 결정 경계는 직선 하나뿐이므로 XOR을
          표현하지 못합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">
          한계가 분명해진 뒤의 연구 흐름
        </h3>
        <p>
          Minsky와 Papert의 1969년 저서 <em>Perceptrons</em>는 단층 구조가
          해결하지 못하는 문제들을 체계적으로 분석했습니다. 이 책 하나가 첫 AI
          겨울을 만들었다고 단정하는 설명은 지나치게 단순합니다. 당시에는 제한된
          계산 자원, 작은 데이터, 학습 알고리즘의 미성숙과 과도한 기대가 함께
          작용했기 때문입니다. 더 중요한 기술적 결론은 퍼셉트론 자체를 버리는
          것이 아니라, 여러 층과 비선형 activation을 결합해야 한다는 데
          있습니다.
        </p>
      </div>
      <div className="mt-8">
        <XORProblemViz />
      </div>
      <ExplainedFormula
        question="왜 XOR의 네 점은 어떤 weight와 bias로도 한 번에 분리할 수 없을까?"
        idea={<>XOR 조건을 네 개의 부등식으로 적으면, positive 두 점에서 얻은 하한과 negative 두 점에서 얻은 상한이 서로 모순됩니다.</>}
        formula={String.raw`\begin{aligned}b&\le0 &&(0,0)\mapsto0\\w_1+b&>0 &&(1,0)\mapsto1\\w_2+b&>0 &&(0,1)\mapsto1\\w_1+w_2+b&\le0 &&(1,1)\mapsto0\end{aligned}\quad\Longrightarrow\quad w_1+w_2+2b>0\ \text{and}\ w_1+w_2+2b\le b\le0`}
        terms={[
          { symbol: "w_1,w_2", name: "input weights", description: "두 coordinate가 score에 기여하는 크기입니다." },
          { symbol: "b", name: "bias", description: "네 부등식 모두가 공유하는 경계 offset입니다." },
          { symbol: "z>0", name: "positive condition", description: "XOR label 1에 필요한 half-space 조건입니다." },
        ]}
        assumptions={["고전적 step function에서 z>0만 class 1로 둡니다.", "input representation을 그대로 쓰는 단층 perceptron입니다."]}
        interpretation="앞의 두 positive 부등식을 더하면 w₁+w₂+2b>0입니다. 하지만 마지막 negative 부등식과 b≤0을 함께 쓰면 같은 값이 0 이하여야 합니다. 따라서 해가 존재하지 않습니다."
      />
    </section>
  );
}
