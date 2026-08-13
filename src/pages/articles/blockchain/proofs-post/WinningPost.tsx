import { codeRefs } from "./codeRefs";
import WinningPostViz from "./viz/WinningPostViz";
import type { CodeRef } from "@/components/code/types";

export default function WinningPost({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="winning-post" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        WinningPoSt는 election winner의 block production 경로에 들어간다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Provider는 chain randomness와 자신의 power로 election proof를
          계산합니다. Win count가 생기면 protocol이 선택한 sector challenge에
          답하는 WinningPoSt를 만들고, election proof와 함께 block header에
          포함합니다.
        </p>
        <p>
          이 과정의 공정성을 “storage가 많으면 무조건 당선”으로 설명하면
          안 됩니다. Quality-adjusted power는 확률을 바꾸고, 실제 당선 여부는
          epoch별 randomness와 proof 검증 결과로 결정됩니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <WinningPostViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Latency budget은 현재 block-production trace에서 구한다</h3>
        <p>
          WinningPoSt는 election 확인, replica access, proof generation,
          block assembly와 propagation이 공유하는 critical path에 있습니다.
          특정 GPU의 과거 초 단위 숫자보다 p50·p95 proof time, cache hit,
          missed opportunity와 publish latency를 같은 node에서 측정해야 합니다.
        </p>
      </div>
    </section>
  );
}
