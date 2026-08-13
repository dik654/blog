import type { CodeRef } from "@/components/code/types";
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
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>필요한 구간에서만 그래프 생성을 켭니다</h3>
        <p>
          <code>create_graph=true</code>는 메모리와 계산량을 늘리므로 일반적인 1차 gradient 학습의 기본값으로 두지 않습니다. Newton method, gradient penalty, meta-learning처럼 미분값을 다시 미분해야 하는 구간에서만 켜고, 나머지 구간은 기록을 끄는 것이 안전합니다.
        </p>
      </div>
    </section>
  );
}
