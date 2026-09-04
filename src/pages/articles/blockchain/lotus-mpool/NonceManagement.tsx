import { codeRefs } from "./codeRefs";
import NonceViz from "./viz/NonceViz";
import type { CodeRef } from "@/components/code/types";

export default function NonceManagement({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="nonce-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Nonce는 sender-local dependency graph다
      </h2>
      <div className="not-prose mb-8">
        <NonceViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          actor message는 on-chain sender nonce부터 연속으로 실행된다. future
          nonce message를 보관할 수는 있지만 앞의 gap이 해결되기 전에는 block에
          독립적으로 넣을 수 없다. 자동 nonce 할당은 한 Lotus API process 안의
          경쟁을 줄여 주지만 여러 signer·process가 같은 address를 공유하는 분산
          lock을 대신하지 않는다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Safe submission</h3>
            <p className="text-sm text-muted-foreground">
              chain nonce와 local pending set을 함께 읽고 message
              CID·nonce·signing result를 durable하게 기록한 뒤 broadcast한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">
              Replacement &amp; reorg
            </h3>
            <p className="text-sm text-muted-foreground">
              같은 nonce 교체는 현재 pool policy를 만족해야 한다. head change 뒤에는 포함·reverted message와 funds를 다시 계산한다.
            </p>
          </div>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          replacement fee bump를 영구적인 25% protocol 상수로 복제하지 않는다.
          실제 node policy와 API 오류를 source of truth로 삼는다.
        </p>
      </div>
    </section>
  );
}
