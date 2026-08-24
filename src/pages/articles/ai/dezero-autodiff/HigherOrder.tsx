import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import HigherOrderViz from "./viz/HigherOrderViz";

export default function HigherOrder({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="higher-order" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">고차 미분은 backward 자체를 다시 기록해서 만듭니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          일반 학습에서는 파라미터의 1차 gradient만 필요하므로 backward 중 수행한 연산까지 그래프로 남길 이유가 없습니다. 반면 2차 미분이 필요할 때는 <code>backward(create_graph=true)</code>를 사용해 gradient를 계산한 Mul, Add 같은 연산도 새 계산 그래프에 기록해야 합니다.
        </p>
        <p>
          이 설계가 가능하려면 gradient를 단순 배열이 아니라 Variable로 저장해야 합니다. 첫 번째 backward로 얻은 <code>x.grad</code>가 creator chain을 유지하므로, gradient를 초기화한 뒤 그 Variable에서 backward를 다시 호출하면 2차 미분을 얻을 수 있습니다.
        </p>
      </div>
      <div className="not-prose my-8"><HigherOrderViz onOpenCode={open} /></div>
      <ExplainedFormula
        question="x³의 2차 미분을 얻으려면 첫 backward에서 무엇을 기록해야 할까요?"
        idea={<>첫 backward의 결과 3x²를 단순 숫자로 만들면 다시 미분할 creator가 없습니다. Gradient 계산 자체를 Mul·Pow 같은 Variable 연산으로 기록하면 첫 gradient가 두 번째 backward의 출력이 됩니다.</>}
        formula={String.raw`\begin{aligned}
y&=x^3,\\
g_1=\frac{dy}{dx}&=3x^2,\\
g_2=\frac{dg_1}{dx}&=6x,\\
x=2&\Rightarrow g_1=12,\quad g_2=12.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
y&=\underbrace{x^3,}_{\text{오른쪽 항으로 결과 계산}}\\
g_1=\frac{dy}{dx}&=\underbrace{3x^2,}_{\text{기준량당 비율}}\\
g_2=\frac{dg_1}{dx}&=\underbrace{6x,}_{\text{기준량당 비율}}\\
x=2&\Rightarrow g_1=12,\quad g_2=12.
\end{aligned}`}
        operations={[
          { expression: String.raw`x^3,`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","첫 backward의 결과 3x²를 단순 숫자로 만들면 다시","미분할 creator가 없습니다."] },
          { expression: String.raw`3x^2,`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","첫 backward의 결과 3x²를 단순 숫자로 만들면 다시","미분할 creator가 없습니다."] },
          { expression: String.raw`6x,`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","첫 backward의 결과 3x²를 단순 숫자로 만들면 다시","미분할 creator가 없습니다."] },
        ]}
        terms={[
          { symbol: "g₁", name: "first derivative Variable", description: "create_graph=true인 backward가 creator chain과 함께 만든 gradient입니다." },
          { symbol: "g₂", name: "second derivative", description: "g₁에서 다시 backward해 얻은 x에 대한 gradient입니다." },
          { symbol: "create_graph", name: "recording switch", description: "Backward 내부 연산을 다음 미분을 위한 graph에 기록할지 정합니다." },
        ]}
        assumptions={[
          "x³가 x=2 근방에서 두 번 미분 가능하고 같은 x Variable identity를 사용합니다.",
          "두 번째 backward 전에 x의 기존 gradient를 비워 1차와 2차 결과를 섞지 않습니다.",
          "create_graph의 추가 graph와 saved value가 살아 있는 동안 더 많은 memory가 필요합니다.",
        ]}
        interpretation="x=2에서는 우연히 1차와 2차 값이 모두 12지만 식은 3x²와 6x로 다릅니다. 값 하나만 비교하지 말고 여러 x에서 analytic·finite-difference 결과를 확인해야 합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>필요한 구간에서만 그래프 생성을 켭니다</h3>
        <p>
          <code>create_graph=true</code>는 메모리와 계산량을 늘리므로 일반적인 1차 gradient 학습의 기본값으로 두지 않습니다. Newton method, gradient penalty, meta-learning처럼 미분값을 다시 미분해야 하는 구간에서만 켜고, 나머지 구간은 기록을 끄는 것이 안전합니다.
        </p>
      </div>
    </section>
  );
}
