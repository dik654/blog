import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Historical({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="historical" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Historical provider는 target block과 가장 가까운 valid evidence에서 state를 재구성한다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("changeset-tables", codeRefs["changeset-tables"])} />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Block 900의 account A를 묻는다면 현재 값만 읽을 수 없습니다. Provider는 block 900의 canonical hash를 먼저 pin하고,
          history index로 900 이후 A가 처음 바뀐 changeset의 pre-value를 찾거나, snapshot checkpoint에서 forward replay하는 등 storage
          layout이 제공하는 경로를 선택합니다. 어느 경로든 같은 target state root에 귀속돼야 합니다.
        </p>
        <h3>Missing·pruned·corrupt를 구분합니다</h3>
        <p>
          Account가 block 900에 존재하지 않았다는 valid absence와 pruning policy 때문에 evidence가 없다는 unavailable, index가 가리킨
          segment checksum이 틀린 corruption은 전혀 다른 결과입니다. Query receipt에는 target number/hash, canonical generation,
          history coverage, chosen checkpoint/changeset과 verification outcome을 남깁니다.
        </p>
        <p>
          Reorg가 block 900을 비정본 branch로 만들면 hash-pinned query는 명시적으로 그 branch를 지원하거나 실패해야 하고,
          number-pinned query는 새 canonical hash로 새 view를 만들어야 합니다. 이미 시작한 view가 새 DB generation에서 값을 골라
          섞지 않도록 invalidate·retry합니다.
        </p>
        <h3>Provider release gate</h3>
        <p>
          Latest read 중 reorg, overlay tombstone, missing/pruned history, corrupt segment, migration generation switch, commit crash와
          concurrent account/storage query를 old/new provider에 재생합니다. Value·absence/error type·block/state root·source tier parity를
          통과한 뒤 latency·cache hit을 비교하며 binary·schema·snapshot rollback을 함께 검증합니다.
        </p>
      </div>
    </section>
  );
}
