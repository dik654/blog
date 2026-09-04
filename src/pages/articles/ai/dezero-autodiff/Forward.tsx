import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import ForwardViz from "./viz/ForwardViz";

export default function Forward({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="forward" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">순전파는 결과를 계산하면서 역추적 경로를 기록합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>Func::call()</code>은 입력 Variable에서 데이터를 읽어 <code>Function::forward()</code>를 실행하고 결과를 새 Variable로 감쌉니다. 여기까지만 하면 일반 수치 계산과 같지만, backpropagation이 켜져 있을 때는 입력과 출력, creator와 generation도 함께 기록합니다.
        </p>
        <p>
          Function trait에는 forward와 backward가 한 쌍으로 정의됩니다. Add나 Mul 같은 연산은 자신의 국소 미분만 알면 되고 여러 Function을 연결했을
          때 전체 미분을 만드는 일은 계산 그래프가 맡습니다. 새 연산을 추가할 때도 전역 그래프 로직을 바꿀 일은 없습니다.
        </p>
      </div>
      <div className="not-prose my-8"><ForwardViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>generation으로 실행 순서를 단순화합니다</h3>
        <p>
          출력의 generation을 입력 중 가장 큰 값보다 하나 크게 두면 backward에서는 generation이 큰 Function부터 처리합니다. 이 정수는 계산 그래프 전체를
          매번 위상 정렬하는 대신 쓰는 우선순위이며 분기가 있는 그래프에서도 출력에 가까운 연산부터 안정적으로 실행하게 해 줍니다.
        </p>
      </div>
    </section>
  );
}
