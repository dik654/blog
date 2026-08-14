import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import BackwardViz from "./viz/BackwardViz";

export default function Backward({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="backward" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">역전파에서는 순서와 gradient 누적이 정확해야 합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          출력 Variable의 gradient를 1로 초기화한 뒤 creator를 따라가면 각 Function의 <code>backward()</code>가 출력 gradient를 입력 gradient로 바꿉니다. 처리할 Function은 generation 기준으로 꺼내므로, 아직 필요한 gradient가 계산되지 않은 연산을 먼저 실행하는 일을 피할 수 있습니다.
        </p>
        <p>
          같은 Variable이 여러 연산에 쓰였다면 역전파 경로도 여러 개로 갈라졌다가 다시 합쳐집니다. 이때 새 gradient로 기존 값을 덮어쓰면 한 경로의 기여가 사라지므로 <code>prev + gx</code>로 합산해야 합니다. gradient accumulation은 부가 기능이 아니라 올바른 chain rule을 위한 필수 조건입니다.
        </p>
      </div>
      <div className="not-prose my-8"><BackwardViz onOpenCode={open} /></div>
      <ExplainedFormula
        question="같은 x가 두 갈래로 쓰였다면 x의 gradient는 왜 덮어쓰지 않고 더해야 할까요?"
        idea={<>전체 출력은 두 branch 출력의 합이므로 x를 조금 움직였을 때 각 branch가 만드는 변화량도 더해집니다. Graph에서 다시 만난 두 cotangent를 합친 뒤 앞쪽 creator로 보내야 chain rule과 같은 결과가 됩니다.</>}
        formula={String.raw`\begin{aligned}
y&=x^2+x^2,\\
\frac{\partial y}{\partial x}
&=\frac{\partial x^2}{\partial x}+\frac{\partial x^2}{\partial x}\\
&=2x+2x,\\
x=3&\Rightarrow \frac{\partial y}{\partial x}=12.
\end{aligned}`}
        terms={[
          { symbol: "x", name: "shared input", description: "두 제곱 branch가 함께 참조하는 입력 Variable입니다." },
          { symbol: "y", name: "scalar output", description: "Backward를 시작하는 하나의 출력입니다." },
          { symbol: "∂y/∂x", name: "accumulated gradient", description: "x에서 시작하는 모든 downstream 경로의 미분 기여를 합친 값입니다." },
        ]}
        assumptions={[
          "두 branch가 모두 같은 forward의 x에 의존하며 output seed gradient는 1입니다.",
          "Addition의 local backward는 upstream gradient를 두 입력으로 그대로 전달합니다.",
          "같은 Variable에 들어오는 contribution은 creator를 처리하기 전에 합산합니다.",
        ]}
        interpretation="x=3에서 branch 하나는 6을 보내므로 두 branch를 합친 gradient는 12입니다. 마지막 6만 남는 구현은 shape가 맞아도 수학적으로 틀립니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>중간 gradient의 수명도 정책으로 정합니다</h3>
        <p>
          메모리를 줄이려면 역전파가 끝난 중간 출력의 gradient를 비울 수 있지만, 사용자가 gradient를 검사하거나 고차 미분을 수행할 때는 남겨야 합니다. 따라서 <code>retain_grad</code> 같은 옵션으로 수명 정책을 분리하면 기본 학습은 가볍게 유지하면서 디버깅과 연구 기능도 지원할 수 있습니다.
        </p>
        <p>
          Release 전에는 이 예제 외에도 branch 순서를 바꾼 graph, 같은 Function이 여러 generation에 걸쳐 합쳐지는 graph, output을 둘 이상 시작점으로 둔 graph를 finite-difference gradient와 비교합니다. 값만 맞는지 보지 말고 처리 순서, 누적 횟수와 비워진 중간 gradient까지 receipt로 남겨야 재현 가능한 실패가 됩니다.
        </p>
      </div>
    </section>
  );
}
