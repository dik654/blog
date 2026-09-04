import CometBFTCoreViz from "../cometbft-core-viz";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function ReceiveRoutine({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="receive-routine" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">receive routine은 여러 producer를 한 state owner에게 직렬화한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Peer reactor, 내부 block executor, timeout ticker가 동시에 consensus state를 수정하면 vote 중복·step 역행·lock 손상이
          생깁니다. 그래서 수신 경로는 message를 직접 적용하지 않고 envelope와 source를 queue에 넣고 consensus loop가 한 번에 하나씩 처리합니다. 이
          구조는 race를 줄이지만 queue 자체가 신뢰 경계는 아닙니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="receiveRoutine()" onClick={() => onCodeRef("receive-routine", codeRefs["receive-routine"])} />
        <CodeViewButton label="handleMsg()" onClick={() => onCodeRef("handle-msg", codeRefs["handle-msg"])} />
      </div>
      <CometBFTCoreViz mode="queues" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Admission과 transition을 구분합니다</h3>
        <p>
          크기·message type·peer quota 같은 싼 검사는 queue 앞에서 resource abuse를 줄입니다. Signature·validator
          membership·H/R/S·BlockID validation은 state snapshot과 함께 수행해야 합니다. 과거 round vote는 이미 알고 있는 evidence를
          보충할 수 있지만 현재 step을 되돌려서는 안 됩니다. 미래 message는 무제한 보관하지 않고 bounded catch-up 정책을 거쳐야 합니다.
        </p>
        <h3>관측에는 queue time과 transition receipt가 둘 다 필요합니다</h3>
        <p>
          Trace에는 receive time·peer·message coordinates·validation result·queue wait·state-before/state-
          after·emitted vote와 WAL position을 연결합니다. 그래야 “vote를 받았다”와 “현재 round의 VoteSet에 반영됐다”를 구분하고 restart 뒤
          같은 event가 replay돼도 이미 수행한 side effect를 중복하지 않게 조정할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
