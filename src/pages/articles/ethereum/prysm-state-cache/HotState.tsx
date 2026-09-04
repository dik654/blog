import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

export default function HotState({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="hot-state" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Hot state는 immutable view 또는 소유권이 분리된 clone으로 반환합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>최근 root의 state를 메모리에서 찾는 것만으로는 안전한 cache가 되지 않습니다. Caller A와 B가 같은 backing slice를 받은 뒤 A가 validator balance를 바꾸면 B의 값과 cached SSZ root까지 조용히 어긋날 수 있기 때문입니다. Map을 lock했다는 사실도 return 이후 nested alias mutation은 막지 못합니다.</p>
        <div className="not-prose my-4 flex flex-wrap gap-2">
          <CodeViewButton onClick={() => onCodeRef("state-by-root", codeRefs["state-by-root"])} />
          <span className="self-center text-xs text-muted-foreground">StateByRoot() 조회 seam</span>
        </div>
        <h3>조회와 반환은 별도 단계입니다</h3>
        <ol>
          <li>Root·slot·fork/schema·generation을 정규화하고 zero/missing identity를 거절합니다.</li>
          <li>동일 generation의 root-keyed entry를 찾고 entry가 목표 identity와 맞는지 다시 확인합니다.</li>
          <li>Immutable read view 또는 controlled Copy-on-Write clone으로 caller ownership을 분리합니다.</li>
          <li>Caller mutation 뒤 원본 bytes·full SSZ root·다른 caller view가 그대로인지 negative test로 확인합니다.</li>
        </ol>
        <h3>Finality와 eviction을 한 규칙으로 합치지 않습니다</h3>
        <p>
            Finality는 consensus safety 문맥이고 LRU·memory cap은 resource policy입니다. Finalized state도 memory
            pressure로 eviction될 수 있고 non-finalized branch도 active fork-choice 계산 때문에 잠시 필요할 수 있습니다. 퇴출은
            durable state나 summary의 존재, replay budget과 함께 결정해야 합니다.
          </p>
        <p>운영 지표도 hit ratio 하나로 끝내지 않습니다. Cache generation별 hit/miss, clone bytes·시간, DB fallback, replay distance와 output-root mismatch를 나누면 “hit가 늘었는데 p95가 악화된” 원인이 large-state copy인지 lock contention인지 드러납니다.</p>
      </div>
    </section>
  );
}
