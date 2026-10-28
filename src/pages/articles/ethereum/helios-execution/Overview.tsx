import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExecutionRpcTraceViz from "./viz/ExecutionRpcTraceViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        전체 state가 없는데 eth_call을 어떻게 로컬에서 실행할까요?
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          이 글에서는 이미 검증된 execution block <code>H</code>에서 contract
          <code>A</code>의 slot <code>5</code>를 읽는 <code>eth_call</code> 한
          건을 추적합니다. Helios는 원격 노드가 계산한 output을 그대로 믿지
          않습니다. 필요한 account·code·storage를 <code>H</code>의 proof로
          채우고, 같은 call을 로컬 revm에서 실행합니다.
        </p>
      </div>

      <ExecutionRpcTraceViz />
      <ContentBoundary article="helios-execution" />

      <div
        id="request-contract"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>결과 하나를 만들려면 transaction보다 더 많은 입력이 필요합니다</h3>
        <p>
          Call request <code>T</code>만 같다고 결과가 같아지지는 않습니다. Helios
          0.11.1은 먼저 요청의 block tag를 실제 header hash <code>H</code>로
          고정합니다.
        </p>
        <p>
          이어서 header의 number·timestamp·beneficiary·base fee·randomness,
          chain의 fork schedule, state override를 하나의 실행 입력으로 묶습니다.
          Timestamp가 바뀌어 active fork가 달라지거나 state root가 달라지면 같은
          <code>T</code>도 다른 결과를 낼 수 있습니다.
        </p>
        <p>
          따라서 이 글에서 output <code>0x…07</code>은 “현재 contract의 영원한
          값”이 아닙니다. 정확한 뜻은 “블록 <code>H</code>의 환경과 proof-backed
          state, fork <code>f</code>, call <code>T</code>, override <code>O</code>를
          사용한 로컬 simulation 결과”입니다. Mempool 수락·transaction 포함과
          finality는 이 결과에 들어 있지 않습니다.
        </p>
      </div>

      <div id="paper-execution-api-rpc" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum execution-apis — pinned JSON-RPC specification"
          href="https://github.com/ethereum/execution-apis/tree/742d45db810b31265c8d3c075af324953330d1ed"
          citeKey={1}
        >
          <p>
            <strong>확인한 범위:</strong> JSON-RPC의 method·parameter·result·error
            형태입니다. 이 schema가 provider의 계산 정직성, proof 검증이나
            transaction 포함을 보장하는 것은 아닙니다.
          </p>
        </CitationBlock>
      </div>

      <div id="paper-eels-local-execution" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum execution-specs — pinned snapshot"
          href="https://github.com/ethereum/execution-specs/tree/56e8617b619c0ab22284b140b49cc5501e5e6227"
          citeKey={2}
        >
          <p>
            <strong>확인한 범위:</strong> 고정한 fork·block environment·pre-state와
            transaction에서 결정되는 EVM transition입니다. Helios의 proof
            fetch·cache·replay 구현은 이 규격이 아니라 아래의 고정 소스에서
            확인합니다.
          </p>
        </CitationBlock>
      </div>

      <div id="paper-helios-execution-source" className="scroll-mt-24">
        <CitationBlock
          source="a16z/helios 0.11.1 · commit 204c998a — EVM and ProofDB"
          href="https://github.com/a16z/helios/tree/204c998a927348e1c000a664f08d5b37b1b0d924"
          citeKey={3}
          type="code"
        >
          <p>
            <strong>확인한 범위:</strong> block-hash pinning, ProofDB의
            StateMissing access, 비동기 proof 보충, 같은 입력 replay와
            <code>gas_used</code> 반환입니다. 이 release의 동작을 moving main이나
            다른 provider 구성의 성능으로 확대하지 않습니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
