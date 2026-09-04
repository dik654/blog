import DealDetailViz from "./viz/DealDetailViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function StorageDeal({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="storage-deal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-3">Storage deal lifecycle</h2>
      <p className="text-sm text-muted-foreground mb-4">
        아래 code link는 legacy Lotus provider의 축약 흐름이다. 현재 설계에서는 Boost의 deal pipeline과 Filecoin actor message,
        sector sealing을 각각 다른 failure domain으로 추적한다.
      </p>
      <div className="not-prose mb-8">
        <DealDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">
              Off-chain preparation
            </h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>proposal signature, provider policy와 start/end 조건 검증</li>
              <li>CAR/piece transfer와 PieceCID·size 검증</li>
              <li>publish batch와 sector assignment의 독립 retry</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">
              Consensus-visible progress
            </h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>publish 또는 allocation/claim 관련 message inclusion</li>
              <li>sector precommit·provecommit으로 data commitment 활성화</li>
              <li>
                PoSt, sector termination, deal expiry에 따른 actor state 변화
              </li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          고정된 “16-state FSM”이나 일정한 가격·기간·담보·reward multiplier는 implementation과 network version에 따라 달라진다. 운영자는
          deal UUID와 publish message CID, piece CID, sector number, on-chain deal/allocation ID를 하나로 꿰어 각 단계의
          idempotency와 복구를 확인한다.
        </p>
      </div>
    </section>
  );
}
