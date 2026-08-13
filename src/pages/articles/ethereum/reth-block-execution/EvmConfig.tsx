import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function EvmConfig({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="evm-config" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        EvmConfig는 header·ChainSpec·transaction을 revm 입력으로 번역한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          EVM은 “mainnet block 101” 같은 이름을 직접 이해하지 않습니다.
          ChainSpec이 block number·timestamp에서 active fork를 고르고, adapter가
          header의 coinbase, gas limit, base fee, prevrandao와 blob 관련 값을
          block environment에 채웁니다. Transaction type에 맞춰 caller, nonce,
          gas, value, calldata와 access/blob authorization을 구성합니다.
        </p>
        <h3>같은 field도 fork에 따라 의미가 달라집니다</h3>
        <p>
          Pre-Merge difficulty와 post-Merge randomness, London 전후 base fee,
          Cancun 이후 blob fields처럼 presence와 해석이 activation context에
          묶입니다. Unknown future transaction이나 fork field를 가장 가까운 old
          type으로 추측하지 않고 unsupported error로 거절합니다.
        </p>
        <h3>Config receipt</h3>
        <p>
          Chain ID·genesis hash·fork schedule digest, block
          hash/number/timestamp, selected spec ID, recovered transaction type와
          revm/Reth version을 남깁니다. Environment construction 성공은 state
          access나 transaction execution 성공이 아니며 이후 executor 결과와
          연결해야 합니다.
        </p>
      </div>
      <div className="not-prose my-4">
        <CodeViewButton
          onClick={() => onCodeRef("evm-config", codeRefs["evm-config"])}
        />
      </div>
    </section>
  );
}
