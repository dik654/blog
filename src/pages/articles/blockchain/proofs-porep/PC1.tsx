import { codeRefs } from "./codeRefs";
import PC1DetailViz from "./viz/PC1DetailViz";
import type { CodeRef } from "@/components/code/types";

export default function PC1({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="pc1" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PC1은 replica identity에 묶인 SDR label을 순서대로 만든다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PC1의 입력은 원본 데이터 commitment만이 아닙니다. Provider identity,
          sector number, ticket과 <code>CommD</code>에서 만든
          <code> replica_id</code>가 label 계산에 들어가므로 같은 원본이라도
          sector와 sealing context가 달라지면 replica 결과가 달라집니다.
        </p>
        <p>
          각 node의 label은 DRG와 expander graph가 선택한 parent label에 의존합니다. 그래서 계산 순서와 cache locality가 성능의 핵심이며
          thread 수만 늘린다고 선형으로 빨라지지 않습니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <PC1DetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>측정은 layer별 critical path를 기준으로 한다</h3>
        <p>
          PC1을 profile할 때는 전체 시간 하나보다 parent read, label hash,
          cache miss와 layer write를 나눠 봅니다. Layer 수, node 수와 memory
          footprint는 proof parameter에 종속되므로 32&nbsp;GiB sector의 과거
          숫자를 모든 설정에 일반화하면 안 됩니다.
        </p>
      </div>
    </section>
  );
}
