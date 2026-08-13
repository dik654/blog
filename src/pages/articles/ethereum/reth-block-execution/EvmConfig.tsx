import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import EvmConfigDetailViz from "./viz/EvmConfigDetailViz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function EvmConfig({ onCodeRef }: Props) {
  return (
    <section id="evm-config" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EVM 설정과 chain 문맥</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          같은 transaction이라도 block number·timestamp·base fee와 활성
          hardfork가 다르면 실행 의미가 달라질 수 있다. Reth의 EVM 설정 계층은
          chain spec과 block 문맥을 revm 인스턴스 생성에 연결한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Block environment</h3>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 text-xs">
          <div className="rounded-lg border bg-card p-3">
            <strong>number / time</strong>
            <p className="text-muted-foreground mt-1">fork activation 문맥</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <strong>beneficiary</strong>
            <p className="text-muted-foreground mt-1">COINBASE 문맥</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <strong>base fee / gas</strong>
            <p className="text-muted-foreground mt-1">fee와 resource limit</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <strong>prevRandao / blobs</strong>
            <p className="text-muted-foreground mt-1">포크별 추가 환경</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Transaction environment
        </h3>
        <p className="leading-7">
          recovered sender, transaction kind, destination, value, calldata,
          access list와 fee fields를 현재 transaction type과 fork 규칙에 맞게
          변환한다. legacy·EIP-1559·blob transaction을 하나의 고정 수식으로
          축약하지 않는다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          System call은 일반 사용자 transaction과 다르다
        </h3>
        <p className="leading-7">
          활성 fork가 요구하는 beacon root·request 관련 system call은 sender,
          gas와 fee 처리에 특별 규칙을 가질 수 있다. executor의 pre/post 단계가
          이를 명시적으로 호출해 일반 transaction loop와 구분한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() => onCodeRef("evm-config", codeRefs["evm-config"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            EVM configuration source
          </span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          trait과 메서드 이름은 Reth API 개편에 따라 바뀔 수 있다. 이 글은
          header·fork·transaction·state provider가 EVM 생성으로 수렴하는 책임
          경계를 기준으로 읽는다.
        </p>
      </div>
      <div className="not-prose mb-6">
        <EvmConfigDetailViz />
      </div>
    </section>
  );
}
