import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import VariableViz from "./viz/VariableViz";

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">자동 미분은 값과 계산 이력을 함께 다루는 문제입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          신경망의 미분식을 매번 손으로 전개하지 않으려면, 순전파에서 어떤 연산이 어떤 값을 만들었는지 기록해야 합니다. 출력에서 이 기록을 거꾸로 따라가며 chain rule을 적용하는 방식이 reverse-mode automatic differentiation이며, PyTorch의 동적 계산 그래프도 같은 큰 흐름을 따릅니다.
        </p>
        <p>
          이 글은 DeZero의 교육용 설계를 Rust로 옮겨 <code>Variable</code>, <code>Function</code>, 계산 그래프와 backward를 직접 구현합니다. 완성된 프레임워크 사용법을 설명하기보다, 값·gradient·연산 순서·소유권이 왜 함께 설계되어야 하는지를 확인하는 첫 번째 글입니다.
        </p>
      </div>
      <div className="not-prose my-8"><VariableViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          먼저 순전파에서 그래프를 만드는 과정을 보고, 이어서 gradient 누적과 고차 미분을 구현합니다. 마지막에는 <code>Rc</code>·<code>RefCell</code>·<code>Weak</code>이 이 다대다 그래프를 어떻게 안전하게 표현하는지 정리합니다. 다음 글인 신경망 레이어 구현은 여기서 만든 자동 미분 엔진을 그대로 사용합니다.
        </p>
      </div>
    </section>
  );
}
