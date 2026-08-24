import ExplainedFormula from "@/components/ui/explained-formula";
import InverseTableViz from "./viz/InverseTableViz";

export default function Logarithms() {
  return (
    <section id="logarithms" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">로그는 결과를 보고 필요한 지수를 되묻는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>2를 몇 번 곱해야 8이 되는지를 묻는 답은 3입니다. 이를 log₂8=3으로 씁니다. 따라서 exponential과 logarithm은 입력과 출력을 서로 되돌리는 inverse function이며, 둘 중 하나의 표를 읽을 수 있으면 다른 하나도 읽을 수 있습니다.</p>
      </div>
      <ExplainedFormula
        question="a를 몇 제곱해야 양수 x가 되는가?"
        idea={<>로그값 y를 지수 자리에 되돌려 넣었을 때 aʸ=x가 되도록 정의합니다.</>}
        formula={String.raw`y=\log_a x\quad\Longleftrightarrow\quad a^y=x`}
        annotatedFormula={String.raw`y=\underbrace{\log_a x\quad\Longleftrightarrow\quad a^y=x}_{\text{로그 비용 변환}}`}
        operations={[
          { expression: String.raw`\log_a x\quad\Longleftrightarrow\quad a^y=x`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","로그값 y를 지수 자리에 되돌려 넣었을 때 aʸ=x가 되도록","정의합니다."] },
        ]}
        terms={[
          { symbol: "x", name: "logarithm input", description: "0보다 커야 하는 원래 scale의 값입니다." },
          { symbol: "a", name: "base · 밑", description: "양수이며 1이 아닌 기준 배율입니다." },
          { symbol: "y", name: "logarithm output", description: "a를 몇 제곱해야 x가 되는지 나타내는 실수입니다." },
        ]}
        assumptions={["실수 범위에서 x>0, a>0, a≠1이어야 합니다.", "x=0에서는 log가 유한한 값을 갖지 않고, 음수에는 실수 logarithm을 적용할 수 없습니다."]}
        interpretation="log₂8=3이고 log₁₀0.01=−2입니다. 입력이 1보다 작으면 필요한 지수가 음수가 될 수 있습니다."
      />
      <InverseTableViz />
    </section>
  );
}
