import SectorDetailViz from "./viz/SectorDetailViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function SectorLifecycle({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="sector-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-3">
        Sector lifecycle은 고정 8단계가 아니다
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        핵심 protocol milestone은 data commitment 준비, precommit, chain
        randomness 대기, provecommit, proving이다. 실제 scheduler는
        batching·upgrade·retry·fault·termination 상태를 더 가지므로 UI의 단계
        수를 consensus 규칙으로 읽으면 안 된다.
      </p>
      <div className="not-prose mb-8">
        <SectorDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Before activation</h3>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>pieces를 sector layout에 배치하고 commitments 계산</li>
              <li>replica encoding과 tree data 생성</li>
              <li>precommit message가 chain에 포함됐는지 확인</li>
              <li>chain randomness 뒤 provecommit proof 제출·검증</li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">After activation</h3>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>proving deadline별 partition과 challenge 준비</li>
              <li>WindowPoSt 생성·message inclusion 추적</li>
              <li>fault·recovery·sector upgrade를 actor state와 동기화</li>
              <li>expiration 또는 termination 뒤 local data 정리</li>
            </ol>
          </div>
        </div>
        <p className="leading-7">
          PC1·PC2·C1·C2의 시간과 device 배치는 hardware, proof parameter, cache
          상태와 software version에 크게 의존한다. “PC1은 항상 몇 시간”, “PC2는
          GPU면 몇 분” 대신 task별 benchmark와 deadline slack을 기록한다.
        </p>
      </div>
    </section>
  );
}
