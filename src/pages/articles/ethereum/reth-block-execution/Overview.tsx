import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import RethStateFlowViz from "../reth-state-flow-viz";

export default function Overview({
  onCodeRef: _,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Block execution은 transaction 목록을 parent state에서 하나의
        post-state로 접는 결정적 전이다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Block 101을 실행한다는 말은 transaction을 각각 독립적으로 돌린다는
          뜻이 아닙니다. Parent block 100의 state에서 시작해 transaction 0의
          변경을 transaction 1이 보고, fork별 system operation까지 끝낸 결과가
          header의 gas used·receipts root·state root와 같아야 합니다.
        </p>
        <p>
          이 글은 두 transaction이 있는 block 101을 고정해{" "}
          <strong>
            parent snapshot→fork-aware EVM env→ordered transactions→receipts and
            bundle→root postconditions
          </strong>
          를 추적합니다. Trie commitment는{" "}
          <Link to="/blockchain/reth-trie">Reth Trie</Link>, chain activation은{" "}
          <Link to="/blockchain/reth-chainspec">ChainSpec</Link> 정본을
          재사용합니다.
        </p>
      </div>
      <ContentBoundary article="reth-block-execution" />
      <RethStateFlowViz mode="execution" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>세 가지 identity를 먼저 고정합니다</h3>
        <p>
          Input receipt에는 block hash/number, parent hash와 pre-state root,
          chain-spec digest와 active fork를 넣습니다. Parent state가 다른데
          block bytes만 같거나, 같은 block에서 다른 fork rule을 고르면
          deterministic EVM이라도 서로 다른 결과가 나옵니다.
        </p>
        <h3>Execute 성공과 block acceptance는 다릅니다</h3>
        <p>
          개별 transaction call이 return했다고 끝나지 않습니다. 모든 transaction
          receipt와 cumulative gas, logs bloom, withdrawals/system change, final
          state commitment가 header와 일치해야 합니다. Candidate bundle은 이
          postcondition을 통과하기 전 canonical state로 publish하지 않습니다.
        </p>
      </div>
      <div id="paper-yellowpaper-transition" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum Yellow Paper — Shanghai version"
          href="https://github.com/ethereum/yellowpaper/blob/efc5f9a1f356cba376c978eedb63cb0363c2aa85/Paper.tex"
          citeKey={1}
        >
          World-state와 transaction transition의 형식적 출발점입니다. Yellow
          Paper snapshot은 Shanghai까지만 반영하므로 Cancun 이후 규칙은 아래
          EELS snapshot으로 보완합니다.
        </CitationBlock>
      </div>
      <div id="paper-eels-block-transition" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum Execution Layer Specifications — pinned snapshot"
          href="https://github.com/ethereum/execution-specs/tree/56e8617b619c0ab22284b140b49cc5501e5e6227"
          citeKey={2}
        >
          Fork별 executable block transition과 official fixture의 protocol
          근거입니다. Reth의 trait 이름·bundle layout·성능을 규정하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-reth-evm-source" className="scroll-mt-24">
        <CitationBlock
          source="Reth v2.2.0 — EVM source"
          href="https://github.com/paradigmxyz/reth/tree/v2.2.0/crates/evm"
          citeKey={3}
          type="code"
        >
          Reth v2.2.0의 executor·EVM configuration·execution result type을
          확인하는 source snapshot입니다. 이 글의 fault-injection release gate는
          별도 운영 hardening 계약입니다.
        </CitationBlock>
      </div>
    </section>
  );
}
