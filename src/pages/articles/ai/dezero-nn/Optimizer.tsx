import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import OptimizerViz from "./viz/OptimizerViz";

export default function Optimizer({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="optimizer" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Optimizer는 gradient와 파라미터별 상태를 update 규칙으로 묶습니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SGD는 현재 gradient에 학습률을 곱해 파라미터에서 빼는 가장 단순한 기준점입니다. 모델 참조를 받아 파라미터를 순회하게 만들면 새 레이어를 추가해도 optimizer 코드는 바뀌지 않으며, gradient가 없는 파라미터는 건너뛸 수 있습니다.
        </p>
        <p>
          Adam은 파라미터마다 gradient의 1차 모멘트와 제곱 gradient의 2차 모멘트를 저장합니다. 두 상태가 0에서 시작해 초기값이 작게 추정되므로 bias correction을 적용하고, 작은 분모를 막기 위해 epsilon을 더합니다. AdamW는 weight decay를 gradient 기반 update와 분리해 적용한다는 점도 Adam에 L2 penalty를 단순히 더하는 방식과 구분해야 합니다.
        </p>
      </div>
      <div className="not-prose my-8"><OptimizerViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>상태는 파라미터와 같은 순서와 shape를 유지해야 합니다</h3>
        <p>
          Adam의 <code>m</code>과 <code>v</code>를 lazy initialization하면 첫 update에서 실제 gradient shape를 보고 배열을 만들 수 있습니다. 그러나 파라미터 순회 순서가 실행마다 바뀌면 상태가 다른 weight에 적용될 수 있으므로, 안정적인 ID나 결정적인 순회를 사용해야 합니다. checkpoint에는 weight뿐 아니라 optimizer state와 step도 함께 저장해야 같은 학습을 이어갈 수 있습니다.
        </p>
      </div>
    </section>
  );
}
