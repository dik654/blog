import type { CodeRef } from "@/components/code/types";

export default function ColdArchive({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="cold-archive" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Retention은 cache eviction이 아니라 복구 가능성을 설계하는 일이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Hot cache에서 state가 빠지는 것은 다시 DB나 replay로 얻을 수 있다는 전제가 있는 memory event입니다. 반면 persistent anchor·block·summary를 pruning하면 historical query와 recovery path 자체가 사라질 수 있습니다. 두 결정을 같은 “오래된 데이터 삭제”로 묶으면 안 됩니다.</p>
        <h3>Workload가 retention을 정합니다</h3>
      </div>
      <div className="not-prose my-5 grid gap-3 md:grid-cols-3">
        {[
          ["Validator", "head 추적·restart", "Sparse verified anchor와 checkpoint restore; bounded replay p95"],
          ["RPC", "명시한 historical range", "읽기 replica/indexer와 state/block availability SLO"],
          ["Audit", "장기 재현", "Immutable snapshot·source digest·별도 archive와 restore drill"],
        ].map(([profile, demand, design]) => (
          <div key={profile} className="min-w-0 rounded-lg border border-border bg-muted/15 p-4">
            <p className="text-xs font-bold text-primary">{profile}</p>
            <p className="mt-2 text-sm font-semibold">{demand}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{design}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>예를 들어 validator profile이 slot 101 full state를 직접 보존하지 않아도 anchor 96과 block history로 bounded replay가 가능할 수 있습니다. 하지만 audit API가 slot 101의 당시 bytes와 source receipt를 즉시 반환해야 한다면 별도 archive가 필요합니다. Finalized라는 사실은 data availability·장기 보존·application audit 요구를 대신하지 않습니다.</p>
        <h3>Release gate는 parity를 latency보다 먼저 봅니다</h3>
        <p>Base와 candidate에 같은 Prysm·spec commit, fork schedule, DB snapshot, root/slot query trace와 memory budget을 줍니다. Root/slot collision, stale generation, nested alias mutation, missing/corrupt block, 20개 empty slot, reorg와 transition 중 crash를 주입하고 full-transition oracle과 state bytes/root·typed outcome·restart result를 비교합니다.</p>
        <p>
            Partial replay는 cache나 DB에 승격하지 않고 corruption은 다른 branch나 임의 anchor로 조용히 우회하지 않습니다.
            Correctness·recovery parity가 모두 맞은 뒤 hit rate, DB bytes, transition count, memory, p50·p95를 비교하고
            regression이면 이전 binary·config·DB schema와 snapshot으로 rollback합니다.
          </p>
      </div>
    </section>
  );
}
