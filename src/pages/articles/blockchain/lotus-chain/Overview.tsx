import ContextViz from "./viz/ContextViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-3">
        Chain sync는 target 발견보다 검증 경계가 중요하다
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Lotus는 peer가 광고한 무거운 tipset을 그대로 신뢰하지 않는다. tipset header와 messages를 가져와 consensus proof와 parent
        linkage, message roots를 검증한다. 그러고 나서 FVM state transition 결과가 header commitments와 맞는지 확인한다.
      </p>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Data acquisition</h3>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>hello·chain exchange에서 candidate head 식별</li>
              <li>local common ancestor까지 tipset headers를 역방향 수집</li>
              <li>각 block의 BLS·Secp messages와 metadata 확보</li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">
              Validation &amp; execution
            </h3>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>ticket·election·WinningPoSt·signature 검증</li>
              <li>tipset message ordering과 duplicate rules 적용</li>
              <li>parent state에서 FVM execution 후 state/receipt root 비교</li>
            </ol>
          </div>
        </div>

        <p className="leading-7">
          bootstrap과 snapshot import, catch-up, steady-state는 서로 다른 시작점일 뿐이다. 모두 같은 validation invariant를
          공유한다. 소요 시간과 batch 크기, disk 용량은 chain height와 hardware, pruning과 snapshot revision에 따라 변하므로 고정
          benchmark로 문서화하지 않는다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          F3가 활성화된 지금은 EC heaviest head뿐 아니라 latest F3 certificate가 가리키는 finalized prefix도 함께 추적한다. snapshot
          import가 빨라도 certificate와 tipset, state-root 검증을 생략한다는 뜻은 아니다.
        </p>
      </div>
    </section>
  );
}
