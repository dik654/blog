import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function InitialSync({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="initial-sync" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Initial sync는 parallel fetch와 sequential state transition을 분리한다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("round-robin-sync", codeRefs["round-robin-sync"])} />
        <CodeViewButton onClick={() => onCodeRef("blocks-by-range-handler", codeRefs["blocks-by-range-handler"])} />
      </div>
      <ExplainedFormula
        question="BeaconBlocksByRange 요청이 가리키는 slot들은 무엇일까요?"
        idea="Start slot에서 step만큼 이동한 count개의 위치를 요청합니다. Response는 empty slot을 생략할 수 있으므로 요청 위치 수와 block 수가 같다고 가정하지 않습니다."
        formula={String.raw`s_i=s_{start}+i\,\Delta s,\qquad 0\le i<c`}
        annotatedFormula={String.raw`s_i=\underbrace{s_{start}+i\,\Delta s,\qquad 0\le i<c}_{\text{허용 경계 판정}}`}
        operations={[
          { expression: String.raw`s_{start}+i\,\Delta s,\qquad 0\le i<c`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","Start slot에서 step만큼 이동한 count개의","위치를 요청합니다."] },
        ]}
        terms={[
          { symbol: "s_{start}", name: "시작 슬롯", description: "range 요청의 첫 slot" },
          { symbol: "\\Delta s", name: "슬롯 간격", description: "연속 동기화에서는 보통 1인 step" },
          { symbol: "c", name: "요청 개수", description: "요청하는 slot 위치의 bounded count" },
          { symbol: "s_i", name: "요청 위치", description: "i번째로 조회할 slot" },
        ]}
        assumptions={["Count·step·response size는 active networking spec의 bounds를 통과합니다.", "Server가 empty slot에 빈 placeholder를 반환할 의무가 없고 선택한 branch의 block만 보낼 수 있습니다.", "받은 slot 번호만으로 parent continuity·signature·state transition validity를 생략하지 않습니다."]}
        interpretation="start=101, step=1, count=4이면 101·102·103·104를 요청합니다. 102가 empty slot이면 valid response가 101·103·104 세 block일 수 있으며, 103의 parent와 state transition으로 gap을 확인합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Scheduler와 commit owner를 나눕니다</h3>
        <p>
          Scheduler는 peers의 finalized/head status와 inflight byte/request budget으로 disjoint range를 배정합니다. Fetch worker는
          response framing·bounds·request match를 검사해 staged buffer에 넣고, ordered processor만 current state를 mutate합니다.
          따라서 peer B의 뒤 range가 먼저 와도 앞 range가 검증되기 전 durable cursor를 건너뛰지 않습니다.
        </p>
        <p>
          Peer timeout은 해당 range lease를 만료시켜 다른 compatible peer에 재배정합니다. Retry attempt ID와 range identity를
          유지해 늦게 도착한 첫 response를 dedupe하며, invalid block은 단순 timeout보다 강한 evidence로 기록합니다. 한 peer의
          head가 높다는 이유만으로 모든 range를 몰아주지 않고 diversity와 useful-response history를 봅니다.
        </p>

        <h3>Contiguous commit invariant</h3>
        <p>
          Durable checkpoint에는 anchor, last verified block root/slot, post-state root, finalized/head context와 request manifest를
          함께 저장합니다. Crash 뒤 DB에 block bytes만 있고 state cursor가 이전이면 bytes를 재검증하거나 staged data로
          정리하며, state cursor만 앞서고 block/state evidence가 없는 상태는 허용하지 않습니다.
        </p>
      </div>
    </section>
  );
}
