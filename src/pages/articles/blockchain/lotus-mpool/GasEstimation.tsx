import { codeRefs } from "./codeRefs";
import GasDetailViz from "./viz/GasDetailViz";
import type { CodeRef } from "@/components/code/types";

export default function GasEstimation({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="gas-estimation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Gas estimate는 특정 head에서의 simulation 결과다
      </h2>
      <div className="not-prose mb-8">
        <GasDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GasLimit은 execution 비용의 상한, GasFeeCap은 지불할 단위 gas 가격의
          상한, GasPremium은 block producer에게 주는 priority fee다. estimate
          API는 현재 parent state에서 message를 simulation하고 recent fee
          conditions를 참고하지만 미래 tipset의 결과를 보장하지 않는다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-6">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Simulate</h3>
            <p className="text-sm text-muted-foreground">
              method와 params, sender state, network version에 맞춰 execution gas를 측정한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Price risk</h3>
            <p className="text-sm text-muted-foreground">
              base fee가 inclusion 전 변할 수 있으므로 fee cap과 premium
              policy에 운영 여유를 둔다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Select</h3>
            <p className="text-sm text-muted-foreground">
              producer는 nonce dependency와 gas budget을 지키며 유효한 message
              package를 선택한다.
            </p>
          </div>
        </div>
        <p className="leading-7">
          base-fee change bound와 target fill, block gas limit은 network version의 consensus parameter다.
          Ethereum과의 단순 배수 비교나 고정 수치를 본문에 복제하지 않는다. 해당 tipset의 network version과 actor bundle에서 직접 읽는다.
        </p>
      </div>
    </section>
  );
}
