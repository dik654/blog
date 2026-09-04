import ExplainedFormula from "@/components/ui/explained-formula";
import StepFunctionViz from "./viz/StepFunctionViz";

export default function StepFunction() {
  return (
    <section id="step-function" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">계단 함수: 결정을 만들지만 gradient는 만들지 못한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          초기 인공 뉴런과 perceptron은 입력의 가중합이 threshold를 넘는지에 따라 0과 1을 출력했다. 이 step function은 이진 결정을 표현하기에는 직관적이지만
          현재의 backpropagation으로 여러 층을 학습하기에는 맞지 않는다.
        </p>
      </div>
      <ExplainedFormula
        question="연속적인 score를 0 또는 1의 결정으로 바꾸려면 어디에서 잘라야 할까요?"
        idea={<>Threshold 0을 기준으로 음수와 양수 구간의 출력을 각각 고정합니다. 결정을 만들기에는 명확하지만, 구간 안에서 입력이 조금 움직여도 출력은 변하지 않습니다.</>}
        formula={String.raw`f(x)=\begin{cases}1,&x\ge 0\\0,&x<0\end{cases},\qquad f'(x)=0\quad(x\ne0)`}
        terms={[
          { symbol: "x", name: "linear score", description: "Weight와 input의 합성 결과로 threshold와 비교할 값입니다." },
          { symbol: "0,1", name: "hard output", description: "확률이 아니라 threshold 양쪽의 이산 class 결정입니다." },
          { symbol: String.raw`f'(x)=0`, name: "flat local derivative", description: "0이 아닌 모든 점에서 작은 입력 변화가 출력 변화를 만들지 않습니다." },
        ]}
        assumptions={["x=0에서는 함수가 불연속이므로 표준 derivative가 없습니다.", "Hard decision이 필요한 forward와 gradient가 필요한 training 경로는 같은 요구가 아닙니다."]}
        interpretation="0 밖에서는 local derivative가 전부 0이고, 0에서는 derivative가 없으므로 여러 층의 chain rule에 유용한 학습 신호를 제공하지 못합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          gradient descent는 출력의 작은 변화를 보고 앞선 weight를 조정해야 하는데, 이 평평한 구간은 학습 신호를 전달하지 못합니다. 그래서 현대 hidden
          layer는 sigmoid, tanh, ReLU처럼 backward 경로를 설계할 수 있는 함수를 사용하게 됐습니다.
        </p>
        <p>
          그렇다고 threshold 연산 자체가 사라진 것은 아니다. binary neural network나
          spiking neural network에서는 forward에 이산 결정을 쓰고 backward에는
          surrogate gradient를 사용하는 식으로 학습 경로를 따로 설계한다.
        </p>
      </div>
      <div className="not-prose my-8">
        <StepFunctionViz />
      </div>
    </section>
  );
}
