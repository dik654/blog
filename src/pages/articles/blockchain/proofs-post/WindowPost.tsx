import { codeRefs } from "./codeRefs";
import WindowPostViz from "./viz/WindowPostViz";
import type { CodeRef } from "@/components/code/types";

export default function WindowPost({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="window-post" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        WindowPoSt는 sector를 deadline과 partition으로 나눠 증명한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          한 provider의 모든 active sector를 한 번에 증명하면 failure domain과
          proving peak가 너무 커집니다. 그래서 actor state는 sector를 deadline과
          partition으로 나누고, 각 window에 해당하는 challenge와 proof를
          제출하게 합니다.
        </p>
        <p>
          Partition은 GPU 병렬화 단위가 될 수 있지만 처리량이 GPU 수에 정확히
          비례한다는 뜻은 아닙니다. Replica read, tree cache, proof aggregation,
          message inclusion과 deadline 여유가 함께 병목이 됩니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <WindowPostViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>운영 기준은 “몇 분 걸렸다”보다 deadline slack이다</h3>
        <p>
          같은 partition fixture에서 challenge 수신부터 proof 생성, message
          publish와 on-chain inclusion까지 시간을 나누고, 종료 시점까지 남은
          slack을 기록합니다. Proving period와 deadline 수는 network parameter에
          속하므로 문서의 과거 시간표보다 현재 actor policy를 기준으로
          alerting해야 합니다.
        </p>
      </div>
    </section>
  );
}
