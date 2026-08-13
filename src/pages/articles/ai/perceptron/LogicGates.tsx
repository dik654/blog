import LogicGateViz from "./viz/LogicGateViz";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function LogicGates() {
  return (
    <section id="logic-gates" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">논리 회로 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          두 입력을 받는 퍼셉트론 하나만으로도 AND, OR, NAND 같은 기본 논리
          게이트를 표현할 수 있습니다. 입력은 같아도 weight와 bias를 바꾸면
          어느 조합에서 출력이 1이 되는지가 달라지므로, 퍼셉트론이 결국 하나의
          선형 경계를 학습한다는 사실을 작은 truth table로 확인할 수 있습니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">게이트별 파라미터</h3>
        <p>
          예를 들어 <strong>AND</strong>에는 <code>w₁=0.5</code>,{" "}
          <code>w₂=0.5</code>, <code>b=−0.7</code>을 둘 수 있습니다. 두 입력이
          모두 1일 때만 합이 0을 넘습니다. bias를 <code>−0.2</code>로 바꾸면
          입력 하나만 1이어도 통과하는 <strong>OR</strong>가 되고, weight의
          부호를 뒤집어 <code>w₁=w₂=−0.5</code>, <code>b=0.7</code>로 두면 AND
          출력을 반전한 <strong>NAND</strong>가 됩니다. 값 자체는 유일한 정답이
          아니며 같은 경계를 만드는 다른 조합도 가능합니다.
        </p>
      </div>
      <div className="mt-8">
        <LogicGateViz />
      </div>
      <ExplainedFormula
        question="AND의 네 input 중 (1,1)만 positive half-space에 넣으려면 경계를 어디에 둘까?"
        idea={<>두 coordinate를 같은 비중으로 더한 뒤 threshold를 0.7에 두면 합이 1인 (1,1)만 통과하고, 합이 0.5 이하인 나머지는 통과하지 못합니다.</>}
        formula={String.raw`z_{\mathrm{AND}}=0.5x_1+0.5x_2-0.7,\qquad \hat y=H(z_{\mathrm{AND}})`}
        terms={[
          { symbol: "x_1,x_2\in\{0,1\}", name: "binary inputs", description: "truth table의 두 입력입니다." },
          { symbol: "0.5,0.5", name: "weights", description: "두 입력을 같은 방향으로 점수화합니다." },
          { symbol: "-0.7", name: "bias", description: "두 입력의 합이 충분히 클 때만 score가 positive가 되도록 경계를 옮깁니다." },
        ]}
        assumptions={["이 parameter 조합은 한 예일 뿐이며 같은 네 점을 나누는 해는 무수히 많습니다."]}
        interpretation="논리 게이트 예시는 퍼셉트론이 symbolic rule을 저장한다기보다, 네 점을 가르는 hyperplane을 parameter로 표현한다는 사실을 보여 줍니다."
      />
    </section>
  );
}
