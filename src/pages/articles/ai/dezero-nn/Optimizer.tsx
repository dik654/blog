import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import OptimizerViz from "./viz/OptimizerViz";

export default function Optimizer({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="optimizer" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Optimizer는 gradient와 파라미터별 상태를 update 규칙으로 묶습니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          가장 단순한 기준점은 SGD입니다. 현재 gradient에 학습률을 곱해 파라미터에서 뺍니다. 모델 참조를 받아 파라미터를 순회하게 만들면 새 레이어를 추가해도 optimizer
          코드는 바뀌지 않고 gradient가 없는 파라미터는 건너뜁니다.
        </p>
        <p>
          Adam은 파라미터마다 gradient의 1차 모멘트와 제곱 gradient의 2차 모멘트를 저장합니다. 두 상태가 0에서 시작해 초기값이 작게 추정되므로 bias
          correction을 적용하고 작은 분모를 막기 위해 epsilon을 더합니다. AdamW는 weight decay를 gradient 기반 update와 분리해 적용합니다.
          Adam에 L2 penalty를 단순히 더하는 방식과는 다릅니다.
        </p>
      </div>
      <div className="not-prose my-8"><OptimizerViz onOpenCode={open} /></div>
      <ExplainedFormula
        question="SGD 한 step은 parameter를 어느 방향으로 얼마나 움직일까요?"
        idea={<>Gradient가 loss가 가장 빠르게 커지는 방향을 가리키므로 그 반대 방향으로 learning rate만큼 이동합니다. 이 단순 update를 기준으로 삼으면 Adam의 state와 bias correction이 무엇을 추가하는지 분리해 볼 수 있습니다.</>}
        formula={String.raw`\begin{aligned}
\theta_{t+1}&=\theta_t-\eta g_t,\\
\theta_t=2,\ \eta=0.1,\ g_t=0.5
&\Rightarrow \theta_{t+1}=1.95.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\theta_{t+1}&=\underbrace{\theta_t-\eta g_t,}_{\text{current gradient 계산}}\\
\theta_t=2,\ \eta=0.1,\ g_t=0.5
&\Rightarrow \theta_{t+1}=1.95.
\end{aligned}`}
        operations={[
          { expression: String.raw`\theta_t-\eta g_t,`, annotation: ["current gradient이(가) 식의 결과에 기여하는","방식을 계산합니다.","Gradient가 loss가 가장 빠르게 커지는 방향을","가리키므로 그 반대 방향으로 learning rate만큼"] },
        ]}
        terms={[
          { symbol: "θ_t", name: "current parameter", description: "Update 전에 optimizer가 읽은 parameter 값입니다." },
          { symbol: "g_t", name: "current gradient", description: "현재 batch loss의 θ에 대한 미분입니다." },
          { symbol: "η", name: "learning rate", description: "Gradient 방향을 실제 parameter 이동량으로 바꾸는 양수 scale입니다." },
        ]}
        assumptions={[
          "Gradient가 현재 parameter와 같은 update step에서 계산됐습니다.",
          "이 예제는 momentum·weight decay·gradient clipping이 없는 scalar SGD입니다.",
          "한 step의 loss 감소는 새 data에서의 성능 향상을 보장하지 않습니다.",
        ]}
        interpretation="Gradient 0.5는 θ를 늘리면 loss가 증가한다는 local 신호이므로 θ는 0.05만큼 줄어 1.95가 됩니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>상태는 파라미터와 같은 순서와 shape를 유지해야 합니다</h3>
        <p>
          Adam의 <code>m</code>과 <code>v</code>를 lazy initialization하면 첫 update에서 실제 gradient shape를 보고 배열을 만들 수 있습니다. 그러나 파라미터 순회 순서가 실행마다 바뀌면 상태가 다른 weight에 적용될 수 있으므로, 안정적인 ID나 결정적인 순회를 사용해야 합니다. checkpoint에는 weight뿐 아니라 optimizer state와 step도 함께 저장해야 같은 학습을 이어갈 수 있습니다.
        </p>
      </div>
    </section>
  );
}
