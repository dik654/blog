import WinPostViz from "./viz/WinPostViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function WinningPoSt({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="winning-post" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-3">
        Election과 WinningPoSt의 time-sensitive path
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        storage power-weighted election에 당첨된 provider만 해당 epoch의 block
        candidate를 만든다. WinningPoSt는 선택된 chain base와 randomness에
        묶이므로 미리 고정 proof를 만들어 둘 수 없다.
      </p>
      <div className="not-prose mb-8">
        <WinPostViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">1. Election</h3>
            <p className="text-sm text-muted-foreground">
              base tipset의 randomness와 miner key로 election proof를 만들고
              network power 대비 WinCount를 계산한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">2. Proof</h3>
            <p className="text-sm text-muted-foreground">
              당첨된 경우 challenged sectors를 읽어 WinningPoSt를 생성한다.
              unavailable/corrupt sector와 slow I/O가 critical risk다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">3. Block</h3>
            <p className="text-sm text-muted-foreground">
              message selection, parent weight, ticket·proof를 block header에
              묶어 서명하고 network에 전파한다.
            </p>
          </div>
        </div>
        <p className="leading-7">
          경쟁력은 GPU 모델 하나로 결정되지 않는다. chain notification 지연,
          sector read tail latency, proof worker availability, message
          selection과 propagation까지 합친 end-to-end budget이 중요하다.
        </p>
      </div>
    </section>
  );
}
