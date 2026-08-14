import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import HeliosTrustFlowViz from "../helios-trust-flow-viz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Helios는 원격 state를 증명으로 채운 뒤 EVM을 로컬에서 실행한다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          일반 RPC의 <code>eth_call</code> 결과는 provider가 실행한 문자열
          하나이므로, caller가 그 계산 경로를 확인하기 어렵습니다. Helios는 먼저
          verified execution block hash H를 고정하고, contract가 실제로 읽는
          account·code·storage를 proof-backed database에 채운 뒤 같은
          transaction과 fork environment를 revm에서 로컬 실행합니다.
        </p>
        <p>
          예를 들어 block H에서 contract 0xa의 slot 5를 읽는 call이라면, 결과가
          신뢰되는 범위는 “H의 state root와 H의 block environment에서 이 call을
          실행한 결과”입니다. 이후 head의 값, 실제 transaction inclusion,
          mempool acceptance나 future gas price까지 보장하지는 않습니다.
          읽기·simulation·broadcast를 같은 “trustless RPC”로 묶지 않는 것이 이
          글의 출발점입니다.
        </p>
      </div>

      <ContentBoundary article="helios-execution" />
      <HeliosTrustFlowViz mode="execution" />

      <div id="paper-execution-api-rpc" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum execution-apis — pinned JSON-RPC specification"
          href="https://github.com/ethereum/execution-apis/tree/742d45db810b31265c8d3c075af324953330d1ed"
          citeKey={1}
        >
          <p>
            <strong>문제:</strong> wallet·tooling이 서로 다른 execution client를
            같은 method와 type으로 호출해야 합니다. <strong>기여:</strong>
            JSON-RPC parameter·result·error contract를 제공합니다.{" "}
            <strong>전제:</strong> method version과 block identifier semantics를
            고정합니다. <strong>근거 범위:</strong> RPC interface입니다.{" "}
            <strong>과장하면 안 되는 결론:</strong> 표준 response schema는
            provider honesty, proof verification이나 transaction inclusion을
            자동 보장하지 않습니다.
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
            <strong>문제:</strong> 같은 pre-state·transaction·fork에서 모든
            client가 같은 transition result를 내야 합니다.{" "}
            <strong>기여:</strong> fork-aware execution rule과 test fixture
            기반을 제공합니다. <strong>전제:</strong> 정확한 block environment,
            fork와 state를 사용합니다. <strong>근거 범위:</strong> protocol
            execution semantics입니다. <strong>과장하면 안 되는 결론:</strong>
            Helios의 async proof fetching·cache·RPC trust policy는 이 spec이
            정하지 않습니다.
          </p>
        </CitationBlock>
      </div>

      <div id="paper-helios-execution-source" className="scroll-mt-24">
        <CitationBlock
          source="Helios 0.11.1 — EVM and ProofDB source"
          href="https://github.com/a16z/helios/tree/0.11.1/revm-utils/src"
          citeKey={3}
          type="code"
        >
          <p>
            <strong>문제:</strong> synchronous EVM state reads와 asynchronous
            remote proof fetch를 연결해야 합니다. <strong>기여:</strong>
            ProofDB miss signal, prefetch, block-hash pinning과 replay 구조를
            보여 줍니다. <strong>전제:</strong> Helios 0.11.1, revm·Alloy
            dependency, chain fork schedule을 함께 고정합니다.{" "}
            <strong>근거 범위:</strong>
            선택 release의 구현입니다. <strong>
              과장하면 안 되는 결론:
            </strong>{" "}
            moving main의 API·iteration 수·latency나 모든 method가
            proof-backed라는 주장을 만들지 않습니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
