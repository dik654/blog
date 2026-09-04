import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import LinearViz from "./viz/LinearViz";

export default function LinearLayer({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="linear" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Linear layer는 shape와 초기화까지 포함한 affine transform입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Linear layer의 순전파는 <code>y = xW + b</code>로 짧지만, 구현에서는 입력과 weight의 차원, 배치 축, bias broadcasting을 먼저 고정해야 합니다. 이 계약이 모호하면 forward는 우연히 동작해도 backward에서 잘못된 축으로 gradient가 합산될 수 있습니다.
        </p>
        <p>
          weight는 입력 차원에 따라 분산을 조절하는 Xavier 계열 초기화로 시작합니다. 예제 구현은 seed를 가진 LCG로 균등 난수를 만들고 Box–Muller
          transform으로 정규분포를 생성하므로 외부 RNG 없이도 결과가 재현됩니다. 다만 실제 학습 라이브러리라면 검증된 RNG와 초기화 구현을 사용하는 편이 안전합니다.
        </p>
      </div>
      <div className="not-prose my-8"><LinearViz onOpenCode={open} /></div>
      <ExplainedFormula
        question="Batch 4개, input feature 2개, output 3개인 Linear layer의 shape와 parameter 수는 어떻게 정할까요?"
        idea={<>각 sample의 길이 2 row가 2×3 weight와 곱해져 길이 3 row가 되고, 길이 3 bias가 모든 sample에 broadcast됩니다. Parameter는 weight 원소와 bias 원소를 더해 셉니다.</>}
        formula={String.raw`\begin{aligned}
X&\in\mathbb{R}^{4\times2},\quad
W\in\mathbb{R}^{2\times3},\quad b\in\mathbb{R}^{3},\\
Y&=XW+b\in\mathbb{R}^{4\times3},\\
N_{\mathrm{param}}&=2\cdot3+3=9.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
X&\in\mathbb{R}^{4\times2},\quad
W\in\mathbb{R}^{2\times3},\quad b\in\mathbb{R}^{3},\\
Y&=\underbrace{XW+b\in\mathbb{R}^{4\times3},}_{\text{batch size 계산}}\\
N_{\mathrm{param}}&=\underbrace{2\cdot3+3=9.}_{\text{input dimension 계산}}
\end{aligned}`}
        operations={[
          { expression: String.raw`XW+b\in\mathbb{R}^{4\times3},`, annotation: ["batch size이(가) 식의 결과에 기여하는 방식을","계산합니다.","각 sample의 길이 2 row가 2×3 weight와","곱해져 길이 3 row가 되고, 길이 3 bias가 모든"] },
          { expression: String.raw`2\cdot3+3=9.`, annotation: ["input dimension이(가) 식의 결과에 기여하는","방식을 계산합니다.","각 sample의 길이 2 row가 2×3 weight와","곱해져 길이 3 row가 되고, 길이 3 bias가 모든"] },
        ]}
        terms={[
          { symbol: "4", name: "batch size", description: "같은 weight를 통과하는 sample 수입니다." },
          { symbol: "2", name: "input dimension", description: "Sample 하나의 feature 수이자 W의 row 수입니다." },
          { symbol: "3", name: "output dimension", description: "Output feature 수, W의 column 수와 bias 길이입니다." },
        ]}
        assumptions={[
          "Row-major 표기는 설명 편의를 위한 것이며 library memory layout과는 별개입니다.",
          "Bias는 batch 축에만 broadcast되고 sample마다 별도 parameter가 생기지 않습니다.",
          "Parameter 수에는 optimizer state와 intermediate activation memory를 포함하지 않습니다.",
        ]}
        interpretation="Forward output은 4×3이고 trainable parameter는 9개입니다. Backward에서 dW는 2×3, db는 길이 3, dX는 4×2여야 합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>backward는 두 개의 행렬곱으로 돌아갑니다</h3>
        <p>
          출력 gradient가 <code>gy</code>일 때 입력 쪽은 <code>gyWᵀ</code>, weight 쪽은 <code>xᵀgy</code>로 계산합니다. bias gradient는 배치 축을 합산해야 합니다. 이 세 결과의 shape를 수치 gradient와 비교하면 행렬곱과 broadcasting 구현을 함께 검증할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
