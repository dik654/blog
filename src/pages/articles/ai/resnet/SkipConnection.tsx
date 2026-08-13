import ExplainedFormula from "@/components/ui/explained-formula";
import ResidualPathViz from "./viz/ResidualPathViz";
import ShapeContractViz from "./viz/ShapeContractViz";

export default function SkipConnection() {
  return (
    <section id="skip-connection" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Identity shortcut은 forward와 backward에 residual branch를 우회하는 항을
        만든다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Shape가 같은 block에서는 입력 <code>x</code>를 parameter 없이 그대로
          더합니다. Forward에서는 기존 representation을 보존하는 경로가 생기고,
          backward에서는 residual branch Jacobian을 통하지 않는 identity 항이
          생깁니다. 이를 “gradient가 절대 사라지지 않는다”로 줄이면 정확하지
          않습니다. Identity 항과 residual Jacobian이 상쇄될 수 있고, 여러
          block의 product는 여전히 initialization·normalization과 activation에
          영향을 받습니다.
        </p>
      </div>

      <ResidualPathViz />

      <ExplainedFormula
        question="Residual block 한 개를 역전파할 때 입력 gradient에는 어떤 두 경로가 나타나는가?"
        idea={
          <>
            Output y=x+F(x)를 x로 미분하면 shortcut의 identity Jacobian과
            residual branch의 Jacobian이 더해집니다. Upstream gradient가 이 합을
            통과합니다.
          </>
        }
        formula={String.raw`\frac{\partial\mathcal L}{\partial x}=\frac{\partial\mathcal L}{\partial y}\left(I+J_F(x)\right)`}
        terms={[
          {
            symbol: "\\partial\\mathcal L/\\partial y",
            name: "upstream gradient",
            description:
              "뒤 layer에서 현재 block output으로 전달된 gradient입니다.",
          },
          {
            symbol: "I",
            name: "identity Jacobian",
            description:
              "Parameter 없는 shortcut x→y가 만드는 직접 미분 항입니다.",
          },
          {
            symbol: "J_F(x)",
            name: "residual Jacobian",
            description:
              "Residual branch F가 입력 변화에 얼마나 민감한지 나타내는 Jacobian입니다.",
          },
          {
            symbol: "\\partial\\mathcal L/\\partial x",
            name: "input gradient",
            description:
              "두 path의 contribution을 합쳐 앞 block으로 보내는 gradient입니다.",
          },
        ]}
        assumptions={[
          "Addition 뒤 activation이 없는 단순 form입니다. Original v1의 post-add ReLU는 추가 Jacobian을 만듭니다.",
          "Row-vector convention으로 표기했으며 구현의 tensor-Jacobian product와 같은 의미입니다.",
        ]}
        interpretation="Shortcut은 JF 하나의 연속 곱만 거치지 않는 term을 제공합니다. 하지만 I+JF의 spectral property까지 보장하지 않으므로 gradient 크기의 절대 하한으로 해석하면 안 됩니다."
      />

      <ExplainedFormula
        question="여러 identity residual block을 지나면 먼 layer의 state는 어떻게 전개되는가?"
        idea={
          <>
            각 block의 xₗ₊₁=xₗ+Fₗ(xₗ)를 연속해서 대입하면, 먼 state는 시작
            state와 중간 residual update들의 합으로 나타납니다. 이 전개는
            identity shortcut이 유지될 때 가장 직접적입니다.
          </>
        }
        formula={String.raw`x_L=x_l+\sum_{i=l}^{L-1}F_i(x_i)`}
        terms={[
          {
            symbol: "x_l,x_L",
            name: "두 block state",
            description: "l번째 block 입력과 더 먼 L번째 block의 state입니다.",
          },
          {
            symbol: "F_i(x_i)",
            name: "stage별 update",
            description:
              "i번째 residual branch가 현재 state에 더한 변화입니다.",
          },
          {
            symbol: "\\sum_{i=l}^{L-1}",
            name: "누적 residual",
            description: "두 state 사이 모든 residual update의 합입니다.",
          },
        ]}
        assumptions={[
          "Shortcut과 addition 뒤 mapping이 identity인 이상화된 pre-activation 전개입니다.",
          "Projection이나 post-add activation이 있으면 단순한 합에 해당 mapping이 추가됩니다.",
        ]}
        interpretation="먼 state가 시작 state를 직접 포함하므로 representation과 gradient에 짧은 경로가 생깁니다. 모든 layer contribution이 같은 중요도를 갖는다는 뜻은 아닙니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Element-wise addition에는 엄격한 tensor contract가 있다</h3>
        <p className="leading-8">
          Residual output과 shortcut은 batch를 제외한 spatial·channel shape가
          같아야 더할 수 있습니다. Stage transition에서는 residual branch의
          stride로 resolution을 줄이고 shortcut에도 같은 stride의 1×1
          convolution을 적용해 channel을 맞추는 projection이 흔합니다. 이
          shortcut에는 parameter가 생기므로 더 이상 순수 identity path가 아니며,
          compute와 gradient path도 달라집니다.
        </p>
      </div>

      <ShapeContractViz />
    </section>
  );
}
