import StateViz from "./viz/StateViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function StateComputation({ onCodeRef }: Props) {
  return (
    <section id="state-computation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        State computation은 parent state에서 message·cron을 실행해 새 root를 만든다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Tipset의 state root는 block header를 단순히 hash해서 만들지 않습니다. State manager가 parent state를 열고 canonical
          message와 implicit system message를 FVM에 적용합니다. 그 결과로 receipt와 event, 다음 state tree root가 나옵니다.
        </p>
        <p>
          Null round가 있으면 지나간 epoch의 cron processing도 state transition에
          반영해야 합니다. Cron이 사용자 message보다 언제 실행되는지는 network
          version과 execution path의 규칙이므로 단일 문장으로 순서를 고정하지
          말고 실제 <code>ApplyBlocks</code> 호출 흐름을 확인해야 합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <StateViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>결과는 state root 하나보다 넓다</h3>
        <p>
          Replay 검증에서 비교하는 것은 state root만이 아닙니다. receipt root와 gas·exit code, execution event까지 함께 봅니다. Cache
          hit가 wall time을 크게 바꿀 수 있으므로 cold replay와 warm replay를 구분하고 tipset별 message 수와 actor call 분포를 같이
          기록합니다.
        </p>
      </div>
    </section>
  );
}
