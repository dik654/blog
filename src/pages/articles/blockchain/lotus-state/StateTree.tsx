import { codeRefs } from "./codeRefs";
import StateTreeViz from "./viz/StateTreeViz";
import type { CodeRef } from "@/components/code/types";

export default function StateTree({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="state-tree" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Mutation layer를 flush해 새 state root를 만든다
      </h2>
      <div className="not-prose mb-8">
        <StateTreeViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          message execution 중에는 actor update를 snapshot/mutation layer에 모아
          revert 가능한 경계를 유지한다. 성공한 transition을 flush하면 변경된
          CBOR/IPLD nodes가 blockstore에 기록되고 새 top-level root CID가
          계산된다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-6">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Read</h3>
            <p className="text-sm text-muted-foreground">
              현재 mutation layer를 먼저 보고 없으면 base HAMT/IPLD store에서
              actor를 가져온다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Snapshot</h3>
            <p className="text-sm text-muted-foreground">
              nested call이나 message failure 시 되돌릴 수 있도록 change
              boundary를 만든다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Flush</h3>
            <p className="text-sm text-muted-foreground">
              dirty actor records와 child state roots를 canonical encoding으로
              저장해 새 state commitment를 만든다.
            </p>
          </div>
        </div>
        <p className="leading-7">
          structural sharing은 unchanged content가 같은 CID를 재사용한 결과이지
          고정된 “99.9%” 절감률을 보장하지 않는다. snapshot 크기·export
          시간·lookup latency도 chain height, retained graph와 blockstore
          layout에 따라 측정한다.
        </p>
      </div>
    </section>
  );
}
